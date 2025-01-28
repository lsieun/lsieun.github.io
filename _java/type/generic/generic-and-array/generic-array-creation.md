---
title: "generic array creation"
sequence: "121"
---

The prohibition on **generic array creation** can be annoying.
It means, for example, that it's not generally possible for **a generic type** to return **an array of its element type**.
It also means that you can get confusing warnings when using **varargs methods** in combination with **generic types**.
This is because every time you invoke a **varargs method**, an array is created to hold the varargs parameters.
If the element type of this array is not reifiable, you get a warning.
There is little you can do about these warnings other than to suppress them, and to avoid mixing **generics** and **varargs** in your APIs.



## mixing generics and varargs

```java
public class HelloWorld {
    public static <T> T[] method1(T first, T second) {
        return method2(first, second);
    }

    public static <T> T[] method2(T... args) {
        return args;
    }

    public static void main(String[] args) {
        String[] strArray = method1("First", "Second");
    }
}
```

编译代码：

```bash
javac -Xlint:all HelloWorld.java
```

输出结果：

```txt
HelloWorld.java:3: warning: [unchecked] unchecked generic array creation for varargs parameter of type T[]
        return method2(first, second);
                      ^
  where T is a type-variable:
    T extends Object declared in method <T>method1(T,T)
HelloWorld.java:6: warning: [unchecked] Possible heap pollution from parameterized vararg type T
    public static <T> T[] method2(T... args) {
                                       ^
  where T is a type-variable:
    T extends Object declared in method <T>method2(T...)
2 warnings
```

使用命令：

```bash
javap -c HelloWorld.class
```

输出结果：

```txt
Compiled from "HelloWorld.java"
public class HelloWorld {
  ...

  public static <T> T[] method1(T, T);
    Code:
       0: iconst_2
       1: anewarray     #2                  // class java/lang/Object
       =====================================
       4: dup
       5: iconst_0
       6: aload_0
       7: aastore
       =====================================
       8: dup
       9: iconst_1
      10: aload_1
      11: aastore
      =====================================
      12: invokestatic  #3                  // Method method2:([Ljava/lang/Object;)[Ljava/lang/Object;
      15: areturn

  public static <T> T[] method2(T...);
    Code:
       0: aload_0
       1: areturn

  public static void main(java.lang.String[]);
    Code:
       0: ldc           #4                  // String First
       2: ldc           #5                  // String Second
       4: invokestatic  #6                  // Method method1:(Ljava/lang/Object;Ljava/lang/Object;)[Ljava/lang/Object;
       7: checkcast     #7                  // class "[Ljava/lang/String;"
      10: astore_1
      11: return
}
```

运行一下：

```bash
$ java HelloWorld
Exception in thread "main" java.lang.ClassCastException: [Ljava.lang.Object; cannot be cast to [Ljava.lang.String;
```

## The Best Solution

When you get a generic array creation error, the best solution is often to use the **collection type** `List<E>` in preference to the **array type** `E[]`. You might sacrifice some performance or conciseness, but in exchange you get better type safety and interoperability.
