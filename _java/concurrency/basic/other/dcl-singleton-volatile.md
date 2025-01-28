---
title: "DCL 双重检查锁定"
sequence: "103"
---

[UP](/java-concurrency.html)


## 什么是 DCL 问题

在 Java 中，DCL 通常指的是 Double-Checked Locking（双重检查锁定）。

DCL 是一种用于**多线程**环境下懒加载**单例对象**的技术，它的基本思路是在对象还未被实例化时，
先通过一次判空，避免了每次获取对象时都需要加锁的开销，从而提高了程序的性能。

```text
多线程 --> 懒加载 --> 单例对象
```

但是，在 Java 中实现 DCL 是比较容易出现问题的，因为 Java 的内存模型允许指令重排，可能会导致在多线程环境下 DCL 失效，从而创建出多个对象实例。

为了解决这个问题，可以使用 `volatile` 关键字来保证 DCL 的正确性，或者使用其他线程安全的单例模式实现方式，例如静态内部类单例模式或枚举单例模式。

## 解决方案一

简单粗暴，直接初始化好对象然后进行使用。

```java
public class SingletonKerriganF {     
      
    private static class SingletonHolder {     
        static final SingletonKerriganF INSTANCE = new SingletonKerriganF();     
    }     
      
    public static SingletonKerriganF getInstance() {     
        return SingletonHolder.INSTANCE;     
    }     
}    
```

## 解决方案二

通过添加 `volatile` ，锁内外双重判空实现

```java
public class Singleton() {
    private volatile static Singleton singleton;

    private Sington() {
    }

    public static Singleton getInstance() {
        if (singleton == null) {
            synchronized (Singleton.class) {
                if (singleton == null) {
                    singleton = new Singleton();
                }
            }
        }
        return singleton;
    }
}  
```

## 解决方案三

更加高级的解法

```java
public class Singleton {

    private static Singleton singleton; // 这里没有 volatile 关键字    

    private Singleton() {
    }

    public static Singleton getInstance() {
        // 双重检查加锁    
        if (singleton == null) {
            synchronized (Singleton.class) {
                // 延迟实例化,需要时才创建    
                if (singleton == null) {

                    Singleton temp = null;
                    try {
                        temp = new Singleton();
                    } catch (Exception e) {
                    }
                    if (temp != null) {
                        // 为什么要做这个看似无用的操作，因为这一步是为了让虚拟机执行到这一步的时会才对 singleton 赋值，
                        // 虚拟机执行到这里的时候，必然已经完成类实例的初始化。
                        // 所以这种写法的 DCL 是安全的。
                        // 由于 try 的存在，虚拟机无法优化 temp 是否为 null  
                        singleton = temp;
                    }
                }
            }
        }
        return singleton;
    }
}
```

## Reference

- [DCL 详解](https://blog.csdn.net/qq_43230007/article/details/131162795)
- [Double-Checked Locking with Singleton](https://www.baeldung.com/java-singleton-double-checked-locking)
