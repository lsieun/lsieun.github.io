---
title: "ConcurrentHashMap 源码解析Java 8（一）：init、get、put、size"
sequence: "ConcurrentHashMap-102"
---

```java
public class ConcurrentHashMap<K, V> extends AbstractMap<K, V> implements ConcurrentMap<K, V>, Serializable {
}
```

Java 8 数组（Node） +（链表 Node + 红黑树 TreeNode） 以下数组简称（table），链表简称（bin）

- 初始化，使用 cas 来保证并发安全，懒惰初始化 table
- 树化，当 table.length < 64 时，先尝试扩容；超过 64 时，并且 bin.length > 8 时，会将链表树化，树化过程会用 synchronized 锁住链表头
- put，如果该 bin 尚未创建，只需要使用 cas 创建 bin；如果已经有了，锁住链表头进行后续 put 操作，元素添加至 bin 的尾部
- get，无锁操作仅需要保证可见性，扩容过程中 get 操作拿到的是 ForwardingNode 它会让 get 操作在新 table 进行搜索
- 扩容，扩容时以 bin 为单位进行，需要对 bin 进行 synchronized，但这时妙的是其它竞争线程也不是无事可做，它们会帮助把其它 bin 进行扩容，扩容时平均只有 1/6 的节点会把复制到新 table 中
- size，元素个数保存在 `baseCount` 中，并发时的个数变动保存在 `CounterCell[]` 当中。最后统计数量时累加即可

## 基本概念

### Bucket 和 Bin

在`ConcurrentHashMap`中，"bucket" 和 "bin" 是两个常用的概念，它们用于描述 `ConcurrentHashMap` 内部的数据结构。

- Bucket（桶）

在 `ConcurrentHashMap` 中，"bucket" 通常指的是哈希表中的一个单元或一个存储位置，用于存放数据。
每个 bucket 可能是一个链表、红黑树或者直接是一个单节点的键值对数组。

- Bin（箱子）

当多个键被映射到同一个 bucket 时，它们会以链表或者树的形式存储在这个 bucket 中，这个链表或者树就可以称为 "bin"。

综上所述，"bucket" 是哈希表中的一个存储单元，而 "bin" 则是描述存储在这个存储单元中的键值对的数据结构，可以是链表、树或者其他形式。

### 哈希冲突

在广义的哈希冲突概念中，哈希冲突可以指任何情况下不同的输入映射到相同的输出的情况。

在 `ConcurrentHashMap` 中，哈希冲突特指在使用哈希表存储键值对时，不同的键被映射到了相同的桶（Bucket）中。

## 字母缩写

- f: first
- e: element
- h: hash

## 存储结构

存储的结构：**数组** + **链表** + **红黑树**

![](/assets/images/java/src/coll/ConcurrentHashMap-basic-structure.png)

## 预备知识

### 散列算法

`(h ^ (h >>> 16)) & HASH_BITS` 主要有两个目的：

- 第 1 点，`(h ^ (h >>> 16))` 部分，是让“高 16 位”和“低 16 位”都可以参与的索引（index）的计算当中；
- 第 2 点，`& HASH_BITS`，是为了保证计算出的 hashCode 一定是正数，避免出现负数

```java
public class ConcurrentHashMap<K,V> extends AbstractMap<K,V>
    implements ConcurrentMap<K,V>, Serializable {

    // step 1.
    final V putVal(K key, V value, boolean onlyIfAbsent) {
        // key 和 value 不能为 null
        if (key == null || value == null) throw new NullPointerException();
        
        // step 2.
        int hash = spread(key.hashCode());

        // ...
    }

    // step 2.
    // Spreads (XORs) higher bits of hash to lower and also forces top bit to 0.
    static final int spread(int h) {
        return (h ^ (h >>> 16)) & HASH_BITS;
    }
}
```

```text
// hash for forwarding nodes
int MOVED     = -1;
11111111111111111111111111111111

// hash for roots of trees
int TREEBIN   = -2;
11111111111111111111111111111110

// hash for transient reservations
int RESERVED  = -3;
11111111111111111111111111111101

// usable bits of normal node hash
int HASH_BITS = 0x7fffffff;
01111111111111111111111111111111
```

```java
import lsieun.utils.BitUtils;

public class HelloWorld {
    public static void main(String[] args) {
        int val = 0x7fffffff;
        String str = BitUtils.fromInt(val);
        System.out.println(str);
    }
}
```

```java
import lsieun.utils.BitUtils;

public class HelloWorld {
    public static void main(String[] args) {
        // 第 1 步，获取 hashCode
        Object obj = new Object();
        int hashCode = obj.hashCode();

        System.out.println("hashCode = " + hashCode);
        System.out.println();

        // 第 2 步，重新计算
        int HASH_BITS = 0x7FFFFFFF;

        System.out.println("(h ^ (h >>> 16)) & HASH_BITS");
        System.out.println(BitUtils.fromInt(hashCode) + " --> h");
        System.out.println(BitUtils.fromInt(hashCode >>> 16) + " --> h >>> 16");
        System.out.println(BitUtils.fromInt(hashCode ^ (hashCode >>> 16)) + " --> (h ^ (h >>> 16))");
        System.out.println(BitUtils.fromInt(HASH_BITS) + " --> HASH_BITS (0x7FFFFFFF)");
        System.out.println(BitUtils.fromInt((hashCode ^ (hashCode >>> 16)) & HASH_BITS) + " --> (h ^ (h >>> 16)) & HASH_BITS");
        System.out.println();

        // 第 3 步，简化
        int high = (hashCode & 0xFFFF0000) >>> 16;
        int low = hashCode & 0xFFFF;

        System.out.println(BitUtils.fromInt(high) + " --> high");
        System.out.println(BitUtils.fromInt(low) + " --> low");

        int xor = high ^ low;
        System.out.println(BitUtils.fromInt(xor) + " --> high ^ low");
    }
}
```

```text
hashCode = 460141958

(h ^ (h >>> 16)) & HASH_BITS
00011011011011010011010110000110 --> h
00000000000000000001101101101101 --> h >>> 16
00011011011011010010111011101011 --> (h ^ (h >>> 16))
01111111111111111111111111111111 --> HASH_BITS (0x7FFFFFFF)
00011011011011010010111011101011 --> (h ^ (h >>> 16)) & HASH_BITS

00000000000000000001101101101101 --> high
00000000000000000011010110000110 --> low
00000000000000000010111011101011 --> high ^ low
```

问题：为什么要用“高 16 位”与“低 16 位”进行异或运算呢？

回答：一个 HashMap 的默认容量（`DEFAULT_CAPACITY`）是 16，它的索引范围是 `[0, 15]`，
用 4 个 bit 就可以表示：`0b0000` ~ `0b1111`；
一个 hashCode 是 `int` 类型，占用 32 bit 空间，如果只使用最低的 4 bit，高 28 bit 的数据就浪费了。
进行“高 16 位”与“低 16 位”的异或运算，就使得高位中的数据，也适当的参与计算，让数据分散的更平均。

```java
public class HelloWorld {
    public static void main(String[] args) {
        // HASH_BITS 就是 Integer.MAX_VALUE
        int HASH_BITS = 0x7FFFFFFF;

        System.out.println(Integer.MAX_VALUE); // 2147483647
        System.out.println(HASH_BITS);         // 2147483647
    }
}
```

### 幂次方

```java
public class HelloWorld {

    private static int getMinPowOfTwo(int c) {
        int n = c - 1;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        return n + 1;
    }

    public static void main(String[] args) {
        int n = 100;
        int minPowOfTwo = getMinPowOfTwo(n);
        System.out.println("minPowOfTwo = " + minPowOfTwo);
    }
}
```

这段代码是一个常见的用于计算大于等于给定数字 c 的最接近的 2 的幂次方的方法。
具体来说，它会将 n 初始化为 c - 1，然后通过连续的按位或操作（`>>>` 表示无符号右移）来确保 n 的所有位都被设置为从最高位到最低位的所有位的“1”。
这样一来，n 最终的值将是大于等于 c 的最接近的 2 的幂次方。

```text
// n |= n >>> 1
00100000000000000000000000000000    ---> n
00010000000000000000000000000000    ---> n >>> 1
00110000000000000000000000000000    ---> n | (n >>> 1)

// n |= n >>> 2
00110000000000000000000000000000
00001100000000000000000000000000
00111100000000000000000000000000

// n |= n >>> 4
00111100000000000000000000000000
00000011110000000000000000000000
00111111110000000000000000000000

// n |= n >>> 8
00111111110000000000000000000000
00000000001111111100000000000000
00111111111111111100000000000000

// n |= n >>> 16
00111111111111111100000000000000
00000000000000000011111111111111
00111111111111111111111111111111

// n + 1
01000000000000000000000000000000
```

## 源码（一）

### 重要属性

```java
public class ConcurrentHashMap<K, V> extends AbstractMap<K, V> implements ConcurrentMap<K, V>, Serializable {


    private transient volatile int sizeCtl;

    // hash 表
    transient volatile Node<K, V>[] table;

    // 扩容时的 新 hash 表
    private transient volatile Node<K, V>[] nextTable;
}
```

![](/assets/images/java/src/coll/ConcurrentHashMap-fields.png)

#### sizeCtl

`sizeCtl`：是数组在**初始化**和**扩容**操作时的一个控制变量

- `-1`：代表当前数组正在**初始化**
- 小于 `-1`：低 16 位代表当前数据**正在扩容**的线程个数（如果 1 个线程扩容，值为 -2；如果 2 个线程扩容，值为 -3）
- `0`：代表数据还没有初始化
- 大于 `0`：代表当前数组的**扩容阈值**，或者是当前数组的初始化大小

![](/assets/images/java/src/coll/ConcurrentHashMap-field-sc.png)

![](/assets/images/java/src/coll/ConcurrentHashMap-field-sizeCtl-32bit-negative.png)

#### table 和 nextTable

### 重要内部类 - Node

```java
public class ConcurrentHashMap<K, V> extends AbstractMap<K, V> implements ConcurrentMap<K, V>, Serializable {
    // 整个 ConcurrentHashMap 就是一个 Node[]
    static class Node<K, V> implements Map.Entry<K, V> {
        final int hash;
        final K key;
        volatile V val;
        volatile Node<K, V> next;
    }

    // 扩容时如果某个 bin 迁移完毕, 用 ForwardingNode 作为旧 table bin 的头结点
    static final class ForwardingNode<K, V> extends Node<K, V> {
    }

    // 用在 compute 以及 computeIfAbsent 时, 用来占位, 计算完成后替换为普通 Node
    static final class ReservationNode<K, V> extends Node<K, V> {
    }

    // 作为 treebin 的头节点, 存储 root 和 first
    static final class TreeBin<K, V> extends Node<K, V> {
    }

    // 作为 treebin 的节点, 存储 parent, left, right
    static final class TreeNode<K, V> extends Node<K, V> {
    }
}
```

对于 ForwardingNode

- 带有 ForwardingNode 的为处理过的，当其他线程到这里时，就不会再对其操作
- 其他线程要获取这里的值时，也是通过 `ForwardingNode` 找到扩容后新表中的节点

对于 `TreeBin` 和 `TreeNode`，即红黑树的实现。

- 当多个节点的桶位置一样时，这些节点会串成一个链表。在 JDK8 中，新加节点，加在链表尾部。但是如果链表过长，会进行扩容。
- 如果扩容效果不好，那么将会把链表进行一个向红黑树的转换。

### 重要方法

```java
public class ConcurrentHashMap<K, V> extends AbstractMap<K, V> implements ConcurrentMap<K, V>, Serializable {
    // 获取 Node[] 中第 i 个 Node
    static final <K, V> Node<K, V> tabAt(Node<K, V>[] tab, int i) {
        return (Node<K, V>) U.getObjectVolatile(tab, ((long) i << ASHIFT) + ABASE);
    }

    // cas 修改 Node[] 中第 i 个 Node 的值, c 为旧值, v 为新值
    static final <K, V> boolean casTabAt(Node<K, V>[] tab, int i, Node<K, V> c, Node<K, V> v) {
        return U.compareAndSwapObject(tab, ((long) i << ASHIFT) + ABASE, c, v);
    }

    // 直接修改 Node[] 中第 i 个 Node 的值, v 为新值
    static final <K, V> void setTabAt(Node<K, V>[] tab, int i, Node<K, V> v) {
        U.putObjectVolatile(tab, ((long) i << ASHIFT) + ABASE, v);
    }
}
```

### 重要常量

```java
public class ConcurrentHashMap<K, V> extends AbstractMap<K, V> implements ConcurrentMap<K, V>, Serializable {
    private static final int MAXIMUM_CAPACITY = 1 << 30;
    private static final int DEFAULT_CAPACITY = 16;

    static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;
    private static final int DEFAULT_CONCURRENCY_LEVEL = 16;
    private static final float LOAD_FACTOR = 0.75f;

    static final int TREEIFY_THRESHOLD = 8;
    static final int UNTREEIFY_THRESHOLD = 6;
    static final int MIN_TREEIFY_CAPACITY = 64;
    private static final int MIN_TRANSFER_STRIDE = 16;

    private static int RESIZE_STAMP_BITS = 16;

    private static final int MAX_RESIZERS = (1 << (32 - RESIZE_STAMP_BITS)) - 1;
    private static final int RESIZE_STAMP_SHIFT = 32 - RESIZE_STAMP_BITS;

    static final int MOVED = -1; // hash for forwarding nodes
    static final int TREEBIN = -2; // hash for roots of trees
    static final int RESERVED = -3; // hash for transient reservations
    static final int HASH_BITS = 0x7fffffff; // usable bits of normal node hash

    static final int NCPU = Runtime.getRuntime().availableProcessors();
}
```

## 源码（二）

### 构造器分析

可以看到实现了懒惰初始化，在构造方法中仅仅计算了 table 的大小，以后在第一次使用时才会真正创建

#### 数组大小

```java
public class ConcurrentHashMap<K, V> extends AbstractMap<K, V> implements ConcurrentMap<K, V>, Serializable {
    private static final int MAXIMUM_CAPACITY = 1 << 30;
    
    private transient volatile int sizeCtl;
    
    // initialCapacity 初始容量
    // loadFactor 负载因子，即扩容阈值，默认容量的 3/4
    // concurrencyLevel 并发度
    public ConcurrentHashMap(int initialCapacity, float loadFactor, int concurrencyLevel) {
        // 方法参数校验
        if (!(loadFactor > 0.0f) || initialCapacity < 0 || concurrencyLevel <= 0) {
            throw new IllegalArgumentException();
        }

        // 考虑“并发度”
        if (initialCapacity < concurrencyLevel) { // Use at least as many bins
            initialCapacity = concurrencyLevel;   // as estimated threads
        }
      
        // 考虑“负载因子”
        long size = (long) (1.0 + (long) initialCapacity / loadFactor);

        // tableSizeFor 仍然是保证计算的大小是 2^n, 即 16,32,64 ...（哈希算法的要求）
        int cap = (size >= (long) MAXIMUM_CAPACITY) ?
                MAXIMUM_CAPACITY : tableSizeFor((int) size);
        this.sizeCtl = cap;
    }

    // Returns a power of two table size for the given desired capacity.
    private static final int tableSizeFor(int c) {
        int n = c - 1;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
    }
}
```

#### 数组初始化 -initTable

在 `ConcurrentHashMap` 类中以下方法中调用 `initTable` 方法：

- putVal
- computeIfAbsent
- computeIfPresent
- compute
- merge

```java
public class ConcurrentHashMap<K, V> extends AbstractMap<K, V> implements ConcurrentMap<K, V>, Serializable {
    
    private static final int DEFAULT_CAPACITY = 16;
    
    // 创建 table 的操作，可能有多个线程参与：
    // - 实际上，只能由一个 thread 来完成创建；
    // - 与此同时，其它线程会在 while() 循环中 yield 直至 table 创建
    private final Node<K, V>[] initTable() {
        // tab 是 table 的对应“局部变量”
        Node<K, V>[] tab;
        // sc 是 sizeCtl 的对应“局部变量”
        int sc;
        
        // 可能有多个 thread 进入 while 语句
        while ((tab = table) == null || tab.length == 0) {
            // 其它 thread：自旋等待
            if ((sc = sizeCtl) < 0) {
                Thread.yield(); // lost initialization race; just spin
            }

            // 只有一个 thread 会成功：CAS 方式尝试将 sizeCtl 设置为 -1（表示初始化 table）
            else if (U.compareAndSwapInt(this, SIZECTL, sc, -1)) {
                
                try {
                    // 再次判断当前数组是否已经初始化完毕
                    if ((tab = table) == null || tab.length == 0) {
                        // n 表示数组长度
                        // 如果 sizeCtl > 0，就初始化 sizeCtl 长度的数组
                        // 如果 sizeCtl == 0，就初始化默认长度
                        int n = (sc > 0) ? sc : DEFAULT_CAPACITY;
                        
                        // 创建数组
                        Node<K, V>[] nt = (Node<K, V>[]) new Node<?, ?>[n];
                      
                        // 将初始化的数组 nt，赋值给 tab 和 table
                        table = tab = nt;
                        
                        // 重新计算 sc = n * 3/4;
                        // sc 赋值为：数组长度 - 数组长度 / 4
                        // 将 sc 赋值为下次扩容的阈值，即 n 的 3/4
                        sc = n - (n >>> 2);
                    }
                } finally {
                    // 更新 sizeCtl
                    sizeCtl = sc;
                }
                break;
            }
        }
        return tab;
    }
}
```

### get 流程

`get` 方法：没有使用锁，并发度高。

```java
public class ConcurrentHashMap<K, V> extends AbstractMap<K, V> implements ConcurrentMap<K, V>, Serializable {
    public V get(Object key) {
        // 整个数组
        Node<K, V>[] tab;
        // 数组长度
        int n;
        
        // 某个元素、它的 hash 值 和 它的 key
        Node<K, V> e;
        int eh;
        K ek;

        Node<K, V> p;

        // spread 方法能确保返回结果是正数
        int h = spread(key.hashCode());

        // 三个条件：table 不为 null、table 的长度大于 0、数组元素不为 null
        if ((tab = table) != null && (n = tab.length) > 0 &&
                (e = tabAt(tab, (n - 1) & h)) != null) {

            // 第 1 种情况，hash 为正数
            // 头结点：如果头结点已经是要查找的 key
            if ((eh = e.hash) == h) {
                if ((ek = e.key) == key || (ek != null && key.equals(ek)))
                    return e.val;
            }

            // 第 2 种情况，hash 为负数
            // hash 为负数，表示该 bin 在扩容中（-1）或是 treebin（-2）, 这时调用 find 方法来查找
            // 扩容：在扩容中，根据 ForwardingNode 到新表去找
            // 红黑树：如果是红黑树，就用红黑树的查找算法找
            // find 方法，查找目标 -- More
            else if (eh < 0) {
                return (p = e.find(h, key)) != null ? p.val : null;
            }

            // 第 3 种情况，链表
            // 链表：正常遍历链表, 用 equals 比较
            while ((e = e.next) != null) {
                // hashcode 相同
                if (e.hash == h &&
                        // key 相等：== 或 equals
                        ((ek = e.key) == key || (ek != null && key.equals(ek))))
                    return e.val;
            }
        }
        return null;
    }
}
```

### put 流程

以下数组简称（table），链表简称（bin）

```java
public class ConcurrentHashMap<K, V> extends AbstractMap<K, V> implements ConcurrentMap<K, V>, Serializable {
    public V put(K key, V value) {
        return putVal(key, value, false);
    }

    final V putVal(K key, V value, boolean onlyIfAbsent) {
        if (key == null || value == null) {
            throw new NullPointerException();
        }

        // 其中 spread 方法会综合高位低位, 具有更好的 hash 性
        int hash = spread(key.hashCode());
        
        // 
        int binCount = 0;
        
        // 将 table 赋值给 tab，此处是死循环
        for (Node<K, V>[] tab = table; ; ) {
            // f 是链表头节点
            // fh 是链表头结点的 hash
            Node<K, V> f;
            int fh;

            // n 是链表长度
            // i 是链表在 table 中的下标
            int n, i;

            // 要创建 table
            if (tab == null || (n = tab.length) == 0) {
                // 初始化 table 使用了 cas, 无需 synchronized 创建成功, 进入下一轮循环
                tab = initTable();
            }
            // 要创建链表头节点
            // 基于 (n - 1) & hash 计算出当前 Node 需要存放在哪个索引位置
            // 基于 tabAt 获取到 i 位置的数据
            // 当 f 不为 null 时，说明发生了 hash 冲突
            else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {
                // 添加链表头使用了 cas, 无需 synchronized
                if (casTabAt(tab, i, null,
                        new Node<K, V>(hash, key, value, null))) {
                    // 如果成功，执行 break 跳出循环，插入数据成功
                    break;                   // no lock when adding to empty bin
                }
            }
            // 判断当前位置数据是否正在扩容 -- More
            else if ((fh = f.hash) == MOVED) {
                // 让当前插入数据的线程协助扩容；帮忙扩容之后, 进入下一轮循环
                tab = helpTransfer(tab, f);
            } else {
                V oldVal = null;
                // 锁住链表头节点
                synchronized (f) {
                    // 再次确认链表头节点没有被移动
                    if (tabAt(tab, i) == f) {
                        // 链表：头节点的 hash 值大于等于 0
                        if (fh >= 0) {
                            binCount = 1;
                            // 遍历链表
                            for (Node<K, V> e = f; ; ++binCount) {
                                K ek;
                                
                                // 第 1/3 步，当前 node
                                // hash 相同
                                if (e.hash == hash &&
                                        // key 相同
                                        ((ek = e.key) == key ||
                                                (ek != null && key.equals(ek)))) {
                                    // 走到这儿，说明：目标找到了
                                    oldVal = e.val;
                                    
                                    // 是否更新，还是需要看 onlyIfAbsent 变量的值
                                    if (!onlyIfAbsent) {
                                        e.val = value;
                                    }
                                    
                                    // 退出 for 循环
                                    break;
                                }

                                // 第 2/3 步，指向下一个 node
                                Node<K, V> pred = e;
                                e = e.next;

                                // 第 3/3 步，特殊情况。如果已经是最后的节点了，新增 Node，追加至链表尾
                                if (e == null) {
                                    pred.next = new Node<K, V>(hash, key, value, null);
                                    // 退出 for 循环
                                    break;
                                }
                            }
                        }
                        // 红黑树
                        else if (f instanceof TreeBin) {
                            Node<K, V> p;
                            binCount = 2;
                            // putTreeVal 会看 key 是否已经在树中？如果“是”，则返回对应的 TreeNode
                            if ((p = ((TreeBin<K, V>) f).putTreeVal(hash, key, value)) != null) {
                                // 在红黑树中，存在相应的 node
                                oldVal = p.val;
                                
                                // 是否更新，还是需要看 onlyIfAbsent 变量的值
                                if (!onlyIfAbsent) {
                                    p.val = value;
                                }
                                    
                            }
                        }
                    }
                }
                // 释放链表头节点的锁

                // 如果 binCount 不为 0，就可以退出 for 循环了
                if (binCount != 0) {
                    // 如果链表长度 >= 树化阈值(8), 进行链表转为红黑树
                    if (binCount >= TREEIFY_THRESHOLD) {
                        treeifyBin(tab, i);
                    }

                    if (oldVal != null) {
                        return oldVal;
                    }

                    break;
                }
            }
        }

        // 增加 size 计数
        addCount(1L, binCount);
        return null;
    }
}
```

## 计数

### size 计算流程

size 计算实际发生在 put，remove 改变集合元素的操作之中

- 没有竞争发生，向 baseCount 累加计数
- 有竞争发生，新建 counterCells，向其中的一个 cell 累加计数
    - counterCells 初始有两个 cell
    - 如果计数竞争比较激烈，会创建新的 cell 来累加计数

```java
public class ConcurrentHashMap<K, V> extends AbstractMap<K, V> implements ConcurrentMap<K, V>, Serializable {
    public int size() {
        long n = sumCount();
        return ((n < 0L) ? 0 :
                (n > (long) Integer.MAX_VALUE) ? Integer.MAX_VALUE :
                        (int) n);
    }

    final long sumCount() {
        CounterCell[] as = counterCells;
        CounterCell a;

        // 将 baseCount 计数与所有 cell 计数累加
        long sum = baseCount;
        if (as != null) {
            for (int i = 0; i < as.length; ++i) {
                if ((a = as[i]) != null)
                    sum += a.value;
            }
        }
        return sum;
    }
}
```

## Reference

- [一文看懂 jdk8 中的 ConcurrentHashMap](https://juejin.cn/post/6896387191828643847) 图画非常精彩
- [ConcurrentHashMap 源码分析和原理](https://www.wdbyte.com/2020/04/jdk/concurrent-hashmap/) 系列文章，还有 CopyOnWriteArrayList
- [视频 -ConcurrentHashMap 扩容的流程](https://www.bilibili.com/video/BV1e54y1T7Qq/)
- [多线程与高并发——并发编程](https://blog.csdn.net/yangwei234/article/details/132783814)

