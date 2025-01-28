---
title: "线程池的拒绝策略"
sequence: "107"
---

[UP](/java-concurrency.html)


## 线程池与拒绝策略的关系

线程池的拒绝策略是通过 `ThreadPoolExecutor` 的构造方法中的 `RejectedExecutionHandler handler` 参数设置的。

```java
public class ThreadPoolExecutor extends AbstractExecutorService {
    public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              ThreadFactory threadFactory,
                              RejectedExecutionHandler handler) { // 拒绝策略是通过 handler 参数提供的
        // ...
    }
}
```

`RejectedExecutionHandler` 是一个接口：

```java
public interface RejectedExecutionHandler {
    void rejectedExecution(Runnable r, ThreadPoolExecutor executor);
}
```

## 线程池有哪几种拒绝策略？

`RejectedExecutionHandler` 有四个具体实现：

- AbortPolicy
- CallerRunsPolicy
- DiscardPolicy
- DiscardOldestPolicy

```java
public class ThreadPoolExecutor extends AbstractExecutorService {
    public static class AbortPolicy implements RejectedExecutionHandler {

        public AbortPolicy() {
        }

        // 第一种策略，抛出异常
        public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
            throw new RejectedExecutionException("Task " + r.toString() +
                    " rejected from " +
                    e.toString());
        }
    }

    public static class CallerRunsPolicy implements RejectedExecutionHandler {

        public CallerRunsPolicy() {
        }

        // 第二种策略，交给 caller 调用
        public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
            if (!e.isShutdown()) {
                r.run();
            }
        }
    }

    public static class DiscardPolicy implements RejectedExecutionHandler {

        public DiscardPolicy() {
        }

        // 第三种策略，新加入的任务，直接丢弃；什么都不需要做
        public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
        }
    }

    public static class DiscardOldestPolicy implements RejectedExecutionHandler {

        public DiscardOldestPolicy() {
        }

        // 第四种策略，让旧的任务出队列，让新任务进队列
        public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
            if (!e.isShutdown()) {
                e.getQueue().poll();
                e.execute(r);
            }
        }
    }
}
```

## Reference

- [线程池有哪几种拒绝策略](https://www.bilibili.com/video/BV1Dv411u7Z5/)
