---
title:  "修改已有的方法（删除－移除Instruction）"
sequence: "308"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

## 如何移除Instruction

在修改方法体的代码时，**如何移除一条Instruction呢**？其实，很简单，就是**让中间的某一个`MethodVisitor`对象不向后“传递该instruction”就可以了**。

{:refdef: style="text-align: center;"}
![多个FieldVisitor和MethodVisitor串联到一起](/assets/images/java/asm/multiple-field-method-vistors-connected.png)
{: refdef}

但是，需要要注意一点：**无论是添加instruction，还是删除instruction，还是要替换instruction，都要保持operand stack修改前和修改后是一致的**。这句话该怎么理解呢？我们举个例子来进行说明。

假如，有一条打印语句，如下：

```text
System.out.println("Hello World");
```

这条打印语句，对应着三个instruction，如下：

```text
GETSTATIC java/lang/System.out : Ljava/io/PrintStream;
LDC "Hello World"
INVOKEVIRTUAL java/io/PrintStream.println (Ljava/lang/String;)V
```

上面三条instruction的执行过程如下：

- 第一步，执行`GETSTATIC java/lang/System.out : Ljava/io/PrintStream;`，会把一个`System.out`对象push到operand stack上。
- 第二步，执行`LDC "Hello World"`，会将一个字符串对象push到operand stack上。
- 第三步，执行`INVOKEVIRTUAL java/io/PrintStream.println (Ljava/lang/String;)V`，会消耗掉operand stack栈顶上的两个元素，然后打印出结果。

如果我们只想删除第三条`INVOKEVIRTUAL`对应的instruction，是不行的，因为它会让operand stack栈顶上多出两个元素。这三条instruction应该一起删除，才能保证operand stack在修改前和修改后是一致的。

## 示例：移除NOP

为了让示例容易一些，我们先来处理一个比较简单的情况，那就是移除`NOP`指令。那么，为什么要移除`NOP`指令呢？因为`NOP`表示no operation，它是一个单独的指令，本身也不做什么操作，我们删除它不会影响任何实质性的操作，也不会牵连其它的instruction。

当然，一般情况下，由`.java`编译生成的`.class`文件中不会包含`NOP`指令。那么，我们就自己生成一个`.class`文件，让它带有`NOP`指令。

### 预期目标

我们想实现的预期目标：删除代码当中的`NOP`指令。

首先，我们来生成一个包含`NOP`指令的`.class`文件，如下：

```java
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
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (2) 调用visitXxx()方法
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
        cw.visitEnd();

        // (3) 调用toByteArray()方法
        return cw.toByteArray();
    }
}
```

查看生成后的效果：

```text
$ javap -c sample.HelloWorld
public class sample.HelloWorld {
  public sample.HelloWorld();
    Code:
       0: aload_0
       1: invokespecial #8                  // Method java/lang/Object."<init>":()V
       4: return

  public void test();
    Code:
       0: nop
       1: getstatic     #15                 // Field java/lang/System.out:Ljava/io/PrintStream;
       4: nop
       5: ldc           #17                 // String Hello World
       7: nop
       8: invokevirtual #23                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      11: nop
      12: return
}
```

### 编码实现

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;

import static org.objectweb.asm.Opcodes.*;

public class MethodRemoveNopVisitor extends ClassVisitor {
    public MethodRemoveNopVisitor(int api, ClassVisitor classVisitor) {
        super(api, classVisitor);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        if (mv != null && !"<init>".equals(name) && !"<clinit>".equals(name)) {
            boolean isAbstractMethod = (access & ACC_ABSTRACT) != 0;
            boolean isNativeMethod = (access & ACC_NATIVE) != 0;
            if (!isAbstractMethod && !isNativeMethod) {
                mv = new MethodRemoveNopAdapter(api, mv);
            }

        }
        return mv;
    }

    private static class MethodRemoveNopAdapter extends MethodVisitor {
        public MethodRemoveNopAdapter(int api, MethodVisitor methodVisitor) {
            super(api, methodVisitor);
        }

        @Override
        public void visitInsn(int opcode) {
            if (opcode != NOP) {
                super.visitInsn(opcode);
            }
        }
    }
}
```

### 进行转换

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

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
        ClassVisitor cv = new MethodRemoveNopVisitor(api, cw);

        //（4）结合ClassReader和ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

### 验证结果

```text
$ javap -c sample.HelloWorld
public class sample.HelloWorld {
  public sample.HelloWorld();
    Code:
       0: aload_0
       1: invokespecial #8                  // Method java/lang/Object."<init>":()V
       4: return

  public void test();
    Code:
       0: getstatic     #15                 // Field java/lang/System.out:Ljava/io/PrintStream;
       3: ldc           #17                 // String Hello World
       5: invokevirtual #23                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
       8: return
}
```

## 总结

本文主要对移除Instruction进行了介绍，内容总结如下：

- 第一点，移除Instruction方式，就是让中间的某一个`MethodVisitor`对象不向后“传递该instruction”就可以了。
- 第二点，在移除instruction的过程中，要保证operand stack在修改前和修改后是一致的。

在后面的内容当中，我们会介绍到如何删除打印语句，因为它要经历一个“模式识别”的过程，相对复杂一些，所以我们放到后面的内容再来讨论。
