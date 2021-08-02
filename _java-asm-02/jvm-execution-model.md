---
title:  "JVM Execution Model"
sequence: "105"
---

[上级目录]({% link _posts/2021-04-22-java-asm-season-01.md %})

## Execution Model

### 什么是Execution Model

在[asm4-guide.pdf](https://asm.ow2.io/asm4-guide.pdf)文档的`3.1.1. Execution Model`部分提到了Execution Model。

那么，Execution Model是什么呢？其实，Execution Model就是指Stack Frame。换句话说，方法内instructions的执行，就是在Stack Frame上来展开。方法与Stack Frame之间有一个非常紧密的关系：

- 一个方法开始执行，就对应着Stack Frame的产生。
- 一个方法执行结束，无论正常结束（return），还是异常退出（throw exception），都表示着相应的Stack Frame的销毁。

在Stack Frame当中，主要由local variable和operand stack两个部分组成。

{:refdef: style="text-align: center;"}
![](/assets/images/java/asm/jvm-execution-model-2.png)
{: refdef}

### 方法的初始状态

在方法进入的时候，会生成相应的Stack Frame内存空间。那么，Stack Frame的初始状态是什么样的呢？（点击[这里]({% link _java-asm-01/method-initial-frame.md %})查看之前内容）

在Stack Frame当中，operand stack是空的，而local variables则需要考虑三方面的因素：

- 当前方法是否为static方法。如果当前方法是non-static方法，则需要在local variables索引为`0`的位置存在一个`this`变量；如果当前方法是static方法，则不需要存储`this`。
- 当前方法是否接收参数。方法接收的参数，会按照参数的声明顺序放到local variables当中。
- 方法参数是否包含`long`或`double`类型。如果方法的参数是`long`或`double`类型，那么它在local variables当中占用两个位置。

- 问题：能否在文档中找到依据呢？
- 回答：能。

The Java Virtual Machine uses **local variables** to pass parameters on **method invocation**. On **class method invocation**, any parameters are passed in consecutive local variables starting from local variable `0`. On **instance method invocation**, local variable `0` is always used to pass a reference to the object on which the instance method is being invoked (`this` in the Java programming language). Any parameters are subsequently passed in consecutive local variables starting from local variable `1`.（内容来自于[2.6.1. Local Variables](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.6.1)）

**The operand stack is empty** when the frame that contains it is created.（内容来自于[2.6.2. Operand Stacks](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.6.2)）

### 方法的后续变化

方法的后续变化，就是在方法初始状态的基础上，随着instruction的执行而对local variable和operand stack的状态产生影响。

当一个具体方法要执行时，其实就是方法里的instruction一条一条在执行：

- 第一步，获取instruction。每一条instruction都是从`instructions`内存空间中取出来的。
- 第二步，执行instruction。对于instruction的执行，就会引起operand stack和local variables的状态变化。
- 第三步，在执行instruction过程中，需要获取相关资源。通过`ref`可以获取runtime constant pool的“资源”，例如一个字符串的内容，一个指向方法的物理内存地址。

需要注意的是，虽然local variable和operand stack是Stack Frame当中两个最重要的结构，两者似乎是处于一个平等的地位上；但是，大多数的instruction都是在operand stack上执行，而local variable只是提供一个临时的数据存储区域。举个形象的例子，operand stack类似于“公司”，local variables类似于“临时租的房子”，虽然说“公司”和“临时租的房子”是我们经常待的场所，是两个非常重要的地方，但是我们工作的时间大部是在“公司”进行的。大多数情况下，都是先把数据加载到operand stack上，在operand stack上进行运算，最后可能将数据存储到local variables当中。只有少部分的操作（例如`iinc`），只需要在local variable上就能完成。

在[Chapter 2. The Structure of the Java Virtual Machine](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html)的[2.11. Instruction Set Summary](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.11)部分，对程序的执行进行了如下描述：

Ignoring exceptions, the inner loop of a Java Virtual Machine interpreter is effectively:

```text
do {
    atomically calculate pc and fetch opcode at pc;
    if (operands) fetch operands;
    execute the action for the opcode;
} while (there is more to do);
```

## 查看方法的Stack Frame变化

在这个部分，我们介绍一下如何使用`HelloWorldFrameCore02`类查看方法对应的Stack Frame的变化。

### 两个版本

在课程代码中，查看方法对应的Stack Frame的变化，有两个类的版本：

- 第一个版本，是`HelloWorldFrameCore`类。它是在《Java ASM系列一：Core API》阶段引入的类，可以用来打印方法的Stack Frame的变化。为了保证与以前内容的一致性，我们保留了这个类的代码逻辑不变动。
- 第二个版本，是`HelloWorldFrameCore02`类。它是在《Java ASM系列二：OPCODE》阶段引入的类，在第一个版本的基础上进行了改进：引入了instruction部分，精简了Stack Frame的类型显示。

我们在使用的时候，直接使用第二个版本就可以了，也就是使用`HelloWorldFrameCore02`类。

### 三个部分

我们在执行`HelloWorldFrameCore02`类之后，输出结果分成三个部分：

- 第一部分，是offset，它表示某一条instruction的具体位置或偏移量。
- 第二部分，是instructions，它表示方法里包含的所有指令信息。
- 第三部分，是local variable和operand stack中存储的具体数据类型。
  - 格式：`{local variable types} | {operand stack types}`
  - 第一行的local variable和operand stack表示“方法的初始状态”。
  - 其后每一行instruction
    - 上一行的local variable和operand stack表示该instruction执行之前的状态
    - 与该instruction位于同一行local variable和operand stack表示该instruction执行之后的状态

![](/assets/images/java/asm/offset-instructions-local-variable-and-operand-stack-second-version.png)

在上面的输出结果中，我们会看到local variable和operand stack为`{} | {}`的情况，这是四种特殊情况。

### 四种情况

在`HelloWorldFrameCore02`类当中，会间接使用到`AnalyzerAdapter`类。在`AnalyzerAdapter`类的代码中，将`locals`和`stack`字段的取值设置为`null`的情况，就会有上面`{} | {}`的情况。

在`AnalyzerAdapter`类的代码中，有四个方法会将`locals`和`stack`字段设置为`null`：

- 在`AnalyzerAdapter.visitInsn(int opcode)`方法中，当`opcode`为`return`或`athrow`的情况
- 在`AnalyzerAdapter.visitJumpInsn(int opcode, Label label)`方法中，当`opcode`为`goto`的情况
- 在`AnalyzerAdapter.visitTableSwitchInsn(int min, int max, Label dflt, Label... labels)`方法中
- 在`AnalyzerAdapter.visitLookupSwitchInsn(Label dflt, int[] keys, Label[] labels)`方法中

### 五个视角

在后续内容中，我们介绍代码示例的时候，一般都会从五个视角来学习：

- 第一个视角，Java语言的视角，就是`sample.HelloWorld`里的代码怎么编写。
- 第二个视角，Instruction的视角，就是`javap -c sample.HelloWorld`，这里给出的就是标准的opcode内容。
- 第三个视角，ASM的视角，就是编写ASM代码实现某种功能，这里主要是对`visitXxxInsn()`方法的调用，与实际的opcode可能相同，也可能有差异。
- 第四个视角，Frame的视角，就是JVM内存空间的视角，就是local variable和operand stack的变化。
- 第五个视角，JVM Specification的视角，参考JVM文档，它是怎么说的。

第一个视角，Java语言的视角。假如我们有一个`sample.HelloWorld`类，代码如下：

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

第二个视角，Instruction的视角。我们可以通过`javap -c sample.HelloWorld`命令查看方法包含的instruction内容：

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

第三个视角，ASM的视角。运行`ASMPrint`类，可以查看ASM代码，可以查看某一个opcode具体对应于哪一个`MethodVisitor.visitXxxInsn()`方法：

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

第四个视角，Frame的视角。我们可以通过运行`HelloWorldFrameCore02`类来查看方法对应的Stack Frame的变化：

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

第五个视角，JVM Specification的视角。我们可以参考[Chapter 6. The Java Virtual Machine Instruction Set](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html)文档，查看具体的opcode的内容，主要是查看opcode的Format和Operand Stack。

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

- 第一点，Execution Model就是对Stack Frame进行简单、理想化之后的模型；对于Stack Frame来说，我们要关注方法的初始状态和方法的后续变化。
- 第二点，通过运行`HelloWorldFrameCore02`类可以查看具体方法的Stack Frame变化。
