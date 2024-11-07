---
title: "Channel Id"
sequence: "102"
---

[UP](/netty.html)

在 `AbstractChannel` 中，定义了 `id` 字段：

```java
public abstract class AbstractChannel extends DefaultAttributeMap implements Channel {
    private final ChannelId id;

    protected AbstractChannel(Channel parent) {
        id = newId();
    }

    protected ChannelId newId() {
        return DefaultChannelId.newInstance();
    }
}
```

## ChannelId 接口

`ChannelId` 的作用是对 `Channel` 类的唯一标识。

```java
/**
 * `ChannelId` represents the globally unique identifier of a `Channel`.
 */
public interface ChannelId extends Serializable, Comparable<ChannelId> {
    String asShortText();
    String asLongText();
}
```

`ChannelId` 接口提供了 `DefaultChannelId` 和 `EmbeddedChannelId` 两类实现：

![](/assets/images/netty/channel/netty-channel-id-class-hierarchy.svg)

## DefaultChannelId 的组成部分

在 `DefaultChannelId` 类中，channel id 由 5 个部分组成：

```text
machine id (8 bytes) + process id (4 bytes) + sequence (4 bytes) + timestamp (8 bytes) + random (4 bytes)
```

示例代码：

```java
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class DefaultChannelIdTest {
    @BeforeEach
    void init() {
        System.setProperty("io.netty.machineId", "CA:FE:BA:BE:12:34:56:78");
        System.setProperty("io.netty.processId", String.valueOf(0XABCD));
    }

    @Test
    void testNewInstance() {
        DefaultChannelId channelId = DefaultChannelId.newInstance();
        System.out.println("channelId = " + channelId);
        System.out.println("ShortText = " + channelId.asShortText());
        System.out.println("LongText  = " + channelId.asLongText());
    }

    @Test
    void testMultipleNewInstance() {
        for (int i = 0; i < 10; i++) {
            DefaultChannelId channelId = DefaultChannelId.newInstance();
            System.out.println("channelId = " + channelId.asLongText());
        }
    }
}
```

`testNewInstance` 方法输出结果：

```text
channelId = c9a98c75
ShortText = c9a98c75
LongText  = cafebabe12345678-0000abcd-00000000-09595a754db62e2c-c9a98c75
```

`testMultipleNewInstance` 方法输出结果：

```text
channelId = cafebabe12345678-0000abcd-00000000-24d547d605b74f38-95171c72
channelId = cafebabe12345678-0000abcd-00000001-37a4c4f605b74f7f-82d36307
channelId = cafebabe12345678-0000abcd-00000002-34dbc4f605b74f7f-cc67bef4
channelId = cafebabe12345678-0000abcd-00000003-2f1a24f605b74f7f-683d312e
channelId = cafebabe12345678-0000abcd-00000004-351324f605b74f7f-6681c082
channelId = cafebabe12345678-0000abcd-00000005-36fca4f605b74f7f-b17fd850
channelId = cafebabe12345678-0000abcd-00000006-1635a4f605b74f7f-f01b7707
channelId = cafebabe12345678-0000abcd-00000007-1c1864f605b74f7f-0682527d
channelId = cafebabe12345678-0000abcd-00000008-3af164f605b74f7f-2ca19d83
channelId = cafebabe12345678-0000abcd-00000009-17bf64f605b74f7f-adda605f
```

## 进程Id

在 Java 8 与 Java 9 之后的版本，获取进程 Id 方式不同：

```java
import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;

public class ProcessUtils {
    public static long getPidLong() {
        // Java 9 之后
        ProcessHandle processHandle = ProcessHandle.current();
        return processHandle.pid();
    }

    public static long getPidInt() {
        // Java 8
        RuntimeMXBean runtimeMXBean = ManagementFactory.getRuntimeMXBean();
        String name = runtimeMXBean.getName();
        int atIndex = name.indexOf('@');
        String value = name.substring(0, atIndex);
        return Integer.parseInt(value);
    }
}
```

