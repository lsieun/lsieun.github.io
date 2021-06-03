---
title:  "Label介绍"
sequence: "209"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

<h2 id="label-class">Label类</h2>

对于`Label`类来说，它里面定义了很多的字段和方法，但是大多数的字段和方法都没有带有`public`修饰，只能在它当前类当中或所在的package当中使用这些字段和方法。

如果我们不是为了研究ASM源码的工作原理，可以暂时忽略`Label`类所定义的诸多字段，将`Label`类简化理解成下面这样：

{% highlight java %}
{% raw %}
public class Label {
    int bytecodeOffset;

    public Label() {
        // Nothing to do.
    }

    public int getOffset() {
        return bytecodeOffset;
    }
}
{% endraw %}
{% endhighlight %}

经过这样简单之后，`Label`类当中就只包含一个`bytecodeOffset`字段，那么这个字段是什么意思呢？

我们先来看一个简单的示例代码：

{% highlight java %}
{% raw %}
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
{% endraw %}
{% endhighlight %}

那么，`test(boolean flag)`方法对应的ASM代码如下：

{% highlight java %}
{% raw %}
MethodVisitor mv = cw.visitMethod(ACC_PUBLIC, "test", "(Z)V", null, null);
Label elseLabel = new Label();
Label returnLabel = new Label();

// 第1段
mv.visitCode();
mv.visitVarInsn(ILOAD, 1);

// 第2段
mv.visitJumpInsn(IFEQ, elseLabel);
mv.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
mv.visitLdcInsn("value is true");
mv.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
mv.visitJumpInsn(GOTO, returnLabel);

// 第3段
mv.visitLabel(elseLabel);
mv.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
mv.visitLdcInsn("value is false");
mv.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);

// 第4段
mv.visitLabel(returnLabel);
mv.visitInsn(RETURN);
mv.visitMaxs(2, 2);
mv.visitEnd();
{% endraw %}
{% endhighlight %}

上面的`test(boolean flag)`方法，从opcode的角度来说，可以展现成如下这样：

{% highlight text %}
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
{% endhighlight %}

那么，`Label`类当中的`bytecodeOffset`字段，就表示当前opcode的“索引值”，或者说当前opcode跟第1个opcode之间的“偏移量”。

那么，这个`bytecodeOffset`字段是做什么用的呢？它用来计算一个“相对偏移量”。例如`ifeq`后面跟的`14`，这个`14`就是一个相对偏移量。由于`ifeq`的位置是`1`，加上`1+14＝15`之后，所以如果`ifeq`的条件成立，那么下一条执行的指令就是索引值为`15`的`getstatic`了。

<h2 id="where-to-use-label-class">Label类有什么作用呢？</h2>

在`Label`类的文档中是这样描述的：

> A position in the bytecode of a method.  
> Labels are used for jump, goto, and switch instructions, and for try catch blocks.  
> A label designates the instruction that is just after.

第一句，A position in the bytecode of a method。在`Label`类当中的`bytecodeOffset`字段就表示bytecode的position。

举个形象的例子，在《火影忍者》当中，黄色闪光水门会使用飞雷神之术，如下图。飞雷神之术的特点：先扔出带有飞雷神标记的苦无，再跳转到苦无的位置。

{:refdef: style="text-align: center;"}
![飞雷神之术](/assets/images/manga/naruto/yellow-flash-minato-teleportation.gif)
{: refdef}

相对而言，`Label`类就是“带有飞雷神标记的苦无”，它的`bytecodeOffset`字段就是“苦无的具体位置”。

第二句，Labels are used for jump, goto, and switch instructions, and for try catch blocks。这句讲了`Label`类使用的具体的几种情况：jump、goto、switch和try-catch代码块。

在这里，我们以try-catch代码块为例，如下所示：

{% highlight java %}
{% raw %}
public class HelloWorld {
    public void test() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException ex) {
            ex.printStackTrace();
        }
    }
}
{% endraw %}
{% endhighlight %}

其中，`test()`方法对应的ASM代码如下：

{% highlight java %}
{% raw %}
MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC, "test", "()V", null, null);
Label tryStartLabel = new Label();  // 创建了4个Label对象，相当于“拿出了4把飞雷神苦无”
Label tryEndLabel = new Label();
Label handlerLabel = new Label();
Label returnLabel = new Label();

// 第1段
mv2.visitCode();
mv2.visitTryCatchBlock(tryStartLabel, tryEndLabel, handlerLabel, "java/lang/InterruptedException");

// 第2段
mv2.visitLabel(tryStartLabel); // 第1只“飞雷神苦无”
mv2.visitLdcInsn(new Long(1000L));
mv2.visitMethodInsn(INVOKESTATIC, "java/lang/Thread", "sleep", "(J)V", false);

// 第3段
mv2.visitLabel(tryEndLabel); // 第2只“飞雷神苦无”
mv2.visitJumpInsn(GOTO, returnLabel);

// 第4段
mv2.visitLabel(handlerLabel); // 第3只“飞雷神苦无”
mv2.visitVarInsn(ASTORE, 1);
mv2.visitVarInsn(ALOAD, 1);
mv2.visitMethodInsn(INVOKEVIRTUAL, "java/lang/InterruptedException", "printStackTrace", "()V", false);

// 第5段
mv2.visitLabel(returnLabel); // 第4只“飞雷神苦无”
mv2.visitInsn(RETURN);
mv2.visitMaxs(0, 0);
mv2.visitEnd();
{% endraw %}
{% endhighlight %}

第三句，A label designates the instruction that is just after。

在ASM代码中，`Label`类是一个辅助类，它标识了某一条instruction所在的位置。

为什么说`Label`类是一个辅助类呢？因为label是在ASM当中所独有的一个概念；相应的，在ClassFile结构中不存在的label的概念。

那么，在具体的ASM代码当中，`Label`对象用于标识某一条instruction所在的位置。但是，当我们调用`ClassWriter.toByteArray()`方法时，这些ASM代码会被转换成`byte[]`，在这个过程中，需要计算出`Label`对象中`bytecodeOffset`字段的值到底是多少，从而再进一步计算出跳转的相对偏移量（`offset`）。当这个转换过程结束后，label的概念也就消失了，因为在`.class`文件中没有label的概念。

在ASM代码中，我们可以这样理解：try-catch、label和instruction，它们处在一条很宽的路上的不同的“轨道”上。

{% highlight text %}
|                |          |     instruction     |
|                |  label1  |     instruction     |
|                |          |     instruction     |
|    try-catch   |  label2  |     instruction     |
|                |          |     instruction     |
|                |  label3  |     instruction     |
|                |          |     instruction     |
|                |  label4  |     instruction     |
|                |          |     instruction     |
{% endhighlight %}

## 总结

本文主要对`Label`类进行了介绍，内容总结如下：

- 第一点，将`Label`类精简之后，就只剩下一个`bytecodeOffset`字段。换句话说，这个`bytecodeOffset`字段就是`Label`类最精髓的内容。
- 第二点，`Label`类的作用是什么。简单来说，就是为了方便程序的跳转，例如实现if、switch、goto和try-catch等语句。

在`Label`类当中，定义了很多的字段和方法，但是我们都忽略了。如果我们想要明白ASM的工作原理，那么这些字段和方法，就需要搞明白它们是什么意思；但是，如果我们是想要应用ASM，实现某种任务，就不需要去理解它们的具体含义。我们也可以从一个“概括”的角度来把握这些字段：虽然我们可能不明白、不理解其中定义的具体的字段和方法到底是什么意思，但是这些字段和方法的存在，就是为了方便程序的跳转。
