---
title:  "Tree Based Class Transformation示例"
sequence: "302"
---

[上级目录]({% link _posts/2021-05-01-java-asm-season-03.md %})

## 示例一：删除字段

### 预期目标

预期目标：删除掉`HelloWorld`类里的`String strValue`字段。

```java
public class HelloWorld {
    public int intValue;
    public String strValue; // 删除这个字段
}
```

### 编码实现

```java
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.FieldNode;

import java.util.Iterator;

public class ClassRemoveFieldTransformer extends ClassTransformer {
    private final String fieldName;
    private final String fieldDesc;

    public ClassRemoveFieldTransformer(ClassTransformer ct, String fieldName, String fieldDesc) {
        super(ct);
        this.fieldName = fieldName;
        this.fieldDesc = fieldDesc;
    }

    @Override
    public void transform(ClassNode cn) {
        // 首先，处理自己的代码逻辑
        Iterator<FieldNode> it = cn.fields.iterator();
        while (it.hasNext()) {
            FieldNode fn = it.next();
            if (fieldName.equals(fn.name) && fieldDesc.equals(fn.desc)) {
                it.remove();
            }
        }

        // 其次，调用父类的方法实现
        super.transform(cn);
    }
}
```

### 进行转换

```java
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.ClassNode;

public class HelloWorldTransformTree {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        // (1)构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        // (2) 构建ClassNode
        int api = Opcodes.ASM9;
        ClassNode cn = new ClassNode(api);
        cr.accept(cn, ClassReader.SKIP_FRAMES | ClassReader.SKIP_DEBUG);

        // (3) 进行transform
        ClassTransformer ct = new ClassRemoveFieldTransformer(null, "strValue", "Ljava/lang/String;");
        ct.transform(cn);

        // (4) 构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
        cn.accept(cw);

        // (5) 生成byte[]内容输出
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
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

## 示例二：添加字段

### 预期目标

预期目标：为了`HelloWorld`类添加一个`Object objValue`字段。

```java
public class HelloWorld {
    public int intValue;
    public String strValue;
    // 添加一个Object objValue字段
}
```

### 编码实现

```java
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.FieldNode;

public class ClassAddFieldTransformer extends ClassTransformer {
    private final int fieldAccess;
    private final String fieldName;
    private final String fieldDesc;

    public ClassAddFieldTransformer(ClassTransformer ct, int fieldAccess, String fieldName, String fieldDesc) {
        super(ct);
        this.fieldAccess = fieldAccess;
        this.fieldName = fieldName;
        this.fieldDesc = fieldDesc;
    }

    @Override
    public void transform(ClassNode cn) {
        // 首先，处理自己的代码逻辑
        boolean isPresent = false;
        for (FieldNode fn : cn.fields) {
            if (fieldName.equals(fn.name)) {
                isPresent = true;
                break;
            }
        }
        if (!isPresent) {
            cn.fields.add(new FieldNode(fieldAccess, fieldName, fieldDesc, null, null));
        }

        // 其次，调用父类的方法实现
        super.transform(cn);
    }
}
```

### 进行转换

```java
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.ClassNode;

public class HelloWorldTransformTree {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        // (1)构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        // (2) 构建ClassNode
        int api = Opcodes.ASM9;
        ClassNode cn = new ClassNode(api);
        cr.accept(cn, ClassReader.SKIP_FRAMES | ClassReader.SKIP_DEBUG);

        // (3) 进行transform
        ClassTransformer ct = new ClassAddFieldTransformer(null, Opcodes.ACC_PUBLIC, "objValue", "Ljava/lang/Object;");
        ct.transform(cn);

        // (4) 构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
        cn.accept(cw);

        // (5) 生成byte[]内容输出
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

## 示例三：删除方法

### 预期目标

预期目标：删除掉`HelloWorld`类里的`add()`方法。

```java
public class HelloWorld {
    public int add(int a, int b) { // 删除add方法
        return a + b;
    }

    public int sub(int a, int b) {
        return a - b;
    }
}
```

### 编码实现

```java
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.MethodNode;

import java.util.Iterator;

public class ClassRemoveMethodTransformer extends ClassTransformer {
    private final String methodName;
    private final String methodDesc;

    public ClassRemoveMethodTransformer(ClassTransformer ct, String methodName, String methodDesc) {
        super(ct);
        this.methodName = methodName;
        this.methodDesc = methodDesc;
    }

    @Override
    public void transform(ClassNode cn) {
        // 首先，处理自己的代码逻辑
        Iterator<MethodNode> it = cn.methods.iterator();
        while (it.hasNext()) {
            MethodNode mn = it.next();
            if (methodName.equals(mn.name) && methodDesc.equals(mn.desc)) {
                it.remove();
            }
        }

        // 其次，调用父类的方法实现
        super.transform(cn);
    }
}
```

### 进行转换

```java
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.ClassNode;

public class HelloWorldTransformTree {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        // (1)构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        // (2) 构建ClassNode
        int api = Opcodes.ASM9;
        ClassNode cn = new ClassNode(api);
        cr.accept(cn, ClassReader.SKIP_FRAMES | ClassReader.SKIP_DEBUG);

        // (3) 进行transform
        ClassTransformer ct = new ClassRemoveMethodTransformer(null, "add", "(II)I");
        ct.transform(cn);

        // (4) 构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
        cn.accept(cw);

        // (5) 生成byte[]内容输出
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

## 示例四：添加方法

### 预期目标

预期目标：为`HelloWorld`类添加一个`mul()`方法。

```java
public class HelloWorld {
    public int add(int a, int b) {
        return a + b;
    }

    public int sub(int a, int b) {
        return a - b;
    }

    // TODO: 添加一个乘法
}
```

### 编码实现

```java
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.MethodNode;

public class ClassAddMethodTransformer extends ClassTransformer {
    private final int methodAccess;
    private final String methodName;
    private final String methodDesc;

    public ClassAddMethodTransformer(ClassTransformer ct, int methodAccess, String methodName, String methodDesc) {
        super(ct);
        this.methodAccess = methodAccess;
        this.methodName = methodName;
        this.methodDesc = methodDesc;
    }

    @Override
    public void transform(ClassNode cn) {
        // 首先，处理自己的代码逻辑
        boolean isPresent = false;
        for (MethodNode mn : cn.methods) {
            if (methodName.equals(mn.name) && methodDesc.equals(mn.desc)) {
                isPresent = true;
                break;
            }
        }
        if (!isPresent) {
            MethodNode mn = new MethodNode(methodAccess, methodName, methodDesc, null, null);
            cn.methods.add(mn);
            generateMethodBody(mn);
        }

        // 其次，调用父类的方法实现
        super.transform(cn);
    }

    protected void generateMethodBody(MethodNode mn) {
        // empty method
    }
}
```

### 进行转换

```java
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.*;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldTransformTree {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        // (1)构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        // (2) 构建ClassNode
        int api = Opcodes.ASM9;
        ClassNode cn = new ClassNode(api);
        cr.accept(cn, ClassReader.SKIP_FRAMES | ClassReader.SKIP_DEBUG);

        // (3) 进行transform
        ClassTransformer ct = new ClassAddMethodTransformer(null, Opcodes.ACC_PUBLIC, "mul", "(II)I") {
            @Override
            protected void generateMethodBody(MethodNode mn) {
                InsnList il = mn.instructions;
                il.add(new VarInsnNode(ILOAD, 1));
                il.add(new VarInsnNode(ILOAD, 2));
                il.add(new InsnNode(IMUL));
                il.add(new InsnNode(IRETURN));

                mn.maxStack = 2;
                mn.maxLocals = 3;
            }
        };
        ct.transform(cn);

        // (4) 构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
        cn.accept(cw);

        // (5) 生成byte[]内容输出
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

