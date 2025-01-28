---
title: "SkyWalking Java API"
sequence: "102"
---

## apm-agent-core

```text
                                  ┌─── ContextManager
                                  │
                                  │                                   ┌─── ContextCarrier  (Process)
                                  ├─── TracingContext ───┼─── data ───┤
apm-agent-core ───┼─── context ───┤                                   └─── ContextSnapshot (Thread)
                                  │
                                  │                      ┌─── TraceSegment
                                  │                      │
                                  │                      ├─── EntrySpan
                                  └─── trace ────────────┤
                                                         ├─── ExitSpan
                                                         │
                                                         └─── LocalSpan
```

## Span

Span 是分布式追踪系统中一个非常重要的概念，是 trace 数据的最小粒度、基本单元，可以理解为一次方法的调用、一个程序块的调用、数据库访问。
用于记录调用的发生时间、结束时间、调用深度(当深度为 0 时 trace 上下文可以回收)、调用日志(发生异常时可以记录日志)、操作名、span 类型等。

在 SkyWalking 中对 Span 粗略分为：LocalSpan 和 RemoteSpan。

LocalSpan 是一次本地的调用或者记录跨线程后的执行情况，与跨进程无关。

RemoteSpan 是一次远程调用，可细分为：EntrySpan、ExitSpan。

EntrySpan：代表一个应用服务的提供端或者服务端的入口端，如接口入口、MQ 消费端入口。在涉及到跨进程、跨线程时会和 ContextCarrier、ContextSnapshot 配合使用。

ExitSpan：代表一个应用服务的客户端或者消息队列的生产者，如 接口请求响应、MQ 生产端请求响应。在涉及到跨进程、跨线程时会和 ContextCarrier、ContextSnapshot 配合使用。


三种类型的 Span：

- EntrySpan
- LocalSpan
- ExitSpan

```text
                                                                                            ┌─── EntrySpan
                                                              ┌─── StackBasedTracingSpan ───┤
AsyncSpan ───┼─── AbstractSpan ───┼─── AbstractTracingSpan ───┤                             └─── ExitSpan
                                                              │
                                                              └─── LocalSpan
```

```java
public class ContextManager implements BootService {
    // EntrySpan 属于 RemoteSpan，因此需要 ContextCarrier，用于不同 Process 之间的 trace 数据传递
    public static AbstractSpan createEntrySpan(String operationName, ContextCarrier carrier) {
        // ...
    }

    public static AbstractSpan createLocalSpan(String operationName) {
        // ...
    }

    // ExitSpan 属于 RemoteSpan，因此需要 ContextCarrier，用于不同 Process 之间的 trace 数据传递
    public static AbstractSpan createExitSpan(String operationName, ContextCarrier carrier, String remotePeer) {
        // ...
    }
}
```

### AbstractSpan

除了 operation name、tags、logs 还有两个属性需要设置，即 component 和 layer

```java
/**
 * The <code>AbstractSpan</code> represents the span's skeleton, which contains all open methods.
 */
public interface AbstractSpan extends AsyncSpan {
    int getSpanId();
    
    String getOperationName();
    AbstractSpan setOperationName(String operationName);

    AbstractSpan tag(AbstractTag<?> tag, String value);

    AbstractSpan log(Throwable t);

    AbstractSpan log(long timestamp, Map<String, ?> event);
    
    /**
     * Set the component id, which defines in {@link ComponentsDefine}
     *
     * @return the span for chaining.
     */
    AbstractSpan setComponent(Component component);

    AbstractSpan setLayer(SpanLayer layer);
}
```

### SpanLayer

```java
public enum SpanLayer {
    DB(1), RPC_FRAMEWORK(2), HTTP(3), MQ(4), CACHE(5);

    private int code;

    SpanLayer(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    public static void asDB(AbstractSpan span) {
        span.setLayer(SpanLayer.DB);
    }

    public static void asCache(AbstractSpan span) {
        span.setLayer(SpanLayer.CACHE);
    }

    public static void asRPCFramework(AbstractSpan span) {
        span.setLayer(SpanLayer.RPC_FRAMEWORK);
    }

    public static void asHttp(AbstractSpan span) {
        span.setLayer(SpanLayer.HTTP);
    }

    public static void asMQ(AbstractSpan span) {
        span.setLayer(SpanLayer.MQ);
    }
}
```

### Component

```java
/**
 * The <code>Component</code> represents component library, which has been supported by skywalking sniffer.
 * 
 * The supported list is in {@link ComponentsDefine}.
 */
public interface Component {
    int getId();

    String getName();
}
```

### OfficialComponent

```java
public class OfficialComponent implements Component {
    private int id;
    private String name;

    public OfficialComponent(int id, String name) {
        this.id = id;
        this.name = name;
    }

    @Override
    public int getId() {
        return id;
    }

    @Override
    public String getName() {
        return name;
    }
}
```

### ComponentsDefine

```java
/**
 * The supported list of skywalking java sniffer.
 */
public class ComponentsDefine {

    public static final OfficialComponent TOMCAT = new OfficialComponent(1, "Tomcat");

    public static final OfficialComponent HTTPCLIENT = new OfficialComponent(2, "HttpClient");

    public static final OfficialComponent DUBBO = new OfficialComponent(3, "Dubbo");

    public static final OfficialComponent MOTAN = new OfficialComponent(8, "Motan");

    public static final OfficialComponent RESIN = new OfficialComponent(10, "Resin");

    public static final OfficialComponent FEIGN = new OfficialComponent(11, "Feign");
    
    // ...
}
```

## TraceSegment

- distributed trace 跨越多个进程、多个线程（the distributed trace crosses multi-processes, multi-threads）
- trace 是由 TraceSegment 组成 （TraceSegment is a fragment of the distributed trace.）
- TraceSegment 是在线程的范围内 （A TraceSegment means the segment, which exists in current Thread.）

```java
/**
 * {@link TraceSegment} is a segment or fragment of the distributed trace.
 * A {@link TraceSegment} means the segment, which exists in current {@link Thread}.
 * And the distributed trace is formed by multi {@link TraceSegment}s,
 * because the distributed trace crosses multi-processes, multi-threads. <p>
 */
public class TraceSegment {
    /**
     * The id of this trace segment. Every segment has its unique-global-id.
     */
    private String traceSegmentId;

    private TraceSegmentRef ref;

    private List<AbstractTracingSpan> spans;

    private DistributedTraceId relatedGlobalTraceId;

    private boolean ignore = false;
    private boolean isSizeLimited = false;
    private final long createTime;
    // ...
}
```

TraceSegment 是 SkyWalking 中特有的概念。指的是 一个请求在一个进程中的所有 span 的集合，这些 span 具有相同的 segmentId。
为什么 SkyWalking 中会有这么一个特殊的概念？这是为了把 span 按照 ` 请求 + 进程 ` 进行分解，这样有利于 OAP 进行数据的聚合、分析。

在 Trace Segment 中会记录一些相关信息，如下：

- `traceSegmentId`：当前 Trace Segment 的唯一 ID(TraceSegmentId)。
- Refs：指向上一个 Trace Segment 的 TraceSegmentId 引用，通常情况下 Refs 是一个值，但是如果当前 Trace Segment 是批量 MQ 消费，那么 Refs 就是多个 TraceSegmentId。
- `spans`：用于存储从属于这个 Trace Segment 的所有 span 集合。
- `relatedGlobalTraceId`：指向上一个 Trace Segment 的 traceId 引用，通常情况下 relatedGlobalTraceId 是一个值，
  但是如果当前 Trace Segment 是批量 MQ 消费，那么 relatedGlobalTraceId 就是多个 TraceId。
- `ignore`：当前 Trace Segment 是否可以忽略，为 true 则可以不上传到 OAP
- `isSizeLimited`：当前 Trace Segment 的 span 集合的数量是否已经达到限制。默认 false，未达到限制。
- `createTime`：当前 Trace Segment 的创建时间。


## ContextCarrier

为了实现分布式的链路追踪，跨进程的追踪需要被绑定，上下文环境需要跨进程传播，这就是 `ContextCarrier` 的职责。

```java
/**
 * {@link ContextCarrier} is a data carrier of {@link TracingContext}.
 * It holds the snapshot (current state) of {@link TracingContext}.
 * <p>
 */
public class ContextCarrier implements Serializable {
    public CarrierItem items() {
    }
    
    // ...
}
```

```java
public class CarrierItem implements Iterator<CarrierItem> {
    // key + value
    private String headKey;
    private String headValue;
    
    // 链接到下一个
    private CarrierItem next;
}
```

### 如何使用

以下步骤是在一个 A->B 的分布式调用中，如何去使用 `ContextCarrier`：

- 在客户端创建一个空的 `ContextCarrier`。
- 通过 `ContextManager#createExitSpan` 方法创建一个新的 `ExitSpan` 或者使用 `ContextManager#inject` 去初始化 `ContextCarrier`。
- 将所有的 `ContextCarrier` 的信息放入到 head（Http head），attachments（Dubbo RPC 框架）或者 messages（Kafka）中。
- 通过服务调用，`ContextCarrier` 传播到服务端。
- 在服务端可以通过 heads/attachments/messages 获取到 `ContextCarrier` 的所有信息。
- `ContextManager#createEntrySpan` 方法会创建一个 `EntrySpan` 或者使用 `ContextManager#extract` 方法来将客户端和服务器绑定到一起。

让我们用 Apache HTTPComponent Client 端插件和 Tomcat7 server 插件来演示一下。

Apache HTTPComponent 客户端插件

```text
span = ContextManager.createExitSpan("/span/operation/name", contextCarrier, "ip:port");
CarrierItem next = contextCarrier.items();
while (next.hasNext()) {
    next = next.next();
    httpRequest.setHeader(next.getHeadKey(), next.getHeadValue());
}
```

Tomcat 7 服务端插件

```text
ContextCarrier contextCarrier = new ContextCarrier();
CarrierItem next = contextCarrier.items();
while (next.hasNext()) {
    next = next.next();
    next.setHeadValue(request.getHeader(next.getHeadKey()));
}

span = ContextManager.createEntrySpan(“/span/operation/name”, contextCarrier);
```

## ContextSnapshot（上下文快照）

除了跨进程，跨线程也需要得到支持，因为异步执行（内存中的 MQ）和批处理在 Java 中很常见。
跨进程和跨线程是相似的，因为它们都是关于传播上下文。唯一的区别是，**跨线程不需要序列化**。

该类主要用于处理 SkyWalking 在跨线程间的数据传递。如：主线程调用中执行了子线程逻辑，那么会发生如下的步骤：

- 1、调用子线程前会先执行 `ContextManager#capture` 用来创建一个 `ContextSnapshot`
- 2、子线程执行前会执行 `ContextManager#continued` 将父线程给的 `ContextSnapshot` 传入自己的 `TraceSegmentRef` 中。


这是跨线程传播的三个步骤：

1. 使用 `ContextManager#capture` 获取 `ContextSnapshot` 对象。
2. 让子线程通过方法参数或由现有参数携带的任何方式访问 `ContextSnapshot` 。
3. 在子线程中使用 `ContextManager#continued`。

```java
/**
 * The <code>ContextSnapshot</code> is a snapshot for current context.
 * The snapshot carries the info for building reference between two segments in two thread,
 * but have a causal relationship.
 */
public class ContextSnapshot {
    private DistributedTraceId traceId;
    private String traceSegmentId;
    private int spanId;
    private String parentEndpoint;

    private CorrelationContext correlationContext;
    private ExtensionContext extensionContext;
    private ProfileStatusContext profileStatusContext;
}
```

## TracingContext

```text
                         ┌─── TracingContext
AbstractTracerContext ───┤
                         └─── IgnoredTracerContext
```

```java
/**
 * The <code>TracingContext</code> represents a core tracing logic controller.
 * It builds the final {@link TracingContext}, by the stack mechanism, which is similar with the codes work.
 * 
 * In opentracing concept, it means, all spans in a segment tracing context(thread) are CHILD_OF relationship,
 * but no FOLLOW_OF.
 * 
 */
public class TracingContext implements AbstractTracerContext {
    // ...
}
```

## ContextManager

`ContextManager` 见名见意，该类用于管理上下文。下面直接以它内部的方法进行介绍。

- `getOrCreate`：用于获取或者创建一个上下文，是个私有方法，不能被外部调用。在 createEntrySpan、createLocalSpan、createExitSpan 中会使用来获取当前的上下文。
- `get`：用于获取当前上下文，是个私有方法，不能被外部调用，在 getOrCreate 方法中会调用来获取当前上下文，如果获取不到那么就会创建新的上下文。
- `getGlobalTraceId`：获取当前上下文的 traceId，是个 public 修饰的方法，可以被外部调用来获取当前 traceId。如果当前是 IgnoredTracerContext 上下文，那么没有真是的 traceId，返回的是“N/A”。
- `createEntrySpan`：创建一个进入的 span。
- `createLocalSpan`：创建一个 local 的 span。
- `createExitSpan`：创建一个退出的 span。
- `inject`：在跨进程前调用。
- `extract`：在跨进程后调用。
- `capture`：在跨线程前调用。
- `continued`：在跨线程的子线程内调用。
- `awaitFinishAsync`：等待子线程结束的回调。
- `activeSpan`：获取当前存活的 span。
- `stopSpan`：关闭 span。
- `isActive`：判断当前上下文是否存在。因为 span 深度为 0 后上下文会被回收。
- `getRuntimeContext`：获取正在运行的上下文
- `getCorrelationContext`：获取跨进程传递的数据。


```java
/**
 * {@link ContextManager} controls the whole context of {@link TraceSegment}.
 * Any {@link TraceSegment} relates to single-thread, so this context use {@link ThreadLocal} to maintain the context,
 * and make sure, since a {@link TraceSegment} starts, all ChildOf spans are in the same context.
 *
 * <p> Also, {@link ContextManager} delegates to all {@link AbstractTracerContext}'s major methods.
 */
public class ContextManager implements BootService {
    public static AbstractSpan createEntrySpan(String operationName, ContextCarrier carrier) {
        // ...
    }

    public static AbstractSpan createLocalSpan(String operationName) {
        // ...
    }
    
    public static AbstractSpan createExitSpan(String operationName, ContextCarrier carrier, String remotePeer) {
        // ...
    }

    public static ContextSnapshot capture() {
        // ...
    }

    public static void continued(ContextSnapshot snapshot) {
        // ...
    }
}
```

## Advanced APIs

### Async Span APIs（异步 Span API）

Span 中有一组高级 API，这些 API 专用于异步方案。
当 span 的标签，日志，属性（包括结束时间）需要在另一个线程中设置时，则应使用这些 API。

```java
/**
 * Span could use these APIs to active and extend its lifecycle across thread.
 * 
 * This is typical used in async plugin, especially RPC plugins.
 */
public interface AsyncSpan {
    /**
     * The span finish at current tracing context, but the current span is still alive,
     * until {@link #asyncFinish} * called.
     * <p>
     * This method must be called
     * <p>
     * 1. In original thread(tracing context). 2. Current span is active span.
     * <p>
     * During alive, tags, logs and attributes of the span could be changed, in any thread.
     * <p>
     * The execution times of {@link #prepareForAsync} and {@link #asyncFinish()} must match.
     *
     * @return the current span
     */
    AbstractSpan prepareForAsync();

    /**
     * Notify the span, it could be finished.
     * <p>
     * The execution times of {@link #prepareForAsync} and {@link #asyncFinish()} must match.
     *
     * @return the current span
     */
    AbstractSpan asyncFinish();
}
```

- 在原始上下文中调用 `prepareForAsync` 方法。
- 完成当前线程中的工作后，在原始上下文中执行 `ContextManager#stopSpan`。
- 将 Span 传播到任何其他线程。
- 完成所有设置后，在任何线程中调用 `#asyncFinish` 方法。
- 跟踪上下文将完成，并在所有跨度的 `#prepareForAsync` 完成时向后端报告（由 API 执行次数判断）。


