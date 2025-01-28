---
title: "Span"
sequence: "104"
---

![](/assets/images/skywalking/source/sw-src-trace-span-hierarchy-classes.png)

```text
                                                                                            ┌─── EntrySpan
                                                              ┌─── StackBasedTracingSpan ───┤
                                  ┌─── AbstractTracingSpan ───┤                             └─── ExitSpan
                                  │                           │
AsyncSpan ───┼─── AbstractSpan ───┤                           └─── LocalSpan
                                  │
                                  └─── NoopSpan ──────────────┼─── NoopExitSpan
```

- 在一个 `TraceSegment` 里面，只能存在一个 `EntrySpan`。

## AsyncSpan

```java
public interface AsyncSpan {
    AbstractSpan prepareForAsync();

    AbstractSpan asyncFinish();
}
```

## AbstractSpan

```java
public interface AbstractSpan extends AsyncSpan {
    // segment 层面：前一个 segment
    void ref(TraceSegmentRef ref);
    
    // span 层面：自身属性
    int getSpanId();
    AbstractSpan setOperationName(String operationName);
    String getOperationName();
    
    // span 层面：附加属性（component,layer,tag,log）
    AbstractSpan setComponent(Component component);
    AbstractSpan setLayer(SpanLayer layer);
    AbstractSpan tag(AbstractTag<?> tag, String value);
    AbstractSpan log(Throwable t);
    AbstractSpan log(long timestamp, Map<String, ?> event);

    // span 层面：子分类
    boolean isEntry();
    boolean isExit();

    // span 层面： 
    AbstractSpan start();
    AbstractSpan start(long startTime);
    AbstractSpan setPeer(String remotePeer);
}
```

### Component

```java
public interface Component {
    int getId();

    String getName();
}
```

```java
public class OfficialComponent implements Component {
    private int id;
    private String name;
}
```

```java
public class ComponentsDefine {
    public static final OfficialComponent TOMCAT = new OfficialComponent(1, "Tomcat");

    public static final OfficialComponent HTTPCLIENT = new OfficialComponent(2, "HttpClient");
    
    // ...
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
}
```

### AbstractTag

```java
public abstract class AbstractTag<T> {
    private int id;
    protected final String key;
    private boolean canOverwrite;

    public AbstractTag(int id, String tagKey, boolean canOverwrite) {
        this.id = id;
        this.key = tagKey;
        this.canOverwrite = canOverwrite;
    }

    protected abstract void set(AbstractSpan span, T tagValue);
}
```

#### IntegerTag

```java
public class IntegerTag extends AbstractTag<Integer> {
    @Override
    public void set(AbstractSpan span, Integer tagValue) {
        span.tag(this, Integer.toString(tagValue));
    }
}
```

#### StringTag

```java
public class StringTag extends AbstractTag<String> {
    @Override
    public void set(AbstractSpan span, String tagValue) {
        span.tag(this, tagValue);
    }
}
```

## AbstractTracingSpan

```java
public abstract class AbstractTracingSpan implements AbstractSpan {
    // A. segment 层面：当前 span 所属的 segment
    protected final TracingContext owner;
    
    // B. segment 层面：前面的 segments
    protected List<TraceSegmentRef> refs;
    
    // C. span 层面：前面的 span
    protected int parentSpanId; // Parent span id starts from 0. -1 means no parent span.
    
    // D1. span 层面：基本信息
    protected int spanId; // Span id starts from 0.
    protected String operationName;
    
    // D2. span 层面：附属信息
    protected int componentId = 0;
    protected SpanLayer layer;
    protected List<TagValuePair> tags;
    protected List<LogDataEntity> logs;

    // D3. span 层面：时间信息
    protected long startTime;
    protected long endTime;

    protected AbstractTracingSpan(int spanId, int parentSpanId, String operationName, TracingContext owner) {
        // A. segment 层面
        this.owner = owner;

        // B. 父 span
        this.parentSpanId = parentSpanId;

        // C. 当前 span
        this.spanId = spanId;
        this.operationName = operationName;
    }
}
```

### LifeCycle

```java
public abstract class AbstractTracingSpan implements AbstractSpan {
    // A. span 层面：时间信息
    protected long startTime;
    protected long endTime;
    
    @Override
    public AbstractTracingSpan start() {
        // B. 记录 startTime
        this.startTime = System.currentTimeMillis();
        return this;
    }

    @Override
    public AbstractSpan start(long startTime) {
        // B. 记录 startTime
        this.startTime = startTime;
        return this;
    }

    public boolean finish(TraceSegment owner) {
        // C1. 记录 endTime
        this.endTime = System.currentTimeMillis();
        
        // C2. 将 span 添加到 segment
        owner.archive(this);
        return true;
    }
}
```

### Tag + Log

```java
public abstract class AbstractTracingSpan implements AbstractSpan {
    @Override
    public AbstractTracingSpan tag(String key, String value) {
        return tag(Tags.ofKey(key), value);
    }

    @Override
    public AbstractTracingSpan tag(AbstractTag<?> tag, String value) {
        if (tags == null) {
            tags = new ArrayList<>(8);
        }

        if (tag.isCanOverwrite()) {
            for (TagValuePair pair : tags) {
                if (pair.sameWith(tag)) {
                    pair.setValue(value);
                    return this;
                }
            }
        }

        tags.add(new TagValuePair(tag, value));
        return this;
    }

    @Override
    public AbstractTracingSpan log(Throwable t) {
        if (logs == null) {
            logs = new LinkedList<>();
        }
        if (!errorOccurred && ServiceManager.INSTANCE.findService(StatusCheckService.class).isError(t)) {
            errorOccurred();
        }
        logs.add(new LogDataEntity.Builder().add(new KeyValuePair("event", "error"))
                .add(new KeyValuePair("error.kind", t.getClass().getName()))
                .add(new KeyValuePair("message", t.getMessage()))
                .add(new KeyValuePair(
                        "stack",
                        ThrowableTransformer.INSTANCE.convert2String(t, 4000)
                ))
                .build(System.currentTimeMillis()));
        return this;
    }

    @Override
    public AbstractTracingSpan log(long timestampMicroseconds, Map<String, ?> fields) {
        if (logs == null) {
            logs = new LinkedList<>();
        }
        LogDataEntity.Builder builder = new LogDataEntity.Builder();
        for (Map.Entry<String, ?> entry : fields.entrySet()) {
            builder.add(new KeyValuePair(entry.getKey(), entry.getValue().toString()));
        }
        logs.add(builder.build(timestampMicroseconds));
        return this;
    }
}
```

### TagValuePair

```java
public class TagValuePair {
    private AbstractTag key;
    private String value;

    public boolean sameWith(AbstractTag tag) {
        return key.isCanOverwrite() && key.getId() == tag.getId();
    }

    public void setValue(String value) {
        this.value = value;
    }
}
```

### Tags

```java
public final class Tags {
    private static final Map<String, StringTag> TAG_PROTOTYPES = new ConcurrentHashMap<>();

    private Tags() {
    }

    public static final StringTag URL = new StringTag(1, "url");

    public static final IntegerTag HTTP_RESPONSE_STATUS_CODE = new IntegerTag(2, "http.status_code", true);

    public static final StringTag DB_TYPE = new StringTag(3, "db.type");

    public static AbstractTag<String> ofKey(final String key) {
        return TAG_PROTOTYPES.computeIfAbsent(key, StringTag::new);
    }
}
```

### LogDataEntity

```java
public class LogDataEntity {
    private long timestamp;
    private List<KeyValuePair> logs;
}
```

## StackBasedTracingSpan

```java
public abstract class StackBasedTracingSpan extends AbstractTracingSpan {
    protected int stackDepth;
    protected String peer;

    // A1. peer 设置为 null
    protected StackBasedTracingSpan(int spanId, int parentSpanId, String operationName, TracingContext owner) {
        super(spanId, parentSpanId, operationName, owner);
        this.stackDepth = 0;
        this.peer = null;
    }

    // A2. peer 设置为指定值
    protected StackBasedTracingSpan(int spanId, int parentSpanId, String operationName, String peer,
                                    TracingContext owner) {
        super(spanId, parentSpanId, operationName, owner);
        this.peer = peer;
    }
}
```

### Lifecycle

```java
public abstract class StackBasedTracingSpan extends AbstractTracingSpan {
    @Override
    public boolean finish(TraceSegment owner) {
        if (--stackDepth == 0) {
            return super.finish(owner);
        } else {
            return false;
        }
    }
}
```

### Peer

```java
public abstract class StackBasedTracingSpan extends AbstractTracingSpan {
    @Override
    public AbstractSpan setPeer(final String remotePeer) {
        this.peer = remotePeer;
        return this;
    }
}
```

## EntrySpan

### Entry + Exit

```java
public class EntrySpan extends StackBasedTracingSpan {
    @Override
    public boolean isEntry() {
        return true;
    }

    @Override
    public boolean isExit() {
        return false;
    }
}
```

### Lifecycle

```java
public class EntrySpan extends StackBasedTracingSpan {
    // A. 当前的 stack 高度
    private int currentMaxDepth;

    @Override
    public EntrySpan start() {
        // A. 调用 start() 方法时，stackDepth 会自增；调用 finish() 方法时，stackDepth 会自减
        if ((currentMaxDepth = ++stackDepth) == 1) {
            // B. 只有 currentMaxDepth 为 1 的时候，才调用 start() 方法，只能调用一次
            super.start();
        }
        
        // C. 清空附属信息
        clearWhenRestart();
        return this;
    }

    private void clearWhenRestart() {
        this.componentId = Constants.NULL_VALUE;
        this.layer = null;
        this.logs = null;
        this.tags = null;
    }
}
```

### 附属信息

```java
public class EntrySpan extends StackBasedTracingSpan {
    @Override
    public AbstractTracingSpan setOperationName(String operationName) {
        // 只有 stackDepth 和 currentMaxDepth 相同的时候，才会设置成功
        if (stackDepth == currentMaxDepth || isInAsyncMode) {
            return super.setOperationName(operationName);
        } else {
            return this;
        }
    }
    
    @Override
    public AbstractTracingSpan setComponent(Component component) {
        // 只有 stackDepth 和 currentMaxDepth 相同的时候，才会设置成功
        if (stackDepth == currentMaxDepth || isInAsyncMode) {
            return super.setComponent(component);
        } else {
            return this;
        }
    }

    @Override
    public AbstractTracingSpan setLayer(SpanLayer layer) {
        // 只有 stackDepth 和 currentMaxDepth 相同的时候，才会设置成功
        if (stackDepth == currentMaxDepth || isInAsyncMode) {
            return super.setLayer(layer);
        } else {
            return this;
        }
    }

    @Override
    public EntrySpan tag(String key, String value) {
        // 只有 stackDepth 和 currentMaxDepth 相同的时候，才会设置成功
        if (stackDepth == currentMaxDepth || isInAsyncMode) {
            super.tag(key, value);
        }
        return this;
    }

    @Override
    public EntrySpan log(Throwable t) {
        super.log(t);
        return this;
    }
}
```

## ExitSpan

- 所谓 `ExitSpan` 和 `EntrySpan` 一样采用复用的机制，前提是在插件嵌套的情况下。
- 多个 `ExitSpan` 不存在嵌套关系，即平行存在的时候，是允许同时存在多个 `ExitSpan` 的。
- 把 `ExitSpan` 简单理解为离开 **当前进程/线程** 的操作。
- `TraceSegment` 里不一定非要有 `ExitSpan`。

### Entry + Exit

```java
public class ExitSpan extends StackBasedTracingSpan implements ExitTypeSpan {
    @Override
    public boolean isEntry() {
        return false;
    }

    @Override
    public boolean isExit() {
        return true;
    }
}
```

### Lifecycle

```java
public class ExitSpan extends StackBasedTracingSpan implements ExitTypeSpan {
    @Override
    public ExitSpan start() {
        if (++stackDepth == 1) {    // A. 只有第一个 ExitSpan 会调用 super.start() 方法
            super.start();
        }
        return this;
    }
}
```

### 附属信息

```java
public class ExitSpan extends StackBasedTracingSpan implements ExitTypeSpan {

    @Override
    public AbstractTracingSpan setOperationName(String operationName) {
        if (stackDepth == 1 || isInAsyncMode) {    // B. 只有第一个 ExitSpan 可以设置信息
            return super.setOperationName(operationName);
        } else {
            return this;
        }
    }

    @Override
    public ExitSpan tag(String key, String value) {
        if (stackDepth == 1 || isInAsyncMode) {    // B. 只有第一个 ExitSpan 可以设置信息
            super.tag(key, value);
        }
        return this;
    }

    @Override
    public AbstractTracingSpan tag(AbstractTag<?> tag, String value) {
        if (stackDepth == 1 || tag.isCanOverwrite() || isInAsyncMode) {    // B. 只有第一个 ExitSpan 可以设置信息
            super.tag(tag, value);
        }
        return this;
    }

    @Override
    public AbstractTracingSpan setLayer(SpanLayer layer) {
        if (stackDepth == 1 || isInAsyncMode) {    // B. 只有第一个 ExitSpan 可以设置信息
            return super.setLayer(layer);
        } else {
            return this;
        }
    }

    @Override
    public AbstractTracingSpan setComponent(Component component) {
        if (stackDepth == 1 || isInAsyncMode) {    // B. 只有第一个 ExitSpan 可以设置信息
            return super.setComponent(component);
        } else {
            return this;
        }
    }

    @Override
    public ExitSpan log(Throwable t) {
        super.log(t);
        return this;
    }
}
```

### ExitTypeSpan

```java
public class ExitSpan extends StackBasedTracingSpan implements ExitTypeSpan {
    @Override
    public String getPeer() {
        return peer;
    }
    
    @Override
    public ExitSpan inject(final ContextCarrier carrier) {
        this.owner.inject(this, carrier);
        return this;
    }
}
```

```java
public interface ExitTypeSpan {
    String getPeer();

    ExitTypeSpan inject(ContextCarrier carrier);
}
```

## LocalSpan

```java
public class LocalSpan extends AbstractTracingSpan {
    @Override
    public boolean isEntry() {
        return false;
    }

    @Override
    public boolean isExit() {
        return false;
    }

    @Override
    public AbstractSpan setPeer(String remotePeer) {
        return this;
    }
}
```


