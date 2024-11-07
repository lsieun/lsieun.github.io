---
title: "FastThreadLocal"
sequence: "102"
---

[UP](/netty.html)

```text
┌────────────────┬────────────────────────┐
│      JDK       │         Netty          │
├────────────────┼────────────────────────┤
│     Thread     │ FastThreadLocalThread  │
├────────────────┼────────────────────────┤
│  ThreadLocal   │    FastThreadLocal     │
├────────────────┼────────────────────────┤
│ ThreadLocalMap │ InternalThreadLocalMap │
└────────────────┴────────────────────────┘
```

![](/assets/images/netty/util/netty-util-fast-thread-local-overview.svg)


## FastThreadLocalThread

`FastThreadLocalThread` 类继承自 `Thread` 类，并定义了 `threadLocalMap` 字段。
`threadLocalMap` 字段，就是用来实现类似 `ThreadLocal` 的功能。

```java
public class FastThreadLocalThread extends Thread {

    private InternalThreadLocalMap threadLocalMap;

}
```

## FastThreadLocal

![](/assets/images/netty/util/netty-util-fast-thread-local-methods.svg)


### 数据结构

```java
public class FastThreadLocal<V> {
    private final int index;

    public FastThreadLocal() {
        index = InternalThreadLocalMap.nextVariableIndex();
    }
}
```

### 主要方法

#### 基础方法

```java
public class FastThreadLocal<V> {
    public final V get() {
        // 获取 map
        InternalThreadLocalMap threadLocalMap = InternalThreadLocalMap.get();

        // 获取 index 位置的值
        Object v = threadLocalMap.indexedVariable(index);

        // 如果不为空，则返回
        if (v != InternalThreadLocalMap.UNSET) {
            return (V) v;
        }

        // 如果为空，则返回初始值
        return initialize(threadLocalMap);
    }

    private V initialize(InternalThreadLocalMap threadLocalMap) {
        // 获取 初始值
        V v = null;
        try {
            v = initialValue();
            if (v == InternalThreadLocalMap.UNSET) {
                throw new IllegalArgumentException("InternalThreadLocalMap.UNSET can not be initial value.");
            }
        }
        catch (Exception e) {
            PlatformDependent.throwException(e);
        }

        // 设置 index 位置的值
        threadLocalMap.setIndexedVariable(index, v);

        // 更新索引
        addToVariablesToRemove(threadLocalMap, this);
        return v;
    }

    public final void set(V value) {
        if (value != InternalThreadLocalMap.UNSET) {
            // 获取 map
            InternalThreadLocalMap threadLocalMap = InternalThreadLocalMap.get();
            // 设置 index 位置的值
            setKnownNotUnset(threadLocalMap, value);
        }
        else {
            remove();
        }
    }

    private void setKnownNotUnset(InternalThreadLocalMap threadLocalMap, V value) {
        // 设置 index 位置的值
        if (threadLocalMap.setIndexedVariable(index, value)) {
            // 添加索引信息
            addToVariablesToRemove(threadLocalMap, this);
        }
    }

    public final void remove() {
        remove(InternalThreadLocalMap.getIfSet());
    }

    public final void remove(InternalThreadLocalMap threadLocalMap) {
        // 参数校验，提前返回
        if (threadLocalMap == null) {
            return;
        }

        // 删除 index 位置的值
        Object v = threadLocalMap.removeIndexedVariable(index);
        if (v != InternalThreadLocalMap.UNSET) {
            // 维护索引信息
            removeFromVariablesToRemove(threadLocalMap, this);

            // 扩展功能
            try {
                onRemoval((V) v);
            }
            catch (Exception e) {
                PlatformDependent.throwException(e);
            }
        }
    }
}
```

#### 维护索引

```java
public class FastThreadLocal<V> {
    private static void addToVariablesToRemove(InternalThreadLocalMap threadLocalMap, FastThreadLocal<?> variable) {
        // 获取索引为 0 的元素
        Object v = threadLocalMap.indexedVariable(VARIABLES_TO_REMOVE_INDEX);

        // 获取索引集合
        Set<FastThreadLocal<?>> variablesToRemove;
        if (v == InternalThreadLocalMap.UNSET || v == null) {
            // 对集合进行初始化
            variablesToRemove = Collections.newSetFromMap(new IdentityHashMap<FastThreadLocal<?>, Boolean>());
            threadLocalMap.setIndexedVariable(VARIABLES_TO_REMOVE_INDEX, variablesToRemove);
        }
        else {
            // 数据类型转换
            variablesToRemove = (Set<FastThreadLocal<?>>) v;
        }

        // 添加新元素
        variablesToRemove.add(variable);
    }

    private static void removeFromVariablesToRemove(
            InternalThreadLocalMap threadLocalMap, FastThreadLocal<?> variable) {
        // 获取索引为 0 的元素
        Object v = threadLocalMap.indexedVariable(VARIABLES_TO_REMOVE_INDEX);

        // 参数校验，提前返回
        if (v == InternalThreadLocalMap.UNSET || v == null) {
            return;
        }

        // 删除元素
        @SuppressWarnings("unchecked")
        Set<FastThreadLocal<?>> variablesToRemove = (Set<FastThreadLocal<?>>) v;
        variablesToRemove.remove(variable);
    }
}
```

#### 扩展功能

```java
public class FastThreadLocal<V> {
    protected V initialValue() throws Exception {
        return null;
    }

    protected void onRemoval(@SuppressWarnings("UnusedParameters") V value) throws Exception {
    }
}
```

## InternalThreadLocalMap

### 索引信息

```java
public final class InternalThreadLocalMap extends UnpaddedInternalThreadLocalMap {
    private static final AtomicInteger nextIndex = new AtomicInteger();

    public static final int VARIABLES_TO_REMOVE_INDEX = nextVariableIndex();

    public static int nextVariableIndex() {
        int index = nextIndex.getAndIncrement();
        if (index >= ARRAY_LIST_CAPACITY_MAX_SIZE || index < 0) {
            nextIndex.set(ARRAY_LIST_CAPACITY_MAX_SIZE);
            throw new IllegalStateException("too many thread-local indexed variables");
        }
        return index;
    }

    public static int lastVariableIndex() {
        return nextIndex.get() - 1;
    }
}
```

### 数据结构

```java
public final class InternalThreadLocalMap extends UnpaddedInternalThreadLocalMap {
    private static final int INDEXED_VARIABLE_TABLE_INITIAL_SIZE = 32;

    public static final Object UNSET = new Object();

    private Object[] indexedVariables;

    private InternalThreadLocalMap() {
        indexedVariables = newIndexedVariableTable();
    }

    private static Object[] newIndexedVariableTable() {
        Object[] array = new Object[INDEXED_VARIABLE_TABLE_INITIAL_SIZE];
        Arrays.fill(array, UNSET);
        return array;
    }

}
```

```text
┌───────┬───────┐
│ Index │ Value │
├───────┼───────┤
│   0   │ UNSET │
├───────┼───────┤
│   1   │ UNSET │
├───────┼───────┤
│   2   │ UNSET │
├───────┼───────┤
│   3   │ UNSET │
├───────┼───────┤
│   4   │ UNSET │
├───────┼───────┤
│   5   │ UNSET │
├───────┼───────┤
│   6   │ UNSET │
├───────┼───────┤
│   7   │ UNSET │
├───────┼───────┤
│   8   │ UNSET │
├───────┼───────┤
│   9   │ UNSET │
├───────┼───────┤
│  10   │ UNSET │
├───────┼───────┤
│  11   │ UNSET │
├───────┼───────┤
│  12   │ UNSET │
├───────┼───────┤
│  13   │ UNSET │
├───────┼───────┤
│  14   │ UNSET │
├───────┼───────┤
│  15   │ UNSET │
├───────┼───────┤
│  16   │ UNSET │
├───────┼───────┤
│  17   │ UNSET │
├───────┼───────┤
│  18   │ UNSET │
├───────┼───────┤
│  19   │ UNSET │
├───────┼───────┤
│  20   │ UNSET │
├───────┼───────┤
│  21   │ UNSET │
├───────┼───────┤
│  22   │ UNSET │
├───────┼───────┤
│  23   │ UNSET │
├───────┼───────┤
│  24   │ UNSET │
├───────┼───────┤
│  25   │ UNSET │
├───────┼───────┤
│  26   │ UNSET │
├───────┼───────┤
│  27   │ UNSET │
├───────┼───────┤
│  28   │ UNSET │
├───────┼───────┤
│  29   │ UNSET │
├───────┼───────┤
│  30   │ UNSET │
├───────┼───────┤
│  31   │ UNSET │
└───────┴───────┘
```

### 主要方法

```java
public final class InternalThreadLocalMap extends UnpaddedInternalThreadLocalMap {
    // 获取值
    public Object indexedVariable(int index) {
        Object[] lookup = indexedVariables;
        return index < lookup.length ? lookup[index] : UNSET;
    }

    // 设置值
    public boolean setIndexedVariable(int index, Object value) {
        Object[] lookup = indexedVariables;
        if (index < lookup.length) {
            Object oldValue = lookup[index];
            lookup[index] = value;
            return oldValue == UNSET;
        }
        else {
            expandIndexedVariableTableAndSet(index, value);
            return true;
        }
    }

    // 扩展数组
    private void expandIndexedVariableTableAndSet(int index, Object value) {
        // 旧数组信息
        Object[] oldArray = indexedVariables;
        final int oldCapacity = oldArray.length;

        // 新数组容量
        int newCapacity;
        if (index < ARRAY_LIST_CAPACITY_EXPAND_THRESHOLD) {
            newCapacity = index;
            newCapacity |= newCapacity >>> 1;
            newCapacity |= newCapacity >>> 2;
            newCapacity |= newCapacity >>> 4;
            newCapacity |= newCapacity >>> 8;
            newCapacity |= newCapacity >>> 16;
            newCapacity++;
        }
        else {
            newCapacity = ARRAY_LIST_CAPACITY_MAX_SIZE;
        }

        // 新数组 - 从旧数组复制
        Object[] newArray = Arrays.copyOf(oldArray, newCapacity);

        // 填充 - UNSET
        Arrays.fill(newArray, oldCapacity, newArray.length, UNSET);

        // 设置值
        newArray[index] = value;

        // 以新换旧
        indexedVariables = newArray;
    }

    // 删除值
    public Object removeIndexedVariable(int index) {
        Object[] lookup = indexedVariables;
        if (index < lookup.length) {
            Object v = lookup[index];
            lookup[index] = UNSET;
            return v;
        }
        else {
            return UNSET;
        }
    }

    // 判断值是否设置
    public boolean isIndexedVariableSet(int index) {
        Object[] lookup = indexedVariables;
        return index < lookup.length && lookup[index] != UNSET;
    }
}
```

### 兼容模式

```java
public final class InternalThreadLocalMap extends UnpaddedInternalThreadLocalMap {
    private static final ThreadLocal<InternalThreadLocalMap> slowThreadLocalMap = new ThreadLocal<>();
}
```

## 示例

### 基本使用

```java
import io.netty.util.concurrent.FastThreadLocal;
import io.netty.util.concurrent.FastThreadLocalThread;

public class HelloWorld {
    public static final FastThreadLocal<String> threadLocal1 = new FastThreadLocal<>();
    public static final FastThreadLocal<String> threadLocal2 = new FastThreadLocal<>();

    public static void main(String[] args) {
        FastThreadLocalThread t1 = new FastThreadLocalThread(() -> {
            Thread currentThread = Thread.currentThread();
            System.out.println("Current Thread: " + currentThread.getName());

            threadLocal1.set("hello");
            threadLocal2.set("world");

            String str1 = threadLocal1.get();
            String str2 = threadLocal2.get();

            System.out.println("str1: " + str1);
            System.out.println("str2: " + str2);
        }, "t1");
        t1.start();
    }
}
```

### 初始状态

```java
import io.netty.util.concurrent.FastThreadLocalThread;
import lsieun.utils.FastThreadLocalUtils;

public class HelloWorld {
    public static void main(String[] args) throws InterruptedException {
        FastThreadLocalThread thread = new FastThreadLocalThread(FastThreadLocalUtils::printInternalThreadLocalMap);
        thread.start();
        thread.join();
    }
}
```

```text
┌───────┬───────┐
│ Index │ Value │
├───────┼───────┤
│   0   │ UNSET │
├───────┼───────┤
│   1   │ UNSET │
├───────┼───────┤
│   2   │ UNSET │
├───────┼───────┤
│   3   │ UNSET │
├───────┼───────┤
│   4   │ UNSET │
├───────┼───────┤
│   5   │ UNSET │
├───────┼───────┤
│   6   │ UNSET │
├───────┼───────┤
│   7   │ UNSET │
├───────┼───────┤
│   8   │ UNSET │
├───────┼───────┤
│   9   │ UNSET │
├───────┼───────┤
│  10   │ UNSET │
├───────┼───────┤
│  11   │ UNSET │
├───────┼───────┤
│  12   │ UNSET │
├───────┼───────┤
│  13   │ UNSET │
├───────┼───────┤
│  14   │ UNSET │
├───────┼───────┤
│  15   │ UNSET │
├───────┼───────┤
│  16   │ UNSET │
├───────┼───────┤
│  17   │ UNSET │
├───────┼───────┤
│  18   │ UNSET │
├───────┼───────┤
│  19   │ UNSET │
├───────┼───────┤
│  20   │ UNSET │
├───────┼───────┤
│  21   │ UNSET │
├───────┼───────┤
│  22   │ UNSET │
├───────┼───────┤
│  23   │ UNSET │
├───────┼───────┤
│  24   │ UNSET │
├───────┼───────┤
│  25   │ UNSET │
├───────┼───────┤
│  26   │ UNSET │
├───────┼───────┤
│  27   │ UNSET │
├───────┼───────┤
│  28   │ UNSET │
├───────┼───────┤
│  29   │ UNSET │
├───────┼───────┤
│  30   │ UNSET │
├───────┼───────┤
│  31   │ UNSET │
└───────┴───────┘
```

### 添加和删除

```java
import io.netty.util.concurrent.FastThreadLocal;
import io.netty.util.concurrent.FastThreadLocalThread;
import lsieun.cst.MyConst;
import lsieun.utils.FastThreadLocalUtils;

public class HelloWorld {
    public static void main(String[] args) throws InterruptedException {
        FastThreadLocal<String> myThreadLocal = new FastThreadLocal<>();

        FastThreadLocalThread thread = new FastThreadLocalThread(() -> {
            myThreadLocal.set("AAA");
            FastThreadLocalUtils.printInternalThreadLocalMap();

            System.out.println(MyConst.SEPARATION_LINE);

            myThreadLocal.remove();
            FastThreadLocalUtils.printInternalThreadLocalMap();
        });
        thread.start();
        thread.join();
    }
}
```

```text
┌───────┬───────┐
│ Index │ Value │
├───────┼───────┤
│   0   │  [1]  │
├───────┼───────┤
│   1   │  AAA  │
├───────┼───────┤
│   2   │ UNSET │
├───────┼───────┤
│   3   │ UNSET │
├───────┼───────┤
│   4   │ UNSET │
├───────┼───────┤
│   5   │ UNSET │
├───────┼───────┤
│   6   │ UNSET │
├───────┼───────┤
│   7   │ UNSET │
├───────┼───────┤
│   8   │ UNSET │
├───────┼───────┤
│   9   │ UNSET │
├───────┼───────┤
│  10   │ UNSET │
├───────┼───────┤
│  11   │ UNSET │
├───────┼───────┤
│  12   │ UNSET │
├───────┼───────┤
│  13   │ UNSET │
├───────┼───────┤
│  14   │ UNSET │
├───────┼───────┤
│  15   │ UNSET │
├───────┼───────┤
│  16   │ UNSET │
├───────┼───────┤
│  17   │ UNSET │
├───────┼───────┤
│  18   │ UNSET │
├───────┼───────┤
│  19   │ UNSET │
├───────┼───────┤
│  20   │ UNSET │
├───────┼───────┤
│  21   │ UNSET │
├───────┼───────┤
│  22   │ UNSET │
├───────┼───────┤
│  23   │ UNSET │
├───────┼───────┤
│  24   │ UNSET │
├───────┼───────┤
│  25   │ UNSET │
├───────┼───────┤
│  26   │ UNSET │
├───────┼───────┤
│  27   │ UNSET │
├───────┼───────┤
│  28   │ UNSET │
├───────┼───────┤
│  29   │ UNSET │
├───────┼───────┤
│  30   │ UNSET │
├───────┼───────┤
│  31   │ UNSET │
└───────┴───────┘

=================================================================================
┌───────┬───────┐
│ Index │ Value │
├───────┼───────┤
│   0   │  []   │
├───────┼───────┤
│   1   │ UNSET │
├───────┼───────┤
│   2   │ UNSET │
├───────┼───────┤
│   3   │ UNSET │
├───────┼───────┤
│   4   │ UNSET │
├───────┼───────┤
│   5   │ UNSET │
├───────┼───────┤
│   6   │ UNSET │
├───────┼───────┤
│   7   │ UNSET │
├───────┼───────┤
│   8   │ UNSET │
├───────┼───────┤
│   9   │ UNSET │
├───────┼───────┤
│  10   │ UNSET │
├───────┼───────┤
│  11   │ UNSET │
├───────┼───────┤
│  12   │ UNSET │
├───────┼───────┤
│  13   │ UNSET │
├───────┼───────┤
│  14   │ UNSET │
├───────┼───────┤
│  15   │ UNSET │
├───────┼───────┤
│  16   │ UNSET │
├───────┼───────┤
│  17   │ UNSET │
├───────┼───────┤
│  18   │ UNSET │
├───────┼───────┤
│  19   │ UNSET │
├───────┼───────┤
│  20   │ UNSET │
├───────┼───────┤
│  21   │ UNSET │
├───────┼───────┤
│  22   │ UNSET │
├───────┼───────┤
│  23   │ UNSET │
├───────┼───────┤
│  24   │ UNSET │
├───────┼───────┤
│  25   │ UNSET │
├───────┼───────┤
│  26   │ UNSET │
├───────┼───────┤
│  27   │ UNSET │
├───────┼───────┤
│  28   │ UNSET │
├───────┼───────┤
│  29   │ UNSET │
├───────┼───────┤
│  30   │ UNSET │
├───────┼───────┤
│  31   │ UNSET │
└───────┴───────┘
```

### 多个 FastThreadLocal

```java
import io.netty.util.concurrent.FastThreadLocal;
import io.netty.util.concurrent.FastThreadLocalThread;
import lsieun.utils.FastThreadLocalUtils;

import java.util.ArrayList;
import java.util.List;

public class HelloWorld {
    public static void main(String[] args) throws InterruptedException {
        int n = 10;
        List<FastThreadLocal<String>> threadLocalList = getFastThreadLocals(n);

        FastThreadLocalThread thread = new FastThreadLocalThread(() -> {
            int size = threadLocalList.size();
            for (int i = 0; i < size; i++) {
                String str = String.format("V%02d", i + 1);
                threadLocalList.get(i).set(str);
            }

            FastThreadLocalUtils.printInternalThreadLocalMap();
        });
        thread.start();
        thread.join();
    }

    static <T> List<FastThreadLocal<T>> getFastThreadLocals(int n) {
        List<FastThreadLocal<T>> list = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            FastThreadLocal<T> fastThreadLocal = new FastThreadLocal<>();
            list.add(fastThreadLocal);
        }
        return list;
    }
}
```

```text
┌───────┬─────────────────────────────────┐
│ Index │              Value              │
├───────┼─────────────────────────────────┤
│   0   │ [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] │
├───────┼─────────────────────────────────┤
│   1   │               V01               │
├───────┼─────────────────────────────────┤
│   2   │               V02               │
├───────┼─────────────────────────────────┤
│   3   │               V03               │
├───────┼─────────────────────────────────┤
│   4   │               V04               │
├───────┼─────────────────────────────────┤
│   5   │               V05               │
├───────┼─────────────────────────────────┤
│   6   │               V06               │
├───────┼─────────────────────────────────┤
│   7   │               V07               │
├───────┼─────────────────────────────────┤
│   8   │               V08               │
├───────┼─────────────────────────────────┤
│   9   │               V09               │
├───────┼─────────────────────────────────┤
│  10   │               V10               │
├───────┼─────────────────────────────────┤
│  11   │              UNSET              │
├───────┼─────────────────────────────────┤
│  12   │              UNSET              │
├───────┼─────────────────────────────────┤
│  13   │              UNSET              │
├───────┼─────────────────────────────────┤
│  14   │              UNSET              │
├───────┼─────────────────────────────────┤
│  15   │              UNSET              │
├───────┼─────────────────────────────────┤
│  16   │              UNSET              │
├───────┼─────────────────────────────────┤
│  17   │              UNSET              │
├───────┼─────────────────────────────────┤
│  18   │              UNSET              │
├───────┼─────────────────────────────────┤
│  19   │              UNSET              │
├───────┼─────────────────────────────────┤
│  20   │              UNSET              │
├───────┼─────────────────────────────────┤
│  21   │              UNSET              │
├───────┼─────────────────────────────────┤
│  22   │              UNSET              │
├───────┼─────────────────────────────────┤
│  23   │              UNSET              │
├───────┼─────────────────────────────────┤
│  24   │              UNSET              │
├───────┼─────────────────────────────────┤
│  25   │              UNSET              │
├───────┼─────────────────────────────────┤
│  26   │              UNSET              │
├───────┼─────────────────────────────────┤
│  27   │              UNSET              │
├───────┼─────────────────────────────────┤
│  28   │              UNSET              │
├───────┼─────────────────────────────────┤
│  29   │              UNSET              │
├───────┼─────────────────────────────────┤
│  30   │              UNSET              │
├───────┼─────────────────────────────────┤
│  31   │              UNSET              │
└───────┴─────────────────────────────────┘
```

### 普通线程

```java
import io.netty.util.concurrent.FastThreadLocal;
import lsieun.utils.FastThreadLocalUtils;

public class HelloWorld {
    public static void main(String[] args) throws InterruptedException {
        FastThreadLocal<String> fastThreadLocal = new FastThreadLocal<>();

        Thread thread = new Thread(() -> {
            Thread currentThread = Thread.currentThread();
            System.out.println("Current Thread: " + currentThread.getName());

            fastThreadLocal.set("Hello World");
            String str = fastThreadLocal.get();

            System.out.println("str = " + str);
            FastThreadLocalUtils.printInternalThreadLocalMap();
        });
        thread.start();
        thread.join();
    }
}
```
