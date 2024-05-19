---
title: "allocation instance"
sequence: "101"
---

sun.misc.Unsafe类的allocateInstance(Class<?> var1)方法用于直接在Java堆内存（heap memory）上分配一个指定类的实例，而无需调用构造函数。
这个方法绕过了Java的常规对象创建机制，包括构造函数的执行、初始化块等，直接分配内存并返回对象的引用。
因此，它创建的对象依然位于Java虚拟机管理的堆内存空间中，并非直接内存（direct memory）。

直接内存是指Java的DirectByteBuffer等可以直接操作的、位于Java堆外的内存区域，
通常用于提高I/O操作的效率，如Netty框架中就大量使用直接内存来减少内存复制，提升性能。
而通过Unsafe.allocateInstance创建的对象，尽管也是在堆外分配（因为不经过Java堆的常规分配路径），
但仍然是堆内内存的一部分，受JVM的垃圾回收机制管理。

```java
public class HelloWorld {
    private final int intValue;

    public HelloWorld(int intValue) {
        this.intValue = intValue;
    }

    public int getIntValue() {
        return intValue;
    }
}
```

```java
public class Program {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        int intValue = instance.getIntValue();
        System.out.println(intValue); // 10
    }
}
```

```java
import lsieun.utils.UnsafeUtils;
import sun.misc.Unsafe;

public class Program {
    public static void main(String[] args) throws InstantiationException {
        Unsafe unsafe = UnsafeUtils.getInstance();
        HelloWorld instance = (HelloWorld) unsafe.allocateInstance(HelloWorld.class);
        int intValue = instance.getIntValue();
        System.out.println(intValue); // 0
    }
}
```

