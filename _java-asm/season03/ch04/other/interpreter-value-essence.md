---
title: "Interpreter和Value的精妙之处"
sequence: "413"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## 内容回顾

首先，我们要强调：**在`asm-analysis.jar`当中，最重要的类就是`Analyzer`、`Frame`、`Interpreter`和`Value`四个类**。

其次，贯穿本章内容的核心就是下面两行代码：

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

在这两行代码当中，用到了`Analyzer`、`Frame`、`Interpreter`和`Value`这四个类：

- 第一行代码，使用`Interpreter`来创建`Analyzer`对象。
- 第二行代码，调用`Analyzer.analyze`方法生成`Frame<?>[]`信息，之后可以进行各种不同类型的分析。

再者，这四个类当中，`Analyzer`和`Frame`是相对固定的，而`Interpreter`和`Value`是变化的：

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

最后，`Interpreter`和`Value`类有不同的具体表现形式：

```text
┌───┬───────────────────┬─────────────┬───────┐
│ 0 │    Interpreter    │    Value    │ Range │
├───┼───────────────────┼─────────────┼───────┤
│ 1 │ BasicInterpreter  │ BasicValue  │   7   │
├───┼───────────────────┼─────────────┼───────┤
│ 2 │   BasicVerifier   │ BasicValue  │   7   │
├───┼───────────────────┼─────────────┼───────┤
│ 3 │  SimpleVerifier   │ BasicValue  │   N   │
├───┼───────────────────┼─────────────┼───────┤
│ 4 │ SourceInterpreter │ SourceValue │   N   │
└───┴───────────────────┴─────────────┴───────┘
```

回顾了这些内容之后，我们再来看一下`Interpreter`和`Value`的精妙之处。

## Interpreter类的精妙之处

`Interpreter`类的精妙之处体现在它的功能上，我们从三点来把握，来欣赏`Interpreter`类的“艺术和美”。

第一点，从功能的角度来讲，`Interpreter`类与`Frame`类的功能分割恰到好处：入栈和出栈的操作交给了`Frame`来进行处理，而具体的入栈和出栈的值是由`Interpreter`来处理的。举一个生活中的例子，国有资本（Government Capital，相当于`Frame`类）新建了一个高铁站，进入车站的车辆和离开车站的车辆是它来负责的；具体的运作交给民营资本（Private Investment，相当于`Interpreter`类），每辆车上装载的是货物还是人是由它来决定的。

第二点，从opcode的角度来讲，它将原本200多个opcode分类成（浓缩成）了7个方法，分类的依据就是使用的（或者说，消耗的、出栈的、入栈的）元素数量来决定的。

```text
public abstract class Interpreter {
    public abstract Value newOperation(AbstractInsnNode insn) throws AnalyzerException;

    public abstract Value copyOperation(AbstractInsnNode insn, Value value) throws AnalyzerException;

    public abstract Value unaryOperation(AbstractInsnNode insn, Value value) throws AnalyzerException;

    public abstract Value binaryOperation(AbstractInsnNode insn, Value value1, Value value2) throws AnalyzerException;

    public abstract Value ternaryOperation(AbstractInsnNode insn, Value value1, Value value2, Value value3) throws AnalyzerException;

    public abstract Value naryOperation(AbstractInsnNode insn, List<Value> values) throws AnalyzerException;

    public abstract void returnOperation(AbstractInsnNode insn, Value value, Value expected) throws AnalyzerException;
}
```

第三点，从`Value`的角度来讲，`Interpreter`类决定了`Value`类对象的数量、表达能力。一般来说，`Value`类对象的数量越多，它的表达能力越丰富。举个生活当中的例子，这有点类似于“计划生育”，`Interpreter`类决定了`Value`类的数量。

## Value类的表达能力

在Frame当中，我们可以存储的`Value`值有两种：**类型**（type或者class）和**实例对象**（object或者instance）。

```text
public class HelloWorld {
    public void test() {
        int a = 1;
        int b = 2;
        String str1 = "Hello";
        String str2 = "World";
        Object obj1 = new Object();
        Object obj2 = new Object();
    }
}
```

如果使用`BasicInterpreter`类，那么`BasicValue`值的表达能力（**类型**）如下：每个类型

```text
test:()V
000:    iconst_1                                {R, ., ., ., ., ., .} | {}
001:    istore_1                                {R, ., ., ., ., ., .} | {I}
002:    iconst_2                                {R, I, ., ., ., ., .} | {}
003:    istore_2                                {R, I, ., ., ., ., .} | {I}
004:    ldc "Hello"                             {R, I, I, ., ., ., .} | {}
005:    astore_3                                {R, I, I, ., ., ., .} | {R}
006:    ldc "World"                             {R, I, I, R, ., ., .} | {}
007:    astore 4                                {R, I, I, R, ., ., .} | {R}
008:    new Object                              {R, I, I, R, R, ., .} | {}
009:    dup                                     {R, I, I, R, R, ., .} | {R}
010:    invokespecial Object.<init>             {R, I, I, R, R, ., .} | {R, R}
011:    astore 5                                {R, I, I, R, R, ., .} | {R}
012:    new Object                              {R, I, I, R, R, R, .} | {}
013:    dup                                     {R, I, I, R, R, R, .} | {R}
014:    invokespecial Object.<init>             {R, I, I, R, R, R, .} | {R, R}
015:    astore 6                                {R, I, I, R, R, R, .} | {R}
016:    return                                  {R, I, I, R, R, R, R} | {}
================================================================
```

如果使用`SimpleVerifier`类，那么`BasicValue`值的表达能力（**对象实例**）如下：每个不同的对象对应一个`BasicValue`值。

```text
test:()V
000:    iconst_1                                {HelloWorld, ., ., ., ., ., .} | {}
001:    istore_1                                {HelloWorld, ., ., ., ., ., .} | {I}
002:    iconst_2                                {HelloWorld, I, ., ., ., ., .} | {}
003:    istore_2                                {HelloWorld, I, ., ., ., ., .} | {I}
004:    ldc "Hello"                             {HelloWorld, I, I, ., ., ., .} | {}
005:    astore_3                                {HelloWorld, I, I, ., ., ., .} | {String}
006:    ldc "World"                             {HelloWorld, I, I, String, ., ., .} | {}
007:    astore 4                                {HelloWorld, I, I, String, ., ., .} | {String}
008:    new Object                              {HelloWorld, I, I, String, String, ., .} | {}
009:    dup                                     {HelloWorld, I, I, String, String, ., .} | {Object}
010:    invokespecial Object.<init>             {HelloWorld, I, I, String, String, ., .} | {Object, Object}
011:    astore 5                                {HelloWorld, I, I, String, String, ., .} | {Object}
012:    new Object                              {HelloWorld, I, I, String, String, Object, .} | {}
013:    dup                                     {HelloWorld, I, I, String, String, Object, .} | {Object}
014:    invokespecial Object.<init>             {HelloWorld, I, I, String, String, Object, .} | {Object, Object}
015:    astore 6                                {HelloWorld, I, I, String, String, Object, .} | {Object}
016:    return                                  {HelloWorld, I, I, String, String, Object, Object} | {}
================================================================
```

如果使用`SourceInterpreter`类，那么`SourceValue`值的表达能力（**对象实例**）如下：差不多每个instruction都会生成一个新的`SourceValue`对象

```text
test:()V
000:    iconst_1                                {[], [], [], [], [], [], []} | {}
001:    istore_1                                {[], [], [], [], [], [], []} | {[iconst_1]}
002:    iconst_2                                {[], [istore_1], [], [], [], [], []} | {}
003:    istore_2                                {[], [istore_1], [], [], [], [], []} | {[iconst_2]}
004:    ldc "Hello"                             {[], [istore_1], [istore_2], [], [], [], []} | {}
005:    astore_3                                {[], [istore_1], [istore_2], [], [], [], []} | {[ldc "Hello"]}
006:    ldc "World"                             {[], [istore_1], [istore_2], [astore_3], [], [], []} | {}
007:    astore 4                                {[], [istore_1], [istore_2], [astore_3], [], [], []} | {[ldc "World"]}
008:    new Object                              {[], [istore_1], [istore_2], [astore_3], [astore 4], [], []} | {}
009:    dup                                     {[], [istore_1], [istore_2], [astore_3], [astore 4], [], []} | {[new Object]}
010:    invokespecial Object.<init>             {[], [istore_1], [istore_2], [astore_3], [astore 4], [], []} | {[new Object], [dup]}
011:    astore 5                                {[], [istore_1], [istore_2], [astore_3], [astore 4], [], []} | {[new Object]}
012:    new Object                              {[], [istore_1], [istore_2], [astore_3], [astore 4], [astore 5], []} | {}
013:    dup                                     {[], [istore_1], [istore_2], [astore_3], [astore 4], [astore 5], []} | {[new Object]}
014:    invokespecial Object.<init>             {[], [istore_1], [istore_2], [astore_3], [astore 4], [astore 5], []} | {[new Object], [dup]}
015:    astore 6                                {[], [istore_1], [istore_2], [astore_3], [astore 4], [astore 5], []} | {[new Object]}
016:    return                                  {[], [istore_1], [istore_2], [astore_3], [astore 4], [astore 5], [astore 6]} | {}
================================================================
```

我们暂时不考虑primitive type（`int`、`float`、`long`和`double`类型），只考虑reference type：

```text
模拟类型（抽象）: R - BasicInterpreter, BasicVerifier
模拟类型（具体）: Integer, String, Object - StackMapTable
模拟对象（具体）: Integer(1), Integer(2), String("AAA"), String("BBB"), Object(obj1), Object(obj2) - SimpleVerifier
模拟指令（超级具体）: 每个指令对应一个Value对象 - SourceInterpreter
```

那么`Value`的表达能力可以描述成这样：

```text
         ┌─── abstract type
         │
         ├─── concrete type
Value ───┤
         ├─── concrete object
         │
         └─── instruction-based object
```

## 总结

本文内容总结如下：

- 第一点，把握`Interpreter`类的精妙之处就是结合`Frame`（功能切割）、opcode（方法定义）和`Value`（表达能力）来理解。
- 第二点，把握`Value`类的精妙之处在于理解四个不同层次的表达。
