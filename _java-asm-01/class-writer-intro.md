---
title:  "ClassWriter介绍"
sequence: "203"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

## ClassWriter类

### class info

第一个要注意的地方，就是`ClassWriter`的父类是`ClassVisitor`。

{% highlight java %}
{% raw %}
public class ClassWriter extends ClassVisitor {
}
{% endraw %}
{% endhighlight %}

`ClassWriter`的父类是`ClassVisitor`类，因此`ClassWriter`类具有`visit()`、`visitField()`、`visitMethod()`和`visitEnd()`等方法。

### fields

第二个要注意的地方，就是`ClassWriter`定义的字段有哪些。

{% highlight java %}
{% raw %}
public class ClassWriter extends ClassVisitor {
    private int version;
    private final SymbolTable symbolTable;

    private int accessFlags;
    private int thisClass;
    private int superClass;
    private int interfaceCount;
    private int[] interfaces;

    private FieldWriter firstField;
    private FieldWriter lastField;

    private MethodWriter firstMethod;
    private MethodWriter lastMethod;

    private Attribute firstAttribute;

    //......
}
{% endraw %}
{% endhighlight %}

`ClassWriter`类定义的字段与`.class`文件遵循的ClassFile结构密切相关。

{% highlight text %}
ClassFile {
    u4             magic;
    u2             minor_version;
    u2             major_version;
    u2             constant_pool_count;
    cp_info        constant_pool[constant_pool_count-1];
    u2             access_flags;
    u2             this_class;
    u2             super_class;
    u2             interfaces_count;
    u2             interfaces[interfaces_count];
    u2             fields_count;
    field_info     fields[fields_count];
    u2             methods_count;
    method_info    methods[methods_count];
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
{% endhighlight %}

### constructors

第三个要注意的地方，就是`ClassWriter`定义的构造函数。

`ClassWriter`定义的构造函数有两个，这里只关注其中一个，也就是只接收一个`int`类型参数的构造函数。

{% highlight java %}
{% raw %}
public class ClassWriter extends ClassVisitor {
    /* A flag to automatically compute the maximum stack size and the maximum number of local variables of methods. */
    public static final int COMPUTE_MAXS = 1;
    /* A flag to automatically compute the stack map frames of methods from scratch. */
    public static final int COMPUTE_FRAMES = 2;

    // flags option can be used to modify the default behavior of this class.
    // Must be zero or more of COMPUTE_MAXS and COMPUTE_FRAMES.
    public ClassWriter(final int flags) {
        this(null, flags);
    }
}
{% endraw %}
{% endhighlight %}

在使用`new`关键字创建`ClassWriter`对象时，推荐使用`COMPUTE_FRAMES`参数。

### methods

第四个要注意的地方，就是`ClassWriter`提供了哪些方法。

#### visitXxx()方法

在`ClassWriter`这个类当中，我们仍然是只关注其中的`visit()`方法、`visitField()`方法、`visitMethod()`方法和`visitEnd()`方法。这些`visitXxx()`方法的调用，就是在为构建ClassFile提供“原材料”的过程。

{% highlight java %}
{% raw %}
public class ClassWriter extends ClassVisitor {
    public void visit(
        final int version,
        final int access,
        final String name,
        final String signature,
        final String superName,
        final String[] interfaces);
    public FieldVisitor visitField( // 访问字段
        final int access,
        final String name,
        final String descriptor,
        final String signature,
        final Object value);
    public MethodVisitor visitMethod( // 访问方法
        final int access,
        final String name,
        final String descriptor,
        final String signature,
        final String[] exceptions);
    public void visitEnd();
    // ......
}
{% endraw %}
{% endhighlight %}

#### toByteArray()方法

`ClassWriter`提供了一个`toByteArray()`方法。这个方法的作用是将“所有的努力”（对`visitXxx()`的调用）转换成`byte[]`，而这些`byte[]`的内容就符合ClassFile结构。

在`toByteArray()`方法的代码当中，它通过三个步骤来得到`byte[]`：

- 第一步，计算`size`大小。这个`size`就是表示`byte[]`的最终的长度是多少。
- 第二步，将数据填充到`byte[]`当中。
- 第三步，将`byte[]`数据返回。

{% highlight java %}
{% raw %}
public class ClassWriter extends ClassVisitor {
    public byte[] toByteArray() {

        // First step: compute the size in bytes of the ClassFile structure.
        // The magic field uses 4 bytes, 10 mandatory fields (minor_version, major_version,
        // constant_pool_count, access_flags, this_class, super_class, interfaces_count, fields_count,
        // methods_count and attributes_count) use 2 bytes each, and each interface uses 2 bytes too.
        int size = 24 + 2 * interfaceCount;
        int fieldsCount = 0;
        FieldWriter fieldWriter = firstField;
        while (fieldWriter != null) {
            ++fieldsCount;
            size += fieldWriter.computeFieldInfoSize();
            fieldWriter = (FieldWriter) fieldWriter.fv;
        }
        int methodsCount = 0;
        MethodWriter methodWriter = firstMethod;
        while (methodWriter != null) {
            ++methodsCount;
            size += methodWriter.computeMethodInfoSize();
            methodWriter = (MethodWriter) methodWriter.mv;
        }

        // For ease of reference, we use here the same attribute order as in Section 4.7 of the JVMS.
        int attributesCount = 0;

        // ......

        if (firstAttribute != null) {
            attributesCount += firstAttribute.getAttributeCount();
            size += firstAttribute.computeAttributesSize(symbolTable);
        }
        // IMPORTANT: this must be the last part of the ClassFile size computation, because the previous
        // statements can add attribute names to the constant pool, thereby changing its size!
        size += symbolTable.getConstantPoolLength();


        // Second step: allocate a ByteVector of the correct size (in order to avoid any array copy in
        // dynamic resizes) and fill it with the ClassFile content.
        ByteVector result = new ByteVector(size);
        result.putInt(0xCAFEBABE).putInt(version);
        symbolTable.putConstantPool(result);
        int mask = (version & 0xFFFF) < Opcodes.V1_5 ? Opcodes.ACC_SYNTHETIC : 0;
        result.putShort(accessFlags & ~mask).putShort(thisClass).putShort(superClass);
        result.putShort(interfaceCount);
        for (int i = 0; i < interfaceCount; ++i) {
            result.putShort(interfaces[i]);
        }
        result.putShort(fieldsCount);
        fieldWriter = firstField;
        while (fieldWriter != null) {
            fieldWriter.putFieldInfo(result);
            fieldWriter = (FieldWriter) fieldWriter.fv;
        }
        result.putShort(methodsCount);
        boolean hasFrames = false;
        boolean hasAsmInstructions = false;
        methodWriter = firstMethod;
        while (methodWriter != null) {
            hasFrames |= methodWriter.hasFrames();
            hasAsmInstructions |= methodWriter.hasAsmInstructions();
            methodWriter.putMethodInfo(result);
            methodWriter = (MethodWriter) methodWriter.mv;
        }
        // For ease of reference, we use here the same attribute order as in Section 4.7 of the JVMS.
        result.putShort(attributesCount);

        // ......

        if (firstAttribute != null) {
            firstAttribute.putAttributes(symbolTable, result);
        }

        // Third step: replace the ASM specific instructions, if any.
        if (hasAsmInstructions) {
            return replaceAsmInstructions(result.data, hasFrames);
        } else {
            return result.data;
        }
    }
}
{% endraw %}
{% endhighlight %}

## 创建ClassWriter对象

### 推荐使用COMPUTE_FRAMES

在创建`ClassWriter`对象的时候，要指定一个`flag`参数，它可以选择的值有3个：

- 第一个，可以选取的值是`0`。它表示不会自动计算max stacks和max locals，也不会自动计算stack map frames。
- 第二个，可以选取的值是`ClassWriter.COMPUTE_MAXS`。它表示可以自动计算max stacks和max locals。
- 第三个，可以选取的值是`ClassWriter.COMPUTE_FRAMES`（推荐使用）。它表示可以自动计算max stacks和max locals，也会自动计算stack map frames。

同时，我们也来看一下ASM文档中是如何描述的：

- `COMPUTE_MAXS`: A flag to automatically compute the **maximum stack size** and the **maximum number of local variables** of methods. If this flag is set, then the arguments of the `MethodVisitor.visitMaxs` method will be ignored, and computed automatically from the signature and the bytecode of each method.
- `COMPUTE_FRAMES`: A flag to automatically compute the **stack map frames** of methods from scratch. If this flag is set, then the calls to the `MethodVisitor.visitFrame` method are ignored, and the **stack map frames** are recomputed from the methods bytecode. The arguments of the `MethodVisitor.visitMaxs` method are also ignored and recomputed from the bytecode. **In other words, `COMPUTE_FRAMES` implies `COMPUTE_MAXS`**.

{% highlight java %}
{% raw %}
public class ClassWriter extends ClassVisitor {
    public static final int COMPUTE_MAXS = 1;
    public static final int COMPUTE_FRAMES = 2;

    public ClassWriter(final int flags) {
        this(null, flags);
    }
}
{% endraw %}
{% endhighlight %}

创建`ClassWriter`对象，如下所示：

{% highlight java %}
{% raw %}
ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
{% endraw %}
{% endhighlight %}

### 为什么推荐使用COMPUTE_FRAMES

首先，我们来看一下max stacks和max locals。

在ClassFile结构中，每一个方法都用`method_info`来表示，而方法里定义的代码则使用`Code`属性来表示，其结构如下：

{% highlight text %}
Code_attribute {
    u2 attribute_name_index;
    u4 attribute_length;
    u2 max_stack;     // 这里是max stacks
    u2 max_locals;    // 这里是max locals
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

如果我们在创建`ClassWriter(flags)`对象的时候，将`flags`参数设置为`ClassWriter.COMPUTE_MAXS`或`ClassWriter.COMPUTE_FRAMES`，那么ASM会自动帮助我们计算`Code`结构中`max_stack`和`max_locals`的值。

接着，我们来看一下stack map frames。在`Code`结构里，可能有多个attribute，其中一个可能就是`StackMapTable_attribute`。`StackMapTable_attribute`结构，就是stack map frame具体存储结构，它的主要作用是对bytecode进行类型检查。

{% highlight text %}
StackMapTable_attribute {
    u2              attribute_name_index;
    u4              attribute_length;
    u2              number_of_entries;
    stack_map_frame entries[number_of_entries];
}
{% endhighlight %}

如果我们在创建`ClassWriter(flags)`对象的时候，将`flags`参数设置为`ClassWriter.COMPUTE_FRAMES`，那么ASM会自动帮助我们计算`StackMapTable`结构内的值。

![](/assets/images/java/asm/max-stacks-max-locals-stack-map-frames.png)

在我们的课程当中，我们推荐使用`ClassWriter.COMPUTE_FRAMES`。因为`ClassWriter.COMPUTE_FRAMES`这个选项，能够让ASM帮助我们自动计算max stacks、max locals和stack map frame的具体内容。

反过来说，如果将`flags`参数的取值为`0`，那么我们就必须要提供正确的max stacks、max locals和stack map frame的值；如果将`flags`参数的取值为`ClassWriter.COMPUTE_MAXS`，那么ASM会自动帮助我们计算max stacks和max locals，而我们则需要提供正确的stack map frame的值。为什么ASM会提供`0`和`ClassWriter.COMPUTE_MAXS`这两个选项呢？因为ASM在计算这些值的时候，要考虑各种各样不同的情况，所以它的算法相对来说就比较复杂，从而执行速度也会相对较慢；同时，ASM也鼓励开发者去研究更好的算法；如果开发者有更好的算法，就可以不去使用`ClassWriter.COMPUTE_FRAMES`，这样就能让程序的执行效率更高效。

但是，不得不说，要想计算max stacks、max locals和stack map frames，也不是一件容易的事情，所以我们为了简便，就推荐大家使用`ClassWriter.COMPUTE_FRAMES`。在大多数情况下，`ClassWriter.COMPUTE_FRAMES`都能帮我们计算出正确的值。在少数情况下，`ClassWriter.COMPUTE_FRAMES`可能会出错，比如说，有些代码经过混淆（obfuscate）处理，它里面的stack map frame会变更非常复杂，使用`ClassWriter.COMPUTE_FRAMES`就会出现错误的情况。针对这种少数的情况，我们可以在不改变原有stack map frame的情况下，使用`ClassWriter.COMPUTE_MAXS`。

## 如何使用ClassWriter类

The ASM core API for **generating** and **transforming** compiled Java classes is based on the `ClassVisitor` abstract class.

![](/assets/images/java/asm/what-asm-can-do.png)

在现阶段，我们只接触了两个类，即`ClassVisitor`和`ClassWriter`类，因此只能进行Class Generation的操作。

使用`ClassWriter`生成一个Class文件，可以大致分成三个步骤：

- 第一步，创建`ClassWriter`对象。
- 第二步，调用`ClassWriter`对象的`visitXxx()`方法。
- 第三步，调用`ClassWriter`对象的`toByteArray()`方法。

示例代码如下：

{% highlight java %}
{% raw %}
import org.objectweb.asm.ClassWriter;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldGenerateCore {
    public static byte[] dump () throws Exception {
        // (1) 创建ClassWriter对象
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (2) 调用visitXxx()方法
        cw.visit(...);
        cw.visitField(...);
        cw.visitMethod(...);
        cw.visitEnd();       // 注意，最后要调用visitEnd()方法

        // (3) 调用toByteArray()方法
        byte[] bytes = cw.toByteArray();
        return bytes;
    }
}
{% endraw %}
{% endhighlight %}

## 总结

本文主要对`ClassWriter`类进行介绍，内容总结如下：

- 第一点，`ClassWriter`类有哪些成员信息。
- 第二点，创建`ClassWriter`对象，推荐使用`COMPUTE_FRAMES`。即`ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);`
- 第三点，如何使用`ClassWriter`类。另外，要注意`visitXxxx()`方法的调用顺序，以及最后的时候要记得调用`visitEnd()`方法。
