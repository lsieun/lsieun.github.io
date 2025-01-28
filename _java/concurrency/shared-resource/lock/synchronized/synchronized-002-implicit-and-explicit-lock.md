---
title: "隐式锁、显示锁、互斥锁"
sequence: "102"
---

[UP](/java-concurrency.html)


## 隐式锁 和 显式锁

`synchronized` 可以放在哪些地方？

- 方法 （隐式锁）
    - 普通方法
    - 静态方法
- 代码块 （显式锁）

### 隐式锁

在普通方法上，使用 `synchronized` 关键字，会将 `this` 对象作为锁：

```java
public class HelloWorld {
    public synchronized void myMethod() {
        System.out.println("当前 this 对象");
    }
}
```

在静态方法上，使用 `synchronized` 关键字，会将 `Class` 作为锁：

```java
public class HelloWorld {
    public static synchronized void myMethod() {
        System.out.println("当前类的 Class 对象");
    }
}
```

### 显式锁

```java
public class HelloWorld {
    public void myMethod() {
        synchronized ("ABC") {
            System.out.println("ABC 对象");
        }
    }
}
```

```java
public class HelloWorld {
    public void myMethod() {
        synchronized (this) {
            System.out.println("this 对象");
        }
    }
}
```

```java
public class HelloWorld {
    private int num = 0;

    public void myMethod() {
        synchronized (Integer.valueOf(num)) {
            System.out.println("num 字段");
        }
    }
}
```

## 互斥锁

互斥性：保证了同一时刻，只有一个线程持有锁，其它线程跟这个持有锁的线程互斥，就处于等待中。

多个线程的互斥，只出现在“同一把锁”的情况下；如果有“多个不同的锁”，那么多个线程之间就不能构成互斥性。

- 同一个方法里的同一把锁
- 不同方法里的同一把锁
- 不同方法的不同锁

同一把锁的示例：

```java
public class HelloWorld {

    public synchronized void myMethod1() {
        // 当前锁的对象是 this
        System.out.println("myMethod1: " + Thread.currentThread().getName());
    }

    public void myMethod2() {
        // 当前锁的对象也是 this
        synchronized (this) {
            System.out.println("myMethod2: " + Thread.currentThread().getName());
        }
    }

    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();

        new Thread(() -> {
            while (true) {
                instance.myMethod1();
                try {
                    Thread.sleep(3000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();

        new Thread(() -> {
            while (true) {
                instance.myMethod2();

                try {
                    Thread.sleep(3000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }
}
```
