---
title: "synchronized"
sequence: "101"
---

[UP](/java-concurrency.html)


- 锁信息存放
- 三种锁：偏向锁、轻量级锁、重量级锁

## 锁信息存放

- Java 对象
    - 对象头
    - 实例数据
    - 对齐填充字符 (对齐 8 位)

- 对象头
    - Mark Word：对象的 Hashcode、分代年龄、GC 标记、锁的标记
        - 如果是 32 位虚拟机，就是 32 bit
        - 如果是 64 位虚拟机，就是 64 bit
    - 指向类的指针
        - 如果是 32 位虚拟机，就是 32 bit
        - 如果是 64 位虚拟机，就是 64 bit
    - 数组长度（只有数组对象才有）
        - 无论是 32 位，还是 64 位，长度都是 32 bit

```text
对象头 --> Mark Word --> 锁的标记
```

## 锁的状态

- 无锁状态：对象的 Hashcode、分代年龄、是否偏向锁、锁的标志位
- 偏向锁状态：线程 ID、Epoch（偏向锁的时间戳）、分代年龄、是否偏向锁、锁标志位
- 轻量级锁状态：指向栈中锁记录的指针、锁标志位
- 重量级锁状态：指向重量级锁的指针、锁标志位

锁的升级：

```text
偏向锁 --> 轻量级锁 --> 重量级锁
```

**偏向锁**避免的是**轻量级锁**产生的性能损耗，
**轻量级锁**避免的是**重量级锁**产生的性能损耗。

现在的虚拟机，对 synchronized 同步锁的处理，基本上都是先从“偏向锁”开始：

```text
偏向锁 -- 升级 --> 轻量级锁 -- 升级 --> 重量级锁
```

在程序执行 `synchronized` 同步块时，具体使用哪一种锁（偏向锁、轻量级锁、重量级锁），不是人为决定的，而是由 JVM 决定的。

### 偏向锁

每次访问同步块（`synchronized`），都需要获取锁；退出的时候，需要释放锁；

在实际运行过程中，对这个同步块（`synchronized`）的访问，可能只有一个线程，并没有多线程的并发访问，
这个时候加锁和释放锁的效率就比较低，就出现了多种类型的锁，目的就尽可能减少消耗资源，并且提高程序运行性能。

### 轻量级锁

Lock Record

Displaced Mark Word

CAS: Compare And Swap

CAS 操作 Markword 成功，表示线程获取到同步块的锁；
如果操作失败，表示有竞争，锁被别的线程获取到了。
这个时候，线程就“自旋”来等待获取锁。

自旋，就是让一个线程去执行一个无意的循环。比如：

```text
while(true) {
    //
    // 考虑的两个因素： 
    // 第 1 个因素，每次自旋的时间
    // 第 2 个因素，自旋的次数
}
```

自旋，消耗的就是 CPU 的时间，目的是为了等待自旋结束后，重新去竞争锁。

轻量级锁，主要避免：在很短时间内，对线程进行阻塞、唤醒这样的操作（阻塞和唤醒的代价太大了），
从而节省资源，提高程序运行的性能。

轻量级锁的目的，并不是为了代替重量级锁，它本身是在没有多线程竞争，或者比较少量的竞争的前提下，尽量减少使用系统互斥量的操作产生的性能消耗。

轻量级锁的缺点：

```text
轻量级锁，使用 CAS 和 自旋 操作；重量级锁，使用互斥量。
```

### 重量级锁

重量级锁，就是使用 monitor 机制，消耗的资源最多，性能也最差。

### 总结

<table>
    <thead>
    <tr>
        <th>锁类型</th>
        <th>优点</th>
        <th>缺点</th>
        <th>适用场景</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>偏向锁</td>
        <td>除了第一次加锁，其它的加锁、解锁基本不需要额外的开销</td>
        <td>如果发生线程竞争，要先释放锁，这是额外的开销</td>
        <td>只有一个线程来调用同步块的时候</td>
    </tr>
    <tr>
        <td>轻量级锁</td>
        <td>相互竞争的线程不会阻塞，提高程序的响应速度</td>
        <td>使用自旋会额外消耗 CPU</td>
        <td>追求响应时间<br/>同步块执行速度很快</td>
    </tr>
    <tr>
        <td>重量级锁</td>
        <td>线程竞争不会自旋，不额外消耗 CPU（但是消耗操作系统级别的资源）</td>
        <td>线程阻塞；线程调度和切换，会消耗额外资源</td>
        <td>追求吞吐量；同步块执行时间较长</td>
    </tr>
    </tbody>
</table>

## monitor 机制

monitor 机制概述： Monitor 是一个同步工具，或者说是一种同步机制。

特点：

- 互斥
- 提供 signal 机制

实现：Monitor 是依赖于底层操作系统的 Mutext Lock 实现。
也就是说，它是由操作系统来实现线程之间的切换，需要从“用户态”到“操作系统内核态”的一个转化，成本相对比较高，
因此，Monitor 是一个重量级锁的实现机制。

Java 与 Monitor，或者说，Java 对于 Monitor 的支持？

在 Java 中，每一个对象都是“天生”的 Monitor，所以 Monitor 在 Java 中也被称为“内置锁”或 "Intrinsic Lock"或者"Monitor Lock"。。

在 Java 语言中，内置锁是指通过关键字 synchronized 来实现的一种同步机制。内置锁可以用于确保多个线程对共享资源的安全访问，防止出现竞争条件和数据不一致性。

当一个线程进入一个使用 synchronized 关键字修饰的代码块或方法时，它就获得了对象级别的锁，也称为内置锁。其他线程在尝试访问同一对象上被 synchronized 修饰的代码块或方法时，需要等待该锁的释放才能继续执行。

内置锁的特点包括：

独占性：一次只能有一个线程持有内置锁，其他线程需要等待锁的释放才能获取锁。
互斥性：当一个线程持有内置锁时，其他线程无法同时持有该锁，以确保对共享资源的互斥访问。
释放性：当线程退出 synchronized 代码块或方法时，会自动释放内置锁，使得其他线程可以获取该锁。
内置锁的使用方便简单，是 Java 语言中常用的同步机制之一。然而，需要注意的是，过多地使用内置锁可能会导致性能问题，因为所有对共享资源的访问都会串行化，降低了程序的并发性能。因此，在实际开发中，需要结合具体场景和需求，合理选择合适的同步机制来确保程序的正确性和性能。

在 Java 中，内置锁通常被称为"Intrinsic Lock"或者"Monitor Lock"。 "Intrinsic Lock"是指与对象关联的锁，也称为对象级别的锁。
当一个线程进入了被 synchronized 修饰的代码块或方法时，它就获得了这个对象的"Intrinsic Lock"，其他线程需要等待这个锁的释放才能继续执行相关的代码块或方法。

synchronized 与 monitor 的关系？

synchronized 关键字就是使用 monitor 实现**重量锁**的机制。

## Monitor 在 JVM 中的基本实现

- 数据方面
    - monitor 是线程私有的数据结构
    - 由 ObjectMonitor 实现的，几个关键属性：
        - _owner
        - _WaitSet
        - _EntryList
        - _recursions
        - _count
- 指令层面
  - monitorenter
  - monitorexit

synchronized 关键字使用

- 基本功能
- 隐式锁和显示锁
- 互斥性

```java
public class SynchronizedLock {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        new Thread(() -> {
            while (true) {
                String info = String.format("now in === %s, num == %d",
                        Thread.currentThread().getName(),
                        instance.genNum()
                );
                System.out.println(info);

                try {
                    Thread.sleep(100L);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();

        new Thread(() -> {
            while (true) {
                String info = String.format("now in === %s, num == %d",
                        Thread.currentThread().getName(),
                        instance.genNum()
                );
                System.out.println(info);

                try {
                    Thread.sleep(100L);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();

        new Thread(() -> {
            while (true) {
                String info = String.format("now in === %s, num == %d",
                        Thread.currentThread().getName(),
                        instance.genNum()
                );
                System.out.println(info);

                try {
                    Thread.sleep(100L);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();

        new Thread(() -> {
            while (true) {
                String info = String.format("now in === %s, num == %d",
                        Thread.currentThread().getName(),
                        instance.genNum()
                );
                System.out.println(info);

                try {
                    Thread.sleep(100L);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }
}

class HelloWorld {
    // 临界资源，多个线程共享访问的资源
    private int num;

    public int getNum() {
        return num;
    }

    public synchronized int genNum() {
        // 首先是计算 num + 1
        // 把𣚮?赋值给 num
        System.out.println("current Thread: " + Thread.currentThread().getName());
        return num++;
    }
}
```

## 特性

### 可重入

```java
public class LockReentrantRun {
    public static void main(String[] args) {
        Object lock = new Object();
        synchronized (lock) {
            LogUtils.log("First time acquiring it");

            synchronized (lock) {
                LogUtils.log("Entering again");

                synchronized (lock) {
                    LogUtils.log("And again");
                }
            }
        }
    }

}
```

```java
public class LockReentrantRun {
    private static final Object lock = new Object();

    public static void main(String[] args) {
        method1();
    }

    public static void method1() {
        synchronized (lock) {
            LogUtils.log("execute method1");
            method2();
        }
    }

    public static void method2() {
        synchronized (lock) {
            LogUtils.log("execute method2");
            method3();
        }
    }

    public static void method3() {
        synchronized (lock) {
            LogUtils.log("execute method3");
        }
    }

}
```

## Reference

- [synchronized monitor 机制（一）](https://www.bilibili.com/video/BV1a541187XZ/)
- [synchronized monitor 机制（二）](https://www.bilibili.com/video/BV1J64y1c7sb/)
- [偏向锁、轻量级锁、重量级锁、锁重入、锁自旋（一）](https://www.bilibili.com/video/BV1Nf4y19774/)
- [偏向锁、轻量级锁、重量级锁、锁重入、锁自旋（二）](https://www.bilibili.com/video/BV14C4y187WP/)

- [synchronized 锁机制、隐式锁、显式锁、互斥锁](https://www.bilibili.com/video/BV1bD4y127hk/)
- [透彻理解 AQS 源码分析系列](https://www.bilibili.com/video/BV1HZ4y1N7NP/)
- []()
