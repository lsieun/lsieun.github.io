---
title:  "frame介绍"
sequence: "017"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

本篇文章的目的介绍frame是什么，但是并不推荐使用与frame相关的方法。

## 为什么不使用visitFrame()方法

我们知道，在`MethodVisitor`类当中，有一个`visitFrame()`方法。但是，在前面所有的代码示例当中，并没有明确调用过`MethodVisitor.visitFrame()`方法。

为什么我们不去调用`MethodVisitor.visitFrame()`方法呢？原因是因为我们在创建`ClassWriter`对象的时候，使用了`ClassWriter.COMPUTE_FRAMES`参数：

{% highlight java %}
{% raw %}
ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
{% endraw %}
{% endhighlight %}

在使用了`ClassWriter.COMPUTE_FRAMES`参数之后，ASM会忽略代码当中对于`MethodVisitor.visitFrame()`方法的调用，并且自动帮助我们计算stack map frame的具体内容。

## frame是什么

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

当生成`HelloWorld.class`文件后，可以使用`javap -v sample.HelloWorld`来查看instruction的内容：

{% highlight bash %}
{% raw %}
$ javap -v sample.HelloWorld
......
  public int test(int, int);
    descriptor: (II)I
    flags: ACC_PUBLIC
    Code:
      stack=2, locals=3, args_size=3
         0: iload_1           这里的每一行就是一条instruction。本例当中，共4条。
         1: iload_2
         2: iadd
         3: ireturn
......
{% endraw %}
{% endhighlight %}

### 每一条instruction都有对应的frame

在方法当中，每一条instruction都有对应的frame。

那么，frame到底是什么呢？简单来说，frame就是将local variables和operand stack放到一起，可以表示成如下这样：

{% highlight text %}
frame = local variables + operand stack
{% endhighlight %}

那么，我们可以使用`HelloWorldFrame`来查看它的frames的情况：

{% highlight java %}
{% raw %}
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.MethodNode;
import org.objectweb.asm.tree.analysis.*;

import java.util.List;

public class HelloWorldFrame {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        // (1)构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        // (2) 构建ClassNode
        int api = Opcodes.ASM9;
        ClassNode cn = new ClassNode(api);
        cr.accept(cn, ClassReader.SKIP_FRAMES | ClassReader.SKIP_DEBUG);

        String owner = cn.name;
        List<MethodNode> methods = cn.methods;
        for (MethodNode mn : methods) {
            if (!"test".equals(mn.name)) continue;
            System.out.println(mn.name + ":" + mn.desc);
            Analyzer<BasicValue> analyzer = new Analyzer<>(new SimpleVerifier());
            try {
                analyzer.analyze(owner, mn);
                Frame<BasicValue>[] frames = analyzer.getFrames();
                for (Frame<?> frame : frames) {
                    System.out.println(frame);
                }
            } catch (AnalyzerException e) {
                e.printStackTrace();
            }
            System.out.println("====================================================");
        }
    }
}
{% endraw %}
{% endhighlight %}

在这里，我们不用太关心上面代码的含义，而是关注它的运行结果。运行`HelloWorldFrame`类，得到如下结果：

{% highlight text %}
test:(II)I
Lsample/HelloWorld;II 
Lsample/HelloWorld;II I
Lsample/HelloWorld;II II
Lsample/HelloWorld;II I
{% endhighlight %}

这个运行结果，需要结合instruction来理解。

{% highlight bash %}
{% raw %}
$ javap -v sample.HelloWorld
......
  public int test(int, int);
    descriptor: (II)I
    flags: ACC_PUBLIC
    Code:
      stack=2, locals=3, args_size=3
         0: iload_1
         1: iload_2
         2: iadd
         3: ireturn
      LineNumberTable:
        line 5: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       4     0  this   Lsample/HelloWorld;
            0       4     1     a   I
            0       4     2     b   I
......
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
test:(I)V
Lsample/HelloWorld;I 
Lsample/HelloWorld;I I
Lsample/HelloWorld;I 
Lsample/HelloWorld;I Ljava/io/PrintStream;
Lsample/HelloWorld;I Ljava/io/PrintStream;Ljava/lang/String;
Lsample/HelloWorld;I 
Lsample/HelloWorld;I 
Lsample/HelloWorld;I 
Lsample/HelloWorld;I Ljava/io/PrintStream;
Lsample/HelloWorld;I Ljava/io/PrintStream;Ljava/lang/String;
Lsample/HelloWorld;I 
Lsample/HelloWorld;I 
{% endhighlight %}

`test()`方法所对应的instructions如下：

{% highlight text %}
$ javap -v sample.HelloWorld
......
  public void test(int);
    descriptor: (I)V
    flags: ACC_PUBLIC
    Code:
      stack=2, locals=2, args_size=2
         0: iload_1
         1: ifne          15
         4: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
         7: ldc           #3                  // String value is 0
         9: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
        12: goto          23
        15: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
        18: ldc           #5                  // String value is not 0
        20: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
        23: return
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

## 如何使用visitFrame()方法

预期结果：

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

实现代码：

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

验证结果：

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

## 总结

在本篇文章中，主要想说明以下两点：

- 第一点，frame是什么。在这里，我们希望大家对于frame有一个大概的了解。因为这里也只是进行了简单的介绍，一些技术细节也没有谈到，如果大家能够理解，那是最好，如果大家不能理解，也不会对后续的学习有什么影响。
- 第二点，就是推荐大家不要去使用与frame相关的方法。更具体的来说，就是不要去调用`MethodVisitor.visitFrame()`方法。因为如果要使用`MethodVisitor.visitFrame()`方法，就要计算出哪些需要记录frame、frame的具体内容是什么，如果对于Frame的算法不太了解，那就容易出错。反而，我们推荐大家在创建`ClassWriter`对象的时候，使用`ClassWriter.COMPUTE_FRAMES`参数，这样ASM就会帮助我们计算frame的值到底是多少。
