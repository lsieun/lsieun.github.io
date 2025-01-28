---
title: "opcode: wide (1/195/205)"
sequence: "211"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## 概览

从 Instruction 的角度来说，与 wide 相关的 opcode 有 1 个，内容如下：

| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|--------|-----------------|
| 196    | wide            |        |                 |        |                 |        |                 |

从 ASM 的角度来说，这 `wide` 指令并没有与特定的 `MethodVisitor.visitXxxInsn()` 方法对应。

The `wide` instruction modifies the behavior of another instruction. It takes one of two formats, depending on the instruction being modified.

The first form of the `wide` instruction modifies one of the instructions `iload`, `fload`, `aload`, `lload`, `dload`, `istore`, `fstore`, `astore`, `lstore`, `dstore`, or `ret`.

```text
wide
<opcode>
indexbyte1
indexbyte2
```

where `<opcode>` is one of `iload`, `fload`, `aload`, `lload`, `dload`, `istore`, `fstore`, `astore`, `lstore`, `dstore`, or `ret`.

The second form of the `wide` instruction applies only to the `iinc` instruction.

```text
wide
iinc
indexbyte1
indexbyte2
constbyte1
constbyte2
```

另外，与 `wide` 相关的 opcode 有 `ldc_w`、`ldc2_w`、`goto_w` 和 `jsr_w`（已经弃用）。

## wide: istore

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int var001 = 1;
        // ... ... 省略
        int var257 = 257;
    }

    public static void main(String[] args) {
        String format = "int var%03d = %d;";
        for (int i = 1; i < 258; i++) {
            String line = String.format(format, i, i);
            System.out.println(line);
        }
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c -p sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: iconst_1
       1: istore_1
       2: iconst_2
       3: istore_2
       ...
    1140: sipush        256
    1143: istore_w      256
    1147: sipush        257
    1150: istore_w      257
    1154: return

...
}
```

但是，`istore_w` 并不是真实存在的 opcode，它其实是 `wide` 和 `istore` 指令的组合之后的结果，如下所示：

```text
=== === ===  === === ===  === === ===
0000: iconst_1             // 04
0001: istore_1             // 3C
0002: iconst_2             // 05
0003: istore_2             // 3D
...
1140: sipush          256  // 110100
1143: wide                 // C4
1144: istore          256  // 360100
1147: sipush          257  // 110101
1150: wide                 // C4
1151: istore          257  // 360101
1154: return               // B1
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_1);
methodVisitor.visitVarInsn(ISTORE, 1);
methodVisitor.visitInsn(ICONST_2);
methodVisitor.visitVarInsn(ISTORE, 2);
...
methodVisitor.visitIntInsn(SIPUSH, 255);
methodVisitor.visitVarInsn(ISTORE, 255);
methodVisitor.visitIntInsn(SIPUSH, 256);
methodVisitor.visitVarInsn(ISTORE, 256);
methodVisitor.visitIntInsn(SIPUSH, 257);
methodVisitor.visitVarInsn(ISTORE, 257);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 258);
methodVisitor.visitEnd();
```

## wide: iinc

当使用 `iinc` 时，如果 local variable 值的变化范围大于 `127` 或者小于 `-128`，就会生成 `wide` 指令。

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test(int val) {
        val += 128;
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c -p sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test(int);
    Code:
       0: iinc_w        1, 128
       6: return
}
```

但是，`iinc_w` 并不是真实存在的 opcode，它其实是 `wide` 和 `iinc` 指令的组合之后的结果，如下所示：

```text
=== === ===  === === ===  === === ===
0000: wide                 // C4
0001: iinc       1    128  // 8400010080
0006: return               // B1
=== === ===  === === ===  === === ===
LocalVariableTable:
index  start_pc  length  name_and_type
    0         0       7  this:Lsample/HelloWorld;
    1         0       7  val:I
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitIincInsn(1, 128);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(0, 2);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this, int} | {}
0000: wide                
0001: iinc       1    128      // {this, int} | {}
0006: return                   // {} | {}
```
