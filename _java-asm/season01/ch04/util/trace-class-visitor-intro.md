---
title: "TraceClassVisitor 介绍"
sequence: "403"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

`TraceClassVisitor` class extends the `ClassVisitor` class, and builds **a textual representation of the visited class**.

## TraceClassVisitor 类

### class info

第一个部分，`TraceClassVisitor` 类继承自 `ClassVisitor` 类，而且有 `final` 修饰，因此不会存在子类。

```java
public final class TraceClassVisitor extends ClassVisitor {
}
```

### fields

第二个部分，`TraceClassVisitor` 类定义的字段有哪些。`TraceClassVisitor` 类有两个重要的字段，一个是 `PrintWriter printWriter` 用于打印；另一个是 `Printer p` 将 class 转换成文字信息。

```java
public final class TraceClassVisitor extends ClassVisitor {
    private final PrintWriter printWriter; // 真正打印输出的类
    public final Printer p; // 信息采集器
}
```

### constructors

第三个部分，`TraceClassVisitor` 类定义的构造方法有哪些。

```java
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
```

### methods

第四个部分，`TraceClassVisitor` 类定义的方法有哪些。对于 `TraceClassVisitor` 类的 `visit()`、`visitField()`、`visitMethod()` 和 `visitEnd()` 方法，会分别调用 `Printer.visit()`、`Printer.visitField()`、`Printer.visitMethod()` 和 `Printer.visitClassEnd()` 方法。

```java
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
            p.print(printWriter); // Printer 和 PrintWriter 进行结合
            printWriter.flush();
        }
        super.visitEnd();
    }
}
```

## 如何使用 TraceClassVisitor 类

使用 `TraceClassVisitor` 类，很重点的一点就是选择 `Printer` 类的具体实现，可以选择 `ASMifier` 类，也可以选择 `Textifier` 类（默认）：

```text
boolean flag = true or false;
Printer printer = flag ? new ASMifier() : new Textifier();
PrintWriter printWriter = new PrintWriter(System.out, true);
TraceClassVisitor traceClassVisitor = new TraceClassVisitor(null, printer, printWriter);
```

### 生成新的类

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.FieldVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.util.TraceClassVisitor;

import java.io.PrintWriter;

import static org.objectweb.asm.Opcodes.*;

public class TraceClassVisitorExample01Generate {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);

        // (1) 生成 byte[] 内容
        byte[] bytes = dump();

        // (2) 保存 byte[] 到文件
        FileUtils.writeBytes(filepath, bytes);
    }

    public static byte[] dump() throws Exception {
        // (1) 创建 ClassWriter 对象
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
        PrintWriter printWriter = new PrintWriter(System.out);
        TraceClassVisitor cv = new TraceClassVisitor(cw, printWriter);

        // (2) 调用 visitXxx() 方法
        cv.visit(V1_8, ACC_PUBLIC + ACC_SUPER, "sample/HelloWorld", null, "java/lang/Object", null);

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
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("Hello World");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(2, 1);
            mv2.visitEnd();
        }

        cv.visitEnd();

        // (3) 调用 toByteArray() 方法
        return cw.toByteArray();
    }
}
```

### 修改已有的类

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.util.TraceClassVisitor;

import java.io.PrintWriter;

public class TraceClassVisitorExample02Transform {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        //（1）构建 ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建 ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连 ClassVisitor
        int api = Opcodes.ASM9;
        PrintWriter printWriter = new PrintWriter(System.out);
        TraceClassVisitor tcv = new TraceClassVisitor(cw, printWriter);
        ClassVisitor cv = new MethodTimerVisitor(api, tcv);

        //（4）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成 byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

### 打印 ASM 代码

```java
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
```

## 如何使用 TraceMethodVisitor 类

有的时候，我们想打印出某一个具体方法包含的指令。在实现这个功能的时候，使用 Tree API 比较容易一些，因为 `MethodNode` 类（Tree API）就代表一个单独的方法。那么，结合 `MethodNode` 和 `TraceMethodVisitor` 类，我们就可以打印出该方法包含的指令。

```java
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.AbstractInsnNode;
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.InsnList;
import org.objectweb.asm.tree.MethodNode;
import org.objectweb.asm.util.Textifier;
import org.objectweb.asm.util.TraceMethodVisitor;

import java.io.PrintWriter;
import java.util.List;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes = FileUtils.readBytes(filepath);

        //（1）构建 ClassReader
        ClassReader cr = new ClassReader(bytes);

        //（2）生成 ClassNode
        int api = Opcodes.ASM9;
        ClassNode cn = new ClassNode();

        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cn, parsingOptions);

        //（3）找到某个具体的方法
        List<MethodNode> methods = cn.methods;
        MethodNode mn = methods.get(1);

        //（4）打印输出
        Textifier printer = new Textifier();
        TraceMethodVisitor tmv = new TraceMethodVisitor(printer);

        InsnList instructions = mn.instructions;
        for (AbstractInsnNode node : instructions) {
            node.accept(tmv);
        }
        List<Object> list = printer.text;
        printList(list);
    }

    private static void printList(List<?> list) {
        PrintWriter writer = new PrintWriter(System.out);
        printList(writer, list);
        writer.flush();
    }

    // 下面这段代码来自 org.objectweb.asm.util.Printer.printList() 方法
    private static void printList(final PrintWriter printWriter, final List<?> list) {
        for (Object o : list) {
            if (o instanceof List) {
                printList(printWriter, (List<?>) o);
            }
            else {
                printWriter.print(o);
            }
        }
    }
}
```

## 总结

本文对 `TraceClassVisitor` 类进行了介绍，内容总结如下：

- 第一点，从整体上来说，`TraceClassVisitor` 类的作用是什么。它能够将 class 文件的内容转换成文字输出。
- 第二点，从结构上来说，`TraceClassVisitor` 类的各个部分包含哪些信息。
- 第三点，从使用上来说，`TraceClassVisitor` 类的输出结果依赖于 `Printer` 类的具体实现，可以选择 `ASMifier` 类输出 ASM 代码，也可以选择 `Textifier` 类输出 Instruction 信息。
