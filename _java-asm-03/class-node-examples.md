---
title:  "ClassNode示例"
sequence: "202"
---

[上级目录]({% link _posts/2021-05-01-java-asm-season-03.md %})

## 接口

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
        ClassNode cn = new ClassNode();
        cn.version = V1_8;
        cn.access = ACC_PUBLIC | ACC_ABSTRACT | ACC_INTERFACE;
        cn.name = "sample/HelloWorld";
        cn.superName = "java/lang/Object";

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

## 接口+字段

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

        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
        cn.accept(cw);
        return cw.toByteArray();
    }
}
```

## 类

### 预期目标

我们想实现的预期目标是生成`HelloWorld`类，代码如下：

```java
public class HelloWorld {
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
        ClassNode cn = new ClassNode();
        cn.version = V1_8;
        cn.access = ACC_PUBLIC | ACC_SUPER;
        cn.name = "sample/HelloWorld";
        cn.signature = null;
        cn.superName = "java/lang/Object";

        {
            MethodNode mn1 = new MethodNode(ACC_PUBLIC, "<init>", "()V", null, null);
            cn.methods.add(mn1);

            InsnList il = mn1.instructions;
            il.add(new VarInsnNode(ALOAD, 0));
            il.add(new MethodInsnNode(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false));
            il.add(new InsnNode(RETURN));

            mn1.maxStack = 1;
            mn1.maxLocals = 1;
        }

        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
        cn.accept(cw);
        return cw.toByteArray();
    }
}
```

