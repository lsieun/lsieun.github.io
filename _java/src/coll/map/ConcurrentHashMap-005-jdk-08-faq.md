---
title: "ConcurrentHashMap 源码解析Java 8（四）：常见问题"
sequence: "ConcurrentHashMap-105"
---

## 结构

## 链表转红黑树

将 **链表** 转为 **红黑树** 的两个条件：

- **链表**长度大于 8
- **数组**长度大于等于 64

## 并发

### 线程安全

`ConcurrentHashMap` 是线程安全的 `HashMap`，那 `ConcurrentHashMap` 是如何保证线程安全的呢？

在 JDK 8 中，`ConcurrentHashMap` 以 `CAS` + `synchronized` 实现线程安全。

- `CAS`：在没有 hash 冲突时（Node 要放在数组上时）
- `synchronized`：在出现 hash 冲突时（Node 存放的位置已经有数据了）

## 使用

### null 值

`ConcurrentHashMap` 是 Java 中一个非常重要的线程安全的哈希表实现，在并发编程环境中广泛使用。
它在内部采用了分段锁（在 JDK1.8 之后是通过 CAS 操作和 synchronized 来保证线程安全）的机制来提高并发访问效率。

关于 `ConcurrentHashMap` 不使用 `null` 值和 `null` 键，主要有以下几个原因：

#### 1. 明确性（Clarity）

在 `ConcurrentHashMap` 中，如果允许键或值为 `null`，那么当 `get` 方法返回 `null` 时，
就无法判断 `null` 是因为键不存在于映射中，还是键存在但其对应的值就是 `null`。
这种模糊性会给程序的逻辑判断带来困难。
为了避免这种情况，`ConcurrentHashMap` 设计上就不允许键或值为 `null`。

#### 2. 线程安全性（Thread Safety）

`ConcurrentHashMap` 是设计用来处理并发场景的，
如果允许 `null` 值，那么在检查某个键是否存在以及获取该键对应的值时，需要额外的同步控制来确保在这两个操作之间数据没有被其他线程修改，
否则可能会引入竞争条件。不允许 `null` 值简化了并发控制的复杂度。

#### 3. 性能考虑（Performance）

在并发环境下，`ConcurrentHashMap` 的设计尽量减少锁的使用，提高效率。
如果允许 `null` 值，那么每次查询都需要显式地检查返回值是否为 `null`，以区分是键不存在，
还是键对应的值为 `null`，这增加了处理的复杂度，并可能影响性能。

#### 4. 与 `Hashtable` 的一致性

`ConcurrentHashMap` 是早期 `Hashtable` 的一个现代替代品，`Hashtable` 也不允许键或值为 `null`。
尽管 `ConcurrentHashMap` 的内部实现与 `Hashtable` 大相径庭，
但在这个方面保持一致有助于从 `Hashtable` 平滑过渡到 `ConcurrentHashMap`。

#### 结论

综上所述，`ConcurrentHashMap` 不使用 `null` 值和 `null` 键主要是出于明确性、线程安全性、性能考虑以及与 `Hashtable` 的一致性等方面的考虑。
这样的设计使得 `ConcurrentHashMap` 在并发环境下更加可靠、高效。
