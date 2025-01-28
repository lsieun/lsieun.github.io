---
title: "两个 Selector"
sequence: "102"
---

[UP](/netty.html)

为了遍历 selectedKeys 提高性能

```java
public final class NioEventLoop extends SingleThreadEventLoop {
    private Selector selector;
    private Selector unwrappedSelector;

    private SelectedSelectionKeySet selectedKeys;
    private final SelectorProvider provider;

    NioEventLoop(NioEventLoopGroup parent, Executor executor, SelectorProvider selectorProvider,
                 SelectStrategy strategy, RejectedExecutionHandler rejectedExecutionHandler,
                 EventLoopTaskQueueFactory taskQueueFactory, EventLoopTaskQueueFactory tailTaskQueueFactory) {
        super(parent, executor, false, newTaskQueue(taskQueueFactory), newTaskQueue(tailTaskQueueFactory),
                rejectedExecutionHandler);

        // 第 1 步，给 provider 赋值
        this.provider = ObjectUtil.checkNotNull(selectorProvider, "selectorProvider");
        

        // 第 2 步，调用 openSelector() 方法
        final SelectorTuple selectorTuple = openSelector();
        

        // 第 3 步，给 selector 和 unwrappedSelector 赋值
        this.selector = selectorTuple.selector;
        this.unwrappedSelector = selectorTuple.unwrappedSelector;
    }

    private SelectorTuple openSelector() {
        // 第 1 步，获取 selector 实例
        final Selector unwrappedSelector = provider.openSelector();
        
        // 第 2 步，给 selectedKeys 字段赋值
        final SelectedSelectionKeySet selectedKeySet = new SelectedSelectionKeySet();
        this.selectedKeys = selectedKeySet;
        
        
        // 第 3 步，利用反射，对 selector 的 selectedKeys 和 publicSelectedKeys 进行修改
        Object maybeSelectorImplClass = Class.forName("sun.nio.ch.SelectorImpl");
        final Class<?> selectorImplClass = (Class<?>) maybeSelectorImplClass;
        Field selectedKeysField = selectorImplClass.getDeclaredField("selectedKeys");
        Field publicSelectedKeysField = selectorImplClass.getDeclaredField("publicSelectedKeys");
        selectedKeysField.set(unwrappedSelector, selectedKeySet);
        publicSelectedKeysField.set(unwrappedSelector, selectedKeySet);

        // 第 4 步，返回 tuple
        return new SelectorTuple(
                unwrappedSelector,
                new SelectedSelectionKeySetSelector(unwrappedSelector, selectedKeySet)
        );
    }
}
```

![](/assets/images/netty/eventloop/selector/selector-class-hierarchy.svg)

```java
package sun.nio.ch;

public abstract class SelectorImpl extends AbstractSelector {
    // 采用 HashSet 的方式
    protected Set<SelectionKey> selectedKeys = new HashSet();
    private Set<SelectionKey> publicSelectedKeys = Util.ungrowableSet(this.selectedKeys);
}
```

```java
final class SelectedSelectionKeySetSelector extends Selector {
    private final SelectedSelectionKeySet selectionKeys;
    private final Selector delegate;
}
```

```java
final class SelectedSelectionKeySet extends AbstractSet<SelectionKey> {
    // 采用 数组 的方式
    SelectionKey[] keys;
    int size;
}
```

![](/assets/images/netty/eventloop/selector/netty-eventloop-two-selectors.svg)


## 使用

```java
public final class NioEventLoop extends SingleThreadEventLoop {
    private void processSelectedKeys() {
        if (selectedKeys != null) {
            processSelectedKeysOptimized();
        }
        else {
            processSelectedKeysPlain(selector.selectedKeys());
        }
    }

    private void processSelectedKeysOptimized() {
        for (int i = 0; i < selectedKeys.size; ++i) {
            final SelectionKey k = selectedKeys.keys[i];
            selectedKeys.keys[i] = null;

            // NOTE: attachment 就是 NioChannel
            final Object a = k.attachment();

            if (a instanceof AbstractNioChannel) {
                processSelectedKey(k, (AbstractNioChannel) a);
            }
            else {
                @SuppressWarnings("unchecked")
                NioTask<SelectableChannel> task = (NioTask<SelectableChannel>) a;
                processSelectedKey(k, task);
            }

            if (needsToSelectAgain) {
                selectedKeys.reset(i + 1);

                selectAgain();
                i = -1;
            }
        }
    }

    private void processSelectedKeysPlain(Set<SelectionKey> selectedKeys) {
        if (selectedKeys.isEmpty()) {
            return;
        }

        Iterator<SelectionKey> i = selectedKeys.iterator();
        for (; ; ) {
            final SelectionKey k = i.next();
            final Object a = k.attachment();
            i.remove();

            if (a instanceof AbstractNioChannel) {
                processSelectedKey(k, (AbstractNioChannel) a);
            }
            else {
                NioTask<SelectableChannel> task = (NioTask<SelectableChannel>) a;
                processSelectedKey(k, task);
            }

            if (!i.hasNext()) {
                break;
            }

            if (needsToSelectAgain) {
                selectAgain();
                selectedKeys = selector.selectedKeys();

                // Create the iterator again to avoid ConcurrentModificationException
                if (selectedKeys.isEmpty()) {
                    break;
                }
                else {
                    i = selectedKeys.iterator();
                }
            }
        }
    }
}
```
