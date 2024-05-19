---
title: "change field value"
sequence: "102"
---

## API

```java
public final class Unsafe {
    /**
     * Report the location of a given field in the storage allocation of its
     * class.  Do not expect to perform any sort of arithmetic on this offset;
     * it is just a cookie which is passed to the unsafe heap memory accessors.
     *
     * <p>Any given field will always have the same offset and base, and no
     * two distinct fields of the same class will ever have the same offset
     * and base.
     *
     * <p>As of 1.4.1, offsets for fields are represented as long values,
     * although the Sun JVM does not use the most significant 32 bits.
     * However, JVM implementations which store static fields at absolute
     * addresses can use long offsets and null base pointers to express
     * the field locations in a form usable by {@link #getInt(Object,long)}.
     * Therefore, code which will be ported to such JVMs on 64-bit platforms
     * must preserve all bits of static field offsets.
     * @see #getInt(Object, long)
     */
    public native long staticFieldOffset(Field f);

    /**
     * Report the location of a given static field, in conjunction with {@link
     * #staticFieldBase}.
     * <p>Do not expect to perform any sort of arithmetic on this offset;
     * it is just a cookie which is passed to the unsafe heap memory accessors.
     *
     * <p>Any given field will always have the same offset, and no two distinct
     * fields of the same class will ever have the same offset.
     *
     * <p>As of 1.4.1, offsets for fields are represented as long values,
     * although the Sun JVM does not use the most significant 32 bits.
     * It is hard to imagine a JVM technology which needs more than
     * a few bits to encode an offset within a non-array object,
     * However, for consistency with other methods in this class,
     * this method reports its result as a long value.
     * @see #getInt(Object, long)
     */
    public native long objectFieldOffset(Field f);

    /**
     * Fetches a reference value from a given Java variable, with volatile
     * load semantics. Otherwise identical to {@link #getObject(Object, long)}
     */
    public native Object getObjectVolatile(Object o, long offset);

    /**
     * Stores a reference value into a given Java variable, with
     * volatile store semantics. Otherwise identical to {@link #putObject(Object, long, Object)}
     */
    public native void putObjectVolatile(Object o, long offset, Object x);
}
```

## 偏移量

## 字段值

## 示例

```java
public class HelloWorld {
    private final int intValue;

    public HelloWorld() {
        this.intValue = 10;
    }

    public int getIntValue() {
        return intValue;
    }
}
```

```java
import java.lang.reflect.Field;

public class Program {
    public static void main(String[] args) throws NoSuchFieldException, IllegalAccessException {
        HelloWorld instance = new HelloWorld();
        printValue(instance); // 10

        // 通过反射修改
        Class<?> clazz = HelloWorld.class;
        Field field = clazz.getDeclaredField("intValue");
        field.setAccessible(true);
        field.set(instance, 20);

        printValue(instance); // 20
    }

    private static void printValue(HelloWorld instance) {
        int intValue = instance.getIntValue();
        System.out.println(intValue);
    }
}
```

```java
import sun.misc.Unsafe;

import java.lang.reflect.Field;

public class Program {
    public static void main(String[] args) throws NoSuchFieldException {
        HelloWorld instance = new HelloWorld();
        printValue(instance); // 10

        // 通过 Unsafe 修改
        Class<?> clazz = HelloWorld.class;
        Field field = clazz.getDeclaredField("intValue");
        Unsafe unsafe = UnsafeUtils.getInstance();
        long fieldOffset = unsafe.objectFieldOffset(field);
        unsafe.putInt(instance, fieldOffset, 30);

        printValue(instance); // 30
    }

    private static void printValue(HelloWorld instance) {
        int intValue = instance.getIntValue();
        System.out.println(intValue);
    }
}
```
