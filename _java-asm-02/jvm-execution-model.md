---
title:  "JVM Execution Model"
sequence: "103"
---

## Execution Engine

### JVM的核心

从JVM的架构的角度来说，它由Class Loader SubSystem、Runtime Data Areas和Execution Engine三个部分组成：

- 执行引擎（Execution Engine），主要负责方法体里的instruction内容，它是JVM的核心部分。
- 运行时数据区（Runtime Data Areas），主要负责为执行引擎（Execution Engine）提供“空间维度”的支持，为类（Class）、对象实例（object instance）、局部变量（local variable）提供存储空间。
- 类加载子系统（Class Loader SubSystem），负责加载具体的`.class`文件。

{:refdef: style="text-align: center;"}
![JVM Architecture](/assets/images/java/jvm/jvm-architecture.png)
{: refdef}
  
在JVM当中，数据类型分成primitive type和reference type两种，那么ClassLoader负责加载哪些类型呢？

- 对于primitive type是JVM内置的类型，不需要ClassLoader加载。
- 对于reference type来说，它又分成类（class types）、接口（interface types）和数组（array types）三种子类型。ClassLoader只负责加载类（class types）和接口（interface types），JVM内部会帮助我们创建数组（array types）。

At the core of any Java Virtual Machine implementation is its **execution engine**.



### JVM文档：指令集

在[The Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)中，它没有明确的提到Execution Engine的内容：打开JVM文档的每一章内容，搜索“execution engine”，会发现没有相关内容。

那么，这是不是意味着JVM文档与Execution Engine两者之间没有关系呢？其实，两者之间是有关系的。

可能是JVM文档描述的比较含蓄，它执行引擎（Execution Engine）的描述是通过指令集（Instruction Set）来体现的。

In the Java Virtual Machine specification, **the behavior of the execution engine** is defined in terms of **an instruction set**.

### 执行引擎：三种解读

The term "**execution engine**" can also be used in any of three senses: **an abstract specification**, **a concrete implementation**, or **a runtime instance**.

- **The abstract specification** defines the behavior of an execution engine in terms of the instruction set.
- **Concrete implementations**, which may use a variety of techniques, are either software, hardware, or a combination of both.
- **A runtime instance** of an execution engine is a thread.

**Each thread of a running Java application is a distinct instance of the virtual machine's execution engine**. From the beginning of its lifetime to the end, a thread is either executing bytecodes or native methods. A thread may execute bytecodes directly, by interpreting or executing natively in silicon, or indirectly, by just-in-time compiling and executing the resulting native code.

A Java Virtual Machine implementation may use other threads invisible to the running application, such as a thread that performs garbage collection. Such threads need not be "instances" of the implementation's execution engine. **All threads that belong to the running application, however, are execution engines in action.**

## Stack Frame

在现实生活当中，我们生活在一个三维的空间，在这个空间维度里，可以确定一个事物的具体位置；同时，也有一个时间维度，随着时间的流逝，这个事物的状态也会发生变化。**简单来说，对于一个具体事物，空间维度上就是看它占据一个什么位置，时间维度上就看它如何发生变化。** 接下来，我们把“空间维度”和“时间维度”的视角带入到JVM当中。

在JVM当中，是怎么体现“空间维度”视角和“时间维度”两个视角的呢？

- 时间维度。上面谈到执行引擎（Execution Engine），一条一条的执行instruction的内容，会引起相应事物的状态发生变化，这就是“时间维度”的视角。
- 空间维度。接下来要讲的JVM Stack和Stack Frame，它们都是运行时数据区（Runtime Data Areas）具体的内存空间分配，用于存储相应的数据，这就是“空间维度”视角。

{:refdef: style="text-align: center;"}
![JVM Architecture](/assets/images/java/jvm/jvm-architecture.png)
{: refdef}

### thread对应的区域：JVM Stack

上面提到，线程（thread）是执行引擎（Execution Engine）的运行实例，那么线程（thread）就是一个“时间维度”的视角。JVM Stack是运行时数据区（Runtime Data Areas）的一部分，是“空间维度”的视角。两者之间是什么样的关系呢？

Each Java Virtual Machine thread has a private Java Virtual Machine stack, created at the same time as the thread.

A Java Virtual Machine stack stores frames.

### method对应的区域：Stack Frame

我们如何看待方法（method）呢？或者说方法（method）是什么呢？方法（method），是一组instruction内容的有序集合；而instruction的执行，就对应着时间的流逝，所以方法（method）也可以理解成一个“时间片段”。

那么，线程（thread）和方法（method）是什么关系呢？线程（thread），从本质上来说，就是不同方法（method）之间的调用。所以，线程（thread）是更大的“时间片段”，而方法（method）是较小的“时间片段”。

如此看来，方法（method）是在“时间维度”的考量，在“空间维度”上有哪些体现呢？在“空间维度”上，就体现为Stack Frame。

- A new frame is created each time a method is invoked.
- A frame is destroyed when its method invocation completes, whether that completion is normal or abrupt (it throws an uncaught exception).

接下来，介绍current frame、current method和current class三个概念。

Only one frame, the frame for the executing method, is active at any point in a given thread of control. This frame is referred to as the **current frame**, and its method is known as the **current method**. The class in which the current method is defined is the **current class**.

一个方法会调用另外一个方法，另一个方法也有执行结束的时候。那么，current frame是如何变换的呢？

- A frame ceases to be current if its method invokes another method or if its method completes.
- When a method is invoked, a new frame is created and becomes current when control transfers to the new method.
- On method return, the current frame passes back the result of its method invocation, if any, to the previous frame.
- The current frame is then discarded as the previous frame becomes the current one.

### Stack Frame的内部结构

对于Stack Frame内存空间，主要分成三个子区域：

- 第一个子区域，operand stack。
- 第二个子区域，local variables。
- 第三个子区域，Frame Data，它用来存储与当前方法相关的数据。

{:refdef: style="text-align: center;"}
![](/assets/images/java/asm/jvm-execution-model-2.png)
{: refdef}

Each frame has its own array of local variables, its own operand stack, and a reference to the run-time constant pool of the class of the current method.

### Stack Frame内的数据类型

在方法执行的时候，或者说方法里的instruction在执行的时候，需要将相关的数据加载到Stack Frame里；更进一步的说，就是将数据加载到operand stack和local variables两个子区域当中。从数据结构的角度来说，

- operand stack子区域是一个栈结构，遵循后进先出（LIFO）的原则；
- local variables子区域是一个数组结构，通过索引值来获取和设置里面的数据，其索引值是从`0`开始。

当数据加载到operand stack和local variables当中时，需要注意三点：

- 第一点，`boolean`, `byte`, `short`, `char`, or `int`，这几种类型，在local variable和operand stack当中，都是作为`int`类型进行处理。
- 第二点，`int`、`float`和`reference`类型，在local variable和operand stack当中占用1个位置
- 第三点，`long`和`double`类型，在local variable和operand stack当中占用2个位置

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

在[2.11.1. Types and the Java Virtual Machine](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.11.1)谈到：most operations on values of **actual types** `boolean`, `byte`, `char`, and `short` are correctly performed by instructions operating on values of **computational type** `int`.

对于local variable是这样描述的：（内容来自于[2.6.1. Local Variables](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.6.1)）

- A single local variable can hold a value of type `boolean`, `byte`, `char`, `short`, `int`, `float`, `reference`, or `returnAddress`.
- A pair of local variables can hold a value of type `long` or `double`.

对于operand stack是这样描述的：（内容来自于[2.6.2. Operand Stacks](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.6.2)）

- Each entry on the operand stack can hold a value of any Java Virtual Machine type, including a value of type `long` or `type` double.
- At any point in time, an operand stack has an associated depth, where a value of type `long` or `double` contributes two units to the depth and a value of any other type contributes one unit.

## Stack Frame的变化

### 方法的初始Frame

在方法进入的时候，会生成相应的Stack Frame内存空间。那么，Stack Frame的初始状态是什么样的呢？

在Stack Frame当中，operand stack是空的，而local variables则需要考虑三方面的因素：

- 当前方法是否为static方法。如果当前方法是non-static方法，则需要在local variables索引为`0`的位置存在一个`this`变量；如果当前方法是static方法，则不需要存储`this`。
- 当前方法是否接收参数。方法接收的参数，会按照参数的声明顺序放到local variables当中。
- 方法参数是否包含`long`或`double`类型。如果方法的参数是`long`或`double`类型，那么它在local variables当中占用两个位置。

- 问题：能否在文档中找到依据呢？
- 回答：能。

The Java Virtual Machine uses **local variables** to pass parameters on **method invocation**. On **class method invocation**, any parameters are passed in consecutive local variables starting from local variable `0`. On **instance method invocation**, local variable `0` is always used to pass a reference to the object on which the instance method is being invoked (`this` in the Java programming language). Any parameters are subsequently passed in consecutive local variables starting from local variable `1`.（内容来自于[2.6.1. Local Variables](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.6.1)）

**The operand stack is empty** when the frame that contains it is created.（内容来自于[2.6.2. Operand Stacks](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.6.2)）

### 查看Stack Frame的变化

假如我们有一个`sample.HelloWorld`类：

```java
package sample;

public class HelloWorld {
    public void test(boolean flag) {
        if (flag) {
            System.out.println("value is true");
        }
        else {
            System.out.println("value is false");
        }
    }
}
```

接着，我们可以通过`javap -c sample.HelloWorld`命令查看方法包含的instruction内容：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test(boolean);
    Code:
       0: iload_1
       1: ifeq          15 (计算之后的值)
       4: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
       7: ldc           #3                  // String value is true
       9: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      12: goto          23 (计算之后的值)
      15: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
      18: ldc           #5                  // String value is false
      20: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      23: return
}

```

最后，我们可以通过运行`HelloWorldFrameCoreAdvanced`类来查看方法对应的Stack Frame的变化：

```text
test:(Z)V
                               // {this, int} | {}
0000: iload_1                  // {this, int} | {int}
0001: ifeq            14(真实值)// {this, int} | {}
0004: getstatic       #2       // {this, int} | {PrintStream}
0007: ldc             #3       // {this, int} | {PrintStream, String}
0009: invokevirtual   #4       // {this, int} | {}
0012: goto            11(真实值)// {} | {}
                               // {this, int} | {}
0015: getstatic       #2       // {this, int} | {PrintStream}
0018: ldc             #5       // {this, int} | {PrintStream, String}
0020: invokevirtual   #4       // {this, int} | {}
                               // {this, int} | {}
0023: return                   // {} | {}
```

在上面的输出结果中，我们会看到local variable和operand stack为`{} | {}`的情况，这是由于`AnalyzerAdapter`的实现当中将`locals`和`stack`的取值设置为`null`的情况，具体来说有四处：

- 在`AnalyzerAdapter.visitInsn(int opcode)`方法中，当`opcode`为`return`或`athrow`的情况
- 在`AnalyzerAdapter.visitJumpInsn(int opcode, Label label)`方法中，当`opcode`为`goto`的情况
- 在`AnalyzerAdapter.visitTableSwitchInsn(int min, int max, Label dflt, Label... labels)`方法中
- 在`AnalyzerAdapter.visitLookupSwitchInsn(Label dflt, int[] keys, Label[] labels)`方法中

另外，下面两个类的区别：

- `HelloWorldFrameCore`类是第一个版本，是在《Java ASM系列一：Core API》阶段引入的类，可以用来打印方法的Stack Frame的变化。
- `HelloWorldFrameCoreAdvanced`类是第二个版本，是在《Java ASM系列二：OPCODE》阶段引入的类，在第一个版本的基础上进行了改进：引入了instruction部分，精简了Stack Frame的类型显示。

五个视角：

- Java语言的视角，就是`sample.HelloWorld`里的代码怎么编写
- Instruction的视角，就是`javap -c sample.HelloWorld`，这里给出的就是标准的opcode内容
- ASM的视角，就是编写ASM代码实现某种功能，这里主要是对`visitXxxInsn()`方法的调用，与实际的opcode可能相同，也可能有差异。
- Frame的视角，就是JVM内存空间的视角，就是local variable和operand stack的变化。
- JVM Specification的视角，参考JVM文档，它是怎么说的
