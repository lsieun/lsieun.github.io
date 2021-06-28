---
title:  "ClassRemapper介绍"
sequence: "410"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

使用`ClassRemapper`类，我们可以将class文件进行简单的混淆处理：

{:refdef: style="text-align: center;"}
![](/assets/images/java/asm/class-remap.png)
{: refdef}

## ClassRemapper类

### class info

第一个部分，`ClassRemapper`类继承自`ClassVisitor`类。

```java
public class ClassRemapper extends ClassVisitor {
}
```

### fields

第二个部分，`ClassRemapper`类定义的字段有哪些。在`ClassRemapper`类当中，定义了两个字段：`Remapper remapper`字段和`String className`字段。其中，`Remapper remapper`字段是关键性的部分，它负责从“一个类”向“另一个类”的映射；而`String className`字段则表示当前类的名字。

在ASM中，`Remapper`类是一个抽象类，它一个具体的子类`SimpleRemapper`；这个`SimpleRemapper`从本质上来说是一个`Map`，所以实现上也比较简单。

```java
public class ClassRemapper extends ClassVisitor {
    protected final Remapper remapper;
    protected String className;
}
```

### constructors

第三个部分，`ClassRemapper`类定义的构造方法有哪些。

```java
public class ClassRemapper extends ClassVisitor {
    public ClassRemapper(final ClassVisitor classVisitor, final Remapper remapper) {
        this(Opcodes.ASM9, classVisitor, remapper);
    }

    protected ClassRemapper(final int api, final ClassVisitor classVisitor, final Remapper remapper) {
        super(api, classVisitor);
        this.remapper = remapper;
    }
}
```

### methods

第四个部分，`ClassRemapper`类定义的方法有哪些。

```java
public class ClassRemapper extends ClassVisitor {
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        this.className = name;
        super.visit(
            version,
            access,
            remapper.mapType(name),
            remapper.mapSignature(signature, false),
            remapper.mapType(superName),
            interfaces == null ? null : remapper.mapTypes(interfaces));
    }

    public FieldVisitor visitField(int access, String name, String descriptor, String signature, Object value) {
        FieldVisitor fieldVisitor =
            super.visitField(
                access,
                remapper.mapFieldName(className, name, descriptor),
                remapper.mapDesc(descriptor),
                remapper.mapSignature(signature, true),
                (value == null) ? null : remapper.mapValue(value));
        return fieldVisitor == null ? null : createFieldRemapper(fieldVisitor);
    }

    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        String remappedDescriptor = remapper.mapMethodDesc(descriptor);
        MethodVisitor methodVisitor =
            super.visitMethod(
                access,
                remapper.mapMethodName(className, name, descriptor),
                remappedDescriptor,
                remapper.mapSignature(signature, false),
                exceptions == null ? null : remapper.mapTypes(exceptions));
        return methodVisitor == null ? null : createMethodRemapper(methodVisitor);
    }
}
```

## 示例

### 示例一：修改类名

#### 预期目标

修改前：

```java
public class HelloWorld {
    public void test() {
        System.out.println("Hello World");
    }
}
```

修改后：

```java
public class GoodChild {
    public void test() {
        System.out.println("Hello World");
    }
}
```

#### 编码实现

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.commons.ClassRemapper;
import org.objectweb.asm.commons.Remapper;
import org.objectweb.asm.commons.SimpleRemapper;

public class ClassRemapperExample01 {
    public static void main(String[] args) {
        String origin_name = "sample/HelloWorld";
        String target_name = "sample/GoodChild";
        String origin_filepath = getFilePath(origin_name);
        byte[] bytes1 = FileUtils.readBytes(origin_filepath);

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连ClassVisitor
        Remapper remapper = new SimpleRemapper(origin_name, target_name);
        ClassVisitor cv = new ClassRemapper(cw, remapper);

        //（4）两者进行结合
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）重新生成Class
        byte[] bytes2 = cw.toByteArray();

        String target_filepath = getFilePath(target_name);
        FileUtils.writeBytes(target_filepath, bytes2);
    }

    public static String getFilePath(String internalName) {
        String relative_path = String.format("%s.class", internalName);
        return FileUtils.getFilePath(relative_path);
    }
}
```

#### 验证结果

```java
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.GoodChild");
        Method m = clazz.getDeclaredMethod("test");

        Object instance = clazz.newInstance();
        m.invoke(instance);
    }
}
```

### 示例二：修改字段名和方法名

#### 预期目标

修改前：

```java
public class HelloWorld {
    private int intValue;

    public HelloWorld() {
        this.intValue = 100;
    }

    public void test() {
        System.out.println("field value: " + intValue);
    }
}
```

修改后：

```java
public class GoodChild {
    private int a;

    public GoodChild() {
        this.a = 100;
    }

    public void b() {
        System.out.println("field value: " + this.a);
    }
}
```

#### 编码实现

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.commons.ClassRemapper;
import org.objectweb.asm.commons.Remapper;
import org.objectweb.asm.commons.SimpleRemapper;

import java.util.HashMap;
import java.util.Map;

public class ClassRemapperExample02 {
    public static void main(String[] args) {
        String origin_name = "sample/HelloWorld";
        String target_name = "sample/GoodChild";
        String origin_filepath = getFilePath(origin_name);
        byte[] bytes1 = FileUtils.readBytes(origin_filepath);

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连ClassVisitor
        Map<String, String> mapping = new HashMap<>();
        mapping.put(origin_name, target_name);
        mapping.put(origin_name + ".intValue", "a");
        mapping.put(origin_name + ".test()V", "b");
        Remapper mapper = new SimpleRemapper(mapping);
        ClassVisitor cv = new ClassRemapper(cw, mapper);

        //（4）两者进行结合
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）重新生成Class
        byte[] bytes2 = cw.toByteArray();

        String target_filepath = getFilePath(target_name);
        FileUtils.writeBytes(target_filepath, bytes2);
    }

    public static String getFilePath(String internalName) {
        String relative_path = String.format("%s.class", internalName);
        return FileUtils.getFilePath(relative_path);
    }
}
```

#### 验证结果

```java
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.GoodChild");
        Method m = clazz.getDeclaredMethod("b");

        Object instance = clazz.newInstance();
        m.invoke(instance);
    }
}
```

### 示例三：修改两个类

#### 预期目标

修改前：

```java
public class GoodChild {
    public void study() {
        System.out.println("Start where you are. Use what you have. Do what you can. – Arthur Ashe");
    }
}
```

修改后：

```java
public class BBB {
    public void b() {
        System.out.println("Start where you are. Use what you have. Do what you can. – Arthur Ashe");
    }
}
```

修改前：

```java
public class HelloWorld {
    public void test() {
        GoodChild child = new GoodChild();
        child.study();
    }
}
```

修改后：

```java
public class AAA {
    public void a() {
        BBB var1 = new BBB();
        var1.b();
    }
}
```

#### 编码实现

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.commons.ClassRemapper;
import org.objectweb.asm.commons.Remapper;
import org.objectweb.asm.commons.SimpleRemapper;

import java.util.HashMap;
import java.util.Map;

public class ClassRemapperExample03 {
    public static void main(String[] args) {
        Map<String, String> mapping = new HashMap<>();
        mapping.put("sample/HelloWorld", "sample/AAA");
        mapping.put("sample/GoodChild", "sample/BBB");
        mapping.put("sample/HelloWorld.test()V", "a");
        mapping.put("sample/GoodChild.study()V", "b");
        obfuscate("sample/HelloWorld", "sample/AAA", mapping);
        obfuscate("sample/GoodChild", "sample/BBB", mapping);
    }

    public static void obfuscate(String origin_name, String target_name, Map<String, String> mapping) {
        String origin_filepath = getFilePath(origin_name);
        byte[] bytes1 = FileUtils.readBytes(origin_filepath);

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连ClassVisitor
        Remapper mapper = new SimpleRemapper(mapping);
        ClassVisitor cv = new ClassRemapper(cw, mapper);

        //（4）两者进行结合
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）重新生成Class
        byte[] bytes2 = cw.toByteArray();

        String target_filepath = getFilePath(target_name);
        FileUtils.writeBytes(target_filepath, bytes2);
    }

    public static String getFilePath(String internalName) {
        String relative_path = String.format("%s.class", internalName);
        return FileUtils.getFilePath(relative_path);
    }
}
```

#### 验证结果

```java
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.AAA");
        Method m = clazz.getDeclaredMethod("a");

        Object instance = clazz.newInstance();
        m.invoke(instance);
    }
}
```

## 总结

本文对`ClassRemapper`类进行介绍，内容总结如下：

- 第一点，从类成员的角度上来说，它里面非常关键的一个部分是`Remapper`。`Remapper`类，从本质上来说，是一个`Map`，它记录的是从“一个类”向“另一个类”的映射关系。在ASM中，提供了一个`SimpleRemapper`类，这是一个比较简单`Remapper`类的实现。其实，我们也可以提供一个自己的`Remapper`类的子类，来完成一些特殊的转换规则。
- 第二点，从应用的角度来说，`ClassRemapper`类主要用于对class文件进行混淆处理。但是，`ClassRemapper`类进行混淆处理的程度是比较低的，远不及一些专业的obfuscator。

