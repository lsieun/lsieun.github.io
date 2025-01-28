---
title: "ConcurrentHashMap 源码解析Java 8（二）：扩容、迁移"
sequence: "ConcurrentHashMap-103"
---

## 预备知识

生活例子：一个 1000 户的旧居民小区向一个 2000 户新居民小区搬迁，分批进行，每批搬迁 100 户。

### 迁移步长

![](/assets/images/java/src/coll/ConcurrentHashMap-transfer-stride-16.png)

```text
ConcurrentHashMap --> transfer --> stride
```

![](/assets/images/java/src/coll/ConcurrentHashMap-transfer-stride.png)

```java
public class ArrayTransferStride {
    static int NCPU = Runtime.getRuntime().availableProcessors();
    private static final int MIN_TRANSFER_STRIDE = 16;

    private static int getStride(int n) {
        int stride = (NCPU > 1) ? (n >>> 3) / NCPU : n;
        if (stride < MIN_TRANSFER_STRIDE) {
            stride = MIN_TRANSFER_STRIDE;
        }
        return stride;
    }

    public static void main(String[] args) {
        System.out.println("NCPU = " + NCPU);

        int n = 1;
        for (int i = 0; i < 32 && n > 0; i++) {
            int stride = getStride(n);
            print(n, stride);

            n = n << 1;
        }
    }

    private static void print(int n, int stride) {
        int quotient = n / stride;
        int remainder = n % stride;

        String info = String.format(
                "n = %d, stride = %d, quotient = %d, remainder = %d",
                n, stride, quotient, remainder
        );

        System.out.println(info);
    }
}
```



### 迁移区间

代码位置：

```text
ConcurrentHashMap --> transfer --> nextBound = (nextIndex > stride ? nextIndex - stride : 0)
```

![](/assets/images/java/src/coll/ConcurrentHashMap-transfer-stride-range-code.png)

迁移区间：

![](/assets/images/java/src/coll/ConcurrentHashMap-transfer-stride-range.png)

代码示例：

```java
public class ArrayTransferRange {
    static int NCPU = Runtime.getRuntime().availableProcessors();
    private static final int MIN_TRANSFER_STRIDE = 16;

    private static int getStride(int n) {
        int stride = (NCPU > 1) ? (n >>> 3) / NCPU : n;
        if (stride < MIN_TRANSFER_STRIDE) {
            stride = MIN_TRANSFER_STRIDE;
        }
        return stride;
    }

    public static void main(String[] args) {
        System.out.println("NCPU = " + NCPU);

        // 数组长度
        int n = 1 << 5;
        System.out.println("n = " + n);

        // 迁移步长
        int stride = getStride(n);
        System.out.println("stride = " + stride);

        // 迁移区间
        int transferIndex = n;
        int count = 0;
        while (transferIndex > 0) {
            count++;

            int nextBound = (transferIndex > stride) ? transferIndex - stride : 0;

            String info = String.format("第 |%03d| 次迁移的区间为 [%d, %d]，数量为 %d",
                    count, nextBound, transferIndex - 1, transferIndex - nextBound
            );
            System.out.println(info);

            transferIndex = nextBound;
        }
    }
}
```

### 迁移位置

旧数组的长度为 `n`，新数组的长度为 `2n`。
在旧数组中，索引为 `i` 的元素会迁移到新数组的第 `i` 和 `i + n` 的位置：

![](/assets/images/java/src/coll/ConcurrentHashMap-transfer-pos.png)

例如，旧数组长度为 `8`，新数组长度为 `16`，旧数组的索引为 `3` 的元素会迁移到新数组的 `3` 和 `3 + 8` 的位置： 

![](/assets/images/java/src/coll/ConcurrentHashMap-transfer-pos-002.png)

代码示例：

```java
import java.util.Formatter;

public class ArrayTransferPos {
    static final int HASH_BITS = 0x7fffffff;
    static final boolean VERBOSE = false;

    static int spread(int h) {
        return (h ^ (h >>> 16)) & HASH_BITS;
    }

    private static int getHash(Object key) {
        int hashCode = key.hashCode();
        return spread(hashCode);
    }

    private static int getIndex(Object key, int n) {
        int hash = getHash(key);
        int mask = n - 1;
        int index = hash & mask;
        if (VERBOSE) {
            StringBuilder sb = new StringBuilder();
            Formatter fm = new Formatter(sb);
            fm.format("%s    n     = %d%n", BitUtils.toString(n, 32), n);
            fm.format("%s    hash  = %d%n", BitUtils.toString(hash, 32), hash);
            fm.format("%s    mask  = %d%n", BitUtils.toString(mask, 32), mask);
            fm.format("%s    index = %d%n", BitUtils.toString(index, 32), index);
            System.out.println(sb);
        }
        return index;
    }


    public static void main(String[] args) {
        int n = 8;
        for (int i = 0; i < 26; i++) {
            char ch = (char) ('a' + i);
            String key = String.valueOf(ch);
            printPos(key, n);
        }

        // printPos("c", 8);
        // printPos("k", 8);
    }

    private static void printPos(Object key, int n) {
        int index = getIndex(key, n);

        int nextN = 2 * n;
        int nextIndex = getIndex(key, nextN);

        String info = String.format("%s: %d ---> %d%n", key, index, nextIndex);
        System.out.println(info);
    }
}
```

## 扩容

### 基本过程（图解）

### 扩容大小

### 扩容时机

扩容的三个时机：

- 一般情况：调用 `addCount` 方法时，数量达到了“阈值”，需要扩容
- 特殊情况
    - 树化：当 `table.length < 64` 时，先尝试扩容
    - 初始化：针对 putAll 的初始化操作，因为 `putAll` 方法接收的数据可能很大，原来的数组装不下，需要进行扩容

#### addCount

```java
public class ConcurrentHashMap<K, V> extends AbstractMap<K, V> implements ConcurrentMap<K, V>, Serializable {
    // check 是之前 binCount 的个数
    private final void addCount(long x, int check) {
        CounterCell[] as;
        long b, s;
        // 已经有了 counterCells, 向 cell 累加
        if ((as = counterCells) != null ||
                // 还没有, 向 baseCount 累加
                !U.compareAndSwapLong(this, BASECOUNT, b = baseCount, s = b + x)) {
            CounterCell a;
            long v;
            int m;
            boolean uncontended = true;
            // 还没有 counterCells
            if (as == null || (m = as.length - 1) < 0 ||
                    // 还没有 cell
                    (a = as[ThreadLocalRandom.getProbe() & m]) == null ||
                    // cell cas 增加计数失败
                    !(uncontended =
                            U.compareAndSwapLong(a, CELLVALUE, v = a.value, v + x))) {
                // 创建累加单元数组和 cell, 累加重试
                fullAddCount(x, uncontended);
                return;
            }
            if (check <= 1)
                return;
            // 获取元素个数
            s = sumCount();
        }
        if (check >= 0) {
            Node<K, V>[] tab, nt;
            int n, sc;
            while (s >= (long) (sc = sizeCtl) && (tab = table) != null &&
                    (n = tab.length) < MAXIMUM_CAPACITY) {
                int rs = resizeStamp(n) << RESIZE_STAMP_SHIFT;
                if (sc < 0) {
                    if (sc == rs + MAX_RESIZERS || sc == rs + 1 ||
                            (nt = nextTable) == null || transferIndex <= 0)
                        break;
                    // newtable 已经创建了，帮忙扩容
                    if (U.compareAndSwapInt(this, SIZECTL, sc, sc + 1))
                        transfer(tab, nt);
                }
                // 需要扩容，这时 newtable 未创建
                else if (U.compareAndSwapInt(this, SIZECTL, sc, rs + 2))
                    transfer(tab, null);
                s = sumCount();
            }
        }
    }
}
```

#### treeifyBin

```java
public class ConcurrentHashMap<K, V> extends AbstractMap<K, V> implements ConcurrentMap<K, V>, Serializable {
    private final void treeifyBin(Node<K, V>[] tab, int index) {
        Node<K, V> b;
        int n, sc;
        // 数组不能为空
        if (tab != null) {
            // 数组的长度 n，是否小于 64
            if ((n = tab.length) < MIN_TREEIFY_CAPACITY) {
                // 如果数组长度小于 64，不能将链表转为红黑树，先尝试扩容操作
                tryPresize(n << 1);
            }
            else if ((b = tabAt(tab, index)) != null && b.hash >= 0) {
                synchronized (b) {
                    if (tabAt(tab, index) == b) {
                        TreeNode<K, V> hd = null, tl = null;
                        for (Node<K, V> e = b; e != null; e = e.next) {
                            TreeNode<K, V> p =
                                    new TreeNode<K, V>(e.hash, e.key, e.val,
                                            null, null);
                            if ((p.prev = tl) == null)
                                hd = p;
                            else
                                tl.next = p;
                            tl = p;
                        }
                        setTabAt(tab, index, new TreeBin<K, V>(hd));
                    }
                }
            }
        }
    }
}
```

### 扩容过程

### 扩容 -tryPresize

```java
public class ConcurrentHashMap<K, V> extends AbstractMap<K, V> implements ConcurrentMap<K, V>, Serializable {
    // size 是将之前的数组长度 左移 1 位得到的结果
    private final void tryPresize(int size) {
        // 如果扩容的长度达到了最大值，就使用最大值，否则需要保证数组的长度为 2 的 n 次幂
        // 这块的操作，是为了初始化操作准备的，因为调用 putAll 方法时，也会触发 tryPresize 方法
        // 如果刚刚 new 的 ConcurrentHashMap 直接调用了 putAll 方法的话，会通过 tryPresize 方法进行初始化
        int c = (size >= (MAXIMUM_CAPACITY >>> 1)) ? MAXIMUM_CAPACITY :
                tableSizeFor(size + (size >>> 1) + 1);


        int sc;
        // 将 sizeCtl 的值赋值给 sc，并判断是否大于 0，这里代表没有初始化操作，也没有扩容操作
        while ((sc = sizeCtl) >= 0) {
            // 将 ConcurrentHashMap 的 table 赋值给 tab，并声明数组长度 n
            Node<K, V>[] tab = table;
            int n;

            // 数组是否需要初始化
            if (tab == null || (n = tab.length) == 0) {
                // 进来执行初始化
                // sc 是初始化长度，初始化长度如果比计算出来的 c 要大的话，直接使用 sc；
                // 如果没有 sc 大，说明 sc 无法容纳下 putAll 中传入的 map，使用更大的数组长度
                n = (sc > c) ? sc : c;

                // 设置 sizeCtl 为 -1，代表初始化操作
                if (U.compareAndSwapInt(this, SIZECTL, sc, -1)) {
                    try {
                        // 再次判断数组的引用有没有变化
                        if (table == tab) {
                            // 初始化数组
                            Node<K, V>[] nt = (Node<K, V>[]) new Node<?, ?>[n];
                            // 数组赋值
                            table = nt;
                            // 计算扩容阈值
                            sc = n - (n >>> 2);
                        }
                    }
                    finally {
                        // 最终赋值给 sizeCtl
                        sizeCtl = sc;
                    }
                }
            }
            // 如果计算出来的长度 c 小于等于 c，或者数组长度大于等于最大长度，直接退出循环结束方法
            else if (c <= sc || n >= MAXIMUM_CAPACITY) {
                break;
            }
            // 判断当前的 tab 是否和 table 一致
            else if (tab == table) {
                // 计算扩容标识戳，根据当前数组的长度计算一个 16 位的扩容戳
                // 第一个作用是为了保证后面的 sizeCtl 赋值时，保证 sizeCtl 为小于 -1 的负数
                // 第二个作用用来记录当前是从什么长度开始扩容的
                int rs = resizeStamp(n);
                // BUG --- sc < 0，永远进不去
                if (sc < 0) {
                    // 如果 sc 小于 0，代表有线程正在扩容
                    // 说明有线程正在扩容，过来帮助扩容
                    Node<K, V>[] nt;
                    // 依然有 BUG
                    // 当前线程扩容时，老数组长度是否和我当前线程扩容时的老数组长度一致
                    if ((sc >>> RESIZE_STAMP_SHIFT) != rs || sc == rs + 1 ||
                            sc == rs + MAX_RESIZERS || (nt = nextTable) == null ||
                            transferIndex <= 0)
                        break;
                    // 如果线程需要协助扩容，首先就是对 sizeCtl 进行 +1 操作，代表当前要进来一个线程协助扩容
                    if (U.compareAndSwapInt(this, SIZECTL, sc, sc + 1))
                        transfer(tab, nt);
                }
                // 代表没有线程正在扩容，我是第一个扩容的。
                // 将扩容戳左移 16 位之后，符号位是 1，就代码这个值为负数，低 16 位在表示当前正在扩容的线程有多少个
                // 为什么低位值为 2 时，代表有一个线程正在扩容
                // 每一个线程扩容完毕后，会对低 16 位进行 -1 操作，当最后一个线程扩容完毕后，减 1 的结果还是 -1，当值为 -1 时，要对老数组进行一波扫描，查看是否有遗漏的数据没有迁移到新数组
                else if (U.compareAndSwapInt(this, SIZECTL, sc,
                        (rs << RESIZE_STAMP_SHIFT) + 2)) {
                    // 调用 transfer 方法，并且将第二个参数设置为 null，就代表是第一次来扩容！
                    transfer(tab, null);
                }

            }
        }
    }
}
```

### resizeStamp

```java
public class ConcurrentHashMap<K, V> extends AbstractMap<K, V> implements ConcurrentMap<K, V>, Serializable {
    static final int resizeStamp(int n) {
        return Integer.numberOfLeadingZeros(n) | (1 << (RESIZE_STAMP_BITS - 1));
    }
}
```

## 迁移

### 基本过程（图解）

- 多线程开始扩容

![](/assets/images/java/src/coll/ConcurrentHashMap-resize-001.awebp)

---

- lastrun节点

![](/assets/images/java/src/coll/ConcurrentHashMap-transfer-001.awebp)

---

- 链表迁移

![](/assets/images/java/src/coll/ConcurrentHashMap-transfer-002.awebp)

---

- 红黑树迁移

![](/assets/images/java/src/coll/ConcurrentHashMap-transfer-003.awebp)

---

- 迁移过程中get和put的操作的处理

![](/assets/images/java/src/coll/ConcurrentHashMap-transfer-004.awebp)

---

- 并发迁移

![](/assets/images/java/src/coll/ConcurrentHashMap-transfer-005.awebp)

---

- 迁移完成

![](/assets/images/java/src/coll/ConcurrentHashMap-transfer-006.awebp)

### transfer

```java
public class ConcurrentHashMap<K, V> extends AbstractMap<K, V> implements ConcurrentMap<K, V>, Serializable {
    private final void transfer(Node<K, V>[] tab, Node<K, V>[] nextTab) {
        // n: 数组长度
        int n = tab.length;

        // stride: 从“旧数组”迁移数据到“新数组”，每个线程一次迁移多少个 bucket
        int stride;
        if ((stride = (NCPU > 1) ? (n >>> 3) / NCPU : n) < MIN_TRANSFER_STRIDE)
            stride = MIN_TRANSFER_STRIDE; // subdivide range

        // 以 32 长度数组扩容到 64 位例子
        // n: 老数组长度   32
        // stride: 步长   16
        // 第一个进来扩容的线程需要把新数组构建出来

        if (nextTab == null) {            // initiating
            try {
                // 将原数组长度左移一位，构建新数组长度
                Node<K, V>[] nt = (Node<K, V>[]) new Node<?, ?>[n << 1];
                // 赋值操作
                nextTab = nt;
            }
            catch (Throwable ex) {      // try to cope with OOME
                // 到这说明已经达到数组长度的最大取值范围
                sizeCtl = Integer.MAX_VALUE;
                // 设置 sizeCtl 后直接结束
                return;
            }
            // 对成员变量的新数组赋值
            nextTable = nextTab;
            // 迁移数据时，用到的标识，默认值为老数组长度
            transferIndex = n;   // 32
        }

        // 新数组长度
        // nextn：64
        int nextn = nextTab.length;
        // 在老数组迁移完数据后，做的标识
        ForwardingNode<K, V> fwd = new ForwardingNode<K, V>(nextTab);
        // 迁移数据时，需要用到的标识
        // advance：true，代表当前线程需要接收任务，然后再执行迁移；如果为 false，代表已经接收完任务
        boolean advance = true;
        // 是否迁移结束
        boolean finishing = false; // to ensure sweep before committing nextTab
        for (int i = 0, bound = 0; ; ) {
            Node<K, V> f;
            int fh;

            // 当前线程要接收任务
            while (advance) {
                // 当前线程要接收任务
                // nextIndex = 16，nextBound = 16
                int nextIndex, nextBound;
                // 对 i 进行 --，并且判断当前任务是否处理完毕！
                if (--i >= bound || finishing) { // 第一次进来，这两个判断肯定进不去
                    advance = false;
                }
                // 判断 transferIndex 是否小于等于 0，代表没有任务可领取，结束了
                // 在线程领取任务，会对 transferIndex 进行修改，修改为 transferIndex - stride
                // 在任务都领取完之后，transferIndex 肯定是小于等于 0 的，代表没有迁移数据的任务可以领取
                else if ((nextIndex = transferIndex) <= 0) {
                    i = -1;
                    advance = false;
                }
                // 当前线程尝试领取任务
                else if (U.compareAndSwapInt
                        (this, TRANSFERINDEX, nextIndex,
                                nextBound = (nextIndex > stride ?
                                        nextIndex - stride : 0))) {
                    // 对 bound 赋值
                    bound = nextBound;
                    // 对 i 赋值
                    i = nextIndex - 1;
                    // 设置 advance 为 false，代表当前线程领取到任务了
                    advance = false;
                }
            }


            // 判断扩容是否已经结束？
            // i < 0：当前线程没有接收到任务
            // i >= n：迁移的索引位置，不可能大于数组的长度，不会成立
            // i + n >= nextn：因为 i 最大值就是数组索引的最大值，不会成立
            if (i < 0 || i >= n || i + n >= nextn) {
                // 如果进来，代表当前线程没有接收到任务
                int sc;

                // finishing 为 true，代表扩容结束
                if (finishing) {
                    // 将 nextTable 新数据设置为 null
                    nextTable = null;
                    // 将当前数组的引用指向了新数组
                    table = nextTab;
                    // 重新计算扩容阈值
                    sizeCtl = (n << 1) - (n >>> 1);
                    // 结束扩容
                    return;
                }

                // 当前线程没有接收到任务，让当前线程结束扩容操作
                // 采用 CAS 的方式，将 sizeCtl - 1，代表当前并发扩容的线程数 - 1
                if (U.compareAndSwapInt(this, SIZECTL, sc = sizeCtl, sc - 1)) {
                    // sizeCtl 的高 16 位是基于数组长度计算的扩容戳，低 16 位是当前正在扩容的线程个数
                    if ((sc - 2) != resizeStamp(n) << RESIZE_STAMP_SHIFT) {
                        // 代表当前线程并不是最后一个退出扩容的线程，直接结束当前线程扩容
                        return;
                    }

                    // 如果是最后一个退出扩容的线程，将 finishing 和 advance 设置为 true
                    finishing = advance = true;

                    // 将 i 设置为老数组长度，让最后一个线程再从尾到头再次检查一下，是否数据全部迁移完毕
                    i = n; // recheck before commit
                }
            }
            // 开始迁移数据，并且在迁移完毕后，会将 advance 设置为 true
            // 获取指定 i 位置的 Node 对象，并且判断是否为 null
            else if ((f = tabAt(tab, i)) == null) {
                // 当前桶位置没有数据，无需迁移，直接将当前桶位置设置为 fwd
                advance = casTabAt(tab, i, null, fwd);
            }
            // 拿到当前 i 位置的 hash 值，如果为 MOVED，证明数据已经迁移过了
            else if ((fh = f.hash) == MOVED) {
                // 一般是给最后扫描时，使用的判断，如果迁移完毕，直接跳过当前位置
                advance = true; // already processed
            }
            else {
                // 当前桶位置有数据，先锁住当前桶位置
                synchronized (f) {
                    // 判断之前取出的数据是否为当前的数据
                    if (tabAt(tab, i) == f) {
                        // ln: null - lowNode
                        // hn: null - highNode
                        Node<K, V> ln, hn;

                        // hash 大于 0，代表当前 Node 属于正常情况，不是红黑树，使用链表方式迁移数据
                        if (fh >= 0) {
                            // lastRun 机制
                            //    0000 0000 0001 0000
                            // 这种运行结果只有两种，要么是 0，要么是 n
                            int runBit = fh & n;

                            // 将 f 赋值给 lastRun
                            Node<K, V> lastRun = f;

                            // 循环的目的就是为了得到链表下经过 hash & n 结算，结果一致的最后一些数据
                            // 在迁移数据时，值需要迁移到 lastRun 即可，剩下的指针不需要变换
                            for (Node<K, V> p = f.next; p != null; p = p.next) {
                                int b = p.hash & n;
                                if (b != runBit) {
                                    runBit = b;
                                    lastRun = p;
                                }
                            }
                            // runBit == 0，赋值给 ln
                            if (runBit == 0) {
                                ln = lastRun;
                                hn = null;
                            }
                            // runBit == n，赋值给 hn
                            else {
                                hn = lastRun;
                                ln = null;
                            }
                            // 循环到 lastRun 指向的数据即可，后续不需要再遍历
                            for (Node<K, V> p = f; p != lastRun; p = p.next) {
                                // 获取当前 Node 的 hash 值、key 值、value 值
                                int ph = p.hash;
                                K pk = p.key;
                                V pv = p.val;
                                // 如果 hash & n 为 0，挂到 lowNode
                                if ((ph & n) == 0)
                                    ln = new Node<K, V>(ph, pk, pv, ln);
                                else
                                    hn = new Node<K, V>(ph, pk, pv, hn);
                            }
                            setTabAt(nextTab, i, ln);
                            setTabAt(nextTab, i + n, hn);
                            setTabAt(tab, i, fwd);
                            advance = true;
                        }
                        else if (f instanceof TreeBin) {
                            TreeBin<K, V> t = (TreeBin<K, V>) f;
                            TreeNode<K, V> lo = null, loTail = null;
                            TreeNode<K, V> hi = null, hiTail = null;
                            int lc = 0, hc = 0;
                            for (Node<K, V> e = t.first; e != null; e = e.next) {
                                int h = e.hash;
                                TreeNode<K, V> p = new TreeNode<K, V>
                                        (h, e.key, e.val, null, null);
                                if ((h & n) == 0) {
                                    if ((p.prev = loTail) == null)
                                        lo = p;
                                    else
                                        loTail.next = p;
                                    loTail = p;
                                    ++lc;
                                }
                                else {
                                    if ((p.prev = hiTail) == null)
                                        hi = p;
                                    else
                                        hiTail.next = p;
                                    hiTail = p;
                                    ++hc;
                                }
                            }
                            ln = (lc <= UNTREEIFY_THRESHOLD) ? untreeify(lo) :
                                    (hc != 0) ? new TreeBin<K, V>(lo) : t;
                            hn = (hc <= UNTREEIFY_THRESHOLD) ? untreeify(hi) :
                                    (lc != 0) ? new TreeBin<K, V>(hi) : t;
                            setTabAt(nextTab, i, ln);
                            setTabAt(nextTab, i + n, hn);
                            setTabAt(tab, i, fwd);
                            advance = true;
                        }
                    }
                }
            }
        }
    }
}
```

### helpTransfer - 协助扩容

```java
public class ConcurrentHashMap<K, V> extends AbstractMap<K, V> implements ConcurrentMap<K, V>, Serializable {
    // 在添加数据时，如果插入节点的位置的数据，hash 值为 -1，代表当前索引位置数据已经被迁移到新数组
    // tab：老数组
    // f：数据上的 Node 节点
    final Node<K, V>[] helpTransfer(Node<K, V>[] tab, Node<K, V> f) {
        // nextTab：新数组
        Node<K, V>[] nextTab;
        // sc：给 sizeCtl 做临时变量
        int sc;
        // 第一个判断：老数组不为 null
        // 第二个判断：新数组不为 null （将新数组赋值给 nextTab）
        if (tab != null &&
                (f instanceof ForwardingNode) && (nextTab = ((ForwardingNode<K, V>) f).nextTable) != null) {
            // ConcurrentHashMap 正在扩容
            // 基于老数组长度计算扩容戳
            int rs = resizeStamp(tab.length) << RESIZE_STAMP_SHIFT;

            // 第一个判断：fwd 中的新数组，和当前正在扩容的新数组是否相等。相等：可以协助扩容。不相等：要么扩容结束
            // 第二个判断：老数组是否改变了。    相等：可以协助扩容。不相等：扩容结束了。
            // 第三个判断：如果正在扩容，sizeCtl 肯定为负数，并且给 sc 赋值
            while (nextTab == nextTable && table == tab && (sc = sizeCtl) < 0) {
                // 
                if (sc == rs + MAX_RESIZERS || sc == rs + 1 ||
                        transferIndex <= 0)
                    break;
                if (U.compareAndSwapInt(this, SIZECTL, sc, sc + 1)) {
                    transfer(tab, nextTab);
                    break;
                }
            }
            return nextTab;
        }
        return table;
    }
}
```

