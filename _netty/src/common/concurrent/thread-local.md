---
title: "ThreadLocal"
sequence: "101"
---

![](/assets/images/math/geometry/golden-ratio.jpg)

[UP](/netty.html)

## Thread

在 `Thread` 类中，定义了一个 `threadLocals` 字段，它用来保存当前线程的所有 `ThreadLocal` 数据：

```java
public class Thread implements Runnable {
    /* ThreadLocal values pertaining to this thread.
     * This map is maintained by the ThreadLocal class.
     */
    ThreadLocal.ThreadLocalMap threadLocals = null;
}
```

![](/assets/images/netty/util/netty-util-thread-local-overview.svg)


## ThreadLocal



### 数据结构：Hash 值

在 `ThreadLocal` 类中，有一个 `HASH_INCREMENT` 常量，它的值是 `0x61c88647`，它与黄金分隔比例有关系。

<div>
\[
\phi = \frac{1 + \sqrt{5}}{2} \approx 1.618
\]
</div>

每一个 `ThreadLocal` 实例，都有一个 `threadLocalHashCode` 属性，它用来计算 `Thread.threadLocals` 中 `Entry` 的索引值。

```java
public class ThreadLocal<T> {

    private static final int HASH_INCREMENT = 0x61c88647;

    private static AtomicInteger nextHashCode = new AtomicInteger();

    private static int nextHashCode() {
        return nextHashCode.getAndAdd(HASH_INCREMENT);
    }

    private final int threadLocalHashCode = nextHashCode();
}
```

![](/assets/images/netty/util/netty-util-thread-local-hash.svg)


#### 验证黄金分隔比


```text
0x61C88647 + 0x9E3779B8 = 0xFFFFFFFF
```

![](/assets/images/netty/util/netty-util-thread-local-golden-ratio.svg)


```java
public class HelloWorld {
    public static void main(String[] args) {
        long max32BitVal = 0XFFFFFFFFL;
        long hash = 0x61c88647L;
        long diff = max32BitVal - hash;
        double quotient = 1.0 * diff / max32BitVal;
        System.out.println(quotient); // 0.618033988545191
    }
}
```

#### 生成一组 Hash 值

```java
import lsieun.drawing.theme.table.TableType;
import lsieun.drawing.utils.BitUtils;
import lsieun.drawing.utils.TableUtils;
import lsieun.lang.MyThreadLocal;

public class HelloWorld {
    public static void main(String[] args) {
        int count = 16;
        String[][] matrix = new String[count + 1][3];

        // head
        matrix[0][0] = "No.";
        matrix[0][1] = "HashCode";
        matrix[0][2] = "Bits";

        // data
        for (int i = 0; i < count; i++) {
            int rowIndex = i + 1;

            MyThreadLocal<String> tl = new MyThreadLocal<>();
            int threadLocalHashCode = tl.threadLocalHashCode;

            matrix[rowIndex][0] = String.valueOf(rowIndex);
            matrix[rowIndex][1] = String.valueOf(threadLocalHashCode);
            matrix[rowIndex][2] = BitUtils.fromInt(threadLocalHashCode);
        }

        // print
        TableUtils.printTable(matrix, TableType.ONE_LINE);
    }
}
```

```text
┌─────┬─────────────┬──────────────────────────────────┐
│ No. │  HashCode   │               Bits               │
├─────┼─────────────┼──────────────────────────────────┤
│  1  │      0      │ 00000000000000000000000000000000 │
├─────┼─────────────┼──────────────────────────────────┤
│  2  │ 1640531527  │ 01100001110010001000011001000111 │
├─────┼─────────────┼──────────────────────────────────┤
│  3  │ -1013904242 │ 11000011100100010000110010001110 │
├─────┼─────────────┼──────────────────────────────────┤
│  4  │  626627285  │ 00100101010110011001001011010101 │
├─────┼─────────────┼──────────────────────────────────┤
│  5  │ -2027808484 │ 10000111001000100001100100011100 │
├─────┼─────────────┼──────────────────────────────────┤
│  6  │ -387276957  │ 11101000111010101001111101100011 │
├─────┼─────────────┼──────────────────────────────────┤
│  7  │ 1253254570  │ 01001010101100110010010110101010 │
├─────┼─────────────┼──────────────────────────────────┤
│  8  │ -1401181199 │ 10101100011110111010101111110001 │
├─────┼─────────────┼──────────────────────────────────┤
│  9  │  239350328  │ 00001110010001000011001000111000 │
├─────┼─────────────┼──────────────────────────────────┤
│ 10  │ 1879881855  │ 01110000000011001011100001111111 │
├─────┼─────────────┼──────────────────────────────────┤
│ 11  │ -774553914  │ 11010001110101010011111011000110 │
├─────┼─────────────┼──────────────────────────────────┤
│ 12  │  865977613  │ 00110011100111011100010100001101 │
├─────┼─────────────┼──────────────────────────────────┤
│ 13  │ -1788458156 │ 10010101011001100100101101010100 │
├─────┼─────────────┼──────────────────────────────────┤
│ 14  │ -147926629  │ 11110111001011101101000110011011 │
├─────┼─────────────┼──────────────────────────────────┤
│ 15  │ 1492604898  │ 01011000111101110101011111100010 │
├─────┼─────────────┼──────────────────────────────────┤
│ 16  │ -1161830871 │ 10111010101111111101111000101001 │
└─────┴─────────────┴──────────────────────────────────┘
```

#### 数组索引

```text
int i = key.threadLocalHashCode & (table.length - 1);
```

```java
import lsieun.drawing.theme.table.TableType;
import lsieun.drawing.utils.TableUtils;
import lsieun.lang.MyThreadLocal;

public class HelloWorld {
    public static void main(String[] args) {
        // rows and cols
        int totalRows = (int) Math.pow(2, 4);
        int totalCols = 4;
        System.out.println("totalRows = " + totalRows);
        System.out.println("totalCols = " + totalCols);

        // title
        String[][] matrix = new String[totalRows + 1][totalCols];
        matrix[0][0] = "Tab.Index";
        matrix[0][1] = "HashCode";
        matrix[0][2] = "Value";
        matrix[0][3] = "Count";

        // first col
        for (int i = 0; i < totalRows; i++) {
            int rowIndex = i + 1;
            matrix[rowIndex][0] = String.valueOf(i);
        }

        // following cols
        for (int i = 0; i < 20; i++) {
            MyThreadLocal<String> tl = new MyThreadLocal<>();
            int hashCode = tl.threadLocalHashCode;
            int index = hashCode & (totalRows - 1);
            int rowIndex = index + 1;
            String hash = matrix[rowIndex][1];
            String val = String.format("V%02d", i);
            if (hash == null) {
                matrix[rowIndex][1] = String.valueOf(hashCode);
                matrix[rowIndex][2] = val;
                matrix[rowIndex][3] = "1";
            }
            else {
                matrix[rowIndex][1] = hash + "," + hashCode;
                matrix[rowIndex][2] += "," + val;
                int count = Integer.parseInt(matrix[rowIndex][3]);
                matrix[rowIndex][3] = String.valueOf(count + 1);
            }
        }

        // print
        TableUtils.printTable(matrix, TableType.ONE_LINE);
    }
}
```

```text
totalRows = 16
totalCols = 4
┌───────────┬─────────────┬───────┬───────┐
│ Tab.Index │  HashCode   │ Value │ Count │
├───────────┼─────────────┼───────┼───────┤
│     0     │      0      │  V00  │   1   │
├───────────┼─────────────┼───────┼───────┤
│     1     │ -1401181199 │  V07  │   1   │
├───────────┼─────────────┼───────┼───────┤
│     2     │ 1492604898  │  V14  │   1   │
├───────────┼─────────────┼───────┼───────┤
│     3     │ -387276957  │  V05  │   1   │
├───────────┼─────────────┼───────┼───────┤
│     4     │ -1788458156 │  V12  │   1   │
├───────────┼─────────────┼───────┼───────┤
│     5     │  626627285  │  V03  │   1   │
├───────────┼─────────────┼───────┼───────┤
│     6     │ -774553914  │  V10  │   1   │
├───────────┼─────────────┼───────┼───────┤
│     7     │ 1640531527  │  V01  │   1   │
├───────────┼─────────────┼───────┼───────┤
│     8     │  239350328  │  V08  │   1   │
├───────────┼─────────────┼───────┼───────┤
│     9     │ -1161830871 │  V15  │   1   │
├───────────┼─────────────┼───────┼───────┤
│    10     │ 1253254570  │  V06  │   1   │
├───────────┼─────────────┼───────┼───────┤
│    11     │ -147926629  │  V13  │   1   │
├───────────┼─────────────┼───────┼───────┤
│    12     │ -2027808484 │  V04  │   1   │
├───────────┼─────────────┼───────┼───────┤
│    13     │  865977613  │  V11  │   1   │
├───────────┼─────────────┼───────┼───────┤
│    14     │ -1013904242 │  V02  │   1   │
├───────────┼─────────────┼───────┼───────┤
│    15     │ 1879881855  │  V09  │   1   │
└───────────┴─────────────┴───────┴───────┘
```

### 主要方法

![](/assets/images/netty/util/netty-util-thread-local.svg)

#### 基本操作

```java
public class ThreadLocal<T> {
    public T get() {
        // 获取线程
        Thread t = Thread.currentThread();
      
        // 获取 map
        ThreadLocalMap map = getMap(t);
      
        // 如果 map 不为空
        if (map != null) {
            ThreadLocalMap.Entry e = map.getEntry(this);
            if (e != null) {
                @SuppressWarnings("unchecked")
                T result = (T) e.value;
                return result;
            }
        }
        
        // 如果 map 为空
        return setInitialValue();
    }

    public void set(T value) {
        // 获取线程
        Thread t = Thread.currentThread();
      
        // 获取 map
        ThreadLocalMap map = getMap(t);
      
        // 如果 map 不为空
        if (map != null) {
            map.set(this, value);
        }
        else {
            // 创建 map
            createMap(t, value);
        }
    }

    public void remove() {
        ThreadLocalMap m = getMap(Thread.currentThread());
        if (m != null) {
            m.remove(this);
        }
    }
}
```

#### 初始值

```java
public class ThreadLocal<T> {
    protected T initialValue() {
        return null;
    }

    private T setInitialValue() {
        T value = initialValue();
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t);
        if (map != null) {
            map.set(this, value);
        }
        else {
            createMap(t, value);
        }

        // ...

        return value;
    }
}
```

#### 底层 Map

```java
public class ThreadLocal<T> {
    void createMap(Thread t, T firstValue) {
        t.threadLocals = new ThreadLocalMap(this, firstValue);
    }

    ThreadLocalMap getMap(Thread t) {
        return t.threadLocals;
    }
}
```

### 示例

```java
public class HelloWorld {
    private static final ThreadLocal<String> threadLocal1 = new ThreadLocal<>();
    private static final ThreadLocal<String> threadLocal2 = new ThreadLocal<>();

    public static void main(String[] args) {
        Thread thread = Thread.currentThread();
        System.out.println("thread = " + thread);

        threadLocal1.set("AAA");
        threadLocal2.set("BBB");

        String val1 = threadLocal1.get();
        String val2 = threadLocal2.get();

        System.out.println("val1 = " + val1);
        System.out.println("val2 = " + val2);

        threadLocal1.remove();
        threadLocal2.remove();
    }
}
```

## ThreadLocalMap

![](/assets/images/netty/util/netty-util-thread-local-map.svg)



### 数据结构

```java
public class ThreadLocal<T> {
    static class ThreadLocalMap {
        static class Entry extends WeakReference<ThreadLocal<?>> {
            Object value;

            Entry(ThreadLocal<?> k, Object v) {
                super(k);
                value = v;
            }
        }

        // 主要字段
        private Entry[] table;
        private int size = 0;

        // 扩容
        private int threshold; // Default to 0
    }
}
```

### 主要方法

```java
public class ThreadLocal<T> {
    static class ThreadLocalMap {

        private Entry getEntry(ThreadLocal<?> key) {
            // 获取索引
            int i = key.threadLocalHashCode & (table.length - 1);
          
            // 获取元素
            Entry e = table[i];
          
            // 直接找到，或遍历查找
            if (e != null && e.get() == key)
                return e;
            else
                return getEntryAfterMiss(key, i, e);
        }
        
        private void set(ThreadLocal<?> key, Object value) {

            Entry[] tab = table;
            int len = tab.length;
            
            // 获取索引
            int i = key.threadLocalHashCode & (len-1);

            // 遍历查找
            for (Entry e = tab[i];
                 e != null;
                 e = tab[i = nextIndex(i, len)]) {
                ThreadLocal<?> k = e.get();

                // 查找到了
                if (k == key) {
                    e.value = value;
                    return;
                }

                // 找到无效数据
                if (k == null) {
                    replaceStaleEntry(key, value, i);
                    return;
                }
            }

            // 遍历没有找到数据，在尾部添加
            tab[i] = new Entry(key, value);
            int sz = ++size;
            
            // 清除无效数据，并考虑扩容
            if (!cleanSomeSlots(i, sz) && sz >= threshold)
                rehash();
        }
        
        private void remove(ThreadLocal<?> key) {
            Entry[] tab = table;
            int len = tab.length;

            // 获取索引
            int i = key.threadLocalHashCode & (len-1);
          
            // 遍历查找
            for (Entry e = tab[i];
                 e != null;
                 e = tab[i = nextIndex(i, len)]) {
              
                // 找到元素，进行删除
                if (e.get() == key) {
                    e.clear();

                    // 删除无效数据
                    expungeStaleEntry(i);
                    return;
                }
            }
        }
    }
}
```

- 基本方法：
  - `getEntry()` 是直接『查询』索引位置的数据，而 `getEntryAfterMiss()`
    方法是通过遍历的方式查询，如果查询不到，则返回 `null`
  - `set()` 是『更新』已有的数据，或者『添加』一条新数据；还会进行『无效数据的删除』 和 『数据扩容』
  - `remove()`：『删除』数据
- 扩容方法
  - `rehash()`： 进行『无效数据的删除』 和 『数据扩容』
  - `resize()`： 进行『数据扩容』，默认扩容为原来的两倍
- 清除过期数据
  - `expungeStaleEntry()`：清除 `staleSlot` 位置的过期数据，并进行数据移动
  - `replaceStaleEntry()`、`cleanSomeSlots()` 和 `expungeStaleEntries()` 三个方法是在 `expungeStaleEntry()` 上的进一步扩展

