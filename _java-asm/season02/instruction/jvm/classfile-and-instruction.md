---
title: "ClassFile 和 Instruction"
sequence: "102"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## ClassFile 对方法的约束

从 ClassFile 的角度来说，它对于方法接收的参数数量、方法体的大小做了约束。

### 方法参数的数量（255）

在一个方法当中，方法接收的参数最多有 255 个。我们分成三种情况来进行说明：

- 第一种情况，对于 non-static 方法来说，`this` 也要占用 1 个参数位置，因此接收的参数最多有 254 个参数。
- 第二种情况，对于 static 方法来说，不需要存储 `this` 变量，因此接收的参数最多有 255 个参数。
- 第三种情况，不管是 non-static 方法，还是 static 方法，`long` 类型或 `double` 类型占据 2 个参数位置，所以实际的参数数量要小于 255。

```java
public class HelloWorld {
    public void test(int a, int b) {
        // do nothing
    }

    public static void main(String[] args) {
        for (int i = 1; i <= 255; i++) {
            String item = String.format("int val%d,", i);
            System.out.println(item);
        }
    }
}
```

- 问题：能否在文档中找到依据呢？
- 回答：能。

在[Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)的[4.11. Limitations of the Java Virtual Machine](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.11)部分对方法参数的数量进行了限制：

The number of method parameters is limited to **255** by the definition of a method descriptor, where the limit includes one unit for `this` in the case of instance or interface method invocations.

### 方法体的大小（65535）

对于方法来说，方法体并不是想写多少代码就写多少代码，它的大小也有一个限制：方法体内最多包含 65535 个字节。

当方法体的代码超过 65535 字节（bytes）时，会出现编译错误：code too large。

- 问题：能否在文档中找到依据呢？
- 回答：能。

在[Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)的[4.7.3. The Code Attribute](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.7.3)部分定义了 `Code` 属性：

```text
Code_attribute {
    u2 attribute_name_index;
    u4 attribute_length;
    u2 max_stack;
    u2 max_locals;
    u4 code_length;
    u1 code[code_length];
    u2 exception_table_length;
    {   u2 start_pc;
        u2 end_pc;
        u2 handler_pc;
        u2 catch_type;
    } exception_table[exception_table_length];
    u2 attributes_count;
    attribute_info attributes[attributes_count];
}
```

- `code_length`: The value of the `code_length` item gives the number of bytes in the `code` array for this method. The value of `code_length` must be greater than **zero** (as the `code` array must not be empty) and less than **65536**.

## Instruction VS. Opcode

严格的来说，instruction 和 opcode 这两个概念是有区别的。
相对来说，instruction 是一个比较大的概念，而 opcode 是一个比较小的概念：

```text
instruction = opcode + operands
```

- 问题：能否在文档中找到依据呢？
- 回答：能。

A Java Virtual Machine **instruction** consists of a one-byte **opcode** specifying the operation to be performed,
followed by zero or more **operands** supplying arguments or data that are used by the operation.
**Many instructions have no operands and consist only of an opcode.**
（本段内容来自于[2.11. Instruction Set Summary](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.11)的第一段）

粗略的来说，在现实生活当中谈论技术问题，我们经常混用 instruction 和 opcode 这两个概念，不作区分，可以将两者当成一回事儿。

## Opcodes

### 一个字节的容量（256）

opcode 占用空间的大小为 1 byte。在 1 byte 中，包含 8 个 bit，因此 1 byte 最多可以表示 256 个值（即 0~255）。

### opcode 的数量（205）

虽然一个字节（byte)当中可以存储 256 个值（即 0~255），但是在 Java 8 这个版本中定义的 opcode 数量只有 205 个。
因此，opcode 的内容就是一个“数值”，位于 0~255 之间。

### opcode 和 mnemonic symbol

要记住每个 opcode 对应数值的含义，是非常困难的。
为了方便人们记忆 opcode 的作用，就给每个 opcode 起了一个名字，叫作 mnemonic symbol（助记符号）。



| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|--------|-----------------|
| 0      | nop             | 64     | lstore_1        | 128    | ior             | 192    | checkcast       |
| 1      | aconst_null     | 65     | lstore_2        | 129    | lor             | 193    | instanceof      |
| 2      | iconst_m1       | 66     | lstore_3        | 130    | ixor            | 194    | monitorenter    |
| 3      | iconst_0        | 67     | fstore_0        | 131    | lxor            | 195    | monitorexit     |
| 4      | iconst_1        | 68     | fstore_1        | 132    | iinc            | 196    | wide            |
| 5      | iconst_2        | 69     | fstore_2        | 133    | i2l             | 197    | multianewarray  |
| 6      | iconst_3        | 70     | fstore_3        | 134    | i2f             | 198    | ifnull          |
| 7      | iconst_4        | 71     | dstore_0        | 135    | i2d             | 199    | ifnonnull       |
| 8      | iconst_5        | 72     | dstore_1        | 136    | l2i             | 200    | goto_w          |
| 9      | lconst_0        | 73     | dstore_2        | 137    | l2f             | 201    | jsr_w           |
| 10     | lconst_1        | 74     | dstore_3        | 138    | l2d             | 202    | breakpoint      |
| 11     | fconst_0        | 75     | astore_0        | 139    | f2i             | 203    |                 |
| 12     | fconst_1        | 76     | astore_1        | 140    | f2l             | 204    |                 |
| 13     | fconst_2        | 77     | astore_2        | 141    | f2d             | 205    |                 |
| 14     | dconst_0        | 78     | astore_3        | 142    | d2i             | 206    |                 |
| 15     | dconst_1        | 79     | iastore         | 143    | d2l             | 207    |                 |
| 16     | bipush          | 80     | lastore         | 144    | d2f             | 208    |                 |
| 17     | sipush          | 81     | fastore         | 145    | i2b             | 209    |                 |
| 18     | ldc             | 82     | dastore         | 146    | i2c             | 210    |                 |
| 19     | ldc_w           | 83     | aastore         | 147    | i2s             | 211    |                 |
| 20     | ldc2_w          | 84     | bastore         | 148    | lcmp            | 212    |                 |
| 21     | iload           | 85     | castore         | 149    | fcmpl           | 213    |                 |
| 22     | lload           | 86     | sastore         | 150    | fcmpg           | 214    |                 |
| 23     | fload           | 87     | pop             | 151    | dcmpl           | 215    |                 |
| 24     | dload           | 88     | pop2            | 152    | dcmpg           | 216    |                 |
| 25     | aload           | 89     | dup             | 153    | ifeq            | 217    |                 |
| 26     | iload_0         | 90     | dup_x1          | 154    | ifne            | 218    |                 |
| 27     | iload_1         | 91     | dup_x2          | 155    | iflt            | 219    |                 |
| 28     | iload_2         | 92     | dup2            | 156    | ifge            | 220    |                 |
| 29     | iload_3         | 93     | dup2_x1         | 157    | ifgt            | 221    |                 |
| 30     | lload_0         | 94     | dup2_x2         | 158    | ifle            | 222    |                 |
| 31     | lload_1         | 95     | swap            | 159    | if_icmpeq       | 223    |                 |
| 32     | lload_2         | 96     | iadd            | 160    | if_icmpne       | 224    |                 |
| 33     | lload_3         | 97     | ladd            | 161    | if_icmplt       | 225    |                 |
| 34     | fload_0         | 98     | fadd            | 162    | if_icmpge       | 226    |                 |
| 35     | fload_1         | 99     | dadd            | 163    | if_icmpgt       | 227    |                 |
| 36     | fload_2         | 100    | isub            | 164    | if_icmple       | 228    |                 |
| 37     | fload_3         | 101    | lsub            | 165    | if_acmpeq       | 229    |                 |
| 38     | dload_0         | 102    | fsub            | 166    | if_acmpne       | 230    |                 |
| 39     | dload_1         | 103    | dsub            | 167    | goto            | 231    |                 |
| 40     | dload_2         | 104    | imul            | 168    | jsr             | 232    |                 |
| 41     | dload_3         | 105    | lmul            | 169    | ret             | 233    |                 |
| 42     | aload_0         | 106    | fmul            | 170    | tableswitch     | 234    |                 |
| 43     | aload_1         | 107    | dmul            | 171    | lookupswitch    | 235    |                 |
| 44     | aload_2         | 108    | idiv            | 172    | ireturn         | 236    |                 |
| 45     | aload_3         | 109    | ldiv            | 173    | lreturn         | 237    |                 |
| 46     | iaload          | 110    | fdiv            | 174    | freturn         | 238    |                 |
| 47     | laload          | 111    | ddiv            | 175    | dreturn         | 239    |                 |
| 48     | faload          | 112    | irem            | 176    | areturn         | 240    |                 |
| 49     | daload          | 113    | lrem            | 177    | return          | 241    |                 |
| 50     | aaload          | 114    | frem            | 178    | getstatic       | 242    |                 |
| 51     | baload          | 115    | drem            | 179    | putstatic       | 243    |                 |
| 52     | caload          | 116    | ineg            | 180    | getfield        | 244    |                 |
| 53     | saload          | 117    | lneg            | 181    | putfield        | 245    |                 |
| 54     | istore          | 118    | fneg            | 182    | invokevirtual   | 246    |                 |
| 55     | lstore          | 119    | dneg            | 183    | invokespecial   | 247    |                 |
| 56     | fstore          | 120    | ishl            | 184    | invokestatic    | 248    |                 |
| 57     | dstore          | 121    | lshl            | 185    | invokeinterface | 249    |                 |
| 58     | astore          | 122    | ishr            | 186    | invokedynamic   | 250    |                 |
| 59     | istore_0        | 123    | lshr            | 187    | new             | 251    |                 |
| 60     | istore_1        | 124    | iushr           | 188    | newarray        | 252    |                 |
| 61     | istore_2        | 125    | lushr           | 189    | anewarray       | 253    |                 |
| 62     | istore_3        | 126    | iand            | 190    | arraylength     | 254    | impdep1         |
| 63     | lstore_0        | 127    | land            | 191    | athrow          | 255    | impdep2         |

在上面表格当中，大家如果对任何一个 opcode 或 mnemonic symbol 感兴趣，
都可以参阅[Chapter 6. The Java Virtual Machine Instruction Set](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html)。

### mnemonic symbol 和类型信息

对于大多数的 opcode，它的 mnemonic symbol 名字当中带有类型信息（type information）。
一般情况下，规律如下：

- `i` 表示 `int` 类型
- `l` 表示 `long` 类型。
- `s` 表示 `short` 类型
- `b` 表示 `byte` 类型
- `c` 表示 `char` 类型
- `f` 表示 `float` 类型
- `d` 表示 `double` 类型。
- `a` 表示 `reference` 类型。`a` 可能是 address 的首字母，表示指向内存空间的一个地址信息。

有一些 opcode，它的 mnemonic symbol 名字不带有类型信息（type information），但是可以操作多种类型的数据，例如：

- `arraylength`，无论是 `int[]` 类型的数组，还是 `String[]` 类型的数组，获取数组的长度都是使用 `arraylength`。
- `ldc`、`ldc_w` 和 `ldc2_w` 表示**l**oa**d** **c**onstant 的缩写，可以加载各种常量值。
- 与 stack 相关的指令，可以操作多种数据类型。`pop` 表示出栈操作，`dup` 相关的指令是 duplicate 单词的缩写，表示“复制”操作；`swap` 表示“交换”。

还有一些 opcode，它的 mnemonic symbol 名字不带有类型信息（type information），它也不处理任何类型的数据。例如：

- `goto`

- 问题：能否在文档中找到依据呢？
- 回答：能。

For the majority of **typed instructions**,
the instruction type is represented explicitly in the opcode mnemonic by a letter:
`i` for an `int` operation, `l` for long, `s` for `short`, `b` for `byte`, `c` for `char`,
`f` for `float`, `d` for `double`, and `a` for `reference`.
Some instructions for which **the type is unambiguous** do not have a type letter in their mnemonic.
For instance, `arraylength` always operates on an object that is an array.
Some instructions, such as `goto`, an unconditional control transfer, **do not operate on typed operands.**
（本段内容来自于[2.11.1. Types and the Java Virtual Machine](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.11.1)的第二段）

## Opcode 学习方式

学习新事物，一般有两种学习体验：

- 第一种，经过短期刻苦努力，然后突然明白一个知识点，给人一种如获至宝的感觉。
- 第二种，经过长期坚持探索，大的知识点要学习，小的知识点也不舍弃，慢慢积累，最后达到水滴石穿的效果。

学习这些 opcode，也是一个缓慢的过程，就是平时一点一点的学习、慢慢积累的过程。

推荐的学习方式：

- 第一步，打好基础。例如，Stack Frame 的结构、进入方法时的 Stack Frame 的初始状态、long 和 double 类型的占用空间的大小等。
- 第二步，以“使用”为导向，有选择性的、跳跃式的学习。当用到这个 opcode 了，如果不了解它，那我们再去学习它；不要一味贪多，想全部学下来。

在后续内容当中，我们会将 205 个 opcode 分成不同的类别进行介绍，大家根据自己的兴趣有选择性的学习就可以了。

## 总结

本文内容总结如下：

- 第一点，在 ClassFile 结构中，对于方法接收的参数和方法体的大小是有数量限制的。
- 第二点，instruction = opcode + operands
- 第三点，opcode 占用 1 个 byte 大小，目前定义了 205 个；为了方便记忆，JVM 文档为 opcode 提供了名字（即 mnemonic symbol），大多数的名字中带有类型信息。
- 第四点，学习 opcode 是一个长期积累的过程，不能一蹴而就。所以，推荐大家依据感兴趣的内容，进行有选择性的学习。
