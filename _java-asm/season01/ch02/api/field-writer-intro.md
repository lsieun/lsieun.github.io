---
title: "FieldWriter 介绍"
sequence: "205"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

`FieldWriter` 类继承自 `FieldVisitor` 类。在 `ClassWriter` 类里，`visitField()` 方法的实现就是通过 `FieldWriter` 类来实现的。

在本文当中，我们将对 `FieldWriter` 类进行介绍：

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

## FieldWriter 类

### class info

第一个部分，`FieldWriter` 类的父类是 `FieldVisitor` 类。需要注意的是，`FieldWriter` 类并不带有 `public` 修饰，因此它的有效访问范围只局限于它所处的 package 当中，不能像其它的 `public` 类一样被外部所使用。

```java
final class FieldWriter extends FieldVisitor {
}
```

### fields

第二个部分，`FieldWriter` 类定义的字段有哪些。在 `FieldWriter` 类当中，一些字段如下：

```java
final class FieldWriter extends FieldVisitor {
    private final int accessFlags;
    private final int nameIndex;
    private final int descriptorIndex;
    private Attribute firstAttribute;
}
```

这些字段与 ClassFile 当中的 `field_info` 是对应的：

```text
field_info {
    u2             access_flags;
    u2             name_index;
    u2             descriptor_index;
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
```

### constructors

第三个部分，`FieldWriter` 类定义的构造方法有哪些。在 `FieldWriter` 类当中，只定义了一个构造方法；同时，它也不带有 `public` 标识，只能在 package 内使用。

```java
final class FieldWriter extends FieldVisitor {
    FieldWriter(SymbolTable symbolTable, int access, String name, String descriptor, String signature, Object constantValue) {
        super(Opcodes.ASM9);
        this.symbolTable = symbolTable;
        this.accessFlags = access;
        this.nameIndex = symbolTable.addConstantUtf8(name);
        this.descriptorIndex = symbolTable.addConstantUtf8(descriptor);
        if (signature != null) {
            this.signatureIndex = symbolTable.addConstantUtf8(signature);
        }
        if (constantValue != null) {
            this.constantValueIndex = symbolTable.addConstant(constantValue).index;
        }
    }
}
```

### methods

第四个部分，`FieldWriter` 类定义的方法有哪些。在 `FieldWriter` 类当中，有两个重要的方法：`computeFieldInfoSize()` 和 `putFieldInfo()` 方法。这两个方法会在 `ClassWriter` 类的 `toByteArray()` 方法内使用到。

```java
final class FieldWriter extends FieldVisitor {
    int computeFieldInfoSize() {
        // The access_flags, name_index, descriptor_index and attributes_count fields use 8 bytes.
        int size = 8;
        // For ease of reference, we use here the same attribute order as in Section 4.7 of the JVMS.
        if (constantValueIndex != 0) {
            // ConstantValue attributes always use 8 bytes.
            symbolTable.addConstantUtf8(Constants.CONSTANT_VALUE);
            size += 8;
        }
        // ......
        return size;
    }

    void putFieldInfo(final ByteVector output) {
        boolean useSyntheticAttribute = symbolTable.getMajorVersion() < Opcodes.V1_5;
        // Put the access_flags, name_index and descriptor_index fields.
        int mask = useSyntheticAttribute ? Opcodes.ACC_SYNTHETIC : 0;
        output.putShort(accessFlags & ~mask).putShort(nameIndex).putShort(descriptorIndex);
        // Compute and put the attributes_count field.
        // For ease of reference, we use here the same attribute order as in Section 4.7 of the JVMS.
        int attributesCount = 0;
        if (constantValueIndex != 0) {
            ++attributesCount;
        }
        // ......
        output.putShort(attributesCount);
        // Put the field_info attributes.
        // For ease of reference, we use here the same attribute order as in Section 4.7 of the JVMS.
        if (constantValueIndex != 0) {
            output
              .putShort(symbolTable.addConstantUtf8(Constants.CONSTANT_VALUE))
              .putInt(2)
              .putShort(constantValueIndex);
        }
        // ......
    }
}
```

## FieldWriter 类的使用

关于 `FieldWriter` 类的使用，它主要出现在 `ClassWriter` 类当中的 `visitField()` 和 `toByteArray()` 方法内。

### visitField 方法

在 `ClassWriter` 类当中，`visitField()` 方法代码如下：

```java
public class ClassWriter extends ClassVisitor {
    public final FieldVisitor visitField(int access, String name, String descriptor, String signature, Object value) {
        FieldWriter fieldWriter = new FieldWriter(symbolTable, access, name, descriptor, signature, value);
        if (firstField == null) {
            firstField = fieldWriter;
        } else {
            lastField.fv = fieldWriter;
        }
        return lastField = fieldWriter;
    }
}
```

### toByteArray 方法

在 `ClassWriter` 类当中，`toByteArray()` 方法代码如下：

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
            size += fieldWriter.computeFieldInfoSize();    // 这里是对 FieldWriter.computeFieldInfoSize() 方法的调用
            fieldWriter = (FieldWriter) fieldWriter.fv;
        }
        // ......


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
            fieldWriter.putFieldInfo(result);             // 这里是对 FieldWriter.putFieldInfo() 方法的调用
            fieldWriter = (FieldWriter) fieldWriter.fv;
        }
        // ......

        // Third step: replace the ASM specific instructions, if any.
        if (hasAsmInstructions) {
            return replaceAsmInstructions(result.data, hasFrames);
        } else {
            return result.data;
        }
    }
}
```


## 总结

本文主要对 `FieldWriter` 类进行介绍，内容总结如下：

- 第一点，对于 `FieldWriter` 类的各个不同部分进行介绍，以便从整体上来理解 `FieldWriter` 类。
- 第二点，关于 `FieldWriter` 类的使用，它主要出现在 `ClassWriter` 类当中的 `visitField()` 和 `toByteArray()` 方法内。
- 第三点，从 ASM 应用的角度来说，只需要知道 `FieldWriter` 类的存在就可以了，不需要深究，我们平常写 ASM 代码的时候，由于它不带有 `public` 标识，所以不会直接用到它；从理解 ASM 源码的角度来说，`FieldWriter` 类则值得研究，可以重点关注一下 `computeFieldInfoSize()` 和 `putFieldInfo()` 这两个方法。
