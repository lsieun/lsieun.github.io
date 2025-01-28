---
title: "Method Analysis"
sequence: "401"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## Method Analysis

### 类的主要分析对象

Java ASM是一个操作字节码（bytecode）的工具，而字节码（bytecode）的一种具体存在形式就是一个`.class`文件。现在，我们要进行分析，就可以称之为Class Analysis。

![What ASM Can Do](/assets/images/java/asm/what-asm-can-do.png)

在类（Class）当中，主要由字段（Field）和方法（Method）组成。如果我们仔细思考一下，其实字段（Field）本身没有什么太多内容可以分析的，**主要的分析对象是方法（Method）**。因为在方法（Method）中，它包含了主要的代码处理逻辑。

因此，我们可以粗略的认为Class Analysis和Method Analysis指代同一个事物，不做严格区分。

### 方法的主要分析对象

**在方法分析（method analysis）中有三个主要的分析对象：Instruction、Frame和Control Flow Graph。**

```java
public class HelloWorld {
    public void test(int val) {
        if (val == 0) {
            System.out.println("val is 0");
        }
        else {
            System.out.println("val is unknown");
        }
    }
}
```

![方法分析的三个对象](/assets/images/java/asm/method-analysis-three-target.png)

对于Frame的分析就是**data flow analysis**，对于control flow graph的分析就是**control flow analysis**。

### DFA和CFA的区别

A **data flow analysis** consists in computing **the state of the execution frames** of a method, for each instruction of this method.
This state can be represented in a more or less abstract way.
For example reference values can be represented by a single value, by one value per class,
by three possible values in the `{ null, not null, may be null }` set, etc.

A **control flow analysis** consists in computing **the control flow graph** of a method, and in performing analysis on this graph.
The control flow graph is a graph whose nodes are instructions,
and whose oriented edges connect two instructions `i → j` if `j` can be executed just after `i`.

那么，data flow analysis和control flow analysis的区别：

- data flow analysis注重于“细节”，它需要明确计算出每一个instruction在local variable和operand stack当中的值。
- control flow analysis注重于“整体”，它不关注具体的值，而是关注于整体上指令之间前后连接或跳转的逻辑关系。

接下来，举一个比喻的例子来帮助理解。在《礼记·大学》里谈到几件事情：正心、修身、齐家、治国、平天下。这几件事情，很容易让人们感受到它们处在不同的层次上，但是本质上又是贯通的。那么，大家也将data flow analysis和control flow analysis可以理解为“同一件事物在不同层次上的表达”：两者都是在方法的instructions的基础上生成的，data flow analysis注重每一条instruction对应的Frame的状态，类似于“齐家”层次，而control flow analysis注意多个instructions之间的连接/跳转关系，类似于“治国”层次。

```text
古之欲明明德于天下者，先治其国；
欲治其国者，先齐其家；
欲齐其家者，先修其身；
欲修其身者，先正其心；
欲正其心者，先诚其意；
欲诚其意者，先致其知，
致知在格物。
物格而后知至，
知至而后意诚，
意诚而后心正，
心正而后身修，
身修而后家齐，
家齐而后国治，
国治而后天下平。
```

### 方法分析的分类

对于方法的分析，分成两种类型：

- 第一种，就是静态分析（static analysis），不需要运行程序，可以直接针对源码或字节码（bytecode）进行分析。
- 第二种，就是动态分析（dynamic analysis），需要运行程序，是在运行过程中获取数据来进行分析。

- **static analysis** is the analysis of computer software that is performed without actually executing programs.
- **dynamic analysis** is the analysis of computer software that is performed by executing programs on a real or virtual processor.

我们主要介绍data flow analysis和control flow analysis，但这两种analysis都是属于static analysis：

- Method Analysis
  - static analysis
    - data flow analysis
    - control flow analysis
  - dynamic analysis

另外，data flow analysis和control flow analysis有一些不适合的场景：

- 不适用于反射（reflection），例如通过反射调用某一个具体的方法。
- 不适用于动态绑定（dynamic binding），例如子类覆写了父类的方法，方法在执行的时候体现出子类的行为。

因为静态分析，是在程序进入JVM之前发生的；动态分析，是在程序进入JVM之后发生的。上面这两种情况都是在程序运行过程中，才是它们发挥作用的时候，使用静态分析的技术不容易解决这样的问题。当使用到某个语言特性的时候，可以看看它是什么时候发挥作用的。

## asm-analysis.jar

The ASM API for code analysis is in the `org.objectweb.asm.tree.analysis` package.
As the package name implies, it is based on the tree API.

在上面介绍的data flow analysis和control flow analysis就是通过`asm-analysis.jar`当中定义的类来实现的。

### 涉及到哪些类

在学习`asm-analysis.jar`时，我们的重点是理解`Analyzer`、`Frame`、`Interpreter`和`Value`这四个类之间的关系：

- `Interpreter`类，依赖于`Value`类
- `Frame`类，依赖于`Interpreter`和`Value`类
- `Analyzer`类，依赖于`Frame`、`Interpreter`和`Value`类

这四个类的依赖关系也可以表示成如下：

- `Analyzer`
  - `Frame`
  - `Interpreter`
    - `Value`

除了这四个主要的类，还有一些类是`Interpreter`和`Value`的子类：

```text
┌───┬───────────────────┬─────────────┐
│ 0 │    Interpreter    │    Value    │
├───┼───────────────────┼─────────────┤
│ 1 │ BasicInterpreter  │ BasicValue  │
├───┼───────────────────┼─────────────┤
│ 2 │   BasicVerifier   │ BasicValue  │
├───┼───────────────────┼─────────────┤
│ 3 │  SimpleVerifier   │ BasicValue  │
├───┼───────────────────┼─────────────┤
│ 4 │ SourceInterpreter │ SourceValue │
└───┴───────────────────┴─────────────┘
```

### 四个类如何协作

在`asm-analysis.jar`当中，是如何实现data flow analysis和control flow analysis的呢？

Two types of **data flow analysis** can be performed:

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

`Analyzer`和`Frame`是属于“固定”的部分，而`Interpreter`和`Value`类是属于“变化”的部分。

```text
┌──────────┬─────────────┐
│          │  Analyzer   │
│  Fixed   ├─────────────┤
│          │    Frame    │
├──────────┼─────────────┤
│          │ Interpreter │
│ Variable ├─────────────┤
│          │    Value    │
└──────────┴─────────────┘
```

Although the primary goal of the framework is to perform **data flow analysis**,
the `Analyzer` class can also construct the **control flow graph** of the analysed method.
This can be done by overriding the `newControlFlowEdge` and `newControlFlowExceptionEdge` methods of this class, which by default do nothing.
The result can be used for doing **control flow analysis**.

```text
            ┌─── data flow analysis
            │
Analyzer ───┤
            │
            └─── control flow analysis
```

### 主要讲什么

在本章当中，我们会围绕着`asm-analysis.jar`来展开，那么我们主要讲什么内容呢？主要讲以下两行代码：

```text
   ┌── Analyzer
   │        ┌── Value                                   ┌── Interpreter
   │        │                                           │
Analyzer<BasicValue> analyzer = new Analyzer<>(new BasicInterpreter());
Frame<BasicValue>[] frames = analyzer.analyze(owner, mn);
   │        │
   │        └── Value
   └── Frame
```

不管我们讲多少的内容细节，它们的最终落角点仍然是这两行代码，它是贯穿这一章内容的核心点。我们的目的就是拿到这个`frames`值，然后用它进行分析。

## HelloWorldFrameTree类

在[项目](https://gitee.com/lsieun/learn-java-asm)当中，有一个`HelloWorldFrameTree`类，它的作用就是打印出Instruction和Frame的信息。

```java
public class HelloWorldFrameTree {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes = FileUtils.readBytes(filepath);

        // (1)构建ClassReader
        ClassReader cr = new ClassReader(bytes);

        // (2) 构建ClassNode
        ClassNode cn = new ClassNode();
        cr.accept(cn, ClassReader.SKIP_FRAMES | ClassReader.SKIP_DEBUG);

        // (3) 查看方法Instruction和Frame
        String owner = cn.name;
        List<MethodNode> methods = cn.methods;
        for (MethodNode mn : methods) {
            print(owner, mn, 3);
        }
    }
}
```

为了展示`HelloWorldFrameTree`类的功能，让我们准备一个`HelloWorld`类：

```java
public class HelloWorld {
    public void test(boolean flag, int val) {
        Object obj;
        if (flag) {
            obj = Integer.valueOf(val);
        }
        else {
            obj = Long.valueOf(val);
        }
        System.out.println(obj);
    }
}
```

### BasicInterpreter

如果使用`BasicInterpreter`类，所有的引用类型（reference type）都使用`R`来表示：

```text
test:(ZI)V
000:    iload_1                                 {R, I, I, .} | {}
001:    ifeq L0                                 {R, I, I, .} | {I}
002:    iload_2                                 {R, I, I, .} | {}
003:    invokestatic Integer.valueOf            {R, I, I, .} | {I}
004:    astore_3                                {R, I, I, .} | {R}
005:    goto L1                                 {R, I, I, R} | {}
006:    L0                                      {R, I, I, .} | {}
007:    iload_2                                 {R, I, I, .} | {}
008:    i2l                                     {R, I, I, .} | {I}
009:    invokestatic Long.valueOf               {R, I, I, .} | {J}
010:    astore_3                                {R, I, I, .} | {R}
011:    L1                                      {R, I, I, R} | {}
012:    getstatic System.out                    {R, I, I, R} | {}
013:    aload_3                                 {R, I, I, R} | {R}
014:    invokevirtual PrintStream.println       {R, I, I, R} | {R, R}
015:    return                                  {R, I, I, R} | {}
================================================================
```

### SimpleVerifier

如果使用`SimpleVerifier`类，每一个不同的引用类型（reference type）都有自己的表示形式：

```text
test:(ZI)V
000:    iload_1                                 {HelloWorld, I, I, .} | {}
001:    ifeq L0                                 {HelloWorld, I, I, .} | {I}
002:    iload_2                                 {HelloWorld, I, I, .} | {}
003:    invokestatic Integer.valueOf            {HelloWorld, I, I, .} | {I}
004:    astore_3                                {HelloWorld, I, I, .} | {Integer}
005:    goto L1                                 {HelloWorld, I, I, Integer} | {}
006:    L0                                      {HelloWorld, I, I, .} | {}
007:    iload_2                                 {HelloWorld, I, I, .} | {}
008:    i2l                                     {HelloWorld, I, I, .} | {I}
009:    invokestatic Long.valueOf               {HelloWorld, I, I, .} | {J}
010:    astore_3                                {HelloWorld, I, I, .} | {Long}
011:    L1                                      {HelloWorld, I, I, Number} | {}
012:    getstatic System.out                    {HelloWorld, I, I, Number} | {}
013:    aload_3                                 {HelloWorld, I, I, Number} | {PrintStream}
014:    invokevirtual PrintStream.println       {HelloWorld, I, I, Number} | {PrintStream, Number}
015:    return                                  {HelloWorld, I, I, Number} | {}
================================================================
```

### SourceInterpreter

如果使用`SourceInterpreter`类，可以查看指令（Instruction）与Frame（local variable和operand stack）值的关系：

```text
test:(ZI)V
000:    iload_1                                 {[], [], [], []} | {}
001:    ifeq L0                                 {[], [], [], []} | {[iload_1]}
002:    iload_2                                 {[], [], [], []} | {}
003:    invokestatic Integer.valueOf            {[], [], [], []} | {[iload_2]}
004:    astore_3                                {[], [], [], []} | {[invokestatic Integer.valueOf]}
005:    goto L1                                 {[], [], [], [astore_3]} | {}
006:    L0                                      {[], [], [], []} | {}
007:    iload_2                                 {[], [], [], []} | {}
008:    i2l                                     {[], [], [], []} | {[iload_2]}
009:    invokestatic Long.valueOf               {[], [], [], []} | {[i2l]}
010:    astore_3                                {[], [], [], []} | {[invokestatic Long.valueOf]}
011:    L1                                      {[], [], [], [astore_3, astore_3]} | {}
012:    getstatic System.out                    {[], [], [], [astore_3, astore_3]} | {}
013:    aload_3                                 {[], [], [], [astore_3, astore_3]} | {[getstatic System.out]}
014:    invokevirtual PrintStream.println       {[], [], [], [astore_3, astore_3]} | {[getstatic System.out], [aload_3]}
015:    return                                  {[], [], [], [astore_3, astore_3]} | {}
================================================================
```

在`011`行，有`[astore_3, astore_3]`，那么为什么有两个`astore_3`呢？

为了回答这个问题，我们也可以换一种方式来显示，查看指令索引（Instruction Index）与Frame值之间的关系：

```text
test:(ZI)V
000:    iload_1                                 {[], [], [], []} | {}
001:    ifeq L0                                 {[], [], [], []} | {[0]}
002:    iload_2                                 {[], [], [], []} | {}
003:    invokestatic Integer.valueOf            {[], [], [], []} | {[2]}
004:    astore_3                                {[], [], [], []} | {[3]}
005:    goto L1                                 {[], [], [], [4]} | {}
006:    L0                                      {[], [], [], []} | {}
007:    iload_2                                 {[], [], [], []} | {}
008:    i2l                                     {[], [], [], []} | {[7]}
009:    invokestatic Long.valueOf               {[], [], [], []} | {[8]}
010:    astore_3                                {[], [], [], []} | {[9]}
011:    L1                                      {[], [], [], [4, 10]} | {}
012:    getstatic System.out                    {[], [], [], [4, 10]} | {}
013:    aload_3                                 {[], [], [], [4, 10]} | {[12]}
014:    invokevirtual PrintStream.println       {[], [], [], [4, 10]} | {[12], [13]}
015:    return                                  {[], [], [], [4, 10]} | {}
================================================================
```

## ControlFlowGraphRun类

使用`ControlFlowGraphRun`类，可以生成指令的流程图，重点是修改`display`方法的第三个参数，推荐使用`ControlFlowGraphType.STANDARD`。

```java
public class ControlFlowGraphRun {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes = FileUtils.readBytes(filepath);

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes);

        //（2）生成ClassNode
        ClassNode cn = new ClassNode();

        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cn, parsingOptions);

        //（3）查找方法
        String methodName = "test";
        MethodNode targetNode = null;
        for (MethodNode mn : cn.methods) {
            if (mn.name.equals(methodName)) {
                targetNode = mn;
                break;
            }
        }
        if (targetNode == null) {
            System.out.println("Can not find method: " + methodName);
            return;
        }

        //（4）进行图形化显示
        System.out.println("Origin:");
        display(cn.name, targetNode, ControlFlowGraphType.NONE);
        System.out.println("Control Flow Graph:");
        display(cn.name, targetNode, ControlFlowGraphType.STANDARD);

        //（5）打印复杂度
        int complexity = CyclomaticComplexity.getCyclomaticComplexity(cn.name, targetNode);
        String line = String.format("%s:%s complexity: %d", targetNode.name, targetNode.desc, complexity);
        System.out.println(line);
    }
}
```

## 总结

本文内容总结如下：

- 第一点，在Method Analysis中，主要的分析对象是Instruction、Frame和Control Flow Graph。
- 第二点，在`asm-analysis.jar`当中，主要有`Analyzer`、`Frame`、`Interpreter`和`Value`四个类来进行data flow analysis和control flow analysis。
- 第三点，使用`HelloWorldFrameTree`类来查看instructions对应的不同的frames形式。
- 第四点，使用`ControlFlowGraphRun`类来查看instructions对应的control flow graph。
