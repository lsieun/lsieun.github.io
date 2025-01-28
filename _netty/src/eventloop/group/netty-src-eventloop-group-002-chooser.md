---
title: "EventLoop 选择器"
sequence: "102"
---

[UP](/netty.html)

## 选择器的作用

选择器的作用：对 EventLoopGroup 中的多个 EventLoop 进行轮询选择。

## 选择器的创建和使用

```java
public abstract class MultithreadEventExecutorGroup extends AbstractEventExecutorGroup {
    private final EventExecutor[] children;
    private final EventExecutorChooserFactory.EventExecutorChooser chooser;

    protected MultithreadEventExecutorGroup(int nThreads, Executor executor, Object... args) {
        // 第 1 步，提供 chooser factory 的默认实现
        this(nThreads, executor, DefaultEventExecutorChooserFactory.INSTANCE, args);
    }

    protected MultithreadEventExecutorGroup(int nThreads, Executor executor,
                                            EventExecutorChooserFactory chooserFactory,
                                            Object... args) {
        children = new EventExecutor[nThreads];
        for (int i = 0; i < nThreads; i++) {
            children[i] = newChild(executor, args);
        }

        // 第 2 步，获取 chooser
        chooser = chooserFactory.newChooser(children);
    }
    
    // 第 3 步，使用 chooser
    @Override
    public EventExecutor next() {
        return chooser.next();
    }
}
```

```java
public abstract class MultithreadEventLoopGroup extends MultithreadEventExecutorGroup implements EventLoopGroup {
    
    // 第 4 步，对返回数据进行类型转换
    @Override
    public EventLoop next() {
        return (EventLoop) super.next();
    }
}
```

## 接口和实现

### 接口定义

`EventExecutorChooserFactory` 和 `EventExecutorChooser` 接口定义如下：

```java
public interface EventExecutorChooserFactory {
    EventExecutorChooser newChooser(EventExecutor[] executors);

    interface EventExecutorChooser {
        EventExecutor next();
    }
}
```

### 具体实现

在 Netty 中，选择器提供了两种实现：

- 如果 `executes.length` 是 2 的 N 次方，就使用 `idx & (length - 1)` 方式，效率更高
- 如果 `executes.length` 不是 2 的 N 次方，就使用 `idx % length` 方式，效率相对较低

```java
public final class DefaultEventExecutorChooserFactory implements EventExecutorChooserFactory {
    public static final DefaultEventExecutorChooserFactory INSTANCE = new DefaultEventExecutorChooserFactory();

    private DefaultEventExecutorChooserFactory() { }

    @Override
    public EventExecutorChooser newChooser(EventExecutor[] executors) {
        if (isPowerOfTwo(executors.length)) {
            // NOTE: 优化
            return new PowerOfTwoEventExecutorChooser(executors);
        } else {
            // NOTE: 通用
            return new GenericEventExecutorChooser(executors);
        }
    }

    private static boolean isPowerOfTwo(int val) {
        // NOTE: 判断 val 是否为 2 的 N 次方
        return (val & -val) == val;
    }

    private static final class PowerOfTwoEventExecutorChooser implements EventExecutorChooser {
        private final AtomicInteger idx = new AtomicInteger();
        private final EventExecutor[] executors;

        PowerOfTwoEventExecutorChooser(EventExecutor[] executors) {
            this.executors = executors;
        }

        @Override
        public EventExecutor next() {
            // NOTE: idx & (length - 1)，效率更高
            return executors[idx.getAndIncrement() & executors.length - 1];
        }
    }

    private static final class GenericEventExecutorChooser implements EventExecutorChooser {
        // Use a 'long' counter to avoid non-round-robin behaviour at the 32-bit overflow boundary.
        // The 64-bit long solves this by placing the overflow so far into the future, that no system
        // will encounter this in practice.
        private final AtomicLong idx = new AtomicLong();
        private final EventExecutor[] executors;

        GenericEventExecutorChooser(EventExecutor[] executors) {
            this.executors = executors;
        }

        @Override
        public EventExecutor next() {
            // NOTE: idx % length，效率较低
            return executors[(int) Math.abs(idx.getAndIncrement() % executors.length)];
        }
    }
}
```
