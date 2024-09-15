---
title: "opcode: exception (1/196/205)"
sequence: "212"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## 概览

从 Instruction 的角度来说，与 exception 相关的 opcode 有 1 个，内容如下：

| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|--------|-----------------|
| 191    | athrow          |        |                 |        |                 |        |                 |

从 ASM 的角度来说，这个 `athrow` 指令与 `MethodVisitor.visitXxxInsn()` 方法对应关系如下：

- `MethodVisitor.visitInsn()`: `athrow`

## throw exception

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        throw new RuntimeException();
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

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

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitTypeInsn(NEW, "java/lang/RuntimeException");
methodVisitor.visitInsn(DUP);
methodVisitor.visitMethodInsn(INVOKESPECIAL, "java/lang/RuntimeException", "<init>", "()V", false);
methodVisitor.visitInsn(ATHROW);
methodVisitor.visitMaxs(2, 1);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: new             #2       // {this} | {uninitialized_RuntimeException}
0003: dup                      // {this} | {uninitialized_RuntimeException, uninitialized_RuntimeException}
0004: invokespecial   #3       // {this} | {RuntimeException}
0007: athrow                   // {} | {}
```

从 JVM 规范的角度来看，`athrow` 指令对应的 Operand Stack 的变化如下：

```text
..., objectref →

objectref
```

The `objectref` must be of type `reference` and must refer to an object that is an instance of class `Throwable` or of a subclass of `Throwable`. It is popped from the operand stack. The `objectref` is then thrown by searching the current method for the first exception handler that matches the class of `objectref`.

- If an exception handler that matches `objectref` is found, it contains the location of the code intended to handle this exception. The `pc` register is reset to that location, the operand stack of the current frame is cleared, `objectref` is pushed back onto the operand stack, and execution continues.
- If no matching exception handler is found in the current frame, that frame is popped. Finally, the frame of its invoker is reinstated, if such a frame exists, and the `objectref` is rethrown. If no such frame exists, the current thread exits.

## catch exception

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        try {
            int val = 1 / 0;
        }
        catch (ArithmeticException e1) {
            System.out.println("catch ArithmeticException");
        }
        catch (Exception e2) {
            System.out.println("catch Exception");
        }
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

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

从 ASM 的视角来看，方法体对应的内容如下：

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

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_1                 // {this} | {int}
0001: iconst_0                 // {this} | {int, int}
0002: idiv                     // {this} | {int}
0003: istore_1                 // {this, int} | {}
0004: goto            24       // {} | {}
                               // {this} | {ArithmeticException}
0007: astore_1                 // {this, ArithmeticException} | {}
0008: getstatic       #3       // {this, ArithmeticException} | {PrintStream}
0011: ldc             #4       // {this, ArithmeticException} | {PrintStream, String}
0013: invokevirtual   #5       // {this, ArithmeticException} | {}
0016: goto            12       // {} | {}
                               // {this} | {Exception}
0019: astore_1                 // {this, Exception} | {}
0020: getstatic       #3       // {this, Exception} | {PrintStream}
0023: ldc             #7       // {this, Exception} | {PrintStream, String}
0025: invokevirtual   #5       // {this, Exception} | {}
                               // {this} | {}
0028: return                   // {} | {}
```

