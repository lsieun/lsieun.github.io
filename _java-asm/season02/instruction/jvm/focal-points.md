---
title: "课程研究主题"
sequence: "101"
---


[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})


《Java ASM 系列二：OPCODE》的研究主题是围绕着三个事物来展开：

- instruction
- `MethodVisitor.visitXxxInsn()` 方法
- Stack Frame

那么，这三个事物之间是有什么样的关系呢？
详细的来说，instruction、`MethodVisitor.visitXxxInsn()` 方法和 Stack Frame 三个事物之间有内在的关联关系：

- 从一个具体 `.class` 文件的视角来说，它定义的每一个方法当中都包含实现代码逻辑的 instruction 内容。
- 从 ASM 的视角来说，ASM 可以通过 Class Generation 或 Class Transformation 操作来生成一个具体的 `.class` 文件；
  那么，对于方法当中的 instruction 内容，应该使用哪些 `MethodVisitor.visitXxxInsn()` 方法来生成呢？
- 从 JVM 的视角来说，一个具体的 `.class` 文件需要加载到 JVM 当中来运行；
  在方法的运行过程当中，每一条 instruction 的执行，会对 Stack Frame 有哪些影响呢？

![instruction-visitXxxInsn-StackFrame](/assets/images/java/asm/instruction-visitxxxinsn-stack-frame.png)

在[The Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)中，它对于具体 `.class` 文件提供了[ClassFile](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html)结构的支持，对于 JVM Execution Engine 提供了[Instruction Set](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html)的支持。在以后的学习当中，我们需要经常参照[Instruction Set](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html)部分的内容。

