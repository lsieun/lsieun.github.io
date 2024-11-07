---
title: "JVM Architecture"
sequence: "104"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## JVM 的组成部分

从 JVM 组成的角度来说，它由 Class Loader SubSystem、Runtime Data Areas 和 Execution Engine 三个部分组成：

- 类加载子系统（Class Loader SubSystem），负责加载具体的 `.class` 文件。
- 运行时数据区（Runtime Data Areas），主要负责为执行引擎（Execution Engine）提供“空间维度”的支持，
  为类（Class）、对象实例（object instance）、局部变量（local variable）提供存储空间。
- 执行引擎（Execution Engine），主要负责方法体里的 instruction 内容，它是 JVM 的核心部分。

![JVM Architecture](/assets/images/java/jvm/jvm-architecture.png)

在 JVM 当中，数据类型分成 primitive type 和 reference type 两种，那么 ClassLoader 负责加载哪些类型呢？

- 对于 primitive type 是 JVM 内置的类型，不需要 ClassLoader 加载。
- 对于 reference type 来说，它又分成类（class types）、接口（interface types）和数组（array types）三种子类型。
  - ClassLoader 只负责加载类（class types）和接口（interface types）。
  - JVM 内部会帮助我们创建数组（array types）。

## JVM Execution Engine

At the core of any Java Virtual Machine implementation is its **execution engine**.

### JVM 文档：指令集

在[The Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)中，它没有明确的提到 Execution Engine 的内容：打开 JVM 文档的每一章内容，搜索“execution engine”，会发现没有相关内容。

那么，这是不是意味着 JVM 文档与 Execution Engine 两者之间没有关系呢？其实，两者之间是有关系的。

可能是 JVM 文档描述的比较含蓄，它执行引擎（Execution Engine）的描述是通过指令集（Instruction Set）来体现的。

In the Java Virtual Machine specification, **the behavior of the execution engine** is defined in terms of **an instruction set**.

### 执行引擎：三种解读

The term "**execution engine**" can also be used in any of three senses: **an abstract specification**, **a concrete implementation**, or **a runtime instance**.

- **The abstract specification** defines the behavior of an execution engine in terms of the instruction set.
- **Concrete implementations**, which may use a variety of techniques, are either software, hardware, or a combination of both.
- **A runtime instance** of an execution engine is a thread.

**Each thread of a running Java application is a distinct instance of the virtual machine's execution engine**. From the beginning of its lifetime to the end, a thread is either executing bytecodes or native methods. A thread may execute bytecodes directly, by interpreting or executing natively in silicon, or indirectly, by just-in-time compiling and executing the resulting native code.

A Java Virtual Machine implementation may use other threads invisible to the running application, such as a thread that performs garbage collection. Such threads need not be "instances" of the implementation's execution engine. **All threads that belong to the running application, however, are execution engines in action.**


## Runtime Data Areas: JVM Stack

在现实生活当中，我们生活在一个三维的空间，在这个空间维度里，可以确定一个事物的具体位置；同时，也有一个时间维度，随着时间的流逝，这个事物的状态也会发生变化。**简单来说，对于一个具体事物，空间维度上就是看它占据一个什么位置，时间维度上就看它如何发生变化。** 接下来，我们把“空间维度”和“时间维度”的视角带入到 JVM 当中。

在 JVM 当中，是怎么体现“空间维度”视角和“时间维度”两个视角的呢？

- 时间维度。上面谈到执行引擎（Execution Engine），一条一条的执行 instruction 的内容，会引起相应事物的状态发生变化，这就是“时间维度”的视角。
- 空间维度。接下来要讲的 JVM Stack 和 Stack Frame，它们都是运行时数据区（Runtime Data Areas）具体的内存空间分配，用于存储相应的数据，这就是“空间维度”视角。

![JVM Architecture](/assets/images/java/jvm/jvm-architecture.png)

### thread 对应于 JVM Stack

上面提到，线程（thread）是执行引擎（Execution Engine）的运行实例，那么线程（thread）就是一个“时间维度”的视角。
JVM Stack 是运行时数据区（Runtime Data Areas）的一部分，是“空间维度”的视角。
两者之间是什么样的关系呢？

Each Java Virtual Machine thread has a private Java Virtual Machine stack, created at the same time as the thread.

那么，对于线程（thread）来说，它就同时具有“时间维度”（Execution Engine）和“空间维度”(JVM Stack)。

A Java Virtual Machine stack stores frames.

### method 对应于 Stack Frame

接着，我们如何看待方法（method）呢？或者说方法（method）是什么呢？
方法（method），是一组 instruction 内容的有序集合；
而 instruction 的执行，就对应着时间的流逝，所以方法（method）也可以理解成一个“时间片段”。

那么，线程（thread）和方法（method）是什么关系呢？
线程（thread），从本质上来说，就是不同方法（method）之间的调用。
所以，线程（thread）是更大的“时间片段”，而方法（method）是较小的“时间片段”。

上面描述，体现方法（method）是在“时间维度”的考量，在“空间维度”上有哪些体现呢？
在“空间维度”上，就体现为 Stack Frame。

- A new frame is created each time a method is invoked.
- A frame is destroyed when its method invocation completes, whether that completion is normal or abrupt (it throws an uncaught exception).

接下来，介绍 current frame、current method 和 current class 三个概念。

Only one frame, the frame for the executing method, is active at any point in a given thread of control. This frame is referred to as the **current frame**, and its method is known as the **current method**. The class in which the current method is defined is the **current class**.

一个方法会调用另外一个方法，另一个方法也有执行结束的时候。那么，current frame 是如何变换的呢？

- A frame ceases to be current if its method invokes another method or if its method completes.
- When a method is invoked, a new frame is created and becomes current when control transfers to the new method.
- On method return, the current frame passes back the result of its method invocation, if any, to the previous frame.
- The current frame is then discarded as the previous frame becomes the current one.

## Runtime Data Areas: Stack Frame

当一个具体的 `.class` 加载到 JVM 当中之后，方法的执行会对应于 JVM 当中一个 Stack Frame 内存空间。

### Stack Frame 的内部结构

对于 Stack Frame 内存空间，主要分成三个子区域：

- 第一个子区域，operand stack，是一个栈结构，遵循后进先出（LIFO）的原则；它的大小是由 `Code` 属性中的 `max_stack` 来决定的。
- 第二个子区域，local variables，是一个数组结构，通过索引值来获取和设置里面的数据，其索引值是从 `0` 开始；它的大小是由 `Code` 属性中的 `max_locals` 来决定的。
- 第三个子区域，Frame Data，它用来存储与当前方法相关的数据。例如，一个指向 runtime constant pool 的引用、出现异常时的处理逻辑（exception table）。

在 Frame Data 当中，我们也列出了其中两个重要数据信息：

- 第一个数据，`instructions`，它表示指令集合，是由 `Code` 属性中的 `code[]` 解析之后的结果。（准确的来说，这里是不对的，instructions 可能是位于 Method Area 当中。我们为了看起来方便，把它放到了这里。）
- 第二个数据，`ref`，它是一个指向 runtime constant pool 的引用。这个 runtime constant pool 是由具体 `.class` 文件中的 constant pool 解析之后的结果。

![JVM Execution Model](/assets/images/java/asm/jvm-execution-model.png)

```text
Code_attribute {
    u2 attribute_name_index;
    u4 attribute_length;
    u2 max_stack;
    u2 max_locals;
    u4 code_length;
    u1 code[code_length];
    u2 exception_table_length;
    {   u2 start_pc;
        u2 end_pc;
        u2 handler_pc;
        u2 catch_type;
    } exception_table[exception_table_length];
    u2 attributes_count;
    attribute_info attributes[attributes_count];
}
```

### Stack Frame 内的数据类型

在这里，我们要区分开两个概念：**存储时的类型** 和 **运行时的类型**。

将一个具体 `.class` 文件加载进 JVM 当中，存放数据的地方有两个主要区域：堆（Heap Area）和栈（Stack Area）。

- 在堆（Heap Area）上，存放的就是 Actual type，就是“存储时的类型”。例如，`byte` 类型就是占用 1 个 byte，`int` 类型就是占用 4 个 byte。
- 在栈（Stack Area）上，更确切的说，就是 Stack Frame 当中的 operand stack 和 local variables 区域，存放的就是 Computational type。
  这个时候，类型就发生了变化，`boolean`、`byte`、`char`、`short` 都会被转换成 `int` 类型来进行计算。

在方法执行的时候，或者说方法里的 instruction 在执行的时候，需要将相关的数据加载到 Stack Frame 里；
更进一步的说，就是将数据加载到 operand stack 和 local variables 两个子区域当中。

![](/assets/images/java/asm/jvm-execution-model-2.png)

当数据加载到 operand stack 和 local variables 当中时，需要注意三点：

- 第一点，`boolean`, `byte`, `short`, `char`, or `int`，这几种类型，在 local variable 和 operand stack 当中，都是作为 `int` 类型进行处理。
- 第二点，`int`、`float` 和 `reference` 类型，在 local variable 和 operand stack 当中占用 1 个位置
- 第三点，`long` 和 `double` 类型，在 local variable 和 operand stack 当中占用 2 个位置

举个例子，在一个类当中，有一个 `byte` 类型的字段。
将该类加载进 JVM 当中，然后创建该类的对象实例，那么该对象实例是存储在堆（Heap Area）上的，其中的字段就是 `byte` 类型。
当程序运行过程中，会使用到该对象的字段，这个时候就要将 `byte` 类型的值转换成 `int` 类型进行计算；
计算完成之后，需要将值存储到该对象的字段当中，这个时候就会将 `int` 类型再转换成 `byte` 类型进行存储。

另外，对于 Category 为 `1` 的类型，在 operand stack 和 local variables 当中占用 1 个 slot 的位置；
对于对于 Category 为 `2` 的类型，在 operand stack 和 local variables 当中占用 2 个 slot 的位置。

下表的内容是来自于[Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)的[Table 2.11.1-B. Actual and Computational types in the Java Virtual Machine](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.11.1-320)部分。

| Actual type | Computational type | Category |
|-------------|--------------------|----------|
| boolean     | int                | 1        |
| byte        | int                | 1        |
| char        | int                | 1        |
| short       | int                | 1        |
| int         | int                | 1        |
| float       | float              | 1        |
| reference   | reference          | 1        |
| long        | long               | 2        |
| double      | double             | 2        |

在[2.11.1. Types and the Java Virtual Machine](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.11.1)谈到：
most operations on values of **actual types** `boolean`, `byte`, `char`, and `short` are correctly performed
by instructions operating on values of **computational type** `int`.

对于 local variable 是这样描述的：（内容来自于[2.6.1. Local Variables](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.6.1)）

- A single local variable can hold a value of type `boolean`, `byte`, `char`, `short`, `int`, `float`, `reference`, or `returnAddress`.
- A pair of local variables can hold a value of type `long` or `double`.

对于 operand stack 是这样描述的：（内容来自于[2.6.2. Operand Stacks](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.6.2)）

- Each entry on the operand stack can hold a value of any Java Virtual Machine type, including a value of type `long` or type `double`.
- At any point in time, an operand stack has an associated depth, where a value of type `long` or `double` contributes two units to the depth and a value of any other type contributes one unit.

## 总结

本文内容总结如下：

- 第一点，Execution Engine 是 JVM 的核心；JVM 文档中的 Instruction Set 就是对 Execution Engine 的行为描述；线程就是 Execution Engine 的运行实例。
- 第二点，线程所对应的内存空间是 JVM Stack，方法所对应的内存空间是 Stack Frame。
- 第三点，在 Stack Frame 当中，分成 local variable、operand stack 和 frame data 三个子区域；
  在 local variable 和 operand stack 中，要注意数据的计算类型和占用的空间大小。
