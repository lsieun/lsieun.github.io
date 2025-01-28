---
title: "InstructionAdapter 介绍"
sequence: "409"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

对于 `InstructionAdapter` 类来说，它的特点是“添加了许多与 opcode 同名的方法”，更接近“原汁原味”的 JVM Instruction Set。

## 为什么有 InstructionAdapter 类

`InstructionAdapter` 类继承自 `MethodVisitor` 类，它提供了更详细的 API 用于 generate 和 transform。

在 JVM Specification 中，一共定义了 200 多个 opcode，在 ASM 的 `MethodVisitor` 类当中定义了 15 个 `visitXxxInsn()` 方法。这说明一个问题，也就是在 `MethodVisitor` 类的每个 `visitXxxInsn()` 方法都会对应 JVM Specification 当中多个 opcode。

那么，`InstructionAdapter` 类起到一个什么样的作用呢？ `InstructionAdapter` 类继承了 `MethodVisitor` 类，也就继承了那些 `visitXxxInsn()` 方法，同时它也添加了 80 多个新的方法，这些新的方法与 opcode 更加接近。

从功能上来说，`InstructionAdapter` 类和 `MethodVisitor` 类是一样的，两者没有差异。对于 `InstructionAdapter` 类来说，它可能更适合于熟悉 opcode 的人来使用。但是，如果我们已经熟悉 `MethodVisitor` 类里的 `visitXxxInsn()` 方法，那就完全可以不去使用 `InstructionAdapter` 类。

## InstructionAdapter 类

### class info

第一个部分，`InstructionAdapter` 类的父类是 `MethodVisitor` 类。

```java
public class InstructionAdapter extends MethodVisitor {
}
```

### fields

第二个部分，`InstructionAdapter` 类定义的字段有哪些。我们可以看到，`InstructionAdapter` 类定义了一个 `OBJECT_TYPE` 静态字段。

```java
public class InstructionAdapter extends MethodVisitor {
    public static final Type OBJECT_TYPE = Type.getType("Ljava/lang/Object;");
}
```

### constructors

第三个部分，`InstructionAdapter` 类定义的构造方法有哪些。

```java
public class InstructionAdapter extends MethodVisitor {
    public InstructionAdapter(final MethodVisitor methodVisitor) {
        this(Opcodes.ASM9, methodVisitor);
        if (getClass() != InstructionAdapter.class) {
            throw new IllegalStateException();
        }
    }

    protected InstructionAdapter(final int api, final MethodVisitor methodVisitor) {
        super(api, methodVisitor);
    }
}
```

### methods

第四个部分，`InstructionAdapter` 类定义的方法有哪些。除了从 `MethodVisitor` 类继承的 `visitXxxInsn()` 方法，`InstructionAdapter` 类还定义了许多与 opcode 相关的新方法，这些新方法本质上就是调用 `visitXxxInsn()` 方法来实现的。

```java
public class InstructionAdapter extends MethodVisitor {
    public void nop() {
        mv.visitInsn(Opcodes.NOP);
    }

    public void aconst(final Object value) {
        if (value == null) {
            mv.visitInsn(Opcodes.ACONST_NULL);
        } else {
            mv.visitLdcInsn(value);
        }
    }

    // ......
}
```

## 示例

### 预期目标

我们想实现的预期目标：生成如下的 `HelloWorld` 类。

```java
public class HelloWorld {
    public void test() {
        System.out.println("Hello World");
    }
}
```

### 编码实现

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Type;
import org.objectweb.asm.commons.InstructionAdapter;

import static org.objectweb.asm.Opcodes.*;

public class InstructionAdapterExample01 {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);

        // (1) 生成 byte[] 内容
        byte[] bytes = dump();

        // (2) 保存 byte[] 到文件
        FileUtils.writeBytes(filepath, bytes);
    }

    public static byte[] dump() throws Exception {
        // (1) 创建 ClassWriter 对象
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (2) 调用 visitXxx() 方法
        cw.visit(V1_8, ACC_PUBLIC + ACC_SUPER, "sample/HelloWorld",
                null, "java/lang/Object", null);

        {
            MethodVisitor mv1 = cw.visitMethod(ACC_PUBLIC, "<init>", "()V", null, null);
            InstructionAdapter ia = new InstructionAdapter(mv1);
            ia.visitCode();
            ia.load(0, InstructionAdapter.OBJECT_TYPE);
            ia.invokespecial("java/lang/Object", "<init>", "()V", false);
            ia.areturn(Type.VOID_TYPE);
            ia.visitMaxs(1, 1);
            ia.visitEnd();
        }

        {
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC, "test", "()V", null, null);
            InstructionAdapter ia = new InstructionAdapter(mv2);
            ia.visitCode();
            ia.getstatic("java/lang/System", "out", "Ljava/io/PrintStream;");
            ia.aconst("Hello World");
            ia.invokevirtual("java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            ia.areturn(Type.VOID_TYPE);
            ia.visitMaxs(2, 1);
            ia.visitEnd();
        }

        cw.visitEnd();

        // (3) 调用 toByteArray() 方法
        return cw.toByteArray();
    }
}
```

## 总结

本文对 `InstructionAdapter` 类进行了介绍，内容总结如下：

- 第一点，`InstructionAdapter` 类的特点就是引入了一些与 opcode 有关的新方法，这些新方法本质上还是调用 `MethodVisitor.visitXxxInsn()` 来实现的。
- 第二点，如果已经熟悉 `MethodVisitor` 类的使用，可以完全不考虑使用 `InstructionAdapter` 类。
