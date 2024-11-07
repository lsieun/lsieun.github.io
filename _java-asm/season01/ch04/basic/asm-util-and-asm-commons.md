---
title: "asm-util 和 asm-commons"
sequence: "401"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## asm-util

在 `asm-util.jar` 当中，主要介绍 `CheckClassAdapter` 和 `TraceClassVisitor` 类。在 `TraceClassVisitor` 类当中，会涉及到 `Printer`、`ASMifier` 和 `Textifier` 类。

![](/assets/images/java/asm/asm-util-package.png)

- 其中，`CheckClassAdapter` 类，主要负责检查（Check）生成的 `.class` 文件内容是否正确。
- 其中，`TraceClassVisitor` 类，主要负责将 `.class` 文件的内容打印成文字输出。根据输出的文字信息，可以探索或追踪（Trace）`.class` 文件的内部信息。

## asm-commons

在 `asm-commons.jar` 当中，包括的类比较多，我们就不一一介绍每个类的作用了。但是，我们可以这些类可以分成两组，一组是 `ClassVisitor` 的子类，另一组是 `MethodVisitor` 的子类。

- 其中，`ClassVisitor` 的子类有 `ClassRemapper`、`StaticInitMerger` 和 `SerialVersionUIDAdder` 类；
- 其中，`MethodVisitor` 的子类有 `LocalVariablesSorter`、`GeneratorAdapter`、`AdviceAdapter`、`AnalyzerAdapter` 和 `InstructionAdapter` 类。

![](/assets/images/java/asm/asm-commons-package.png)

## util 和 commons 的区别

那么，**asm-util.jar**与**asm-commons.jar**有什么区别呢？在 `asm-util.jar` 里，它提供的是通用性的功能，没有特别明确的应用场景；而在 `asm-commons.jar` 里，它提供的功能，都是为解决某一种特定场景中出现的问题而提出的解决思路。

- the `org.objectweb.asm.util` package, in the `asm-util.jar` archive, provides various tools based on the core API that can be used during the development and debuging of ASM applications.
  - 在 `CheckClassAdapter` 类的代码实现中，它会依赖于 `org.objectweb.asm.tree` 和 `org.objectweb.asm.tree.analysis` 的内容。因此，`asm-util.jar` 除了依赖 Core API 之外，也依赖于 Tree API 的内容。
- the `org.objectweb.asm.commons` package provides several useful pre-defined class transformers, mostly based on the core API. It is contained in the `asm-commons.jar` archive.

在 [learn-java-asm](https://gitee.com/lsieun/learn-java-asm) 当中，各个 Jar 包之间的依赖关系如下：

![](/assets/images/java/asm/learn-java-asm-depdendencies.png)

由上图，我们可以看到：`asm-util.jar` 和 `asm-commons.jar` 两者都对 `asm.jar`、`asm-tree.jar`、`asm-analysis.jar` 有依赖。

![](/assets/images/java/asm/relation-of-asm-jars.png)

## 编程习惯

在编写 ASM 代码的过程中，我经常遵循一个命名的习惯：如果添加一个新的类，它继承自 `ClassVisitor`，那么就命名成 `XxxVisitor`；如果添加一个新的类，它继承自 `MethodVisitor`，那么就命名成 `XxxAdapter`。通过类的名字，我们就可以区分出哪些类是继承自 `ClassVisitor`，哪些类是继承自 `MethodVisitor`。

其实，将 `MethodVisitor` 类的子类命名成 `XxxAdapter` 就是参考了 `GeneratorAdapter`、`AdviceAdapter`、`AnalyzerAdapter` 和 `InstructionAdapter` 类的名字。但是，`CheckClassAdapter` 类是个例外，它是继承自 `ClassVisitor` 类。

## 总结

本文对 `asm-util.jar` 和 `asm-commons.jar` 进行介绍，内容总结如下：

- 第一点，在 `asm-util.jar` 和 `asm-commons.jar` 当中，有哪些主要类成员。
- 第二点，`asm-util.jar` 和 `asm-commons.jar` 两者有什么区别。
