---
title:  "MethodVisitor介绍"
sequence: "207"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

在前面的当中，我们知道，调用`ClassVisitor`类的`visitMethod()`方法，会返回一个`MethodVisitor`类型的对象。在本文中，我们就来对`MethodVisitor`类来进行一个介绍。

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
- 第二步，调用`visitXxxInsn()`方法，可以调用多次。对这些方法的调用，就是在构建方法的“方法体”。
- 第三步，调用`visitMaxs()`方法，调用一次
- 第四步，调用`visitEnd()`方法，调用一次

## MethodWriter类

`MethodWriter`类是`MethodVisitor`类的子类。

与`FieldWriter`类一样，`MethodWriter`类也不带有`public`修饰，因此也不能像其它`public`类一样被外部所使用。

### fields

在`MethodWriter`类当中，定义了很多的字段。下面的几个字段，是与方法名、方法参数类型和返回值类型、修改符直接相关的字段：

{% highlight java %}
{% raw %}
final class MethodWriter extends MethodVisitor {
    private final int accessFlags;
    private final int nameIndex;
    private final String name;
    private final int descriptorIndex;
    private final String descriptor;
}
{% endraw %}
{% endhighlight %}

上面的这几个字段，与ClassFile当中的`method_info`也是对应的：

{% highlight text %}
method_info {
    u2             access_flags;
    u2             name_index;
    u2             descriptor_index;
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
{% endhighlight %}

下面的几个字段，是与“方法体”直接相关的几个字段：

{% highlight java %}
{% raw %}
final class MethodWriter extends MethodVisitor {
    private int maxStack;
    private int maxLocals;
    private final ByteVector code = new ByteVector();
    private Handler firstHandler;
    private Handler lastHandler;
    private final int numberOfExceptions;
    private final int[] exceptionIndexTable;
}
{% endraw %}
{% endhighlight %}

对于一个方法来说，它的方法体的代码，则对应`Code`属性结构：

{% highlight text %}
Code_attribute {
    u2 attribute_name_index;
    u4 attribute_length;
    u2 max_stack;
    u2 max_locals;
    u4 code_length;
    u1 code[code_length];
    u2 exception_table_length;
    {   u2 start_pc;
        u2 end_pc;
        u2 handler_pc;
        u2 catch_type;
    } exception_table[exception_table_length];
    u2 attributes_count;
    attribute_info attributes[attributes_count];
}
{% endhighlight %}

### methods

在`MethodWriter`类当中，也有两个重要的方法：`computeMethodInfoSize()`和`putMethodInfo()`方法。这两个方法也是在`ClassWriter`类的`toByteArray()`方法内使用到。

{% highlight java %}
{% raw %}
final class MethodWriter extends MethodVisitor {
    int computeMethodInfoSize() {
        // ......
        // 2 bytes each for access_flags, name_index, descriptor_index and attributes_count.
        int size = 8;
        // For ease of reference, we use here the same attribute order as in Section 4.7 of the JVMS.
        if (code.length > 0) {
            if (code.length > 65535) {
                throw new MethodTooLargeException(symbolTable.getClassName(), name, descriptor, code.length);
            }
            symbolTable.addConstantUtf8(Constants.CODE);
            // The Code attribute has 6 header bytes, plus 2, 2, 4 and 2 bytes respectively for max_stack,
            // max_locals, code_length and attributes_count, plus the bytecode and the exception table.
            size += 16 + code.length + Handler.getExceptionTableSize(firstHandler);
            if (stackMapTableEntries != null) {
                boolean useStackMapTable = symbolTable.getMajorVersion() >= Opcodes.V1_6;
                symbolTable.addConstantUtf8(useStackMapTable ? Constants.STACK_MAP_TABLE : "StackMap");
                // 6 header bytes and 2 bytes for number_of_entries.
                size += 8 + stackMapTableEntries.length;
            }
            // ......
        }
        if (numberOfExceptions > 0) {
            symbolTable.addConstantUtf8(Constants.EXCEPTIONS);
            size += 8 + 2 * numberOfExceptions;
        }
        //......
        return size;
    }

    void putMethodInfo(final ByteVector output) {
        boolean useSyntheticAttribute = symbolTable.getMajorVersion() < Opcodes.V1_5;
        int mask = useSyntheticAttribute ? Opcodes.ACC_SYNTHETIC : 0;
        output.putShort(accessFlags & ~mask).putShort(nameIndex).putShort(descriptorIndex);
        // ......
        // For ease of reference, we use here the same attribute order as in Section 4.7 of the JVMS.
        int attributeCount = 0;
        if (code.length > 0) {
            ++attributeCount;
        }
        if (numberOfExceptions > 0) {
            ++attributeCount;
        }
        // ......
        // For ease of reference, we use here the same attribute order as in Section 4.7 of the JVMS.
        output.putShort(attributeCount);
        if (code.length > 0) {
            // 2, 2, 4 and 2 bytes respectively for max_stack, max_locals, code_length and
            // attributes_count, plus the bytecode and the exception table.
            int size = 10 + code.length + Handler.getExceptionTableSize(firstHandler);
            int codeAttributeCount = 0;
            if (stackMapTableEntries != null) {
                // 6 header bytes and 2 bytes for number_of_entries.
                size += 8 + stackMapTableEntries.length;
                ++codeAttributeCount;
            }
            // ......
            output
                .putShort(symbolTable.addConstantUtf8(Constants.CODE))
                .putInt(size)
                .putShort(maxStack)
                .putShort(maxLocals)
                .putInt(code.length)
                .putByteArray(code.data, 0, code.length);
            Handler.putExceptionTable(firstHandler, output);
            output.putShort(codeAttributeCount);
            // ......
        }
        if (numberOfExceptions > 0) {
            output
                .putShort(symbolTable.addConstantUtf8(Constants.EXCEPTIONS))
                .putInt(2 + 2 * numberOfExceptions)
                .putShort(numberOfExceptions);
            for (int exceptionIndex : exceptionIndexTable) {
              output.putShort(exceptionIndex);
            }
        }
        // ......
    }
}
{% endraw %}
{% endhighlight %}

## 总结

本文主要是对`MethodVisitor`类和`MethodWriter`类进行介绍，内容总结如下：

- 第一点，在`MethodVisitor`类当中，它的成员有哪些。
- 第二点，在`MethodVisitor`类当中，`visitXxx()`方法之间的调用顺序是什么样的。
- 第三点，相对而言，`MethodWriter`类要比`FieldWriter`要复杂的多。一般情况下，我们不会直接用到`MethodWriter`类；如果要研究ASM源码，我们再去关注它。

另外，需要大家注意，`ClassVisitor`类有自己的`visitXxx()`方法，`MethodVisitor`类也有自己的`visitXxx()`方法，两者是不一样的，要注意区分。
