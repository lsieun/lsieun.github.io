---
title: "Selector 空轮询"
sequence: "103"
---

[UP](/netty.html)

Nio 空轮询 bug 在哪里体现，如何解决？

- 重新创建一个 Selector，替换旧的 Selector。

JDK 只在 Linux 的 Selector 有 Bug

## 空轮询检查

检查标准：如果 for 循环执行了 `SELECTOR_AUTO_REBUILD_THRESHOLD` 次 （默认为 512 次），没有执行任何 Channel IO 事件 和 普通任务，
此时 Netty 认为『空轮询』出现了。

```java
public final class NioEventLoop extends SingleThreadEventLoop {
    @Override
    protected void run() {
        // 第 1 步，初始化 selectCnt 值为 0
        int selectCnt = 0;
        for (; ; ) {
            int strategy = selectStrategy.calculateStrategy(selectNowSupplier, hasTasks());
            switch (strategy) {
                case SelectStrategy.CONTINUE:
                    continue;
                case SelectStrategy.BUSY_WAIT:
                case SelectStrategy.SELECT:
                    strategy = select(curDeadlineNanos);
                default:
            }

            // 第 2 步，每循环一次 selectCnt 自增
            selectCnt++;

            processSelectedKeys();
            boolean ranTasks = runAllTasks(timeoutNanos);

            // 第 3 步，正常循环。ranTasks 为 true，说明有普通任务执行；strategy 大于 0，表示有 Channel IO 事件发生。
            if (ranTasks || strategy > 0) {
                if (selectCnt > MIN_PREMATURE_SELECTOR_RETURNS && logger.isDebugEnabled()) {
                    logger.debug("Selector.select() returned prematurely {} times in a row for Selector {}.",
                            selectCnt - 1, selector);
                }
                // 将 selectCnt 重置为 0
                selectCnt = 0;
            }
            // 第 4 步，处理空轮询的情况
            else if (unexpectedSelectorWakeup(selectCnt)) { // Unexpected wakeup (unusual case)
                // 如果为 true，就将 selectCnt 重置为 0
                selectCnt = 0;
            }
        }
    }

    private boolean unexpectedSelectorWakeup(int selectCnt) {
        // NOTE: SELECTOR_AUTO_REBUILD_THRESHOLD 默认为 512
        if (SELECTOR_AUTO_REBUILD_THRESHOLD > 0 &&
                selectCnt >= SELECTOR_AUTO_REBUILD_THRESHOLD) {
            // The selector returned prematurely many times in a row.
            // Rebuild the selector to work around the problem.
            logger.warn("Selector.select() returned prematurely {} times in a row; rebuilding Selector {}.",
                    selectCnt, selector);
            
            // 解决方案：对 Selector 进行重新构建
            rebuildSelector();
            return true;
        }
        return false;
    }
}
```

## 解决方式

```java
public final class NioEventLoop extends SingleThreadEventLoop {
    public void rebuildSelector() {
        // 如果不是 EventLoop 线程，则提交一个任务
        if (!inEventLoop()) {
            execute(new Runnable() {
                @Override
                public void run() {
                    rebuildSelector0();
                }
            });
            return;
        }

        // 如果是 EventLoop 线程，则直接运行
        rebuildSelector0();
    }

    private void rebuildSelector0() {
        final Selector oldSelector = selector;


        // 第 1 步，生成新的 Selector Tuple
        final SelectorTuple newSelectorTuple = openSelector();


        // 第 2 步，将注册的 channel 由旧 selector 转移到新 selector 上
        // Register all channels to the new Selector.
        int nChannels = 0;
        for (SelectionKey key : oldSelector.keys()) {
            // a 中存储的是 NioServerSocketChannel 或 NioSocketChannel
            Object a = key.attachment();

            if (!key.isValid() || key.channel().keyFor(newSelectorTuple.unwrappedSelector) != null) {
                continue;
            }

            int interestOps = key.interestOps();
            key.cancel();
            SelectionKey newKey = key.channel().register(newSelectorTuple.unwrappedSelector, interestOps, a);
            if (a instanceof AbstractNioChannel) {
                // Update SelectionKey
                ((AbstractNioChannel) a).selectionKey = newKey;
            }
            nChannels++;

        }


        // 第 3 步，更新 EventLoop 上的两个 selector
        selector = newSelectorTuple.selector;
        unwrappedSelector = newSelectorTuple.unwrappedSelector;


        // 第 4 步，旧 Selector 关闭
        oldSelector.close();
    }
}
```
