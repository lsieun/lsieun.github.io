---
title: "ContextManager"
sequence: "106"
---

## ContextManager

```java
public class ContextManager implements BootService {
    private static ThreadLocal<AbstractTracerContext> CONTEXT = new ThreadLocal<>();
    private static ThreadLocal<RuntimeContext> RUNTIME_CONTEXT = new ThreadLocal<>();
}
```

- ContextManager 适配器
    - AbstractTracerContext 视角
        - 用于适配 AbstractTracerContext 以创建具体实现的实例
        - 代理了 AbstractTracerContext 的一些主要方法
    - RuntimeContext
        - 与 TracingContext 生命周期一致
        - 有时候，需要记录一些额外的信息，那么就记录在 RuntimeContext
    - ContextManagerExtendService
        - ContextManager 调用 ContextManagerExtendService，用于创建 AbstractTracerContext 的具体实例

### BootService

```java
public class ContextManager implements BootService {
    @Override
    public void prepare() {

    }

    @Override
    public void boot() {
    }

    @Override
    public void onComplete() {

    }

    @Override
    public void shutdown() {

    }
}
```

### TraceContext 创建

```java
public class ContextManager implements BootService {
    private static ThreadLocal<AbstractTracerContext> CONTEXT = new ThreadLocal<>();
    private static ContextManagerExtendService EXTEND_SERVICE;


    private static AbstractTracerContext getOrCreate(String operationName, boolean forceSampling) {
        // 第 1 步，获取 context
        AbstractTracerContext context = CONTEXT.get();

        // 第 2 步，如果不存在，就创建一个
        if (context == null) {
            // 第 2.1 步，创建
            if (StringUtil.isEmpty(operationName)) {
                if (LOGGER.isDebugEnable()) {
                    LOGGER.debug("No operation name, ignore this trace.");
                }
                // 创建 IgnoredTracerContext
                context = new IgnoredTracerContext();
            } else {
                if (EXTEND_SERVICE == null) {
                    EXTEND_SERVICE = ServiceManager.INSTANCE.findService(ContextManagerExtendService.class);
                }
                // 交给 ContextManagerExtendService 创建
                context = EXTEND_SERVICE.createTraceContext(operationName, forceSampling);
            }

            // 第 2.2 步，设置 context
            CONTEXT.set(context);
        }
        return context;
    }

    private static AbstractTracerContext get() {
        return CONTEXT.get();
    }
}
```

### TraceContext 代理

```java
public class ContextManager implements BootService {
    private static final String EMPTY_TRACE_CONTEXT_ID = "N/A";

    public static String getGlobalTraceId() {
        AbstractTracerContext context = CONTEXT.get();
        return Objects.nonNull(context) ? context.getReadablePrimaryTraceId() : EMPTY_TRACE_CONTEXT_ID;
    }

    public static String getSegmentId() {
        AbstractTracerContext context = CONTEXT.get();
        return Objects.nonNull(context) ? context.getSegmentId() : EMPTY_TRACE_CONTEXT_ID;
    }

    public static int getSpanId() {
        AbstractTracerContext context = CONTEXT.get();
        return Objects.nonNull(context) ? context.getSpanId() : -1;
    }
    
    public static String getPrimaryEndpointName() {
        AbstractTracerContext context = CONTEXT.get();
        return Objects.nonNull(context) ? context.getPrimaryEndpointName() : null;
    }

    public static AbstractSpan createEntrySpan(String operationName, ContextCarrier carrier) {
        // 思路：context --> span
        AbstractSpan span;
        AbstractTracerContext context;
        
        // A. operationName 规范化
        operationName = StringUtil.cut(operationName, OPERATION_NAME_THRESHOLD);
        
        if (carrier != null && carrier.isValid()) {
            SamplingService samplingService = ServiceManager.INSTANCE.findService(SamplingService.class);
            samplingService.forceSampled();

            // B. 获取 context
            // 一定要强制采样；否则，链路就可能会断开
            context = getOrCreate(operationName, true);
            
            // C. 创建 span
            span = context.createEntrySpan(operationName);
            
            // D. 接收 carrier 数据
            context.extract(carrier);
        } else {
            // B. 获取 context
            // 不需要强制采样，根据采样率来决定当前链路是否要采样
            context = getOrCreate(operationName, false);
            
            // C. 创建 span
            span = context.createEntrySpan(operationName);
        }
        return span;
    }

    public static AbstractSpan createLocalSpan(String operationName) {
        operationName = StringUtil.cut(operationName, OPERATION_NAME_THRESHOLD);
        AbstractTracerContext context = getOrCreate(operationName, false);
        return context.createLocalSpan(operationName);
    }

    // 这个 createExitSpan 带有 carrier 参数，是为了向下一个 segment 进行传递
    public static AbstractSpan createExitSpan(String operationName, ContextCarrier carrier, String remotePeer) {
        // A. 检查 carrier
        if (carrier == null) {
            throw new IllegalArgumentException("ContextCarrier can't be null.");
        }
        
        // B. operationName 名称规范化
        operationName = StringUtil.cut(operationName, OPERATION_NAME_THRESHOLD);
        
        // C. 获取 context
        AbstractTracerContext context = getOrCreate(operationName, false);
        
        // D. 创建 span
        AbstractSpan span = context.createExitSpan(operationName, remotePeer);
        
        // E. 向 carrier 注入数据
        context.inject(carrier);
        return span;
    }

    // 这个 createExitSpan 不带有 carrier 参数，是表示不向后传递了。
    // 例如，第三方写的中间件，它不支持链路追踪，传递“链路数据”过去，也用不起来。
    public static AbstractSpan createExitSpan(String operationName, String remotePeer) {
        // A. 对 operationName 进行规范化
        operationName = StringUtil.cut(operationName, OPERATION_NAME_THRESHOLD);
        
        // B. 获取 context
        AbstractTracerContext context = getOrCreate(operationName, false);
        
        // C. 创建 exit span
        return context.createExitSpan(operationName, remotePeer);
    }

    public static AbstractSpan activeSpan() {
        return get().activeSpan();
    }

    public static void stopSpan() {
        final AbstractTracerContext context = get();
        stopSpan(context.activeSpan(), context);
    }

    public static void stopSpan(AbstractSpan span) {
        stopSpan(span, get());
    }

    private static void stopSpan(AbstractSpan span, final AbstractTracerContext context) {
        if (context.stopSpan(span)) {
            CONTEXT.remove();
            RUNTIME_CONTEXT.remove();
        }
    }
}
```

```java
public class Config {
    public static class Agent {
        public static int OPERATION_NAME_THRESHOLD = 150;
    }
}
```

## RuntimeContext

`TracingContext` 有时候需要记录一些额外的信息，那么就记录在 `RuntimeContext`。

```java
public class RuntimeContext {
    private final ThreadLocal<RuntimeContext> contextThreadLocal;
    private Map<Object, Object> context = new ConcurrentHashMap<>(0);

    public RuntimeContext(ThreadLocal<RuntimeContext> contextThreadLocal) {
        this.contextThreadLocal = contextThreadLocal;
    }

    public void put(Object key, Object value) {
        context.put(key, value);
    }

    public Object get(Object key) {
        return context.get(key);
    }

    @SuppressWarnings("unchecked")
    public <T> T get(Object key, Class<T> type) {
        return (T) context.get(key);
    }

    public void remove(Object key) {
        context.remove(key);

        if (context.isEmpty()) {
            contextThreadLocal.remove();
        }
    }
}
```

## ContextManagerExtendService

### BootService

```java

@DefaultImplementor
public class ContextManagerExtendService implements BootService, GRPCChannelListener {
    private volatile String[] ignoreSuffixArray = new String[0];

    @Override
    public void prepare() {
        ServiceManager.INSTANCE.findService(GRPCChannelManager.class).addChannelListener(this);
    }

    @Override
    public void boot() {
        ignoreSuffixArray = Config.Agent.IGNORE_SUFFIX.split(",");
        ignoreSuffixPatternsWatcher = new IgnoreSuffixPatternsWatcher("agent.ignore_suffix", this);
        spanLimitWatcher = new SpanLimitWatcher("agent.span_limit_per_segment");

        ConfigurationDiscoveryService configurationDiscoveryService = ServiceManager.INSTANCE.findService(
                ConfigurationDiscoveryService.class);
        configurationDiscoveryService.registerAgentConfigChangeWatcher(spanLimitWatcher);
        configurationDiscoveryService.registerAgentConfigChangeWatcher(ignoreSuffixPatternsWatcher);

        handleIgnoreSuffixPatternsChanged();
    }

    @Override
    public void onComplete() {

    }

    @Override
    public void shutdown() {

    }
}
```

```java
public class Config {
    public static class Agent {
        public static String IGNORE_SUFFIX = ".jpg,.jpeg,.js,.css,.png,.bmp,.gif,.ico,.mp3,.mp4,.html,.svg";
    }
}
```

### createTraceContext

```java

@DefaultImplementor
public class ContextManagerExtendService implements BootService, GRPCChannelListener {

    // 创建两个类型的对象：IgnoredTracerContext 和 TracingContext
    public AbstractTracerContext createTraceContext(String operationName, boolean forceSampling) {
        AbstractTracerContext context;
        /*
         * Don't trace anything if the backend is not available.
         */
        if (!Config.Agent.KEEP_TRACING && GRPCChannelStatus.DISCONNECT.equals(status)) {
            return new IgnoredTracerContext();
        }

        int suffixIdx = operationName.lastIndexOf(".");
        if (suffixIdx > -1 && Arrays.stream(ignoreSuffixArray)
                .anyMatch(a -> a.equals(operationName.substring(suffixIdx)))) {
            context = new IgnoredTracerContext();
        } else {
            SamplingService samplingService = ServiceManager.INSTANCE.findService(SamplingService.class);
            if (forceSampling || samplingService.trySampling(operationName)) {
                context = new TracingContext(operationName, spanLimitWatcher);
            } else {
                context = new IgnoredTracerContext();
            }
        }

        return context;
    }
}
```
