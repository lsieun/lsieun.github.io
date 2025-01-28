---
title: "JVM Execution Model"
sequence: "105"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## Execution Model

### 什么是 Execution Model

在[asm4-guide.pdf](https://asm.ow2.io/asm4-guide.pdf)文档的 `3.1.1. Execution Model` 部分提到了 Execution Model。

那么，Execution Model 是什么呢？
其实，**Execution Model 就是指 Stack Frame 简化之后的模型**。
如何“简化”呢？也就是，我们不需要去考虑 Stack Frame 的技术实现细节，把它想像一个理想的模型就可以了。

针对 Execution Model 或 Stack Frame，我们可以理解成它由 local variable 和 operand stack 两个部分组成。
或者说，理解成：它由 local variable、operand stack 和 frame data 三个部分组成。
换句话说，local variable 和 operand stack 是两个必不可少的部分，而 frame data 是一个相对来说不那么重要的部分。
在一般的描述当中，都是将 Stack Frame 描述成 local variable 和 operand stack 两个部分；
但是，如果我们为了知识的完整性，就可以考虑添加上 frame data 这个部分。

![](/assets/images/java/asm/jvm-execution-model-2.png)

另外，方法的执行与 Stack Frame 之间有一个非常紧密的关系：

- 一个方法的调用开始，就对应着 Stack Frame 的内存空间的分配。
- 一个方法的执行结束，无论正常结束（return），还是异常退出（throw exception），都表示着相应的 Stack Frame 内存空间被销毁。

接下来，我们就通过两个方面来把握 Stack Frame 的状态：

- 第一个方面，方法刚进入的时候，任何的 instruction 都没有执行，那么 Stack Frame 是一个什么样的状态呢？
- 第二个方面，在方法开始执行后，这个时候 instruction 开始执行，每一条 instruction 的执行，会对 Stack Frame 的状态产生什么样的影响呢？

### 方法的初始状态

在方法进入的时候，会生成相应的 Stack Frame 内存空间。那么，Stack Frame 的初始状态是什么样的呢？


在 Stack Frame 当中，operand stack 是空的，而 local variables 则需要考虑三方面的因素：

- 当前方法是否为 static 方法。
  - 如果当前方法是 non-static 方法，则需要在 local variables 索引为 `0` 的位置存在一个 `this` 变量，后续的内容从 `1` 开始存放。
  - 如果当前方法是 static 方法，则不需要存储 `this`，因此后续的内容从 `0` 开始存放。
- 当前方法是否接收参数。方法接收的参数，会按照参数的声明顺序放到 local variables 当中。
- 方法参数是否包含 `long` 或 `double` 类型。如果方法的参数是 `long` 或 `double` 类型，那么它在 local variables 当中占用两个位置。

- 问题：能否在文档中找到依据呢？
- 回答：能。

The Java Virtual Machine uses **local variables** to pass parameters on **method invocation**.
On **class method invocation**,
any parameters are passed in consecutive local variables starting from local variable `0`.
On **instance method invocation**, local variable `0` is always used to pass a reference to the object
on which the instance method is being invoked (`this` in the Java programming language).
Any parameters are subsequently passed in consecutive local variables starting from local variable `1`.
（内容来自于[2.6.1. Local Variables](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.6.1)）

**The operand stack is empty** when the frame that contains it is created.
（内容来自于[2.6.2. Operand Stacks](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.6.2)）

### 方法的后续变化

方法的后续变化，就是在方法初始状态的基础上，随着 instruction 的执行而对 local variable 和 operand stack 的状态产生影响。

当方法执行时，就是将 instruction 一条一条的执行：

- 第一步，获取 instruction。每一条 instruction 都是从 `instructions` 内存空间中取出来的。
- 第二步，执行 instruction。对于 instruction 的执行，就会引起 operand stack 和 local variables 的状态变化。
  - 在执行 instruction 过程中，需要获取相关资源。通过 `ref` 可以获取 runtime constant pool 的“资源”，例如一个字符串的内容，一个指向方法的物理内存地址。

在[Chapter 2. The Structure of the Java Virtual Machine](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html)的[2.11. Instruction Set Summary](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.11)部分，对程序的执行进行了如下描述：

Ignoring exceptions, the inner loop of a Java Virtual Machine interpreter is effectively:

```text
do {
    atomically calculate pc and fetch opcode at pc;
    if (operands) fetch operands;
    execute the action for the opcode;
} while (there is more to do);
```

![](/assets/images/java/asm/jvm-execution-model-2.png)

需要注意的是，虽然 local variable 和 operand stack 是 Stack Frame 当中两个最重要的结构，
两者是处于一个平等的地位上，缺少任何一个都无法正常工作；
但是，从使用频率的角度来说，两者还是有很大的差别。
先举个生活当中的例子，operand stack 类似于“公司”，local variables 类似于“临时租的房子”，
虽然说“公司”和“临时租的房子”是我们经常待的场所，是两个非常重要的地方，
但是我们工作的时间大部是在“公司”进行的，少部分工作时间是在“家”里进行。
也就是说，大多数情况下，都是先把数据加载到 operand stack 上，在 operand stack 上进行运算，
最后可能将数据存储到 local variables 当中。
只有少部分的操作（例如 `iinc`），只需要在 local variable 上就能完成。
所以从使用频率的角度来说，**operand stack 是进行工作的“主战场”，使用频率就比较高，大多数工作都是在它上面完成；
而 local variable 使用频率就相对较低，它只是提供一个临时的数据存储区域**。

## 查看方法的 Stack Frame 变化

在这个部分，我们介绍一下如何使用 `HelloWorldFrameCore02` 类查看方法对应的 Stack Frame 的变化。

### 两个版本

在课程代码中，查看方法对应的 Stack Frame 的变化，有两个类的版本：

- 第一个版本，是 `HelloWorldFrameCore` 类。它是在《Java ASM 系列一：Core API》阶段引入的类，可以用来打印方法的 Stack Frame 的变化。为了保证与以前内容的一致性，我们保留了这个类的代码逻辑不变动。
- 第二个版本，是 `HelloWorldFrameCore02` 类。它是在《Java ASM 系列二：OPCODE》阶段引入的类，在第一个版本的基础上进行了改进：引入了 instruction 部分，精简了 Stack Frame 的类型显示。

我们在使用的时候，直接使用第二个版本就可以了，也就是使用 `HelloWorldFrameCore02` 类。

### 三个部分

我们在执行 `HelloWorldFrameCore02` 类之后，输出结果分成三个部分：

- 第一部分，是 offset，它表示某一条 instruction 的具体位置或偏移量。
- 第二部分，是 instructions，它表示方法里包含的所有指令信息。
- 第三部分，是 local variable 和 operand stack 中存储的具体数据类型。
  - 格式：`{local variable types} | {operand stack types}`
  - 第一行的 local variable 和 operand stack 表示“方法的初始状态”。
  - 其后每一行 instruction
    - 上一行的 local variable 和 operand stack 表示该 instruction 执行之前的状态
    - 与该 instruction 位于同一行 local variable 和 operand stack 表示该 instruction 执行之后的状态

![](/assets/images/java/asm/offset-instructions-local-variable-and-operand-stack-second-version.png)

在上面的输出结果中，我们会看到 local variable 和 operand stack 为 `{} | {}` 的情况，这是四种特殊情况。

### 四种情况

在 `HelloWorldFrameCore02` 类当中，会间接使用到 `AnalyzerAdapter` 类。
在 `AnalyzerAdapter` 类的代码中，将 `locals` 和 `stack` 字段的取值设置为 `null` 的情况，就会有上面 `{} | {}` 的情况。

在 `AnalyzerAdapter` 类的代码中，有四个方法会将 `locals` 和 `stack` 字段设置为 `null`：

- 在 `AnalyzerAdapter.visitInsn(int opcode)` 方法中，当 `opcode` 为 `return` 或 `athrow` 的情况
- 在 `AnalyzerAdapter.visitJumpInsn(int opcode, Label label)` 方法中，当 `opcode` 为 `goto` 的情况
- 在 `AnalyzerAdapter.visitTableSwitchInsn(int min, int max, Label dflt, Label... labels)` 方法中
- 在 `AnalyzerAdapter.visitLookupSwitchInsn(Label dflt, int[] keys, Label[] labels)` 方法中

### 五个视角

在后续内容中，我们介绍代码示例的时候，一般都会从五个视角来学习：

- 第一个视角，Java 语言的视角，就是 `sample.HelloWorld` 里的代码怎么编写。
- 第二个视角，Instruction 的视角，就是 `javap -c sample.HelloWorld`，这里给出的就是标准的 opcode 内容。
- 第三个视角，ASM 的视角，就是编写 ASM 代码实现某种功能，这里主要是对 `visitXxxInsn()` 方法的调用，与实际的 opcode 可能相同，也可能有差异。
- 第四个视角，Frame 的视角，就是 JVM 内存空间的视角，就是 local variable 和 operand stack 的变化。
- 第五个视角，JVM Specification 的视角，参考 JVM 文档，它是怎么说的。

第一个视角，Java 语言的视角。假如我们有一个 `sample.HelloWorld` 类，代码如下：

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

第二个视角，Instruction 的视角。我们可以通过 `javap -c sample.HelloWorld` 命令查看方法包含的 instruction 内容：

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

第三个视角，ASM 的视角。运行 `ASMPrint` 类，可以查看 ASM 代码，可以查看某一个 opcode 具体对应于哪一个 `MethodVisitor.visitXxxInsn()` 方法：

```text
Label label0 = new Label();
Label label1 = new Label();

methodVisitor.visitCode();
methodVisitor.visitVarInsn(ILOAD, 1);
methodVisitor.visitJumpInsn(IFEQ, label0);
methodVisitor.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
methodVisitor.visitLdcInsn("value is true");
methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
methodVisitor.visitJumpInsn(GOTO, label1);

methodVisitor.visitLabel(label0);
methodVisitor.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
methodVisitor.visitLdcInsn("value is false");
methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);

methodVisitor.visitLabel(label1);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 2);
methodVisitor.visitEnd();
```

第四个视角，Frame 的视角。我们可以通过运行 `HelloWorldFrameCore02` 类来查看方法对应的 Stack Frame 的变化：

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

第五个视角，JVM Specification 的视角。我们可以参考[Chapter 6. The Java Virtual Machine Instruction Set](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html)文档，查看具体的 opcode 的内容，主要是查看 opcode 的 Format 和 Operand Stack。

Format

```text
mnemonic
operand1
operand2
...
```

Operand Stack

```text
..., value1, value2 →

..., value3
```

## 总结

本文内容总结如下：

- 第一点，Execution Model 就是对 Stack Frame 进行简单、理想化之后的模型；对于 Stack Frame 来说，我们要关注方法的初始状态和方法的后续变化。
- 第二点，通过运行 `HelloWorldFrameCore02` 类可以查看具体方法的 Stack Frame 变化。
