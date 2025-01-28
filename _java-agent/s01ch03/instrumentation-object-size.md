---
title: "Instrumentation.getObjectSize()"
sequence: "138"
---

## getObjectSize

```java
public interface Instrumentation {
    long getObjectSize(Object objectToSize);
}
```

Returns an implementation-specific approximation of the amount of storage consumed by the specified object.
The result may include some or all of the object's overhead, and thus is useful for comparison within an implementation but not between implementations.
The estimate may change during a single invocation of the JVM.

Note that the `getObjectSize()` method does not include the memory used by other objects referenced by the object passed in.
For example, if Object A has a reference to Object B,
then Object A's reported memory usage will include only the bytes needed for the reference to Object B (usually 4 bytes), not the actual object.

小总结

- 第一，调用 `getObjectSize(Object objectToSize)` 方法后，得到的是一个粗略的对象大小，不同的虚拟机实现可能是不同的。
- 第二，调用 `getObjectSize(Object objectToSize)` 方法只是返回传入对象的大小，并不包含它关联的对象大小（例如，字段指向另一个对象）。

## 示例一：获取对象大小

### Application

```java
package sample;

import lsieun.agent.LoadTimeAgent;

import java.lang.instrument.Instrumentation;

public class Program {
    public static void printInstrumentationSize(final Object obj) {
        Class<?> clazz = obj.getClass();
        Instrumentation inst = LoadTimeAgent.getInstrumentation();
        long size = inst.getObjectSize(obj);
        String message = String.format("Object of type %s has size of %s bytes.", clazz, size);
        System.out.println(message);
    }

    public static void main(String[] args) throws Exception {
        // 第一组
        Object obj = new Object();
        final StringBuilder sb = new StringBuilder();

        // 第二组
        String emptyString = "";
        String noneEmptyString = "ToBeOrNotToBeThatIsTheQuestion";

        // 第三组
        String[] strArray10 = new String[10];
        String[] strArray20 = new String[20];

        printInstrumentationSize(obj);
        printInstrumentationSize(sb);
        printInstrumentationSize(emptyString);
        printInstrumentationSize(noneEmptyString);
        printInstrumentationSize(strArray10);
        printInstrumentationSize(strArray20);
    }
}
```

### Agent Jar

```java
package lsieun.agent;

import java.lang.instrument.Instrumentation;

public class LoadTimeAgent {
    private static volatile Instrumentation globalInstrumentation;

    public static void premain(String agentArgs, Instrumentation inst) {
        globalInstrumentation = inst;
    }

    public static void agentmain(String agentArgs, Instrumentation inst) {
        globalInstrumentation = inst;
    }
    
    public static Instrumentation getInstrumentation() {
        if (globalInstrumentation == null) {
            throw new IllegalStateException("Agent not initialized.");
        }
        return globalInstrumentation;
    }
}
```

### Run

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program

Object of type class java.lang.Object has size of 16 bytes.
Object of type class java.lang.StringBuilder has size of 24 bytes.
Object of type class java.lang.String has size of 24 bytes.
Object of type class java.lang.String has size of 24 bytes.
Object of type class [Ljava.lang.String; has size of 56 bytes.
Object of type class [Ljava.lang.String; has size of 96 bytes.
```

## 示例二：获取对象大小（深度）

Calculating "deep" memory usage of an object

Usually it is more interesting to query the **"deep" memory usage** of an object, which includes "subobjects" (objects referred to by a given object).

### Application

```java
package sample;

import lsieun.agent.LoadTimeAgent;
import lsieun.utils.MemoryUtils;

import java.lang.instrument.Instrumentation;

public class Program {
    public static void printInstrumentationSize(final Object obj) {
        Class<?> clazz = obj.getClass();
        Instrumentation inst = LoadTimeAgent.getInstrumentation();

        MemoryUtils.setInstrumentation(inst);
        long size = MemoryUtils.deepMemoryUsageOf(obj);

        String message = String.format("Object of type %s has size of %s bytes.", clazz, size);
        System.out.println(message);
    }

    public static void main(String[] args) throws Exception {
        // 第一组
        Object obj = new Object();
        final StringBuilder sb = new StringBuilder();

        // 第二组
        String emptyString = "";
        String noneEmptyString = "ToBeOrNotToBeThatIsTheQuestion";

        // 第三组
        String[] strArray10 = new String[10];
        String[] strArray20 = new String[20];

        printInstrumentationSize(obj);
        printInstrumentationSize(sb);
        printInstrumentationSize(emptyString);
        printInstrumentationSize(noneEmptyString);
        printInstrumentationSize(strArray10);
        printInstrumentationSize(strArray20);
    }
}
```

### Agent Jar

这部分代码来参考自[Classmexer agent](https://www.javamex.com/classmexer/)。

```java
package lsieun.utils;

public enum VisibilityFilter {
    ALL, PRIVATE_ONLY, NON_PUBLIC, NONE;
}
```

```text
             ┌─── Primitive Type
             │
             │                                        ┌─── static field
             │                                        │
Java Type ───┤                      ┌─── Class ───────┤                        ┌─── public
             │                      │                 │                        │
             │                      │                 │                        ├─── protected
             │                      │                 └─── non-static field ───┤
             │                      │                                          ├─── package
             └─── Reference Type ───┤                                          │
                                    │                                          └─── private
                                    │
                                    ├─── Interface
                                    │
                                    └─── Array
```

```java
package lsieun.utils;

import java.lang.instrument.Instrumentation;
import java.lang.reflect.Field;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.Stack;

public class MemoryUtils {
    private static final int ACC_PUBLIC    = 0x0001; // class, field, method
    private static final int ACC_PRIVATE   = 0x0002; // class, field, method
    private static final int ACC_PROTECTED = 0x0004; // class, field, method
    private static final int ACC_STATIC    = 0x0008; // field, method

    private static Instrumentation inst;

    public static void setInstrumentation(Instrumentation inst) {
        MemoryUtils.inst = inst;
    }

    public static Instrumentation getInstrumentation() {
        return inst;
    }

    public static long memoryUsageOf(Object obj) {
        return getInstrumentation().getObjectSize(obj);
    }

    public static long deepMemoryUsageOf(Object obj) {
        return deepMemoryUsageOf(obj, VisibilityFilter.NON_PUBLIC);
    }

    public static long deepMemoryUsageOf(Object obj, VisibilityFilter referenceFilter) {
        return deepMemoryUsageOf0(getInstrumentation(), new HashSet<>(), obj, referenceFilter);
    }

    public static long deepMemoryUsageOfAll(Collection<?> coll) {
        return deepMemoryUsageOfAll(coll, VisibilityFilter.NON_PUBLIC);
    }

    public static long deepMemoryUsageOfAll(Collection<?> coll, VisibilityFilter referenceFilter) {
        Instrumentation inst = getInstrumentation();
        long total = 0L;
        Set<Integer> counted = new HashSet<>(coll.size() * 4);
        for (Object obj : coll) {
            total += deepMemoryUsageOf0(inst, counted, obj, referenceFilter);
        }
        return total;
    }

    private static long deepMemoryUsageOf0(Instrumentation instrumentation, Set<Integer> counted, Object obj, VisibilityFilter filter) {
        Stack<Object> stack = new Stack<>();
        stack.push(obj);
        long total = 0L;
        while (!stack.isEmpty()) {
            Object item = stack.pop();
            // 计算对象的 hash 值是为了避免同一个对象重复计算多次
            if (counted.add(System.identityHashCode(item))) {
                long size = instrumentation.getObjectSize(item);
                total += size;
                Class<?> clazz = item.getClass();

                // 如果是数组类型，则要计算每一个元素的大小
                Class<?> compType = clazz.getComponentType();
                if (compType != null && !compType.isPrimitive()) {
                    Object[] array = (Object[]) item;
                    for (Object element : array) {
                        if (element != null) {
                            stack.push(element);
                        }
                    }
                }

                // 递归查找类里面定义的具体字段值大小
                while (clazz != null) {
                    Field[] fields = clazz.getDeclaredFields();
                    for (Field f : fields) {
                        int modifiers = f.getModifiers();
                        if ((modifiers & ACC_STATIC) == 0 && isOf(filter, modifiers)) {
                            Class<?> fieldClass = f.getType();
                            if (!fieldClass.isPrimitive()) {
                                if (!f.isAccessible()) {
                                    f.setAccessible(true);
                                }
                                try {
                                    Object subObj = f.get(item);
                                    if (subObj != null) {
                                        stack.push(subObj);
                                    }
                                } catch (IllegalAccessException illAcc) {
                                    throw new InternalError("Couldn't read " + f);
                                }
                            }
                        }
                    }
                    clazz = clazz.getSuperclass();
                }
            }
        }
        return total;
    }

    private static boolean isOf(VisibilityFilter f, int modifiers) {
        switch (f) {
            case NONE:
                return false;
            case PRIVATE_ONLY:
                return ((modifiers & ACC_PRIVATE) != 0);
            case NON_PUBLIC:
                return ((modifiers & ACC_PUBLIC) == 0);
            case ALL:
                return true;
        }
        throw new IllegalArgumentException("Illegal filter " + modifiers);
    }
}
```

### Run

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program
Object of type class java.lang.Object has size of 16 bytes.
Object of type class java.lang.StringBuilder has size of 72 bytes.
Object of type class java.lang.String has size of 40 bytes.
Object of type class java.lang.String has size of 104 bytes.
Object of type class [Ljava.lang.String; has size of 56 bytes.
Object of type class [Ljava.lang.String; has size of 96 bytes.
```

## 总结

本文内容总结如下：

- 第一点，调用 `getObjectSize(Object objectToSize)` 方法返回的是一个对象占用的空间大小，是一个粗略值，不一定十分准确。
- 第二点，如何计算一个对象的"deep" memory usage。
