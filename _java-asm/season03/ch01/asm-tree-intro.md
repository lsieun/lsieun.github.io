---
title: "Tree API介绍"
sequence: "101"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## ASM的两个组成部分

从组成结构上来说，ASM分成两部分，一部分为Core API，另一部分为Tree API。

- 其中，Core API包括`asm.jar`、`asm-util.jar`和`asm-commons.jar`；
- 其中，Tree API包括`asm-tree.jar`和`asm-analysis.jar`。

![ASM Components](/assets/images/java/asm/asm-components.png)

从两者的关系来说，Core API是基础，而Tree API是在Core API的这个基础上构建起来的。

## Tree API概览

### asm-tree.jar

在`asm-tree.jar`(9.0版本)当中，一共包含了36个类，我们会涉及到其中的20个类，这20个类就构成`asm-tree.jar`主体部分。

在`asm-tree.jar`当中，这20个类具体内容如下：

- ClassNode
- FieldNode
- MethodNode
- InsnList
- AbstractInsnNode
  - FieldInsnNode
  - IincInsnNode
  - InsnNode
  - IntInsnNode
  - InvokeDynamicInsnNode
  - JumpInsnNode
  - LabelNode
  - LdcInsnNode
  - LookupSwitchInsnNode
  - MethodInsnNode
  - MultiANewArrayInsnNode
  - TableSwitchInsnNode
  - TypeInsnNode
  - VarInsnNode
- TryCatchBlockNode

为了方便于理解，我们可以将这些类按“包含”关系组织起来：

- ClassNode（类）
  - FieldNode（字段）
  - MethodNode（方法）
    - InsnList（有序的指令集合）
      - AbstractInsnNode（单条指令）
    - TryCatchBlockNode（异常处理）

```text
             ┌─── FieldNode
             │
             │
             │                                                                     ┌─── FieldInsnNode
             │                                                                     │
             │                                                                     ├─── IincInsnNode
             │                                                                     │
             │                                                                     ├─── InsnNode
             │                                                                     │
             │                                                                     ├─── IntInsnNode
             │                                                                     │
             │                                                                     ├─── InvokeDynamicInsnNode
ClassNode ───┤                                                                     │
             │                                                                     ├─── JumpInsnNode
             │                                                                     │
             │                                                                     ├─── LabelNode
             │                  ┌─── InsnList ────────────┼─── AbstractInsnNode ───┤
             │                  │                                                  ├─── LdcInsnNode
             │                  │                                                  │
             │                  │                                                  ├─── LookupSwitchInsnNode
             │                  │                                                  │
             │                  │                                                  ├─── MethodInsnNode
             │                  │                                                  │
             │                  │                                                  ├─── MultiANewArrayInsnNode
             └─── MethodNode ───┤                                                  │
                                │                                                  ├─── TableSwitchInsnNode
                                │                                                  │
                                │                                                  ├─── TypeInsnNode
                                │                                                  │
                                │                                                  └─── VarInsnNode
                                │
                                │
                                └─── TryCatchBlockNode
```

我们可以用文字来描述它们之间的关系：

- 第一点，类（`ClassNode`）包含字段（`FieldNode`）和方法（`MethodNode`）。
- 第二点，方法（`MethodNode`）包含有序的指令集合（`InsnList`）和异常处理（`TryCatchBlockNode`）。
- 第三点，有序的指令集合（`InsnList`）由多个单条指令（`AbstractInsnNode`）组合而成。

### asm-analysis.jar

在`asm-analysis.jar`(9.0版本)当中，一共包含了13个类，我们会涉及到其中的10个类：

- Analyzer
- BasicInterpreter
- BasicValue
- BasicVerifier
- Frame
- Interpreter
- SimpleVerifier
- SourceInterpreter
- SourceValue
- Value

同样，为了方便于理解，我们也可以将这些类按“包含”关系组织起来：

- Analyzer
  - Frame
  - Interpreter + Value
    - BasicInterpreter + BasicValue
    - BasicVerifier + BasicValue
    - SimpleVerifier + BasicValue
    - SourceInterpreter + SourceValue

接着，我们用文字来描述它们之间的关系：

- 第一点，`Analyzer`是一个“胶水”，它起到一个粘合的作用，它就是将`Frame`（不变的部分）和`Interpreter`（变化的部分）组织到了一起。`Frame`类表示的就是一种不变的规则，就类似于现实世界的物理规则；而`Interpreter`类则是在这个规则基础上衍生的变化，就比如说能否造出一个圆珠笔，能否造出一个火箭飞上天空。
- 第二点，`Frame`类并不是绝对的“不变”，它本身也包含“不变”和“变化”的部分。其中，“不变”的部分就是指`Frame.execute()`方法，它就是模拟opcode在执行过程中，对于local variable和operand stack的影响，这是[JVM文档](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html)所规定的内容；而“变化”的部分就是指`Frame`类的`V[] values`字段，它需要记录每一个opcode执行前、后的具体值是什么。
- 第三点，`Interpreter`类就是体现“个人创造力”的一个类。比如说，同样是受这个现实物理世界规则的约束，在不同的历史阶段过程中，有人发明了风筝（纸鸢），有人发明了烟花，有人发明了滑翔机，有人发明了喷气式飞机，有人发明了宇宙飞船。同样，我们可以实现具体的`Interpreter`子类来完成特定的功能，那么到底能够达到一种什么样的效果，还是会取决于我们自身的“创造力”。

另外，我们也不会涉及`Subroutine`类。因为`Subroutine`类对应于`jsr`这条指令，而`jsr`指令是处于“以前确实有用，现在已经过时”的状态。

## 总结

本文内容总结如下：

- 第一点，ASM由Core API和Tree API两部分组成。当然，在这个系列当中，我们的关注点是Tree API。
- 第二点，对Tree API的内容进行概览。这里也不并要求大家记忆什么内容，只是让大家有一个初步的印象。
