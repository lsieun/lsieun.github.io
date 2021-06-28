---
title:  "SerialVersionUIDAdder介绍"
sequence: "412"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

`SerialVersionUIDAdder`类继承自`ClassVisitor`类，它的主要作用为类文件添加一个`serialVersionUID`字段。当`SerialVersionUIDAdder`类计算`serialVersionUID`字段的值时，它有一套自己的算法。那么，`serialVersionUID`字段有什么作用呢？

## serialVersionUID介绍

The `serialVersionUID` attribute is an identifier that is used to serialize/deserialize an object of a `Serializable` class.

Simply put, we use the `serialVersionUID` attribute to remember versions of a `Serializable` class to verify that a loaded class and the serialized object are compatible.

The `serialVersionUID` attributes of different classes are independent.
Therefore, it is not necessary for different classes to have unique values.

- **Serialization**: At the time of serialization, with every object will save a **Unique Identifier**.
- **Deserialization**: At the time of deserialization, JVM will compare the unique ID associated with the Object with local class Unique ID. If both unique ID matched then only deserialization will be performed. Otherwise, we will get Runtime Exception saying `InvalidClassException`.

## 示例

### 预期目标

修改前：

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

修改后：

```java
import java.io.Serializable;

public class HelloWorld implements Serializable {
    public String name;
    public int age;

    public HelloWorld(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void test() {
        System.out.println("Hello World");
    }

    @Override
    public String toString() {
        return String.format("HelloWorld { name='%s', age=%d }", name, age);
    }
}
```

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

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new SerialVersionUIDAdder(cw);

        //（4）结合ClassReader和ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成byte[]
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

这篇文章主要介绍`SerialVersionUIDAdder`类，内容总结如下：

- 第一点，了解`serialVersionUID`字段的作用。
- 第二点，如何使用`SerialVersionUIDAdder`类。
