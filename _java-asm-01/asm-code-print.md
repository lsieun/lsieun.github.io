---
title:  "如何编写ASM代码"
sequence: "106"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

一般来说，想要熟练的使用一件东西，就必须要先了解它、学习它的相关知识。这是学习任何新事物的思路，对于ASM而言，也是成立的；也就是说，如果想使用ASM顺利的完成特定的功能，就需要先对ASM进行了解和学习。

在后续内容当中，我们会循序渐进的介绍ASM中Core API部分的内容，让大家对这部分知识有一定的了解，借助于这些知识，我们就能够使用ASM来实现特定的功能。

但是，在刚开始的时候，使用ASM编写代码是不太容易的。不过，ASM提供了一个非常有用的类，即`org.objectweb.asm.util.TraceClassVisitor`，它能够`.class`文件转换成相应的ASM代码，这个功能非常实用。无论是刚刚接触ASM的人，还是原来熟悉ASM但由于长时间不用而生疏的人，这个类都能够帮助我们快速上手，从而写出ASM代码来。

## ASMPrint类

我们利用`org.objectweb.asm.util.TraceClassVisitor`类来编写一个自己的`ASMPrint`类，具体代码如下：

{% highlight java %}
{% raw %}
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.util.ASMifier;
import org.objectweb.asm.util.Printer;
import org.objectweb.asm.util.Textifier;
import org.objectweb.asm.util.TraceClassVisitor;

import java.io.IOException;
import java.io.PrintWriter;

/**
 * 这里的代码是参考自{@link org.objectweb.asm.util.Printer#main}
 */
public class ASMPrint {
    public static void main(String[] args) throws IOException {
        // (1) 设置参数
        String className = "sample.HelloWorld";
        int parsingOptions = ClassReader.SKIP_FRAMES | ClassReader.SKIP_DEBUG;
        boolean asmCode = true;

        // (2) 打印结果
        Printer printer = asmCode ? new ASMifier() : new Textifier();
        PrintWriter printWriter = new PrintWriter(System.out, true);
        TraceClassVisitor traceClassVisitor = new TraceClassVisitor(null, printer, printWriter);
        new ClassReader(className).accept(traceClassVisitor, parsingOptions);
    }
}
{% endraw %}
{% endhighlight %}
   
在现在阶段，我们可能并不了解这段代码的含义，没有关系的。现在，我们主要是使用这个类，来帮助我们生成ASM代码；等后续内容中，我们会介绍到`TraceClassVisitor`类，也会讲到`ASMPrint`类的代码，到时候就明白这段代码的含义了。

## ASMPrint类的使用场景

对于`ASMPrint`类，我们来说明两种使用场景：

- 第一种使用场景，Class Generation。Class Generation，是从“无”到“有”生成一个全新的Class的过程。
- 第二种使用场景，Class Transformation。Class Transformation，是对已有的Class文件进行修改，来生成一个新的Class文件。

### Class Generation

假如，我们想**动态地**生成一个类，例如下面的`HelloWorld`类：

{% highlight java %}
{% raw %}
public class HelloWorld {
    public void test() {
        System.out.println("Test Method");
    }
}
{% endraw %}
{% endhighlight %}

我们可以运行`ASMPrint`类，来生成相应的ASM代码。

当然，这个`HelloWorld`类里的代码非常简单，我们的主要目的是为了“演示”，就是如何来利用`ASMPrint`类来生成相应的ASM代码。在实际的使用当中，我们可以把代码写的非常复杂，那么`ASMPrint`类，同样会帮助我们来生成相应的ASM代码。

另外，可能有的同学有这样的疑问：我们为什么要用ASM来生成一个类，直接写Java代码，然后编译生成一个`.class`文件，不是更好吗？这是一个非常好的问题。如果说，我们能够直接写Java代码，然后编译生成`.class`文件，能够解决我们所面临的问题，那么，根本就不需要使用ASM来动态生成代码。

- 第一，在有些场景下，就是需要动态的来生成某个类的。以Java 8当中的Lambda为例，在`.java`文件中，我们编写了lambda表达式，这个lambda表达式中包含一定的代码逻辑；接着，我们把`.java`文件编译生成`.class`文件，最后就是运行这个`.class`文件，JVM会将lambda表达式包含的代码逻辑放到到一个具体的类当中来执行，而这个类在之前的代码中是不存在的，它只能动态地去创建一个新的类，让这个新的类来包含这段代码逻辑。
- 第二，出于其它原因的考虑。比如说，你有一个属于自己的、用Java代码编写的产品，但是有些代码并不想让别人知道是如何编写的，这个时候就可以采取动态生成类的方式来对代码进行一定的保护。

### Class Transformation

对于Class Transformation，有这样的使用场景：

- 对于第三方提供的类，如果你有Java源代码，可以直接修改源代码来完成某种特定的目的。
- 但是，很多情况下，第三方提供的类，是以`.jar`文件的形式存在的，只能获取其中包含的`.class`文件，不能直接获取其Java源码。这个时候，如果你仍然想修改某个类，那么就可以借助于ASM来实现相应的功能。

假如说我们想测量某个方法的执行时间，虽然我们的目的很明确，但可能不知道具体要修改类里面的哪部分内容？

这个时候，我们可以使用`ASMPrint`类执行两次，分别看一下“修改前的ASM代码”和“修改后的ASM代码”，比较出它们之间的差异，那么我们就知道要修改什么内容了。

例如，修改之前的代码如下：

{% highlight java %}
{% raw %}
public class HelloWorld {
    public void test() {
        System.out.println("Test Method");
    }
}
{% endraw %}
{% endhighlight %}

修改之后的代码如下：

{% highlight java %}
{% raw %}
public class HelloWorld {
    public static long timer;

    public void test() {
        timer -= System.currentTimeMillis();
        System.out.println("Test Method");
        timer += System.currentTimeMillis();
    }
}
{% endraw %}
{% endhighlight %}

两次执行`ASMPrint`类，对比两个输出的ASM代码之间的差异，我们就能够知道需要修改哪些内容了。

## 总结

本文主要介绍了`ASMPrint`类和它的使用场景，内容总结如下：

- 第一点，`ASMPrint`类，是通过`org.objectweb.asm.util.TraceClassVisitor`实现的。
- 第二点，`ASMPrint`类的作用，是帮助我们生成ASM代码。当我们想实现某一个功能时，不知道如何下手，可以使用`ASMPrint`类生成的ASM代码，作为思考的起点。

在当前的阶段，我们可能并不了解`ASMPrint`类里面代码的含义，但是并不影响我们使用它，让它来帮助我们生成ASM代码。在后续的课程当中，我们会逐步的介绍Core API的内容，到时候就能够去理解代码的含义了。


