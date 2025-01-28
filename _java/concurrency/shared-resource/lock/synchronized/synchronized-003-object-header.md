---
title: "Java 对象头"
sequence: "103"
---

[UP](/java-concurrency.html)


## Java 对象头

源码地址：[jdk8/hotspot/file/vm/oops/markOop.hpp][markOop]

```text
https://hg.openjdk.org/jdk8/jdk8/hotspot/file/87ee5ee27509/src/share/vm/oops/markOop.hpp
```

```text
64 bits:
--------
unused:25 hash:31 -->| unused:1   age:4    biased_lock:1 lock:2 (normal object)
JavaThread*:54 epoch:2 unused:1   age:4    biased_lock:1 lock:2 (biased object)
PromotedObject*:61 --------------------->| promo_bits:3 ----->| (CMS promoted object)
size:64 ----------------------------------------------------->| (CMS free block)
```

Java 对象的对象头在对象的不同状态下会有不同的表现形式，主要有三种状态：**无锁状态**、**加锁状态**、**GC 标记状态**。
那么，我可以理解 Java 当中的取锁其实可以理解是给对象上锁，也就是改变对象头的状态，
如果上锁成功，则进入同步代码块。

- Java 对象状态
    - 无锁状态
    - 加锁状态
        - 偏向锁
        - 轻量级锁
        - 重量级锁
    - GC 标记状态

但是 Java 当中的锁有分为很多种，从上图可以看出大体分为**偏向锁**、**轻量锁**、**重量锁**三种锁状态。
这三种锁的效率完全不同，我们只有合理的设计代码，才能合理的利用锁、那么这三种锁的原理是什么 ? 所以我们需要先研究这个对象头。

### 32-bit 虚拟机

普通对象：

```text
|-----------------------------------------------------------------|
|                      Object Header (64 bits)                    |
|--------------------------------|--------------------------------|
|      Mark Word (32 bits)       |      Klass Word (32 bits)      |
|--------------------------------|--------------------------------|
```

- 一个 `int` 类型占用 4 bytes
- 一个 `Integer` 类型 占用 12 bytes = Mark Word (4 bytes) + Klass Word (4 bytes) + int value (4 bytes)

```java
public final class Integer extends Number
        implements Comparable<Integer>, Constable, ConstantDesc {
    /**
     * The value of the {@code Integer}.
     */
    private final int value;
}
```

数组对象：

```text
|--------------------------------------------------------------------------------------------------|
|                                     Object Header (96 bits)                                      |
|--------------------------------|--------------------------------|--------------------------------|
|      Mark Word (32 bits)       |      Klass Word (32 bits)      |     array length (32 bits)     |
|--------------------------------|--------------------------------|--------------------------------|
```

其中，Mark Word 结构为：

```text
|--------------------------------------------------------------|--------------------|
|                     Mark Word (32 bits)                      |       State        |
|--------------------------------------------------------------|--------------------|
| hashcode:25         | age:4 | biased_lock:1:0 | lock:2:01    |       Normal       |
|--------------------------------------------------------------|--------------------|
| thread:23 | epoch:2 | age:4 | biased_lock:1:1 | lock:2:01    |       Biased       |
|--------------------------------------------------------------|--------------------|
|              ptr_to_lock_record:30            | lock:2:00    | Lightweight Locked |
|--------------------------------------------------------------|--------------------|
|              par_to_heavyweight_monitor:30    | lock:2:10    | Heavyweight Locked |
|--------------------------------------------------------------|--------------------|
|                                               | lock:2:11    |    Marked for GC   |
|--------------------------------------------------------------|--------------------|
```

```text
enum {
    locked_value             = 0, // 0 00 轻量级锁
    unlocked_value           = 1, // 0 01 无锁
    monitor_value            = 2, // 0 10 重量级锁
    marked_value             = 3, // 0 11 GC 标志
    biased_lock_pattern      = 5  // 1 01 偏向锁
};
```

### 64-bit 虚拟机

普通对象：

```text
|-----------------------------------------------------------------|
|                      Object Header (64 bits)                    |
|--------------------------------|--------------------------------|
|      Mark Word (64 bits)       |      Klass Word (32 bits)      |
|--------------------------------|--------------------------------|
```

`Integer` 比 `int` 占用更多的内存空间，使用效率较低：

- 一个 `int` 类型占用 4 bytes
- 一个 `Integer` 类型 占用 16 bytes = Mark Word (8 bytes) + Klass Word (4 bytes) + int value (4 bytes)

```java
public final class Integer extends Number
        implements Comparable<Integer>, Constable, ConstantDesc {
    /**
     * The value of the {@code Integer}.
     */
    private final int value;
}
```

```java
import org.openjdk.jol.info.ClassLayout;

public class ObjRun {
    public static void main(String[] args) {
        Integer instance = Integer.valueOf(100);
        String str = ClassLayout.parseInstance(instance).toPrintable();
        System.out.println(str);
    }
}
```

```text
java.lang.Integer object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000001 (non-biasable; age: 0)    // Mark Word  占用 8 bytes
  8   4        (object header: class)    0xf80022bf                                   // Klass Word 占用 4 bytes 
 12   4    int Integer.value             100                                          // value      占用 4 bytes
Instance size: 16 bytes                                                               // instance   占用 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```

数组对象：

```text
|--------------------------------------------------------------------------------------------------|
|                                     Object Header (128 bits)                                     |
|--------------------------------|--------------------------------|--------------------------------|
|      Mark Word (64 bits)       |      Klass Word (32 bits)      |     array length (32 bits)     |
|--------------------------------|--------------------------------|--------------------------------|
```

其中，Mark Word 结构为：

```text
|------------------------------------------------------------------------------|--------------------|
|                             Mark Word (64 bits)                              |       State        |
|------------------------------------------------------------------------------|--------------------|
| unused:25 | hashcode:31 | unused: 1 | age:4 | biased_lock:1:0 | lock:2:01    |       Normal       |
|------------------------------------------------------------------------------|--------------------|
| thread:54 | epoch:2     | unused: 1 | age:4 | biased_lock:1:1 | lock:2:01    |       Biased       |
|------------------------------------------------------------------------------|--------------------|
|                         ptr_to_lock_record:62                 | lock:2:00    | Lightweight Locked |
|------------------------------------------------------------------------------|--------------------|
|                         par_to_heavyweight_monitor:62         | lock:2:10    | Heavyweight Locked |
|------------------------------------------------------------------------------|--------------------|
|                                                               | lock:2:11    |    Marked for GC   |
|------------------------------------------------------------------------------|--------------------|
```

```text
enum {
    locked_value             = 0, // 0 00 轻量级锁
    unlocked_value           = 1, // 0 01 无锁
    monitor_value            = 2, // 0 10 重量级锁
    marked_value             = 3, // 0 11 GC 标志
    biased_lock_pattern      = 5  // 1 01 偏向锁
};
```

## 示例代码

### pom.xml

```xml
<dependency>
    <groupId>org.openjdk.jol</groupId>
    <artifactId>jol-core</artifactId>
    <version>0.17</version>
</dependency>
```

### 偏向锁

一个对象创建时：

- 如果开启了偏向锁（默认开启），那么对象创建后，markword 值为 `0x05` 即最后 3 位为 `101`，这时它的 thread、epoch、age 都为 0
- 偏向锁是默认是延迟的，不会在程序启动时立即生效，如果想避免延迟，可以加 VM 参数 `-XX:BiasedLockingStartupDelay=0` 来禁用延迟
- 如果没有开启偏向锁，那么对象创建后，markword 值为 `0x01` 即最后 3 位为 `001`，这时它的 hashcode、age 都为 0，第一次用到 hashcode 时才会赋值

```text
-XX:BiasedLockingStartupDelay=0
```

#### 偏向锁 - 延时生效

```java
import org.openjdk.jol.info.ClassLayout;

public class SynchronizedMarkWord {
    public static void main(String[] args) throws InterruptedException {
        // 第 1 次执行
        System.out.println(ClassLayout.parseInstance(new Object()).toPrintable());

        Thread.sleep(3000);

        // 第 2 次执行
        System.out.println(ClassLayout.parseInstance(new Object()).toPrintable());

        // 第 3 次执行
        System.out.println(ClassLayout.parseInstance(new Object()).toPrintable());
    }
}
```

第一次测试，输出结果：

```text
java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000001 (non-biasable; age: 0)    // A. 无锁
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000005 (biasable; age: 0)       // B. 偏向锁
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000005 (biasable; age: 0)       // B. 偏向锁
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

```text
0x0000000000000001
00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001

0x0000000000000005
00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000101
```

```text
enum {
    locked_value             = 0, // 0 00 轻量级锁
    unlocked_value           = 1, // 0 01 无锁
    monitor_value            = 2, // 0 10 重量级锁
    marked_value             = 3, // 0 11 GC 标志
    biased_lock_pattern      = 5  // 1 01 偏向锁
};
```

#### 偏向锁 - 立即生效

代码不发生变化，添加如下 VM 参数：

```text
-XX:BiasedLockingStartupDelay=0
```

输出结果：

```text
java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000005 (biasable; age: 0)
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000005 (biasable; age: 0)
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000005 (biasable; age: 0)
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

#### 偏向锁 - 记录线程 ID

```java
import org.openjdk.jol.info.ClassLayout;

public class SynchronizedMarkWord {
    public static void main(String[] args) throws InterruptedException {
        Object instance = new Object();

        // 第 1 次执行
        System.out.println(ClassLayout.parseInstance(instance).toPrintable());

        synchronized (instance) {
            // 第 2 次执行
            System.out.println(ClassLayout.parseInstance(instance).toPrintable());
        }

        // 第 3 次执行
        System.out.println(ClassLayout.parseInstance(instance).toPrintable());
    }
}
```

```text
java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000005 (biasable; age: 0)
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x00000000004d8805 (biased: 0x0000000000001362; epoch: 0; age: 0)
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x00000000004d8805 (biased: 0x0000000000001362; epoch: 0; age: 0)
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

```text
0x00000000004d8805
00000000 00000000 00000000 00000000 00000000 01001101 10001000 00000101
```

注意：这里的线程 ID，是操作系统层面的线程 ID，而不是 Java 层面的，因此使用 `Thread.getId()` 方法是不正确的。

- [java 获取真实线程 id](https://www.jianshu.com/p/8ca8f1e3d37e)

#### 偏向锁 - 禁用

在单线程的情况下，进入 `synchronized` 代码块，使用偏向锁的效率是非常高的；
但是，在多线程情况下，多线程要进行竞争，这个时候偏向锁就不合适了。

如果要禁用偏向锁，可以添加 VM 参数：

```text
-XX:-UseBiasedLocking
```

```java
import org.openjdk.jol.info.ClassLayout;

public class SynchronizedMarkWord {
    public static void main(String[] args) {
        Object instance = new Object();

        // 第 1 次执行
        System.out.println(ClassLayout.parseInstance(instance).toPrintable());

        synchronized (instance) {
            // 第 2 次执行
            System.out.println(ClassLayout.parseInstance(instance).toPrintable());
        }

        // 第 3 次执行
        System.out.println(ClassLayout.parseInstance(instance).toPrintable());
    }
}
```

```text
java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000001 (non-biasable; age: 0)             // A. 无锁
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x00000000022ef408 (thin lock: 0x00000000022ef408)    // B. 轻量级锁
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000001 (non-biasable; age: 0)             // C. 无锁
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

```text
0x00000000022ef408

00000000 00000000 00000000 00000000 00000010 00101110 11110100 00001000
```

#### HashCode

在开启偏向锁（Biased Lock）下，HashCode 会禁用偏向锁（Biased Lock）：

- 如果不调用对象的 `hashCode()` 方法，那么对象具有偏向锁（Biased Lock）
- 如果调用了对象的 `hashCode()` 方法，那么对象变成无锁状态（UNLOCKED）

问题：为什么调用了 `hashCode()` 方法，会将对象从偏向锁状态（Biased Lock）转向无锁状态（Unlocked）呢？

回答：因为在偏向锁状态（Biased Lock）下，记录线程 ID 需要 54 bit 空间，
而调用 `hashCode()` 方法后需要记录 hashcode，占用 31 bit，只剩下 25 bit unused 空间了，不能装下 54 bit 的线程 ID 了。

```text
|------------------------------------------------------------------------------|--------------------|
|                             Mark Word (64 bits)                              |       State        |
|------------------------------------------------------------------------------|--------------------|
| unused:25 | hashcode:31 | unused: 1 | age:4 | biased_lock:1:0 | lock:2:01    |       Normal       |
|------------------------------------------------------------------------------|--------------------|
| thread:54 | epoch:2     | unused: 1 | age:4 | biased_lock:1:1 | lock:2:01    |       Biased       |
|------------------------------------------------------------------------------|--------------------|
|                         ptr_to_lock_record:62                 | lock:2:00    | Lightweight Locked |
|------------------------------------------------------------------------------|--------------------|
|                         par_to_heavyweight_monitor:62         | lock:2:10    | Heavyweight Locked |
|------------------------------------------------------------------------------|--------------------|
|                                                               | lock:2:11    |    Marked for GC   |
|------------------------------------------------------------------------------|--------------------|
```

如下 VM 参数：

```text
-XX:BiasedLockingStartupDelay=0
```

```java
public class SynchronizedMarkWord {
    public static void main(String[] args) {
        Object instance = new Object();
        int hashCode = instance.hashCode();
        System.out.println("HashCode :" + Integer.toHexString(hashCode));

        // 第 1 次执行
        MarkWordUtils.print(instance);

        synchronized (instance) {
            // 第 2 次执行
            MarkWordUtils.print(instance);
        }

        // 第 3 次执行
        MarkWordUtils.print(instance);
    }
}
```

```text
HashCode :74a14482
java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
0   8        (object header: mark)     0x00000074a1448201 (hash: 0x74a14482; age: 0)          // UNLOCKED
8   4        (object header: class)    0xf80001e5
12   4        (object alignment gap)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
MarkWord(HEX): 0x00000074a1448201 
MarkWord(BIN): 00000000 00000000 00000000 01110100 10100001 01000100 10000010 00000001
Reference    : 000- 轻量级锁, 001- 无锁, 010- 重量级锁, 011-GC 标志, 101- 偏向锁

java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
0   8        (object header: mark)     0x00000000021ef7e0 (thin lock: 0x00000000021ef7e0)     // LIGHT_LOCK
8   4        (object header: class)    0xf80001e5
12   4        (object alignment gap)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
MarkWord(HEX): 0x00000000021ef7e0 
MarkWord(BIN): 00000000 00000000 00000000 00000000 00000010 00011110 11110111 11100000
Reference    : 000- 轻量级锁, 001- 无锁, 010- 重量级锁, 011-GC 标志, 101- 偏向锁

java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
0   8        (object header: mark)     0x00000074a1448201 (hash: 0x74a14482; age: 0)          // UNLOCKED
8   4        (object header: class)    0xf80001e5
12   4        (object alignment gap)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
MarkWord(HEX): 0x00000074a1448201 
MarkWord(BIN): 00000000 00000000 00000000 01110100 10100001 01000100 10000010 00000001
Reference    : 000- 轻量级锁, 001- 无锁, 010- 重量级锁, 011-GC 标志, 101- 偏向锁
```

```java
import org.openjdk.jol.info.ClassLayout;

import java.util.Formatter;

public class MarkWordUtils {
    public static void print(Object obj) {
        print(obj, true);
    }

    public static void print(Object obj, boolean verbose) {
        ClassLayout classLayout = ClassLayout.parseInstance(obj);
        String str = classLayout.toPrintable();
        String[] array = str.split(System.lineSeparator());
        String markLine = array[2];
        String markWordHex = markLine.substring(41, 60);
        String binaryStr = BinaryUtils.hex2Binary(markWordHex);

        StringBuilder sb = new StringBuilder();
        Formatter fm = new Formatter(sb);
        if (verbose) {
            int length = array.length;
            for (int i = 0; i < length; i++) {
                String line = array[i];
                String text = line.trim();
                if ("".equals(text)) {
                    continue;
                }

                if (i == 2) {
                    fm.format("%-90s    // %s%n", text, LockState.parse(binaryStr));
                } else {
                    fm.format("%s%n", text);
                }

            }
        }

        fm.format("MarkWord(HEX): %s%n", markWordHex);
        fm.format("MarkWord(BIN): %s%n", binaryStr);
        fm.format("Reference    : 000- 轻量级锁, 001- 无锁, 010- 重量级锁, 011-GC 标志, 101- 偏向锁 %n");
        System.out.println(sb);
    }
}
```

#### 偏向锁 - 升级为轻量级锁

```java
import lsieun.utils.LockDetails;
import lsieun.utils.MarkWordUtils;

public class SynchronizedMarkWord {
    public static void main(String[] args) {
        Object instance = new Object();
        final int detail = LockDetails.ONLY_BINARY;

        new Thread(
                () -> {
                    // 第 1 次执行
                    MarkWordUtils.print(instance, detail);

                    synchronized (instance) {
                        // 第 2 次执行
                        MarkWordUtils.print(instance, detail);
                    }

                    // 第 3 次执行
                    MarkWordUtils.print(instance, detail);

                    synchronized (SynchronizedMarkWord.class) {
                        SynchronizedMarkWord.class.notify();
                    }
                },
                "t1").start();

        new Thread(
                () -> {
                    synchronized (SynchronizedMarkWord.class) {
                        try {
                            SynchronizedMarkWord.class.wait();
                        } catch (InterruptedException e) {
                            throw new RuntimeException(e);
                        }
                    }

                    // 第 1 次执行
                    MarkWordUtils.print(instance, detail);

                    synchronized (instance) {
                        // 第 2 次执行
                        MarkWordUtils.print(instance, detail);
                    }

                    // 第 3 次执行
                    MarkWordUtils.print(instance, detail);
                },
                "t2").start();
    }
}
```

```text
[t1] MarkWord(BIN): 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000101 - BIASED_LOCK

[t1] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011110 10010000 00101000 00000101 - BIASED_LOCK

[t1] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011110 10010000 00101000 00000101 - BIASED_LOCK

[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011110 10010000 00101000 00000101 - BIASED_LOCK

[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011110 10111101 11110101 00110000 - LIGHT_LOCK

[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001 - UNLOCKED
```

#### 偏向锁 - 调用 wait/notify- 升级为重量级锁

#### 批量重偏向

```java
import lsieun.utils.LockDetails;
import lsieun.utils.MarkWordUtils;

import java.util.Vector;

public class SynchronizedMarkWord {
    public static void main(String[] args) {
        final int detail = LockDetails.ONLY_BINARY;

        Vector<Object> list = new Vector<>();

        Thread t1 = new Thread(
                () -> {
                    for (int i = 0; i < 30; i++) {
                        System.out.println("i = " + i);
                        Object instance = new Object();
                        list.add(instance);
                        synchronized (instance) {
                            MarkWordUtils.print(instance, detail);
                        }
                    }

                    synchronized (list) {
                        list.notify();
                    }
                },
                "t1"
        );
        t1.start();

        Thread t2 = new Thread(
                () -> {
                    synchronized (list) {
                        try {
                            list.wait();
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }

                    for (int i = 0; i < 30; i++) {
                        System.out.println("i = " + i);
                        Object instance = list.get(i);
                        MarkWordUtils.print(instance, detail);

                        synchronized (instance) {
                            MarkWordUtils.print(instance, detail);
                        }

                        MarkWordUtils.print(instance, detail);
                    }
                },
                "t2"
        );
        t2.start();
    }
}
```

```text
i = 0
[t1] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011111 01111101 11000000 00000101 - BIASED_LOCK

...

i = 29
[t1] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011111 01111101 11000000 00000101 - BIASED_LOCK

i = 0
[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011111 01111101 11000000 00000101 - BIASED_LOCK

[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00100000 01000000 11110010 10110000 - LIGHT_LOCK

[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001 - UNLOCKED

...

i = 13
[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011111 01111101 11000000 00000101 - BIASED_LOCK

[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00100000 01000000 11110010 10110000 - LIGHT_LOCK

[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001 - UNLOCKED

i = 14
[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011111 01111101 11000000 00000101 - BIASED_LOCK

[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011111 01111101 11101001 00000101 - BIASED_LOCK

[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011111 01111101 11101001 00000101 - BIASED_LOCK

...

i = 29
[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011111 01111101 11000000 00000101 - BIASED_LOCK

[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011111 01111101 11101001 00000101 - BIASED_LOCK

[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011111 01111101 11101001 00000101 - BIASED_LOCK
```

#### 批量撤销（偏向）

当撤销偏向锁阈值超过 40 次后，JVM 会这样觉得，自己确实偏向错了，根本就不该偏向。
于是整个类的所有对象都会变为不可偏向的，新建的该类型对象也是不可偏向的。

```java
import lsieun.utils.LockDetails;
import lsieun.utils.MarkWordUtils;

import java.util.Vector;
import java.util.concurrent.locks.LockSupport;

public class SynchronizedMarkWord {
    static Thread t1, t2, t3;

    public static void main(String[] args) throws InterruptedException {
        final int detail = LockDetails.ONLY_BINARY;
        int loopNumber = 39;

        Vector<Object> list = new Vector<>();

        t1 = new Thread(
                () -> {
                    for (int i = 0; i < loopNumber; i++) {
                        System.out.println("i = " + i);
                        Object instance = new Object();
                        list.add(instance);
                        synchronized (instance) {
                            MarkWordUtils.print(instance);
                        }
                    }
                    LockSupport.unpark(t2);
                },
                "t1"
        );
        t1.start();

        t2 = new Thread(
                () -> {
                    LockSupport.park();
                    for (int i = 0; i < loopNumber; i++) {
                        System.out.println("i = " + i);
                        Object instance = list.get(i);
                        MarkWordUtils.print(instance, detail);
                        synchronized (instance) {
                            MarkWordUtils.print(instance, detail);
                        }
                        MarkWordUtils.print(instance, detail);
                    }
                    LockSupport.unpark(t3);
                },
                "t2"
        );
        t2.start();

        t3 = new Thread(
                () -> {
                    LockSupport.park();
                    for (int i = 0; i < loopNumber; i++) {
                        System.out.println("i = " + i);
                        Object instance = list.get(i);
                        MarkWordUtils.print(instance, detail);
                        synchronized (instance) {
                            MarkWordUtils.print(instance, detail);
                        }
                        MarkWordUtils.print(instance, detail);
                    }
                },
                "t3"
        );
        t3.start();

        t3.join();
        MarkWordUtils.print(new Object(), detail);
    }
}
```

```text
i = 0
[t1] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011110 01101001 10000000 00000101 - BIASED_LOCK

...

i = 38
[t1] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011110 01101001 10000000 00000101 - BIASED_LOCK

# 0 ~ 38: BIASED_LOCK

i = 0
[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011110 01101001 10000000 00000101 - BIASED_LOCK

[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00100000 00001100 11110100 01101000 - LIGHT_LOCK

[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001 - UNLOCKED

...

i = 13
[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011110 01101001 10000000 00000101 - BIASED_LOCK

[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00100000 00001100 11110100 01101000 - LIGHT_LOCK

[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001 - UNLOCKED

i = 14
[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011110 01101001 10000000 00000101 - BIASED_LOCK

[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011111 01111110 00101001 00000101 - BIASED_LOCK

[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011111 01111110 00101001 00000101 - BIASED_LOCK

...

i = 38
[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011110 01101001 10000000 00000101 - BIASED_LOCK

[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011111 01111110 00101001 00000101 - BIASED_LOCK

[t2] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011111 01111110 00101001 00000101 - BIASED_LOCK

# 0~13 UNLOCKED, 14~38 BIASED_LOCK

i = 0
[t3] MarkWord(BIN): 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001 - UNLOCKED

[t3] MarkWord(BIN): 00000000 00000000 00000000 00000000 00100000 00101110 11110010 11011000 - LIGHT_LOCK

[t3] MarkWord(BIN): 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001 - UNLOCKED

...

i = 13
[t3] MarkWord(BIN): 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001 - UNLOCKED

[t3] MarkWord(BIN): 00000000 00000000 00000000 00000000 00100000 00101110 11110010 11011000 - LIGHT_LOCK

[t3] MarkWord(BIN): 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001 - UNLOCKED

i = 14
[t3] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011111 01111110 00101001 00000101 - BIASED_LOCK

[t3] MarkWord(BIN): 00000000 00000000 00000000 00000000 00100000 00101110 11110010 11011000 - LIGHT_LOCK

[t3] MarkWord(BIN): 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001 - UNLOCKED

...

i = 38
[t3] MarkWord(BIN): 00000000 00000000 00000000 00000000 00011111 01111110 00101001 00000101 - BIASED_LOCK

[t3] MarkWord(BIN): 00000000 00000000 00000000 00000000 00100000 00101110 11110010 11011000 - LIGHT_LOCK

[t3] MarkWord(BIN): 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001 - UNLOCKED

# 0~38 UNLOCKED

[main] MarkWord(BIN): 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001 - UNLOCKED
```

## 锁消除

```text
-XX:-EliminateLocks
```

## 锁粗化

锁粗化：有些情况下我们反而希望把很多次锁的请求合并成一个请求，以降低短时间内大量锁请求、同步、释放带来的性能损耗。

https://blog.csdn.net/qq_26222859/article/details/80546917

## Other

```java
public class Person {
}
```

```java
import org.openjdk.jol.info.ClassLayout;
import org.openjdk.jol.vm.VM;

public class HelloWorld {
    public static void main(String[] args) {

        System.out.println(VM.current().details());

        System.out.println(ClassLayout.parseClass(Person.class).toPrintable());

        Person instance = new Person();
        System.out.println(ClassLayout.parseInstance(instance).toPrintable());
    }
}
```

```text
# VM mode: 64 bits
# Compressed references (oops): 3-bit shift
# Compressed class pointers: 3-bit shift
# Object alignment: 8 bytes
#                       ref, bool, byte, char, shrt,  int,  flt,  lng,  dbl
# Field sizes:            4,    1,    1,    2,    2,    4,    4,    8,    8
# Array element sizes:    4,    1,    1,    2,    2,    4,    4,    8,    8
# Array base offsets:    16,   16,   16,   16,   16,   16,   16,   16,   16

lsieun.jol.Person object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     N/A
  8   4        (object header: class)    N/A
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

lsieun.jol.Person object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000001 (non-biasable; age: 0)
  8   4        (object header: class)    0xf801666a
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

分析结果：
整个对象一共 16 Byte，其中对象头（Object header）12 Byte，还有 4 Byte 是对齐的字节（因为在 64 位虚拟机上对象的大小必须是 8 的倍数）,
由于这个对象里面没有任何字段，故而对象的实例数据为 0B。两个问题：

1、什么叫做对象的实例数据呢？
2、那么对象头里面的 12 Byte 到底存的是什么呢？

首先要明白什么对象的实例数据很简单，我们可以在 Person 当中添加一个 boolean 的字段，大家都知道 boolean 字段占 1B，然后再看结果：

```java
public class Person {
    private boolean myFlag;
}
```

```text
# VM mode: 64 bits
# Compressed references (oops): 3-bit shift
# Compressed class pointers: 3-bit shift
# Object alignment: 8 bytes
#                       ref, bool, byte, char, shrt,  int,  flt,  lng,  dbl
# Field sizes:            4,    1,    1,    2,    2,    4,    4,    8,    8
# Array element sizes:    4,    1,    1,    2,    2,    4,    4,    8,    8
# Array base offsets:    16,   16,   16,   16,   16,   16,   16,   16,   16

lsieun.jol.Person object internals:
OFF  SZ      TYPE DESCRIPTION               VALUE
  0   8           (object header: mark)     N/A
  8   4           (object header: class)    N/A
 12   1   boolean Person.myFlag             N/A
 13   3           (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 3 bytes external = 3 bytes total

lsieun.jol.Person object internals:
OFF  SZ      TYPE DESCRIPTION               VALUE
  0   8           (object header: mark)     0x0000000000000001 (non-biasable; age: 0)
  8   4           (object header: class)    0xf801666a
 12   1   boolean Person.myFlag             false
 13   3           (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 3 bytes external = 3 bytes total
```

整个对象的大小还是没有改变一共 16 byte，其中对象头（Object header）12 byte， `boolean` 字段 `myFlag`（对象的实例数据）占 1
byte，
剩下的 3 byte 就是对齐字节。由此我们可以认为一个对象的布局大体分为三个部分分别是对象头（Object header）、对象的实例数据、字节对齐。

```java
import org.openjdk.jol.info.ClassLayout;

public class HelloWorld {
    public static void main(String[] args) {
        Person instance = new Person();
        System.out.println(ClassLayout.parseInstance(instance).toPrintable());

        System.out.println("=== === ===");
        System.out.println("hashcode before");
        System.out.println(Integer.toHexString(instance.hashCode()));
        System.out.println("hashcode after");
        System.out.println("=== === ===");

        System.out.println(ClassLayout.parseInstance(instance).toPrintable());
    }
}
```

```text
lsieun.jol.Person object internals:
OFF  SZ      TYPE DESCRIPTION               VALUE
  0   8           (object header: mark)     0x0000000000000001 (non-biasable; age: 0)
  8   4           (object header: class)    0xf800c143
 12   1   boolean Person.myFlag             false
 13   3           (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 3 bytes external = 3 bytes total

=== === ===
hashcode before
66cd51c3
hashcode after
=== === ===
lsieun.jol.Person object internals:
OFF  SZ      TYPE DESCRIPTION               VALUE
  0   8           (object header: mark)     0x00000066cd51c301 (hash: 0x66cd51c3; age: 0)
  8   4           (object header: class)    0xf800c143
 12   1   boolean Person.myFlag             false
 13   3           (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 3 bytes external = 3 bytes total
```

其中的是否可偏向标识在无锁情况下会根据是否计算 hashcode 而变化；因为如果计算了 hashcode 之后对象便变得不可偏向，为什么？

关于对象状态一共分为五种状态，分别是**无锁(偏向锁但是不可偏向)**、**偏向锁(偏向锁并且可以偏向)**、**轻量锁**、**重量锁**、*
*GC 标记**，
那么 2bit，如何能表示五种状态（2bit 最多只能表示 4 中状态分别是：00,01,10,11），jvm 做的比较好的是把是否可偏向表示为一个状态，
然后根据图中偏向锁的标识再去标识是可偏向的还是不可偏向的。
这里需要注意的一点是：如果没有计算 hashcode，对象没加 synchronized，此时对象也处于偏向锁状态

```text
00:轻量锁，01:偏向锁，10:重量锁，11:GC 标记
```

## Reference

- [synchronized 原理之对象头](https://blog.csdn.net/weixin_45775746/article/details/122639630)
- [synchronized 原理(一) -- Java 对象头及 Monitor](https://blog.csdn.net/q_coder/article/details/123843145)
- [synchronized 原理分析（中）](https://www.bmabk.com/index.php/post/131215.html)
- [码农会锁，synchronized 对象头结构(mark-word、Klass Pointer)、指针压缩、锁竞争，源码解毒！](https://segmentfault.com/a/1190000037645482)
- [彻底搞懂 Java 中的 synchronized 关键字](https://juejin.cn/post/6973571891915128846)
- [JAVA 对象布局 -- 对象头(Object Header)](https://juejin.cn/post/6934615532188631048)
- [Guide to the Synchronized Keyword in Java](https://www.baeldung.com/java-synchronized)
- [JAVA 对象头分析及 Synchronized 锁](https://www.cnblogs.com/hongdada/p/14087177.html)
- [synchronized 的理解 4- 对象头](https://blog.csdn.net/LWYYYYYY/article/details/116035319)
- [Memory Layout of Objects in Java](https://www.baeldung.com/java-memory-layout)
- [Pros and Cons of Lock (java.util.concurrent.locks) over synchronized methods and statements](https://www.devinline.com/2015/10/Lock-Vs-synchronized-in-java.html)
- [Java – Explicit Locks vs Implicit Locks](https://itecnote.com/tecnote/java-explicit-locks-vs-implicit-locks/)
- [Intrinsic Locks and Synchronization](https://docs.oracle.com/javase/tutorial/essential/concurrency/locksync.html)
- [Guide to java.util.concurrent.Locks](https://www.baeldung.com/java-concurrent-locks)
- [Java 利用 JOL 工具分析对象分布](http://lihuaxi.xjx100.cn/news/1185064.html)
- [java 锁头变化本质](https://blog.csdn.net/hero_is_me/article/details/122032035)
- [对象头源码讲解，原来，指向 objectMonitor 的指针在这里](https://www.cnblogs.com/grey-wolf/p/13385295.html)
- []()

[markOop]: https://hg.openjdk.org/jdk8/jdk8/hotspot/file/87ee5ee27509/src/share/vm/oops/markOop.hpp
