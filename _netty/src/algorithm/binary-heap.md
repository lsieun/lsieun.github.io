---
title: "二叉堆算法（Binary Heap）"
sequence: "binary-heap"
---

[UP](/netty.html)

## 二叉堆

### 介绍

```text
A **binary heap** is a heap, i.e, a tree which obeys the property
that the root of any tree is greater than or equal to (or smaller than or equal to) all its children (heap property).
（特性）
The primary use of such a data structure is to implement a priority queue.
（用途）
```

### 核心逻辑

要理解二叉堆，本质上需要两个核心步骤：

- 第 1 步，**数组化树**。
- 第 2 步，**顺序**。

#### 数组化树

**数组化树**，就是将数组（Array）理解成一棵完全二叉树（Complete Binary Tree）。

假设有一个数组，其长度为 11:

```text
┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│ idx:000 │ idx:001 │ idx:002 │ idx:003 │ idx:004 │ idx:005 │ idx:006 │ idx:007 │ idx:008 │ idx:009 │ idx:010 │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
```

将上面的数组转化为二叉树，可以得到如下图所示：

- 父节点索引：`i`
- 左子节点索引：`2 * i + 1`
- 右子节点索引：`2 * i + 2`

```text
                                                        ┌───────┐
                                                        │idx:000│
                                                        └───┬───┘
                            ┌───────────────────────────────┴───────────────┐
                        ┌───┴───┐                                       ┌───┴───┐
                        │idx:001│                                       │idx:002│
                        └───┬───┘                                       └───┬───┘
            ┌───────────────┴───────────────┐                       ┌───────┴───────┐
        ┌───┴───┐                       ┌───┴───┐               ┌───┴───┐       ┌───┴───┐
        │idx:003│                       │idx:004│               │idx:005│       │idx:006│
        └───┬───┘                       └───┬───┘               └───────┘       └───────┘
    ┌───────┴───────┐               ┌───────┴───────┐
┌───┴───┐       ┌───┴───┐       ┌───┴───┐       ┌───┴───┐
│idx:007│       │idx:008│       │idx:009│       │idx:010│
└───────┘       └───────┘       └───────┘       └───────┘
```

#### 父子顺序

两个子节点（左子节点和右子节点）的值都大于或等于父节点的值。
两个子节点，不需要进行大小比较；无论是左子节点比右子节点大，还是右子节点比左子节点大，都没有实质影响。

```text
                                                        ┌───────┐
                                                        │   3   │
                                                        │idx:000│
                                                        │   ■   │
                                                        └───┬───┘
                            ┌───────────────────────────────┴───────────────┐
                        ┌───┴───┐                                       ┌───┴───┐
                        │   5   │                                       │   7   │
                        │idx:001│                                       │idx:002│
                        │   ■   │                                       │   ■   │
                        └───┬───┘                                       └───┬───┘
            ┌───────────────┴───────────────┐                       ┌───────┴───────┐
        ┌───┴───┐                       ┌───┴───┐               ┌───┴───┐       ┌───┴───┐
        │  10   │                       │   6   │               │       │       │       │
        │idx:003│                       │idx:004│               │idx:005│       │idx:006│
        │   ■   │                       │   ■   │               │   □   │       │   □   │
        └───┬───┘                       └───┬───┘               └───────┘       └───────┘
    ┌───────┴───────┐               ┌───────┴───────┐
┌───┴───┐       ┌───┴───┐       ┌───┴───┐       ┌───┴───┐
│       │       │       │       │       │       │       │
│idx:007│       │idx:008│       │idx:009│       │idx:010│
│   □   │       │   □   │       │   □   │       │   □   │
└───────┘       └───────┘       └───────┘       └───────┘
```

### 简单实现

下面的 `MyPriorityQueue` 是对 JDK 中的 `java.util.PriorityQueue` 简化之后的代码：

```java
import java.util.Arrays;

public class MyPriorityQueue<E> {
    private static final int DEFAULT_INITIAL_CAPACITY = 11;

    /**
     * The maximum size of array to allocate.
     * Some VMs reserve some header words in an array.
     * Attempts to allocate larger arrays may result in
     * OutOfMemoryError: Requested array size exceeds VM limit
     */
    private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;

    public transient Object[] queue;

    private int size = 0;

    public MyPriorityQueue() {
        this(DEFAULT_INITIAL_CAPACITY);
    }

    public MyPriorityQueue(int initialCapacity) {
        this.queue = new Object[initialCapacity];
    }

    public boolean offer(E e) {
        if (e == null) {
            throw new NullPointerException();
        }

        // NOTE: 保证有充足的空间
        int i = size;
        if (i >= queue.length) {
            grow(i + 1);
        }

        // NOTE: 更新 size 大小
        size = i + 1;

        // NOTE: 保证队列顺序
        if (i == 0) {
            queue[0] = e;
        }
        else {
            siftUp(i, e);
        }
        return true;
    }

    @SuppressWarnings("unchecked")
    public E poll() {
        // NOTE: 特殊情况，队列为空，直接返回 null
        if (size == 0) {
            return null;
        }

        // NOTE: 更新 size 大小
        int newSize = --size;

        // NOTE: 获取队列的第一个元素，作为返回值
        E theFirst = (E) queue[0];

        // NOTE: 获取队列的最后一个元素，保证队列顺序
        E theLast = (E) queue[newSize];
        queue[newSize] = null;
        if (newSize != 0) {
            siftDown(0, theLast);
        }

        // 返回值
        return theFirst;
    }

    public int size() {
        return size;
    }

    public void clear() {
        for (int i = 0; i < size; i++) {
            queue[i] = null;
        }
        size = 0;
    }


    // region METHOD - sift
    private void siftUp(int k, E x) {
        siftUpComparable(k, x);
    }

    @SuppressWarnings("unchecked")
    private void siftUpComparable(int k, E x) {
        Comparable<? super E> key = (Comparable<? super E>) x;
        while (k > 0) {
            // NOTE: 找到父节点
            int parent = (k - 1) >>> 1;
            Object e = queue[parent];
            
            // NOTE: 循环的终止条件
            if (key.compareTo((E) e) >= 0) {
                break;
            }
            
            // NOTE: 将父节点赋值给子节点
            queue[k] = e;
            
            // NOTE: 从父节点继续向上找
            k = parent;
        }
        queue[k] = key;
    }

    private void siftDown(int k, E x) {
        siftDownComparable(k, x);
    }

    @SuppressWarnings("unchecked")
    private void siftDownComparable(int k, E x) {
        Comparable<? super E> key = (Comparable<? super E>) x;
        int half = size >>> 1;        // loop while a non-leaf
        while (k < half) {
            // NOTE: 获取左右子节点，选择两者中较小的子节点
            int child = (k << 1) + 1; // assume left child is least
            Object c = queue[child];
            int right = child + 1;
            if (right < size && ((Comparable<? super E>) c).compareTo((E) queue[right]) > 0) {
                c = queue[child = right];
            }

            // NOTE: 循环的终止条件
            if (key.compareTo((E) c) <= 0) {
                break;
            }

            // NOTE: 子节点赋值给父节点
            queue[k] = c;
            
            // NOTE: 从子节点继续向下找
            k = child;
        }
        queue[k] = key;
    }
    // endregion


    // region METHOD - capacity
    private void grow(int minCapacity) {
        int oldCapacity = queue.length;
        // Double size if small; else grow by 50%
        int newCapacity = oldCapacity + (
                (oldCapacity < 64) ? (oldCapacity + 2) : (oldCapacity >> 1)
        );
        // overflow-conscious code
        if (newCapacity - MAX_ARRAY_SIZE > 0)
            newCapacity = hugeCapacity(minCapacity);
        queue = Arrays.copyOf(queue, newCapacity);
    }

    private static int hugeCapacity(int minCapacity) {
        if (minCapacity < 0) // overflow
            throw new OutOfMemoryError();
        return (minCapacity > MAX_ARRAY_SIZE) ?
                Integer.MAX_VALUE :
                MAX_ARRAY_SIZE;
    }
    // endregion
}
```

```java
import lsieun.theme.queue.MyPriorityQueue;
import lsieun.utils.MyPriorityQueueUtils;

public class HelloWorld {
    public static void main(String[] args) throws InterruptedException {
        // NOTE: 第 1 步，初始状态
        MyPriorityQueue<Integer> pq = new MyPriorityQueue<>();
        MyPriorityQueueUtils.print(pq);

        // NOTE: 第 2 步，添加元素
        int[] nums = {10, 3, 7, 6, 5};
        for (int num : nums) {
            pq.offer(num);
            MyPriorityQueueUtils.print(pq);
        }

        // NOTE: 第 3 步，取出元素
        MyPriorityQueueUtils.print(pq);
        while (pq.size() > 0) {
            pq.poll();
            MyPriorityQueueUtils.print(pq);
        }
    }

}
```

## 具体使用

```text
                             ┌─── DelayQueue
                             │
               ┌─── JDK ─────┼─── PriorityQueue
               │             │
Binary Heap ───┤             └─── Timer
               │
               │             ┌─── DefaultPriorityQueue
               └─── Netty ───┤
                             └─── IntPriorityQueue
```

### JDK: PriorityQueue


#### 扩容大小

- 如果 `oldCapacity` 小于 `64`，则 `newCapacity = (2 * oldCapacity) + 2`
- 如果 `oldCapacity` 大于或等于 `64`，则 `newCapacity = oldCapacity + (oldCapacity >> 1)`

```java
public class HelloWorld {
    private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;

    public static void main(String[] args) throws InterruptedException {
        System.out.println("MAX_ARRAY_SIZE = " + MAX_ARRAY_SIZE);

        int capacity = 11;
        System.out.println("capacity = " + capacity);
        while (true) {
            capacity = grow(capacity);
            System.out.println("capacity = " + capacity);
        }
    }

    private static int grow(int oldCapacity) {
        int minCapacity = oldCapacity + 1;
        // Double size if small; else grow by 50%
        int newCapacity = oldCapacity + (
                (oldCapacity < 64) ? (oldCapacity + 2) : (oldCapacity >> 1)
        );

        // overflow-conscious code
        if (newCapacity - MAX_ARRAY_SIZE > 0)
            newCapacity = hugeCapacity(minCapacity);

        return newCapacity;
    }

    private static int hugeCapacity(int minCapacity) {
        if (minCapacity < 0) // overflow
            throw new OutOfMemoryError();
        return (minCapacity > MAX_ARRAY_SIZE) ?
                Integer.MAX_VALUE :
                MAX_ARRAY_SIZE;
    }

}
```

```text
MAX_ARRAY_SIZE = 2147483639
capacity = 11
capacity = 24
capacity = 50
capacity = 102
capacity = 153
capacity = 229
capacity = 343
capacity = 514
capacity = 771
capacity = 1156
capacity = 1734
capacity = 2601
capacity = 3901
capacity = 5851
capacity = 8776
capacity = 13164
capacity = 19746
capacity = 29619
capacity = 44428
capacity = 66642
capacity = 99963
capacity = 149944
capacity = 224916
capacity = 337374
capacity = 506061
capacity = 759091
capacity = 1138636
capacity = 1707954
capacity = 2561931
capacity = 3842896
capacity = 5764344
capacity = 8646516
capacity = 12969774
capacity = 19454661
capacity = 29181991
capacity = 43772986
capacity = 65659479
capacity = 98489218
capacity = 147733827
capacity = 221600740
capacity = 332401110
capacity = 498601665
capacity = 747902497
capacity = 1121853745
capacity = 1682780617
capacity = 2147483639
capacity = 2147483647
```

### JDK：Timer

```java

```

### Netty：IntPriorityQueue


