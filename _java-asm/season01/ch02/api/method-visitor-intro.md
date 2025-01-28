---
title: "MethodVisitor 介绍"
sequence: "206"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

通过调用 `ClassVisitor` 类的 `visitMethod()` 方法，会返回一个 `MethodVisitor` 类型的对象。

```text
public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions);
```

在本文当中，我们将对 `MethodVisitor` 类进行介绍：

```text
                                                          ┌─── ClassReader
                                                          │
                                                          │
                                                          │                    ┌─── FieldVisitor
                                  ┌─── asm.jar ───────────┼─── ClassVisitor ───┤
                                  │                       │                    └─── MethodVisitor
                                  │                       │
                                  │                       │                    ┌─── FieldWriter
                 ┌─── Core API ───┤                       └─── ClassWriter ────┤
                 │                │                                            └─── MethodWriter
                 │                ├─── asm-util.jar
                 │                │
ObjectWeb ASM ───┤                └─── asm-commons.jar
                 │
                 │
                 │                ┌─── asm-tree.jar
                 └─── Tree API ───┤
                                  └─── asm-analysis.jar
```

## MethodVisitor 类

从类的结构来说，`MethodVisitor` 类与 `ClassVisitor` 类和 `FieldVisitor` 类是非常相似性的。

### class info

第一个部分，`MethodVisitor` 类是一个 `abstract` 类。

```java
public abstract class MethodVisitor {
}
```

### fields

第二个部分，`MethodVisitor` 类定义的字段有哪些。

```java
public abstract class MethodVisitor {
    protected final int api;
    protected MethodVisitor mv;
}
```

### constructors

第三个部分，`MethodVisitor` 类定义的构造方法有哪些。

```java
public abstract class MethodVisitor {
    public MethodVisitor(final int api) {
        this(api, null);
    }

    public MethodVisitor(final int api, final MethodVisitor methodVisitor) {
        this.api = api;
        this.mv = methodVisitor;
    }
}
```

### methods

第四个部分，`MethodVisitor` 类定义的方法有哪些。在 `MethodVisitor` 类当中，定义了许多的 `visitXxx()` 方法，我们列出了其中的一些方法，内容如下：

```java
public abstract class MethodVisitor {
    public void visitCode();

    public void visitInsn(final int opcode);
    public void visitIntInsn(final int opcode, final int operand);
    public void visitVarInsn(final int opcode, final int var);
    public void visitTypeInsn(final int opcode, final String type);
    public void visitFieldInsn(final int opcode, final String owner, final String name, final String descriptor);
    public void visitMethodInsn(final int opcode, final String owner, final String name, final String descriptor,
                                final boolean isInterface);
    public void visitInvokeDynamicInsn(final String name, final String descriptor, final Handle bootstrapMethodHandle,
                                       final Object... bootstrapMethodArguments);
    public void visitJumpInsn(final int opcode, final Label label);
    public void visitLabel(final Label label);
    public void visitLdcInsn(final Object value);
    public void visitIincInsn(final int var, final int increment);
    public void visitTableSwitchInsn(final int min, final int max, final Label dflt, final Label... labels);
    public void visitLookupSwitchInsn(final Label dflt, final int[] keys, final Label[] labels);
    public void visitMultiANewArrayInsn(final String descriptor, final int numDimensions);

    public void visitTryCatchBlock(final Label start, final Label end, final Label handler, final String type);

    public void visitMaxs(final int maxStack, final int maxLocals);
    public void visitEnd();

    // ......
}
```

对于这些 `visitXxx()` 方法，它们分别有什么作用呢？我们有三方面的资料可能参阅：

- 第一，从 ASM API 的角度来讲，我们可以查看 API 文档，来具体了解某一个方法是要实现什么样的作用，该方法所接收的参数代表什么含义。
- 第二，从 ClassFile 的角度来讲，这些 `visitXxxInsn()` 方法的本质就是组装 instruction 的内容。我们可以参考 [Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html) 的 [Chapter 6. The Java Virtual Machine Instruction Set](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html) 部分。
- 第三，《[Java ASM 系列二：OPCODE]({% link _java-asm/java-asm-season-02.md %})》，主要是对 opcode 进行介绍。

## 方法的调用顺序

在 `MethodVisitor` 类当中，定义了许多的 `visitXxx()` 方法，这些方法的调用，也要遵循一定的顺序。

```text
(visitParameter)*
[visitAnnotationDefault]
(visitAnnotation | visitAnnotableParameterCount | visitParameterAnnotation | visitTypeAnnotation | visitAttribute)*
[
    visitCode
    (
        visitFrame |
        visitXxxInsn |
        visitLabel |
        visitInsnAnnotation |
        visitTryCatchBlock |
        visitTryCatchAnnotation |
        visitLocalVariable |
        visitLocalVariableAnnotation |
        visitLineNumber
    )*
    visitMaxs
]
visitEnd
```

我们可以把这些 `visitXxx()` 方法分成三组：

- 第一组，在 `visitCode()` 方法之前的方法。这一组的方法，主要负责 parameter、annotation 和 attributes 等内容，这些内容并不是方法当中“必不可少”的一部分；在当前课程当中，我们暂时不去考虑这些内容，可以忽略这一组方法。
- 第二组，在 `visitCode()` 方法和 `visitMaxs()` 方法之间的方法。这一组的方法，主要负责当前方法的“方法体”内的 opcode 内容。其中，`visitCode()` 方法，标志着方法体的开始，而 `visitMaxs()` 方法，标志着方法体的结束。
- 第三组，是 `visitEnd()` 方法。这个 `visitEnd()` 方法，是最后一个进行调用的方法。

对这些 `visitXxx()` 方法进行精简之后，内容如下：

```text
[
    visitCode
    (
        visitFrame |
        visitXxxInsn |
        visitLabel |
        visitTryCatchBlock
    )*
    visitMaxs
]
visitEnd
```

这些方法的调用顺序，可以记忆如下：

- 第一步，调用 `visitCode()` 方法，调用一次。
- 第二步，调用 `visitXxxInsn()` 方法，可以调用多次。对这些方法的调用，就是在构建方法的“方法体”。
- 第三步，调用 `visitMaxs()` 方法，调用一次。
- 第四步，调用 `visitEnd()` 方法，调用一次。

```text
                 ┌─── visitCode()
                 │
                 │                      ┌─── visitXxxInsn()
                 │                      │
                 │                      ├─── visitLabel()
                 ├─── visitXxxInsn() ───┤
MethodVisitor ───┤                      ├─── visitFrame()
                 │                      │
                 │                      └─── visitTryCatchBlock()
                 │
                 ├─── visitMaxs()
                 │
                 └─── visitEnd()
```

## 总结

本文是对 `MethodVisitor` 类进行了介绍，内容总结如下：

- 第一点，对于 `MethodVisitor` 类的各个不同部分进行介绍，以便从整体上来理解 `MethodVisitor` 类。
- 第二点，在 `MethodVisitor` 类当中，`visitXxx()` 方法也需要遵循一定的调用顺序。

另外，需要注意两点内容：

- 第一点，`ClassVisitor` 类有自己的 `visitXxx()` 方法，`MethodVisitor` 类也有自己的 `visitXxx()` 方法，两者是不一样的，要注意区分。
- 第二点，`ClassVisitor.visitMethod()` 方法提供的是“方法头”（Method Header）所需要的信息，它会返回一个 `MethodVisitor` 对象，这个 `MethodVisitor` 对象就用来实现“方法体”里面的代码逻辑。
