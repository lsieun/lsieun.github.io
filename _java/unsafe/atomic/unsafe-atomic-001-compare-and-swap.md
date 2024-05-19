---
title: "CompareAndSwap"
sequence: "106"
---

## compare and swap

```java
public final class Unsafe {
    /**
     * Atomically update Java variable to <tt>x</tt> if it is currently
     * holding <tt>expected</tt>.
     * @return <tt>true</tt> if successful
     */
    public final native boolean compareAndSwapObject(Object o, long offset,
                                                     Object expected,
                                                     Object x);

    /**
     * Atomically update Java variable to <tt>x</tt> if it is currently
     * holding <tt>expected</tt>.
     * @return <tt>true</tt> if successful
     */
    public final native boolean compareAndSwapInt(Object o, long offset,
                                                  int expected,
                                                  int x);

    /**
     * Atomically update Java variable to <tt>x</tt> if it is currently
     * holding <tt>expected</tt>.
     * @return <tt>true</tt> if successful
     */
    public final native boolean compareAndSwapLong(Object o, long offset,
                                                   long expected,
                                                   long x);
}
```

## Example

```java
public class HelloWorld {
    private volatile long counter = 0;

    public long getCounter() {
        return counter;
    }
}
```

```java
import sun.misc.Unsafe;

import java.lang.reflect.Field;

public class Program {
    public static void main(String[] args) throws NoSuchFieldException {
        HelloWorld instance = new HelloWorld();
        printValue(instance);

        long counter = instance.getCounter();
        long before = counter;

        Class<?> clazz = HelloWorld.class;
        Field field = clazz.getDeclaredField("counter");

        Unsafe unsafe = UnsafeUtils.getInstance();
        long fieldOffset = unsafe.objectFieldOffset(field);

        while (!unsafe.compareAndSwapLong(instance, fieldOffset, before, before + 1)) {
            before = counter;
        }

        printValue(instance);
    }

    private static void printValue(HelloWorld instance) {
        long counter = instance.getCounter();
        System.out.println(counter);
    }
}
```
