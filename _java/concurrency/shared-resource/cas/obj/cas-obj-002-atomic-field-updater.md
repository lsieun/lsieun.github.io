---
title: "Atomic*FieldUpdater"
sequence: "102"
---

[UP](/java-concurrency.html)

## 概览

- AtomicReferenceFieldUpdater //  域    字段
- AtomicIntegerFieldUpdater
- AtomicLongFieldUpdater

## 存在意义

```java
/**
 * @description: 为什么有了AtomicLong还要使用AtomicLongFieldUpdater
 * 因为当需要进行原子限定的属性所属的类会被创建大量的实例对象,如果用AtomicLong,每个实例里面都要创建AtomicLong对象,从而多出内存消耗.显然是不合适的。
 * 因此出现了AtomicLongFieldUpdater（原子字段更新器），仅需要在抽象的父类中声明一个静态的更新器，就可以在各个对象中使用了。
 * AtomicLongFieldUpdater:
 *      基于反射的实用工具，可以对指定类的指定volatile字段进行原子更新。
 * volatile:
 *      声明变量是 volatile 的，JVM 保证了每次读变量都从内存中读，跳过 CPU cache 这一步,
 *      因此不会将该变量上的操作与其他内存操作一起重排序。
 *      volatile 保证了新值能立即同步到主内存，以及每次使用前立即从主内存刷新。
 *      volatile 的读性能消耗与普通变量几乎相同，但是写操作稍慢，因为它需要在本地代码中插入许多"内存屏障"指令来保证处理器不发生乱序执行。
 *      内存屏障：
 *          指令重排序时不能把后面的"指令重排序"到内存屏障之前的位置
 *      指令重排序:
 *          指CPU采用了允许将多条指令不按程序规定的顺序分开发送给各相应电路单元处理
 **/
@Slf4j
@ThreadSafe
public class ConcurrencyTest3 {
    //原子操作类
    private static AtomicLongFieldUpdater<ConcurrencyTest3> updater=AtomicLongFieldUpdater.newUpdater(ConcurrencyTest3.class,"count");
    //原子变量，使用volatile修饰，不能使用static修饰
    @Getter
    private volatile long count=100;

    public static void main(String[] args) {
        ConcurrencyTest3 concurrencyTest3=new ConcurrencyTest3();
        //如果concurrencyTest3中的count等于100，则更新count为120，返回true
        if (updater.compareAndSet(concurrencyTest3,100,120)){
            //输出更新后的count
            log.info("update success,count: {}",concurrencyTest3.getCount());
        }else {
            //更新失败，输出count
            log.info("update failed,count: {}",concurrencyTest3.getCount());
        }

        //此时count等于120，所以会返回false
        if (updater.compareAndSet(concurrencyTest3,100,120)){
            //输出更新后的count
            log.info("update success,count: {}",concurrencyTest3.getCount());
        }else {
            //更新失败，输出count
            log.info("update failed,count: {}",concurrencyTest3.getCount());
        }
    }
}
```

## set VS laySet

### 区别

`AtomicIntegerFieldUpdater` 类是 Java 并发包中的一个工具类，用于原子性地更新某个类中的 `int` 类型字段。
其中，`lazySet` 和 `set` 方法都是用于设置字段的值，但它们有一些区别：

1. **原子性：**
    - `set` 方法是一个原子操作，它会立即设置字段的值，并且保证在多线程环境下不会被中断。
    - `lazySet` 方法也会设置字段的值，但它并不保证立即对其他线程可见。它是一种“延迟可见性”的操作，在某些情况下，可能会提供更好的性能，但不保证在所有情况下都能保证其他线程立即看到最新的值。

2. **内存语义：**
    - `set` 方法具有强内存语义，即调用 `set` 方法后的操作具有与 `volatile` 字段相同的内存语义。这意味着在调用 `set` 方法后，会强制将修改的值立即刷新到主内存，并且强制其他线程从主内存中重新加载该值。
    - `lazySet` 方法则具有较弱的内存语义，它不保证修改的值何时会被写入主内存，也不保证其他线程何时会看到修改后的值。因此，它通常用于在性能要求较高的场景下，对于一些不需要立即对其他线程可见的情况。

总的来说，`set` 方法保证了立即的可见性和原子性，而 `lazySet` 方法则提供了更轻量级的操作，可能在某些情况下提供更好的性能，但牺牲了一定的可见性保证。选择使用哪种方法取决于具体的应用场景和性能要求。

### 示例

```java
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 预期目标：在某一次输出中，Get 获取的值比 Set 设置的值小。
 *
 * <ul>
 *     <li>Java 8，测试成功</li>
 *     <li>Java 17，没有测试成功；查看源码，我发现 set 和 lazySet 的实现是一样的</li>
 * </ul>
 */
public class SetVsLazySetRun {
    static AtomicInteger atomic = new AtomicInteger(0);
    public static void main(String[] args) {
        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                // 修改这里 set 和 lazySet 的区别
                atomic.lazySet(i);
                System.out.println("---> Set: " + i);
                try {
                    Thread.sleep(100);
                }
                catch (InterruptedException ignored) {
                }
            }
        }, "t1").start();

        new Thread(() -> {
            for (int i =0; i<10; i++) {
                int val = atomic.get();
                System.out.println("<--- Get: " + val);
                try {
                    Thread.sleep(100);
                }
                catch (InterruptedException ignored) {
                }
            }
        }, "t2").start();
    }
}
```

```text
---> Set: 2
<--- Get: 1
---> Set: 3
<--- Get: 2
---> Set: 4
<--- Get: 3
---> Set: 5
<--- Get: 4
```

### 应用场景

- set 方法：绝对的精确性，不允许出错
- lazySet 方法：性能更好，允许出现 stale（陈旧）数据；stale（陈旧）的数据，不影响程序的正常功能

这个有点像『布隆过滤器』，它不要求完全正确，允许有一定的误差，不影响程序正常运行。

## 注意事项

利用字段更新器，可以针对对象的某个域（Field）进行原子操作，只能配合 `volatile` 修饰的字段使用，
否则会出现异常

```text
Exception in thread "main" java.lang.IllegalArgumentException: Must be volatile type
```

## 示例

### 示例一：基本使用

```java
import java.util.concurrent.atomic.AtomicIntegerFieldUpdater;

public class FieldUpdaterRun {
    private volatile int field;

    public static void main(String[] args) {
        AtomicIntegerFieldUpdater<FieldUpdaterRun> fieldUpdater =
                AtomicIntegerFieldUpdater.newUpdater(FieldUpdaterRun.class, "field");

        FieldUpdaterRun instance = new FieldUpdaterRun();
        fieldUpdater.compareAndSet(instance, 0, 10);

        // 修改成功 field = 10
        System.out.println(instance.field);

        // 修改成功 field = 20
        fieldUpdater.compareAndSet(instance, 10, 20);
        System.out.println(instance.field);

        // 修改失败 field = 20
        fieldUpdater.compareAndSet(instance, 10, 30);
        System.out.println(instance.field);
    }
}
```

## Reference

- [Why and when to use AtomicIntegerFieldUpdater?](https://stackoverflow.com/questions/17153572/why-and-when-to-use-atomicintegerfieldupdater)
- [Atomic field updaters](https://www.javamex.com/tutorials/synchronization_concurrency_7_atomic_updaters.shtml)
- [Guide to AtomicIntegerFieldUpdater in Java](https://medium.com/double-pointer/guide-to-atomicintegerfieldupdater-in-java-f577e064ca88)
- [Save Your Memory in JVM with Atomic*FieldUpdater](https://dzone.com/articles/save-your-memory-in-jvm-with-atomicfieldupdater)
- [Java Multithreading 10: AtomicInteger](https://nicklee1006.github.io/Java-Multithreading-10-AtomicInteger/)
- [Guide to AtomicInteger in Java](https://medium.com/double-pointer/guide-to-atomicinteger-in-java-94c591189fea)
- [Guide to AtomicInteger in Java](https://howtodoinjava.com/java/multi-threading/atomicinteger-example/)
- [AtomicIntegerFieldUpdater](https://www.educative.io/courses/java-multithreading-for-senior-engineering-interviews/atomicintegerfieldupdater)
- [An Introduction to Atomic Variables in Java](https://www.baeldung.com/java-atomic-variables)
- [AtomicInteger](https://jenkov.com/tutorials/java-util-concurrent/atomicinteger.html)
- [Faster Atomic*FieldUpdaters for Everyone](https://shipilev.net/blog/2015/faster-atomic-fu/)
