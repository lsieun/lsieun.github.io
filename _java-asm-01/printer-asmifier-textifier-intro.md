---
title:  "Printer/ASMifier/Textifier介绍"
sequence: "404"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

## Printer类

### class info

`Printer`类是一个`abstract`类，它有两个子类：`ASMifier`类和`Textifier`类。

{% highlight java %}
{% raw %}
public abstract class Printer {
}
{% endraw %}
{% endhighlight %}

### fields

{% highlight java %}
{% raw %}
public abstract class Printer {
    protected final int api;

    // The builder used to build strings in the various visit methods.
    protected final StringBuilder stringBuilder;

    // The text to be printed.
    public final List<Object> text;
}
{% endraw %}
{% endhighlight %}

### constructors

{% highlight java %}
{% raw %}
public abstract class Printer {
    protected Printer(final int api) {
        this.api = api;
        this.stringBuilder = new StringBuilder();
        this.text = new ArrayList<>();
    }
}
{% endraw %}
{% endhighlight %}

### methods

{% highlight java %}
{% raw %}
public abstract class Printer {
    // Classes，这部分方法可与ClassVisitor内定义的方法进行对比
    public abstract void visit(int version, int access, String name, String signature,
                               String superName, String[] interfaces);
    public abstract void visitSource(String source, String debug);
    public abstract Printer visitField(int access, String name, String descriptor, String signature, Object value);
    public abstract Printer visitMethod(int access, String name, String descriptor,
                                        String signature, String[] exceptions);
    public abstract void visitClassEnd();
    // ......


    // Methods，这部分方法可与MethodVisitor内定义的方法进行对比
    public abstract void visitCode();
    public abstract void visitInsn(int opcode);
    public abstract void visitIntInsn(int opcode, int operand);
    public abstract void visitVarInsn(int opcode, int var);
    public abstract void visitTypeInsn(int opcode, String type);
    public abstract void visitFieldInsn(int opcode, String owner, String name, String descriptor);
    public void visitMethodInsn(final int opcode, final String owner, final String name,
                                final String descriptor, final boolean isInterface);
    public abstract void visitJumpInsn(int opcode, Label label);
    // ......
    public abstract void visitMaxs(int maxStack, int maxLocals);
    public abstract void visitMethodEnd();
}
{% endraw %}
{% endhighlight %}

## ASMifier类和Textifier类

对于`ASMifier`类和`Textifier`类来说，它们的父类是`Printer`类。

{% highlight java %}
{% raw %}
public class ASMifier extends Printer {
}
{% endraw %}
{% endhighlight %}

{% highlight java %}
{% raw %}
public class Textifier extends Printer {
}
{% endraw %}
{% endhighlight %}

在这里，我们不对`ASMifier`类和`Textifier`类的成员信息进行展开，因为它们的内容非常多。但是，这么多的内容都是为了一个共同的目的：通过对`visitXxx()`方法的调用，将class的内容转换成字符串的表示形式。

除了`ASMifier`和`Textifier`这两个类，如果有什么好的想法，我们也可以写一个自定义的`Printer`类进行使用。

## 如何使用

对于`ASMifier`和`Textifier`这两个类来说，它们的使用方法是非常相似的。换句话说，知道了如何使用`ASMifier`类，也就知道了如何使用`Textifier`类；反过来说，知道了如何使用`Textifier`类，也就知道了如何使用`ASMifier`类。

### 从命令行使用

Linux分隔符是“:”

{% highlight text %}
$ java -classpath asm.jar:asm-util.jar org.objectweb.asm.util.ASMifier java.lang.Runnable
{% endhighlight %}

Windows分隔符是“;”

{% highlight text %}
$ java -classpath asm.jar;asm-util.jar org.objectweb.asm.util.ASMifier java.lang.Runnable
{% endhighlight %}

Cygwin分隔符是“\;”

{% highlight text %}
$ java -classpath asm.jar\;asm-util.jar org.objectweb.asm.util.ASMifier java.lang.Runnable
{% endhighlight %}

### 从代码中使用

{% highlight java %}
{% raw %}
import org.objectweb.asm.util.ASMifier;

import java.io.IOException;

public class HelloWorldRun {
    public static void main(String[] args) throws IOException {
        String[] array = new String[] {
                "-debug",
                "sample.HelloWorld"
        };
        ASMifier.main(array);
    }
}
{% endraw %}
{% endhighlight %}

无论是`ASMifier`类里的`main()`方法，还是`Textifier`类里的`main()`方法，它们本质上都是调用了`Printer`类里的`main()`方法。在`Printer`类里的`main()`方法里，代码的功能也是通过`TraceClassVisitor`类来实现的。

## 总结

在这篇文章中，我们主要介绍了`Printer`、`ASMifier`和`Textifier`这三个类；介绍这三个类的主要目的是为了方便理解`TraceClassVisitor`类的工作原理。

有些场景下，我们手边可能没有Java的开发工具（例如，IDEA或Eclipse），因此就不能直接来写ASM代码；那么，我们就可以从命令行使用`ASMifier`类和`Textifier`类。
