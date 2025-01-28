---
title: "opcode: constant (20/26/205)"
sequence: "202"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## 概览

从 Instruction 的角度来说，与 constant 相关的 opcode 有 20 个，内容如下：

| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|--------|-----------------|
| 1      | aconst_null     | 6      | iconst_3        | 11     | fconst_0        | 16     | bipush          |
| 2      | iconst_m1       | 7      | iconst_4        | 12     | fconst_1        | 17     | sipush          |
| 3      | iconst_0        | 8      | iconst_5        | 13     | fconst_2        | 18     | ldc             |
| 4      | iconst_1        | 9      | lconst_0        | 14     | dconst_0        | 19     | ldc_w           |
| 5      | iconst_2        | 10     | lconst_1        | 15     | dconst_1        | 20     | ldc2_w          |

从 ASM 的角度来说，这些 opcode 与 `MethodVisitor.visitXxxInsn()` 方法对应关系如下：

- `MethodVisitor.visitInsn()`: `aconst_null`, `iconst_<i>`, `lconst_<l>`, `fconst_<f>`, `dconst_<d>`
- `MethodVisitor.visitIntInsn()`: `bipush`, `sipush`
- `MethodVisitor.visitLdcInsn()`: `ldc`, `ldc_w`, `ldc2_w`

<fieldset>

<p>
在 B 站视频<a href="https://www.bilibili.com/video/BV1L64y1v7jB#reply94499748336" target="_blank">Java ASM 系列：（116）constant04</a>当中，
<a href="https://space.bilibili.com/430685850" target="_blank">伊ㅅ钦ㅇ</a>同学说：
</p>
<ul>
<li>
<b><code>ldc_w</code>这个<code>w</code>，如果是按王爽老师的 8086 汇编来看，可以理解为一个字（word）2 个字节，可能联想记忆比较好记点</b>。
</li>
</ul>

</fieldset>

## int

### `iconst_<i>`: -1~5

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int int_m1 = -1;
        int int_0 = 0;
        int int_1 = 1;
        int int_2 = 2;
        int int_3 = 3;
        int int_4 = 4;
        int int_5 = 5;
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
       0: iconst_m1
       1: istore_1
       2: iconst_0
       3: istore_2
       4: iconst_1
       5: istore_3
       6: iconst_2
       7: istore        4
       9: iconst_3
      10: istore        5
      12: iconst_4
      13: istore        6
      15: iconst_5
      16: istore        7
      18: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_M1);
methodVisitor.visitVarInsn(ISTORE, 1);
methodVisitor.visitInsn(ICONST_0);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitInsn(ICONST_1);
methodVisitor.visitVarInsn(ISTORE, 3);
methodVisitor.visitInsn(ICONST_2);
methodVisitor.visitVarInsn(ISTORE, 4);
methodVisitor.visitInsn(ICONST_3);
methodVisitor.visitVarInsn(ISTORE, 5);
methodVisitor.visitInsn(ICONST_4);
methodVisitor.visitVarInsn(ISTORE, 6);
methodVisitor.visitInsn(ICONST_5);
methodVisitor.visitVarInsn(ISTORE, 7);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 8);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_m1                // {this} | {int}
0001: istore_1                 // {this, int} | {}
0002: iconst_0                 // {this, int} | {int}
0003: istore_2                 // {this, int, int} | {}
0004: iconst_1                 // {this, int, int} | {int}
0005: istore_3                 // {this, int, int, int} | {}
0006: iconst_2                 // {this, int, int, int} | {int}
0007: istore          4        // {this, int, int, int, int} | {}
0009: iconst_3                 // {this, int, int, int, int} | {int}
0010: istore          5        // {this, int, int, int, int, int} | {}
0012: iconst_4                 // {this, int, int, int, int, int} | {int}
0013: istore          6        // {this, int, int, int, int, int, int} | {}
0015: iconst_5                 // {this, int, int, int, int, int, int} | {int}
0016: istore          7        // {this, int, int, int, int, int, int, int} | {}
0018: return                   // {} | {}
```

从 JVM 规范的角度来看，Operand Stack 的变化如下：

```text
... →

..., <i>
```

Push the `int` constant `<i>` (-1, 0, 1, 2, 3, 4 or 5) onto the operand stack.

### bipush: -128~127

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int int_m128 = -128;
        int int_127 = 127;
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
       0: bipush        -128
       2: istore_1
       3: bipush        127
       5: istore_2
       6: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitIntInsn(BIPUSH, -128);
methodVisitor.visitVarInsn(ISTORE, 1);
methodVisitor.visitIntInsn(BIPUSH, 127);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 3);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: bipush          -128     // {this} | {int}
0002: istore_1                 // {this, int} | {}
0003: bipush          127      // {this, int} | {int}
0005: istore_2                 // {this, int, int} | {}
0006: return                   // {} | {}
```

从 JVM 规范的角度来看，Operand Stack 的变化如下：

```text
... →

..., value
```

The immediate byte is sign-extended to an `int` value. That `value` is pushed onto the operand stack.

Format

```text
bipush
byte
```

### sipush: -32768~32767

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int int_m32768 = -32768;
        int int_32767 = 32767;
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
       0: sipush        -32768
       3: istore_1
       4: sipush        32767
       7: istore_2
       8: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitIntInsn(SIPUSH, -32768);
methodVisitor.visitVarInsn(ISTORE, 1);
methodVisitor.visitIntInsn(SIPUSH, 32767);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 3);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: sipush          -32768   // {this} | {int}
0003: istore_1                 // {this, int} | {}
0004: sipush          32767    // {this, int} | {int}
0007: istore_2                 // {this, int, int} | {}
0008: return                   // {} | {}
```

从 JVM 规范的角度来看，Operand Stack 的变化如下：

```text
... →

..., value
```

Format

```text
sipush
byte1
byte2
```

The immediate unsigned `byte1` and `byte2` values are assembled into an intermediate `short`, where the `value` of the `short` is `(byte1 << 8) | byte2`. The intermediate `value` is then sign-extended to an `int` value. That `value` is pushed onto the operand stack.

### ldc: MIN~MAX

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int int_min = Integer.MIN_VALUE;
        int int_max = Integer.MAX_VALUE;
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
       0: ldc           #3                  // int -2147483648
       2: istore_1
       3: ldc           #4                  // int 2147483647
       5: istore_2
       6: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitLdcInsn(new Integer(-2147483648));
methodVisitor.visitVarInsn(ISTORE, 1);
methodVisitor.visitLdcInsn(new Integer(2147483647));
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 3);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: ldc             #3       // {this} | {int}
0002: istore_1                 // {this, int} | {}
0003: ldc             #4       // {this, int} | {int}
0005: istore_2                 // {this, int, int} | {}
0006: return                   // {} | {}
```

从 JVM 规范的角度来看，Operand Stack 的变化如下：

```text
... →

..., value
```

Format

```text
ldc
index
```

The `index` is an unsigned byte that must be a valid index into the run-time constant pool of the current class.
The run-time constant pool entry at `index` either must be a run-time constant of type `int` or `float`,
or **a reference to a string literal**, or **a symbolic reference to a class, method type, or method handle**.

## long

### `lconst_<l>`: 0~1

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        long long_0 = 0;
        long long_1 = 1;
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
       2: lconst_1
       3: lstore_3
       4: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(LCONST_0);
methodVisitor.visitVarInsn(LSTORE, 1);
methodVisitor.visitInsn(LCONST_1);
methodVisitor.visitVarInsn(LSTORE, 3);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 5);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: lconst_0                 // {this} | {long, top}
0001: lstore_1                 // {this, long, top} | {}
0002: lconst_1                 // {this, long, top} | {long, top}
0003: lstore_3                 // {this, long, top, long, top} | {}
0004: return                   // {} | {}
```

从 JVM 规范的角度来看，Operand Stack 的变化如下：

```text
... →

..., <l>
```

Push the `long` constant `<l>` (0 or 1) onto the operand stack.

### ldc2_w: MIN~MAX

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        long long_min = Long.MIN_VALUE;
        long long_max = Long.MAX_VALUE;
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
       0: ldc2_w        #3                  // long -9223372036854775808l
       3: lstore_1
       4: ldc2_w        #5                  // long 9223372036854775807l
       7: lstore_3
       8: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitLdcInsn(new Long(-9223372036854775808L));
methodVisitor.visitVarInsn(LSTORE, 1);
methodVisitor.visitLdcInsn(new Long(9223372036854775807L));
methodVisitor.visitVarInsn(LSTORE, 3);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 5);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: ldc2_w          #3       // {this} | {long, top}
0003: lstore_1                 // {this, long, top} | {}
0004: ldc2_w          #5       // {this, long, top} | {long, top}
0007: lstore_3                 // {this, long, top, long, top} | {}
0008: return                   // {} | {}
```

从 JVM 规范的角度来看，Operand Stack 的变化如下：

```text
... →

..., value
```

The numeric `value` of that run-time constant is pushed onto the operand stack as a `long` or `double`, respectively.

Format

```text
ldc2_w
indexbyte1
indexbyte2
```

The unsigned `indexbyte1` and `indexbyte2` are assembled into an unsigned 16-bit `index`
into the run-time constant pool of the current class,
where the value of the `index` is calculated as `(indexbyte1 << 8) | indexbyte2`.
The `index` must be a valid index into the run-time constant pool of the current class.

## float

### `fconst_<f>`: 0~2

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        float float_0 = 0;
        float float_1 = 1;
        float float_2 = 2;
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
       0: fconst_0
       1: fstore_1
       2: fconst_1
       3: fstore_2
       4: fconst_2
       5: fstore_3
       6: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(FCONST_0);
methodVisitor.visitVarInsn(FSTORE, 1);
methodVisitor.visitInsn(FCONST_1);
methodVisitor.visitVarInsn(FSTORE, 2);
methodVisitor.visitInsn(FCONST_2);
methodVisitor.visitVarInsn(FSTORE, 3);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 4);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: fconst_0                 // {this} | {float}
0001: fstore_1                 // {this, float} | {}
0002: fconst_1                 // {this, float} | {float}
0003: fstore_2                 // {this, float, float} | {}
0004: fconst_2                 // {this, float, float} | {float}
0005: fstore_3                 // {this, float, float, float} | {}
0006: return                   // {} | {}
```

从 JVM 规范的角度来看，Operand Stack 的变化如下：

```text
... →

..., <f>
```

Push the `float` constant `<f>` (0.0, 1.0, or 2.0) onto the operand stack.

### ldc: MIN~MAX

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        float float_min = Float.MIN_VALUE;
        float float_max = Float.MAX_VALUE;
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
       0: ldc           #3                  // float 1.4E-45f
       2: fstore_1
       3: ldc           #4                  // float 3.4028235E38f
       5: fstore_2
       6: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitLdcInsn(new Float("1.4E-45"));
methodVisitor.visitVarInsn(FSTORE, 1);
methodVisitor.visitLdcInsn(new Float("3.4028235E38"));
methodVisitor.visitVarInsn(FSTORE, 2);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 3);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: ldc             #3       // {this} | {float}
0002: fstore_1                 // {this, float} | {}
0003: ldc             #4       // {this, float} | {float}
0005: fstore_2                 // {this, float, float} | {}
0006: return                   // {} | {}
```

从 JVM 规范的角度来看，Operand Stack 的变化如下：

```text
... →

..., value
```

Format

```text
ldc
index
```

The `index` is an unsigned byte that must be a valid index
into the run-time constant pool of the current class.
The run-time constant pool entry at `index` either must be a run-time constant of type `int` or `float`,
or **a reference to a string literal**, or **a symbolic reference to a class, method type, or method handle**.

## double

### `dconst_<d>`: 0~1

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        double double_0 = 0;
        double double_1 = 1;
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
       0: dconst_0
       1: dstore_1
       2: dconst_1
       3: dstore_3
       4: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(DCONST_0);
methodVisitor.visitVarInsn(DSTORE, 1);
methodVisitor.visitInsn(DCONST_1);
methodVisitor.visitVarInsn(DSTORE, 3);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 5);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: dconst_0                 // {this} | {double, top}
0001: dstore_1                 // {this, double, top} | {}
0002: dconst_1                 // {this, double, top} | {double, top}
0003: dstore_3                 // {this, double, top, double, top} | {}
0004: return                   // {} | {}
```

从 JVM 规范的角度来看，Operand Stack 的变化如下：

```text
... →

..., <d>
```

Push the `double` constant `<d>` (0.0 or 1.0) onto the operand stack.

### ldc2_w: MIN~MAX

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        double double_min = Double.MIN_VALUE;
        double double_max = Double.MAX_VALUE;
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
       0: ldc2_w        #3                  // double 4.9E-324d
       3: dstore_1
       4: ldc2_w        #5                  // double 1.7976931348623157E308d
       7: dstore_3
       8: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitLdcInsn(new Double("4.9E-324"));
methodVisitor.visitVarInsn(DSTORE, 1);
methodVisitor.visitLdcInsn(new Double("1.7976931348623157E308"));
methodVisitor.visitVarInsn(DSTORE, 3);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 5);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: ldc2_w          #3       // {this} | {double, top}
0003: dstore_1                 // {this, double, top} | {}
0004: ldc2_w          #5       // {this, double, top} | {double, top}
0007: dstore_3                 // {this, double, top, double, top} | {}
0008: return                   // {} | {}
```

从 JVM 规范的角度来看，Operand Stack 的变化如下：

```text
... →

..., value
```

The numeric `value` of that run-time constant is pushed onto the operand stack as a `long` or `double`, respectively.

## reference type

### null: aconst_null

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        Object obj_null = null;
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
       0: aconst_null
       1: astore_1
       2: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ACONST_NULL);
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 2);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: aconst_null              // {this} | {null}
0001: astore_1                 // {this, null} | {}
0002: return                   // {} | {}
```

从 JVM 规范的角度来看，Operand Stack 的变化如下：

```text
... →

..., null
```

Push the `null` object reference onto the operand stack.

### String: ldc

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        String str = "GoodChild";
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
       0: ldc           #2                  // String GoodChild
       2: astore_1
       3: return
}

```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitLdcInsn("GoodChild");
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 2);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: ldc             #2       // {this} | {String}
0002: astore_1                 // {this, String} | {}
0003: return                   // {} | {}
```

从 JVM 规范的角度来看，Operand Stack 的变化如下：

```text
... →

..., value
```

Format

```text
ldc
index
```

The `index` is an unsigned byte that must be a valid index
into the run-time constant pool of the current class.
The run-time constant pool entry at `index` either must be a run-time constant of type `int` or `float`,
or **a reference to a string literal**, or **a symbolic reference to a class, method type, or method handle**.

### `Class<?>`: ldc

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        Class<?> clazz = HelloWorld.class;
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
       0: ldc           #2                  // class sample/HelloWorld
       2: astore_1
       3: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitLdcInsn(Type.getType("Lsample/HelloWorld;"));
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 2);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: ldc             #2       // {this} | {Class}
0002: astore_1                 // {this, Class} | {}
0003: return                   // {} | {}
```

从 JVM 规范的角度来看，Operand Stack 的变化如下：

```text
... →

..., value
```

Format

```text
ldc
index
```

The `index` is an unsigned byte that must be a valid index
into the run-time constant pool of the current class.
The run-time constant pool entry at `index` either must be a run-time constant of type `int` or `float`,
or **a reference to a string literal**, or **a symbolic reference to a class, method type, or method handle**.

## ldc and ldc_w

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    private String str001 = "str001";
    // ... ... 省略 255 个
    private String str257 = "str257";

    public void test() {
        String str = "str258";
    }

    public static void main(String[] args) {
        String format = "private String str%03d = \"str%03d\";";
        for (int i = 1; i < 258; i++) {
            String line = String.format(format, i, i);
            System.out.println(line);
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
  public void test();
    Code:
       0: ldc_w         #516                // String str258
       3: astore_1
       4: return
...
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitLdcInsn("str258");
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 2);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: ldc_w           #516     // {this} | {String}
0003: astore_1                 // {this, String} | {}
0004: return                   // {} | {}
```

从 JVM 规范的角度来看，Operand Stack 的变化如下：

```text
... →

..., value
```

Format

```text
ldc_w
indexbyte1
indexbyte2
```

The unsigned `indexbyte1` and `indexbyte2` are assembled into an unsigned 16-bit index
into the run-time constant pool of the current class,
where the value of the `index` is calculated as `(indexbyte1 << 8) | indexbyte2`.
The index must be a valid index into the run-time constant pool of the current class.
The run-time constant pool entry at the index either must be a run-time constant of type `int` or `float`,
or **a reference to a string literal**, or **a symbolic reference to a class, method type, or method handle**.
