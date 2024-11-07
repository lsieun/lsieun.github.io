---
title: "ByteBuf 类层次结构"
sequence: "102"
---

[UP](/netty.html)

## 类层次结构

![](/assets/images/netty/buf/netty-buf-class-hierarchy.svg)

## 分类

- Heap, Direct
- Pooled, UnPooled
- Safe, Unsafe

![](/assets/images/netty/buf/netty-buffer-concept-classify.svg)


排序：

- Pooled：对象的重复利用
- Safe, Unsafe：操作对象数据的方式
- Heap, Direct：存储数据的位置

```java
public abstract class AbstractByteBuf extends ByteBuf {
    protected abstract byte _getByte(int index);
}
```

```java
final class HeapByteBufUtil {
    static byte getByte(byte[] memory, int index) {
        return memory[index];
    }
}
```

```java
final class PlatformDependent0 {
    static byte getByte(byte[] data, int index) {
        return UNSAFE.getByte(data, BYTE_ARRAY_BASE_OFFSET + index);
    }
}
```

