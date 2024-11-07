---
title: "ASM 与 ClassFile"
sequence: "103"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## ClassFile

我们都知道，在 `.class` 文件中，存储的是 ByteCode 数据。但是，这些 ByteCode 数据并不是杂乱无章的，而是遵循一定的数据结构。

![From Java to Class](/assets/images/java/javac-from-dot-java-to-dot-class.jpeg)

这个 `.class` 文件遵循的数据结构就是由 [Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html) 中定义的
[The class File Format](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html)，如下所示。

```text
ClassFile {
    u4             magic;
    u2             minor_version;
    u2             major_version;
    u2             constant_pool_count;
    cp_info        constant_pool[constant_pool_count-1];
    u2             access_flags;
    u2             this_class;
    u2             super_class;
    u2             interfaces_count;
    u2             interfaces[interfaces_count];
    u2             fields_count;
    field_info     fields[fields_count];
    u2             methods_count;
    method_info    methods[methods_count];
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
```

## 字节码类库

ASM 是操作字节码的类库，但并不是唯一的，还有许多其它的操作字节码的类库。

### 常见的字节码类库

在下面列举了几个比较常见的字节码类库（按时间先后顺序）：

- [Apache Commons BCEL](https://commons.apache.org/proper/commons-bcel/)：其中 BCEL 为 Byte Code Engineering Library 首字母的缩写。
- [Javassist](http://www.javassist.org/)：Javassist 表示**Java** programming **assist**ant
- [ObjectWeb ASM](https://asm.ow2.io/)：本课程的研究对象。
- [Byte Buddy](https://bytebuddy.net/)：在 ASM 基础上实现的一个类库。

那么，字节码的类库和 ClassFile 之间是什么样的关系呢？我们可以用下图来表示：

![ 字节码类库 ](/assets/images/java/asm/java-bytecode-libraries.png)

对于上图，我们用三句来描述它们的关系：

- 中间层－多个 `.class` 文件，虽然每个类里面的内容各不相同，但它们里面的内容都称为字节码（ByteCode）。
- 中下层－不论这些 `.class` 文件内容有怎样大的差异，它们都共同遵守同一个数据结构，即 ClassFile。
- 中上层－为了方便于人们对于字节码（ByteCode）内容的操作，逐渐衍生出了各种操作字节码的类库。
- 上下层－不考虑中间层，我们可以说，不同的字节码类库是在同一个 ClassFile 结构上发展起来的。

既然有多个可以选择的字节码类库，那么我们为什么要选择 ASM 呢？这就得看 ASM 自身所具有的特点，或者说与众不同的地方。

### ASM 的特点

- 问题：与其它的操作 Java 字节码的类库相比，ASM 有哪些与众不同的地方呢？  
- 回答：在实现相同的功能前提下，使用 ASM，运行速度更快（运行时间短，属于“时间维度”），占用的内存空间更小（内存空间，属于“空间维度”）。

The ASM was designed to be as **fast** and as **small** as possible.

- Being as **fast** as possible is important in order not to slow down too much the applications that use ASM at runtime, for dynamic class generation or transformation.
- And being as **small** as possible is important in order to be used in memory constrained environments, and to avoid bloating the size of small applications or libraries using ASM.

简而言之，ASM 的特点就是 fast 和 small。

## ASM 与 ClassFile 的关系

为了大家更直观的理解 ASM 与 ClassFile 之间关系，我们用下图来表示。其中，**Java ClassFile 相当于“树根”部分，ObjectWeb ASM 相当于“树干”部分，而 ASM 的各种应用场景属于“树枝”或“树叶”部分**。

![ASM 与 ClassFile 的关系 ](/assets/images/java/asm/class-file-asm-tree.png)

学习 ASM 有三个不同的层次：

- 第一个层次，**ASM 的应用层面**。也就是说，**ASM 能够做什么**？对于一个 `.class` 文件来说，我们可以使用 ASM 进行 analysis、generation 和 transformation 操作。
- 第二个层次，**ASM 的源码层面**。也就是，**ASM 的两个组成部分**，它为分 Core API 和 Tree API 的内容。
- 第三个层次，**Java ClassFile 层面**。从 JVM 规范的角度，来理解 `.class` 文件的结构，来理解 ASM 中方法和参数的含义。

在这里，**希望大家能够将之前介绍的相关内容（ASM 能够做什么、ASM 的组成部分）组织在一起进行理解**：

![ASM 的学习层次 ](/assets/images/java/asm/asm-study-three-levels.png)

在本次课程当中，会对 Class Generation 和 Class Transformation 进行介绍。

- 第二章 生成新的类，是结合 Class Generation 和 `asm.jar` 的部分内容来讲。
- 第三章 修改已有的类，是结合 Class Transformation 和 `asm.jar` 的部分内容来讲。
- 第四章 工具类和常用类，是结合 Class Transformation、`asm-util.jar` 和 `asm-commons.jar` 的内容来讲。

## 总结

本文主要围绕着“ClassFile”和“ASM”展开，内容总结如下：

- 第一点，具体的 `.class` 文件遵循 `ClassFile` 的结构。
- 第二点，操作字节码（ByteCode）的类库有多个。ASM 是其中一种，它的特点是执行速度快、占用空间小。
- 第三点，ASM 与 ClassFile 之间的关系。形象的来说，ClassFile 相当于是“树根”，而 ASM 相当于是“树干”，而 ASM 的应用场景相当于“树枝”或“树叶”。

本文的重点是理解“ASM 与 ClassFile 之间的关系”，也不需要记忆任何内容。

正所谓“君子务本，本立而道生”，ClassFile 是“根本”，而 ASM 是在 ClassFile 这个根本上所衍生出来的一条修改字节码（ByteCode）道路或途径。
