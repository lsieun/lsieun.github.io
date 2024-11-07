---
title: "ClassWriter 介绍"
sequence: "202"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## ClassWriter 类

### class info

第一个部分，就是 `ClassWriter` 的父类是 `ClassVisitor`，因此 `ClassWriter` 类继承了 `visit()`、`visitField()`、`visitMethod()` 和 `visitEnd()` 等方法。

```java
public class ClassWriter extends ClassVisitor {
}
```

### fields

第二个部分，就是 `ClassWriter` 定义的字段有哪些。

```java
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
```

这些字段与 ClassFile 结构密切相关：

```text
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
```

### constructors

第三个部分，就是 `ClassWriter` 定义的构造方法。

`ClassWriter` 定义的构造方法有两个，这里只关注其中一个，也就是只接收一个 `int` 类型参数的构造方法。在使用 `new` 关键字创建 `ClassWriter` 对象时，推荐使用 `COMPUTE_FRAMES` 参数。

```java
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
```

- `COMPUTE_MAXS`: A flag to automatically compute **the maximum stack size** and **the maximum number of local variables** of methods. If this flag is set, then the arguments of the `MethodVisitor.visitMaxs` method of the `MethodVisitor` returned by the `visitMethod` method will be ignored, and computed automatically from the signature and the bytecode of each method.
- `COMPUTE_FRAMES`: A flag to automatically compute **the stack map frames** of methods from scratch. If this flag is set, then the calls to the `MethodVisitor.visitFrame` method are ignored, and the stack map frames are recomputed from the methods bytecode. The arguments of the `MethodVisitor.visitMaxs` method are also ignored and recomputed from the bytecode. In other words, `COMPUTE_FRAMES` implies `COMPUTE_MAXS`.

小总结：

- `COMPUTE_MAXS`: 计算 max stack 和 max local 信息。
- `COMPUTE_FRAMES`: 既计算 stack map frame 信息，又计算 max stack 和 max local 信息。

换句话说，`COMPUTE_FRAMES` 是功能最强大的：

```text
COMPUTE_FRAMES = COMPUTE_MAXS + stack map frame
```

### methods

第四个部分，就是 `ClassWriter` 提供了哪些方法。

#### visitXxx() 方法

在 `ClassWriter` 这个类当中，我们仍然是只关注其中的 `visit()` 方法、`visitField()` 方法、`visitMethod()` 方法和 `visitEnd()` 方法。

这些 `visitXxx()` 方法的调用，就是在为构建 ClassFile 提供“原材料”的过程。

```java
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
```

#### toByteArray() 方法

在 `ClassWriter` 类当中，提供了一个 `toByteArray()` 方法。这个方法的作用是将“所有的努力”（对 `visitXxx()` 的调用）转换成 `byte[]`，而这些 `byte[]` 的内容就遵循 ClassFile 结构。

在 `toByteArray()` 方法的代码当中，通过三个步骤来得到 `byte[]`：

- 第一步，计算 `size` 大小。这个 `size` 就是表示 `byte[]` 的最终的长度是多少。
- 第二步，将数据填充到 `byte[]` 当中。
- 第三步，将 `byte[]` 数据返回。

```java
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
```

## 创建 ClassWriter 对象

### 推荐使用 COMPUTE_FRAMES

在创建 `ClassWriter` 对象的时候，要指定一个 `flags` 参数，它可以选择的值有三个：

- 第一个，可以选取的值是 `0`。ASM 不会自动计算 max stacks 和 max locals，也不会自动计算 stack map frames。
- 第二个，可以选取的值是 `ClassWriter.COMPUTE_MAXS`。ASM 会自动计算 max stacks 和 max locals，但不会自动计算 stack map frames。
- 第三个，可以选取的值是 `ClassWriter.COMPUTE_FRAMES`（推荐使用）。ASM 会自动计算 max stacks 和 max locals，也会自动计算 stack map frames。

```text
┌──────────────────────┬─────────────────────────────────┬────────────────────────┐
│        flags         │    max stacks and max locals    │    stack map frames    │
├──────────────────────┼─────────────────────────────────┼────────────────────────┤
│          0           │               NO                │           NO           │
├──────────────────────┼─────────────────────────────────┼────────────────────────┤
│     COMPUTE_MAXS     │               YES               │           NO           │
├──────────────────────┼─────────────────────────────────┼────────────────────────┤
│    COMPUTE_FRAMES    │               YES               │          YES           │
└──────────────────────┴─────────────────────────────────┴────────────────────────┘
```

创建 `ClassWriter` 对象，如下所示：

```text
ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
```

### 为什么推荐使用 COMPUTE_FRAMES

在创建 `ClassWriter` 对象的时候，使用 `ClassWriter.COMPUTE_FRAMES`，ASM 会自动计算 max stacks 和 max locals，也会自动计算 stack map frames。

首先，来看一下 max stacks 和 max locals。在 ClassFile 结构中，每一个方法都用 `method_info` 来表示，而方法里定义的代码则使用 `Code` 属性来表示，其结构如下：

```text
Code_attribute {
    u2 attribute_name_index;
    u4 attribute_length;
    u2 max_stack;     // 这里是 max stacks
    u2 max_locals;    // 这里是 max locals
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
```

如果我们在创建 `ClassWriter(flags)` 对象的时候，将 `flags` 参数设置为 `ClassWriter.COMPUTE_MAXS` 或 `ClassWriter.COMPUTE_FRAMES`，那么 ASM 会自动帮助我们计算 `Code` 结构中 `max_stack` 和 `max_locals` 的值。

接着，来看一下 stack map frames。在 `Code` 结构里，可能有多个 `attributes`，其中一个可能就是 `StackMapTable_attribute`。`StackMapTable_attribute` 结构，就是 stack map frame 具体存储格式，它的主要作用是对 ByteCode 进行类型检查。

```text
StackMapTable_attribute {
    u2              attribute_name_index;
    u4              attribute_length;
    u2              number_of_entries;
    stack_map_frame entries[number_of_entries];
}
```

如果我们在创建 `ClassWriter(flags)` 对象的时候，将 `flags` 参数设置为 `ClassWriter.COMPUTE_FRAMES`，那么 ASM 会自动帮助我们计算 `StackMapTable_attribute` 的内容。

![](/assets/images/java/asm/max-stacks-max-locals-stack-map-frames.png)

我们推荐使用 `ClassWriter.COMPUTE_FRAMES`。因为 `ClassWriter.COMPUTE_FRAMES` 这个选项，能够让 ASM 帮助我们自动计算 max stacks、max locals 和 stack map frame 的具体内容。

- 如果将 `flags` 参数的取值为 `0`，那么我们就必须要提供正确的 max stacks、max locals 和 stack map frame 的值；
- 如果将 `flags` 参数的取值为 `ClassWriter.COMPUTE_MAXS`，那么 ASM 会自动帮助我们计算 max stacks 和 max locals，而我们则需要提供正确的 stack map frame 的值。
  
那么，ASM 为什么会提供 `0` 和 `ClassWriter.COMPUTE_MAXS` 这两个选项呢？因为 ASM 在计算这些值的时候，要考虑各种各样不同的情况，所以它的算法相对来说就比较复杂，因而执行速度也会相对较慢。同时，ASM 也鼓励开发者去研究更好的算法；如果开发者有更好的算法，就可以不去使用 `ClassWriter.COMPUTE_FRAMES`，这样就能让程序的执行效率更高效。

但是，不得不说，要想计算 max stacks、max locals 和 stack map frames，也不是一件容易的事情。出于方便的目的，就推荐大家使用 `ClassWriter.COMPUTE_FRAMES`。在大多数情况下，`ClassWriter.COMPUTE_FRAMES` 都能帮我们计算出正确的值。在少数情况下，`ClassWriter.COMPUTE_FRAMES` 也可能会出错，比如说，有些代码经过混淆（obfuscate）处理，它里面的 stack map frame 会变更非常复杂，使用 `ClassWriter.COMPUTE_FRAMES` 就会出现错误的情况。针对这种少数的情况，我们可以在不改变原有 stack map frame 的情况下，使用 `ClassWriter.COMPUTE_MAXS`，让 ASM 只帮助我们计算 max stacks 和 max locals。

## 如何使用 ClassWriter 类

使用 `ClassWriter` 生成一个 Class 文件，可以大致分成三个步骤：

- 第一步，创建 `ClassWriter` 对象。
- 第二步，调用 `ClassWriter` 对象的 `visitXxx()` 方法。
- 第三步，调用 `ClassWriter` 对象的 `toByteArray()` 方法。

示例代码如下：

```java
import org.objectweb.asm.ClassWriter;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldGenerateCore {
    public static byte[] dump () throws Exception {
        // (1) 创建 ClassWriter 对象
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (2) 调用 visitXxx() 方法
        cw.visit();
        cw.visitField();
        cw.visitMethod();
        cw.visitEnd();       // 注意，最后要调用 visitEnd() 方法

        // (3) 调用 toByteArray() 方法
        byte[] bytes = cw.toByteArray();
        return bytes;
    }
}
```

## 总结

本文主要对 `ClassWriter` 类进行介绍，内容总结如下：

- 第一点，`ClassWriter` 类有哪些部分的信息，以便于对 `ClassWriter` 类有所了解。
- 第二点，在创建 `ClassWriter` 对象时，推荐使用 `ClassWriter.COMPUTE_FRAMES` 选项。
- 第三点，如何使用 `ClassWriter` 类。
  - 第一步，创建 `ClassWriter` 对象。
  - 第二步，调用 `ClassWriter` 对象的 `visitXxx()` 方法。
  - 第三步，调用 `ClassWriter` 对象的 `toByteArray()` 方法。
