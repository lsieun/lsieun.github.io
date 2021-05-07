---
title:  "MethodVisitor介绍"
sequence: "013"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

在前面的讲解当中，我们知道，调用`ClassVisitor`类的`visitMethod()`方法，会返回一个`MethodVisitor`类型的对象。

那么，我们在这篇文章中，就对`MethodVisitor`类来进行一个介绍。

## MethodVisitor类

### class info

第一个要注意的地方，就是`MethodVisitor`类是一个`abstract`类。

{% highlight java %}
{% raw %}
public abstract class MethodVisitor {
}
{% endraw %}
{% endhighlight %}

### fields

第二个要注意的地方，就是`MethodVisitor`定义的字段有哪些。

从字段的角度上来说，`MethodVisitor`类定义的字段与`ClassVisitor`类和`FieldVisitor`类有很大的相似性。

{% highlight java %}
{% raw %}
public abstract class MethodVisitor {
    protected final int api;
    protected MethodVisitor mv;
}
{% endraw %}
{% endhighlight %}

### constructors

第三个要注意的地方，就是`MethodVisitor`定义的构造函数。

{% highlight java %}
{% raw %}
public abstract class MethodVisitor {
    public MethodVisitor(final int api) {
        this(api, null);
    }

    public MethodVisitor(final int api, final MethodVisitor methodVisitor) {
        this.api = api;
        this.mv = methodVisitor;
    }
}
{% endraw %}
{% endhighlight %}

### methods

第四个要注意的地方，就是`MethodVisitor`定义了哪些方法。

在`MethodVisitor`类当中，定义了许多的`visitXxx()`方法。

{% highlight java %}
{% raw %}
public abstract class MethodVisitor {
    public void visitParameter(final String name, final int access);
    public void visitAttribute(final Attribute attribute);

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
{% endraw %}
{% endhighlight %}

对于这些`visitXxx()`方法，它们分别有什么作用呢？我们有两方面的资料可能参阅：

- 第一，可以查看ASM API的描述文档。
- 第二，可以参考[Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)的[Chapter 6. The Java Virtual Machine Instruction Set](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html)部分。

## visitXxx()方法的调用顺序

这些`visitXxx()`方法的调用，也要遵循一定的顺序。

{% highlight text %}
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
{% endhighlight %}

我们可以把这些`visitXxx()`方法分成三组：

- 第一组，在`visitCode()`方法之前的方法。这一组的方法，主要负责parameter、annotation和attributes等内容；在当前课程当中，我们暂时不去考虑这些内容，可以忽略这一组方法。
- 第二组，在`visitCode()`方法和`visitMaxs()`方法之间的方法。这一组的方法，主要负责当前方法的“方法体”内的opcode内容。其中，`visitCode()`方法，标志着方法体的开始，而`visitMaxs()`方法，标志着方法体的结束。
- 第三组，是`visitEnd()`方法。这个`visitEnd()`方法，是最后一个进行调用的方法。

> This means that **annotations** and **attributes**, if any, must be visited first, followed by the **method's bytecode**, for non abstract methods.
> For these methods the code must be visited in sequential order, between exactly one call to `visitCode()` and exactly one call to `visitMaxs()`.

> The `visitCode()` and `visitMaxs()` methods can therefore be used to detect the start and end of the method’s bytecode in a sequence of events.

> Like for classes, the `visitEnd()` method must be called last, and is used to detect the end of a method in a sequence of events.

我们来对这些`visitXxx()`方法进行精简，如下：

{% highlight text %}
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
{% endhighlight %}

我们可以按照下面来记忆`visitXxx()`方法的调用顺序：

- 第一步，调用`visitCode()`方法，调用一次
- 第二步，调用`visitXxxInsn()`方法，可以调用多次
- 第三步，调用`visitMaxs()`方法，调用一次
- 第四步，调用`visitEnd()`方法，调用一次

## 总结

本篇文章主要讲述以下两点内容：

- 第一点，`MethodVisitor`类的成员有哪些。
- 第二点，在`MethodVisitor`类当中，`visitXxx()`方法之间的调用顺序是什么样的。

