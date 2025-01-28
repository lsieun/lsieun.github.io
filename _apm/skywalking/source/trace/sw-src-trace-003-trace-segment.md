---
title: "TraceSegment"
sequence: "103"
---

在 SkyWalking 中，并没有与 Trace 概念直接对应的 Java 类。
Trace 概念，是由多个 `TraceSegment` 类来实现的。

## TraceSegment

- project: `apm-sniffer/apm-agent-core`
- package: `org.apache.skywalking.apm.agent.core.context.trace`

![](/assets/images/skywalking/source/sw-src-trace-trace-segment.png)

![](/assets/images/skywalking/source/sw-src-trace-trace-segment-relation.png)


### Fields

```java
public class TraceSegment {
    // A. trace 层面
    private DistributedTraceId relatedGlobalTraceId;
    
    // B1. segment 层面：自身
    private String traceSegmentId;
    private boolean ignore = false;
    private final long createTime;

    // B2. segment 层面：与前一个 segment 进行关联
    private TraceSegmentRef ref;
    
    // C. span 层面
    private List<AbstractTracingSpan> spans;
    private boolean isSizeLimited = false;

    public TraceSegment() {
        // A. trace
        this.relatedGlobalTraceId = new NewDistributedTraceId();
        
        // B. segment
        this.traceSegmentId = GlobalIdGenerator.generate();
        this.createTime = System.currentTimeMillis();
        
        // C. span
        this.spans = new LinkedList<>();
    }
}
```

### Trace

```java
public class TraceSegment {
    public void relatedGlobalTrace(DistributedTraceId distributedTraceId) {
        if (relatedGlobalTraceId instanceof NewDistributedTraceId) {
            this.relatedGlobalTraceId = distributedTraceId;
        }
    }

    public DistributedTraceId getRelatedGlobalTrace() {
        return relatedGlobalTraceId;
    }
}
```

### Segment

```java
public class TraceSegment {
    // A. Segment 自身的 ID
    public String getTraceSegmentId() {
        return traceSegmentId;
    }
    
    // B. 前面的 Segment ID
    public void ref(TraceSegmentRef refSegment) {
        if (null == ref) {
            this.ref = refSegment;
        }
    }

    // B. 前面的 Segment ID
    public TraceSegmentRef getRef() {
        return ref;
    }

    // C. Segment 其它信息
    public boolean isSingleSpanSegment() {
        return this.spans != null && this.spans.size() == 1;
    }

    public boolean isIgnore() {
        return ignore;
    }

    public void setIgnore(boolean ignore) {
        this.ignore = ignore;
    }

    public long createTime() {
        return this.createTime;
    }
}
```

### Span

```java
public class TraceSegment {
    private List<AbstractTracingSpan> spans;
    private boolean isSizeLimited = false;

    public void archive(AbstractTracingSpan finishedSpan) {
        spans.add(finishedSpan);
    }

    public TraceSegment finish(boolean isSizeLimited) {
        this.isSizeLimited = isSizeLimited;
        return this;
    }
}
```



## TraceSegmentRef

![](/assets/images/skywalking/source/sw-src-trace-trace-segment-ref.png)


```java
public class TraceSegmentRef {
    private SegmentRefType type;
    private String traceId;
    private String traceSegmentId;
    private int spanId;

    private String parentService;
    private String parentServiceInstance;
    private String parentEndpoint;
    private String addressUsedAtClient;

    public TraceSegmentRef(ContextCarrier carrier) {
        this.type = SegmentRefType.CROSS_PROCESS;             // A.跨进程
        this.traceId = carrier.getTraceId();                  // B. trace
        this.traceSegmentId = carrier.getTraceSegmentId();    // B. segment
        this.spanId = carrier.getSpanId();                    // B. span

        this.parentService = carrier.getParentService();                    // C. 从 carrier 读取
        this.parentServiceInstance = carrier.getParentServiceInstance();    // C.
        this.parentEndpoint = carrier.getParentEndpoint();                  // C.
        this.addressUsedAtClient = carrier.getAddressUsedAtClient();        // C.
    }

    public TraceSegmentRef(ContextSnapshot snapshot) {
        this.type = SegmentRefType.CROSS_THREAD;               // A. 跨线程
        this.traceId = snapshot.getTraceId().getId();          // B. trace
        this.traceSegmentId = snapshot.getTraceSegmentId();    // B. segment
        this.spanId = snapshot.getSpanId();                    // B. span

        this.parentService = Config.Agent.SERVICE_NAME;             // C. 从 Config 读取
        this.parentServiceInstance = Config.Agent.INSTANCE_NAME;    // C.
        this.parentEndpoint = snapshot.getParentEndpoint();         // C.
    }

    public enum SegmentRefType {
        CROSS_PROCESS, CROSS_THREAD
    }
}
```

## Config

### Agent

```java
public class Config {
    public static class Agent {
        public static int SPAN_LIMIT_PER_SEGMENT = 300;

        @Length(50)
        public static String SERVICE_NAME = "";

        @Length(50)
        public volatile static String INSTANCE_NAME = "";
    }
}
```

