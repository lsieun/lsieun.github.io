---
title: "单例模式"
sequence: "101"
---

![](/assets/images/design-pattern/diagrams/singleton-structure.png)


## 为什么要使用单例？

Singleton is a design pattern that assures a single instance of a `Class` for the lifetime of an application.
It also provides a global point of access to that instance.

## 如何实现单例？

简单来说，要实现⼀个单例，需要考虑的问题：

- 创建对象
    - 构造方法私有：构造方法需要是 `private` 访问权限，这样才能避免外部通过 `new` 创建实例；
    - 创建时机：类加载时、初次使用时；考虑是否支持延迟加载；
    - 线程安全：考虑对象创建时的线程安全问题；
- 获取对象
    - 线程安全：考虑 `getInstance()` 性能是否高（是否加锁）。

单例模式的实现方式：

- 饿汉式
    - 枚举
- 懒汉式
    - synchronized
    - 双重检测
    - 静态内部类

Mostly, Singleton implementations face one or both of the following challenges:

- Eager loading
- Overhead due to synchronization

## 饿汉式

### 饿汉式

模板：

```java
public class EagerLoadedSingleton {
    // A. 构造方法私有
    private EagerLoadedSingleton() {
    }

    // B. 创建实例
    private static final EagerLoadedSingleton instance = new EagerLoadedSingleton();

    // C. 获取实例
    public static EagerLoadedSingleton getInstance() {
        return instance;
    }
}
```

示例：

```java
import java.util.concurrent.atomic.AtomicLong;

public class IdGenerator {
    private final AtomicLong id = new AtomicLong(0);

    // A. 构造方法私有
    private IdGenerator() {
    }

    public long getId() {
        return id.incrementAndGet();
    }

    // B. 创建时机：类加载时，不需要加锁
    private static final IdGenerator instance = new IdGenerator();

    // C. 获取时，不需要加锁
    public static IdGenerator getInstance() {
        return instance;
    }
}
```

```java
public class IdRunner {
    public static void main(String[] args) {
        IdGenerator instance = IdGenerator.getInstance();
        for (int i = 0; i < 10; i++) {
            long id = instance.getId();
            System.out.println("id = " + id);
        }
    }
}
```

### 枚举（推荐）

枚举对象是单例的，⼀种对象只会在内存中保存⼀份。

基于枚举类型的单例实现。这种实现方式通过 Java 枚举类型本身的特性，是最简单实现单例的方式，
保证了实例创建的线程安全性和实例的唯⼀性。

```java
import java.util.concurrent.atomic.AtomicLong;

public enum IdGenerator {
    // A. 不需要定义构造方法，默认带有 private 修饰符
    // B. 创建时机：类加载时，不需要加锁
    // C. 获取时，不需要加锁
    INSTANCE;

    private final AtomicLong id = new AtomicLong(0);

    public long getId() {
        return id.incrementAndGet();
    }
}
```

```java
public class IdRunner {
    public static void main(String[] args) {
        IdGenerator instance = IdGenerator.INSTANCE;
        for (int i = 0; i < 10; i++) {
            long id = instance.getId();
            System.out.println("id = " + id);
        }
    }
}
```

## 懒汉式

```java
public class LazyLoadedSingleton {
    // A. 构造方法私有
    private LazyLoadedSingleton() {
    }

    private static LazyLoadedSingleton instance;

    // C. 获取实例
    public static LazyLoadedSingleton getInstance() {
        if (null == instance) {
            // B. 创建实例
            instance = new LazyLoadedSingleton();
        }

        return instance;
    }
}
```

### 懒汉式（不推荐）

模板：

```java
public class LazyLoadedSynchronizedSingleton {
    // A. 构造方法私有
    private LazyLoadedSynchronizedSingleton() {
    }

    private static LazyLoadedSynchronizedSingleton instance;

    // C. 获取实例
    public static synchronized LazyLoadedSynchronizedSingleton getInstance() {
        if (null == instance) {
            // B. 创建实例
            instance = new LazyLoadedSynchronizedSingleton();
        }
        return instance;
    }
}
```

示例：

```java
import java.util.concurrent.atomic.AtomicLong;

public class IdGenerator {
    private final AtomicLong id = new AtomicLong(0);

    // A. 构造方法私有
    private IdGenerator() {
    }

    public long getId() {
        return id.incrementAndGet();
    }

    private static IdGenerator instance;

    // C. 获取时，需要加锁
    public static synchronized IdGenerator getInstance() {
        if (instance == null) {
            // B. 创建时机：第一次调用方法时，需要加锁
            instance = new IdGenerator();
        }
        return instance;
    }
}
```

不推荐理由：

Despite this class being thread-safe, we can see that there's a clear performance drawback:
each time we want to get the instance of our singleton, we need to acquire a potentially unnecessary lock.

### 双重校验（不推荐）

饿汉式不支持延迟加载，懒汉式有性能问题，不支持高并发。
那我们再来看⼀种既支持延迟加载，又支持高并发的单例实现方式，也就是双重检测实现方式。

不推荐理由：

- However, it should be noted that the **double-checked locking is broken prior to Java 5.**（理由不充分）
- 代码写的相对复杂（理由不充分）

模板：

```java
// DCL = Double-Checked Locking
public class LazyLoadedDclSingleton {
    // A. 构造方法私有
    private LazyLoadedDclSingleton() {
    }

    private static volatile LazyLoadedDclSingleton instance;

    // C. 获取实例
    public static LazyLoadedDclSingleton getInstance() {
        if (instance == null) {
            synchronized (LazyLoadedDclSingleton.class) {
                if (instance == null) {
                    // B. 创建实例
                    instance = new LazyLoadedDclSingleton();
                }
            }
        }
        return instance;
    }
}
```

One thing to keep in mind with this pattern is that
**the field needs to be `volatile`** to prevent cache incoherence issues.
In fact, the Java memory model allows the publication of partially initialized objects and
this may lead in turn to subtle bugs.

示例：


```java
import java.util.concurrent.atomic.AtomicLong;

public class IdGenerator {
    private final AtomicLong id = new AtomicLong(0);

    // A. 构造方法私有
    private IdGenerator() {
    }

    public long getId() {
        return id.incrementAndGet();
    }

    private static volatile IdGenerator instance;

    // C. 获取时，instance 为 null 时，需要加锁；不为 null 时，不需要加锁
    public static IdGenerator getInstance() {
        if (instance == null) {
            synchronized (IdGenerator.class) {
                if (instance == null) {
                    // B. 创建时机：第一次调用方法时，需要加锁
                    instance = new IdGenerator();
                }
            }
        }
        return instance;
    }
}
```

为什么需要两次判断 `if(instance==null)`?

第⼀次校验：由于单例模式只需要创建⼀次实例，如果后面再次调用 `getInstance` 方法时，则直接返回之前创建的实例，
因此大部分时间不需要执行同步方法里面的代码，大大提高了性能。
如果不加第⼀次校验的话，那跟上面的懒汉模式没什么区别，每次都要去竞争锁。

第二次校验：如果没有第二次校验，假设线程 t1 执行了第⼀次校验后，判断为 null，
这时 t2 也获取了 CPU 执行权，也执行了第⼀次校验，判断也为 null。
接下来 t2 获得锁，创建实例，释放锁。这时 t1 又获得 CPU 执行权，
由于之前已经进行了第⼀次校验，结果为 null（不会再次判断），获得锁后，直接创建实例。
结果就会导致创建多个实例。所以需要在同步代码里面进行第二次校验，如果实例为空，则进行创建。



### 静态内部类（推荐）

再来看⼀种比双重检测更加简单的实现方法，那就是利用 Java 的静态内部类。
它有点类似饿汉式，但又能做到了延迟加载。



The Bill Pugh or Holder Singleton pattern addresses both of them with the help of a private static inner class.

```java
public class LazyLoadedBillPughSingleton {
    // A. 构造方法私有
    private LazyLoadedBillPughSingleton() {
    }

    private static class SingletonHelper {
        // B. 创建实例
        private static final LazyLoadedBillPughSingleton instance = new LazyLoadedBillPughSingleton();
    }

    // C. 获取实例
    public static LazyLoadedBillPughSingleton getInstance() {
        return SingletonHelper.instance;
    }
}
```



示例：

```java
import java.util.concurrent.atomic.AtomicLong;

public class IdGenerator {
    private final AtomicLong id = new AtomicLong(0);

    // A. 构造方法私有
    private IdGenerator() {
    }

    public long getId() {
        return id.incrementAndGet();
    }

    // B. 创建时机：类加载时，不需要加锁
    private static final class InstanceHolder {
        private static final IdGenerator instance = new IdGenerator();
    }

    // C. 获取时，不需要加锁
    public static IdGenerator getInstance() {
        return InstanceHolder.instance;
    }
}
```

`SingletonHolder` 是⼀个静态内部类，当外部类 `IdGenerator` 被加载的时候，并不会创建。

`SingletonHolder` 实例对象。只有当调用 `getInstance()` 方法时，`SingletonHolder` 才会被加载，
这个时候才会创建 instance。instance 的唯⼀性、创建过程的线程安全性，都由 JVM 来保证。
所以，这种实现方法既保证了线程安全，又能做到延迟加载。



## Reference

- [Singletons in Java](https://www.baeldung.com/java-singleton)
- [Double-Checked Locking with Singleton](https://www.baeldung.com/java-singleton-double-checked-locking)
- [Drawbacks of the Singleton Design Pattern](https://www.baeldung.com/java-patterns-singleton-cons)
- [How to Serialize a Singleton in Java](https://www.baeldung.com/java-serialize-singleton)
- [Bill Pugh Singleton Implementation](https://www.baeldung.com/java-bill-pugh-singleton-implementation)
- [Singleton Design Pattern vs Singleton Beans in Spring Boot](https://www.baeldung.com/spring-boot-singleton-vs-beans)
