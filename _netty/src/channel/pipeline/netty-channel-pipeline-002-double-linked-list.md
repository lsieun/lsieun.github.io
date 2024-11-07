---
title: "Pipeline 双向链表"
sequence: "102"
---

[UP](/netty.html)

## 存储结构：双向链表

### 类定义

在 `DefaultChannelPipeline` 类中，定义了 `head` 和 `tail` 字段：

```java
public class DefaultChannelPipeline implements ChannelPipeline {
    final HeadContext head;
    final TailContext tail;

    protected DefaultChannelPipeline(Channel channel) {
        this.channel = ObjectUtil.checkNotNull(channel, "channel");

        head = new HeadContext(this);
        tail = new TailContext(this);

        head.next = tail;
        tail.prev = head;
    }

    final class HeadContext extends AbstractChannelHandlerContext
            implements ChannelOutboundHandler, ChannelInboundHandler {}
    
    final class TailContext extends AbstractChannelHandlerContext
            implements ChannelInboundHandler {}
}
```

在 `AbstractChannelHandlerContext` 类中，定义了 `prev` 和 `next` 字段：

```java
abstract class AbstractChannelHandlerContext implements ChannelHandlerContext, ResourceLeakHint {
    volatile AbstractChannelHandlerContext prev;
    volatile AbstractChannelHandlerContext next;
}
```

在 `DefaultChannelHandlerContext` 类中，定义了 `handler` 字段：

```java
final class DefaultChannelHandlerContext extends AbstractChannelHandlerContext {
    private final ChannelHandler handler;
}
```

### 结构图释

初始状态：

![](/assets/images/netty/channel/pipeline/netty-channel-pipeline-structure-001-init.svg)

添加一个 Handler：

![](/assets/images/netty/channel/pipeline/netty-channel-pipeline-structure-002-new.svg)

添加多个 Handler：

![](/assets/images/netty/channel/pipeline/netty-channel-pipeline-structure-003-many.svg)

### 特殊结构：Head 和 Tail

在上面的图中，`HeadContext` 和 `TailContext` 并没有关联 `handler`，
原因是两个类本身就实现了相应的 `ChannelHandler` 接口：

- `HeadContext`: `ChannelInboundHandler` 和 `ChannelOutboundHandler`
- `TailContext`: `ChannelInboundHandler`

![](/assets/images/netty/channel/context/netty-channel-handler-context-head-and-tail.svg)

## 链表操作

### 初始化

```java
public class DefaultChannelPipeline implements ChannelPipeline {
    private static final String HEAD_NAME = generateName0(HeadContext.class);
    private static final String TAIL_NAME = generateName0(TailContext.class);

    final HeadContext head;
    final TailContext tail;

    protected DefaultChannelPipeline(Channel channel) {
        this.channel = ObjectUtil.checkNotNull(channel, "channel");

        // NOTE: 链表 - 首尾元素创建
        head = new HeadContext(this);
        tail = new TailContext(this);

        // NOTE: 链表 - 首尾关联
        head.next = tail;
        tail.prev = head;
    }

    final class HeadContext extends AbstractChannelHandlerContext
            implements ChannelOutboundHandler, ChannelInboundHandler {

        private final Unsafe unsafe;

        HeadContext(DefaultChannelPipeline pipeline) {
            super(pipeline, null, HEAD_NAME, HeadContext.class);
            unsafe = pipeline.channel().unsafe();
            setAddComplete();
        }
    }
    
    final class TailContext extends AbstractChannelHandlerContext
            implements ChannelInboundHandler {

        TailContext(DefaultChannelPipeline pipeline) {
            super(pipeline, null, TAIL_NAME, TailContext.class);
            setAddComplete();
        }
    }
}
```

### 接口定义

在 `ChannelPipeline` 接口中，方法可以分成三个类别：

- handler
- context
- channel

```text
                                                   ┌─── addFirst
                                                   │
                                                   ├─── addLast
                                   ┌─── add ───────┤
                                   │               ├─── addBefore
                                   │               │
                                   │               └─── addAfter
                                   │
                                   │               ┌─── remove
                                   │               │
                                   ├─── remove ────┼─── removeFirst
                   ┌─── handler ───┤               │
                   │               │               └─── removeLast
                   │               │
                   │               ├─── replace ───┼─── replace
                   │               │
                   │               │               ┌─── get
                   │               │               │
                   │               │               ├─── first
                   │               │               │
                   │               └─── get ───────┼─── last
ChannelPipeline ───┤                               │
                   │                               ├─── names
                   │                               │
                   │                               └─── toMap
                   │
                   │               ┌─── context
                   │               │
                   ├─── context ───┼─── firstContext
                   │               │
                   │               └─── lastContext
                   │
                   └─── channel ───┼─── channel
```

### addLast 方法实现

在 Pipeline 中，对链表进行操作，一般经历 4 步：

- 第 1 步，对 handler 进行检查
- 第 2 步，将 handler 包装成 context
- 第 3 步，将 context 添加到 pipeline
- 第 4 步，事件传播：handler 添加或移除 

```java
public class DefaultChannelPipeline implements ChannelPipeline {
    @Override
    public final ChannelPipeline addLast(EventExecutorGroup group, String name, ChannelHandler handler) {
        final AbstractChannelHandlerContext newCtx;
        synchronized (this) {
            // NOTE: handler - 检查 handler 是否可以添加多次
            checkMultiplicity(handler);

            // NOTE: handler - 检查 name 是否重复
            String filteredName = filterName(name, handler);

            // NOTE: context - 将 handler 包装成 context
            newCtx = newContext(group, filteredName, handler);

            // NOTE: pipeline - 将 context 添加到 pipeline
            addLast0(newCtx);


            // NOTE: event 事件传播
            //  ChannelHandler.handlerAdded() 方法是否调用，与 registered 的值有关
            if (!registered) {
                // NOTE: 到这儿，说明 register 为 false
                newCtx.setAddPending();
                callHandlerCallbackLater(newCtx, true);
                return this;
            }

            EventExecutor executor = newCtx.executor();
            if (!executor.inEventLoop()) {
                // NOTE: 到这儿，说明 register 为 true，但是，线程并不是 EventLoop 中的线程
                callHandlerAddedInEventLoop(newCtx, executor);
                return this;
            }
        }

        // NOTE: 到这儿，说明 register 为 true，而且线程是 EventLoop 中的线程
        callHandlerAdded0(newCtx);
        return this;
    }
}
```

#### handler 检查

第 1 步，检查 handler 是否可以添加多次：

```java
public class DefaultChannelPipeline implements ChannelPipeline {
    private static void checkMultiplicity(ChannelHandler handler) {
        if (handler instanceof ChannelHandlerAdapter) {
            ChannelHandlerAdapter h = (ChannelHandlerAdapter) handler;
            // NOTE: 根据 @Sharable 注解和 added 字段进行判断
            //  当不存在 @Sharable 注解，并且 h.added 为 true 时，触发异常
            if (!h.isSharable() && h.added) {
                throw new ChannelPipelineException(
                        h.getClass().getName() +
                                " is not a @Sharable handler, so can't be added or removed multiple times.");
            }
            h.added = true;
        }
    }
}
```

第 2 步，检查 handler 名称是否重复：

```java
public class DefaultChannelPipeline implements ChannelPipeline {
    private String filterName(String name, ChannelHandler handler) {
        // NOTE: 第 1 种情况，name 为 null，生成新名称
        if (name == null) {
            return generateName(handler);
        }

        // NOTE: 第 2 种情况，name 不为 null，则检查 name 是否重复
        checkDuplicateName(name);
        return name;
    }

    private String generateName(ChannelHandler handler) {
        // NOTE: 第 1 步，检查 nameCaches 中是否存在
        Map<Class<?>, String> cache = nameCaches.get();
        Class<?> handlerType = handler.getClass();
        String name = cache.get(handlerType);
        if (name == null) {
            // NOTE: 第 2 步，如果不存在，则生成一个新名称
            name = generateName0(handlerType);
            cache.put(handlerType, name);
        }


        // It's not very likely for a user to put more than one handler of the same type, but make sure to avoid
        // any name conflicts.  Note that we don't cache the names generated here.
        // NOTE: 第 3 步，避免 name 重复
        if (context0(name) != null) {
            String baseName = name.substring(0, name.length() - 1); // Strip the trailing '0'.
            for (int i = 1; ; i++) {
                String newName = baseName + i;
                if (context0(newName) == null) {
                    name = newName;
                    break;
                }
            }
        }
        return name;
    }

    private static String generateName0(Class<?> handlerType) {
        return StringUtil.simpleClassName(handlerType) + "#0";
    }

    private void checkDuplicateName(String name) {
        if (context0(name) != null) {
            throw new IllegalArgumentException("Duplicate handler name: " + name);
        }
    }

    private AbstractChannelHandlerContext context0(String name) {
        // NOTE: 根据 name 检查 head 和 tail 之间的 ctx
        AbstractChannelHandlerContext context = head.next;
        while (context != tail) {
            if (context.name().equals(name)) {
                return context;
            }
            context = context.next;
        }
        return null;
    }
}
```

#### Context 创建

这一步，直接创建一个 `DefaultChannelHandlerContext` 对象：

```java
public class DefaultChannelPipeline implements ChannelPipeline {
    private AbstractChannelHandlerContext newContext(EventExecutorGroup group, String name, ChannelHandler handler) {
        // NOTE: 创建 DefaultChannelHandlerContext
        return new DefaultChannelHandlerContext(this, childExecutor(group), name, handler);
    }
}
```

#### Context 添加

这一步，是双向链表的操作：

```java
public class DefaultChannelPipeline implements ChannelPipeline {
    private void addLast0(AbstractChannelHandlerContext newCtx) {
        AbstractChannelHandlerContext prev = tail.prev;

        newCtx.prev = prev;
        newCtx.next = tail;

        prev.next = newCtx;
        tail.prev = newCtx;
    }
}
```

#### 事件触发

当添加 handler 完成之后，就会触发对应的事件：

```java
public class DefaultChannelPipeline implements ChannelPipeline {
    private void callHandlerAdded0(final AbstractChannelHandlerContext ctx) {
        ctx.callHandlerAdded();
    }
}
```

