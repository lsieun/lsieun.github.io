---
title: "Type Erasure: Actual Type"
sequence: "116"
---

What is the type erasure of xxx?

## 1. parameterized type

What is the type erasure of a parameterized type?

**The type without any type arguments**.

The erasure of a parameterized type is the type without any type arguments (i.e. the raw type). This definition extends to arrays and nested types.

Examples:

| *parameterized type*         | *type erasure* |
| ---------------------------- | -------------- |
| `List<String>`               | `List`         |
| `Map.Entry<String,Long>`     | `Map.Entry`    |
| `Pair<Long,Long>[]`          | `Pair[]`       |
| `Comparable<? super Number>` | `Comparable`   |

The type erasure of a non-parameterized type is the type itself.

## 2. type parameter

What is the type erasure of a type parameter?

**The type erasure of its leftmost bound, or type `Object` if no bound was specified**.

The type erasure of a type parameter is the erasure of its **leftmost bound**. The type erasure of an unbounded type parameter is type `Object`.

Examples:

| *type parameters*                       | *type erasure*  |
| --------------------------------------- | --------------- |
| `<T>`                                   | `Object`        |
| `<T extends Number>`                    | `Number`        |
| `<T extends Comparable<T>>`             | `Comparable`    |
| `<T extends Cloneable & Comparable<T>>` | `Cloneable`     |
| `<T extends Object & Comparable<T>>`    | `Object`        |
| `<S, T extends S>`                      | `Object,Object` |

## 3. generic method

What is the type erasure of a generic method?

**A method with the same name and the types of all method parameters replaced by their respective type erasures**.

Examples:

| *parameterized method* | *type erasure* |
| --- | --- |
| `Iterator<E> iterator()` | `Iterator iterator()` |
| `<T> T[] toArray(T[] a)` | `Object[] toArray(Object[] a)` |
| `<U> AtomicLongFieldUpdater<U> newUpdater(Class<U> tclass, String fieldName)` | `AtomicLongFieldUpdater newUpdater(Class tclass,String fieldName)` |

## 4. Example

### 4.1. T

```java
public class HelloWorld<T> {
    private T value;
}
```

After Type Erasure:

```java
public class HelloWorld {
    private Object value;
}
```

### 4.2. T extends Number

```java
public class HelloWorld<T extends Number> {
    private T value;
}
```

After Type Erasure:

```java
public class HelloWorld {
    private Number value;
}
```

### 4.3. T super Number

尽管我很愿意写这样一个示例，但实际上却不能通过编译。换句话说，设置 type parameter 的下限（low bound）是没有意义的。

```text
public class HelloWorld <T super Number> {
    private T value;
}
```

### 4.4. The left most Bound

```java
interface Runnable {
    void run();
}
interface Callable<V> {
    V call();
}

public class HelloWorld<T extends Callable<Long> & Runnable> {
    private T task1, task2;

    public void test() {
        task1.run();
        Long result = task2.call();
    }
}
```

这里我们关注 `HelloWorld` 类的 `task1` 和 `task2` 字段在经过 Type Erasure 之后是什么类型？通过下面的输出结果，我们可以知道是 `Callable` 类型。

```txt
FieldInfo {Value='task1:LCallable;', AccessFlags='[ACC_PRIVATE]', Attrs='[Signature]', HexCode='0002000a000b0001000c00000002000d'}
FieldInfo {Value='task2:LCallable;', AccessFlags='[ACC_PRIVATE]', Attrs='[Signature]', HexCode='0002000e000b0001000c00000002000d'}
```

接下来，我们稍微修改一下：

```text
// 修改前：Callable 在前，Runnable 在后
HelloWorld<T extends Callable<Long> & Runnable>
// 修改后：Runnable 在前，Callable 在后
HelloWorld<T extends Runnable & Callable<Long>>
```

再次查看结果，会发现类型变成了 `Runnable`。

```txt
FieldInfo {Value='task1:LRunnable;', AccessFlags='[ACC_PRIVATE]', Attrs='[Signature]', HexCode='0002000a000b0001000c00000002000d'}
FieldInfo {Value='task2:LRunnable;', AccessFlags='[ACC_PRIVATE]', Attrs='[Signature]', HexCode='0002000e000b0001000c00000002000d'}
```
