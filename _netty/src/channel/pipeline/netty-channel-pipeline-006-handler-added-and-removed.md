---
title: "ChannelHandler: handlerAdded() + handlerRemoved()"
sequence: "106"
---

[UP](/netty.html)

## 介绍

另外，我们在 `HeadContext` 类中，注意 `invokeHandlerAddedIfNeeded()` 和 `readIfIsAutoRead()` 调用的地方：

- `invokeHandlerAddedIfNeeded()` 主要作用是对 `ChannelHandler.handlerAdded()` 方法调用
- `readIfIsAutoRead()` 主要是对 `Channel.beginRead()` 方法的调用

![](/assets/images/netty/channel/pipeline/netty-channel-pipeline-propagation-inbound-head-context-event.svg)

### 图示

![](/assets/images/netty/channel/handler/netty-channel-handler-event-add.svg)

## ChannelHandler

在 `ChannelHandler` 接口中定义了 `handlerAdded()` 和 `handlerRemoved()` 方法：

```java
public interface ChannelHandler {
    void handlerAdded(ChannelHandlerContext ctx) throws Exception;

    void handlerRemoved(ChannelHandlerContext ctx) throws Exception;
}
```

这两个方法存在一些『特殊的处理』，我们的目标就是理解这种『特殊的处理』是如何进行的。

## AbstractChannel

```java
public abstract class AbstractChannel extends DefaultAttributeMap implements Channel {
    private volatile boolean registered;
    
    protected abstract class AbstractUnsafe implements Unsafe {
        private boolean neverRegistered = true;

        @Override
        public final void register(EventLoop eventLoop, final ChannelPromise promise) {
            AbstractChannel.this.eventLoop = eventLoop;

            eventLoop.execute(new Runnable() {
                @Override
                public void run() {
                    // TRACE: channel.register(selector)
                    register0(promise);
                }
            });
        }

        private void register0(ChannelPromise promise) {
            // NOTE: 是否首次注册
            boolean firstRegistration = neverRegistered;

            doRegister();

            // NOTE: 不再是首次注册
            neverRegistered = false;

            // TRACE: Channel 进行 Register 的两个阶段完成，将 registered 设置为 true
            registered = true;

            // NOTE: pipeline - event - invokeHandlerAddedIfNeeded
            pipeline.invokeHandlerAddedIfNeeded();

            safeSetSuccess(promise);

            // NOTE: pipeline - event - fireChannelRegistered
            pipeline.fireChannelRegistered();

            if (isActive()) {
                if (firstRegistration) {
                    // NOTE: pipeline - event - fireChannelActive
                    pipeline.fireChannelActive();
                }
            }
        }
    }
}
```


## DefaultChannelPipeline

### 注册状态

在 `AbstractChannel` 类当中，定义了 `registered` 和 `neverRegistered` 字段：

```java
public abstract class AbstractChannel extends DefaultAttributeMap implements Channel {
    private volatile boolean registered;

    protected abstract class AbstractUnsafe implements Unsafe {
        private boolean neverRegistered = true;
    }
}
```

在 `DefaultChannelPipeline` 类当中，定义了 `registered` 和 `firstRegistration` 字段：

```java
public class DefaultChannelPipeline implements ChannelPipeline {
    private boolean registered;
    private boolean firstRegistration = true;
}
```

那么，这四个字段的关系是什么呢？或者说，Channel 的注册状态 和 Pipeline 的注册状态是什么关系呢？

`AbstractChannel.registered` 先变为 `true`，`DefaultChannelPipeline.registered` 后变为 `true`。

![](/assets/images/netty/channel/pipeline/netty-channel-pipeline-state-registered.svg)

### 待执行任务链表

第 1 步，待执行任务链表：

```java
public class DefaultChannelPipeline implements ChannelPipeline {
    // NOTE: 待执行任务链表
    private PendingHandlerCallback pendingHandlerCallbackHead;
}
```

第 2 步，具体的任务：

![](/assets/images/netty/channel/pipeline/netty-channel-pipeline-pending-handler-callback.svg)

```java
public class DefaultChannelPipeline implements ChannelPipeline {
    
    private abstract static class PendingHandlerCallback implements Runnable {
        final AbstractChannelHandlerContext ctx;
        PendingHandlerCallback next;

        PendingHandlerCallback(AbstractChannelHandlerContext ctx) {
            this.ctx = ctx;
        }

        abstract void execute();
    }

    // NOTE: 主要任务是调用 handlerAdded() 方法
    private final class PendingHandlerAddedTask extends PendingHandlerCallback {

        PendingHandlerAddedTask(AbstractChannelHandlerContext ctx) {
            super(ctx);
        }

        @Override
        public void run() {
            callHandlerAdded0(ctx);
        }

        @Override
        void execute() {
            callHandlerAdded0(ctx);
        }
    }

    // NOTE: 主要任务是调用 handlerRemoved() 方法
    private final class PendingHandlerRemovedTask extends PendingHandlerCallback {

        PendingHandlerRemovedTask(AbstractChannelHandlerContext ctx) {
            super(ctx);
        }

        @Override
        public void run() {
            callHandlerRemoved0(ctx);
        }

        @Override
        void execute() {
            callHandlerRemoved0(ctx);
        }
    }
}
```

第 3 步，添加任务到链表：

```java
public class DefaultChannelPipeline implements ChannelPipeline {
    // NOTE: 添加待执行任务
    private void callHandlerCallbackLater(AbstractChannelHandlerContext ctx, boolean added) {
        assert !registered;

        // NOTE: 第 1 步，创建 task
        PendingHandlerCallback task = added ? new PendingHandlerAddedTask(ctx) : new PendingHandlerRemovedTask(ctx);


        // NOTE: 第 2 步，添加 task
        PendingHandlerCallback pending = pendingHandlerCallbackHead;
        if (pending == null) {
            pendingHandlerCallbackHead = task;
        }
        else {
            // Find the tail of the linked-list.
            while (pending.next != null) {
                pending = pending.next;
            }
            pending.next = task;
        }
    }
}
```

第 4 步，链表中的每个任务进行执行：

```java
public class DefaultChannelPipeline implements ChannelPipeline {
    final void invokeHandlerAddedIfNeeded() {
        assert channel.eventLoop().inEventLoop();

        // NOTE: 执行一次
        if (firstRegistration) {
            firstRegistration = false;
            // We are now registered to the EventLoop. It's time to call the callbacks for the ChannelHandlers,
            // that were added before the registration was done.
            callHandlerAddedForAllHandlers();
        }
    }

    private void callHandlerAddedForAllHandlers() {
        // NOTE: 第 1 步，用『局部变量』替换『字段』
        final PendingHandlerCallback pendingHandlerCallbackHead;
        synchronized (this) {
            assert !registered;

            // NOTE: register 字段由 false 变为 true
            // This Channel itself was registered.
            registered = true;

            // NOTE: 用『局部变量』替换『字段』
            pendingHandlerCallbackHead = this.pendingHandlerCallbackHead;
            // Null out so it can be GC'ed.
            this.pendingHandlerCallbackHead = null;
        }

        // This must happen outside of the synchronized(...) block as otherwise handlerAdded(...) may be called
        // while holding the lock and so produce a deadlock
        // if handlerAdded(...) will try to add another handler from outside the EventLoop.
        // NOTE: 第 2 步，遍历执行任务
        PendingHandlerCallback task = pendingHandlerCallbackHead;
        while (task != null) {
            task.execute();
            task = task.next;
        }
    }
    
    private void callHandlerAdded0(final AbstractChannelHandlerContext ctx) {
        ctx.callHandlerAdded();
    }

    private void callHandlerRemoved0(final AbstractChannelHandlerContext ctx) {
        ctx.callHandlerRemoved();
    }
}
```

## AbstractChannelHandlerContext

![](/assets/images/netty/channel/context/netty-channel-handler-context-handler-state.svg)


### 状态定义

`AbstractChannelHandlerContext` 类定义了 `handlerState` 和 `HANDLER_STATE_UPDATER` 两个字段：

```java
abstract class AbstractChannelHandlerContext implements ChannelHandlerContext, ResourceLeakHint {
    /**
     * Neither ChannelHandler.handlerAdded() nor ChannelHandler.handlerRemoved() was called.
     */
    private static final int INIT = 0;
    /**
     * ChannelHandler.handlerAdded() is about to be called.
     */
    private static final int ADD_PENDING = 1;
    /**
     * ChannelHandler.handlerAdded() was called.
     */
    private static final int ADD_COMPLETE = 2;
    /**
     * ChannelHandler.handlerRemoved() was called.
     */
    private static final int REMOVE_COMPLETE = 3;
    
    private volatile int handlerState = INIT;

    private static final AtomicIntegerFieldUpdater<AbstractChannelHandlerContext> HANDLER_STATE_UPDATER =
            AtomicIntegerFieldUpdater.newUpdater(AbstractChannelHandlerContext.class, "handlerState");
}
```

### 状态修改

```java
abstract class AbstractChannelHandlerContext implements ChannelHandlerContext, ResourceLeakHint {
    final void setAddPending() {
        // NOTE: handlerState - INIT --> ADD_PENDING
        boolean updated = HANDLER_STATE_UPDATER.compareAndSet(this, INIT, ADD_PENDING);
        assert updated; // This should always be true as it MUST be called before setAddComplete() or setRemoved().
    }
    
    final boolean setAddComplete() {
        for (; ; ) {
            int oldState = handlerState;
            if (oldState == REMOVE_COMPLETE) {
                return false;
            }
            // Ensure we never update when the handlerState is REMOVE_COMPLETE already.
            // oldState is usually ADD_PENDING but can also be REMOVE_COMPLETE when an EventExecutor is used that is not
            // exposing ordering guarantees.
            // NOTE:
            //  handlerState - INIT --> ADD_COMPLETE
            //  handlerState - ADD_PENDING --> ADD_COMPLETE
            if (HANDLER_STATE_UPDATER.compareAndSet(this, oldState, ADD_COMPLETE)) {
                return true;
            }
        }
    }
    
    final void setRemoved() {
        // NOTE: handlerState --> REMOVE_COMPLETE
        handlerState = REMOVE_COMPLETE;
    }
}
```

### 状态使用

```java
abstract class AbstractChannelHandlerContext implements ChannelHandlerContext, ResourceLeakHint {
    final void callHandlerAdded() throws Exception {
        // NOTE: handlerState - INIT/ADD_PENDING --> ADD_COMPLETE
        if (setAddComplete()) {
            // NOTE: 调用 ChannelHandler.handlerAdded() 方法
            handler().handlerAdded(this);
        }
    }

    final void callHandlerRemoved() throws Exception {
        try {
            // Only call handlerRemoved(...) if we called handlerAdded(...) before.
            if (handlerState == ADD_COMPLETE) {
                handler().handlerRemoved(this);
            }
        }
        finally {
            // Mark the handler as removed in any case.
            setRemoved();
        }
    }

    private boolean invokeHandler() {
        // NOTE: 判断是否要执行 handler
        // Store in local variable to reduce volatile reads.
        int handlerState = this.handlerState;
        return handlerState == ADD_COMPLETE || (!ordered && handlerState == ADD_PENDING);
    }
}
```
