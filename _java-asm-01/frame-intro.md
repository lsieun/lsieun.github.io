---
title:  "frame介绍"
sequence: "211"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

## JVM当中的frame

JVM Architecture由Class Loader System、Runtime Data Areas和Execution Engine组成，如下图所示。

{:refdef: style="text-align: center;"}
![JVM Architecture](/assets/images/java/jvm/jvm-architecture.png)
{: refdef}

在上图当中，Runtime Data Areas包括Method Area、Heap Area、Stack Area、PC Registers和Native Method Stack等部分。

在程序运行的过程中，每一个线程（Thread）都对应一个属于自己的JVM Stack。当一个新线程（Thread）开始的时候，就会在内存上分配一个属于自己的JVM Stack；当该线程（Thread）执行结束的时候，相应的JVM Stack内存空间也就被回收了。

在JVM Stack当中，是栈的结构，里面存储的是frames；每一个frame空间可以称之为Stack Frame。当调用一个新方法的时候，就会在JVM Stack上分配一个frame空间，当方法退出时，相应的frame空间也会JVM Stack上进行清除掉（出栈操作）。在frame空间当中，有两个重要的结构，即loca variables和operand stack。

{:refdef: style="text-align: center;"}
![JVM Stack Frame](/assets/images/java/asm/frame-local-variables-operand-stack.png)
{: refdef}

## ASM当中的frame

### 查看instruction

在`.class`文件中，方法体的内容会被编译成一条一条的instruction。我们可以使用`javap`命令来查看instruction的内容。

假如，有如下这样一个类：

{% highlight java %}
{% raw %}
public class HelloWorld {
    public int test(int a, int b) {
        return a + b;
    }
}
{% endraw %}
{% endhighlight %}

当生成`HelloWorld.class`文件后，可以使用`ASMPrint`类来查看instruction的内容：

{% highlight bash %}
{% raw %}
public test(II)I
  ILOAD 1
  ILOAD 2
  IADD
  IRETURN
  MAXSTACK = 2
  MAXLOCALS = 3
{% endraw %}
{% endhighlight %}

### 每一条instruction都有对应的frame

在方法当中，每一条instruction都有对应的frame。

那么，ASM当中的frame到底是什么呢？简单来说，frame就是某一条instruction所对应的local variables和operand stack的状态。

要注意，JVM中的frame和ASM中的frame之间的差别：

- JVM中的frame是指一段内存空间，里面包含local variables和operand stack结构。
- ASM中的frame是指在某一条instruction所对应的local variables和operand stack的状态。

{% highlight text %}
JVM中的frame：frame内存空间 = local variables内存空间 + operand stack内存空间
ASM中的frame：instruction frame = local variables状态 + operand stack状态
{% endhighlight %}

我们可以使用`HelloWorldFrameCore`来查看frames的情况：

{% highlight java %}
{% raw %}
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Opcodes;

public class HelloWorldFrameCore {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new MethodStackMapFrameVisitor(api, cw);

        //（4）结合ClassReader和ClassVisitor
        int parsingOptions = ClassReader.EXPAND_FRAMES; // 注意，这里使用了EXPAND_FRAMES
        cr.accept(cv, parsingOptions);

        //（5）生成byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
{% endraw %}
{% endhighlight %}

在这里，我们不用太关心上面代码的含义，而是关注它的运行结果。运行`HelloWorldFrame`类，得到如下结果：

{% highlight text %}
test(II)I
[sample/HelloWorld, int, int] []
[sample/HelloWorld, int, int] [int]
[sample/HelloWorld, int, int] [int, int]
[sample/HelloWorld, int, int] [int]
[] []
{% endhighlight %}

这个运行结果，需要结合instruction来理解。

{% highlight bash %}
{% raw %}
public test(II)I
  ILOAD 1
  ILOAD 2
  IADD
  IRETURN
  MAXSTACK = 2
  MAXLOCALS = 3
{% endraw %}
{% endhighlight %}

再换一个例子来看：

{% highlight java %}
{% raw %}
public class HelloWorld {
    public void test(int value) {
        if (value == 0) {
            System.out.println("value is 0");
        }
        else {
            System.out.println("value is not 0");
        }
    }
}
{% endraw %}
{% endhighlight %}

`test()`方法所对应的frames如下：

{% highlight text %}
test(I)V
[sample/HelloWorld, int] []
[sample/HelloWorld, int] [int]
[sample/HelloWorld, int] []
[sample/HelloWorld, int] [java/io/PrintStream]
[sample/HelloWorld, int] [java/io/PrintStream, java/lang/String]
[sample/HelloWorld, int] []
[] []
[sample/HelloWorld, int] [java/io/PrintStream]
[sample/HelloWorld, int] [java/io/PrintStream, java/lang/String]
[sample/HelloWorld, int] []
[] []
{% endhighlight %}

`test()`方法所对应的instructions如下：

{% highlight text %}
public test(I)V
  ILOAD 1
  IFNE L0
  GETSTATIC java/lang/System.out : Ljava/io/PrintStream;
  LDC "value is 0"
  INVOKEVIRTUAL java/io/PrintStream.println (Ljava/lang/String;)V
  GOTO L1
 L0
  GETSTATIC java/lang/System.out : Ljava/io/PrintStream;
  LDC "value is not 0"
  INVOKEVIRTUAL java/io/PrintStream.println (Ljava/lang/String;)V
 L1
  RETURN
  MAXSTACK = 2
  MAXLOCALS = 2
......
{% endhighlight %}

严格的来说，每一条instruction都对应两个frame，一个是instruction执行之前的frame，另一个是instruction执行之后的frame。但是，当多个instruction放到一起的时候来说，第`n`个instruction执行之后的frame，就成为第`n+1`个instruction执行之前的frame，所以也可以理解成：每一条instruction对应一个frame。

这些frames是要存储起来的。我们知道，每一个instruction对应一个frame，如果都要存储起来，那么在`.class`文件中就会占用非常多的空间；而`.class`文件设计的一个主要目标就是尽量占用较小的存储空间，那么就需要对这些frames进行压缩。

### 压缩frames

为了让`.class`文件占用的存储空间尽可能的小，因此要对frames进行压缩。对frames进行压缩，从本质上来说，就是忽略掉一些不重要的frames，而只留下一些重要的frames。

那么，怎样区分哪些frames重要，哪些frames不重要呢？我们从instruction执行顺序的角度来看待这个问题。

如果说，instruction是按照“一个挨一个向下顺序执行”的，那么它们对应的frames就不重要；相应的，instruction在执行过程时，它是从某个地方“跳转”过来的，那么对应的frames就重要。当然，我们这里讲的只是大体的思路，而不是具体的判断细节。

为什么说instruction是按照“一个挨一个向下顺序执行”的，那么它们对应的frames就不重要呢？因为这些instruction对应的frame可以很容易的推导出来。换句话说，如果知道一条instruction在执行之前的frame是什么样子，那么执行这一条instruction之后，你也就知道了这条instruction执行之后的frame是什么样子的，它也就成为了下一条instruction执行之前的frame的状态……依此类推，也能推测出后续的、“一个挨一个向下顺序执行”的instruction对应的frame的情况。

如果当前的instruction是从某个地方跳转过来的，就必须要记录它执行之前的frame的情况，否则就没有办法计算它执行之后的frame的情况。

### 如何使用visitFrame()方法

#### 预期目标

{% highlight java %}
{% raw %}
public class HelloWorld {
    public void test(int value) {
        if (value == 0) {
            System.out.println("value is 0");
        }
        else {
            System.out.println("value is not 0");
        }
    }
}
{% endraw %}
{% endhighlight %}

#### 编码实现

{% highlight java %}
{% raw %}
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldGenerateCore {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);

        // (1) 生成byte[]内容
        byte[] bytes = dump();

        // (2) 保存byte[]到文件
        FileUtils.writeBytes(filepath, bytes);
    }

    public static byte[] dump() throws Exception {
        // (1) 创建ClassWriter对象
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_MAXS);

        // (2) 调用visitXxx()方法
        cw.visit(V1_8, ACC_PUBLIC + ACC_SUPER, "sample/HelloWorld",
                null, "java/lang/Object", null);

        {
            MethodVisitor mv1 = cw.visitMethod(ACC_PUBLIC, "<init>", "()V", null, null);
            mv1.visitCode();
            mv1.visitVarInsn(ALOAD, 0);
            mv1.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
            mv1.visitInsn(RETURN);
            mv1.visitMaxs(0, 0);
            mv1.visitEnd();
        }

        {
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC, "test", "(I)V", null, null);
            Label elseLabel = new Label();
            Label returnLabel = new Label();

            // 第1段
            mv2.visitCode();
            mv2.visitVarInsn(ILOAD, 1);

            // 第2段
            mv2.visitJumpInsn(IFNE, elseLabel);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("value is 0");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            mv2.visitJumpInsn(GOTO, returnLabel);

            // 第3段
            mv2.visitLabel(elseLabel);
            mv2.visitFrame(Opcodes.F_SAME, 0, null, 0, null); //调用visitFrame
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("value is not 0");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);

            // 第4段
            mv2.visitLabel(returnLabel);
            mv2.visitFrame(Opcodes.F_SAME, 0, null, 0, null); //调用visitFrame
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(0, 0);
            mv2.visitEnd();
        }

        cw.visitEnd();

        // (3) 调用toByteArray()方法
        return cw.toByteArray();
    }
}
{% endraw %}
{% endhighlight %}

在上面的代码中，我们创建`ClassWriter`对象时，使用了`ClassWriter.COMPUTE_MAXS`参数，这样ASM就会只计算max locals和max stack的值；在实现`test()`方法的时候，就需要明确的调用`MethodVisitor.visitFrame()`方法来添加相应的frame信息。

#### 验证结果

{% highlight java %}
{% raw %}
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Object obj = clazz.newInstance();

        Method method = clazz.getDeclaredMethod("test", int.class);
        method.invoke(obj, 0);
        method.invoke(obj, 1);
    }
}
{% endraw %}
{% endhighlight %}

### 不推荐使用visitFrame()方法

我们知道，在`MethodVisitor`类当中，有一个`visitFrame()`方法。但是，在前面所有的代码示例当中，并没有明确调用过`MethodVisitor.visitFrame()`方法。

为什么我们不去调用`MethodVisitor.visitFrame()`方法呢？原因是因为我们在创建`ClassWriter`对象的时候，使用了`ClassWriter.COMPUTE_FRAMES`参数：

{% highlight java %}
{% raw %}
ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
{% endraw %}
{% endhighlight %}

在使用了`ClassWriter.COMPUTE_FRAMES`参数之后，ASM会忽略代码当中对于`MethodVisitor.visitFrame()`方法的调用，并且自动帮助我们计算stack map frame的具体内容。

## 总结

本文主要对frame进行了介绍，内容总结如下：

- 第一点，要区分开JVM中的frame和ASM中的frame这两个概念。JVM当中的frame是一段实实在的内存空间，在这个frame内存空间里有两个重要的结构，分别是local variables和operand stack。而ASM中的frame是指，某一条instruction所对应的local variables和operand stack的状态。
- 第二点，就是推荐大家不要去使用与frame相关的方法。更具体的来说，就是不要去调用`MethodVisitor.visitFrame()`方法。因为如果要使用`MethodVisitor.visitFrame()`方法，就要计算出哪些需要记录frame、frame的具体内容是什么。如果我们对于frame的算法不太了解，那就容易出错。因而，我们推荐大家在创建`ClassWriter`对象的时候，使用`ClassWriter.COMPUTE_FRAMES`参数，这样ASM就会帮助我们计算frame的值到底是多少。
