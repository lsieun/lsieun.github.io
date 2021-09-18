---
title:  "Method Analysis"
sequence: "401"
---

[上级目录]({% link _posts/2021-05-01-java-asm-season-03.md %})

## Method Analysis

### 分析的对象是谁？

Java ASM是一个操作字节码（bytecode）的工具，而字节码（bytecode）的一种具体存在形式就是一个`.class`文件。现在，我们要进行分析，就可以称之为Class Analysis。

{:refdef: style="text-align: center;"}
![What ASM Can Do](/assets/images/java/asm/what-asm-can-do.png)
{: refdef}

在类（Class）当中，主要由字段（Field）和方法（Method）组成。如果我们仔细思考一下，其实字段（Field）没有什么太多内容可以分析的，主要是分析对象应该是方法（Method）。

在方法（Method）中，它包含了主要的代码处理逻辑。因此，我们可以粗略的认为Class Analysis和Method Analysis指代同一个事物，不做严格区分。

### 分析的手段是什么？

现在，我们知道Java ASM分析的主要对象就是方法（Method）。对方法（Method）进行分析的手段主要分成两大类：

- **Static program analysis** is the analysis of computer software that is performed without actually executing programs.
- **Dynamic program analysis** is the analysis of computer software that is performed by executing programs on a real or virtual processor.

对于程序的分析，分成两种类型：
第一种，就是Static program analysis，不需要运行程序，可以直接针对源码或字节码（bytecode）进行分析。
第二种，就是Dynamic program analysis，需要运行程序，是在运行过程中获取数据来进行分析。

像Reflection API和dynamic binding，是在程序运行过程中，才是它们发挥作用的时候：要用反射调用哪一个具体的方法，或者dynamic binding哪一个具体方法上。所以，使用静态分析的技术不容易解决这样的问题。

静态分析，是在程序进入JVM之前发生的；动态分析，是在程序进入JVM之后发生的。
当使用到某个语言特性的时候，可以看看它是什么时候发挥作用的。

在本文当中，我们主要介绍data flow analysis和control flow analysis。这两种analysis都是属于Static program analysis：

- Method Analysis
  - Static program analysis
    - data flow analysis
    - control flow analysis
  - Dynamic program analysis

A **data flow analysis** consists in computing the state of the execution frames of a method, for each instruction of this method.
This state can be represented in a more or less abstract way.
For example reference values can be represented by a single value, by one value per class,
by three possible values in the `{ null, not null, may be null }` set, etc.

A **control flow analysis** consists in computing the control flow graph of a method, and in performing analysis on this graph.
The control flow graph is a graph whose nodes are instructions,
and whose oriented edges connect two instructions `i → j` if `j` can be executed just after `i`.

简而言之，data flow analysis和control flow analysis的区别：

- data flow analysis注重于“细节”，它需要明确计算出每一个instruction,local variable和operand stack当中每一个值。
- control flow analysis注重于“整体”，它不需要知道具体的某一个值，而是关注于整体上的代码逻辑结构。

## asm-analysis.jar

The ASM API for code analysis is in the `org.objectweb.asm.tree.analysis` package.
As the package name implies, it is based on the tree API.

### 涉及到哪些类

### 处理思路

在`asm-analysis.jar`当中，是如何实现data flow analysis和control flow analysis的呢？

Two types of data flow analysis can be performed:

- a **forward analysis** computes, for each instruction, the state of the execution frame after this instruction, from the state before its execution.
- a **backward analysis** computes, for each instruction, the state of the execution frame before this instruction, from the state after its execution.


In fact, the `org.objectweb.asm.tree.analysis` package provides a framework for doing **forward data flow analysis**.

In order to be able to perform various data flow analysis,
with more or less precise sets of values,
the **data flow analysis algorithm** is split in two parts:
**one is fixed and is provided by the framework**,
**the other is variable and provided by users**. More precisely:

- The overall data flow analysis algorithm, and the task of popping from the stack, and pushing back to the stack, the appropriate number of values, is implemented once and for all in the `Analyzer` and `Frame` classes.
- The task of combining values and of computing unions of value sets is performed by user defined subclasses of the `Interpreter` and `Value` abstract classes. Several predefined subclasses are provided.

- Analyzer
    - Frame
    - Interpreter

Although the primary goal of the framework is to perform **data flow analysis**,
the `Analyzer` class can also construct the **control flow graph** of the analysed method.
This can be done by overriding the `newControlFlowEdge` and `newControlFlowExceptionEdge` methods of this class, which by default do nothing.
The result can be used for doing **control flow analysis**.

### 代码示例

- Cyclomatic Complexity


