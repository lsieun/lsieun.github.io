---
title: "ClassNode介绍"
sequence: "201"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

The ASM tree API for **generating and transforming compiled Java classes** is based on the `ClassNode` class.

## ClassNode

### class info

第一个部分，`ClassNode`类继承自`ClassVisitor`类。

```java
public class ClassNode extends ClassVisitor {
}
```

### fields

第二个部分，`ClassNode`类定义的字段有哪些。

```java
public class ClassNode extends ClassVisitor {
    public int version;
    public int access;
    public String name;
    public String signature;
    public String superName;
    public List<String> interfaces;

    public List<FieldNode> fields;
    public List<MethodNode> methods;
}
```

这些字段与`ClassFile`结构中定义的条目有对应关系：

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

第三个部分，`ClassNode`类定义的构造方法有哪些。

```java
public class ClassNode extends ClassVisitor {
    public ClassNode() {
        this(Opcodes.ASM9);
        if (getClass() != ClassNode.class) {
            throw new IllegalStateException();
        }
    }

    public ClassNode(final int api) {
        super(api);
        this.interfaces = new ArrayList<>();
        this.fields = new ArrayList<>();
        this.methods = new ArrayList<>();
    }
}
```

这两个构造方法的区别：

- `ClassNode()`主要用于Class Generation。这个构造方法不适用于子类构造方法中调用，因为它对`getClass() != ClassNode.class`进行了判断；如果是子类调用这个构造方法，就一定会抛出`IllegalStateException`。
- `ClassNode(int)`主要用于Class Transformation。这个构造方法适用于子类构造方法中调用。

### methods

第四个部分，`ClassNode`类定义的方法有哪些。

#### visitXxx方法

在`ClassNode`类当中，`visitXxx()`方法的目的是将方法的参数转换成`ClassNode`类中字段的值。

```java
public class ClassNode extends ClassVisitor {
    @Override
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        this.version = version;
        this.access = access;
        this.name = name;
        this.signature = signature;
        this.superName = superName;
        this.interfaces = Util.asArrayList(interfaces);
    }

    @Override
    public FieldVisitor visitField(int access, String name, String descriptor, String signature, Object value) {
        FieldNode field = new FieldNode(access, name, descriptor, signature, value);
        fields.add(field);
        return field;
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodNode method = new MethodNode(access, name, descriptor, signature, exceptions);
        methods.add(method);
        return method;
    }

    @Override
    public void visitEnd() {
        // Nothing to do.
    }
}
```

#### accept方法

在`ClassNode`类当中，`accept()`方法的目的是将`ClassNode`类中字段的值传递给下一个`ClassVisitor`类实例。

```java
public class ClassNode extends ClassVisitor {
    public void accept(final ClassVisitor classVisitor) {
        // Visit the header.
        String[] interfacesArray = new String[this.interfaces.size()];
        this.interfaces.toArray(interfacesArray);
        classVisitor.visit(version, access, name, signature, superName, interfacesArray);
        // ...
        // Visit the fields.
        for (int i = 0, n = fields.size(); i < n; ++i) {
            fields.get(i).accept(classVisitor);
        }
        // Visit the methods.
        for (int i = 0, n = methods.size(); i < n; ++i) {
            methods.get(i).accept(classVisitor);
        }
        classVisitor.visitEnd();
    }    
}
```

## 如何使用ClassNode

我们知道，`ClassNode`是Java ASM类库当中的一个类；而在一个具体的`.class`文件中，它包含的是字节码数据，可以表现为`byte[]`的形式。那么`byte[]`和`ClassNode`类之间是不是可以相互转换呢？

![在字节数组和ClassNode之间转换](/assets/images/java/asm/class-bytes-class-node.png)

### 将字节转换成ClassNode

借助于`ClassReader`类，可以将`byte[]`内容转换成`ClassNode`类实例：

```text
int api = Opcodes.ASM9;
ClassNode cn = new ClassNode(api);

byte[] bytes = ...; // from a .class file
ClassReader cr = new ClassReader(bytes);
cr.accept(cn, ClassReader.SKIP_FRAMES | ClassReader.SKIP_DEBUG);
```

这样操作之后，一个具体的`.class`文件中的`byte[]`内容会转换成`ClassNode`类中字段的具体值。

### 将ClassNode转换成字节

相应的，借助于`ClassWriter`类，可以将`ClassNode`类实例转换成`byte[]`：

```text
ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
cn.accept(cw);
byte[] bytes = cw.toByteArray();
```

### Class Generation模板

使用`ClassNode`类进行Class Generation（生成类）操作分成两个步骤：

- 第一步，创建`ClassNode`类实例，为其类的字段内容进行赋值，这是收集数据的过程。
  - 首先，设置类层面的信息，包括类名、父类、实现的接口等。
  - 接着，设置字段层面的信息。
  - 最后，设置方法层面的信息。
- 第二步，借助于`ClassWriter`类，将`ClassNode`对象实例转换成`byte[]`，这是输出结果的过程。

```text
public static byte[] dump() throws Exception {
    // (1) 使用ClassNode类收集数据
    ClassNode cn = new ClassNode();
    cn.version = V1_8;
    cn.access = ACC_PUBLIC | ACC_ABSTRACT | ACC_INTERFACE;
    cn.name = "sample/HelloWorld";
    cn.superName = "java/lang/Object";
    // ...

    // (2) 使用ClassWriter类生成字节码
    ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
    cn.accept(cw);
    return cw.toByteArray();
}
```

## 示例：生成接口

### 预期目标

我们想实现的预期目标是生成`HelloWorld`类，代码如下：

```java
public interface HelloWorld {
}
```

### 编码实现

```java
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.tree.*;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldGenerateTree {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);

        // (1) 生成byte[]内容
        byte[] bytes = dump();

        // (2) 保存byte[]到文件
        FileUtils.writeBytes(filepath, bytes);
    }

    public static byte[] dump() throws Exception {
        // (1) 使用ClassNode类收集数据
        ClassNode cn = new ClassNode();
        cn.version = V1_8;
        cn.access = ACC_PUBLIC | ACC_ABSTRACT | ACC_INTERFACE;
        cn.name = "sample/HelloWorld";
        cn.superName = "java/lang/Object";

        // (2) 使用ClassWriter类生成字节码
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
        cn.accept(cw);
        return cw.toByteArray();
    }
}
```

### 验证结果

```java
import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        System.out.println(clazz);

        Field[] declaredFields = clazz.getDeclaredFields();
        if (declaredFields.length > 0) {
            System.out.println("fields:");
            for (Field f : declaredFields) {
                System.out.println("    " + f.getName());
            }
        }

        Method[] declaredMethods = clazz.getDeclaredMethods();
        if (declaredMethods.length > 0) {
            System.out.println("methods:");
            for (Method m : declaredMethods) {
                System.out.println("    " + m.getName());
            }
        }
    }
}
```

## 总结

本文内容总结如下：

- 第一点，介绍`ClassNode`类各个部分的信息。
- 第二点，如何使用`ClassNode`类。
- 第三点，代码示例，使用`ClassNode`类生成一个接口。
