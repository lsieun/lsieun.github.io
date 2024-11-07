---
title: "可见性"
sequence: "104"
---

[UP](/java-concurrency.html)


## 退不出的循环

```java
import java.util.concurrent.TimeUnit;

public class VariableVisibility {
    static boolean run = true;

    public static void main(String[] args) throws InterruptedException {
        Thread t = new Thread(() -> {
            while (run) {
                // ....
            }
        });
        t.start();

        TimeUnit.SECONDS.sleep(1);
        run = false; //  线程 t 不会如预想的停下来
    }
}
```

### 原因分析

为什么呢？分析一下：

第 1 步，初始状态，t 线程刚开始从主内存读取了 `run` 的值到工作内存。

![](/assets/images/java/concurrency/memory/jmm/variable-visibility-problem-001.png)

第 2 步，因为 t 线程要频繁从主内存中读取 `run` 的值，
JIT 编译器会将 `run` 的值缓存至自己工作内存中的高速缓存中，
减少对主存中 `run` 的访问，提高效率。

![](/assets/images/java/concurrency/memory/jmm/variable-visibility-problem-002.png)

第 3 步，1 秒之后，main 线程修改了 `run` 的值，并同步至主存，
而 t 是从自己工作内存中的高速缓存中读取这个变量的值，结果永远是旧值。

![](/assets/images/java/concurrency/memory/jmm/variable-visibility-problem-003.png)

### 解决方法

`volatile` 和 `synchronized` 都能保证共享变量的可见性；
但是，两者还是有区别的，`synchronized` 要创建 monitor 对象，是属于重量级的操作，
`volatile` 相对更轻量。在解决可见性上，推荐使用 `volatile` 关键字。

第一种方式，可以使用 `volatile` 关键字。

`volatile` 关键字，可以用来修饰成员变量和静态成员变量，
可以避免线程从自己的工作缓存中查找变量的值，必须到主存中获取它的值，线程操作 `volatile` 变量都是直接操作主存。

```java
import java.util.concurrent.TimeUnit;

public class VariableVisibility {
    // 注意：这里使用了 volatile 关键字
    static volatile boolean run = true;

    public static void main(String[] args) throws InterruptedException {
        Thread t = new Thread(() -> {
            while (run) {
                // ....
            }
        });
        t.start();

        TimeUnit.SECONDS.sleep(1);
        run = false;
    }
}
```

第二种方式，使用 `synchronized` 关键字。

```java
import java.util.concurrent.TimeUnit;

public class VariableVisibility {
    static volatile boolean run = true;

    // 定义一个 lock 对象
    static final Object lock = new Object();

    public static void main(String[] args) throws InterruptedException {
        Thread t = new Thread(() -> {
            while (true) {
                // 加锁
                synchronized (lock) {
                    if (!run) {
                        break;
                    }
                }
            }
        });
        t.start();

        TimeUnit.SECONDS.sleep(1);

        // 加锁
        synchronized (lock) {
            run = false;
        }
    }
}
```

## 可见性 vs 原子性

前面例子体现的实际就是**可见性**，它保证的是在多个线程之间，
一个线程对 `volatile` 变量的修改对另一个线程可见，**不能保证原子性**，
仅用在**一个写线程，多个读线程**的情况。

上例从字节码理解是这样的：

```text
getstatic     run   // 线程 t 获取 run 为 true 
getstatic     run   // 线程 t 获取 run 为 true 
getstatic     run   // 线程 t 获取 run 为 true 
getstatic     run   // 线程 t 获取 run 为 true 
putstatic     run   // 线程 main 修改 run 为 false，仅此一次  
getstatic     run   // 线程 t 获取 run 为 false 
```

比较一下，一个线程安全的例子：
两个线程，一个做 `i++` 操作，另一个做 `i--` 操作，只能保证看到最新值，不能解决指令交错：

```text
// 假设 i 的初始值为 0 
getstatic     i  //  线程 B - 获取静态变量 i 的值，线程内 i=0 
 
getstatic     i  //  线程 A - 获取静态变量 i 的值，线程内 i=0 
iconst_1         //  线程 A - 准备常量 1
iadd             //  线程 A - 自增，线程内 i=1 
putstatic     i  //  线程 A - 将修改后的值存入静态变量 i，静态变量 i=1 
 
iconst_1         //  线程 B - 准备常量 1
isub             //  线程 B - 自减，线程内 i=-1 
putstatic     i  //  线程 B - 将修改后的值存入静态变量 i，静态变量 i=-1
```

**注意**：`synchronized` 语句块，既可以保证代码块的**原子性**，也同时保证代码块内变量的**可见性**。
但缺点是 `synchronized` 是属于重量级操作，性能相对更低。

如果在前面示例的死循环中加入 `System.out.println()` 会发现即使不加 `volatile` 修饰符，
线程 t 也能正确看到对 `run` 变量的修改了，想一想为什么？

```java
import java.util.concurrent.TimeUnit;

public class VariableVisibility {
    static boolean run = true;

    public static void main(String[] args) throws InterruptedException {
        Thread t = new Thread(() -> {
            while (run) {
                // 注意：这里添加了打印语句，它的内部实现带有 synchronized 关键字
                System.out.println();
            }
        });
        t.start();

        TimeUnit.SECONDS.sleep(1);
        run = false;
    }
}
```
