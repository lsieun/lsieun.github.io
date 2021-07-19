---
title:  "opcode: exception (1/196/205)"
sequence: "212"
---

## 概览

从Instruction的角度来说，与exception相关的opcode有1个，内容如下：

| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|--------|-----------------|
| 191    | athrow          |        |                 |        |                 |        |                 |

从ASM的角度来说，这个`athrow`指令与`MethodVisitor.visitXxxInsn()`方法对应关系如下：

- `MethodVisitor.visitInsn()`: `athrow`

## throw exception

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test() {
        throw new RuntimeException();
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

```text
$ javap -c -p sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: new           #2                  // class java/lang/RuntimeException
       3: dup
       4: invokespecial #3                  // Method java/lang/RuntimeException."<init>":()V
       7: athrow
}
```

从ASM的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitTypeInsn(NEW, "java/lang/RuntimeException");
methodVisitor.visitInsn(DUP);
methodVisitor.visitMethodInsn(INVOKESPECIAL, "java/lang/RuntimeException", "<init>", "()V", false);
methodVisitor.visitInsn(ATHROW);
methodVisitor.visitMaxs(2, 1);
methodVisitor.visitEnd();
```

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld] []
[sample/HelloWorld] [uninitialized_java/lang/RuntimeException]
[sample/HelloWorld] [uninitialized_java/lang/RuntimeException, uninitialized_java/lang/RuntimeException]
[sample/HelloWorld] [java/lang/RuntimeException]
[] []
```

从JVM规范的角度来看，`athrow`指令对应的Operand Stack的变化如下：

```text
..., objectref →

objectref
```

The `objectref` must be of type `reference` and must refer to an object that is an instance of class `Throwable` or of a subclass of `Throwable`. It is popped from the operand stack. The `objectref` is then thrown by searching the current method for the first exception handler that matches the class of `objectref`.

- If an exception handler that matches `objectref` is found, it contains the location of the code intended to handle this exception. The `pc` register is reset to that location, the operand stack of the current frame is cleared, `objectref` is pushed back onto the operand stack, and execution continues.
- If no matching exception handler is found in the current frame, that frame is popped. Finally, the frame of its invoker is reinstated, if such a frame exists, and the `objectref` is rethrown. If no such frame exists, the current thread exits.

## catch exception

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test() {
        try {
            int val = 1 / 0;
        } catch (ArithmeticException e1) {
            System.out.println("catch ArithmeticException");
        } catch (Exception e2) {
            System.out.println("catch Exception");
        }
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

```text
$ javap -c -p sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: iconst_1
       1: iconst_0
       2: idiv
       3: istore_1
       4: goto          28
       7: astore_1
       8: getstatic     #3                  // Field java/lang/System.out:Ljava/io/PrintStream;
      11: ldc           #4                  // String catch ArithmeticException
      13: invokevirtual #5                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      16: goto          28
      19: astore_1
      20: getstatic     #3                  // Field java/lang/System.out:Ljava/io/PrintStream;
      23: ldc           #7                  // String catch Exception
      25: invokevirtual #5                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      28: return
    Exception table:
       from    to  target type
           0     4     7   Class java/lang/ArithmeticException
           0     4    19   Class java/lang/Exception
}
```

从ASM的视角来看，方法体对应的内容如下：

```text
Label label0 = new Label();
Label label1 = new Label();
Label label2 = new Label();
Label label3 = new Label();
Label label4 = new Label();

methodVisitor.visitCode();
methodVisitor.visitTryCatchBlock(label0, label1, label2, "java/lang/ArithmeticException");
methodVisitor.visitTryCatchBlock(label0, label1, label3, "java/lang/Exception");

methodVisitor.visitLabel(label0);
methodVisitor.visitInsn(ICONST_1);
methodVisitor.visitInsn(ICONST_0);
methodVisitor.visitInsn(IDIV);
methodVisitor.visitVarInsn(ISTORE, 1);

methodVisitor.visitLabel(label1);
methodVisitor.visitJumpInsn(GOTO, label4);

methodVisitor.visitLabel(label2);
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
methodVisitor.visitLdcInsn("catch ArithmeticException");
methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
methodVisitor.visitJumpInsn(GOTO, label4);

methodVisitor.visitLabel(label3);
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
methodVisitor.visitLdcInsn("catch Exception");
methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);

methodVisitor.visitLabel(label4);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 2);
methodVisitor.visitEnd();
```

如果我们将两个`visitTryCatchBlock`顺序变换一下位置，如下所示，会怎么样呢？这样修改之后，捕获的就是`Exception`类型的异常，而不是`ArithmeticException`类型的异常。

```text
methodVisitor.visitTryCatchBlock(label0, label1, label3, "java/lang/Exception");
methodVisitor.visitTryCatchBlock(label0, label1, label2, "java/lang/ArithmeticException");
```

完整代码如下：

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
            Label label0 = new Label();
            Label label1 = new Label();
            Label label2 = new Label();
            Label label3 = new Label();
            Label label4 = new Label();

            mv2.visitCode();
            mv2.visitTryCatchBlock(label0, label1, label3, "java/lang/Exception");
            mv2.visitTryCatchBlock(label0, label1, label2, "java/lang/ArithmeticException");


            mv2.visitLabel(label0);
            mv2.visitInsn(ICONST_1);
            mv2.visitInsn(ICONST_0);
            mv2.visitInsn(IDIV);
            mv2.visitVarInsn(ISTORE, 1);

            mv2.visitLabel(label1);
            mv2.visitJumpInsn(GOTO, label4);

            mv2.visitLabel(label2);
            mv2.visitVarInsn(ASTORE, 1);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("catch ArithmeticException");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            mv2.visitJumpInsn(GOTO, label4);

            mv2.visitLabel(label3);
            mv2.visitVarInsn(ASTORE, 1);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("catch Exception");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);

            mv2.visitLabel(label4);
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(2, 2);
            mv2.visitEnd();
        }
        cw.visitEnd();

        // (3) 调用toByteArray()方法
        return cw.toByteArray();
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

```text
$ javap -c -p sample.HelloWorld
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: iconst_1
       1: iconst_0
       2: idiv
       3: istore_1
       4: goto          28
       7: astore_1
       8: getstatic     #19                 // Field java/lang/System.out:Ljava/io/PrintStream;
      11: ldc           #21                 // String catch ArithmeticException
      13: invokevirtual #27                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      16: goto          28
      19: astore_1
      20: getstatic     #19                 // Field java/lang/System.out:Ljava/io/PrintStream;
      23: ldc           #29                 // String catch Exception
      25: invokevirtual #27                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      28: return
    Exception table:
       from    to  target type
           0     4    19   Class java/lang/Exception
           0     4     7   Class java/lang/ArithmeticException
}
```

