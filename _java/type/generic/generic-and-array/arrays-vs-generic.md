---
title: "Array 与 Generic 的不同：covariant、invariant"
sequence: "102"
---

在 Java 语言中，数组（array）和集合（collection）是先出现的，泛型（generic）是 Java 1.5 之后引入的特性。

- Java 1.0 数组（array）
- Java 1.2 集合（collection）
- Java 1.5 泛型（generic）

那么，Java 语言就需要将泛型（generic）融合到数组（array）和集合（collection）当中去，但是有不同的融合效果：

- 数组（array）和泛型（generic），融合的并不好
- 集合（collection）和泛型（generic），融合的很好

```text
数组（array）
                           泛型（generic）
集合（collection）
```

数组（array）和泛型（generic），融合的并不好，肯定是有原因的，就在于两者的不同。

在本文当中，我们主要关注于数组（array）和泛型（generic）的不同之处，并从历史的角度来解释其中的原因。

## 不同之处

数组（array）和泛型（generic）的不同之处主要体现在两方面：

- 第一方面，从 Java 语言的角度来讲，数组（array）支持协变，而泛型（generic）不支持协变。（arrays are covariant, generics are invariant）
- 第二方面，从 ClassFile 实现角度来讲，数组（array）可以“具体化”，而泛型（generic）不能“具体化”。
  （arrays are reified, generics are erasured）

Java 分成四部分：Java Language, Class File, Java API, JVM。

按照这种划分方法的话，

- arrays are covariant, generics are invariant 是属于 Java Language 的部分，是 Java 语言所规定的。
- arrays are reified, generics are erasured 是属于 Class File 的部分。
  在 `.class` 文件中，generics 的一部分类型信息会被擦除，而 arrays 则要求“类型信息”能够完整保留下来。

### 第一处不同

Arrays are covariant, Generics are invariant.

Arrays are covariant. This scary-sounding word means simply that if `Sub` is a subtype of `Super`, then the array type `Sub[]` is a subtype of `Super[]`.

Generics, by contrast, are invariant: for any two distinct types `Type1` and `Type2`, `List<Type1>` is neither a subtype nor a supertype of `List<Type2>`.

下面这两条语句是正确的，因为 `String` 是 `Object` 的子类型：

```text
String str = "Hello";
Object obj = str;
```

第一个问题：转换成数组（array）之后，`String[]` 还是 `Object[]` 的子类型吗？回答：是的。

```text
String[] strArray = {"Hello", "World"};
Object[] objArray = strArray;
```

第二个问题：转换成泛型（generic）之后，`List<String>` 还是 `List<Object>` 的子类型吗？回答：不是。

```text
List<String> strList = new ArrayList<>();
List<Object> objList = strList; // error
```

那么，随之而来，就有一个问题：数组（array）体现出来的 covariance 和泛型（generic）体现出来的 invariance，到底哪一个好，哪一个坏呢？

回答：从 type safety 的角度来说，泛型（generic）体现出来的 invariance 更好一些。

You might think this means that generics are deficient, but arguably it is arrays that are deficient.

使用数组（array），在 compile time 不会报错，但是 runtime 时会报错：

```text
// Fails at runtime!
Long[] longArray = new Long[10];
Object[] objArray = longArray;
objArray[0] = "I don't fit in"; // Throws ArrayStoreException
```

使用泛型（array），在 compile time 就会报错：

```text
// Won't compile!
List<Long> longList = new ArrayList<>();
List<Object> objList = longList; // Incompatible types
objList.add("I don't fit in");
```

在软件中，有一个原则：如果有错误，那么越早知道越好。根据这个原则，泛型（array）更好一些，它在 compile time 时就会报错；而数组（array）只能在 runtime 时检查出错误。

### 第二处不同

Arrays are reified, Generics are erasured

#### Arrays are reified

**Arrays carry runtime type information about their component type**, that is, about the type of the elements contained.
The runtime type information regarding the component type is used
when elements are stored in an array in order to ensure that no "alien" elements can be inserted.

When an element is inserted into the array,
the information about the array's component type is used to perform a type check -
the so-called **array store check**.

If you try to store a `String` into an array of `Long`, you'll get an `ArrayStoreException`.

```java
public class HelloWorld {
    public void test() {
        Long[] longArray = new Long[10];
        Object[] objArray = longArray;
        objArray[0] = "I don't fit in";
    }
}
```

In our example the array store check will fail
because we are trying to add a `String` to an array of `Long`s.
Failure of the array store check is reported by means of a `ArrayStoreException`.

```text
$ javap -v -p HelloWorld.class
...
  public void test();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=3, locals=3, args_size=1
         0: bipush        10
         2: anewarray     #2                  // class java/lang/Long
         ================================================================================= 创建 long 类型的数组
         5: astore_1
         6: aload_1
         7: astore_2
         8: aload_2
         9: iconst_0
        10: ldc           #3                  // String I don't fit in
        12: aastore
        13: return
      LineNumberTable:
        line 5: 0
        line 6: 6
        line 7: 8
        line 8: 13
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      14     0  this   Lsample/HelloWorld;
            6       8     1 longArray   [Ljava/lang/Long;   ======== 这里也记录了 Long[]类型
            8       6     2 objArray   [Ljava/lang/Object;

```

#### Generics are erasured

**Generics, by contrast, are implemented by erasure**.
This means that they enforce their type constraints only at compile time and discard (or erase) their element type information at runtime.
Erasure is what allows generic types to interoperate freely with legacy code that does not use generics.

```java
import java.util.ArrayList;
import java.util.List;

public class HelloWorld {
    public void test() {
        List<Long> longList = new ArrayList<>();
    }
}
```

第一次编译，不带任何调试信息：

```text
$ javac -g:none HelloWorld.java
```

使用 `javap` 命令查看 `HelloWorld.class` 文件：

```text
$ javap -v -p HelloWorld.class
...
  public void test();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=2, locals=2, args_size=1
         0: new           #2                  // class java/util/ArrayList
         3: dup
         4: invokespecial #3                  // Method java/util/ArrayList."<init>":()V
         ================================================================================= 完全看不出 List<Long>类型的信息
         7: astore_1
         8: return
```

第二次编译，带有调试信息：

```text
$ javac -g HelloWorld.java
```

使用 `javap` 命令查看 `HelloWorld.class` 文件：

```text
$ javap -v -p HelloWorld.class
...
  public void test();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=2, locals=2, args_size=1
         0: new           #2                  // class java/util/ArrayList
         3: dup
         4: invokespecial #3                  // Method java/util/ArrayList."<init>":()V
         ================================================================================= 完全看不出 List<Long>类型的信息
         7: astore_1
         8: return
      LineNumberTable:
        line 6: 0
        line 7: 8
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       9     0  this   LHelloWorld;
            8       1     1 longList   Ljava/util/List;
      LocalVariableTypeTable:
        Start  Length  Slot  Name   Signature
            8       1     1 longList   Ljava/util/List<Ljava/lang/Long;>; ========= 可以看到 List<Long>类型的信息
```



## 历史原因

**The design of Java's generics** contains the solution to **an old problem**.

### Array Covariance

In the earliest versions of Java, before the collections libraries were even introduced, the language had been forced to confront a deepseated type system design issue.

Put simply, the question is this:

- Should **an array of strings** be compatible with a variable of type **array of object**?

In other words, should this code be legal?

```text
String[] words = {"Hello World!"};
Object[] objects = words;
```

Without this, then even simple methods like `Arrays::sort` would have been very difficult to write in a useful way, as this would not work as expected:

```text
Arrays.sort(Object[] a);
```

The method declaration would only work for the type `Object[]` and not for any other array type.
As a result of these complications, the very first version of the Java Language Standard determined that:

- If a value of type `C` can be assigned to a variable of type `P` then a value of type `C[]` can be assigned to a variable of type `P[]`.

That is, **arrays' assignment syntax** varies with **the base type** that they hold, or **arrays** are **covariant**.

This design decision is rather unfortunate, as it leads to immediate negative consequences:

```text
String[] words = {"Hello", "World!"};
Object[] objects = words;

// Oh, dear, runtime error
objects[0] = new Integer(42);
```

The assignment to `objects[0]` attempts to store an `Integer` into a piece of storage that is expecting to hold a `String`.
This obviously will not work, and will throw an `ArrayStoreException`.

**The usefulness of covariant arrays** led to them being seen as **a necessary evil** in the very early days of the platform,
despite the hole in the static type system that the feature exposes.

However, more recent research on modern open source codebases indicates that **array covariance is extremely rarely used** and is a language misfeature.
**You should avoided it when writing new code**.

### Generics Invariance

When considering the behavior of generics in the Java platform, a very similar question can be asked: “Is `List<String>` a subtype of `List<Object>`?” That is, can we write this:

```text
// Is this legal?
List<Object> objects = new ArrayList<String>();
```

At first glance, this seems entirely reasonable — `String` is a subclass of `Object`, so we know that any `String` element in our collection is also a valid `Object`.

However, consider the following code (which is just the **array covariance** code translated to use `List`):

```text
// Is this legal?
List<Object> objects = new ArrayList<String>();

// What do we do about this?
objects.add(new Object());
```

As the type of `objects` was declared to be `List<Object>`, then it should be legal to add an `Object` instance to it.
However, as the actual instance holds strings, then trying to add an `Object` would not be compatible, and so this would fail at runtime.

This would have changed nothing from the case of arrays, and so the resolution is to realize that although this is legal:

```text
Object o = new String("X");
```

that does not mean that the corresponding statement for generic container types is also true, and as a result:

```text
// Won't compile
List<Object> objects = new ArrayList<String>();
```

Another way of saying this is that `List<String>` is not a subtype of `List<Object>` or that **generic types are invariant, not covariant**.

## 总结

Because of these fundamental differences, **arrays and generics do not mix well**.
For example, it is illegal to create an array of a **generic type**, a **parameterized type**, or a **type parameter**.
None of these array creation expressions are legal: `new List<E>[]`, `new List<String>[]`, `new E[]`.
All will result in generic array creation errors at compile time.

Types such as `E`, `List<E>`, and `List<String>` are technically known as **non-reifiable types**.
Intuitively speaking, a non-reifiable type is one
whose runtime representation contains less information than its compile-time representation.
The only parameterized types that are reifiable are unbounded wildcard types such as `List<?>` and `Map<?,?>`.
It is legal, though infrequently useful, to create arrays of unbounded wildcard types.
