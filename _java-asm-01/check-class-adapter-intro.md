---
title:  "CheckClassAdapter介绍"
sequence: "402"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

The `ClassWriter` class does not check that its methods are called in **the appropriate order** and with **valid arguments**.
It is therefore possible to generate invalid classes that will be rejected by the Java Virtual Machine verifier.

In order to detect some of these errors as soon as possible, it is possible to use the `CheckClassAdapter` class.

This `CheckClassAdapter` class checks that its methods are called in the **appropriate order**, and with **valid arguments**,
before delegating to the next visitor.

## 如何使用

使用`CheckClassAdapter`类，其实很简单：

```text
byte[] bytes = ... // 这里是class file bytes
PrintWriter printWriter = new PrintWriter(System.out);
CheckClassAdapter.verify(new ClassReader(bytes), true, printWriter);
```

### 生成新的类

```java
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.FieldVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.util.CheckClassAdapter;

import java.io.PrintWriter;

import static org.objectweb.asm.Opcodes.*;

public class CheckClassAdapterExample01Generate {
    public static void main(String[] args) throws Exception {
        // (1) 生成byte[]内容
        byte[] bytes = dump();

        // (2) 检查
        PrintWriter printWriter = new PrintWriter(System.out);
        CheckClassAdapter.verify(new ClassReader(bytes), true, printWriter);
    }

    public static byte[] dump() throws Exception {
        // (1) 创建ClassWriter对象
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (2) 调用visitXxx()方法
        cw.visit(V1_8, ACC_PUBLIC + ACC_SUPER, "sample/HelloWorld",
                null, "java/lang/Object", null);

        {
            FieldVisitor fv = cw.visitField(ACC_PRIVATE, "intValue", "I", null, null);
            fv.visitEnd();
        }

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
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC, "test", "()V", null, null);
            mv2.visitCode();
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("Hello World");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(2, 1);
            mv2.visitEnd();
        }

        cw.visitEnd();

        // (3) 调用toByteArray()方法
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
import org.objectweb.asm.util.CheckClassAdapter;

import java.io.PrintWriter;

public class CheckClassAdapterExample02Transform {
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
        ClassVisitor cv = new CheckClassAdapter(cw, true);

        //（4）结合ClassReader和ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成byte[]
        byte[] bytes2 = cw.toByteArray();

        // (6) 检查
        PrintWriter printWriter = new PrintWriter(System.out);
        CheckClassAdapter.verify(new ClassReader(bytes2), true, printWriter);
    }
}
```

## 示例检测

### 检测：没有return语句

如果注释掉`mv2.visitInsn(RETURN);`语句，会出现什么错误呢？

```text
org.objectweb.asm.tree.analysis.AnalyzerException: Execution can fall off the end of the code
	at org.objectweb.asm.tree.analysis.Analyzer.findSubroutine(Analyzer.java:322)
	at org.objectweb.asm.tree.analysis.Analyzer.analyze(Analyzer.java:138)
	at org.objectweb.asm.util.CheckClassAdapter.verify(CheckClassAdapter.java:1063)
	at org.objectweb.asm.util.CheckClassAdapter.verify(CheckClassAdapter.java:1021)
	at sample.HelloWorldGenerateCoreCheck.main(HelloWorldGenerateCoreCheck.java:20)
test()V
00000 ?    :     GETSTATIC java/lang/System.out : Ljava/io/PrintStream;
00001 ?    :     LDC "Hello World"
00002 ?    :     INVOKEVIRTUAL java/io/PrintStream.println (Ljava/lang/String;)V
```

### 检测：没有`visitMaxs()`方法

如果注释掉`mv2.visitMaxs(2, 1);`语句，会出现什么错误呢？

```text
org.objectweb.asm.tree.analysis.AnalyzerException: Error at instruction 0: Insufficient maximum stack size.
	at org.objectweb.asm.tree.analysis.Analyzer.analyze(Analyzer.java:295)
	at org.objectweb.asm.util.CheckClassAdapter.verify(CheckClassAdapter.java:1063)
	at org.objectweb.asm.util.CheckClassAdapter.verify(CheckClassAdapter.java:1021)
	at sample.HelloWorldGenerateCoreCheck.main(HelloWorldGenerateCoreCheck.java:20)
Caused by: java.lang.IndexOutOfBoundsException: Insufficient maximum stack size.
	at org.objectweb.asm.tree.analysis.Frame.push(Frame.java:241)
	at org.objectweb.asm.tree.analysis.Frame.execute(Frame.java:561)
	at org.objectweb.asm.tree.analysis.Analyzer.analyze(Analyzer.java:187)
	... 3 more
test()V
00000 HelloWorld  :  :     GETSTATIC java/lang/System.out : Ljava/io/PrintStream;
00001 ?  :     LDC "Hello World"
00002 ?  :     INVOKEVIRTUAL java/io/PrintStream.println (Ljava/lang/String;)V
00003 ?  :     RETURN
```

### 检测：方法描述符不对

将下面方法的描述符（`(Ljava/lang/String;)V`）修改成`(I)V`，会出现什么错误呢？

```text
mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
mv2.visitLdcInsn("Hello World");
mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
```

```text
org.objectweb.asm.tree.analysis.AnalyzerException: Error at instruction 2: Argument 1: expected I, but found Ljava/lang/String;
	at org.objectweb.asm.tree.analysis.Analyzer.analyze(Analyzer.java:291)
	at org.objectweb.asm.util.CheckClassAdapter.verify(CheckClassAdapter.java:1063)
	at org.objectweb.asm.util.CheckClassAdapter.verify(CheckClassAdapter.java:1021)
	at sample.HelloWorldGenerateCoreCheck.main(HelloWorldGenerateCoreCheck.java:20)
Caused by: org.objectweb.asm.tree.analysis.AnalyzerException: Argument 1: expected I, but found Ljava/lang/String;
	at org.objectweb.asm.tree.analysis.BasicVerifier.naryOperation(BasicVerifier.java:402)
	at org.objectweb.asm.tree.analysis.BasicVerifier.naryOperation(BasicVerifier.java:43)
	at org.objectweb.asm.tree.analysis.Frame.executeInvokeInsn(Frame.java:646)
	at org.objectweb.asm.tree.analysis.Frame.execute(Frame.java:573)
	at org.objectweb.asm.tree.analysis.Analyzer.analyze(Analyzer.java:187)
	... 3 more
test()V
00000 HelloWorld  :  :     GETSTATIC java/lang/System.out : Ljava/io/PrintStream;
00001 HelloWorld  : PrintStream  :     LDC "Hello World"
00002 HelloWorld  : PrintStream String  :     INVOKEVIRTUAL java/io/PrintStream.println (I)V
00003 ?    :     RETURN
```

### 检测不出：重复类成员

如果出现重复的字段或者重复的方法，`CheckClassAdapter`类是检测不出来的：

```text
{
	FieldVisitor fv = cw.visitField(ACC_PRIVATE, "intValue", "I", null, null);
	fv.visitEnd();
}

{
	FieldVisitor fv = cw.visitField(ACC_PRIVATE, "intValue", "I", null, null);
	fv.visitEnd();
}
```

## 总结

本文对`CheckClassAdapter`进行了介绍，内容总结如下：

- 第一点，作为一个工具类，`CheckClassAdapter`类的主要作用是检查生成的`byte[]`内容是否合法，但是它能够实现的检查功能是有限的，有一些问题是无法检测出来的。
- 第二点，在编写ASM代码的过程中，除了使用`CheckClassAdapter`类帮助检查，我们自身所具备的“细心认真的态度”和“缜密的思考”是非常重要的、不可替代的因素。
