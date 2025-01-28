---
title: "@Contended：解决伪共享"
sequence: "102"
---

## JDK

### 作用

`@Contended` 注解的作用：避免 **false sharing**。

### 引入时间

- Java 8：开始引入 `@Contended` 注解，位于 `sun.misc` 包下
- Java 9：将 `@Contended` 注解放到了 `jdk.internal.vm.annotation` 包下

```java
// Java 8
package sun.misc;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.TYPE}) // 应用于 FIELD 和 TYPE
public @interface Contended {
    String value() default "";
}
```

```java
// Java 9
package jdk.internal.vm.annotation;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.TYPE}) // 应用于 FIELD 和 TYPE
public @interface Contended {

    /**
     * The (optional) contention group tag.
     * This tag is only meaningful for field level annotations.
     *
     * @return contention group tag.
     */
    String value() default "";
}
```

## 如何使用

### 应用对象

`@Contended` 注解可以应用到字段（Field）和类（Class）上。

Basically, when we annotate a field with this annotation,
the HotSpot JVM will add some paddings [around the annotated field.](https://github.com/openjdk/jdk/blob/319b4e71e1400f8a482f0ab42377d40056c6f0ac/src/hotspot/share/classfile/classFileParser.cpp#L4454)
This way, it can make sure that the field resides on its own cache line.

```text
应用于字段上
```

Moreover, if we annotate a whole class with this annotation,
the HotSopt JVM will add the same padding [before all the fields.](https://github.com/openjdk/jdk/blob/319b4e71e1400f8a482f0ab42377d40056c6f0ac/src/hotspot/share/classfile/classFileParser.cpp#L4236)

```text
应用到类
```

### JVM 选项：启用注解

在默认情况下，`@Contended` 只对 JDK 的内部类生效，对于我们自己写的类是无效的。

The `@Contended` annotation is meant to be used internally by the JDK itself.
So by default, it doesn't affect the memory layout of non-internal objects.
That's the reason why our copy-pasted adder doesn't perform as well as the built-in one.

如果我们也想使用 `@Contended` 注解，需要添加 `-XX:-RestrictContended` 参数。

To remove this [internal-only restriction](https://github.com/openjdk/jdk/blob/985061ac28af56eb4593c6cd7d69d6556b5608f9/src/hotspot/share/classfile/classFileParser.cpp#L2118),
we can use the `-XX:-RestrictContended` tuning flag.

## 更多 JVM 选项

### Padding Size

By default, the `@Contended` annotation adds 128 bytes of padding.
That's mainly because the cache line size in many modern processors is around 64/128 bytes.

This value, however, is configurable through the [`-XX:ContendedPaddingWidth`](https://github.com/openjdk/jdk/blob/7436ef236e4826f93df1af53c4aa73429afde41f/src/hotspot/share/runtime/globals.hpp#L769) tuning flag.
As of this writing, this flag only accepts values between 0 and 8192.

```text
-XX:ContendedPaddingWidth=64
```

### 禁用

It's also possible to disable the `@Contended` effect via the `-XX:-EnableContended` tuning.
This may prove to be useful when the memory is at a premium,
and we can afford to lose a bit (and sometimes a lot) of performance.

### 应用场景

After its first release, the `@Contended` annotation has been used quite extensively
to prevent false sharing in JDK's internal data structures.
Here are a few notable examples of such implementations:

- The `Striped64` class to implement counters and accumulators with high throughput
- The `Thread` class to facilitate the implementation of efficient random number generators
- The `ForkJoinPool` work-stealing queue
- The `ConcurrentHashMap` implementation
- The dual data structure used in the `Exchanger` class

#### Striped64

在 Java 8 版本中，使用 `@sun.misc.Contended` 注解：

```java
abstract class Striped64 extends Number {
    @sun.misc.Contended
    static final class Cell {
        volatile long value;
        Cell(long x) { value = x; }
        final boolean cas(long cmp, long val) {
            return UNSAFE.compareAndSwapLong(this, valueOffset, cmp, val);
        }

        // Unsafe mechanics
        private static final sun.misc.Unsafe UNSAFE;
        private static final long valueOffset;
        static {
            try {
                UNSAFE = sun.misc.Unsafe.getUnsafe();
                Class<?> ak = Cell.class;
                valueOffset = UNSAFE.objectFieldOffset(ak.getDeclaredField("value"));
            } catch (Exception e) {
                throw new Error(e);
            }
        }
    }
}
```

在 Java 9 版本中，使用 `@jdk.internal.vm.annotation.Contended` 注解：

```java
abstract class Striped64 extends Number {

    @jdk.internal.vm.annotation.Contended
    static final class Cell {
        // ...
    }

    transient volatile Cell[] cells;
}
```

## 代码示例

### 第一版

```java
public class MyBox {
    public volatile long a;
    public volatile long b;
}
```

```java
public class FalseSharing {
    public static void main(String[] args) throws InterruptedException {
        MyBox myBox = new MyBox();

        long start = System.currentTimeMillis();
        Thread A = new Thread(() -> {
            for (int i = 0; i < 500_000_000; i++) {
                myBox.a += 1;
            }
        }, "A");

        Thread B = new Thread(() -> {
            for (int i = 0; i < 500_000_000; i++) {
                myBox.b += 1;
            }
        }, "B");

        A.start();
        B.start();

        A.join();
        B.join();

        long end = System.currentTimeMillis();

        System.out.println("花费时间为：" + (end - start));
        System.out.println(myBox.a);
        System.out.println(myBox.b);
    }
}
```

输出结果：

```text
花费时间为：32559
500000000
500000000
```

### 第二版

```java
public class MyBox {
    public volatile long a1, a2, a3, a4, a5, a6, a7;
    public volatile long a;
    public volatile long b1, b2, b3, b4, b5, b6, b7;
    public volatile long b;
}
```

输出结果：

```text
花费时间为：3703
500000000
500000000
```

### 第三版

注意：

- 第 1 点，添加 `@Contended` 注解
- 第 2 点，运行时添加 `-XX:-RestrictContended` 选项

```java
import sun.misc.Contended;

public class MyBox {
    @Contended
    public volatile long a;

    @Contended
    public volatile long b;
}
```

```text
花费时间为：3902
500000000
500000000
```

```text
lsieun.jol.pojo.MyBox object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     N/A
  8   4        (object header: class)    N/A
 12 132        (alignment/padding gap)   
144   8   long MyBox.a                   N/A
152 128        (alignment/padding gap)   
280   8   long MyBox.b                   N/A
Instance size: 288 bytes
Space losses: 260 bytes internal + 0 bytes external = 260 bytes total
```

```text
┌──────────────┬────────────┬───────────────────────────────┐
│    Offset    │    Size    │          Description          │
├──────────────┼────────────┼───────────────────────────────┤
│      0       │     8      │     (object header: mark)     │
├──────────────┼────────────┼───────────────────────────────┤
│      8       │     4      │    (object header: class)     │
├──────────────┼────────────┼───────────────────────────────┤
│      12      │    132     │    (alignment/padding gap)    │
├──────────────┼────────────┼───────────────────────────────┤
│     144      │     8      │         long MyBox.a          │
├──────────────┼────────────┼───────────────────────────────┤
│     152      │    128     │    (alignment/padding gap)    │
├──────────────┼────────────┼───────────────────────────────┤
│     280      │     8      │         long MyBox.b          │
└──────────────┴────────────┴───────────────────────────────┘
```



## Reference

- [Cache Lines and Cache Size](http://www.nic.uoregon.edu/~khuck/ts/acumem-report/manual_html/ch03s02.html)
- [False Sharing in Java](https://jenkov.com/tutorials/java-concurrency/false-sharing.html)

- [并发刺客（False Sharing）——并发程序的隐藏杀手](https://www.cnblogs.com/Chang-LeHung/p/16550208.html)
- [False Sharing](https://daniel.mitterdorfer.name/posts/2014-03-28-false-sharing/)
