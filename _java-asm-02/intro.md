---
title:  "Intro"
sequence: "101"
---

200个opcode，对应的参数operand

15个visitXxxInsn()方法

opcode对应的frame的变化。

Instruction = opcode + operand

四个数据区域：local variables、operand stack、runtime constant pool、instruction list (opcode + operand)


operand stack类似于“工作场所”，local variables类似于“临时休息区”，

五个视角：

- Java语言的视角，就是`sample.HelloWorld`里的代码怎么编写
- Instruction的视角，就是`javap -c sample.HelloWorld`，这里给出的就是标准的opcode内容
- ASM的视角，就是编写ASM代码实现某种功能，这里主要是对`visitXxxInsn()`方法的调用，与实际的opcode可能相同，也可能有差异。
- Frame的视角，就是JVM内存空间的视角，就是local variable和operand stack的变化。
- JVM Specification的视角，参考JVM文档，它是怎么说的

`MethodVisitor`类的`visitXxx()`方法要遵循一定的调用顺序：

```text
[
    visitCode
    (
        visitFrame |
        visitXxxInsn |
        visitLabel |
        visitTryCatchBlock
    )*
    visitMaxs
]
visitEnd
```

这些方法的调用顺序，可以记忆如下：

- 第一步，调用`visitCode()`方法，调用一次。
- 第二步，调用`visitXxxInsn()`方法，可以调用多次。对这些方法的调用，就是在构建方法的“方法体”。
- 第三步，调用`visitMaxs()`方法，调用一次。
- 第四步，调用`visitEnd()`方法，调用一次。

这第二个系列就是一个“胶水”，将不同的部分粘贴到一起。

这200个opcode的学习，没有那种“经过长期努力，而后突然明白一个知识点，给人一种如获至宝的感觉”，它就是一个一个的学习，慢慢积累，学以致用。

| Actual type | Computational type | Category |
|-------------|--------------------|----------|
| boolean     | int                | 1        |
| byte        | int                | 1        |
| char        | int                | 1        |
| short       | int                | 1        |
| int         | int                | 1        |
| float       | int                | 1        |
| reference   | reference          | 1        |
| long        | long               | 2        |
| double      | double             | 2        |

方法最多有多少个参数，大概是255个。

在[Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)的[4.11. Limitations of the Java Virtual Machine](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.11)部分对方法参数的数量进行了限制：

The number of method parameters is limited to **255** by the definition of a method descriptor, where the limit includes one unit for `this` in the case of instance or interface method invocations.

在[Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)的[4.7.3. The Code Attribute](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.7.3)部分定义了`Code`属性：

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

当方法体的代码超过65535字节（bytes）时，会出现编译错误：code too large。

## 学习方式

有选择性的、跳跃式的学习。

哪一个不太了解，你就去学习它。

我讲的时候，不能凭着自己的兴趣讲哪一个或哪几个，我要把它都列出来。
