---
title: "opcode: math (52/128/205)"
sequence: "204"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## 概览

从 Instruction 的角度来说，与 math 相关的 opcode 有 52 个，内容如下：

| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|--------|-----------------|
| 96     | iadd            | 109    | ldiv            | 122    | ishr            | 135    | i2d             |
| 97     | ladd            | 110    | fdiv            | 123    | lshr            | 136    | l2i             |
| 98     | fadd            | 111    | ddiv            | 124    | iushr           | 137    | l2f             |
| 99     | dadd            | 112    | irem            | 125    | lushr           | 138    | l2d             |
| 100    | isub            | 113    | lrem            | 126    | iand            | 139    | f2i             |
| 101    | lsub            | 114    | frem            | 127    | land            | 140    | f2l             |
| 102    | fsub            | 115    | drem            | 128    | ior             | 141    | f2d             |
| 103    | dsub            | 116    | ineg            | 129    | lor             | 142    | d2i             |
| 104    | imul            | 117    | lneg            | 130    | ixor            | 143    | d2l             |
| 105    | lmul            | 118    | fneg            | 131    | lxor            | 144    | d2f             |
| 106    | fmul            | 119    | dneg            | 132    | iinc            | 145    | i2b             |
| 107    | dmul            | 120    | ishl            | 133    | i2l             | 146    | i2c             |
| 108    | idiv            | 121    | lshl            | 134    | i2f             | 147    | i2s             |

从 ASM 的角度来说，这些 opcode 与 `MethodVisitor.visitXxxInsn()` 方法对应关系如下：

- `MethodVisitor.visitInsn()`:
    - `iadd`, `isub`, `imul`, `idiv`, `irem`, `ineg`
    - `ladd`, `lsub`, `lmul`, `ldiv`, `lrem`, `lneg`
    - `fadd`, `fsub`, `fmul`, `fdiv`, `frem`, `fneg`
    - `dadd`, `dsub`, `dmul`, `ddiv`, `drem`, `dneg`
    - `ishl`, `ishr`, `iushr`, `iand`, `ior`, `ixor` （int 类型的位操作）
    - `lshl`, `lshr`, `lushr`, `land`, `lor`, `lxor` （long 类型的位操作）
    - `i2l`, `i2f`, `i2d`, `i2b`, `i2c`, `i2s`
    - `l2i`, `l2f`, `l2d`
    - `f2i`, `f2l`, `f2d`
    - `d2i`, `d2l`, `d2f`
- `MethodVisitor.visitIincInsn()`: `iinc`

## Arithmetic

### int: add/sub/mul/div/rem

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int a = 1;
        int b = 2;
        int c = a + b;
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
       2: iconst_2
       3: istore_2
       4: iload_1
       5: iload_2
       6: iadd
       7: istore_3
       8: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_1);
methodVisitor.visitVarInsn(ISTORE, 1);
methodVisitor.visitInsn(ICONST_2);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitVarInsn(ILOAD, 1);
methodVisitor.visitVarInsn(ILOAD, 2);
methodVisitor.visitInsn(IADD);
methodVisitor.visitVarInsn(ISTORE, 3);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 4);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_1                 // {this} | {int}
0001: istore_1                 // {this, int} | {}
0002: iconst_2                 // {this, int} | {int}
0003: istore_2                 // {this, int, int} | {}
0004: iload_1                  // {this, int, int} | {int}
0005: iload_2                  // {this, int, int} | {int, int}
0006: iadd                     // {this, int, int} | {int}
0007: istore_3                 // {this, int, int, int} | {}
0008: return                   // {} | {}
```

从 JVM 规范的角度来看，`iadd` 指令对应的 Operand Stack 的变化如下：

```text
..., value1, value2 →

..., result
```

### long: add/sub/mul/div/rem

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        long a = 1;
        long b = 2;
        long c = a + b;
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
       2: ldc2_w        #2                  // long 2l
       5: lstore_3
       6: lload_1
       7: lload_3
       8: ladd
       9: lstore        5
      11: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(LCONST_1);
methodVisitor.visitVarInsn(LSTORE, 1);
methodVisitor.visitLdcInsn(new Long(2L));
methodVisitor.visitVarInsn(LSTORE, 3);
methodVisitor.visitVarInsn(LLOAD, 1);
methodVisitor.visitVarInsn(LLOAD, 3);
methodVisitor.visitInsn(LADD);
methodVisitor.visitVarInsn(LSTORE, 5);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(4, 7);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: lconst_1                 // {this} | {long, top}
0001: lstore_1                 // {this, long, top} | {}
0002: ldc2_w          #2       // {this, long, top} | {long, top}
0005: lstore_3                 // {this, long, top, long, top} | {}
0006: lload_1                  // {this, long, top, long, top} | {long, top}
0007: lload_3                  // {this, long, top, long, top} | {long, top, long, top}
0008: ladd                     // {this, long, top, long, top} | {long, top}
0009: lstore          5        // {this, long, top, long, top, long, top} | {}
0011: return                   // {} | {}
```

从 JVM 规范的角度来看，`ladd` 指令对应的 Operand Stack 的变化如下：

```text
..., value1, value2 →

..., result
```

Both `value1` and `value2` must be of type `long`. The values are popped from the operand stack. The long `result` is `value1 + value2`. The `result` is pushed onto the operand stack.

### int: ineg

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int a = 1;
        int b = -a;
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
       3: ineg
       4: istore_2
       5: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_1);
methodVisitor.visitVarInsn(ISTORE, 1);
methodVisitor.visitVarInsn(ILOAD, 1);
methodVisitor.visitInsn(INEG);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 3);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_1                 // {this} | {int}
0001: istore_1                 // {this, int} | {}
0002: iload_1                  // {this, int} | {int}
0003: ineg                     // {this, int} | {int}
0004: istore_2                 // {this, int, int} | {}
0005: return                   // {} | {}
```

从 JVM 规范的角度来看，`ineg` 指令对应的 Operand Stack 的变化如下：

```text
..., value →

..., result
```

The `value` must be of type `int`. It is popped from the operand stack. The int `result` is the arithmetic negation of `value`, `-value`. The `result` is pushed onto the operand stack.

### long: lneg

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        long a = 1;
        long b = -a;
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
       3: lneg
       4: lstore_3
       5: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(LCONST_1);
methodVisitor.visitVarInsn(LSTORE, 1);
methodVisitor.visitVarInsn(LLOAD, 1);
methodVisitor.visitInsn(LNEG);
methodVisitor.visitVarInsn(LSTORE, 3);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 5);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: lconst_1                 // {this} | {long, top}
0001: lstore_1                 // {this, long, top} | {}
0002: lload_1                  // {this, long, top} | {long, top}
0003: lneg                     // {this, long, top} | {long, top}
0004: lstore_3                 // {this, long, top, long, top} | {}
0005: return                   // {} | {}
```

从 JVM 规范的角度来看，`lneg` 指令对应的 Operand Stack 的变化如下：

```text
..., value →

..., result
```

The `value` must be of type `long`. It is popped from the operand stack. The long `result` is the arithmetic negation of `value`, `-value`. The `result` is pushed onto the operand stack.

## int: iinc

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int i = 0;
        i++;
        i += 10;
        i -= 5;
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
       2: iinc          1, 1
       5: iinc          1, 10
       8: iinc          1, -5
      11: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_0);
methodVisitor.visitVarInsn(ISTORE, 1);
methodVisitor.visitIincInsn(1, 1);
methodVisitor.visitIincInsn(1, 10);
methodVisitor.visitIincInsn(1, -5);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 2);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_0                 // {this} | {int}
0001: istore_1                 // {this, int} | {}
0002: iinc       1    1        // {this, int} | {}
0005: iinc       1    10       // {this, int} | {}
0008: iinc       1    -5       // {this, int} | {}
0011: return                   // {} | {}
```

从 JVM 规范的角度来看，`iinc` 指令对应的 Operand Stack 的变化如下：

```text
No change
```

## Bit Shift

### shift left

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int a = 1;
        int b = 2;
        int c = a << b;
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
       2: iconst_2
       3: istore_2
       4: iload_1
       5: iload_2
       6: ishl
       7: istore_3
       8: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_1);
methodVisitor.visitVarInsn(ISTORE, 1);
methodVisitor.visitInsn(ICONST_2);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitVarInsn(ILOAD, 1);
methodVisitor.visitVarInsn(ILOAD, 2);
methodVisitor.visitInsn(ISHL);
methodVisitor.visitVarInsn(ISTORE, 3);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 4);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_1                 // {this} | {int}
0001: istore_1                 // {this, int} | {}
0002: iconst_2                 // {this, int} | {int}
0003: istore_2                 // {this, int, int} | {}
0004: iload_1                  // {this, int, int} | {int}
0005: iload_2                  // {this, int, int} | {int, int}
0006: ishl                     // {this, int, int} | {int}
0007: istore_3                 // {this, int, int, int} | {}
0008: return                   // {} | {}
```

从 JVM 规范的角度来看，`ishl` 指令对应的 Operand Stack 的变化如下：

```text
..., value1, value2 →

..., result
```

Both `value1` and `value2` must be of type `int`. The values are popped from the operand stack. An int `result` is calculated by shifting `value1` left by `s` bit positions, where `s` is the value of the low 5 bits of `value2`. The `result` is pushed onto the operand stack.

### arithmetic shift right

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int a = 1;
        int b = 2;
        int c = a >> b;
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
       2: iconst_2
       3: istore_2
       4: iload_1
       5: iload_2
       6: ishr
       7: istore_3
       8: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_1);
methodVisitor.visitVarInsn(ISTORE, 1);
methodVisitor.visitInsn(ICONST_2);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitVarInsn(ILOAD, 1);
methodVisitor.visitVarInsn(ILOAD, 2);
methodVisitor.visitInsn(ISHR);
methodVisitor.visitVarInsn(ISTORE, 3);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 4);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_1                 // {this} | {int}
0001: istore_1                 // {this, int} | {}
0002: iconst_2                 // {this, int} | {int}
0003: istore_2                 // {this, int, int} | {}
0004: iload_1                  // {this, int, int} | {int}
0005: iload_2                  // {this, int, int} | {int, int}
0006: ishr                     // {this, int, int} | {int}
0007: istore_3                 // {this, int, int, int} | {}
0008: return                   // {} | {}
```

从 JVM 规范的角度来看，`ishr` 指令对应的 Operand Stack 的变化如下：

```text
..., value1, value2 →

..., result
```

Both `value1` and `value2` must be of type `int`. The values are popped from the operand stack. An int `result` is calculated by shifting `value1` right by `s` bit positions, with **sign extension**, where `s` is the value of the low 5 bits of `value2`. The `result` is pushed onto the operand stack.

### logical shift right

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int a = 1;
        int b = 2;
        int c = a >>> b;
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
       2: iconst_2
       3: istore_2
       4: iload_1
       5: iload_2
       6: iushr
       7: istore_3
       8: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_1);
methodVisitor.visitVarInsn(ISTORE, 1);
methodVisitor.visitInsn(ICONST_2);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitVarInsn(ILOAD, 1);
methodVisitor.visitVarInsn(ILOAD, 2);
methodVisitor.visitInsn(IUSHR);
methodVisitor.visitVarInsn(ISTORE, 3);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 4);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_1                 // {this} | {int}
0001: istore_1                 // {this, int} | {}
0002: iconst_2                 // {this, int} | {int}
0003: istore_2                 // {this, int, int} | {}
0004: iload_1                  // {this, int, int} | {int}
0005: iload_2                  // {this, int, int} | {int, int}
0006: iushr                    // {this, int, int} | {int}
0007: istore_3                 // {this, int, int, int} | {}
0008: return                   // {} | {}
```

从 JVM 规范的角度来看，`iushr` 指令对应的 Operand Stack 的变化如下：

```text
..., value1, value2 →

..., result
```

Both `value1` and `value2` must be of type `int`. The values are popped from the operand stack. An int `result` is calculated by shifting `value1` right by `s` bit positions, with **zero extension**, where `s` is the value of the low 5 bits of `value2`. The `result` is pushed onto the operand stack.

## Bit Logic

### and

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int a = 1;
        int b = 2;
        int c = a & b;
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
       2: iconst_2
       3: istore_2
       4: iload_1
       5: iload_2
       6: iand
       7: istore_3
       8: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_1);
methodVisitor.visitVarInsn(ISTORE, 1);
methodVisitor.visitInsn(ICONST_2);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitVarInsn(ILOAD, 1);
methodVisitor.visitVarInsn(ILOAD, 2);
methodVisitor.visitInsn(IAND);
methodVisitor.visitVarInsn(ISTORE, 3);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 4);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_1                 // {this} | {int}
0001: istore_1                 // {this, int} | {}
0002: iconst_2                 // {this, int} | {int}
0003: istore_2                 // {this, int, int} | {}
0004: iload_1                  // {this, int, int} | {int}
0005: iload_2                  // {this, int, int} | {int, int}
0006: iand                     // {this, int, int} | {int}
0007: istore_3                 // {this, int, int, int} | {}
0008: return                   // {} | {}
```

从 JVM 规范的角度来看，`iand` 指令对应的 Operand Stack 的变化如下：

```text
..., value1, value2 →

..., result
```

Both `value1` and `value2` must be of type `int`. They are popped from the operand stack. An int `result` is calculated by taking the bitwise AND (conjunction) of `value1` and `value2`. The `result` is pushed onto the operand stack.

### or

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int a = 1;
        int b = 2;
        int c = a | b;
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
       2: iconst_2
       3: istore_2
       4: iload_1
       5: iload_2
       6: ior
       7: istore_3
       8: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_1);
methodVisitor.visitVarInsn(ISTORE, 1);
methodVisitor.visitInsn(ICONST_2);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitVarInsn(ILOAD, 1);
methodVisitor.visitVarInsn(ILOAD, 2);
methodVisitor.visitInsn(IOR);
methodVisitor.visitVarInsn(ISTORE, 3);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 4);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_1                 // {this} | {int}
0001: istore_1                 // {this, int} | {}
0002: iconst_2                 // {this, int} | {int}
0003: istore_2                 // {this, int, int} | {}
0004: iload_1                  // {this, int, int} | {int}
0005: iload_2                  // {this, int, int} | {int, int}
0006: ior                      // {this, int, int} | {int}
0007: istore_3                 // {this, int, int, int} | {}
0008: return                   // {} | {}
```

从 JVM 规范的角度来看，`ior` 指令对应的 Operand Stack 的变化如下：

```text
..., value1, value2 →

..., result
```

Both `value1` and `value2` must be of type `int`. They are popped from the operand stack. An int `result` is calculated by taking the bitwise inclusive OR of `value1` and `value2`. The `result` is pushed onto the operand stack.

### xor

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int a = 1;
        int b = 2;
        int c = a ^ b;
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
       2: iconst_2
       3: istore_2
       4: iload_1
       5: iload_2
       6: ixor
       7: istore_3
       8: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_1);
methodVisitor.visitVarInsn(ISTORE, 1);
methodVisitor.visitInsn(ICONST_2);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitVarInsn(ILOAD, 1);
methodVisitor.visitVarInsn(ILOAD, 2);
methodVisitor.visitInsn(IXOR);
methodVisitor.visitVarInsn(ISTORE, 3);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 4);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_1                 // {this} | {int}
0001: istore_1                 // {this, int} | {}
0002: iconst_2                 // {this, int} | {int}
0003: istore_2                 // {this, int, int} | {}
0004: iload_1                  // {this, int, int} | {int}
0005: iload_2                  // {this, int, int} | {int, int}
0006: ixor                     // {this, int, int} | {int}
0007: istore_3                 // {this, int, int, int} | {}
0008: return                   // {} | {}
```

从 JVM 规范的角度来看，`ixor` 指令对应的 Operand Stack 的变化如下：

```text
..., value1, value2 →

..., result
```

Both `value1` and `value2` must be of type `int`. They are popped from the operand stack. An int `result` is calculated by taking the bitwise exclusive OR of `value1` and `value2`. The `result` is pushed onto the operand stack.

### not

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int a = 0;
        int b = ~a;
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
       2: iload_1
       3: iconst_m1
       4: ixor
       5: istore_2
       6: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_0);
methodVisitor.visitVarInsn(ISTORE, 1);
methodVisitor.visitVarInsn(ILOAD, 1);
methodVisitor.visitInsn(ICONST_M1);
methodVisitor.visitInsn(IXOR);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 3);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_0                 // {this} | {int}
0001: istore_1                 // {this, int} | {}
0002: iload_1                  // {this, int} | {int}
0003: iconst_m1                // {this, int} | {int, int}
0004: ixor                     // {this, int} | {int}
0005: istore_2                 // {this, int, int} | {}
0006: return                   // {} | {}
```

从 JVM 规范的角度来看，`ixor` 指令对应的 Operand Stack 的变化如下：

```text
..., value1, value2 →

..., result
```

Both `value1` and `value2` must be of type `int`. They are popped from the operand stack. An int `result` is calculated by taking the bitwise exclusive OR of `value1` and `value2`. The `result` is pushed onto the operand stack.

## Type Conversion

### int to long

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int intValue = 0;
        long longValue = intValue;
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
       2: iload_1
       3: i2l
       4: lstore_2
       5: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_0);
methodVisitor.visitVarInsn(ISTORE, 1);
methodVisitor.visitVarInsn(ILOAD, 1);
methodVisitor.visitInsn(I2L);
methodVisitor.visitVarInsn(LSTORE, 2);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 4);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_0                 // {this} | {int}
0001: istore_1                 // {this, int} | {}
0002: iload_1                  // {this, int} | {int}
0003: i2l                      // {this, int} | {long, top}
0004: lstore_2                 // {this, int, long, top} | {}
0005: return                   // {} | {}
```

从 JVM 规范的角度来看，`i2l` 指令对应的 Operand Stack 的变化如下：

```text
..., value →

..., result
```

The value on the top of the operand stack must be of type `int`. It is popped from the operand stack and sign-extended to a `long` result. That `result` is pushed onto the operand stack.

### long to int

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        long longValue = 0;
        int intValue = (int) longValue;
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
       0: lconst_0
       1: lstore_1
       2: lload_1
       3: l2i
       4: istore_3
       5: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(LCONST_0);
methodVisitor.visitVarInsn(LSTORE, 1);
methodVisitor.visitVarInsn(LLOAD, 1);
methodVisitor.visitInsn(L2I);
methodVisitor.visitVarInsn(ISTORE, 3);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 4);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: lconst_0                 // {this} | {long, top}
0001: lstore_1                 // {this, long, top} | {}
0002: lload_1                  // {this, long, top} | {long, top}
0003: l2i                      // {this, long, top} | {int}
0004: istore_3                 // {this, long, top, int} | {}
0005: return                   // {} | {}
```

从 JVM 规范的角度来看，`l2i` 指令对应的 Operand Stack 的变化如下：

```text
..., value →

..., result
```

The `value` on the top of the operand stack must be of type `long`. It is popped from the operand stack and converted to an int `result` by taking the low-order 32 bits of the long `value` and discarding the high-order 32 bits. The `result` is pushed onto the operand stack.
