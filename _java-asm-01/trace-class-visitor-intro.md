---
title:  "TraceClassVisitor介绍"
sequence: "403"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

This `TraceClassVisitor` class, as its name implies, extends the `ClassVisitor` class, and builds **a textual representation of the visited class**.



## TraceClassVisitor类

### class info

{% highlight java %}
{% raw %}
public final class TraceClassVisitor extends ClassVisitor {
}
{% endraw %}
{% endhighlight %}

### fields

{% highlight java %}
{% raw %}
public final class TraceClassVisitor extends ClassVisitor {
    private final PrintWriter printWriter; // 真正打印输出的类
    public final Printer p; // 信息采集器
}
{% endraw %}
{% endhighlight %}

### constructors

{% highlight java %}
{% raw %}
public final class TraceClassVisitor extends ClassVisitor {
    public TraceClassVisitor(final PrintWriter printWriter) {
        this(null, printWriter);
    }

    public TraceClassVisitor(final ClassVisitor classVisitor, final PrintWriter printWriter) {
        this(classVisitor, new Textifier(), printWriter);
    }

    public TraceClassVisitor(final ClassVisitor classVisitor, final Printer printer, final PrintWriter printWriter) {
        super(Opcodes.ASM10_EXPERIMENTAL, classVisitor);
        this.printWriter = printWriter;
        this.p = printer;
    }
}
{% endraw %}
{% endhighlight %}

### methods

{% highlight java %}
{% raw %}
public final class TraceClassVisitor extends ClassVisitor {
    @Override
    public void visit(final int version, final int access, final String name, final String signature,
                      final String superName, final String[] interfaces) {
        p.visit(version, access, name, signature, superName, interfaces);
        super.visit(version, access, name, signature, superName, interfaces);
    }

    @Override
    public FieldVisitor visitField(final int access, final String name, final String descriptor,
                                   final String signature, final Object value) {
        Printer fieldPrinter = p.visitField(access, name, descriptor, signature, value);
        return new TraceFieldVisitor(super.visitField(access, name, descriptor, signature, value), fieldPrinter);
    }

    @Override
    public MethodVisitor visitMethod(final int access, final String name, final String descriptor,
                                     final String signature, final String[] exceptions) {
        Printer methodPrinter = p.visitMethod(access, name, descriptor, signature, exceptions);
        return new TraceMethodVisitor(super.visitMethod(access, name, descriptor, signature, exceptions), methodPrinter);
    }

    @Override
    public void visitEnd() {
        p.visitClassEnd();
        if (printWriter != null) {
            p.print(printWriter); // Printer和PrintWriter进行结合
            printWriter.flush();
        }
        super.visitEnd();
    }
}
{% endraw %}
{% endhighlight %}

## 如何使用

In order to check that a generated or transformed class is conforming to what you expect,
the byte array returned by a `ClassWriter` is not really helpful because it is unreadable by humans.
**A textual representation would be much easier to use**.
This is what the `TraceClassVisitor` class provides.

So, instead of using a `ClassWriter` to generate your classes, you can use a `TraceClassVisitor`,
in order to get a readable trace of what is actually generated.
Or, even better, you can use both at the same time.
Indeed, the `TraceClassVisitor` can, in addition to its default behavior,
delegate all calls to its methods to another visitor, for instance a `ClassWriter`.

使用`TraceClassVisitor`类，很重点的一点就是选择`Printer`类的具体实现，可以选择`ASMifier`类，也可以选择`Textifier`类（默认）：

{% highlight java %}
{% raw %}
boolean flag = true or false;
Printer printer = flag ? new ASMifier() : new Textifier();
PrintWriter printWriter = new PrintWriter(System.out, true);
TraceClassVisitor traceClassVisitor = new TraceClassVisitor(null, printer, printWriter);
{% endraw %}
{% endhighlight %}

### 生成新的类

{% highlight java %}
{% raw %}
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.FieldVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.util.TraceClassVisitor;

import java.io.PrintWriter;

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
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
        PrintWriter printWriter = new PrintWriter(System.out);
        TraceClassVisitor cv = new TraceClassVisitor(cw, printWriter);

        // (2) 调用visitXxx()方法
        cv.visit(V1_8, ACC_PUBLIC + ACC_SUPER, "sample/HelloWorld",
                null, "java/lang/Object", null);

        {
            FieldVisitor fv1 = cv.visitField(ACC_PRIVATE, "intValue", "I", null, null);
            fv1.visitEnd();
        }
        {
            FieldVisitor fv2 = cv.visitField(ACC_PRIVATE, "strValue", "Ljava/lang/String;", null, null);
            fv2.visitEnd();
        }

        {
            MethodVisitor mv1 = cv.visitMethod(ACC_PUBLIC, "<init>", "()V", null, null);
            mv1.visitCode();
            mv1.visitVarInsn(ALOAD, 0);
            mv1.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
            mv1.visitInsn(RETURN);
            mv1.visitMaxs(0, 0);
            mv1.visitEnd();
        }

        {
            MethodVisitor mv2 = cv.visitMethod(ACC_PUBLIC, "test", "()V", null, null);
            mv2.visitCode();
            mv2.visitInsn(NOP);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitInsn(NOP);
            mv2.visitLdcInsn("Hello World");
            mv2.visitInsn(NOP);
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            mv2.visitInsn(NOP);
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(2, 1);
            mv2.visitEnd();
        }

        cv.visitEnd();

        // (3) 调用toByteArray()方法
        return cw.toByteArray();
    }
}
{% endraw %}
{% endhighlight %}

### 修改已有的类

{% highlight java %}
{% raw %}
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;
import org.objectweb.asm.util.TraceClassVisitor;

import java.io.PrintWriter;

public class HelloWorldTransformCore {
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
        PrintWriter printWriter = new PrintWriter(System.out);
        TraceClassVisitor tcv = new TraceClassVisitor(cw, printWriter);
        ClassVisitor cv = new MethodTimerVisitor(api, tcv);

        //（4）结合ClassReader和ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
{% endraw %}
{% endhighlight %}

### 打印ASM代码

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

## 总结


