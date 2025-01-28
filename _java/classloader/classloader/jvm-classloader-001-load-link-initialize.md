---
title: "加载+链接+初始化"
sequence: "101"
---

The Java Virtual Machine dynamically loads, links and initializes classes and interfaces.


## Loading

**Loading** is the process of finding the binary representation of a class or interface type
with a particular name and creating a class or interface from that binary representation.

There are two kinds of class loaders:
the **bootstrap class loader** supplied by the Java Virtual Machine, and **user-defined class loaders**.
Every user-defined class loader is an instance of a subclass of the abstract class `ClassLoader`.
Applications employ user-defined class loaders in order to extend the manner
in which the Java Virtual Machine dynamically loads and thereby creates classes.
User-defined class loaders can be used to create classes that originate from user-defined sources.
For example, a class could be downloaded across a network, generated on the fly, or extracted from an encrypted file.

## Linking

**Linking** is the process of taking a class or interface and combining it into the run-time state of the JVM
so that it can be executed.

**Linking** a class or interface involves **verifying** and
**preparing** that class or interface, its direct superclass, its direct superinterfaces,
and its element type (if it is an array type), if necessary.
**Resolution** of symbolic references in the class or interface is an optional part of linking.

```text
Linking = Verifying + Preparing + Resolution
```

**Verification** ensures that the binary representation of a class or interface is structurally correct.

**Preparation** involves creating the static fields for a class or interface and
initializing such fields to their default values.
This does not require the execution of any Java Virtual Machine code;
explicit initializers for static fields are executed as part of initialization, not preparation.

```text
Preparation = creating the static fields + initializing such fields to their default values.
```

**Resolution** is the process of dynamically determining concrete values
from symbolic references in the run-time constant pool.

```text
Resolution = symbolic reference --> direct reference
```

## Initialization

**Initialization** of a class or interface consists of executing the class or interface initialization method `<clinit>`.

## 示例代码

### Initialization

```java
package sample;

public class HelloWorld {
    public static void main(String[] args) {
        System.out.println(B.str);
    }
}

class A {
    public static String str = "AAA";

    static {
        System.out.println("A Static Block");
    }
}

class B extends A {
    static {
        System.out.println("A Static Block");
    }
}
```

Output:

```text
A Static Block
AAA
```

```text
 javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
  public sample.HelloWorld();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
       3: getstatic     #3                  // Field sample/B.str:Ljava/lang/String;
       6: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
       9: return
}
```

```java
public class HelloWorld {
    public static void main(String[] args) {
        A[] array = new A[10];
        System.out.println(array.length);
    }
}

class A {
    static {
        System.out.println("A Static Block");
    }
}
```

Output:

```text
10
```

## Reference

- [Chapter 5. Loading, Linking, and Initializing](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-5.html)
