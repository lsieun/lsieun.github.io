---
title: "SerialVersionUIDAdder 介绍"
sequence: "412"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

`SerialVersionUIDAdder` 类的特点是可以为 Class 文件添加一个 `serialVersionUID` 字段。

## SerialVersionUIDAdder 类

当 `SerialVersionUIDAdder` 类计算 `serialVersionUID` 值的时候，它有一套自己的算法，对于算法本身就不进行介绍了。那么，`serialVersionUID` 字段有什么作用呢？

Simply put, we use the `serialVersionUID` attribute to **remember versions of a `Serializable` class** to verify that **a loaded class and the serialized object are compatible**.

### class info

第一个部分，`SerialVersionUIDAdder` 类的父类是 `ClassVisitor` 类。

```java
public class SerialVersionUIDAdder extends ClassVisitor {
}
```

### fields

第二个部分，`SerialVersionUIDAdder` 类定义的字段有哪些。

`SerialVersionUIDAdder` 类的字段分成三组：

- 第一组，`computeSvuid` 和 `hasSvuid` 字段，用于判断是否需要添加 `serialVersionUID` 信息。
- 第二组，`access`、`name` 和 `interfaces` 字段，用于记录当前类的访问标识、类的名字和实现的接口。
- 第三组，`svuidFields`、`svuidMethods`、`svuidConstructors` 和 `hasStaticInitializer` 字段，用于记录字段、构造方法、普通方法、是否有 `<clinit>()` 方法。

第二组和第三组部分的字段都是用于计算 `serialVersionUID` 值的，而第一组字段是则先判断是否有必要去计算 `serialVersionUID` 值。

```java
public class SerialVersionUIDAdder extends ClassVisitor {
    // 第一组，用于判断是否需要添加 serialVersionUID 信息
    private boolean computeSvuid;
    private boolean hasSvuid;

    // 第二组，用于记录当前类的访问标识、类的名字和实现的接口
    private int access;
    private String name;
    private String[] interfaces;

    // 第三组，用于记录字段、构造方法、普通方法
    private Collection<Item> svuidFields;
    private boolean hasStaticInitializer;
    private Collection<Item> svuidConstructors;
    private Collection<Item> svuidMethods;
}
```

其中，`svuidFields`、`svuidMethods` 和 `svuidConstructors` 字段都涉及到 `Item` 类。`Item` 类的定义如下：

```java
private static final class Item implements Comparable<Item> {
    final String name;
    final int access;
    final String descriptor;

    Item(final String name, final int access, final String descriptor) {
        this.name = name;
        this.access = access;
        this.descriptor = descriptor;
    }
}
```

### constructors

第三个部分，`SerialVersionUIDAdder` 类定义的构造方法有哪些。

```java
public class SerialVersionUIDAdder extends ClassVisitor {
    public SerialVersionUIDAdder(final ClassVisitor classVisitor) {
        this(Opcodes.ASM9, classVisitor);
    }

    protected SerialVersionUIDAdder(final int api, final ClassVisitor classVisitor) {
        super(api, classVisitor);
    }
}
```

### methods

第四个部分，`SerialVersionUIDAdder` 类定义的方法有哪些。

```java
public class SerialVersionUIDAdder extends ClassVisitor {
    @Override
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        // Get the class name, access flags, and interfaces information (step 1, 2 and 3) for SVUID computation.
        // 对于枚举类型，不计算 serialVersionUID
        computeSvuid = (access & Opcodes.ACC_ENUM) == 0;

        if (computeSvuid) {
            // 记录第二组字段的信息
            this.name = name;
            this.access = access;
            this.interfaces = interfaces.clone();
            this.svuidFields = new ArrayList<>();
            this.svuidConstructors = new ArrayList<>();
            this.svuidMethods = new ArrayList<>();
        }

        super.visit(version, access, name, signature, superName, interfaces);
    }

    @Override
    public FieldVisitor visitField(int access, String name, String desc, String signature, Object value) {
        // Get the class field information for step 4 of the algorithm. Also determine if the class already has a SVUID.
        if (computeSvuid) {
            if ("serialVersionUID".equals(name)) {
                // Since the class already has SVUID, we won't be computing it.
                computeSvuid = false;
                hasSvuid = true;
            }
            // Collect the non private fields. Only the ACC_PUBLIC, ACC_PRIVATE, ACC_PROTECTED,
            // ACC_STATIC, ACC_FINAL, ACC_VOLATILE, and ACC_TRANSIENT flags are used when computing
            // serialVersionUID values.
            if ((access & Opcodes.ACC_PRIVATE) == 0
                    || (access & (Opcodes.ACC_STATIC | Opcodes.ACC_TRANSIENT)) == 0) {
                int mods = access
                                & (Opcodes.ACC_PUBLIC
                                | Opcodes.ACC_PRIVATE
                                | Opcodes.ACC_PROTECTED
                                | Opcodes.ACC_STATIC
                                | Opcodes.ACC_FINAL
                                | Opcodes.ACC_VOLATILE
                                | Opcodes.ACC_TRANSIENT);
                svuidFields.add(new Item(name, mods, desc));
            }
        }

        return super.visitField(access, name, desc, signature, value);
    }

    
    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        // Get constructor and method information (step 5 and 7). Also determine if there is a class initializer (step 6).
        if (computeSvuid) {
            // 这里是对静态初始方法进行判断
            if (CLINIT.equals(name)) {
                hasStaticInitializer = true;
            }
            // Collect the non private constructors and methods. Only the ACC_PUBLIC, ACC_PRIVATE,
            // ACC_PROTECTED, ACC_STATIC, ACC_FINAL, ACC_SYNCHRONIZED, ACC_NATIVE, ACC_ABSTRACT and
            // ACC_STRICT flags are used.
            int mods = access
                            & (Opcodes.ACC_PUBLIC
                            | Opcodes.ACC_PRIVATE
                            | Opcodes.ACC_PROTECTED
                            | Opcodes.ACC_STATIC
                            | Opcodes.ACC_FINAL
                            | Opcodes.ACC_SYNCHRONIZED
                            | Opcodes.ACC_NATIVE
                            | Opcodes.ACC_ABSTRACT
                            | Opcodes.ACC_STRICT);

            if ((access & Opcodes.ACC_PRIVATE) == 0) {
                if ("<init>".equals(name)) {
                    // 这里是对构造方法进行判断
                    svuidConstructors.add(new Item(name, mods, descriptor));
                } else if (!CLINIT.equals(name)) {
                    // 这里是对普通方法进行判断
                    svuidMethods.add(new Item(name, mods, descriptor));
                }
            }
        }

        return super.visitMethod(access, name, descriptor, signature, exceptions);
    }

    @Override
    public void visitEnd() {
        // Add the SVUID field to the class if it doesn't have one.
        if (computeSvuid && !hasSvuid) {
            try {
                addSVUID(computeSVUID());
            } catch (IOException e) {
                throw new IllegalStateException("Error while computing SVUID for " + name, e);
            }
        }

        super.visitEnd();
    }

    protected void addSVUID(final long svuid) {
        FieldVisitor fieldVisitor =
                super.visitField(Opcodes.ACC_FINAL + Opcodes.ACC_STATIC, "serialVersionUID", "J", null, svuid);
        if (fieldVisitor != null) {
            fieldVisitor.visitEnd();
        }
    }

    protected long computeSVUID() throws IOException {
        // ...
    }
}
```

## 示例

### 预期目标

假如有一个 `HelloWorld` 类，代码如下：

```java
import java.io.Serializable;

public class HelloWorld implements Serializable {
    public String name;
    public int age;

    public HelloWorld(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return String.format("HelloWorld { name='%s', age=%d }", name, age);
    }
}
```

我们想实现的预期目标：为 `HelloWorld` 类添加 `serialVersionUID` 字段。

### 进行转换

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.commons.SerialVersionUIDAdder;

public class SerialVersionUIDAdderExample01 {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        //（1）构建 ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建 ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连 ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new SerialVersionUIDAdder(cw);

        //（4）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成 byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

### 验证结果

```java
import lsieun.utils.FileUtils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;

public class HelloWorldRun {
    private static final String FILE_DATA = "obj.data";

    public static void main(String[] args) throws Exception {
        HelloWorld obj = new HelloWorld("Tomcat", 10);
        writeObject(obj);
        readObject();
    }

    public static void readObject() throws Exception {
        String filepath = FileUtils.getFilePath(FILE_DATA);
        byte[] bytes = FileUtils.readBytes(filepath);
        ByteArrayInputStream bai = new ByteArrayInputStream(bytes);
        ObjectInputStream in = new ObjectInputStream(bai);
        Object obj = in.readObject();
        System.out.println(obj);
    }

    public static void writeObject(Object obj) throws Exception {
        ByteArrayOutputStream bao = new ByteArrayOutputStream();
        ObjectOutputStream out = new ObjectOutputStream(bao);
        out.writeObject(obj);
        out.flush();
        out.close();
        byte[] bytes = bao.toByteArray();

        String filepath = FileUtils.getFilePath(FILE_DATA);
        FileUtils.writeBytes(filepath, bytes);
    }
}
```

## 总结

本文对 `SerialVersionUIDAdder` 类进行介绍，内容总结如下：

- 第一点，`SerialVersionUIDAdder` 类的特点是可以为 Class 文件添加一个 `serialVersionUID` 字段。
- 第二点，了解 `SerialVersionUIDAdder` 类的各个部分的信息，以便理解它的工作原理。
- 第三点，如何使用 `SerialVersionUIDAdder` 类添加 `serialVersionUID` 字段。
