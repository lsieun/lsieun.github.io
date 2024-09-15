---
title: "opcode: transfer values (50/76/205)"
sequence: "203"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## 概览

从 Instruction 的角度来说，与 transfer values 相关的 opcode 有 50 个。

其中，与 load 相关的 opcode 有 25 个，内容如下：

| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|--------|-----------------|
| 21     | iload           | 28     | iload_2         | 35     | fload_1         | 42     | aload_0         |
| 22     | lload           | 29     | iload_3         | 36     | fload_2         | 43     | aload_1         |
| 23     | fload           | 30     | lload_0         | 37     | fload_3         | 44     | aload_2         |
| 24     | dload           | 31     | lload_1         | 38     | dload_0         | 45     | aload_3         |
| 25     | aload           | 32     | lload_2         | 39     | dload_1         | 46     |                 |
| 26     | iload_0         | 33     | lload_3         | 40     | dload_2         | 47     |                 |
| 27     | iload_1         | 34     | fload_0         | 41     | dload_3         | 48     |                 |

其中，与 store 相关的 opcode 有 25 个，内容如下：

| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|--------|-----------------|
| 54     | istore          | 61     | istore_2        | 68     | fstore_1        | 75     | astore_0        |
| 55     | lstore          | 62     | istore_3        | 69     | fstore_2        | 76     | astore_1        |
| 56     | fstore          | 63     | lstore_0        | 70     | fstore_3        | 77     | astore_2        |
| 57     | dstore          | 64     | lstore_1        | 71     | dstore_0        | 78     | astore_3        |
| 58     | astore          | 65     | lstore_2        | 72     | dstore_1        | 79     |                 |
| 59     | istore_0        | 66     | lstore_3        | 73     | dstore_2        | 80     |                 |
| 60     | istore_1        | 67     | fstore_0        | 74     | dstore_3        | 81     |                 |

从 ASM 的角度来说，这些 opcode 与 `MethodVisitor.visitXxxInsn()` 方法对应关系如下：

- `MethodVisitor.visitVarInsn()`: 
    - `iload`, `istore`, `iload_<n>`, `istore_<n>`.
    - `lload`, `lstore`, `lload_<n>`, `lstore_<n>`.
    - `fload`, `fstore`, `fload_<n>`, `fstore_<n>`.
    - `dload`, `dstore`, `dload_<n>`, `dstore_<n>`.
    - `aload`, `astore`, `aload_<n>`, `astore_<n>`.

注意: Constant Pool、operand stack 和 local variables，对于 `long` 和 `double` 类型的数据，都占用 2 个位置。

## primitive type

### int

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int a = 1;
        int b = a;
        int c = b;
        int d = c;
        int e = d;
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
       0: iconst_1
       1: istore_1
       2: iload_1
       3: istore_2
       4: iload_2
       5: istore_3
       6: iload_3
       7: istore        4
       9: iload         4
      11: istore        5
      13: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_1);
methodVisitor.visitVarInsn(ISTORE, 1);
methodVisitor.visitVarInsn(ILOAD, 1);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitVarInsn(ILOAD, 2);
methodVisitor.visitVarInsn(ISTORE, 3);
methodVisitor.visitVarInsn(ILOAD, 3);
methodVisitor.visitVarInsn(ISTORE, 4);
methodVisitor.visitVarInsn(ILOAD, 4);
methodVisitor.visitVarInsn(ISTORE, 5);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 6);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_1                 // {this} | {int}
0001: istore_1                 // {this, int} | {}
0002: iload_1                  // {this, int} | {int}
0003: istore_2                 // {this, int, int} | {}
0004: iload_2                  // {this, int, int} | {int}
0005: istore_3                 // {this, int, int, int} | {}
0006: iload_3                  // {this, int, int, int} | {int}
0007: istore          4        // {this, int, int, int, int} | {}
0009: iload           4        // {this, int, int, int, int} | {int}
0011: istore          5        // {this, int, int, int, int, int} | {}
0013: return                   // {} | {}
```

从 JVM 规范的角度来看，`iload` 指令对应的 Operand Stack 的变化如下：

```text
... →

..., value
```

Format:

```text
iload
index
```

- The `index` is an unsigned byte that must be an index into the local variable array of the current frame.
- The local variable at `index` must contain an `int`.
- The `value` of the local variable at `index` is pushed onto the operand stack.

从 JVM 规范的角度来看，`istore` 指令对应的 Operand Stack 的变化如下：

```text
..., value →

...
```

Format:

```text
istore
index
```

- The `index` is an unsigned byte that must be an index into the local variable array of the current frame.
- The `value` on the top of the operand stack must be of type `int`.
- It is popped from the operand stack, and the value of the local variable at `index` is set to `value`.

### float

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        float a = 1;
        float b = a;
        float c = b;
        float d = c;
        float e = d;
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
       0: fconst_1
       1: fstore_1
       2: fload_1
       3: fstore_2
       4: fload_2
       5: fstore_3
       6: fload_3
       7: fstore        4
       9: fload         4
      11: fstore        5
      13: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitInsn(FCONST_1);
methodVisitor.visitVarInsn(FSTORE, 1);
methodVisitor.visitVarInsn(FLOAD, 1);
methodVisitor.visitVarInsn(FSTORE, 2);
methodVisitor.visitVarInsn(FLOAD, 2);
methodVisitor.visitVarInsn(FSTORE, 3);
methodVisitor.visitVarInsn(FLOAD, 3);
methodVisitor.visitVarInsn(FSTORE, 4);
methodVisitor.visitVarInsn(FLOAD, 4);
methodVisitor.visitVarInsn(FSTORE, 5);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 6);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: fconst_1                 // {this} | {float}
0001: fstore_1                 // {this, float} | {}
0002: fload_1                  // {this, float} | {float}
0003: fstore_2                 // {this, float, float} | {}
0004: fload_2                  // {this, float, float} | {float}
0005: fstore_3                 // {this, float, float, float} | {}
0006: fload_3                  // {this, float, float, float} | {float}
0007: fstore          4        // {this, float, float, float, float} | {}
0009: fload           4        // {this, float, float, float, float} | {float}
0011: fstore          5        // {this, float, float, float, float, float} | {}
0013: return                   // {} | {}
```

从 JVM 规范的角度来看，`fload` 指令对应的 Operand Stack 的变化如下：

```text
... →

..., value
```

Format:

```text
fload
index
```

- The `index` is an unsigned byte that must be an index into the local variable array of the current frame.
- The local variable at `index` must contain a `float`.
- The `value` of the local variable at `index` is pushed onto the operand stack.

从 JVM 规范的角度来看，`fstore` 指令对应的 Operand Stack 的变化如下：

```text
..., value →

...
```

Format:

```text
fstore
index
```

- The `index` is an unsigned byte that must be an index into the local variable array of the current frame.
- The `value` on the top of the operand stack must be of type `float`.
- It is popped from the operand stack and undergoes value set conversion, resulting in `value'`. The value of the local variable at `index` is set to `value'`.

### long

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        long a = 1;
        long b = a;
        long c = b;
        long d = c;
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
       0: lconst_1
       1: lstore_1
       2: lload_1
       3: lstore_3
       4: lload_3
       5: lstore        5
       7: lload         5
       9: lstore        7
      11: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(LCONST_1);
methodVisitor.visitVarInsn(LSTORE, 1);
methodVisitor.visitVarInsn(LLOAD, 1);
methodVisitor.visitVarInsn(LSTORE, 3);
methodVisitor.visitVarInsn(LLOAD, 3);
methodVisitor.visitVarInsn(LSTORE, 5);
methodVisitor.visitVarInsn(LLOAD, 5);
methodVisitor.visitVarInsn(LSTORE, 7);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 9);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: lconst_1                 // {this} | {long, top}
0001: lstore_1                 // {this, long, top} | {}
0002: lload_1                  // {this, long, top} | {long, top}
0003: lstore_3                 // {this, long, top, long, top} | {}
0004: lload_3                  // {this, long, top, long, top} | {long, top}
0005: lstore          5        // {this, long, top, long, top, long, top} | {}
0007: lload           5        // {this, long, top, long, top, long, top} | {long, top}
0009: lstore          7        // {this, long, top, long, top, long, top, long, top} | {}
0011: return                   // {} | {}
```

从 JVM 规范的角度来看，`lload` 指令对应的 Operand Stack 的变化如下：

```text
... →

..., value
```

Format:

```text
lload
index
```

- The `index` is an unsigned byte. Both `index` and `index+1` must be indices into the local variable array of the current frame.
- The local variable at `index` must contain a `long`.
- The `value` of the local variable at `index` is pushed onto the operand stack.

从 JVM 规范的角度来看，`lstore` 指令对应的 Operand Stack 的变化如下：

```text
..., value →

...
```

Format:

```text
lstore
index
```

- The `index` is an unsigned byte. Both `index` and `index+1` must be indices into the local variable array of the current frame.
- The `value` on the top of the operand stack must be of type `long`.
- It is popped from the operand stack, and the local variables at `index` and `index+1` are set to `value`.

### double

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        double a = 1;
        double b = a;
        double c = b;
        double d = c;
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
...
  public void test();
    Code:
       0: dconst_1
       1: dstore_1
       2: dload_1
       3: dstore_3
       4: dload_3
       5: dstore        5
       7: dload         5
       9: dstore        7
      11: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(DCONST_1);
methodVisitor.visitVarInsn(DSTORE, 1);
methodVisitor.visitVarInsn(DLOAD, 1);
methodVisitor.visitVarInsn(DSTORE, 3);
methodVisitor.visitVarInsn(DLOAD, 3);
methodVisitor.visitVarInsn(DSTORE, 5);
methodVisitor.visitVarInsn(DLOAD, 5);
methodVisitor.visitVarInsn(DSTORE, 7);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 9);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: dconst_1                 // {this} | {double, top}
0001: dstore_1                 // {this, double, top} | {}
0002: dload_1                  // {this, double, top} | {double, top}
0003: dstore_3                 // {this, double, top, double, top} | {}
0004: dload_3                  // {this, double, top, double, top} | {double, top}
0005: dstore          5        // {this, double, top, double, top, double, top} | {}
0007: dload           5        // {this, double, top, double, top, double, top} | {double, top}
0009: dstore          7        // {this, double, top, double, top, double, top, double, top} | {}
0011: return                   // {} | {}
```

从 JVM 规范的角度来看，`dload` 指令对应的 Operand Stack 的变化如下：

```text
... →

..., value
```

Format:

```text
dload
index
```

- The `index` is an unsigned byte. Both `index` and `index+1` must be indices into the local variable array of the current frame.
- The local variable at `index` must contain a `double`.
- The `value` of the local variable at `index` is pushed onto the operand stack.

从 JVM 规范的角度来看，`dstore` 指令对应的 Operand Stack 的变化如下：

```text
..., value →

...
```

Format:

```text
dstore
index
```

- The `index` is an unsigned byte. Both `index` and `index+1` must be indices into the local variable array of the current frame.
- The `value` on the top of the operand stack must be of type `double`.
- It is popped from the operand stack and undergoes value set conversion, resulting in `value'`. The local variables at `index` and `index+1` are set to `value'`.

## reference type

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        Object a = null;
        Object b = a;
        Object c = b;
        Object d = c;
        Object e = d;
    }
}
```

在上面的代码中，我们也可以将 `null` 替换成 `String` 或 `Object` 类型的对象。

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: aconst_null
       1: astore_1
       2: aload_1
       3: astore_2
       4: aload_2
       5: astore_3
       6: aload_3
       7: astore        4
       9: aload         4
      11: astore        5
      13: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ACONST_NULL);
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitVarInsn(ALOAD, 1);
methodVisitor.visitVarInsn(ASTORE, 2);
methodVisitor.visitVarInsn(ALOAD, 2);
methodVisitor.visitVarInsn(ASTORE, 3);
methodVisitor.visitVarInsn(ALOAD, 3);
methodVisitor.visitVarInsn(ASTORE, 4);
methodVisitor.visitVarInsn(ALOAD, 4);
methodVisitor.visitVarInsn(ASTORE, 5);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 6);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: aconst_null              // {this} | {null}
0001: astore_1                 // {this, null} | {}
0002: aload_1                  // {this, null} | {null}
0003: astore_2                 // {this, null, null} | {}
0004: aload_2                  // {this, null, null} | {null}
0005: astore_3                 // {this, null, null, null} | {}
0006: aload_3                  // {this, null, null, null} | {null}
0007: astore          4        // {this, null, null, null, null} | {}
0009: aload           4        // {this, null, null, null, null} | {null}
0011: astore          5        // {this, null, null, null, null, null} | {}
0013: return                   // {} | {}
```

从 JVM 规范的角度来看，`aload` 指令对应的 Operand Stack 的变化如下：

```text
... →

..., objectref
```

Format:

```text
aload
index
```

- The `index` is an unsigned byte that must be an index into the local variable array of the current frame.
- The local variable at `index` must contain a reference.
- The `objectref` in the local variable at `index` is pushed onto the operand stack.

从 JVM 规范的角度来看，`astore` 指令对应的 Operand Stack 的变化如下：

```text
..., objectref →

...
```

Format:

```text
astore
index
```

- The `index` is an unsigned byte that must be an index into the local variable array of the current frame.
- The `objectref` on the top of the operand stack must be of type `returnAddress` or of type `reference`.
- It is popped from the operand stack, and the `value` of the local variable at `index` is set to `objectref`.
