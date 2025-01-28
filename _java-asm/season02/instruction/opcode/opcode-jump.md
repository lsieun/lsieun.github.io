---
title: "opcode: jump (25/185/205)"
sequence: "209"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## 概览

从 Instruction 的角度来说，与 jump 相关的 opcode 有 25 个，内容如下：

| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|--------|-----------------|
| 148    | lcmp            | 153    | ifeq            | 158    | ifle            | 163    | if_icmpgt       |
| 149    | fcmpl           | 154    | ifne            | 159    | if_icmpeq       | 164    | if_icmple       |
| 150    | fcmpg           | 155    | iflt            | 160    | if_icmpne       | 165    | if_acmpeq       |
| 151    | dcmpl           | 156    | ifge            | 161    | if_icmplt       | 166    | if_acmpne       |
| 152    | dcmpg           | 157    | ifgt            | 162    | if_icmpge       | 167    | goto            |

| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|--------|-----------------|
| 170    | tableswitch     | 171    | lookupswitch    |        |                 |        |                 |

| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|--------|-----------------|
| 198    | ifnull          | 199    | ifnonnull       | 200    | goto_w          |        |                 |

从 ASM 的角度来说，这些 opcode 与 `MethodVisitor.visitXxxInsn()` 方法对应关系如下：

- `MethodVisitor.visitInsn()`: `lcmp`, `fcmpl`, `fcmpg`, `dcmpl`, `dcmpg`
- `MethodVisitor.visitJumpInsn()`:
    - `ifeq`, `ifne`, `iflt`, `ifge`, `ifgt`, `ifle`
    - `if_icmpeq`, `if_icmpne`, `if_icmplt`, `if_icmpge`, `if_icmpgt`, `if_icmple`, `if_acmpeq`, `if_acmpne`
    - `ifnull`, `ifnonnull`
    - `goto`, `goto_w`
- `MethodVisitor.visitTableSwitchInsn()`: `tableswitch`, `lookupswitch`

## if and goto

### compare int with zero

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test(int val) {
        if (val == 0) {
            System.out.println("val is 0");
        }
        else {
            System.out.println("val is not 0");
        }
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test(int);
    Code:
       0: iload_1
       1: ifne          15
       4: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
       7: ldc           #3                  // String val is 0
       9: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      12: goto          23
      15: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
      18: ldc           #5                  // String val is not 0
      20: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      23: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
Label label0 = new Label();
Label label1 = new Label();

methodVisitor.visitCode();
methodVisitor.visitVarInsn(ILOAD, 1);
methodVisitor.visitJumpInsn(IFNE, label0);
methodVisitor.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
methodVisitor.visitLdcInsn("val is 0");
methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
methodVisitor.visitJumpInsn(GOTO, label1);

methodVisitor.visitLabel(label0);
methodVisitor.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
methodVisitor.visitLdcInsn("val is not 0");
methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);

methodVisitor.visitLabel(label1);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 2);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this, int} | {}
0000: iload_1                  // {this, int} | {int}
0001: ifne            14       // {this, int} | {}
0004: getstatic       #2       // {this, int} | {PrintStream}
0007: ldc             #3       // {this, int} | {PrintStream, String}
0009: invokevirtual   #4       // {this, int} | {}
0012: goto            11       // {} | {}
                               // {this, int} | {}
0015: getstatic       #2       // {this, int} | {PrintStream}
0018: ldc             #5       // {this, int} | {PrintStream, String}
0020: invokevirtual   #4       // {this, int} | {}
                               // {this, int} | {}
0023: return                   // {} | {}
```

从 JVM 规范的角度来看，`ifne` 指令对应的 Operand Stack 的变化如下：

```text
..., value →

...
```

The `value` must be of type `int`. It is popped from the operand stack and compared against **zero**. All comparisons are signed. The results of the comparisons are as follows:

- `ifeq` succeeds if and only if `value = 0`
- `ifne` succeeds if and only if `value ≠ 0`
- `iflt` succeeds if and only if `value < 0`
- `ifle` succeeds if and only if `value ≤ 0`
- `ifgt` succeeds if and only if `value > 0`
- `ifge` succeeds if and only if `value ≥ 0`

### compare int with non-zero

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test(int a, int b) {
        if (a > b) {
            System.out.println("a > b");
        }
        else {
            System.out.println("a <= b");
        }
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test(int, int);
    Code:
       0: iload_1
       1: iload_2
       2: if_icmple     16
       5: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
       8: ldc           #3                  // String a > b
      10: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      13: goto          24
      16: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
      19: ldc           #5                  // String a <= b
      21: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      24: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
Label label0 = new Label();
Label label1 = new Label();

methodVisitor.visitCode();
methodVisitor.visitVarInsn(ILOAD, 1);
methodVisitor.visitVarInsn(ILOAD, 2);
methodVisitor.visitJumpInsn(IF_ICMPLE, label0);
methodVisitor.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
methodVisitor.visitLdcInsn("a > b");
methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
methodVisitor.visitJumpInsn(GOTO, label1);

methodVisitor.visitLabel(label0);
methodVisitor.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
methodVisitor.visitLdcInsn("a <= b");
methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);

methodVisitor.visitLabel(label1);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 3);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this, int, int} | {}
0000: iload_1                  // {this, int, int} | {int}
0001: iload_2                  // {this, int, int} | {int, int}
0002: if_icmple       14       // {this, int, int} | {}
0005: getstatic       #2       // {this, int, int} | {PrintStream}
0008: ldc             #3       // {this, int, int} | {PrintStream, String}
0010: invokevirtual   #4       // {this, int, int} | {}
0013: goto            11       // {} | {}
                               // {this, int, int} | {}
0016: getstatic       #2       // {this, int, int} | {PrintStream}
0019: ldc             #5       // {this, int, int} | {PrintStream, String}
0021: invokevirtual   #4       // {this, int, int} | {}
                               // {this, int, int} | {}
0024: return                   // {} | {}
```

从 JVM 规范的角度来看，`if_icmple` 指令对应的 Operand Stack 的变化如下：

```text
..., value1, value2 →

...
```

Both `value1` and `value2` must be of type `int`. They are both popped from the operand stack and compared. All comparisons are signed. The results of the comparison are as follows:

- `if_icmpeq` succeeds if and only if `value1 = value2`
- `if_icmpne` succeeds if and only if `value1 ≠ value2`
- `if_icmplt` succeeds if and only if `value1 < value2`
- `if_icmple` succeeds if and only if `value1 ≤ value2`
- `if_icmpgt` succeeds if and only if `value1 > value2`
- `if_icmpge` succeeds if and only if `value1 ≥ value2`

### compare long

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test(long a, long b) {
        if (a > b) {
            System.out.println("a > b");
        }
        else {
            System.out.println("a <= b");
        }
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test(long, long);
    Code:
       0: lload_1
       1: lload_3
       2: lcmp
       3: ifle          17
       6: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
       9: ldc           #3                  // String a > b
      11: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      14: goto          25
      17: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
      20: ldc           #5                  // String a <= b
      22: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      25: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
Label label0 = new Label();
Label label1 = new Label();

methodVisitor.visitCode();
methodVisitor.visitVarInsn(LLOAD, 1);
methodVisitor.visitVarInsn(LLOAD, 3);
methodVisitor.visitInsn(LCMP);
methodVisitor.visitJumpInsn(IFLE, label0);
methodVisitor.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
methodVisitor.visitLdcInsn("a > b");
methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
methodVisitor.visitJumpInsn(GOTO, label1);

methodVisitor.visitLabel(label0);
methodVisitor.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
methodVisitor.visitLdcInsn("a <= b");
methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);

methodVisitor.visitLabel(label1);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(4, 5);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this, long, top, long, top} | {}
0000: lload_1                  // {this, long, top, long, top} | {long, top}
0001: lload_3                  // {this, long, top, long, top} | {long, top, long, top}
0002: lcmp                     // {this, long, top, long, top} | {int}
0003: ifle            14       // {this, long, top, long, top} | {}
0006: getstatic       #2       // {this, long, top, long, top} | {PrintStream}
0009: ldc             #3       // {this, long, top, long, top} | {PrintStream, String}
0011: invokevirtual   #4       // {this, long, top, long, top} | {}
0014: goto            11       // {} | {}
                               // {this, long, top, long, top} | {}
0017: getstatic       #2       // {this, long, top, long, top} | {PrintStream}
0020: ldc             #5       // {this, long, top, long, top} | {PrintStream, String}
0022: invokevirtual   #4       // {this, long, top, long, top} | {}
                               // {this, long, top, long, top} | {}
0025: return                   // {} | {}
```

从 JVM 规范的角度来看，`lcmp` 指令对应的 Operand Stack 的变化如下：

```text
..., value1, value2 →

..., result
```

Both `value1` and `value2` must be of type `long`. They are both popped from the operand stack, and a signed integer comparison is performed. If `value1` is greater than `value2`, the int value `1` is pushed onto the operand stack. If `value1` is equal to `value2`, the int value `0` is pushed onto the operand stack. If `value1` is less than `value2`, the int value `-1` is pushed onto the operand stack.

### compare obj with null

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test(Object obj) {
        if (obj == null) {
            System.out.println("obj is null");
        }
        else {
            System.out.println("obj is not null");
        }
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test(java.lang.Object);
    Code:
       0: aload_1
       1: ifnonnull     15
       4: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
       7: ldc           #3                  // String obj is null
       9: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      12: goto          23
      15: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
      18: ldc           #5                  // String obj is not null
      20: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      23: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
Label label0 = new Label();
Label label1 = new Label();

methodVisitor.visitCode();
methodVisitor.visitVarInsn(ALOAD, 1);
methodVisitor.visitJumpInsn(IFNONNULL, label0);
methodVisitor.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
methodVisitor.visitLdcInsn("obj is null");
methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
methodVisitor.visitJumpInsn(GOTO, label1);

methodVisitor.visitLabel(label0);
methodVisitor.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
methodVisitor.visitLdcInsn("obj is not null");
methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);

methodVisitor.visitLabel(label1);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 2);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this, Object} | {}
0000: aload_1                  // {this, Object} | {Object}
0001: ifnonnull       14       // {this, Object} | {}
0004: getstatic       #2       // {this, Object} | {PrintStream}
0007: ldc             #3       // {this, Object} | {PrintStream, String}
0009: invokevirtual   #4       // {this, Object} | {}
0012: goto            11       // {} | {}
                               // {this, Object} | {}
0015: getstatic       #2       // {this, Object} | {PrintStream}
0018: ldc             #5       // {this, Object} | {PrintStream, String}
0020: invokevirtual   #4       // {this, Object} | {}
                               // {this, Object} | {}
0023: return                   // {} | {}
```

从 JVM 规范的角度来看，`ifnonnull` 指令对应的 Operand Stack 的变化如下：

```text
..., value →

...
```

另外，`ifnonnull` 指令对应的 Format 如下：

```text
ifnonnull
branchbyte1
branchbyte2
```

The `value` must be of type `reference`. It is popped from the operand stack. If `value` is not `null`, the unsigned `branchbyte1` and `branchbyte2` are used to construct a signed 16-bit offset, where the offset is calculated to be `(branchbyte1 << 8) | branchbyte2`. Execution then proceeds at that offset from the address of the opcode of this `ifnonnull` instruction. The target address must be that of an opcode of an instruction within the method that contains this `ifnonnull` instruction.

Otherwise, execution proceeds at the address of the instruction following this `ifnonnull` instruction.

### compare objA with objB

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test(Object objA, Object objB) {
        if (objA == objB) {
            System.out.println("objA == objB");
        }
        else {
            System.out.println("objA != objB");
        }
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test(java.lang.Object, java.lang.Object);
    Code:
       0: aload_1
       1: aload_2
       2: if_acmpne     16
       5: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
       8: ldc           #3                  // String objA == objB
      10: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      13: goto          24
      16: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
      19: ldc           #5                  // String objA != objB
      21: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      24: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
Label label0 = new Label();
Label label1 = new Label();

methodVisitor.visitCode();
methodVisitor.visitVarInsn(ALOAD, 1);
methodVisitor.visitVarInsn(ALOAD, 2);
methodVisitor.visitJumpInsn(IF_ACMPNE, label0);
methodVisitor.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
methodVisitor.visitLdcInsn("objA == objB");
methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
methodVisitor.visitJumpInsn(GOTO, label1);

methodVisitor.visitLabel(label0);
methodVisitor.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
methodVisitor.visitLdcInsn("objA != objB");
methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);

methodVisitor.visitLabel(label1);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 3);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this, Object, Object} | {}
0000: aload_1                  // {this, Object, Object} | {Object}
0001: aload_2                  // {this, Object, Object} | {Object, Object}
0002: if_acmpne       14       // {this, Object, Object} | {}
0005: getstatic       #2       // {this, Object, Object} | {PrintStream}
0008: ldc             #3       // {this, Object, Object} | {PrintStream, String}
0010: invokevirtual   #4       // {this, Object, Object} | {}
0013: goto            11       // {} | {}
                               // {this, Object, Object} | {}
0016: getstatic       #2       // {this, Object, Object} | {PrintStream}
0019: ldc             #5       // {this, Object, Object} | {PrintStream, String}
0021: invokevirtual   #4       // {this, Object, Object} | {}
                               // {this, Object, Object} | {}
0024: return                   // {} | {}
```

从 JVM 规范的角度来看，`if_acmpne` 指令对应的 Operand Stack 的变化如下：

```text
..., value1, value2 →

...
```

Both `value1` and `value2` must be of type `reference`. They are both popped from the operand stack and compared. The results of the comparison are as follows:

- `if_acmpeq` succeeds if and only if `value1 = value2`
- `if_acmpne` succeeds if and only if `value1 ≠ value2`

## switch

### tableswitch

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test(int val) {
        int result = 0;

        switch (val) {
            case 1:
                result = 1;
                break;
            case 2:
                result = 2;
                break;
            case 3:
                result = 3;
                break;
            default:
                result = 4;
        }
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test(int);
    Code:
       0: iconst_0
       1: istore_2
       2: iload_1
       3: tableswitch   { // 1 to 3
                     1: 28
                     2: 33
                     3: 38
               default: 43
          }
      28: iconst_1
      29: istore_2
      30: goto          45
      33: iconst_2
      34: istore_2
      35: goto          45
      38: iconst_3
      39: istore_2
      40: goto          45
      43: iconst_4
      44: istore_2
      45: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
Label label0 = new Label();
Label label1 = new Label();
Label label2 = new Label();
Label label3 = new Label();
Label label4 = new Label();

methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_0);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitVarInsn(ILOAD, 1);
methodVisitor.visitTableSwitchInsn(1, 3, label3, new Label[] { label0, label1, label2 });

methodVisitor.visitLabel(label0);
methodVisitor.visitInsn(ICONST_1);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitJumpInsn(GOTO, label4);

methodVisitor.visitLabel(label1);
methodVisitor.visitInsn(ICONST_2);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitJumpInsn(GOTO, label4);

methodVisitor.visitLabel(label2);
methodVisitor.visitInsn(ICONST_3);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitJumpInsn(GOTO, label4);

methodVisitor.visitLabel(label3);
methodVisitor.visitInsn(ICONST_4);
methodVisitor.visitVarInsn(ISTORE, 2);

methodVisitor.visitLabel(label4);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 3);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this, int} | {}
0000: iconst_0                 // {this, int} | {int}
0001: istore_2                 // {this, int, int} | {}
0002: iload_1                  // {this, int, int} | {int}
0003: tableswitch              // {} | {}
      {
              1: 25
              2: 30
              3: 35
        default: 40
      }
                               // {this, int, int} | {}
0028: iconst_1                 // {this, int, int} | {int}
0029: istore_2                 // {this, int, int} | {}
0030: goto            15       // {} | {}
                               // {this, int, int} | {}
0033: iconst_2                 // {this, int, int} | {int}
0034: istore_2                 // {this, int, int} | {}
0035: goto            10       // {} | {}
                               // {this, int, int} | {}
0038: iconst_3                 // {this, int, int} | {int}
0039: istore_2                 // {this, int, int} | {}
0040: goto            5        // {} | {}
                               // {this, int, int} | {}
0043: iconst_4                 // {this, int, int} | {int}
0044: istore_2                 // {this, int, int} | {}
                               // {this, int, int} | {}
0045: return                   // {} | {}
```

从 JVM 规范的角度来看，`tableswitch` 指令对应的 Operand Stack 的变化如下：

```text
..., index →

...
```

另外，`tableswitch` 指令对应的 Format 如下：

```text
tableswitch
<0-3 byte pad>
defaultbyte1
defaultbyte2
defaultbyte3
defaultbyte4
lowbyte1
lowbyte2
lowbyte3
lowbyte4
highbyte1
highbyte2
highbyte3
highbyte4
jump offsets...
```

The `index` must be of type `int` and is popped from the operand stack.

- If `index` is less than `low` or `index` is greater than `high`, then a target address is calculated by adding `default` to the address of the opcode of this `tableswitch` instruction.
- Otherwise, the offset at position `index - low` of the jump table is extracted. The target address is calculated by adding that offset to the address of the opcode of this `tableswitch` instruction. Execution then continues at the target address.


### lookupswitch

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test(int val) {
        int result = 0;

        switch (val) {
            case 10:
                result = 1;
                break;
            case 20:
                result = 2;
                break;
            case 30:
                result = 3;
                break;
            default:
                result = 4;
        }
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test(int);
    Code:
       0: iconst_0
       1: istore_2
       2: iload_1
       3: lookupswitch  { // 3
                    10: 36
                    20: 41
                    30: 46
               default: 51
          }
      36: iconst_1
      37: istore_2
      38: goto          53
      41: iconst_2
      42: istore_2
      43: goto          53
      46: iconst_3
      47: istore_2
      48: goto          53
      51: iconst_4
      52: istore_2
      53: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
Label label0 = new Label();
Label label1 = new Label();
Label label2 = new Label();
Label label3 = new Label();
Label label4 = new Label();

methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_0);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitVarInsn(ILOAD, 1);
methodVisitor.visitLookupSwitchInsn(label3, new int[] { 10, 20, 30 }, new Label[] { label0, label1, label2 });

methodVisitor.visitLabel(label0);
methodVisitor.visitInsn(ICONST_1);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitJumpInsn(GOTO, label4);

methodVisitor.visitLabel(label1);
methodVisitor.visitInsn(ICONST_2);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitJumpInsn(GOTO, label4);

methodVisitor.visitLabel(label2);
methodVisitor.visitInsn(ICONST_3);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitJumpInsn(GOTO, label4);

methodVisitor.visitLabel(label3);
methodVisitor.visitInsn(ICONST_4);
methodVisitor.visitVarInsn(ISTORE, 2);

methodVisitor.visitLabel(label4);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 3);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this, int} | {}
0000: iconst_0                 // {this, int} | {int}
0001: istore_2                 // {this, int, int} | {}
0002: iload_1                  // {this, int, int} | {int}
0003: lookupswitch             // {} | {}
      {
             10: 33
             20: 38
             30: 43
        default: 48
      }
                               // {this, int, int} | {}
0036: iconst_1                 // {this, int, int} | {int}
0037: istore_2                 // {this, int, int} | {}
0038: goto            15       // {} | {}
                               // {this, int, int} | {}
0041: iconst_2                 // {this, int, int} | {int}
0042: istore_2                 // {this, int, int} | {}
0043: goto            10       // {} | {}
                               // {this, int, int} | {}
0046: iconst_3                 // {this, int, int} | {int}
0047: istore_2                 // {this, int, int} | {}
0048: goto            5        // {} | {}
                               // {this, int, int} | {}
0051: iconst_4                 // {this, int, int} | {int}
0052: istore_2                 // {this, int, int} | {}
                               // {this, int, int} | {}
0053: return                   // {} | {}
```

从 JVM 规范的角度来看，`lookupswitch` 指令对应的 Operand Stack 的变化如下：

```text
..., key →

...
```

另外，`lookupswitch` 指令对应的 Format 如下：

```text
lookupswitch
<0-3 byte pad>
defaultbyte1
defaultbyte2
defaultbyte3
defaultbyte4
npairs1
npairs2
npairs3
npairs4
match-offset pairs...
```

The `key` must be of type `int` and is popped from the operand stack. The `key` is compared against the match values.

- If it is equal to one of them, then a target address is calculated by adding the corresponding offset to the address of the opcode of this `lookupswitch` instruction.
- If the `key` does not match any of the match values, the target address is calculated by adding `default` to the address of the opcode of this `lookupswitch` instruction. Execution then continues at the target address.


