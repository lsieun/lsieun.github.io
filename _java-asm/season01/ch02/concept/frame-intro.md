---
title: "frame 介绍"
sequence: "212"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## ClassFile 中的 StackMapTable

在 `ClassFile` 结构中，有一个 `StackMapTable` 结构：

- 在 `ClassFile` 结构中，每一个方法都对应于 `method_info` 结构；
- 在 `method_info` 结构中，方法体的代码存储在 `Code` 结构内；
- 在 `Code` 结构中，frame 的变化存储在 `StackMapTable` 结构中。

![](/assets/images/java/asm/max-stacks-max-locals-stack-map-frames.png)

假如有一个 `HelloWorld` 类，内容如下：

```java
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
```

### 查看 Instruction

在 `.class` 文件中，方法体的内容会被编译成一条一条的 instruction。我们可以通过使用 `javap -c sample.HelloWorld` 来查看 Instruction 的内容。

```text
public void test(boolean);
  Code:
     0: iload_1
     1: ifeq          15
     4: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
     7: ldc           #3                  // String value is true
     9: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
    12: goto          23
    15: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
    18: ldc           #5                  // String value is false
    20: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
    23: return
```

### 查看 Frame

在方法当中，每一条 Instruction 都有对应的 Frame。

我们可以通过运行 `HelloWorldFrameCore` 来查看 Frame 的具体情况：

```text
test(Z)V
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
```

或者运行 `HelloWorldFrameCore02` 来查看 Frame 的具体情况：

```text
test:(Z)V
                               // {this, int} | {}
0000: iload_1                  // {this, int} | {int}
0001: ifeq            14       // {this, int} | {}
0004: getstatic       #2       // {this, int} | {PrintStream}
0007: ldc             #3       // {this, int} | {PrintStream, String}
0009: invokevirtual   #4       // {this, int} | {}
0012: goto            11       // {} | {}
                               // {this, int} | {}
0015: getstatic       #2       // {this, int} | {PrintStream}
0018: ldc             #5       // {this, int} | {PrintStream, String}
0020: invokevirtual   #4       // {this, int} | {}
                               // {this, int} | {}
0023: return                   // {} | {}
```

严格的来说，每一条 Instruction 都对应两个 frame，一个是 instruction 执行之前的 frame，另一个是 instruction 执行之后的 frame。但是，当多个 instruction 放到一起的时候来说，第 `n` 个 instruction 执行之后的 frame，就成为第 `n+1` 个 instruction 执行之前的 frame，所以也可以理解成：每一条 instruction 对应一个 frame。

这些 frames 是要存储起来的。我们知道，每一个 instruction 对应一个 frame，如果都要存储起来，那么在 `.class` 文件中就会占用非常多的空间；而 `.class` 文件设计的一个主要目标就是尽量占用较小的存储空间，那么就需要对这些 frames 进行压缩。

### 压缩 frames

为了让 `.class` 文件占用的存储空间尽可能的小，因此要对 frames 进行压缩。

**对 frames 进行压缩，从本质上来说，就是忽略掉一些不重要的 frames，而只留下一些重要的 frames。**

那么，怎样区分哪些 frames 重要，哪些 frames 不重要呢？我们从 instruction 执行顺序的角度来看待这个问题。

如果说，instruction 是按照“一个挨一个向下顺序执行”的，那么它们对应的 frames 就不重要；相应的，instruction 在执行过程时，它是从某个地方“跳转”过来的，那么对应的 frames 就重要。

为什么说 instruction 按照“一个挨一个向下顺序执行”的 frames 不重要呢？因为这些 instruction 对应的 frame 可以很容易的推导出来。
相反，如果当前的 instruction 是从某个地方跳转过来的，就必须要记录它执行之前的 frame 的情况，否则就没有办法计算它执行之后的 frame 的情况。当然，我们这里讲的只是大体的思路，而不是具体的判断细节。

经过压缩之后的 frames，就存放在 `ClassFile` 的 `StackMapTable` 结构中。

## 如何使用 visitFrame() 方法

如果想添加 frame 的相关信息，可以通过调用 `MethodVisitor.visitFrame()` 方法来实现：

```text
                                                          ┌─── ClassReader
                                                          │
                                                          │
                                                          │                    ┌─── FieldVisitor
                                                          │                    │
                                  ┌─── asm.jar ───────────┼─── ClassVisitor ───┤
                                  │                       │                    │                     ┌─── visitLabel
                                  │                       │                    └─── MethodVisitor ───┤
                                  │                       │                                          └─── visitFrame
                                  │                       │                    ┌─── FieldWriter
                 ┌─── Core API ───┤                       └─── ClassWriter ────┤
                 │                │                                            └─── MethodWriter
                 │                │
                 │                ├─── asm-util.jar
ObjectWeb ASM ───┤                │
                 │                └─── asm-commons.jar
                 │
                 │                ┌─── asm-tree.jar
                 └─── Tree API ───┤
                                  └─── asm-analysis.jar
```

### 预期目标

```java
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
```

### 编码实现

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Label;
import org.objectweb.asm.MethodVisitor;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldGenerateCore {
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
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_MAXS);

        // (2) 调用 visitXxx() 方法
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
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC, "test", "(Z)V", null, null);
            Label elseLabel = new Label();
            Label returnLabel = new Label();

            // 第 1 段
            mv2.visitCode();
            mv2.visitVarInsn(ILOAD, 1);
            mv2.visitJumpInsn(IFEQ, elseLabel);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("value is true");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            mv2.visitJumpInsn(GOTO, returnLabel);

            // 第 2 段
            mv2.visitLabel(elseLabel);
            mv2.visitFrame(F_SAME, 0, null, 0, null); // 调用 visitFrame() 方法
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("value is false");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);

            // 第 3 段
            mv2.visitLabel(returnLabel);
            mv2.visitFrame(F_SAME, 0, null, 0, null); // 调用 visitFrame() 方法
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(2, 2);
            mv2.visitEnd();
        }

        cw.visitEnd();

        // (3) 调用 toByteArray() 方法
        return cw.toByteArray();
    }
}
```

在上面的代码中，我们创建 `ClassWriter` 对象时，使用了 `ClassWriter.COMPUTE_MAXS` 参数，这样 ASM 就会只计算 max locals 和 max stack 的值；在实现 `test()` 方法的时候，就需要明确的调用 `MethodVisitor.visitFrame()` 方法来添加相应的 frame 信息。

同时，我们也要注意到：`MethodVisitor.visitLabel()` 方法的调用在前，`MethodVisitor.visitFrame()` 方法的调用在后。因为 `MethodVisitor.visitLabel()` 方法是放置了一个潜在的跳转 label 目标，程序在跳转之后，就需要使用 `MethodVisitor.visitFrame()` 方法给出跳转之后 Frame 的具体情况。

### 验证结果

```java
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Object obj = clazz.newInstance();

        Method method = clazz.getDeclaredMethod("test", boolean.class);
        method.invoke(obj, true);
        method.invoke(obj, false);
    }
}
```

## 不推荐使用 visitFrame() 方法

为什么我们不推荐调用 `MethodVisitor.visitFrame()` 方法呢？原因是计算 frame 本身就很麻烦，还容易出错。

我们在创建 `ClassWriter` 对象的时候，使用了 `ClassWriter.COMPUTE_FRAMES` 参数：

```text
ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
```

在使用了 `ClassWriter.COMPUTE_FRAMES` 参数之后，ASM 会忽略代码当中对于 `MethodVisitor.visitFrame()` 方法的调用，并且自动帮助我们计算 stack map frame 的具体内容。

## 总结

本文主要对 frame 进行了介绍，内容总结如下：

- 第一点，在 `ClassFile` 结构中，`StackMapTable` 结构是如何得到的。
- 第二点，不推荐使用 `MethodVisitor.visitFrame()` 方法，原因是 frame 的计算复杂，容易出错。我们可以在创建 `ClassWriter` 对象的时候，使用 `ClassWriter.COMPUTE_FRAMES` 参数，这样 ASM 就会帮助我们计算 frame 的值到底是多少。
