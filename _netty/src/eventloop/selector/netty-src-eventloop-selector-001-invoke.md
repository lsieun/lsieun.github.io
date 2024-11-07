---
title: "EventLoop 对 Selector 的调用"
sequence: "101"
---

[UP](/netty.html)

![](/assets/images/netty/eventloop/selector/netty-eventloop-invoke-java-selector.svg)

## Java NIO

```text
Selector selector = Selector.open();

channel.register(selector, 0, null);
```

```java
package java.nio.channels;

public abstract class Selector implements Closeable {
    public static Selector open() throws IOException {
        return SelectorProvider.provider().openSelector();
    }
}
```

## Netty

```java
import java.io.IOException;
import java.nio.channels.SelectableChannel;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.SocketChannel;
import java.nio.channels.spi.SelectorProvider;
import java.util.Iterator;
import java.util.Set;

public class SelectorRun {
    public static void main(String[] args) throws IOException {
        // Selector.open();
        SelectorProvider provider = SelectorProvider.provider();
        Selector selector = provider.openSelector();

        SelectableChannel channel = SocketChannel.open();

        SelectionKey selKey = channel.register(selector, 0, null);
        selKey.interestOps(SelectionKey.OP_ACCEPT);

        selector.select();
        Set<SelectionKey> selectedKeys = selector.selectedKeys();
        Iterator<SelectionKey> it = selectedKeys.iterator();
        while (it.hasNext()) {
            SelectionKey key = it.next();
            it.remove();
            if (key.isAcceptable()) {
                System.out.println("ACCEPT");
            }
            if (key.isReadable()) {
                System.out.println("READ");
            }
            if (key.isWritable()) {
                System.out.println("WRITE");
            }
            if (key.isConnectable()) {
                System.out.println("CONNECT");
            }
        }

        selector.close();
    }
}
```



### NioEventLoopGroup

```java
public class NioEventLoopGroup extends MultithreadEventLoopGroup {
    public NioEventLoopGroup(int nThreads, Executor executor) {
        // NOTE: 这里使用了 SelectorProvider.provider()
        this(nThreads, executor, SelectorProvider.provider());
    }

    public NioEventLoopGroup(int nThreads, Executor executor, final SelectorProvider selectorProvider,
                             final SelectStrategyFactory selectStrategyFactory) {
        super(nThreads, executor, selectorProvider, selectStrategyFactory, RejectedExecutionHandlers.reject());
    }
}
```

```java
public abstract class MultithreadEventLoopGroup extends MultithreadEventExecutorGroup implements EventLoopGroup {
    protected MultithreadEventLoopGroup(int nThreads, Executor executor, Object... args) {
        super(nThreads == 0 ? DEFAULT_EVENT_LOOP_THREADS : nThreads, executor, args);
    }
}
```

```java
public abstract class MultithreadEventExecutorGroup extends AbstractEventExecutorGroup {
    protected MultithreadEventExecutorGroup(int nThreads, Executor executor, Object... args) {
        this(nThreads, executor, DefaultEventExecutorChooserFactory.INSTANCE, args);
    }

    protected MultithreadEventExecutorGroup(int nThreads, Executor executor,
                                            EventExecutorChooserFactory chooserFactory, Object... args) {
        if (executor == null) {
            executor = new ThreadPerTaskExecutor(newDefaultThreadFactory());
        }

        children = new EventExecutor[nThreads];
        for (int i = 0; i < nThreads; i ++) {
            children[i] = newChild(executor, args);
        }
    }
}
```

## Selector 何时创建

- 在 `NioEventLoop` 的构造方法中

