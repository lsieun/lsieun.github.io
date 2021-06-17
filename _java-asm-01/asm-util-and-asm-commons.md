---
title:  "asm-util和asm-commons"
sequence: "401"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

## asm-util

在`asm-util.jar`当中，主要介绍`CheckClassAdapter`和`TraceClassVisitor`类。在`TraceClassVisitor`类当中，会涉及到`Printer`、`ASMifier`和`Textifier`类。

{:refdef: style="text-align: center;"}
![](/assets/images/java/asm/asm-util-package.png)
{: refdef}

- 其中，`CheckClassAdapter`类，主要负责检查（Check）生成的`.class`文件内容是否正确。
- 其中，`TraceClassVisitor`类，主要负责将`.class`文件的内容打印成文字输出。根据输出的文字信息，可以探索或追踪（Trace）`.class`文件的内部信息。

## asm-commons

在`asm-commons.jar`当中，包含的类可以分成两组，一组是`ClassVisitor`的子类，另一组是`MethodVisitor`的子类。

- 其中，`ClassVisitor`的子类有`ClassRemapper`、`StaticInitMerger`和`SerialVersionUIDAdder`类；
- 其中，`MethodVisitor`的子类有`LocalVariablesSorter`、`GeneratorAdapter`、`AdviceAdapter`、`AnalyzerAdapter`和`InstructionAdapter`类。

{:refdef: style="text-align: center;"}
![](/assets/images/java/asm/asm-commons-package.png)
{: refdef}

那么，**asm-util.jar**与**asm-commons.jar**有什么区别呢？在`asm-util.jar`里，它提供的是通用性的功能，没有特别明确的应用场景；而在`asm-commons.jar`里，它提供的功能，都是为解决某一种特定场景中出现的问题而提出的解决思路。

## 总结

本文对`asm-util.jar`和`asm-commons.jar`进行介绍，内容总结如下：

- 第一点，在`asm-util.jar`和`asm-commons.jar`当中，有哪些主要类成员。
- 第二点，`asm-util.jar`和`asm-commons.jar`两者有什么区别。
