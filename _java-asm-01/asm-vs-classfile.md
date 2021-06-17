---
title:  "ASM与ClassFile"
sequence: "103"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

## ClassFile

我们都知道，在`.class`文件中，存储的是ByteCode数据。但是，这些ByteCode数据并不是杂乱无章的，而是遵循某一定的数据结构。

{:refdef: style="text-align: center;"}
![From Java to Class](/assets/images/java/javac-from-dot-java-to-dot-class.jpeg)
{: refdef}

这个`.class`文件遵循的数据结构就是由[Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)中定义的
[The class File Format](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html)，如下所示。

{% highlight java %}
{% raw %}
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
{% endraw %}
{% endhighlight %}

## 字节码类库

ASM并不是唯一的修改字节码的类库，还有许多其它的修改Java字节码的类库。

### 常见的字节码类库

在下面列举了几个比较常见的字节码类库：

- [Apache Commons BCEL](https://commons.apache.org/proper/commons-bcel/)：其中BCEL为Byte Code Engineering Library首字母的缩写。
- [Byte Buddy](https://bytebuddy.net/)：在ASM基础上实现的一个类库。
- [Javassist](http://www.javassist.org/)：Javassist表示**Java** programming **assist**ant
- [ObjectWeb ASM](https://asm.ow2.io/)：本课程的研究对象。

那么，字节码的类库和ClassFile之间是什么样的关系呢？我们可以用下图来表示：

{:refdef: style="text-align: center;"}
![字节码类库](/assets/images/java/asm/java-bytecode-libraries.png)
{: refdef}

对于上图，我们用三句来描述它们的关系：

- 中间层－多个`.class`文件，虽然每个类里面的内容各不相同，但它们里面的内容都称为字节码（ByteCode）。
- 中下层－不论这些`.class`文件内容有怎样大的差异，它们都共同遵守同一个数据结构，即ClassFile。
- 中上层－为了方便于人们对于字节码（ByteCode）内容的操作，逐渐衍生出了各种操作字节码的类库。

既然有多个可以选择的字节码类库，那么我们为什么要选择ASM呢？这就得看ASM自身所有的特点，或者说与众不同的地方了。

### ASM的特点

- 问题：与其它的操作Java字节码的类库相比，ASM有哪些与众不同的地方呢？  
- 回答：在实现相同的功能前提下，使用ASM，运行速度更快（运行时间短，属于“时间维度”），占用的内存空间更小（内存空间，属于“空间维度”）。

The ASM was designed to be as **fast** and as **small** as possible.

- Being as **fast** as possible is important in order not to slow down too much the applications that use ASM at runtime, for dynamic class generation or transformation.
- And being as **small** as possible is important in order to be used in memory constrained environments, and to avoid bloating the size of small applications or libraries using ASM.

简而言之，ASM的特点就是fast和small。

## ASM与ClassFile的关系

为了大家更直观的理解ASM与ClassFile之间关系，我们用下图来表示。其中，**Java ClassFile相当于“树根”部分，ObjectWeb ASM相当于“树干”部分，而ASM的各种应用场景属于“树枝”或“树叶”部分**。

{:refdef: style="text-align: center;"}
![ASM与ClassFile的关系](/assets/images/java/asm/class-file-asm-tree.png)
{: refdef}

学习ASM有三个不同的层次：

- 第一个层次，ASM的应用层面。也就是说，我们可以使用ASM来做什么呢？对于一个`.class`文件来说，我们可以使用ASM进行analysis、generation和transformation操作。
- 第二个层次，ASM的源码层面。也就是，ASM的代码组织形式，它为分Core API和Tree API的内容。
- 第三个层次，Java ClassFile层面。从JVM规范的角度，来理解`.class`文件的结构，来理解ASM中方法和参数的含义。

{:refdef: style="text-align: center;"}
![ASM的学习层次](/assets/images/java/asm/asm-study-three-levels.png)
{: refdef}

在本次课程当中，会对Class Generation和Class Transformation进行介绍。

- 第二章 生成新的类，是结合Class Generation和`asm.jar`的部分内容来讲。
- 第三章 修改已有的类，是结合Class Transformation和`asm.jar`的部分内容来讲。
- 第四章 工具类和常用类，是结合Class Transformation、`asm-util.jar`和`asm-commons.jar`的内容来讲。

## 总结

本文主要围绕着“ClassFile”和“ASM”展开，内容总结如下：

- 第一点，具体的`.class`文件遵循`ClassFile`的结构。
- 第二点，操作字节码（ByteCode）的类库有多个。ASM是其中一种，它的特点是执行速度快、占用空间小。
- 第三点，ASM与ClassFile之间的关系。形象的来说，ClassFile相当于是“树根”，而ASM相当于是“树干”，而ASM的应用场景相当于“树枝”或“树叶”。

本文的重点是理解“ASM与ClassFile之间的关系”，也不需要记忆任何内容。

正所谓“君子务本，本立而道生”，ClassFile是“根本”，而ASM是在ClassFile这个根本上所衍生出来的一条修改字节码（ByteCode）道路或途径。
