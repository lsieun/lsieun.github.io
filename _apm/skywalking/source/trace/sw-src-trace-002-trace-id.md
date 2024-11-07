---
title: "链路 ID 生成"
sequence: "102"
---

## DistributedTraceId

- project: `apm-agent-core`
- package: `org.apache.skywalking.apm.agent.core.context.ids`

```java
public abstract class DistributedTraceId {
    private final String id;
}
```

![](/assets/images/skywalking/source/sw-src-trace-id-classes.png)

`DistributedTraceId` 有两个子类：

- `PropagatedTraceId`，表示传递同一个 Trace ID
- `NewDistributedTraceId`，表示生成一个新的 Trace ID

```java
public class PropagatedTraceId extends DistributedTraceId {
    public PropagatedTraceId(String id) {
        super(id);
    }
}
```

```java
public class NewDistributedTraceId extends DistributedTraceId {
    public NewDistributedTraceId() {
        super(GlobalIdGenerator.generate());    // A. 关键代码
    }
}
```

## GlobalIdGenerator

```java
import java.util.UUID;

public class GlobalIdGenerator {
    private static final String PROCESS_ID = UUID.randomUUID().toString().replaceAll("-", "");
    private static final ThreadLocal<IDContext> THREAD_ID_SEQUENCE = ThreadLocal.withInitial(
            () -> new IDContext(System.currentTimeMillis(), (short) 0));

    private GlobalIdGenerator() {
    }

    /**
     * Generate a new id, combined by three parts.
     * <p>
     * The first one represents application instance id.
     * <p>
     * The second one represents thread id.
     * <p>
     * The third one also has two parts, 1) a timestamp, measured in milliseconds 2) a seq, in current thread, between
     * 0(included) and 9999(included)
     *
     * @return unique id to represent a trace or segment
     */
    public static String generate() {
        return String.join(
                ".",
                PROCESS_ID,
                String.valueOf(Thread.currentThread().getId()),
                String.valueOf(THREAD_ID_SEQUENCE.get().nextSeq())
        );
    }

    public static void main(String[] args) throws InterruptedException {
        for (int i = 0; i< 300; i++) {
            String id = GlobalIdGenerator.generate();
            System.out.println("id = " + id);
            Thread.sleep(200L);
        }
    }

    private static class IDContext {
        private long lastTimestamp;
        private short threadSeq;

        // Just for considering time-shift-back only.
        private long lastShiftTimestamp;
        private int lastShiftValue;

        private IDContext(long lastTimestamp, short threadSeq) {
            this.lastTimestamp = lastTimestamp;
            this.threadSeq = threadSeq;
        }

        private long nextSeq() {
            return timestamp() * 10000 + nextThreadSeq();
        }

        private long timestamp() {
            long currentTimeMillis = System.currentTimeMillis();

            if (currentTimeMillis < lastTimestamp) {
                // Just for considering time-shift-back by Ops or OS. @hanahmily 's suggestion.
                if (lastShiftTimestamp != currentTimeMillis) {
                    lastShiftValue++;
                    lastShiftTimestamp = currentTimeMillis;
                }
                return lastShiftValue;
            } else {
                lastTimestamp = currentTimeMillis;
                return lastTimestamp;
            }
        }

        private short nextThreadSeq() {
            if (threadSeq == 10000) {
                threadSeq = 0;
            }
            return threadSeq++;
        }
    }
}
```

## 示例

```text
$ sudo date -s "03:25:00"
```

```text
$ java GlobalIdGenerator
id = b44db9f5906c4545b697549e0dd382a7.1.16957563250660000    // 25 - 066 - 0000
id = b44db9f5906c4545b697549e0dd382a7.1.16957563252680001    // 25 - 268 - 0001
id = b44db9f5906c4545b697549e0dd382a7.1.16957563254680002    // 25 - 468 - 0002
id = b44db9f5906c4545b697549e0dd382a7.1.16957563256700003    // 25 - 670 - 0003
...
id = b44db9f5906c4545b697549e0dd382a7.1.16957563292910021    // 29 - 291 - 0021
id = b44db9f5906c4545b697549e0dd382a7.1.16957563294920022    // 29 - 492 - 0022
id = b44db9f5906c4545b697549e0dd382a7.1.16957563296930023    // 29 - 693 - 0023    时间回调
id = b44db9f5906c4545b697549e0dd382a7.1.10024                // 1  -     - 0024
id = b44db9f5906c4545b697549e0dd382a7.1.20025                // 2  -     - 0025
id = b44db9f5906c4545b697549e0dd382a7.1.30026                // 3  -     - 0026
...
id = b44db9f5906c4545b697549e0dd382a7.1.1460169              // 146-     - 0169
id = b44db9f5906c4545b697549e0dd382a7.1.1470170              // 147-     - 0170
id = b44db9f5906c4545b697549e0dd382a7.1.1480171              // 148-     - 0171
id = b44db9f5906c4545b697549e0dd382a7.1.16957563298800172    // 29 - 880 - 0172
id = b44db9f5906c4545b697549e0dd382a7.1.16957563300810173    // 30 - 081 - 0173
id = b44db9f5906c4545b697549e0dd382a7.1.16957563302820174    // 30 - 282 - 0174
id = b44db9f5906c4545b697549e0dd382a7.1.16957563304830175    // 30 - 483 - 0175
id = b44db9f5906c4545b697549e0dd382a7.1.16957563306840176
id = b44db9f5906c4545b697549e0dd382a7.1.16957563308850177
id = b44db9f5906c4545b697549e0dd382a7.1.16957563310860178    // 31 - 086 - 0178
id = b44db9f5906c4545b697549e0dd382a7.1.16957563312870179    // 31 - 287 - 0179
id = b44db9f5906c4545b697549e0dd382a7.1.16957563314880180
id = b44db9f5906c4545b697549e0dd382a7.1.16957563316890181
id = b44db9f5906c4545b697549e0dd382a7.1.16957563318900182
id = b44db9f5906c4545b697549e0dd382a7.1.16957563320910183    // 32 - 091 - 0183
id = b44db9f5906c4545b697549e0dd382a7.1.16957563322910184    // 32 - 291 - 0184
...
id = b44db9f5906c4545b697549e0dd382a7.1.16957563554170299    // 55 - 417 - 0299
```
