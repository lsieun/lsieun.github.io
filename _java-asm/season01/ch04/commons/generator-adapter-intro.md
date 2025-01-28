---
title: "GeneratorAdapter 介绍"
sequence: "406"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

对于 `GeneratorAdapter` 类来说，它非常重要的一个特点：将一些 `visitXxxInsn()` 方法封装成一些常用的方法。

## GeneratorAdapter 类

### class info

第一个部分，`GeneratorAdapter` 类继承自 `LocalVariablesSorter` 类。

- org.objectweb.asm.MethodVisitor
    - org.objectweb.asm.commons.LocalVariablesSorter
        - org.objectweb.asm.commons.GeneratorAdapter
            - org.objectweb.asm.commons.AdviceAdapter

```java
public class GeneratorAdapter extends LocalVariablesSorter {
}
```

### fields

第二个部分，`GeneratorAdapter` 类定义的字段有哪些。

```java
public class GeneratorAdapter extends LocalVariablesSorter {
    private final int access;
    private final String name;
    private final Type returnType;
    private final Type[] argumentTypes;
}
```

### constructors

第三个部分，`GeneratorAdapter` 类定义的构造方法有哪些。

```java
public class GeneratorAdapter extends LocalVariablesSorter {
    public GeneratorAdapter(final MethodVisitor methodVisitor,
                            final int access, final String name, final String descriptor) {
        this(Opcodes.ASM9, methodVisitor, access, name, descriptor);
    }

    protected GeneratorAdapter(final int api, final MethodVisitor methodVisitor,
                               final int access, final String name, final String descriptor) {
        super(api, access, descriptor, methodVisitor);
        this.access = access;
        this.name = name;
        this.returnType = Type.getReturnType(descriptor);
        this.argumentTypes = Type.getArgumentTypes(descriptor);
    }
}
```

### methods

第四个部分，`GeneratorAdapter` 类定义的方法有哪些。

```java
public class GeneratorAdapter extends LocalVariablesSorter {
    public int getAccess() {
        return access;
    }
  
    public String getName() {
        return name;
    }
  
    public Type getReturnType() {
        return returnType;
    }
  
    public Type[] getArgumentTypes() {
        return argumentTypes.clone();
    }
}
```

## 特殊方法举例

`GeneratorAdapter` 类的特点是将一些 `visitXxxInsn()` 方法封装成一些常用的方法。在这里，我们给大家举几个有代表性的例子，更多的方法可以参考 `GeneratorAdapter` 类的源码。

### loadThis

在 `GeneratorAdapter` 类当中，`loadThis()` 方法的本质是 `mv.visitVarInsn(Opcodes.ALOAD, 0)`；但是，要注意 static 方法并不需要 `this` 变量。

```java
public class GeneratorAdapter extends LocalVariablesSorter {
    public void loadThis() {
        if ((access & Opcodes.ACC_STATIC) != 0) { // 注意，静态方法没有 this
            throw new IllegalStateException("no 'this' pointer within static method");
        }
        mv.visitVarInsn(Opcodes.ALOAD, 0);
    }
}
```

### arg

在 `GeneratorAdapter` 类当中，定义了一些与方法参数相关的方法。

```java
public class GeneratorAdapter extends LocalVariablesSorter {
    private int getArgIndex(final int arg) {
        int index = (access & Opcodes.ACC_STATIC) == 0 ? 1 : 0;
        for (int i = 0; i < arg; i++) {
            index += argumentTypes[i].getSize();
        }
        return index;
    }

    private void loadInsn(final Type type, final int index) {
        mv.visitVarInsn(type.getOpcode(Opcodes.ILOAD), index);
    }

    private void storeInsn(final Type type, final int index) {
        mv.visitVarInsn(type.getOpcode(Opcodes.ISTORE), index);
    }

    public void loadArg(final int arg) {
        loadInsn(argumentTypes[arg], getArgIndex(arg));
    }

    public void loadArgs(final int arg, final int count) {
        int index = getArgIndex(arg);
        for (int i = 0; i < count; ++i) {
            Type argumentType = argumentTypes[arg + i];
            loadInsn(argumentType, index);
            index += argumentType.getSize();
        }
    }

    public void loadArgs() {
        loadArgs(0, argumentTypes.length);
    }

    public void loadArgArray() {
        push(argumentTypes.length);
        newArray(OBJECT_TYPE);
        for (int i = 0; i < argumentTypes.length; i++) {
            dup();
            push(i);
            loadArg(i);
            box(argumentTypes[i]);
            arrayStore(OBJECT_TYPE);
        }
    }

    public void storeArg(final int arg) {
        storeInsn(argumentTypes[arg], getArgIndex(arg));
    }
}
```

### boxing and unboxing

在 `GeneratorAdapter` 类当中，定义了一些与 boxing 和 unboxing 相关的操作。

```java
public class GeneratorAdapter extends LocalVariablesSorter {
    public void box(final Type type) {
        if (type.getSort() == Type.OBJECT || type.getSort() == Type.ARRAY) {
            return;
        }
        if (type == Type.VOID_TYPE) {
            push((String) null);
        } else {
            Type boxedType = getBoxedType(type);
            newInstance(boxedType);
            if (type.getSize() == 2) {
                dupX2();
                dupX2();
                pop();
            } else {
                dupX1();
                swap();
            }
            invokeConstructor(boxedType, new Method("<init>", Type.VOID_TYPE, new Type[] {type}));
        }
    }

    public void unbox(final Type type) {
        Type boxedType = NUMBER_TYPE;
        Method unboxMethod;
        switch (type.getSort()) {
            case Type.VOID:
                return;
            case Type.CHAR:
                boxedType = CHARACTER_TYPE;
                unboxMethod = CHAR_VALUE;
                break;
            case Type.BOOLEAN:
                boxedType = BOOLEAN_TYPE;
                unboxMethod = BOOLEAN_VALUE;
                break;
            case Type.DOUBLE:
                unboxMethod = DOUBLE_VALUE;
                break;
            case Type.FLOAT:
                unboxMethod = FLOAT_VALUE;
                break;
            case Type.LONG:
                unboxMethod = LONG_VALUE;
                break;
            case Type.INT:
            case Type.SHORT:
            case Type.BYTE:
                unboxMethod = INT_VALUE;
                break;
            default:
                unboxMethod = null;
                break;
        }
        if (unboxMethod == null) {
            checkCast(type);
        } else {
            checkCast(boxedType);
            invokeVirtual(boxedType, unboxMethod);
        }
    }

    public void valueOf(final Type type) {
        if (type.getSort() == Type.OBJECT || type.getSort() == Type.ARRAY) {
            return;
        }
        if (type == Type.VOID_TYPE) {
            push((String) null);
        } else {
            Type boxedType = getBoxedType(type);
            invokeStatic(boxedType, new Method("valueOf", boxedType, new Type[] {type}));
        }
    }

    private static Type getBoxedType(final Type type) {
        switch (type.getSort()) {
            case Type.BYTE:
                return BYTE_TYPE;
            case Type.BOOLEAN:
                return BOOLEAN_TYPE;
            case Type.SHORT:
                return SHORT_TYPE;
            case Type.CHAR:
                return CHARACTER_TYPE;
            case Type.INT:
                return INTEGER_TYPE;
            case Type.FLOAT:
                return FLOAT_TYPE;
            case Type.LONG:
                return LONG_TYPE;
            case Type.DOUBLE:
                return DOUBLE_TYPE;
            default:
                return type;
        }
    }
}
```

## 示例：生成类

### 预期目标

我们想实现的预期目标：生成一个 `HelloWorld` 类，代码如下所示。

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}
```

### 编码实现

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Type;
import org.objectweb.asm.commons.GeneratorAdapter;
import org.objectweb.asm.commons.Method;
import org.objectweb.asm.util.TraceClassVisitor;

import java.io.PrintStream;
import java.io.PrintWriter;

import static org.objectweb.asm.Opcodes.*;

public class GeneratorAdapterExample01 {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);

        // (1) 生成 byte[] 内容
        byte[] bytes = dump();

        // (2) 保存 byte[] 到文件
        FileUtils.writeBytes(filepath, bytes);
    }

    public static byte[] dump() throws Exception {
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
        PrintWriter printWriter = new PrintWriter(System.out);
        TraceClassVisitor cv = new TraceClassVisitor(cw, printWriter);

        cv.visit(V1_8, ACC_PUBLIC + ACC_SUPER, "sample/HelloWorld", null, "java/lang/Object", null);

        {
            Method m1 = Method.getMethod("void <init> ()");
            GeneratorAdapter mg = new GeneratorAdapter(ACC_PUBLIC, m1, null, null, cv);
            mg.loadThis();
            mg.invokeConstructor(Type.getType(Object.class), m1);
            mg.returnValue();
            mg.endMethod();
        }

        {
            Method m2 = Method.getMethod("void main (String[])");
            GeneratorAdapter mg = new GeneratorAdapter(ACC_PUBLIC + ACC_STATIC, m2, null, null, cv);
            mg.getStatic(Type.getType(System.class), "out", Type.getType(PrintStream.class));
            mg.push("Hello World!");
            mg.invokeVirtual(Type.getType(PrintStream.class), Method.getMethod("void println (String)"));
            mg.returnValue();
            mg.endMethod();
        }

        cv.visitEnd();

        return cw.toByteArray();
    }
}
```

## 总结

本文对 `GeneratorAdapter` 类进行介绍，内容总结如下：

- 第一点，`GeneratorAdapter` 类的特点是将一些 `visitXxxInsn()` 方法封装成一些常用的方法。
- 第二点，`GeneratorAdapter` 类定义的新方法，并不是十分必要的；如果熟悉 `MethodVisitor.visitXxxInsn()` 方法，可以完全不考虑使用 `GeneratorAdapter` 类。
