---
title: "创建对象"
sequence: "302"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

在字节码层面，创建对象，会用到 `new/dup/invokespecial` 指令的集合。本文主要介绍三个问题：

- 第一个问题：为什么要使用 dup 指令呢？
- 第二个问题：是否可以将 dup 指令替换成别的指令（`astore`）呢？
- 第三个问题：是否可以打印未初始化的对象？

## 为什么要用 dup 指令

假如有一个 `GoodChild` 类，代码如下：

```java
package sample;

public class GoodChild {
    private String name;
    private int age;

    public GoodChild(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return String.format("GoodChild{name='%s', age=%d}", name, age);
    }
}
```

假如有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        GoodChild child = new GoodChild("tom", 10);
        System.out.println(child);
    }
}
```

假如有一个 `HelloWorldRun` 类，其代码如下：

```java
import sample.HelloWorld;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        HelloWorld instance = new HelloWorld();
        instance.test();
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$  javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: new           #2                  // class sample/GoodChild
       3: dup
       4: ldc           #3                  // String tom
       6: bipush        10
       8: invokespecial #4                  // Method sample/GoodChild."<init>":(Ljava/lang/String;I)V
      11: astore_1
      12: getstatic     #5                  // Field java/lang/System.out:Ljava/io/PrintStream;
      15: aload_1
      16: invokevirtual #6                  // Method java/io/PrintStream.println:(Ljava/lang/Object;)V
      19: return
}
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: new             #2       // {this} | {uninitialized_GoodChild}
0003: dup                      // {this} | {uninitialized_GoodChild, uninitialized_GoodChild}
0004: ldc             #3       // {this} | {uninitialized_GoodChild, uninitialized_GoodChild, String}
0006: bipush          10       // {this} | {uninitialized_GoodChild, uninitialized_GoodChild, String, int}
0008: invokespecial   #4       // {this} | {GoodChild}
0011: astore_1                 // {this, GoodChild} | {}
0012: getstatic       #5       // {this, GoodChild} | {PrintStream}
0015: aload_1                  // {this, GoodChild} | {PrintStream, GoodChild}
0016: invokevirtual   #6       // {this, GoodChild} | {}
0019: return                   // {} | {}
```

## 使用 astore 替换 dup 指令


```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldGenerateCore {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);

        // (1) 生成 byte[]内容
        byte[] bytes = dump();

        // (2) 保存 byte[]到文件
        FileUtils.writeBytes(filepath, bytes);
    }

    public static byte[] dump() throws Exception {
        // (1) 创建 ClassWriter 对象
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (2) 调用 visitXxx()方法
        cw.visit(V1_8, ACC_PUBLIC + ACC_SUPER, "sample/HelloWorld",
                null, "java/lang/Object", null);

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
            mv2.visitTypeInsn(NEW, "sample/GoodChild");
            mv2.visitVarInsn(ASTORE, 1);
            mv2.visitVarInsn(ALOAD, 1);
            mv2.visitLdcInsn("tom");
            mv2.visitIntInsn(BIPUSH, 10);
            mv2.visitMethodInsn(INVOKESPECIAL, "sample/GoodChild", "<init>", "(Ljava/lang/String;I)V", false);

            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitVarInsn(ALOAD, 1);
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/Object;)V", false);
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(4, 2);
            mv2.visitEnd();
        }
        cw.visitEnd();

        // (3) 调用 toByteArray()方法
        return cw.toByteArray();
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: new           #11                 // class sample/GoodChild
       3: astore_1
       4: aload_1
       5: ldc           #13                 // String tom
       7: bipush        10
       9: invokespecial #16                 // Method sample/GoodChild."<init>":(Ljava/lang/String;I)V
      12: getstatic     #22                 // Field java/lang/System.out:Ljava/io/PrintStream;
      15: aload_1
      16: invokevirtual #28                 // Method java/io/PrintStream.println:(Ljava/lang/Object;)V
      19: return
}
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: new             #11      // {this} | {uninitialized_GoodChild}
0003: astore_1                 // {this, uninitialized_GoodChild} | {}
0004: aload_1                  // {this, uninitialized_GoodChild} | {uninitialized_GoodChild}
0005: ldc             #13      // {this, uninitialized_GoodChild} | {uninitialized_GoodChild, String}
0007: bipush          10       // {this, uninitialized_GoodChild} | {uninitialized_GoodChild, String, int}
0009: invokespecial   #16      // {this, GoodChild} | {}
0012: getstatic       #22      // {this, GoodChild} | {PrintStream}
0015: aload_1                  // {this, GoodChild} | {PrintStream, GoodChild}
0016: invokevirtual   #28      // {this, GoodChild} | {}
0019: return                   // {} | {}
```

## 打印未初始化对象

### 生成 instructions

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldGenerateCore {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);

        // (1) 生成 byte[]内容
        byte[] bytes = dump();

        // (2) 保存 byte[]到文件
        FileUtils.writeBytes(filepath, bytes);
    }

    public static byte[] dump() throws Exception {
        // (1) 创建 ClassWriter 对象
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (2) 调用 visitXxx()方法
        cw.visit(V1_8, ACC_PUBLIC + ACC_SUPER, "sample/HelloWorld",
                null, "java/lang/Object", null);

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
            mv2.visitTypeInsn(NEW, "sample/GoodChild");
            mv2.visitVarInsn(ASTORE, 1);

            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitVarInsn(ALOAD, 1);
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/Object;)V", false);
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(4, 2);
            mv2.visitEnd();
        }
        cw.visitEnd();

        // (3) 调用 toByteArray()方法
        return cw.toByteArray();
    }
}
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: new             #11      // {this} | {uninitialized_GoodChild}
0003: astore_1                 // {this, uninitialized_GoodChild} | {}
0004: getstatic       #17      // {this, uninitialized_GoodChild} | {PrintStream}
0007: aload_1                  // {this, uninitialized_GoodChild} | {PrintStream, uninitialized_GoodChild}
0008: invokevirtual   #23      // {this, uninitialized_GoodChild} | {}
0011: return                   // {} | {}
```

### 执行结果（出现错误）

运行 `HelloWorldRun` 类之后，得到如下结果：

```text
Exception in thread "main" java.lang.VerifyError: Bad type on operand stack
Exception Details:
  Location:
    sample/HelloWorld.test()V @8: invokevirtual
  Reason:
    Type uninitialized 0 (current frame, stack[1]) is not assignable to 'java/lang/Object'
  Current Frame:
    bci: @8
    flags: { }
    locals: { 'sample/HelloWorld', uninitialized 0 }
    stack: { 'java/io/PrintStream', uninitialized 0 }
  Bytecode:
    0x0000000: bb00 0b4c b200 112b b600 17b1          

	at run.HelloWorldRun.main(HelloWorldRun.java:7)
```

### 分析原因

我们可以使用 `BytecodeRun` 来还原 instructions 的内容：

```text
0x0000000: bb00 0b4c b200 112b b600 17b1
==================================================
0000: new             #11 
0003: astore_1            
0004: getstatic       #17 
0007: aload_1             
0008: invokevirtual   #23 
0011: return 
```

