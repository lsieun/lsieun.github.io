---
title:  "课程研究主题"
sequence: "101"
---


[上级目录]({% link _posts/2021-04-29-java-asm-season-02.md %})


《Java ASM系列二：OPCODE》的研究主题是围绕着三个事物来展开：

- instruction
- `MethodVisitor.visitXxxInsn()`方法
- Stack Frame

那么，这三个事物之间是有什么样的关系呢？详细的来说，instruction、`MethodVisitor.visitXxxInsn()`方法和Stack Frame三个事物之间有内在的关联关系：

- 从一个具体`.class`文件的视角来说，它定义的每一个方法当中都包含实现代码逻辑的instruction内容。
- 从ASM的视角来说，ASM可以通过Class Generation或Class Transformation操作来生成一个具体的`.class`文件；那么，对于方法当中的instruction内容，应该使用哪些`MethodVisitor.visitXxxInsn()`方法来生成呢？
- 从JVM的视角来说，一个具体的`.class`文件需要加载到JVM当中来运行；在方法的运行过程当中，每一条instruction的执行，会对Stack Frame有哪些影响呢？

{:refdef: style="text-align: center;"}
![instruction-visitXxxInsn-StackFrame](/assets/images/java/asm/instruction-visitxxxinsn-stack-frame.png)
{: refdef}

在[The Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)中，它对于具体`.class`文件提供了[ClassFile](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html)结构的支持，对于JVM Execution Engine提供了[Instruction Set](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html)的支持。在以后的学习当中，我们需要经常参照[Instruction Set](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html)部分的内容。

