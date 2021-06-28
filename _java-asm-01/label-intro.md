---
title:  "Label介绍"
sequence: "210"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

在程序中，有三种基本控制结构：顺序、选择和循环。我们现在已经知道，`MethodVisitor`类是用于生成方法体的代码。如果没有`Label`类的参与，那么`MethodVisitor`类只能生成“顺序”结构的代码；如果有`Label`类的参与，`MethodVisitor`类就能生成“选择”和“循环”结构的代码。在本文当中，我们来介绍`Label`类。

如果查看`Label`类的API文档，就会发现下面的描述，分成了三个部分。第一部分，`Label`类上是什么（What）；第二部分，在哪些用到`Label`类（Where）；第三部分，在编写ASM代码过程中，如何使用`Label`类（How），或者说，`Label`类与Instruction的关系。

- A position in the bytecode of a method.
- Labels are used for jump, goto, and switch instructions, and for try catch blocks.
- A label designates the instruction that is just after. Note however that there can be other elements between a label and the instruction it designates (such as other labels, stack map frames, line numbers, etc.).

如果是刚刚接触`Label`类，那么可能对于上面的三部分英文描述没有太多的“感受”或“理解”；但是，如果接触`Label`类一段时间之后，就会发现它描述的内容很“精髓”。本文的内容也是围绕着这三部分来展开的。

## Label类

在`Label`类当中，定义了很多的字段和方法。为了方便，将`Label`类简化一下，内容如下：

```java
public class Label {
    int bytecodeOffset;

    public Label() {
        // Nothing to do.
    }

    public int getOffset() {
        return bytecodeOffset;
    }
}
```

经过这样简单之后，`Label`类当中就只包含一个`bytecodeOffset`字段，那么这个字段代表什么含义呢？`bytecodeOffset`字段就是a position in the bytecode of a method。

举例子来说明一下。假如有一个`test(boolean flag)`方法，它包含的Instruction内容如下：

```text
=== === ===  === === ===  === === ===
Method test:(Z)V
=== === ===  === === ===  === === ===
max_stack = 2
max_locals = 2
code_length = 24
code = 1B99000EB200021203B60004A7000BB200021205B60004B1
=== === ===  === === ===  === === ===
0000: iload_1              // 1B
0001: ifeq            14   // 99000E
0004: getstatic       #2   // B20002     || java/lang/System.out:Ljava/io/PrintStream;
0007: ldc             #3   // 1203       || value is true
0009: invokevirtual   #4   // B60004     || java/io/PrintStream.println:(Ljava/lang/String;)V
0012: goto            11   // A7000B
0015: getstatic       #2   // B20002     || java/lang/System.out:Ljava/io/PrintStream;
0018: ldc             #5   // 1205       || value is false
0020: invokevirtual   #4   // B60004     || java/io/PrintStream.println:(Ljava/lang/String;)V
0023: return               // B1
=== === ===  === === ===  === === ===
LocalVariableTable:
index  start_pc  length  name_and_type
    0         0      24  this:Lsample/HelloWorld;
    1         0      24  flag:Z
```

那么，`Label`类当中的`bytecodeOffset`字段，就表示当前Instruction“索引值”。

那么，这个`bytecodeOffset`字段是做什么用的呢？它用来计算一个“相对偏移量”。比如说，`bytecodeOffset`字段的值是`15`，它标识了`getstatic`指令的位置，而在索引值为`1`的位置是`ifeq`指令，`ifeq`后面跟的`14`，这个`14`就是一个“相对偏移量”。换一个角度来说，由于`ifeq`的索引位置是`1`，“相对偏移量”是`14`，那么`1+14＝15`，也就是说，如果`ifeq`的条件成立，那么下一条执行的指令就是索引值为`15`的`getstatic`指令了。

## Label类能够做什么？

在ASM当中，`Label`类可以用于实现选择（if、switch）、循环（for、while）和try-catch语句。

在编写ASM代码的过程中，我们所要表达的是一种代码的跳转逻辑，就是从一个地方跳转到另外一个地方；在这两者之间，可以编写其它的代码逻辑，可能长一些，也可能短一些，所以，Instruction所对应的“索引值”还不确定。`Label`类的出现，就是代表一个“抽象的位置”，也就是将来要跳转的目标。当我们调用`ClassWriter.toByteArray()`方法时，这些ASM代码会被转换成`byte[]`，在这个过程中，需要计算出`Label`对象中`bytecodeOffset`字段的值到底是多少，从而再进一步计算出跳转的相对偏移量（`offset`）。

## 如何使用Label类

从编写代码的角度来说，`Label`类是属于`MethodVisitor`类的一部分：通过调用`MethodVisitor.visitLabel(Label)`方法，来为代码逻辑添加一个潜在的“跳转目标”。

我们先来看一个简单的示例代码：

```java
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

那么，`test(boolean flag)`方法对应的ASM代码如下：

```text
MethodVisitor mv = cw.visitMethod(ACC_PUBLIC, "test", "(Z)V", null, null);
Label elseLabel = new Label();      // 首先，准备两个Label对象
Label returnLabel = new Label();

// 第1段
mv.visitCode();
mv.visitVarInsn(ILOAD, 1);
mv.visitJumpInsn(IFEQ, elseLabel);
mv.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
mv.visitLdcInsn("value is true");
mv.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
mv.visitJumpInsn(GOTO, returnLabel);

// 第2段
mv.visitLabel(elseLabel);         // 将第一个Label放到这里
mv.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
mv.visitLdcInsn("value is false");
mv.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);

// 第3段
mv.visitLabel(returnLabel);      // 将第二个Label放到这里
mv.visitInsn(RETURN);
mv.visitMaxs(2, 2);
mv.visitEnd();
```

如何使用`Label`类：

- 首先，定义`Label`类的实例；
- 其次，通过`MethodVisitor.visitLabel()`方法确定label的位置；
- 最后，在条件合适的情况下，通过`MethodVisitor`类跳转相关的方法（例如，`visitJumpInsn()`）与label建立联系。

举个形象的例子，在《火影忍者》当中，飞雷神之术的特点：先扔出带有飞雷神标记的苦无，再跳转到苦无的位置。

{:refdef: style="text-align: center;"}
![飞雷神之术](/assets/images/manga/naruto/yellow-flash-minato-teleportation.gif)
{: refdef}

相对而言，`Label`类就是“带有飞雷神标记的苦无”，它的`bytecodeOffset`字段就是“苦无的具体位置”。

A label designates the instruction that is just after. Note however that there can be other elements between a label and the instruction it designates (such as other labels, stack map frames, line numbers, etc.).

上面这段英文描述，是在我们编写ASM代码过程中，label和instruction的位置关系：label在前，instruction在后。

```text
|          |     instruction     |
|          |     instruction     |
|  label1  |     instruction     |
|          |     instruction     |
|          |     instruction     |
|  label2  |     instruction     |
|          |     instruction     |
```

## Frame的变化

对于`HelloWorld`类中`test()`方法对应的Instruction内容如下：

```text
public void test(boolean);
  Code:
     0: iload_1
     1: ifeq          15
     4: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
     7: ldc           #3                  // String value is true
     9: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
    12: goto          23
    15: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
    18: ldc           #5                  // String value is false
    20: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
    23: return
```

该方法对应的Frame变化情况如下：

```text
test(Z)V
[sample/HelloWorld, int] []
[sample/HelloWorld, int] [int]
[sample/HelloWorld, int] []
[sample/HelloWorld, int] [java/io/PrintStream]
[sample/HelloWorld, int] [java/io/PrintStream, java/lang/String]
[sample/HelloWorld, int] []
[] []
[sample/HelloWorld, int] [java/io/PrintStream]                      // 注意，这里是“非线性”的变化
[sample/HelloWorld, int] [java/io/PrintStream, java/lang/String]
[sample/HelloWorld, int] []
[] []
```

通过上面的输出结果，我们希望大家能够看到：**由于程序代码逻辑发生了跳转，那么相应的local variables和operand stack结构也发生了“非线性”的变化**。这部分内容与`MethodVisitor.visitFrame()`方法有关系。

## 总结

本文主要对`Label`类进行了介绍，内容总结如下：

- 第一点，`Label`类是什么（What）。将`Label`类精简之后，就只剩下一个`bytecodeOffset`字段。这个`bytecodeOffset`字段就是`Label`类最精髓的内容，它代表了某一条Instruction的位置。
- 第二点，在哪里用到`Label`类（Where）。简单来说，`Label`类是为了方便程序的跳转，例如实现if、switch、for和try-catch等语句。
- 第三点，从编写ASM代码的角度来讲，如何使用`Label`类（How）。首先，定义`Label`类的实例；其次，通过`MethodVisitor.visitLabel()`方法确定label的位置；最后，在条件合适的情况下，通过`MethodVisitor`类跳转相关的方法（例如，`visitJumpInsn()`）与label建立联系。
- 第四点，从Frame的角度来讲，由于程序代码逻辑发生了跳转，那么相应的local variables和operand stack结构也发生了“非线性”的变化。

