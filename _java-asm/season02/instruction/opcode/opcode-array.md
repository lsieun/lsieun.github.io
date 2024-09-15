---
title: "opcode: array (20/160/205)"
sequence: "208"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## 概览

从 Instruction 的角度来说，与 array 相关的 opcode 有 20 个，内容如下：

| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|--------|-----------------|
| 188    | newarray        | 189    | anewarray       | 190    | arraylength     | 197    | multianewarray  |

| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|--------|-----------------|
| 46     | iaload          | 48     | faload          | 50     | aaload          | 52     | caload          |
| 47     | laload          | 49     | daload          | 51     | baload          | 53     | saload          |

| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|--------|-----------------|
| 79     | iastore         | 81     | fastore         | 83     | aastore         | 85     | castore         |
| 80     | lastore         | 82     | dastore         | 84     | bastore         | 86     | sastore         |

从 ASM 的角度来说，这些 opcode 与 `MethodVisitor.visitXxxInsn()` 方法对应关系如下：

- `MethodVisitor.visitIntInsn()`: `newarray`
- `MethodVisitor.visitTypeInsn()`: `anewarray`
- `MethodVisitor.visitMultiANewArrayInsn()`: `multianewarray`
- `MethodVisitor.visitInsn()`:
    - `arraylength`
    - `iaload`, `iastore`
    - `laload`, `lastore`
    - `faload`, `fastore`
    - `daload`, `dastore`
    - `aaload`, `aastore`
    - `baload`, `bastore`
    - `caload`, `castore`
    - `saload`, `sastore`

## create array

### newarray: primitive type

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        byte[] byteArray = new byte[5];
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: iconst_5
       1: newarray       byte
       3: astore_1
       4: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_5);
methodVisitor.visitIntInsn(NEWARRAY, T_BYTE);
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 2);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_5                 // {this} | {int}
0001: newarray   8 (byte)      // {this} | {[B}
0003: astore_1                 // {this, [B} | {}
0004: return                   // {} | {}
```

从 JVM 规范的角度来看，`newarray` 指令对应的 Operand Stack 的变化如下：

```text
..., count →

..., arrayref
```

The `count` must be of type `int`. It is popped off the operand stack.
The `count` represents the number of elements in the array to be created.

另外，`newarray` 指令对应的 Format 如下：

```text
newarray
atype
```

The [`atype`](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.newarray) is a code that indicates the type of array to create. It must take one of the following values:

| Array Type | atype |
|------------|-------|
| T_BOOLEAN  | 4     |
| T_CHAR     | 5     |
| T_FLOAT    | 6     |
| T_DOUBLE   | 7     |
| T_BYTE     | 8     |
| T_SHORT    | 9     |
| T_INT      | 10    |
| T_LONG     | 11    |

### anewarray: reference type

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        Object[] objArray = new Object[5];
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: iconst_5
       1: anewarray     #2                  // class java/lang/Object
       4: astore_1
       5: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_5);
methodVisitor.visitTypeInsn(ANEWARRAY, "java/lang/Object");
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 2);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_5                 // {this} | {int}
0001: anewarray       #2       // {this} | {[Object}
0004: astore_1                 // {this, [Object} | {}
0005: return                   // {} | {}
```

从 JVM 规范的角度来看，`anewarray` 指令对应的 Operand Stack 的变化如下：

```text
..., count →

..., arrayref
```

- The `count` must be of type `int`. It is popped off the operand stack. The `count` represents the number of components of the array to be created.
- A new array with components of that type, of length `count`, is allocated from the garbage-collected heap, and a reference `arrayref` to this new array object is pushed onto the operand stack.
- All components of the new array are initialized to `null`, the default value for reference types.

### multianewarray

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        Object[][] array = new Object[3][4];
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: iconst_3
       1: iconst_4
       2: multianewarray #2,  2             // class "[[Ljava/lang/Object;"
       6: astore_1
       7: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_3);
methodVisitor.visitInsn(ICONST_4);
methodVisitor.visitMultiANewArrayInsn("[[Ljava/lang/Object;", 2);
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 2);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_3                 // {this} | {int}
0001: iconst_4                 // {this} | {int, int}
0002: multianewarray  #2  2    // {this} | {[[Object}
0006: astore_1                 // {this, [[Object} | {}
0007: return                   // {} | {}
```

从 JVM 规范的角度来看，`multianewarray` 指令对应的 Operand Stack 的变化如下：

```text
..., count1, [count2, ...] →

..., arrayref
```

- All of the count values are popped off the operand stack.
- A new multidimensional array of the array type is allocated from the garbage-collected heap. A reference `arrayref` to the new array is pushed onto the operand stack.

另外，`multianewarray` 指令对应的 Format 如下：

```text
multianewarray
indexbyte1
indexbyte2
dimensions
```

The `dimensions` operand is an unsigned byte that must be greater than or equal to 1.
It represents the number of dimensions of the array to be created.
The operand stack must contain `dimensions` values.
Each such value represents the number of components in a dimension of the array to be created,
must be of type `int`, and must be non-negative.
The `count1` is the desired length in the first dimension, `count2` in the second, etc.

### special

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
  public void test() {
    // 注意，这里是一个二维数据，但只提供了第一维的大小
    int[][] array = new int[10][];
  }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: bipush        10
       2: anewarray     #2                  // class "[I"
       5: astore_1
       6: return
}
```

## array element

### int array

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int[] intArray = new int[5];
        intArray[0] = 10;
        int i = intArray[0];
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: iconst_5
       1: newarray       int
       3: astore_1
       4: aload_1
       5: iconst_0
       6: bipush        10
       8: iastore
       9: aload_1
      10: iconst_0
      11: iaload
      12: istore_2
      13: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_5);
methodVisitor.visitIntInsn(NEWARRAY, T_INT);
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitVarInsn(ALOAD, 1);
methodVisitor.visitInsn(ICONST_0);
methodVisitor.visitIntInsn(BIPUSH, 10);
methodVisitor.visitInsn(IASTORE);
methodVisitor.visitVarInsn(ALOAD, 1);
methodVisitor.visitInsn(ICONST_0);
methodVisitor.visitInsn(IALOAD);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(3, 3);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_5                 // {this} | {int}
0001: newarray        int      // {this} | {[I}
0003: astore_1                 // {this, [I} | {}
0004: aload_1                  // {this, [I} | {[I}
0005: iconst_0                 // {this, [I} | {[I, int}
0006: bipush          10       // {this, [I} | {[I, int, int}
0008: iastore                  // {this, [I} | {}
0009: aload_1                  // {this, [I} | {[I}
0010: iconst_0                 // {this, [I} | {[I, int}
0011: iaload                   // {this, [I} | {int}
0012: istore_2                 // {this, [I, int} | {}
0013: return                   // {} | {}
```

从 JVM 规范的角度来看，`iastore` 指令对应的 Operand Stack 的变化如下：

```text
..., arrayref, index, value →

...
```

The `arrayref` must be of type `reference` and must refer to an array whose components are of type `int`.
Both `index` and `value` must be of type `int`.
The `arrayref`, `index`, and `value` are popped from the operand stack.
The `int` value is stored as the component of the array indexed by `index`.

从 JVM 规范的角度来看，`iaload` 指令对应的 Operand Stack 的变化如下：

```text
..., arrayref, index →

..., value
```

The `arrayref` must be of type `reference` and must refer to an array whose components are of type `int`.
The `index` must be of type `int`.
Both `arrayref` and `index` are popped from the operand stack.
The `int` value in the component of the array at `index` is retrieved and pushed onto the operand stack.

### Object Array

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        Object[] objArray = new Object[2];
        objArray[0] = null;
        Object obj = objArray[0];
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: iconst_2
       1: anewarray     #2                  // class java/lang/Object
       4: astore_1
       5: aload_1
       6: iconst_0
       7: aconst_null
       8: aastore
       9: aload_1
      10: iconst_0
      11: aaload
      12: astore_2
      13: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_2);
methodVisitor.visitTypeInsn(ANEWARRAY, "java/lang/Object");
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitVarInsn(ALOAD, 1);
methodVisitor.visitInsn(ICONST_0);
methodVisitor.visitInsn(ACONST_NULL);
methodVisitor.visitInsn(AASTORE);
methodVisitor.visitVarInsn(ALOAD, 1);
methodVisitor.visitInsn(ICONST_0);
methodVisitor.visitInsn(AALOAD);
methodVisitor.visitVarInsn(ASTORE, 2);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(3, 3);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_2                 // {this} | {int}
0001: anewarray       #2       // {this} | {[Object}
0004: astore_1                 // {this, [Object} | {}
0005: aload_1                  // {this, [Object} | {[Object}
0006: iconst_0                 // {this, [Object} | {[Object, int}
0007: aconst_null              // {this, [Object} | {[Object, int, null}
0008: aastore                  // {this, [Object} | {}
0009: aload_1                  // {this, [Object} | {[Object}
0010: iconst_0                 // {this, [Object} | {[Object, int}
0011: aaload                   // {this, [Object} | {Object}
0012: astore_2                 // {this, [Object, Object} | {}
0013: return                   // {} | {}
```

从 JVM 规范的角度来看，`aastore` 指令对应的 Operand Stack 的变化如下：

```text
..., arrayref, index, value →

...
```

The `arrayref` must be of type `reference` and must refer to an array whose components are of type `reference`.
The `index` must be of type `int` and `value` must be of type `reference`.
The `arrayref`, `index`, and `value` are popped from the operand stack.
The reference `value` is stored as the component of the array at `index`.

从 JVM 规范的角度来看，`aaload` 指令对应的 Operand Stack 的变化如下：

```text
..., arrayref, index →

..., value
```

The `arrayref` must be of type `reference` and must refer to an array whose components are of type `reference`.
The `index` must be of type `int`.
Both `arrayref` and `index` are popped from the operand stack.
The reference `value` in the component of the array at `index` is retrieved and pushed onto the operand stack.

### multi-dimensions array

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int[][][] array = new int[4][5][6];
        array[1][2][3] = 10;
        int val = array[1][2][3];
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: iconst_4
       1: iconst_5
       2: bipush        6
       4: multianewarray #2,  3             // class "[[[I"
       8: astore_1
       9: aload_1
      10: iconst_1
      11: aaload
      12: iconst_2
      13: aaload
      14: iconst_3
      15: bipush        10
      17: iastore
      18: aload_1
      19: iconst_1
      20: aaload
      21: iconst_2
      22: aaload
      23: iconst_3
      24: iaload
      25: istore_2
      26: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_4);
methodVisitor.visitInsn(ICONST_5);
methodVisitor.visitIntInsn(BIPUSH, 6);
methodVisitor.visitMultiANewArrayInsn("[[[I", 3);
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitVarInsn(ALOAD, 1);
methodVisitor.visitInsn(ICONST_1);
methodVisitor.visitInsn(AALOAD);
methodVisitor.visitInsn(ICONST_2);
methodVisitor.visitInsn(AALOAD);
methodVisitor.visitInsn(ICONST_3);
methodVisitor.visitIntInsn(BIPUSH, 10);
methodVisitor.visitInsn(IASTORE);
methodVisitor.visitVarInsn(ALOAD, 1);
methodVisitor.visitInsn(ICONST_1);
methodVisitor.visitInsn(AALOAD);
methodVisitor.visitInsn(ICONST_2);
methodVisitor.visitInsn(AALOAD);
methodVisitor.visitInsn(ICONST_3);
methodVisitor.visitInsn(IALOAD);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(3, 3);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_4                 // {this} | {int}
0001: iconst_5                 // {this} | {int, int}
0002: bipush          6        // {this} | {int, int, int}
0004: multianewarray  #2  3    // {this} | {[[[I}
0008: astore_1                 // {this, [[[I} | {}
0009: aload_1                  // {this, [[[I} | {[[[I}
0010: iconst_1                 // {this, [[[I} | {[[[I, int}
0011: aaload                   // {this, [[[I} | {[[I}
0012: iconst_2                 // {this, [[[I} | {[[I, int}
0013: aaload                   // {this, [[[I} | {[I}
0014: iconst_3                 // {this, [[[I} | {[I, int}
0015: bipush          10       // {this, [[[I} | {[I, int, int}
0017: iastore                  // {this, [[[I} | {}
0018: aload_1                  // {this, [[[I} | {[[[I}
0019: iconst_1                 // {this, [[[I} | {[[[I, int}
0020: aaload                   // {this, [[[I} | {[[I}
0021: iconst_2                 // {this, [[[I} | {[[I, int}
0022: aaload                   // {this, [[[I} | {[I}
0023: iconst_3                 // {this, [[[I} | {[I, int}
0024: iaload                   // {this, [[[I} | {int}
0025: istore_2                 // {this, [[[I, int} | {}
0026: return                   // {} | {}
```

## array length

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int[] intArray = new int[5];
        int length = intArray.length;
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: iconst_5
       1: newarray       int
       3: astore_1
       4: aload_1
       5: arraylength
       6: istore_2
       7: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_5);
methodVisitor.visitIntInsn(NEWARRAY, T_INT);
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitVarInsn(ALOAD, 1);
methodVisitor.visitInsn(ARRAYLENGTH);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 3);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_5                 // {this} | {int}
0001: newarray        int      // {this} | {[I}
0003: astore_1                 // {this, [I} | {}
0004: aload_1                  // {this, [I} | {[I}
0005: arraylength              // {this, [I} | {int}
0006: istore_2                 // {this, [I, int} | {}
0007: return                   // {} | {}
```

从 JVM 规范的角度来看，`arraylength` 指令对应的 Operand Stack 的变化如下：

```text
..., arrayref →

..., length
```

The `arrayref` must be of type reference and must refer to an array.
It is popped from the operand stack.
The `length` of the array it references is determined.
That `length` is pushed onto the operand stack as an `int`.

## boolean

在[Chapter 2. The Structure of the Java Virtual Machine](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html)当中，有如下几段描述：

- Like the Java programming language, the Java Virtual Machine operates on two kinds of types: **primitive types** and **reference types**.
- The **primitive data types** supported by the Java Virtual Machine are **the numeric types**, **the boolean type**, and **the returnAddress type**.
- There are three kinds of **reference types**: **class types**, **array types**, and **interface types**.

经过整理，我们可以将 JVM 当中的类型表示成如下形式：

- JVM Types
  - primitive types
    - numeric types
      - integral types: `byte`, `short`, `int`, `long`, `char`
      - floating-point types: `float`, `double`
    - `boolean` type
    - `returnAddress` type
  - reference types
    - class types
    - array types
    - interface types

在这里，我们关注 `boolean`、`byte`、`short`、`char`、`int` 这几个 primitive types；
它们在 local variable 和 operand stack 当中都是作为 `int` 类型来进行处理。

下表的内容是来自于[Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)的[Table 2.11.1-B. Actual and Computational types in the Java Virtual Machine](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.11.1-320)部分。

| Actual type | Computational type | Category |
|-------------|--------------------|----------|
| boolean     | int                | 1        |
| byte        | int                | 1        |
| char        | int                | 1        |
| short       | int                | 1        |
| int         | int                | 1        |
| float       | float              | 1        |
| reference   | reference          | 1        |
| long        | long               | 2        |
| double      | double             | 2        |

为什么我们要关注 `boolean`、`byte`、`short`、`char`、`int` 这几个 primitive types 呢？
因为我们想把 `boolean` 单独拿出来，与 `byte`、`short`、`char`、`int` 进行一下对比：

- 第一次对比，作为 primitive types 进行对比：`boolean`、`byte`、`short`、`char`、`int`。（处理相同）
- 第二次对比，作为 array types(reference types)进行对比：`boolean[]`、`byte[]`、`short[]`、`char[]`、`int[]`。（处理出现差异）

### boolean type

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        boolean flag_false = false;
        boolean flag_true = true;
    }
}
```

或者代码如下（`byte` 类型可以替换成 `short`、`char`、`int` 类型）：

```java
public class HelloWorld {
    public void test() {
        byte val0 = 0;
        byte val1 = 1;
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: iconst_0
       1: istore_1
       2: iconst_1
       3: istore_2
       4: return
}
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_0                 // {this} | {int}
0001: istore_1                 // {this, int} | {}
0002: iconst_1                 // {this, int} | {int}
0003: istore_2                 // {this, int, int} | {}
0004: return                   // {} | {}
```

### boolean array

我们先来看一个 `int[]` 类型的示例。从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int[] array = new int[5];
        array[0] = 1;
        int val = array[1];
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: iconst_5
       1: newarray       int
       3: astore_1
       4: aload_1
       5: iconst_0
       6: iconst_1
       7: iastore
       8: aload_1
       9: iconst_1
      10: iaload
      11: istore_2
      12: return
}
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_5                 // {this} | {int}
0001: newarray        int      // {this} | {[I}
0003: astore_1                 // {this, [I} | {}
0004: aload_1                  // {this, [I} | {[I}
0005: iconst_0                 // {this, [I} | {[I, int}
0006: iconst_1                 // {this, [I} | {[I, int, int}
0007: iastore                  // {this, [I} | {}
0008: aload_1                  // {this, [I} | {[I}
0009: iconst_1                 // {this, [I} | {[I, int}
0010: iaload                   // {this, [I} | {int}
0011: istore_2                 // {this, [I, int} | {}
0012: return                   // {} | {}
```

|            | `int[]`   | `char[]`  | `short[]` | `byte[]`  | `boolean[]` |
|------------|-----------|-----------|-----------|-----------|-------------|
| load data  | `iaload`  | `caload`  | `saload`  | `baload`  | `baload`    |
| store data | `iastore` | `castore` | `sastore` | `bastore` | `bastore`   |

接下来，我们来验证一下 `boolean[]`。从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        boolean[] boolArray = new boolean[5];
        boolArray[0] = true;
        boolean flag = boolArray[1];
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: iconst_5
       1: newarray       boolean
       3: astore_1
       4: aload_1
       5: iconst_0
       6: iconst_1
       7: bastore
       8: aload_1
       9: iconst_1
      10: baload
      11: istore_2
      12: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_5);
methodVisitor.visitIntInsn(NEWARRAY, T_BOOLEAN);
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitVarInsn(ALOAD, 1);
methodVisitor.visitInsn(ICONST_0);
methodVisitor.visitInsn(ICONST_1);
methodVisitor.visitInsn(BASTORE);
methodVisitor.visitVarInsn(ALOAD, 1);
methodVisitor.visitInsn(ICONST_1);
methodVisitor.visitInsn(BALOAD);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(3, 3);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_5                 // {this} | {int}
0001: newarray        boolean  // {this} | {[Z}
0003: astore_1                 // {this, [Z} | {}
0004: aload_1                  // {this, [Z} | {[Z}
0005: iconst_0                 // {this, [Z} | {[Z, int}
0006: iconst_1                 // {this, [Z} | {[Z, int, int}
0007: bastore                  // {this, [Z} | {}
0008: aload_1                  // {this, [Z} | {[Z}
0009: iconst_1                 // {this, [Z} | {[Z, int}
0010: baload                   // {this, [Z} | {int}
0011: istore_2                 // {this, [Z, int} | {}
0012: return                   // {} | {}
```

从 JVM 规范的角度来看，`bastore` 指令对应的 Operand Stack 的变化如下：

```text
..., arrayref, index, value →

...
```

The `arrayref` must be of type `reference` and must refer to an array
whose components are of type `byte` or of type `boolean`.
The `index` and the `value` must both be of type `int`.
The `arrayref`, `index`, and `value` are popped from the operand stack.
The int `value` is truncated to a `byte` and stored as the component of the array indexed by `index`.

从 JVM 规范的角度来看，`baload` 指令对应的 Operand Stack 的变化如下：

```text
..., arrayref, index →

..., value
```

The `arrayref` must be of type `reference` and must refer to an array
whose components are of type `byte` or of type `boolean`.
The `index` must be of type `int`.
Both `arrayref` and `index` are popped from the operand stack.
The byte `value` in the component of the array at `index` is retrieved, sign-extended to an `int` value,
and pushed onto the top of the operand stack.

---

在[Chapter 2. The Structure of the Java Virtual Machine](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html)的[2.3.4. The boolean Type](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.3.4)对 `boolean` 类型进行了如下描述：

Although the Java Virtual Machine defines a `boolean` type, it only provides very limited support for it.
- **There are no Java Virtual Machine instructions solely dedicated to operations on `boolean` values**.（没有相应的 opcode）
- Instead, expressions in the Java programming language that operate on `boolean` values are compiled to use values of the Java Virtual Machine `int` data type.

The Java Virtual Machine does directly support **boolean arrays**.
- Its `newarray` instruction enables creation of boolean arrays.（创建数组）
- Arrays of type boolean are accessed and modified using the byte array instructions `baload` and `bastore`.（存取数据）

In Oracle's Java Virtual Machine implementation,
**boolean arrays** in the Java programming language are encoded as Java Virtual Machine **byte arrays**,
using 8 bits per boolean element.

---
