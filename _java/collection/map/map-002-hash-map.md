---
title: "HashMap"
sequence: "102"
---

## HashMap 与 Hashtable 的区别

`HashMap` 类的继承结构：

![](/assets/images/java/collection/map/hash-map-class-hierarchy.png)

`Hashtable` 类的继承结构：

![](/assets/images/java/collection/map/hash-table-class-hierarchy.png)

- 1、线程安全。key 和 value 都是存储在 `Entry` 中的
    - HashMap 实现不同步，线程不安全。
    - Hashtable 线程安全。
- 2、继承不同
    - `HashMap` 继承 `AbstractMap` 类
    - `Hashtable` 继承 `Dictionary` 类
- 3、同步处理。
    - Hashtable 中的方法是同步的，在多线程并发环境下，可以直接使用 Hashtable。
    - HashMap 中的方法，在缺省情况下，是非同步的；在多线程并发情况下，使用 HashMap，需要自己添加同步处理。
- 4、对 null 值的处理：key 和 value 值是否可以存 null 值？
    - 在 Hashtable 中，key 和 value 都不允许出现 null 值。
    - 在 HashMap 中，null 可以作为键，这样的键只有一个；可以有一个或多个 key 所对应的 value 为 null。
        - 当 `get()` 方法返回 null 值时，即可以表示 HashMap 中没有该 key，也可以表示该 key 所对应的值为 null。
        - 因此，在 HashMap 中，不能由 get() 方法来判断。
        - HashMap 中，是否存在某个键，而应该用 `containsKey()` 方法来判断。
- 5、哈希值的使用不同。
    - Hashtable 直接使用对象的 hashCode；
    - HashMap 重新计算 hash 值。

### 是否线程安全

`HashMap` 是线程不安全的，效率比较高：

```java
public class HashMap<K, V> extends AbstractMap<K, V>
        implements Map<K, V>, Cloneable, Serializable {

    // step 1. 没有 synchronized 关键字
    public V put(K key, V value) {
        // step 2.
        return putVal(hash(key), key, value, false, true);
    }

    // step 2. 没有 synchronized 关键字
    final V putVal(int hash, K key, V value, boolean onlyIfAbsent, boolean evict) {
        // ...
    }
}
```

`Hashtable` 是线程安全的，效率比较低：

```java
public class Hashtable<K, V> extends Dictionary<K, V>
        implements Map<K, V>, Cloneable, java.io.Serializable {

    // 有 synchronized 关键字
    public synchronized V put(K key, V value) {
        // ...
    }
}
```

### 能否存放 null 值

#### 测试 HashMap

```java
import java.util.HashMap;

public class HelloWorld {
    public static void main(String[] args) {
        HashMap<String, String> hashMap = new HashMap<>();
        hashMap.put(null, "value");

        System.out.println(hashMap);
    }
}
```

输出结果：

```text
{null=value}
```

源码分析：

```java
public class HashMap<K, V> extends AbstractMap<K, V> implements Map<K, V>, Cloneable, Serializable {
    // step 1
    public V put(K key, V value) {
        // step 2.
        return putVal(hash(key), key, value, false, true);
    }

    // step 2. 如果 key 为 null，则返回 0
    static final int hash(Object key) {
        int h;
        return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
    }

    final V putVal(int hash, K key, V value, boolean onlyIfAbsent, boolean evict) {
        // ...
    }
}
```

#### 测试 Hashtable

```java
import java.util.Hashtable;

public class HelloWorld {
    public static void main(String[] args) {
        Hashtable<String, String> map = new Hashtable<>();
        map.put(null, "value");

        System.out.println(map);
    }
}
```

遇到异常：

```text
Exception in thread "main" java.lang.NullPointerException
	at java.util.Hashtable.put(Hashtable.java:466)
	at lsieun.run.HelloWorld.main(HelloWorld.java:8)
```

源码分析：

```java
public class Hashtable<K, V>
        extends Dictionary<K, V>
        implements Map<K, V>, Cloneable, java.io.Serializable {

    // step 1.
    public synchronized V put(K key, V value) {
        // step 2. 这里 value 不能为 null
        // Make sure the value is not null
        if (value == null) {
            throw new NullPointerException();
        }

        // Makes sure the key is not already in the hashtable.
        Entry<?, ?> tab[] = table;

        // step 3. 这里会调用 key 的 hashCode() 方法
        int hash = key.hashCode();
        int index = (hash & 0x7FFFFFFF) % tab.length;

        // ...
    }
}
```

## HashMap 底层实现

HashMap 底层实现实现方式：

- 第 1 种方式，ArrayList 集合
- 第 2 种方式，数组 + 链表
- 第 3 种方式，数组 + 链表 + 红黑树

时间复杂度：

- O(1)：只需要查询一次。例如，在 HashMap 中，使用 key 查询没有冲突的时候；数组的下标位置查询
- O(N)：需要查询 N 次。例如，在集合中，根据内容查找的时候
- O(logN)：平方查询。例如，二叉树、红黑树、平衡二叉树

如何解决 Hash 冲突的问题？

- JDK 1.7 版本：链表
- JDK 1.8 版本：链表 + 红黑树

## 目录

- HashMap 数据结构
- hash 算法 和 扩容机制

## 源码

```java
public class HashMap<K,V> extends AbstractMap<K,V>
        implements Map<K,V>, Cloneable, Serializable {

    // step 1.
    public V put(K key, V value) {
        
        // step 2.
        int hash = hash(key);
        
        // step 3.
        return putVal(hash, key, value, false, true);
    }

    // step 2.
    static final int hash(Object key) {
        int h;
        return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
    }

    // step 3.
    final V putVal(
            int hash, K key, V value,
            boolean onlyIfAbsent,
            boolean evict
    ) {
        // 第 1 步，
        Node<K,V>[] tab;
        Node<K,V> p;
        int n; // n 代表数组长度
        int i; // i 代表当前 Node 在数组中的索引值 
        
        // 第 2 步，
        if ((tab = table) == null || (n = tab.length) == 0) {
            n = (tab = resize()).length;
        }
            
        if ((p = tab[i = (n - 1) & hash]) == null)
            tab[i] = newNode(hash, key, value, null);
        else {
            Node<K,V> e; K k;
            if (p.hash == hash &&
                    ((k = p.key) == key || (key != null && key.equals(k))))
                e = p;
            else if (p instanceof TreeNode)
                e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
            else {
                for (int binCount = 0; ; ++binCount) {
                    if ((e = p.next) == null) {
                        p.next = newNode(hash, key, value, null);
                        if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                            treeifyBin(tab, hash);
                        break;
                    }
                    if (e.hash == hash &&
                            ((k = e.key) == key || (key != null && key.equals(k))))
                        break;
                    p = e;
                }
            }
            if (e != null) { // existing mapping for key
                V oldValue = e.value;
                if (!onlyIfAbsent || oldValue == null)
                    e.value = value;
                afterNodeAccess(e);
                return oldValue;
            }
        }
        ++modCount;
        if (++size > threshold)
            resize();
        afterNodeInsertion(evict);
        return null;
    }
}
```

![](/assets/images/java/collection/map/hash-map-node-class-hierarchy.png)



