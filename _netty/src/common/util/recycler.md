---
title: "Recycler"
sequence: "102"
---

[UP](/netty.html)

![](/assets/images/netty/util/localpool-cartoon-style-illustration.webp)

```text
A cartoon-style illustration featuring a large pond and a smaller pond connected by a stream.
Fish are swimming from the large pond to the smaller one.
A person is fishing in the small pond, catching fish and
deciding whether to release them back into the large pond or the small pond.
The setting is vibrant and colorful, depicting a sunny day with lush greenery around the ponds.
```

## 概览

Recycler 类，主要用于实现对象的回收重用，避免频繁创建和销毁对象导致的内存碎片问题，减轻 GC 的压力。

### 核心过程

![](/assets/images/netty/util/netty-util-recycler-simple.svg)

### 详细过程

- Recycler：负责『创建对象』
- Handle：负责『回收对象』
- LocalPool：负责『Handle 存储』

![](/assets/images/netty/util/netty-util-recycler-overview.svg)

### Guarded 和 Unguarded

在 Netty 中，关于 unguarded 和 guarded 的描述通常涉及到资源管理和错误处理策略，特别是在对象回收和重用方面。

两者的区别：

- Guarded：在执行操作前，进行必要的检查或使用同步机制以确保操作的安全性。这通常包括检查对象的状态是否适合回收，或确保在多线程环境中对共享资源的访问是安全的。
- Unguarded：在没有额外保护或校验的情况下执行操作。在 EnhancedHandle 的 unguardedRecycle 方法的上下文中，这意味着方法会尝试将对象回收到对象池中，而不进行状态检查或同步操作。
  这样可以提高性能，尤其是在高并发场景下，但同时也增加了使用不当导致的错误风险，如对象状态不一致或竞态条件。

```java
private static final class DefaultHandle<T> extends EnhancedHandle<T> {
    @Override
    public void recycle(Object object) {
        // 第 2 个参数是 true
        localPool.release(this, true);
    }

    @Override
    public void unguardedRecycle(Object object) {
        // 第 2 个参数是 false
        localPool.release(this, false);
    }
}
```

**应用场景**

在高性能和资源密集型应用中，如 Netty 通常用于处理网络通信，开发者可能需要在性能和安全性之间做出权衡。
使用 unguarded 方法可以减少延迟和开销，特别是在对象的创建和销毁非常频繁的场景中。
然而，这种方法需要开发者非常清楚其使用的上下文和潜在的风险。

**使用建议**

在决定是否使用 unguardedRecycle 之类的方法时，重要的是要考虑应用的具体需求：

- 如果性能是首要考虑，并且开发者能够确保使用这些对象的上下文不会引入错误，那么使用 unguarded 方法是合理的。
- 如果应用的健壯性和错误预防更为重要，或者在多线程环境中存在复杂的资源共享问题，那么推荐使用 guarded 方法来确保安全性。

在实际应用中，选择正确的方法需要综合考虑性能影响、错误风险以及维护的复杂性。

## 数据结构

### Recycler

```java
public abstract class Recycler<T> {
    // 这 3 个字段是给 LocalPool 使用的
    private final int maxCapacityPerThread;
    private final int chunkSize;
    private final int interval;

    // 每一个线程都有一个 LocalPool 对象
    private final FastThreadLocal<LocalPool<T>> threadLocal = new FastThreadLocal<LocalPool<T>>() {}
}
```

### LocalPool


```java
public abstract class Recycler<T> {
    private static final class LocalPool<T> implements MessagePassingQueue.Consumer<DefaultHandle<T>> {
        // ratio - newHandle()
        private final int ratioInterval;
        private int ratioCounter;

        // small pond
        private final int chunkSize;
        private final ArrayDeque<DefaultHandle<T>> batch;

        // large pond
        private volatile MessagePassingQueue<DefaultHandle<T>> pooledHandles;

        // thread
        private volatile Thread owner;
    }
}
```

```text
// By default, we allow one push to a Recycler for each 8th try on handles that were never recycled before.
// This should help to slowly increase the capacity of the recycler while not be too sensitive to allocation bursts.
RATIO = max(0, SystemPropertyUtil.getInt("io.netty.recycler.ratio", 8));
```

### DefaultHandle

```java
public abstract class Recycler<T> {
    private static final class DefaultHandle<T> extends EnhancedHandle<T> {
        private volatile int state;
        
        private final LocalPool<T> localPool;

        private T value;
    }
}
```


## 核心方法

### Recycler

在 `Recycler` 类中，第 1 个方法是 `newObject(Handle<T> handle)` 方法，它是 `Recycler` 类中唯一一个抽象方法，用于创建新的对象。

```java
public abstract class Recycler<T> {
    protected abstract T newObject(Handle<T> handle);
}
```

在 `Recycler` 类中，第 2 个方法是 `get()` 方法，它是 `Recycler` 类中唯一一个核心方法，用于获取对象。

```java
public abstract class Recycler<T> {
    public final T get() {
        if (maxCapacityPerThread == 0) {
            return newObject((Handle<T>) NOOP_HANDLE);
        }
        LocalPool<T> localPool = threadLocal.get();
        DefaultHandle<T> handle = localPool.claim();
        T obj;
        if (handle == null) {
            handle = localPool.newHandle();
            if (handle != null) {
                obj = newObject(handle);
                handle.set(obj);
            }
            else {
                obj = newObject((Handle<T>) NOOP_HANDLE);
            }
        }
        else {
            obj = handle.get();
        }

        return obj;
    }


}
```

### LocalPool

在 `LocalPool` 类中，第 1 个方法是 `accept()`，它来自 `MessagePassingQueue.Consumer` 接口；
该方法的作用是把 `DefaultHandle` 对象添加到 `batch` 队列中。

```java
public abstract class Recycler<T> {
    private static final class LocalPool<T> implements MessagePassingQueue.Consumer<DefaultHandle<T>> {
        @Override
        public void accept(DefaultHandle<T> e) {
            batch.addLast(e);
        }
    }
}
```

在 `LocalPool` 类中，第 2 个方法是 `claim()`，它的作用是从 `batch` 队列中获取一个 `DefaultHandle` 对象。

```java
public abstract class Recycler<T> {
    private static final class LocalPool<T> implements MessagePassingQueue.Consumer<DefaultHandle<T>> {
        DefaultHandle<T> claim() {
            // pooledHandles
            MessagePassingQueue<DefaultHandle<T>> handles = pooledHandles;
            if (handles == null) {
                return null;
            }

            // pooledHandles --> batch
            if (batch.isEmpty()) {
                handles.drain(this, chunkSize);
            }

            // batch --> handle
            DefaultHandle<T> handle = batch.pollFirst();
            if (null != handle) {
                handle.toClaimed();
            }
            return handle;
        }
    }
}
```

在 `LocalPool` 类中，第 3 个方法是 `release()`，它的作用是把 `DefaultHandle` 对象添加到 `batch` 或 `pooledHandles` 队列中；
同时，也考虑了线程终止状态。

```java
public abstract class Recycler<T> {
    private static final class LocalPool<T> implements MessagePassingQueue.Consumer<DefaultHandle<T>> {
        void release(DefaultHandle<T> handle, boolean guarded) {
            // NOTE: handle - 修改状态
            if (guarded) {
                handle.toAvailable();
            }
            else {
                handle.unguardedToAvailable();
            }

            // NOTE: handle - 回收
            Thread owner = this.owner;
            if (owner != null && Thread.currentThread() == owner && batch.size() < chunkSize) {
                // 回收到 batch
                accept(handle);
            }
            else if (owner != null && isTerminated(owner)) {
                this.owner = null;
                pooledHandles = null;
            }
            else {
                // 回收到 pooledHandles
                MessagePassingQueue<DefaultHandle<T>> handles = pooledHandles;
                if (handles != null) {
                    handles.relaxedOffer(handle);
                }
            }
        }
    }
}
```

在 `LocalPool` 类中，第 4 个方法是 `newHandle()`，它的作用是创建一个新的 `DefaultHandle` 对象；
在创建时，需要考虑 ratio 值，每 8 次调用创建一个 `DefaultHandle` 对象。

```java
public abstract class Recycler<T> {
    private static final class LocalPool<T> implements MessagePassingQueue.Consumer<DefaultHandle<T>> {
        DefaultHandle<T> newHandle() {
            if (++ratioCounter >= ratioInterval) {
                ratioCounter = 0;
                return new DefaultHandle<T>(this);
            }
            return null;
        }
    }
}
```

### DefaultHandle

在 `DefaultHandle` 类中，第 1 组方法是 `get()` 和 `set()`，它们表明了 handle 与 obj 之间的联系。

```java
public abstract class Recycler<T> {
    private static final class DefaultHandle<T> extends EnhancedHandle<T> {
        T get() {
            return value;
        }

        void set(T value) {
            this.value = value;
        }
    }
}
```

在 `DefaultHandle` 类中，第 2 组方法是 `recycle()` 和 `unguardedRecycle()`，它们的作用是回收 `DefaultHandle` 对象；
两者的区别在于调用 `localPool.release()` 时传递的参数不同。

```java
public abstract class Recycler<T> {
    private static final class DefaultHandle<T> extends EnhancedHandle<T> {
        @Override
        public void recycle(Object object) {
            if (object != value) {
                throw new IllegalArgumentException("object does not belong to handle");
            }
            localPool.release(this, true);
        }

        @Override
        public void unguardedRecycle(Object object) {
            if (object != value) {
                throw new IllegalArgumentException("object does not belong to handle");
            }
            localPool.release(this, false);
        }
    }
}
```

在 `DefaultHandle` 类中，第 3 组方法是 `toClaimed()`、`toAvailable()` 和 `unguardedToAvailable()`，它们的作用是修改 `state` 字段。

```java
public abstract class Recycler<T> {
    private static final class DefaultHandle<T> extends EnhancedHandle<T> {
        void toClaimed() {
            assert state == STATE_AVAILABLE;
            STATE_UPDATER.lazySet(this, STATE_CLAIMED);
        }

        void toAvailable() {
            int prev = STATE_UPDATER.getAndSet(this, STATE_AVAILABLE);
            if (prev == STATE_AVAILABLE) {
                throw new IllegalStateException("Object has been recycled already.");
            }
        }

        void unguardedToAvailable() {
            int prev = state;
            if (prev == STATE_AVAILABLE) {
                throw new IllegalStateException("Object has been recycled already.");
            }
            STATE_UPDATER.lazySet(this, STATE_AVAILABLE);
        }
    }
}
```

## 线程视角

### 线程环境

- [x] LocalPool 的所有者 `owner` 是谁？

```java
public abstract class Recycler<T> {
    private static final class LocalPool<T> implements MessagePassingQueue.Consumer<DefaultHandle<T>> {
        LocalPool(int maxCapacity, int ratioInterval, int chunkSize) {
            // thread
            Thread currentThread = Thread.currentThread();
            owner = !BATCH_FAST_TL_ONLY || currentThread instanceof FastThreadLocalThread ? currentThread : null;
        }
    }
}
```

在 Netty 的 Recycler 类中，BATCH_FAST_TL_ONLY 是一个常量，它用于指示是否启用了批量模式且仅基于 ThreadLocal 的实现。
这个常量通常与 DefaultHandle 类的属性相关联，用于控制对象池的行为。

当 `BATCH_FAST_TL_ONLY` 被设置为 `true` 时，表示启用了批量模式且仅基于 `ThreadLocal` 的实现。
这意味着对象的回收和重用仅在单个线程范围内进行，并且不涉及线程间的同步。
这种模式通常能够提供更好的性能，特别是在多线程并发访问对象池时。

然而，需要注意的是，启用 `BATCH_FAST_TL_ONLY` 也可能会带来一些限制。
例如，对象只能在创建它们的线程上进行回收，因此如果对象在一个线程上创建但在另一个线程上被释放，那么它可能无法被正确地回收和重用。

因此，开发者在使用 Recycler 类时需要根据具体情况权衡性能和限制，并选择合适的配置。

![](/assets/images/netty/util/netty-util-recycler-thread-view.svg)


### 安全

unguardedRecycle() 方法，它不会检查对象是否已经被回收，所以它可能会导致对象被重复回收。

## BlockingMessageQueue

## 注意事项

**池可能在不需要的对象上浪费内存**

对象池的大小需要根据游戏的需求设置。 当池子太小时，很明显需要调整（没有什么比崩溃更能获得你的注意力了）。 但是也要小心确保池子没有太大。更小的池子提供了空余的内存做其他有趣的事情。

- [对象池模式](https://gpp.tkchu.me/object-pool.html)

## 示例

### MyObject

![](/assets/images/netty/util/netty-util-recycler-my-obj.svg)


```java
import io.netty.util.Recycler;

public class MyObject {
    private static final Recycler<MyObject> RECYCLER = new Recycler<MyObject>() {
        @Override
        protected MyObject newObject(Handle<MyObject> handle) {
            return new MyObject(handle);
        }
    };

    public static MyObject newInstance() {
        return RECYCLER.get();
    }

    private final Recycler.EnhancedHandle<MyObject> handle;

    private String name;

    public MyObject(Recycler.Handle<MyObject> handle) {
        this.handle = (Recycler.EnhancedHandle<MyObject>) handle;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void recycle() {
        // 清空状态
        clearState();

        // 进行回收
        handle.recycle(this);
    }

    public void unguardedRecycle() {
        // 清空状态
        clearState();

        // 进行回收
        handle.unguardedRecycle(this);
    }

    void clearState() {
        this.name = null;
    }

    @Override
    public String toString() {
        return String.format("MyObject {name = '%s', hash = %d}", name, System.identityHashCode(this));
    }
}
```

### 示例1:基本使用


```java
public class MyObjectRun001Simple {
    public static void main(String[] args) {
        // obj1
        MyObject obj1 = MyObject.newInstance();
        obj1.setName("hello");
        System.out.println(obj1);
        obj1.recycle();

        // obj2
        MyObject obj2 = MyObject.newInstance();
        obj2.setName("world");
        System.out.println(obj2);
        obj2.recycle();

        // obj1 == obj2
        System.out.println(obj1 == obj2);
    }
}
```

### 示例2:逐步增加的 handle

### 示例3:回收不了的 handle

这个操作，有可能成功，也有可能失败：

```text
handles.relaxedOffer(handle);
```

### 示例4:多线程 UnguardedRecycle

```java
public class MyObjectRun004MultiThreadUnguardedRecycle {
    public static void main(String[] args) throws InterruptedException {
        // main - obj
        MyObject obj = MyObject.newInstance();
        obj.setName("tomcat");
        System.out.println(obj);

        // task
        Runnable task = () -> {
            Thread thread = Thread.currentThread();
            String threadName = thread.getName();
            String msg = String.format("%s - %s", threadName, obj);
            System.out.println(msg);
            obj.unguardedRecycle();
        };


        // t1, t2
        Thread t1 = new Thread(task, "t1");
        Thread t2 = new Thread(task, "t2");
        t1.start();
        t2.start();

        // main - sleep
        Thread.sleep(3000);

        // main - obj1
        MyObject obj1 = MyObject.newInstance();
        System.out.println(obj1);

        // main - obj2
        MyObject obj2 = MyObject.newInstance();
        System.out.println(obj2);
    }
}
```

输出信息：

```text
MyObject {name = 'tomcat', hash = 519569038}
t1 - MyObject {name = 'tomcat', hash = 519569038}
t2 - MyObject {name = 'null', hash = 519569038}
Exception in thread "t2" java.lang.IllegalStateException: Object has been recycled already.    // 阻止线程 t2 重用对象
	at io.netty.util.Recycler$DefaultHandle.toAvailable(Recycler.java:293)
	at io.netty.util.Recycler$LocalPool.release(Recycler.java:373)
	at io.netty.util.Recycler$DefaultHandle.recycle(Recycler.java:266)
	at io.netty.example.recycle.MyObject.recycle(MyObject.java:38)
	at io.netty.example.recycle.MyObjectUnguardedRun.lambda$main$0(MyObjectUnguardedRun.java:16)
	at java.lang.Thread.run(Thread.java:750)
MyObject {name = 'null', hash = 519569038}
MyObject {name = 'null', hash = 1057941451}
```

在 `Recycler.DefaultHandle#unguardedToAvailable()` 方法中，
调用 `STATE_UPDATER.lazySet()` 之前添加 `Thread.sleep(0)` 语句，以允许其他线程获取对象。

```java
public abstract class Recycler<T> {
    private static final class DefaultHandle<T> extends EnhancedHandle<T> {
        void unguardedToAvailable() {
            int prev = state;
            if (prev == STATE_AVAILABLE) {
                throw new IllegalStateException("Object has been recycled already.");
            }

            // === 开始
            try {
                Thread.sleep(100);
            }
            catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            // === 结束

            STATE_UPDATER.lazySet(this, STATE_AVAILABLE);
        }
    }
}
```

输出内容：

```text
MyObject {name = 'tomcat', hash = 519569038}
t1 - MyObject {name = 'tomcat', hash = 519569038}
t2 - MyObject {name = 'tomcat', hash = 519569038}
MyObject {name = 'null', hash = 519569038}          // 同一个对象，说明回收出现了问题
MyObject {name = 'null', hash = 519569038}          // 同一个对象，说明回收出现了问题
```

## Reference

在 Netty 4.1.108 版本中，下面是 Recycler 类的实现原理的详细解析：

1. Recycler 类的内部结构：

Recycler 类中的主要成员变量包括：stacks、threadLocal和handleRecycler。

- stacks：用于存储对象的 Stack 实例，每个 Stack 实例对应一个线程。
- threadLocal：用于获取当前线程对应的 Stack 实例。
- handleRecycler：用于获取对象的句柄，包含了对象在 Stack 实例中的位置信息。

2. Recycler 类的核心方法：

- static Recycler newInstance(Handler<T> handle)：用于创建一个新的 Recycler 实例，参数 handle 是用于获取对象句柄的回调接口。

- T get()：从 Recycler 中获取一个对象，如果当前线程上没有对应的 Stack 实例，则会创建一个新的 Stack 实例。然后从 Stack 中弹出一个对象，如果 Stack 中没有对象，则会调用 handleRecycle() 方法创建新对象。

- void recycle(T object)：将对象重新放入 Recycler 中，将对象推入当前线程对应的 Stack 实例的栈顶。

3. Recycler 类的工作流程：

- 首先创建一个 Recycler 实例，并通过 newInstance() 方法传入 Handle 对象。
- 线程 A 中调用 get() 方法时，先获取当前线程对应的 Stack 实例，如果没有则创建一个新的 Stack 实例。然后从 Stack 中取出一个对象，如果 Stack 中没有对象，则调用 handleRecycle() 方法创建一个新的对象。将对象返回给线程 A。
- 线程 A 使用完对象后，调用 recycle() 方法将对象放回 Recycler 中。
- 线程 B 在调用 get() 方法时，会得到一个来自线程 A 放回的对象。这样就实现了对象的重用。

总的来说，Recycler 类通过维护每个线程对应的 Stack 实例，实现了对象的回收重用。这样可以避免频繁创建和销毁对象，提高性能并减少内存碎片问题。
