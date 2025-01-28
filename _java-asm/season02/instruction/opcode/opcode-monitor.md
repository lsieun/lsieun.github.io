---
title: "opcode: monitor (2/198/205)"
sequence: "213"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## 概览

从 Instruction 的角度来说，与 monitor 相关的 opcode 有 2 个，内容如下：

| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|--------|-----------------|
| 194    | monitorenter    | 195    | monitorexit     |        |                 |        |                 |

从 ASM 的角度来说，这些 opcode 与 `MethodVisitor.visitXxxInsn()` 方法对应关系如下：

- `MethodVisitor.visitInsn()`: `monitorenter`, `monitorexit`

## 示例

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        synchronized (System.out) {
            System.out.println("Hello World");
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
       0: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
       3: dup
       4: astore_1
       5: monitorenter
       6: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
       9: ldc           #3                  // String Hello World
      11: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      14: aload_1
      15: monitorexit
      16: goto          24
      19: astore_2
      20: aload_1
      21: monitorexit
      22: aload_2
      23: athrow
      24: return
    Exception table:
       from    to  target type
           6    16    19   any
          19    22    19   any
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
methodVisitor.visitTryCatchBlock(label0, label1, label2, null);
methodVisitor.visitTryCatchBlock(label2, label3, label2, null);

methodVisitor.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
methodVisitor.visitInsn(DUP);
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitInsn(MONITORENTER);

methodVisitor.visitLabel(label0);
methodVisitor.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
methodVisitor.visitLdcInsn("Hello World");
methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
methodVisitor.visitVarInsn(ALOAD, 1);
methodVisitor.visitInsn(MONITOREXIT);

methodVisitor.visitLabel(label1);
methodVisitor.visitJumpInsn(GOTO, label4);

methodVisitor.visitLabel(label2);
methodVisitor.visitVarInsn(ASTORE, 2);
methodVisitor.visitVarInsn(ALOAD, 1);
methodVisitor.visitInsn(MONITOREXIT);

methodVisitor.visitLabel(label3);
methodVisitor.visitVarInsn(ALOAD, 2);
methodVisitor.visitInsn(ATHROW);

methodVisitor.visitLabel(label4);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 3);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: getstatic       #2       // {this} | {PrintStream}
0003: dup                      // {this} | {PrintStream, PrintStream}
0004: astore_1                 // {this, PrintStream} | {PrintStream}
0005: monitorenter             // {this, PrintStream} | {}
0006: getstatic       #2       // {this, PrintStream} | {PrintStream}
0009: ldc             #3       // {this, PrintStream} | {PrintStream, String}
0011: invokevirtual   #4       // {this, PrintStream} | {}
0014: aload_1                  // {this, PrintStream} | {PrintStream}
0015: monitorexit              // {this, PrintStream} | {}
0016: goto            8        // {} | {}
                               // {this, Object} | {Throwable}
0019: astore_2                 // {this, Object, Throwable} | {}
0020: aload_1                  // {this, Object, Throwable} | {Object}
0021: monitorexit              // {this, Object, Throwable} | {}
0022: aload_2                  // {this, Object, Throwable} | {Throwable}
0023: athrow                   // {} | {}
                               // {this} | {}
0024: return                   // {} | {}
```

从 JVM 规范的角度来看，`monitorenter` 指令对应的 Operand Stack 的变化如下：

```text
..., objectref →

...
```

The `objectref` must be of type `reference`.

Each object is associated with a monitor. A monitor is locked if and only if it has an owner. The thread that executes `monitorenter` attempts to gain ownership of the monitor associated with `objectref`, as follows:

- If the entry count of the monitor associated with `objectref` is zero, the thread enters the monitor and sets its entry count to one. The thread is then the owner of the monitor.
- If the thread already owns the monitor associated with `objectref`, it reenters the monitor, incrementing its entry count.
- If another thread already owns the monitor associated with `objectref`, the thread blocks until the monitor's entry count is zero, then tries again to gain ownership.

从 JVM 规范的角度来看，`monitorexit` 指令对应的 Operand Stack 的变化如下：

```text
..., objectref →

...
```

The `objectref` must be of type `reference`.

The thread that executes `monitorexit` must be the owner of the monitor associated with the instance referenced by `objectref`.

The thread decrements the entry count of the monitor associated with `objectref`.

- If as a result the value of the entry count is zero, the thread exits the monitor and is no longer its owner.
- Other threads that are blocking to enter the monitor are allowed to attempt to do so.
