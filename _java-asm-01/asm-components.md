---
title:  "ASM的组成部分"
sequence: "004"

---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

## ASM的两个主要部分：Core API和Tree API

ASM分成两部分，一部分为Core API，另一部分为Tree API。这两部分之间的关系是这样的：Core API是基础，而Tree API是在Core API的这个基础上构建起来的。

当然，我们谈论Core API和Tree API，其实是在谈论“抽象的概念”；这些“抽象的概念”，必须要“具体化”成磁盘上某一个或某多个特定文件，才能够被我们所使用起来。

正如下图所示，Core API这个抽象概念，包括了`asm.jar`、`asm-util.jar`和`asm-commons.jar`这3个具体文件；而Tree API这个抽象概念，包括了`asm-tree.jar`和`asm-analysis.jar`这2个具体文件。（这句话并不严谨，因为随着ASM版本的发展，Tree API的内容也进入到了`asm-util.jar`和`asm-commons.jar`文件当中）

![ASM Components](/assets/images/java/asm/asm-components.png)

随着时间的演进，ASM的版本也在不断发展。从时间的角度来看，在ASM当中，先有Core API，后有Tree API。在《[ASM: a code manipulation tool to implement adaptable systems](/assets/pdf/ASM_a_code_manipulation_tool_to_implement_adaptable_systems.pdf)》这篇文章当中，最早提出了ASM的设计思路（即面临的问题和相应的解决方法），它当时只包含13个类文件。这13个类文件，就是现在所说的Core API的部分，但当时并没有提出Core API这样的概念。接着，随着时代的变化，人们对于修改Java字节码提出更多的要求，ASM就需要添加新的类，来满足人们的需求。为了更好的管理ASM的代码，才逐渐衍生出Core API和Tree API的概念。也就是说，原来的13个类文件归为Core API，后续扩展的很多类归为Tree API，而且Tree API是在Core API的基础上搭建起来。在后续的时间当中，Core API和Tree API都在不断的发展和重构。这里的主要目的是想说明：虽然ASM分成了Core API和Tree API两个部分，但最开始的时候，ASM当中只包含Core API的部分，随着时间的演进，才逐渐扩展出了Tree API的部分。

在上一段内容当中，我们从时间发展的角度来看待Core API和Tree API之间的关系，那么从实际使用的角度来说，它们两者有什么差异呢？



## ASM的学习层次

依据我个人的理解，学习ASM有3个不同的层次：

- 第一个层次，ASM的应用。
- 第二个层次，ASM的源码。
- 第三个层次，Java ClassFile。

![](/assets/images/java/asm/asm-study-three-levels.png)

第一个层次，ASM的应用。也就是如何使用ASM，来修改具体的`.class`文件，以达到某个特定的应用结果。

第二个层次，ASM的源码。也就是对于ASM源代码的解读，去理解它的设计思路，去理解它的一些算法是如何实现的。

第三个层次，Java ClassFile。也就是对于Java ClassFile的理解，因为任何的操作Java字节码的类库（包括ASM、BCEL、Javassist）都是在Java ClassFile的基础上搭建起来的。如果你独自研究ASM的源码，有的时候会遇到这样的情况：不知道它的代码为什么会这样写呢？其中，很大一部分原因是，Java ClassFile提出很多对于`.class`文件格式的约束，ASM的代码那样写是为了满足这些约束条件。如果大家对于Java ClassFile，可以参考我的另外一个课程《[Java 8 ClassFile](https://edu.51cto.com/course/25908.html)》。
