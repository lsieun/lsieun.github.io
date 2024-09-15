---
title: "FieldNode介绍"
sequence: "202"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## FieldNode类

### class info

第一个部分，`FieldNode`类继承自`FieldVisitor`类。

```java
public class FieldNode extends FieldVisitor {
}
```

### fields

第二个部分，`FieldNode`类定义的字段有哪些。

```java
public class FieldNode extends FieldVisitor {
    public int access;
    public String name;
    public String desc;
    public String signature;
    public Object value;
}
```

这些字段与`field_info`结构相对应：

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

第三个部分，`FieldNode`类定义的构造方法有哪些。

```java
public class FieldNode extends FieldVisitor {
    public FieldNode(int access, String name, String descriptor, String signature, Object value) {
        this(Opcodes.ASM9, access, name, descriptor, signature, value);
        if (getClass() != FieldNode.class) {
            throw new IllegalStateException();
        }
    }

    public FieldNode(int api, int access, String name, String descriptor, String signature, Object value) {
        super(api);
        this.access = access;
        this.name = name;
        this.desc = descriptor;
        this.signature = signature;
        this.value = value;
    }
}
```

### methods

第四个部分，`FieldNode`类定义的方法有哪些。

```java
public class FieldNode extends FieldVisitor {
    public void accept(final ClassVisitor classVisitor) {
        FieldVisitor fieldVisitor = classVisitor.visitField(access, name, desc, signature, value);
        if (fieldVisitor == null) {
            return;
        }
        // ...
        fieldVisitor.visitEnd();
    }
}
```

## 示例：接口+字段

### 预期目标

我们想实现的预期目标是生成`HelloWorld`类，代码如下：

```java
public interface HelloWorld extends Cloneable {
    int LESS = -1;
    int EQUAL = 0;
    int GREATER = 1;
    int compareTo(Object o);
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
        cn.interfaces.add("java/lang/Cloneable");

        cn.fields.add(new FieldNode(ACC_PUBLIC | ACC_FINAL | ACC_STATIC, "LESS", "I", null, -1));
        cn.fields.add(new FieldNode(ACC_PUBLIC | ACC_FINAL | ACC_STATIC, "EQUAL", "I", null, 0));
        cn.fields.add(new FieldNode(ACC_PUBLIC | ACC_FINAL | ACC_STATIC, "GREATER", "I", null, 1));
        cn.methods.add(new MethodNode(ACC_PUBLIC | ACC_ABSTRACT, "compareTo", "(Ljava/lang/Object;)I", null, null));

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

- 第一点，介绍`FieldNode`类各个部分的信息。
- 第二点，代码示例，使用`FieldNode`类生成字段。
