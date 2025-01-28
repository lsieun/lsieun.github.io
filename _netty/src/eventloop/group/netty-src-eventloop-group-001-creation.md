---
title: "EventLoopGroup 创建"
sequence: "101"
---

[UP](/netty.html)

![](/assets/images/netty/eventloop/netty-eventloop-relation.svg)

## EventLoopGroup 相关类

![](/assets/images/netty/eventloop/group/netty-eventloop-group-class-hierarchy.svg)

## 创建过程

![](/assets/images/netty/eventloop/group/netty-eventloop-group-parameter.svg)


### 线程数量

```java
public abstract class MultithreadEventLoopGroup extends MultithreadEventExecutorGroup implements EventLoopGroup {
    private static final int DEFAULT_EVENT_LOOP_THREADS;

    static {
        DEFAULT_EVENT_LOOP_THREADS = Math.max(
                1,
                SystemPropertyUtil.getInt("io.netty.eventLoopThreads", NettyRuntime.availableProcessors() * 2)
        );

        if (logger.isDebugEnabled()) {
            logger.debug("-Dio.netty.eventLoopThreads: {}", DEFAULT_EVENT_LOOP_THREADS);
        }
    }
}
```

### chooser - SelectStrategy

### RejectedExecutionHandlers

### Executor - ThreadPerTaskExecutor

### SelectorProvider

## GlobalEventExecutor
