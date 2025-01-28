---
title: "Initialization Safety: this 逃逸"
sequence: "114"
---

[UP](/java-concurrency.html)


## 什么是 this 逃逸？

所谓 this 逃逸就是说，在类的构造方法还没执行完之前，其他线程就获得了 this 的引用并且去干一些事情，
但是这时的对象是不完善的，可能某些字段在 this 逃逸后才初始化，但是其它线程已经使用这些字段了。
多线程是发生 this 逃逸的条件，并且这种错误一旦发生就很危险，因为外界线程会访问到不完善的对象。

避免 this 逃逸的最好方法就是不要再构造方法中传递出 this 或者对象的属性。


## Publication and Escape

**Every time we make an object available to any other code outside of its current scope,
we basically publish that object.**

For instance, publishing happens

- when we return an object,
- store it into a public reference,
- or even pass it to another method.

**When we publish an object that we shouldn't have, we say that the object has escaped.**

```text
以前的时候，我不理解 Escape 是什么意思？
有 publish 概念，才能有 escape 的概念
```

There are many ways that we can let an object reference escape,
such as publishing the object before its full construction.
As a matter of fact, this is one of the common forms of escape:
**when the `this` reference escapes during object construction.**

When the `this` reference escapes during construction,
other threads may see that object in an improper and not fully-constructed state.
This, in turn, can cause weird thread-safety complications.

## Escaping with Threads

**One of the most common ways of letting the `this` reference escape is to start a thread in a constructor.**

### Constructor Explicit

```java
public class LoggerRunnable implements Runnable {

    public LoggerRunnable() {
        Thread thread = new Thread(this); // this escapes
        thread.start();
    }

    @Override
    public void run() {
        System.out.println("Started...");
    }
}
```

### Constructor Implicitly

It's also possible to pass the `this` reference implicitly:

```java
public class ImplicitEscape {
    
    public ImplicitEscape() {
        Thread t = new Thread() {

            @Override
            public void run() {
                System.out.println("Started...");
            }
        };
        
        t.start();
    }
}
```

As shown above, we're creating an anonymous inner class derived from the `Thread`.
**Since inner classes maintain a reference to their enclosing class,
the `this` reference again escapes from the constructor.**

## Alternatives

Instead of starting a thread inside a constructor, we can declare a dedicated method for this scenario:

```java
public class SafePublication implements Runnable {
    
    private final Thread thread;
    
    public SafePublication() {
        thread = new Thread(this);
    }

    @Override
    public void run() {
        System.out.println("Started...");
    }
    
    public void start() {
        thread.start();
    }
}
```

As shown above, we still publish the `this` reference to the Thread.
However, this time, we start the thread after the constructor returns:

```text
SafePublication publication = new SafePublication();
publication.start();
```

Therefore, the object reference does not escape to another thread before its full construction.

## 代码示例

```java
public class ThisEscape {
    private String value = "";
    public ThisEscape() {
        new Thread(new TestDemo()).start();
        Sleeper.sleep(1000);
        this.value = "this escape";
    }

    public class TestDemo implements Runnable {
        @Override
        public void run() {
            /** * 这里是可以通过 ThisEscape.this 调用外围类对象的，但是测试外围累对象可能还没有构造完成， * 所以会发生 this 逃逸现象 */
            System.out.println("value = " + ThisEscape.this.value);
        }
    }

    public static void main(String[] args) {
        ThisEscape instance = new ThisEscape();
    }
}
```

正确写法：

```java
public class FixThisEscape {
    private String value = "";
    private Thread thd;

    public FixThisEscape() {
        /** * 构造函数中可以创建 Thread 对象，但是不要启动，另外使用 start 方法启动线程 */
        thd = new Thread(new TestDemo());
        this.value = "this escape";
    }

    public void start() {
        thd.start();
    }

    public class TestDemo implements Runnable {
        @Override
        public void run() {
            System.out.println("value = " + FixThisEscape.this.value);
        }
    }

    public static void main(String[] args) {
        FixThisEscape instance = new FixThisEscape();
        instance.start();
    }
}
```

### 实例一：t2 打印出来的 a 为 null

```java
/**
 * 解决 this 逃逸的最好方法就是不要在构造方法中将 this 传递出去
 */
public class ThisEscapeOne {
    final String a;
    static ThisEscapeOne t;

    //这里将语句 1 写在最后也无效，因为可能会发生重排序，仍会发生逃逸
    public ThisEscapeOne() {
        t = this;       //1
        //这里延时 200ms，模拟构造方法其他字段的初始化
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        a = "ABC";      //2
    }

    public static void main(String[] args) {
        //t1 进行构造对象
        Thread t1 = new Thread(() -> {
            new ThisEscapeOne();
        });

        //t2 观测常量的值
        Thread t2 = new Thread(() -> {
            System.out.println(ThisEscapeOne.t.a);
        });

        t1.start();

        //尽量保证 t1 先启动
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
        }
        t2.start();
    }
}
```

### 示例二,打印结果为：Source:ThisEscapeTwo [id=null]

```java
/**
 * 对于相互包含的类，通过构造函数将自己 set 时可能会发生 this 逃逸
 */
public class ThisEscapeTwo {
    protected final String id;

    public ThisEscapeTwo(DataSource source) {
        source.setThisEscapeTwo(this);
        //延时 100ms，可能是初始化其它字段，也可能是其他耗时的操作
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
        }
        id = "ABC";
    }

    public void getMessage(String mess) {
        System.out.println("Source:" + mess);
    }

    @Override
    public String toString() {
        return "ThisEscapeTwo [id=" + id + "]";
    }

    public static void main(String[] args) {
        final DataSource s = new DataSource();
        Thread t = new Thread(() -> {
            new ThisEscapeTwo(s);
        });
        t.start();

        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        s.postMessage();
    }
}

//数据源
class DataSource {
    private ThisEscapeTwo escapeTwo;

    public void setThisEscapeTwo(ThisEscapeTwo escapeTwo) {
        this.escapeTwo = escapeTwo;
    }

    public void postMessage() {
        if (this.escapeTwo != null) {
            escapeTwo.getMessage(escapeTwo.toString());
        }
    }
}
```

## Reference

- [Why Not to Start a Thread in the Constructor?](https://www.baeldung.com/java-thread-constructor)
- [TSM01-J. Do not let the this reference escape during object construction](https://wiki.sei.cmu.edu/confluence/display/java/TSM01-J.+Do+not+let+the+this+reference+escape+during+object+construction)
