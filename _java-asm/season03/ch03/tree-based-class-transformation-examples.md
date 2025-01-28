---
title: "Tree Based Class Transformation示例"
sequence: "302"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## 整体思路

使用Tree API进行Class Transformation的思路：

```text
ClassReader --> ClassNode --> ClassWriter
```

其中，

- `ClassReader`类负责“读”Class。
- `ClassWriter`类负责“写”Class。
- `ClassNode`类负责进行“转换”（Transformation）。

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
import lsieun.asm.tree.transformer.ClassTransformer;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.tree.ClassNode;

public class ClassRemoveFieldNode extends ClassNode {
    private final String fieldName;
    private final String fieldDesc;

    public ClassRemoveFieldNode(int api, ClassVisitor cv, String fieldName, String fieldDesc) {
        super(api);
        this.cv = cv;
        this.fieldName = fieldName;
        this.fieldDesc = fieldDesc;
    }

    @Override
    public void visitEnd() {
        // 首先，处理自己的代码逻辑
        ClassTransformer ct = new ClassRemoveFieldTransformer(null, fieldName, fieldDesc);
        ct.transform(this);

        // 其次，调用父类的方法实现（根据实际情况，选择保留，或删除）
        super.visitEnd();

        // 最后，向后续ClassVisitor传递
        if (cv != null) {
            accept(cv);
        }
    }

    private static class ClassRemoveFieldTransformer extends ClassTransformer {
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
            cn.fields.removeIf(fn -> fieldName.equals(fn.name) && fieldDesc.equals(fn.desc));

            // 其次，调用父类的方法实现
            super.transform(cn);
        }
    }
}
```

### 进行转换

```text
import lsieun.utils.FileUtils;
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

        // (2)构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (3)串连ClassNode
        int api = Opcodes.ASM9;
        ClassNode cn = new ClassRemoveFieldNode(api, cw, "strValue", "Ljava/lang/String;");

        //（4）结合ClassReader和ClassNode
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cn, parsingOptions);

        // (5) 生成byte[]
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
import lsieun.asm.tree.transformer.ClassTransformer;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.FieldNode;

public class ClassAddFieldNode extends ClassNode {
    private final int fieldAccess;
    private final String fieldName;
    private final String fieldDesc;

    public ClassAddFieldNode(int api, ClassVisitor cv,
                             int fieldAccess, String fieldName, String fieldDesc) {
        super(api);
        this.cv = cv;
        this.fieldAccess = fieldAccess;
        this.fieldName = fieldName;
        this.fieldDesc = fieldDesc;
    }

    @Override
    public void visitEnd() {
        // 首先，处理自己的代码逻辑
        ClassTransformer ct = new ClassAddFieldTransformer(null, fieldAccess, fieldName, fieldDesc);
        ct.transform(this);

        // 其次，调用父类的方法实现（根据实际情况，选择保留，或删除）
        super.visitEnd();

        // 最后，向后续ClassVisitor传递
        if (cv != null) {
            accept(cv);
        }
    }

    private static class ClassAddFieldTransformer extends ClassTransformer {
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
}
```

### 进行转换

```text
import lsieun.utils.FileUtils;
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

        // (2)构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (3)串连ClassNode
        int api = Opcodes.ASM9;
        ClassNode cn = new ClassAddFieldNode(api, cw, Opcodes.ACC_PUBLIC, "objValue", "Ljava/lang/Object;");

        //（4）结合ClassReader和ClassNode
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cn, parsingOptions);

        // (5) 生成byte[]
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
import lsieun.asm.tree.transformer.ClassTransformer;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.tree.ClassNode;

public class ClassRemoveMethodNode extends ClassNode {
    private final String methodName;
    private final String methodDesc;

    public ClassRemoveMethodNode(int api, ClassVisitor cv, String methodName, String methodDesc) {
        super(api);
        this.cv = cv;
        this.methodName = methodName;
        this.methodDesc = methodDesc;
    }

    @Override
    public void visitEnd() {
        // 首先，处理自己的代码逻辑
        ClassTransformer ct = new ClassRemoveMethodTransformer(null, methodName, methodDesc);
        ct.transform(this);

        // 其次，调用父类的方法实现（根据实际情况，选择保留，或删除）
        super.visitEnd();

        // 最后，向后续ClassVisitor传递
        if (cv != null) {
            accept(cv);
        }
    }

    private static class ClassRemoveMethodTransformer extends ClassTransformer {
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
            cn.methods.removeIf(mn -> methodName.equals(mn.name) && methodDesc.equals(mn.desc));

            // 其次，调用父类的方法实现
            super.transform(cn);
        }
    }
}
```

### 进行转换

```text
import lsieun.utils.FileUtils;
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

        // (2)构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (3)串连ClassNode
        int api = Opcodes.ASM9;
        ClassNode cn = new ClassRemoveMethodNode(api, cw, "add", "(II)I");

        //（4）结合ClassReader和ClassNode
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cn, parsingOptions);

        // (5) 生成byte[]
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
import lsieun.asm.tree.transformer.ClassTransformer;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.MethodNode;

import java.util.function.Consumer;

public class ClassAddMethodNode extends ClassNode {
    private final int methodAccess;
    private final String methodName;
    private final String methodDesc;
    private final Consumer<MethodNode> methodBody;

    public ClassAddMethodNode(int api, ClassVisitor cv,
                              int methodAccess, String methodName, String methodDesc,
                              Consumer<MethodNode> methodBody) {
        super(api);
        this.cv = cv;
        this.methodAccess = methodAccess;
        this.methodName = methodName;
        this.methodDesc = methodDesc;
        this.methodBody = methodBody;
    }

    @Override
    public void visitEnd() {
        // 首先，处理自己的代码逻辑
        ClassTransformer ct = new ClassAddMethodTransformer(null, methodAccess, methodName, methodDesc, methodBody);
        ct.transform(this);

        // 其次，调用父类的方法实现（根据实际情况，选择保留，或删除）
        super.visitEnd();

        // 最后，向后续ClassVisitor传递
        if (cv != null) {
            accept(cv);
        }
    }

    private static class ClassAddMethodTransformer extends ClassTransformer {
        private final int methodAccess;
        private final String methodName;
        private final String methodDesc;
        private final Consumer<MethodNode> methodBody;

        public ClassAddMethodTransformer(ClassTransformer ct,
                                         int methodAccess, String methodName, String methodDesc,
                                         Consumer<MethodNode> methodBody) {
            super(ct);
            this.methodAccess = methodAccess;
            this.methodName = methodName;
            this.methodDesc = methodDesc;
            this.methodBody = methodBody;
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

                if (methodBody != null) {
                    methodBody.accept(mn);
                }
            }

            // 其次，调用父类的方法实现
            super.transform(cn);
        }
    }
}
```

### 进行转换

```text
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.*;

import java.util.function.Consumer;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldTransformTree {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        // (1)构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        // (2)构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (3)串连ClassNode
        int api = Opcodes.ASM9;
        Consumer<MethodNode> methodBody = (mn) -> {
            InsnList il = mn.instructions;
            il.add(new VarInsnNode(ILOAD, 1));
            il.add(new VarInsnNode(ILOAD, 2));
            il.add(new InsnNode(IMUL));
            il.add(new InsnNode(IRETURN));

            mn.maxStack = 2;
            mn.maxLocals = 3;
        };
        ClassNode cn = new ClassAddMethodNode(api, cw, ACC_PUBLIC, "mul", "(II)I", methodBody);

        //（4）结合ClassReader和ClassNode
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cn, parsingOptions);

        // (5) 生成byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

## 总结

本文内容总结如下：

- 第一点，代码示例，如何删除和添加字段。
- 第二点，代码示例，如何删除和添加方法。
