---
title:  "如何编写ASM代码"
sequence: "105"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

在刚开始学习ASM的时候，编写ASM代码是不太容易的。或者，有些人原来对ASM很熟悉，但由于长时间不使用ASM，编写ASM代码也会有一些困难。在本文当中，我们介绍一个`ASMPrint`类，它能帮助我们将`.class`文件转换为ASM代码，这个功能非常实用。

## ASMPrint类

下面是`ASMPrint`类的代码，它是利用`org.objectweb.asm.util.TraceClassVisitor`类来实现的。在使用的时候，我们注意修改一下`className`、`parsingOptions`和`asmCode`参数就可以了。

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

## ASMPrint类使用示例

假如，有如下一个`HelloWorld`类：

{% highlight java %}
{% raw %}
public class HelloWorld {
    public void test() {
        System.out.println("Test Method");
    }
}
{% endraw %}
{% endhighlight %}

对于`ASMPrint`类来说，其中

- `className`值设置为类的全限定名，可以是我们自己写的类，例如`sample.HelloWorld`，也可以是JDK自带的类，例如`java.lang.Comparable`。
- `asmCode`值设置为`true`或`false`。如果是`true`，可以打印出对应的ASM代码；如果是`false`，可以打印出方法对应的Instruction。
- `parsingOptions`值设置为`ClassReader.SKIP_CODE`、`ClassReader.SKIP_DEBUG`、`ClassReader.SKIP_FRAMES`、`ClassReader.EXPAND_FRAMES`的组合值，也可以设置为`0`，可以打印出详细程度不同的信息。

## 总结

本文主要介绍了`ASMPrint`类和它的使用示例，内容总结如下：

- 第一点，`ASMPrint`类，是通过`org.objectweb.asm.util.TraceClassVisitor`实现的。
- 第二点，`ASMPrint`类的作用，是帮助我们生成ASM代码。当我们想实现某一个功能时，不知道如何下手，可以使用`ASMPrint`类生成的ASM代码，作为思考的起点。

在当前的阶段，我们可能并不了解`ASMPrint`类里面代码的含义，但是并不影响我们使用它，让它来帮助我们生成ASM代码。在后续的课程当中，我们会逐步的介绍Core API的内容，到时候就能够去理解代码的含义了。


