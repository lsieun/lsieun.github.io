---
title: "方法区：永久代和元空间"
sequence: "101"
---

| Version | Memory    |
|---------|-----------|
| Java 7  | PermGen   |
| Java 8  | Metaspace |

## PermGen

### 什么是永久代？

PermGen (Permanent Generation) is a special heap space separated from the main memory heap.

### 永久代存放的数据有什么？

The JVM keeps track of loaded class metadata in the PermGen.
Additionally, the JVM stores all the static content in this memory section.
This includes all the static methods, primitive variables, and references to the static objects.

Furthermore, it contains data about bytecode, names, and JIT information.
Before Java 7, the String Pool was also part of this memory.
The disadvantages of the fixed pool size are listed in our write-up.

### 永久代的空间大小是多少？

在默认情况下，永久代（PermGen） 占用的空间大小：

- 在 32-bit JVM 中，PermGen 大小为 64 MB
- 在 64-bit JVM 中，PermGen 大小为 82 MB

我们可以通过 JVM options 来修改默认值：

- `-XX:PermSize=[size]` is the initial or minimum size of the PermGen space
- `-XX:MaxPermSize=[size]` is the maximum size

在 JDK 8 中，已经移除了 PermGen；如果使用这些参数，会进行提示：

```text
>> java -XX:PermSize=100m -XX:MaxPermSize=200m -version
OpenJDK 64-Bit Server VM warning: Ignoring option PermSize; support was removed in 8.0
OpenJDK 64-Bit Server VM warning: Ignoring option MaxPermSize; support was removed in 8.0
...
```

### 永久代空间不足时，会造成什么异常？

With its limited memory size, PermGen is involved in generating the famous `OutOfMemoryError`.
Simply put, the class loaders weren't garbage collected properly and, as a result, generated a **memory leak**.

Therefore, we receive a memory space error; this happens mostly in the development environment while creating new class loaders.

## Metaspace

### 什么是元空间？

Simply put, Metaspace is a new memory space – starting from the Java 8 version;
it has replaced the older PermGen memory space.

### 元空间与永久代的区别是什么？

The most significant difference is how it handles memory allocation.

Specifically, **this native memory region grows automatically by default**.

Additionally, the garbage collection process also gains some benefits from this change.
The garbage collector now automatically triggers the cleaning of the dead classes
once the class metadata usage reaches its maximum metaspace size.

Therefore, with this improvement, JVM reduces the chance to get the `OutOfMemoryError`.

Despite all of these improvements, we still need to monitor and tune the metaspace to avoid memory leaks.

### 如何调整元空间的大小？

We also have new flags to tune the memory:

- `MetaspaceSize` and `MaxMetaspaceSize` – we can set the Metaspace upper bounds.
- `MinMetaspaceFreeRatio` – is the minimum percentage of class metadata capacity free after garbage collection
- `MaxMetaspaceFreeRatio` – is the maximum percentage of class metadata capacity free after a garbage collection to avoid a reduction in the amount of space

```text
-XX:MaxMetaspaceSize=size
```

Sets the maximum amount of native memory that can be allocated for class metadata.
By default, the size is not limited.
The amount of metadata for an application depends on the application itself,
other running applications, and the amount of memory available on the system.

The following example shows how to set the maximum class metadata size to 256 MB:

```text
-XX:MaxMetaspaceSize=256m
```
