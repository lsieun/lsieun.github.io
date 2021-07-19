---
title:  "opcode: array (20/160/205)"
sequence: "208"
---

## 概览

从Instruction的角度来说，与array相关的opcode有20个，内容如下：

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

从ASM的角度来说，这些opcode与`MethodVisitor.visitXxxInsn()`方法对应关系如下：

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

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test() {
        byte[] byteArray = new byte[5];
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

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

从ASM的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_5);
methodVisitor.visitIntInsn(NEWARRAY, T_BYTE);
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 2);
methodVisitor.visitEnd();
```

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld] []
[sample/HelloWorld] [int]
[sample/HelloWorld] [[B]
[sample/HelloWorld, [B] []
[] []
```

从JVM规范的角度来看，`newarray`指令对应的Operand Stack的变化如下：

```text
..., count →

..., arrayref
```

The `count` must be of type `int`. It is popped off the operand stack. The `count` represents the number of elements in the array to be created.

另外，`newarray`指令对应的Format如下：

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

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test() {
        Object[] objArray = new Object[5];
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

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

从ASM的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_5);
methodVisitor.visitTypeInsn(ANEWARRAY, "java/lang/Object");
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 2);
methodVisitor.visitEnd();
```

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld] []
[sample/HelloWorld] [int]
[sample/HelloWorld] [[Ljava/lang/Object;]
[sample/HelloWorld, [Ljava/lang/Object;] []
[] []
```

从JVM规范的角度来看，`anewarray`指令对应的Operand Stack的变化如下：

```text
..., count →

..., arrayref
```

- The `count` must be of type `int`. It is popped off the operand stack. The `count` represents the number of components of the array to be created.
- A new array with components of that type, of length `count`, is allocated from the garbage-collected heap, and a reference `arrayref` to this new array object is pushed onto the operand stack.
- All components of the new array are initialized to `null`, the default value for reference types.

### multianewarray

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test() {
        Object[][] array = new Object[3][4];
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

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

从ASM的视角来看，方法体对应的内容如下：

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

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld] []
[sample/HelloWorld] [int]
[sample/HelloWorld] [int, int]
[sample/HelloWorld] [[[Ljava/lang/Object;]
[sample/HelloWorld, [[Ljava/lang/Object;] []
[] []
```

从JVM规范的角度来看，`multianewarray`指令对应的Operand Stack的变化如下：

```text
..., count1, [count2, ...] →

..., arrayref
```

- All of the count values are popped off the operand stack.
- A new multidimensional array of the array type is allocated from the garbage-collected heap. A reference `arrayref` to the new array is pushed onto the operand stack.

另外，`multianewarray`指令对应的Format如下：

```text
multianewarray
indexbyte1
indexbyte2
dimensions
```

The `dimensions` operand is an unsigned byte that must be greater than or equal to 1. It represents the number of dimensions of the array to be created. The operand stack must contain `dimensions` values. Each such value represents the number of components in a dimension of the array to be created, must be of type `int`, and must be non-negative. The `count1` is the desired length in the first dimension, `count2` in the second, etc.

## array element

### int array

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int[] intArray = new int[5];
        intArray[0] = 10;
        int i = intArray[0];
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

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

从ASM的视角来看，方法体对应的内容如下：

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

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld] []
[sample/HelloWorld] [int]
[sample/HelloWorld] [[I]
[sample/HelloWorld, [I] []
[sample/HelloWorld, [I] [[I]
[sample/HelloWorld, [I] [[I, int]
[sample/HelloWorld, [I] [[I, int, int]
[sample/HelloWorld, [I] []
[sample/HelloWorld, [I] [[I]
[sample/HelloWorld, [I] [[I, int]
[sample/HelloWorld, [I] [int]
[sample/HelloWorld, [I, int] []
[] []
```

从JVM规范的角度来看，`iastore`指令对应的Operand Stack的变化如下：

```text
..., arrayref, index, value →

...
```

The `arrayref` must be of type `reference` and must refer to an array whose components are of type `int`. Both `index` and `value` must be of type `int`. The `arrayref`, `index`, and `value` are popped from the operand stack. The `int` value is stored as the component of the array indexed by `index`.

从JVM规范的角度来看，`iaload`指令对应的Operand Stack的变化如下：

```text
..., arrayref, index →

..., value
```

The `arrayref` must be of type `reference` and must refer to an array whose components are of type `int`. The `index` must be of type `int`. Both `arrayref` and `index` are popped from the operand stack. The `int` value in the component of the array at `index` is retrieved and pushed onto the operand stack.

### Object Array

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test() {
        Object[] objArray = new Object[2];
        objArray[0] = null;
        Object obj = objArray[0];
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

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

从ASM的视角来看，方法体对应的内容如下：

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

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld] []
[sample/HelloWorld] [int]
[sample/HelloWorld] [[Ljava/lang/Object;]
[sample/HelloWorld, [Ljava/lang/Object;] []
[sample/HelloWorld, [Ljava/lang/Object;] [[Ljava/lang/Object;]
[sample/HelloWorld, [Ljava/lang/Object;] [[Ljava/lang/Object;, int]
[sample/HelloWorld, [Ljava/lang/Object;] [[Ljava/lang/Object;, int, null]
[sample/HelloWorld, [Ljava/lang/Object;] []
[sample/HelloWorld, [Ljava/lang/Object;] [[Ljava/lang/Object;]
[sample/HelloWorld, [Ljava/lang/Object;] [[Ljava/lang/Object;, int]
[sample/HelloWorld, [Ljava/lang/Object;] [java/lang/Object]
[sample/HelloWorld, [Ljava/lang/Object;, java/lang/Object] []
[] []
```

从JVM规范的角度来看，`aastore`指令对应的Operand Stack的变化如下：

```text
..., arrayref, index, value →

...
```

The `arrayref` must be of type `reference` and must refer to an array whose components are of type `reference`. The `index` must be of type `int` and `value` must be of type `reference`. The `arrayref`, `index`, and `value` are popped from the operand stack. The reference `value` is stored as the component of the array at `index`.

从JVM规范的角度来看，`aaload`指令对应的Operand Stack的变化如下：

```text
..., arrayref, index →

..., value
```

The `arrayref` must be of type `reference` and must refer to an array whose components are of type `reference`. The `index` must be of type `int`. Both `arrayref` and `index` are popped from the operand stack. The reference `value` in the component of the array at `index` is retrieved and pushed onto the operand stack.

### boolean array

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test() {
        boolean[] boolArray = new boolean[5];
        boolArray[0] = true;
        boolean flag = boolArray[1];
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

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

从ASM的视角来看，方法体对应的内容如下：

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

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld] []
[sample/HelloWorld] [int]
[sample/HelloWorld] [[Z]
[sample/HelloWorld, [Z] []
[sample/HelloWorld, [Z] [[Z]
[sample/HelloWorld, [Z] [[Z, int]
[sample/HelloWorld, [Z] [[Z, int, int]
[sample/HelloWorld, [Z] []
[sample/HelloWorld, [Z] [[Z]
[sample/HelloWorld, [Z] [[Z, int]
[sample/HelloWorld, [Z] [int]
[sample/HelloWorld, [Z, int] []
[] []
```

从JVM规范的角度来看，`bastore`指令对应的Operand Stack的变化如下：

```text
..., arrayref, index, value →

...
```

The `arrayref` must be of type `reference` and must refer to an array whose components are of type `byte` or of type `boolean`. The `index` and the `value` must both be of type `int`. The `arrayref`, `index`, and `value` are popped from the operand stack. The int `value` is truncated to a `byte` and stored as the component of the array indexed by `index`.

从JVM规范的角度来看，`baload`指令对应的Operand Stack的变化如下：

```text
..., arrayref, index →

..., value
```

The `arrayref` must be of type `reference` and must refer to an array whose components are of type `byte` or of type `boolean`. The `index` must be of type `int`. Both `arrayref` and `index` are popped from the operand stack. The byte `value` in the component of the array at `index` is retrieved, sign-extended to an `int` value, and pushed onto the top of the operand stack.

### multi-dimensions array

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int[][][] array = new int[4][5][6];
        array[1][2][3] = 10;
        int val = array[1][2][3];
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

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

从ASM的视角来看，方法体对应的内容如下：

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

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld] []
[sample/HelloWorld] [int]
[sample/HelloWorld] [int, int]
[sample/HelloWorld] [int, int, int]
[sample/HelloWorld] [[[[I]
[sample/HelloWorld, [[[I] []
[sample/HelloWorld, [[[I] [[[[I]
[sample/HelloWorld, [[[I] [[[[I, int]
[sample/HelloWorld, [[[I] [[[I]
[sample/HelloWorld, [[[I] [[[I, int]
[sample/HelloWorld, [[[I] [[I]
[sample/HelloWorld, [[[I] [[I, int]
[sample/HelloWorld, [[[I] [[I, int, int]
[sample/HelloWorld, [[[I] []
[sample/HelloWorld, [[[I] [[[[I]
[sample/HelloWorld, [[[I] [[[[I, int]
[sample/HelloWorld, [[[I] [[[I]
[sample/HelloWorld, [[[I] [[[I, int]
[sample/HelloWorld, [[[I] [[I]
[sample/HelloWorld, [[[I] [[I, int]
[sample/HelloWorld, [[[I] [int]
[sample/HelloWorld, [[[I, int] []
[] []
```

## array length

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int[] intArray = new int[5];
        int length = intArray.length;
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

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

从ASM的视角来看，方法体对应的内容如下：

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

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld] []
[sample/HelloWorld] [int]
[sample/HelloWorld] [[I]
[sample/HelloWorld, [I] []
[sample/HelloWorld, [I] [[I]
[sample/HelloWorld, [I] [int]
[sample/HelloWorld, [I, int] []
[] []
```

从JVM规范的角度来看，`arraylength`指令对应的Operand Stack的变化如下：

```text
..., arrayref →

..., length
```

The `arrayref` must be of type reference and must refer to an array. It is popped from the operand stack. The `length` of the array it references is determined. That `length` is pushed onto the operand stack as an `int`.
