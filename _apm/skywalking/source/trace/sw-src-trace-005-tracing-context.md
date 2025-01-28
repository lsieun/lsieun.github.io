---
title: "TracingContext"
sequence: "105"
---

![](/assets/images/skywalking/source/sw-src-tracing-context-hierarchy-classes.png)

## AbstractTracerContext

- project: `apm-sniffer/apm-agent-core`
- package: `org.apache.skywalking.apm.agent.core.context`

### Trace + Segment + Span

```java
public interface AbstractTracerContext {
    // trace/segment/span
    String getReadablePrimaryTraceId();

    String getSegmentId();

    int getSpanId();

    AbstractSpan activeSpan();
    
    String getPrimaryEndpointName();
}
```

### CorrelationContext

```java
public interface AbstractTracerContext {
    CorrelationContext getCorrelationContext();
}
```

```java
public class CorrelationContext {
    private static final List<String> AUTO_TAG_KEYS;

    static {
        if (StringUtil.isNotEmpty(Config.Correlation.AUTO_TAG_KEYS)) {
            AUTO_TAG_KEYS = Arrays.asList(Config.Correlation.AUTO_TAG_KEYS.split(","));
        } else {
            AUTO_TAG_KEYS = new ArrayList<>();
        }
    }
    
    private final Map<String, String> data;
    
    public CorrelationContext() {
        this.data = new ConcurrentHashMap<>(Config.Correlation.ELEMENT_MAX_NUMBER);
    }
}
```

### Span Operation

```java
public interface AbstractTracerContext {
    // create span
    AbstractSpan createEntrySpan(String operationName);

    AbstractSpan createLocalSpan(String operationName);

    AbstractSpan createExitSpan(String operationName, String remotePeer);

    // stop span
    boolean stopSpan(AbstractSpan span);
}
```

### Carrier + Snapshot

```java
public interface AbstractTracerContext {
    // ContextCarrier
    void inject(ContextCarrier carrier);

    void extract(ContextCarrier carrier);

    // ContextSnapshot
    ContextSnapshot capture();

    void continued(ContextSnapshot snapshot);
}
```

### Async

```java
public interface AbstractTracerContext {
    AbstractTracerContext awaitFinishAsync();

    void asyncStop(AsyncSpan span);
}
```

## TracingContext

- project: `apm-sniffer/apm-agent-core`
- package: `org.apache.skywalking.apm.agent.core.context`

### Fields

```java
public class TracingContext implements AbstractTracerContext {
    // The final TraceSegment, which includes all finished spans.
    private TraceSegment segment;

    private LinkedList<AbstractSpan> activeSpanStack = new LinkedList<>();
    private AbstractSpan firstSpan = null;

    private int spanIdGenerator;

    private volatile boolean running;
}
```

### Trace + Segment + Span

```java
public class TracingContext implements AbstractTracerContext {
    @Override
    public String getReadablePrimaryTraceId() {
        return getPrimaryTraceId().getId();
    }

    private DistributedTraceId getPrimaryTraceId() {
        return segment.getRelatedGlobalTrace();
    }

    @Override
    public String getSegmentId() {
        return segment.getTraceSegmentId();
    }

    @Override
    public int getSpanId() {
        return activeSpan().getSpanId();
    }

    @Override
    public AbstractSpan activeSpan() {
        AbstractSpan span = peek();
        if (span == null) {
            throw new IllegalStateException("No active span.");
        }
        return span;
    }
}
```

### Stack

```java
public class TracingContext implements AbstractTracerContext {
    // The final TraceSegment, which includes all finished spans.
    private TraceSegment segment;

    private LinkedList<AbstractSpan> activeSpanStack = new LinkedList<>();
    private AbstractSpan firstSpan = null;

    private AbstractSpan push(AbstractSpan span) {
        if (firstSpan == null) {
            firstSpan = span;
        }
        activeSpanStack.addLast(span);
        this.extensionContext.handle(span);
        return span;
    }

    private AbstractSpan pop() {
        return activeSpanStack.removeLast();
    }

    private AbstractSpan peek() {
        if (activeSpanStack.isEmpty()) {
            return null;
        }
        return activeSpanStack.getLast();
    }

    private AbstractSpan first() {
        return firstSpan;
    }
}
```

### LimitMechanism

```java
public class TracingContext implements AbstractTracerContext {
    private long lastWarningTimestamp = 0;
    
    private int spanIdGenerator;

    private final SpanLimitWatcher spanLimitWatcher;
    
    private boolean isLimitMechanismWorking() {
        // A. 判断 spanIdGenerator 是否超出了限制
        if (spanIdGenerator >= spanLimitWatcher.getSpanLimit()) {
          
            // B. 获取当前时间
            long currentTimeMillis = System.currentTimeMillis();
          
            // C. 判断 当前时间 与 上一次日志记录时间 是否超过 30 秒，避免打印日志太频繁
            if (currentTimeMillis - lastWarningTimestamp > 30 * 1000) {
                LOGGER.warn(
                    new RuntimeException("Shadow tracing context. Thread dump"),
                    "More than {} spans required to create", spanLimitWatcher.getSpanLimit()
                );
                
                // D. 打印日志后，更新 lastWarningTimestamp 为当前时间
                lastWarningTimestamp = currentTimeMillis;
            }
            return true;
        } else {
            return false;
        }
    }
}
```

### Span: CreateXxxSpan

```java
public class TracingContext implements AbstractTracerContext {
    @Override
    public AbstractSpan createEntrySpan(final String operationName) {
        // A. 检查 LimitMechanism 是否生效
        if (isLimitMechanismWorking()) {
            NoopSpan span = new NoopSpan();
            return push(span);
        }

        // B. segment 层面：TracingContext
        TracingContext owner = this;

        // C. span 层面：父 span
        final AbstractSpan parentSpan = peek();
        final int parentSpanId = parentSpan == null ? -1 : parentSpan.getSpanId();

        // D. span 层面：当前 span
        AbstractSpan entrySpan;
        if (parentSpan != null && parentSpan.isEntry()) {
            /*
             * Only add the profiling recheck on creating entry span,
             * as the operation name could be overrided.
             */
            profilingRecheck(parentSpan, operationName);

            // D1. 重复使用 parentSpan
            parentSpan.setOperationName(operationName);
            entrySpan = parentSpan;

            // D2. 调用 start() 方法
            return entrySpan.start();
        } else {
            // D1. 新建 EntrySpan
            entrySpan = new EntrySpan(
                    spanIdGenerator++, parentSpanId,
                    operationName, owner
            );

            // D2. 调用 start() 方法
            entrySpan.start();

            // D3. 加入 stack
            return push(entrySpan);
        }
    }

    @Override
    public AbstractSpan createLocalSpan(final String operationName) {
        // A. 检查 LimitMechanism 是否生效
        if (isLimitMechanismWorking()) {
            NoopSpan span = new NoopSpan();
            return push(span);
        }

        // B. span 层面：父 span
        AbstractSpan parentSpan = peek();
        final int parentSpanId = parentSpan == null ? -1 : parentSpan.getSpanId();

        // C. span 层面：当前 span
        AbstractTracingSpan span = new LocalSpan(spanIdGenerator++, parentSpanId, operationName, this);
      
        // D. 调用 start() 方法
        span.start();

        return push(span);
    }

    @Override
    public AbstractSpan createExitSpan(final String operationName, String remotePeer) {
        // A. 检查 LimitMechanism 是否生效
        if (isLimitMechanismWorking()) {
            NoopExitSpan span = new NoopExitSpan(remotePeer);
            return push(span);
        }

        // B. segment 层面：TracingContext
        TracingContext owner = this;

        // C. span 层面：父 span
        AbstractSpan parentSpan = peek();

        // D. span 层面：当前 span
        AbstractSpan exitSpan;
        if (parentSpan != null && parentSpan.isExit()) {
            // D1. 重复利用已有的 Span
            exitSpan = parentSpan;
        } else {
            // Since 8.10.0
            remotePeer = StringUtil.isEmpty(CLUSTER) ? remotePeer : CLUSTER + "/" + remotePeer;
            final int parentSpanId = parentSpan == null ? -1 : parentSpan.getSpanId();

            // D2. 创建新的 ExitSpan
            exitSpan = new ExitSpan(spanIdGenerator++, parentSpanId, operationName, remotePeer, owner);
            push(exitSpan);
        }

        // E. span 层面：调用 start() 方法
        exitSpan.start();

        return exitSpan;
    }
}
```

### Span: StopSpan

- `AbstractTracingSpan` 有 `start()` 和 `finish()` 方法。
- `TracingContext` 如何与 `AbstractTracingSpan` 的两个方法进行交互呢？
    - `createXxxSpan()` 方法会调用 `AbstractTracingSpan.start()` 方法；
    - `stopSpan()` 方法会调用 `AbstractTracingSpan.finish()` 方法。

```java
public class TracingContext implements AbstractTracerContext {
    private TraceSegment segment;


    @Override
    public boolean stopSpan(AbstractSpan span) {
        // A. 获取栈顶的 Span
        AbstractSpan lastSpan = peek();

        // B. 如果传入的 span 就是 栈顶的那个，就进行出栈
        if (lastSpan == span) {
            if (lastSpan instanceof AbstractTracingSpan) {
                // 如果是用于追踪的 Span，就需要调用一下 finish 方法，再进行 pop 操作
                AbstractTracingSpan toFinishSpan = (AbstractTracingSpan) lastSpan;

                if (toFinishSpan.finish(segment)) {
                    pop();
                }
            } else {
                // 如果不是用于追踪的 Span，则直接 pop
                pop();
            }
        } else {
            throw new IllegalStateException("Stopping the unexpected span = " + span);
        }

        // C. 
        finish();

        return activeSpanStack.isEmpty();
    }

    private void finish() {
        // A. 加锁
        if (isRunningInAsyncMode) {
            asyncFinishLock.lock();
        }
        
        try {
            // B1. 栈为空，且在运行状态
            boolean isFinishedInMainThread = activeSpanStack.isEmpty() && running;
          
            // B2. 通知
            if (isFinishedInMainThread) {
                /*
                 * Notify after tracing finished in the main thread.
                 */
                TracingThreadListenerManager.notifyFinish(this);
            }

            // B3. 结束 segment
            if (isFinishedInMainThread && (!isRunningInAsyncMode || asyncSpanCounter == 0)) {

                TraceSegment finishedSegment = segment.finish(isLimitMechanismWorking());
                TracingContext.ListenerManager.notifyFinish(finishedSegment);

                running = false;
            }
        } finally {
            // C. 解锁
            if (isRunningInAsyncMode) {
                asyncFinishLock.unlock();
            }
        }
    }
}
```

### Carrier + Snapshot

```java
public class TracingContext implements AbstractTracerContext {
    @Override
    public void inject(ContextCarrier carrier) {
        this.inject(this.activeSpan(), carrier);
    }
    
    public void inject(AbstractSpan exitSpan, ContextCarrier carrier) {
        // A. 检查是否为 ExitSpan
        if (!exitSpan.isExit()) {
            throw new IllegalStateException("Inject can be done only in Exit Span");
        }

        // B. 转换类型
        ExitTypeSpan spanWithPeer = (ExitTypeSpan) exitSpan;
        String peer = spanWithPeer.getPeer();
      
        // C. 对 peer 进行判断
        if (StringUtil.isEmpty(peer)) {
            throw new IllegalStateException("Exit span doesn't include meaningful peer information.");
        }

        // D. 为 carrier 设置值
        carrier.setTraceId(getReadablePrimaryTraceId());
        carrier.setTraceSegmentId(this.segment.getTraceSegmentId());
        carrier.setSpanId(exitSpan.getSpanId());

        carrier.setParentService(Config.Agent.SERVICE_NAME);
        carrier.setParentServiceInstance(Config.Agent.INSTANCE_NAME);
        carrier.setParentEndpoint(primaryEndpoint.getName());
        carrier.setAddressUsedAtClient(peer);

        // E. 相关注入
        this.correlationContext.inject(carrier);
        this.extensionContext.inject(carrier);
    }
    
    @Override
    public void extract(ContextCarrier carrier) {
        // A. 将 carrier 转换成 ref
        TraceSegmentRef ref = new TraceSegmentRef(carrier);
      
        // B. 设置当前 segment 的 trace id 和  ref
        this.segment.relatedGlobalTrace(new PropagatedTraceId(carrier.getTraceId()));
        this.segment.ref(ref);
        
        // C. 设置当前 span 的 ref
        AbstractSpan span = this.activeSpan();
        if (span instanceof EntrySpan) {
            span.ref(ref);
        }

        // D. 设置其它信息
        carrier.extractExtensionTo(this);
        carrier.extractCorrelationTo(this);
    }
    
    @Override
    public ContextSnapshot capture() {
        ContextSnapshot snapshot = new ContextSnapshot(
            segment.getTraceSegmentId(),
            activeSpan().getSpanId(),
            getPrimaryTraceId(),
            primaryEndpoint.getName(),
            this.correlationContext,
            this.extensionContext,
            this.profileStatus
        );

        return snapshot;
    }
    
    @Override
    public void continued(ContextSnapshot snapshot) {
        if (snapshot.isValid()) {
            TraceSegmentRef segmentRef = new TraceSegmentRef(snapshot);
            this.segment.ref(segmentRef);
            this.activeSpan().ref(segmentRef);
            this.segment.relatedGlobalTrace(snapshot.getTraceId());
            this.correlationContext.continued(snapshot);
            this.extensionContext.continued(snapshot);
            this.extensionContext.handle(this.activeSpan());
            if (this.profileStatus.continued(snapshot)) {
                PROFILE_TASK_EXECUTION_SERVICE.continueProfiling(this, this.segment.getTraceSegmentId());
            }
        }
    }
}
```

## ContextCarrier

```java

@Setter(AccessLevel.PACKAGE)
public class ContextCarrier implements Serializable {
    private String traceId;
    private String traceSegmentId;
    private int spanId = -1;

    private String parentService = Constants.EMPTY_STRING;
    private String parentServiceInstance = Constants.EMPTY_STRING;
    // The endpoint(entrance URI/method signature) of the parent service.
    private String parentEndpoint;

    // The network address(ip:port, hostname:port) used in the parent service to access the current service.
    private String addressUsedAtClient;

    private CorrelationContext correlationContext = new CorrelationContext();

    public CarrierItem items() {
        SW8ExtensionCarrierItem sw8ExtensionCarrierItem = new SW8ExtensionCarrierItem(extensionContext, null);
        SW8CorrelationCarrierItem sw8CorrelationCarrierItem = new SW8CorrelationCarrierItem(
                correlationContext, sw8ExtensionCarrierItem);
        SW8CarrierItem sw8CarrierItem = new SW8CarrierItem(this, sw8CorrelationCarrierItem);
        return new CarrierItemHead(sw8CarrierItem);
    }
}
```

### CorrelationContext

```java
public class CorrelationContext {
    private final Map<String, String> data;

    public CorrelationContext() {
        this.data = new HashMap<>(Config.Correlation.ELEMENT_MAX_NUMBER);
    }
}
```

### CarrierItem

```java
public class CarrierItem implements Iterator<CarrierItem> {
    private String headKey;
    private String headValue;
    private CarrierItem next;

    public CarrierItem(String headKey, String headValue) {
        this(headKey, headValue, null);
    }

    public CarrierItem(String headKey, String headValue, CarrierItem next) {
        if (StringUtil.isEmpty(Config.Agent.NAMESPACE)) {
            this.headKey = headKey;
        } else {
            this.headKey = Config.Agent.NAMESPACE + "-" + headKey;
        }
        this.headValue = headValue;
        this.next = next;
    }
}
```

### SW8CarrierItem

```java
public class SW8CarrierItem extends CarrierItem {
    public static final String HEADER_NAME = "sw8";
    private ContextCarrier carrier;

    public SW8CarrierItem(ContextCarrier carrier, CarrierItem next) {
        super(HEADER_NAME, carrier.serialize(ContextCarrier.HeaderVersion.v3), next);
        this.carrier = carrier;
    }

    @Override
    public void setHeadValue(String headValue) {
        carrier.deserialize(headValue, ContextCarrier.HeaderVersion.v3);
    }
}
```

### CarrierItemHead

```java
public class CarrierItemHead extends CarrierItem {
    public CarrierItemHead(CarrierItem next) {
        super("", "", next);
    }
}
```

## ContextSnapshot

```java
public class ContextSnapshot {
    // trace/segment/span
    private DistributedTraceId traceId;
    private String traceSegmentId;
    private int spanId;

    // parent
    private String parentEndpoint;

    private CorrelationContext correlationContext;
    private ExtensionContext extensionContext;
}
```

## IgnoredTracerContext

```java
public class IgnoredTracerContext implements AbstractTracerContext {
    private static final NoopSpan NOOP_SPAN = new NoopSpan();
    private static final String IGNORE_TRACE = "Ignored_Trace";

    private final CorrelationContext correlationContext;
    private final ExtensionContext extensionContext;

    private int stackDepth;

    public IgnoredTracerContext() {
        this.stackDepth = 0;
        this.correlationContext = new CorrelationContext();
        this.extensionContext = new ExtensionContext();
    }

    @Override
    public String getReadablePrimaryTraceId() {
        return IGNORE_TRACE;
    }

    @Override
    public String getSegmentId() {
        return IGNORE_TRACE;
    }

    @Override
    public int getSpanId() {
        return -1;
    }

    @Override
    public AbstractSpan createEntrySpan(String operationName) {
        stackDepth++;
        return NOOP_SPAN;
    }

    @Override
    public AbstractSpan createLocalSpan(String operationName) {
        stackDepth++;
        return NOOP_SPAN;
    }

    @Override
    public AbstractSpan createExitSpan(String operationName, String remotePeer) {
        stackDepth++;
        return NOOP_SPAN;
    }

    @Override
    public AbstractSpan activeSpan() {
        return NOOP_SPAN;
    }

    @Override
    public boolean stopSpan(AbstractSpan span) {
        stackDepth--;
        if (stackDepth == 0) {
            ListenerManager.notifyFinish(this);
        }
        return stackDepth == 0;
    }
}
```

