---
title:  "ASM的组成部分"
sequence: "104"

---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

## ASM的两个组成部分

### Core API和Tree API

ASM分成两部分，一部分为Core API，另一部分为Tree API。这两部分之间的关系是这样的：Core API是基础，而Tree API是在Core API的这个基础上构建起来的。

{:refdef: style="text-align: center;"}
![ASM Components](/assets/images/java/asm/asm-components.png)
{: refdef}

在上图当中，Core API和Tree API，其实是“抽象的概念”；这些“抽象的概念”，必须要“具体化”成磁盘上某一个或多个`.jar`文件，才能够被我们所使用起来。其实这些`.jar`文件，就是我们在创建Maven项目时所依赖的内容。

- Core API这个抽象概念，包括了`asm.jar`、`asm-util.jar`和`asm-commons.jar`这三个具体文件；
- Tree API这个抽象概念，包括了`asm-tree.jar`和`asm-analysis.jar`这两个具体文件。
  
事实上，这样的描述并不严谨，因为随着ASM版本的发展，Tree API的内容也进入到了`asm-util.jar`和`asm-commons.jar`文件当中。

那么，Core API和Tree API两者之间有什么区别呢？大家可以参考[asm4-guide.pdf](https://asm.ow2.io/asm4-guide.pdf)文件当中的`1.2.2. Model`部分的内容。我们在这里就不详细解释了。

### ASM API的发展历史

随着时间的演进，ASM的版本也在不断的迭代更新。从时间的角度来看，在ASM当中，先有Core API，后有Tree API。

最初，在2002年，Eric Bruneton等发表了一篇文章，即《[ASM: a code manipulation tool to implement adaptable systems](/assets/pdf/asm-eng.pdf)》。在这篇文章当中，最早提出了ASM的设计思路，它所面临的问题和相应的解决方法。当时，ASM只包含13个类文件，Jar包的大小只有21KB，而现在，单单`asm.jar`就有119KB的大小。这13个类文件，就是现在所说的Core API的雏形，但当时并没有提出Core API这样的概念。

接着，随着时代的变化，人们对于修改Java字节码提出更多的需求。为了满足人们的需求，ASM就需要添加新的类。类的数量变多了，代码的管理也就变得困难起来。为了更好的管理ASM的代码，就将这些类（按照功能的不同）分配到不同的Jar包当中，这样就逐渐衍生出Core API和Tree API的概念。

其实，Core API和Tree API两者之间的关系，也并不是相互独立的。Tree API是依赖Core API的，是在Core API的基础上搭建起来。

简单来总结一下，从ASM API的发展历史来看，先有Core API，后有Tree API。

## ASM的三个学习层次

依据我个人的理解，学习ASM有三个不同的层次：

- 第一个层次，ASM的应用层面。
- 第二个层次，ASM的源码层面。
- 第三个层次，Java ClassFile层面。

{:refdef: style="text-align: center;"}
![ASM的学习层次](/assets/images/java/asm/asm-study-three-levels.png)
{: refdef}

第一个层次，ASM的应用层面。也就是说，我们可以使用ASM来做什么呢？可以对`.class`文件进行analyze、generate和transform操作。

第二个层次，ASM的源码层面。也就是说，对于ASM源代码的解读，理解总体的设计思路、类的成员信息，以及一些使用的算法。

第三个层次，Java ClassFile层面。也就是说，去探究比ASM本身更“深层次”的内容。因为任何的操作Java字节码的类库（包括ASM、BCEL、Javassist），都是在对Java ClassFile理解的基础上搭建起来的。有的时候，我们研究ASM的源代码，有部分内容很奇怪，不知道它的代码为什么会这样写？其中，很大一部分原因是，Java ClassFile提出很多对于`.class`文件格式的约束，ASM的代码那样写是为了满足这些约束条件。

## 总结

本文主要是对ASM的组成部分和学习层次进行了介绍，内容总结如下：

- 第一点，ASM由Core API和Tree API组成。从时间的维度来看，先有Core API，后有Tree API。我们的课程是围绕Core API展开的。
- 第二点，学习ASM有三个不同的层次：应用层、源码层和ClassFile。

为了更方便于理解，我们可以作一个类比：

- 在高中课程中，分成“文科”和“理科”；文科，包括历史、地理、政治；理科，包括物理、化学和生物。这部分可以类比于ASM中的Core API和Tree API。
- 同时呢，高中也有会考，它可以衡量学生对于每门功课的掌握程度，分成A、B、C、D四个档。这部分可以类比于学习ASM的三个不同层次。
