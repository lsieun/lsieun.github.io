---
title: "CheckClassAdapter 介绍"
sequence: "402"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

The `CheckClassAdapter` class checks that its **methods are called** in the **appropriate order**, and with **valid arguments**,
before delegating to the next visitor.

## 两种使用方式

到目前为止，我们主要介绍了 Class Generation 和 Class Transformation 操作。我们可以借助于 `CheckClassAdapter` 类来检查生成的字节码内容是否正确，主要有两种使用方式：

- 在生成类或转换类的**过程中**进行检查
- 在生成类或转换类的**结束后**进行检查

### 第一种方式

第一种使用方式，是在生成类（Class Generation）或转换类（Class Transformation）的**过程中**进行检查：

```text
// 第一步，应用于 Class Generation
// 串联 ClassVisitor：cv --- cca --- cw
ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
CheckClassAdapter cca = new CheckClassAdapter(cw);
ClassVisitor cv = new MyClassVisitor(cca);

// 第二步，应用于 Class Transformation
byte[] bytes = ... // 这里是 class file bytes
ClassReader cr = new ClassReader(bytes);
cr.accept(cv, 0);
```

示例如下：

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.FieldVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.util.CheckClassAdapter;

import static org.objectweb.asm.Opcodes.*;

public class CheckClassAdapterExample01Generate {
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
        ClassVisitor cv = new CheckClassAdapter(cw);

        // (2) 调用 visitXxx() 方法
        cv.visit(V1_8, ACC_PUBLIC + ACC_SUPER, "sample/HelloWorld",
                null, "java/lang/Object", null);

        {
            FieldVisitor fv = cv.visitField(ACC_PRIVATE, "intValue", "I", null, null);
            fv.visitEnd();
        }

        {
            MethodVisitor mv1 = cv.visitMethod(ACC_PUBLIC, "<init>", "()V", null, null);
            mv1.visitCode();
            mv1.visitVarInsn(ALOAD, 0);
            mv1.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
            mv1.visitInsn(RETURN);
            mv1.visitMaxs(1, 1);
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

### 第二种方式

第二种使用方式，是在生成类（Class Generation）或转换类（Class Transformation）的**结束后**进行检查：

```text
byte[] bytes = ... // 这里是 class file bytes
PrintWriter printWriter = new PrintWriter(System.out);
CheckClassAdapter.verify(new ClassReader(bytes), false, printWriter);
```

示例如下：

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.FieldVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.util.CheckClassAdapter;

import java.io.PrintWriter;

import static org.objectweb.asm.Opcodes.*;

public class CheckClassAdapterExample02Generate {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);

        // (1) 生成 byte[] 内容
        byte[] bytes = dump();

        // (2) 保存 byte[] 到文件
        FileUtils.writeBytes(filepath, bytes);

        // (3) 检查
        PrintWriter printWriter = new PrintWriter(System.out);
        CheckClassAdapter.verify(new ClassReader(bytes), false, printWriter);
    }

    public static byte[] dump() throws Exception {
        // (1) 创建 ClassWriter 对象
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (2) 调用 visitXxx() 方法
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
            mv1.visitMaxs(1, 1);
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

        // (3) 调用 toByteArray() 方法
        return cw.toByteArray();
    }
}
```

## 检测案例

### 检测：方法调用顺序

如果将 `mv2.visitLdcInsn()` 和 `mv2.visitFieldInsn()` 顺序调换：

```text
mv2.visitLdcInsn("Hello World");
mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
```

会出现如下错误：

```text
Method owner: expected Ljava/io/PrintStream;, but found Ljava/lang/String;
```

### 检测：方法参数不对

如果将方法的描述符（`(Ljava/lang/String;)V`）修改成 `(I)V`：

```text
mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
mv2.visitLdcInsn("Hello World");
mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(I)V", false);
```

会出现如下错误：

```text
Argument 1: expected I, but found Ljava/lang/String;
```

### 检测：没有 return 语句

如果注释掉 `mv2.visitInsn(RETURN);` 语句，会出现如下错误：

```text
org.objectweb.asm.tree.analysis.AnalyzerException: Execution can fall off the end of the code
```

### 检测：不调用 `visitMaxs()` 方法

如果注释掉 `mv2.visitMaxs(2, 1);` 语句，会出现如下错误：

```text
org.objectweb.asm.tree.analysis.AnalyzerException: Error at instruction 0: Insufficient maximum stack size.
```

### 检测不出：重复类成员

如果出现重复的字段或者重复的方法，`CheckClassAdapter` 类是检测不出来的：

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

本文主要是对 `CheckClassAdapter` 类进行介绍，内容总结如下：

- 第一点，作为一个工具类，`CheckClassAdapter` 类的主要作用是检查生成的 `byte[]` 内容是否合法，但是它能够实现的检查功能是有限的，有一些问题是无法检测出来的。
- 第二点，在编写 ASM 代码的过程中，除了使用 `CheckClassAdapter` 类帮助检查，我们自身所具备的“细心认真的态度”和“缜密的思考”是非常重要的、不可替代的因素。
