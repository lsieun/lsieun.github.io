---
title:  "ASM Core API概览"
sequence: "105"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

我们知道，ASM由Core API和Tree API这两个部分组成，如下图所示。

{:refdef: style="text-align: center;"}
![ASM Components](/assets/images/java/asm/asm-components.png)
{: refdef}

我们的课程是围绕Core API来进行展开，它包含了三个`.jar`文件，分别是`asm.jar`、`asm-util.jar`和`asm-commons.jar`。所谓的ASM Core API概览，其实就是对种`.jar`文件里包含的主要类成员进行介绍。

## Core API

### asm.jar

在`asm.jar`文件中，一共包含了30多个类，在后续内容当中，我们会提到其中10个左右的类。那么，剩下的20多个类，为什么不介绍呢？因为剩下的20多个主要起到“辅助”的作用，它们更多的倾向于是“幕后工作者”；而“登上舞台表演的”则是属于那10个左右的类。

在“第二章 生成新的类”当中，我们会主要介绍从“无”到“有”生成一个新的类，其中会涉及到`ClassVisitor`、`ClassWriter`、`FieldVisitor`、`FieldWriter`、`MethodVisitor`、`MethodWriter`、`Label`和`Opcode`类。

在“第三章 修改已有的类”当中，我们会主要介绍修改“已经存在的类”，使之内容发生改变，其中会涉及到`ClassReader`和`Type`类。

在这10个左右的类当中，最重要的是三个类，即`ClassReader`、`ClassVisitor`和`ClassWriter`类。这三个类的关系，可以描述成下图：

{:refdef: style="text-align: center;"}
![ASM里的核心类](/assets/images/java/asm/asm_core_classes.png)
{: refdef}


这三个类的作用，可以简单理解成这样：

- `ClassReader`类，负责读取`.class`文件里的内容，然后拆分成各个不同的、小的部分。
- `ClassVisitor`类，负责对`.class`文件中某一个部分里的信息进行修改。
- `ClassWriter`类，负责将各个不同的、小的部分重新组合成一个完整的`.class`文件。

在“第二章 生成新的类”当中，主要围绕着`ClassVisitor`和`ClassWriter`这两个类展开，因为在这个部分，我们是从“无”到“有”生成一个新的类，不需要`ClassReader`类的参与。

在“第三章 修改已有的类”当中，就需要`ClassReader`、`ClassVisitor`和`ClassWriter`这三个类的共同参与。

### asm-util.jar

`asm-util.jar`主要包含的是一些**工具类**。

在下图当中，我们可以看到`asm-util.jar`里面包含的具体类文件。这些类文件主要分成两类：`Check`开头和`Trace`开头。

- 以`Check`开头的类，主要负责检查（Check）生成的`.class`文件内容是否正确。
- 以`Trace`开头的类，主要负责将`.class`文件的内容进行文本化的输出。根据输出的文字信息，我们可以探索或追踪（Trace）`.class`文件的内部信息。

{:refdef: style="text-align: center;"}
![asm-util.jar里的类](/assets/images/java/asm/asm-util-jar-classes.png)
{: refdef}

在`asm-util`当中，我们主要介绍`CheckClassAdapter`类和`TraceClassVisitor`类，也会简略的说明一下`Printer`、`ASMifier`和`Textifier`类。

我们会在“第四章 工具类和常用类”当中，介绍`asm-util`里的内容。

### asm-commons.jar

`asm-commons.jar`主要包含的是一些**常用功能类**。

在下图当中，我们可以看到`asm-commons.jar`里面包含的具体类文件。

{:refdef: style="text-align: center;"}
![asm-commons.jar里的类](/assets/images/java/asm/asm-commons-jar-classes.png)
{: refdef}

我们会介绍到其中的`AdviceAdapter`、`AnalyzerAdapter`、`ClassRemapper`、`GeneratorAdapter`、`InstructionAdapter`、`LocalVariableSorter`、`SerialVersionUIDAdapter`和`StaticInitMerger`类。

我们会在“第四章 工具类和常用类”当中，介绍`asm-commons`里的内容。

一个非常容易造成思绪混乱的问题就是，**常用功能类**与**工具类**有什么区别呢？其实，这个问题不好用语言回答，因为我们平常用的语言本身就带有很大的模糊性。我个人觉得，在`asm-util`里，它提供的是通用性的功能，没有某一种特别明确的目的、没有特定的使用场景；而在`asm-commons`里，它提供的功能，都是解决某一种特定场景中出现的问题，它是对同一个性质的、不同问题的经验性总结的解决思路。

到现在为止，相信大家已经对ASM有了一个比较基本的了解，那接下来，我们看一下课程内容的安排。

## 课程内容安排

我们知道，从应用层面来讲，ASM的使用场景有三种：  

- analyze
- generate
- transform

同时，我们也知道，ASM Core API由三个`.jar`文件组成：

- asm.jar
- asm-util.jar
- asm-commons.jar

{:refdef: style="text-align: center;"}
![ASM的学习层次](/assets/images/java/asm/asm-study-three-levels.png)
{: refdef}

在我们的课程当中，主要是对Class Generation和Class Transformation进行介绍。

- 第二章 生成新的类，是结合Class Generation和`asm.jar`的部分内容来讲。
- 第三章 修改已有的类，是结合Class Transformation和`asm.jar`的部分内容来讲。
- 第四章 工具类和常用类，是结合Class Transformation、`asm-util.jar`和`asm-commons.jar`的内容来讲。

## 总结

本文主要是对ASM中Core API的内容进行简单介绍，希望大家能够梳理清楚学习的脉络。
