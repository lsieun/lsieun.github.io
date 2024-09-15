---
title: "Superpackage attribute"
sequence: "303"
---

## Intro

[JSR 294](https://jcp.org/en/jsr/detail?id=294) is dead which is now marked as 'Withdrawn' on the JCP.

Superpackage attribute structure:

```text
Superpackage_attribute {
    u2 attribute_name_index;
    u4 attribute_length;
    u2 superpackage_name;
}
```

- `superpackage_name`: is an index into the constant pool.
    - The constant pool entry at that index must be a `CONSTANT_Utf8_info` structure representing the name of the superpackage of which the class described by this `ClassFile` is a member.
    - The superpackage name must be encoded in internal form.

## 代码实现

### 定义Custom Attribute

```java
import org.objectweb.asm.*;

public class SuperPackageAttribute extends Attribute {
    public String name;

    public SuperPackageAttribute(String name) {
        super("Superpackage");
        this.name = name;
    }

    @Override
    protected Attribute read(ClassReader classReader, int offset, int length, char[] charBuffer, int codeAttributeOffset, Label[] labels) {
        String name = classReader.readUTF8(offset, charBuffer);
        return new SuperPackageAttribute(name);
    }

    @Override
    protected ByteVector write(ClassWriter classWriter, byte[] code, int codeLength, int maxStack, int maxLocals) {
        int index = classWriter.newUTF8(name);
        return new ByteVector().putShort(index);
    }

}
```

### 写入Custom Attribute

核心代码段：

```text
// write custom attribute
SuperPackageAttribute attr = new SuperPackageAttribute("cn/lsieun/my/package");
cw.visitAttribute(attr);
```

假如有一个`HelloWorld`类：

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello ASM");
    }
}
```

预期目标：为`HelloWorld`类添加`Superpackage`自定义属性。

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldGenerateCore {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);

        // (1) 生成byte[]内容
        byte[] bytes = dump();

        // (2) 保存byte[]到文件
        FileUtils.writeBytes(filepath, bytes);
    }

    public static byte[] dump() throws Exception {
        // (1) 创建ClassWriter对象
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (2) 调用visitXxx()方法
        cw.visit(V1_8, ACC_PUBLIC + ACC_SUPER, "sample/HelloWorld",
                null, "java/lang/Object", null);

        // write custom attribute
        SuperPackageAttribute attr = new SuperPackageAttribute("cn/lsieun/my/package");
        cw.visitAttribute(attr);

        {
            MethodVisitor mv1 = cw.visitMethod(ACC_PUBLIC, "<init>", "()V", null, null);
            mv1.visitCode();
            mv1.visitVarInsn(ALOAD, 0);
            mv1.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
            mv1.visitInsn(RETURN);
            mv1.visitMaxs(1, 1);
            mv1.visitEnd();
        }

        {
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC | ACC_STATIC, "main", "([Ljava/lang/String;)V", null, null);
            mv2.visitCode();
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("Hello ASM");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(2, 1);
            mv2.visitEnd();
        }
        cw.visitEnd();

        // (3) 调用toByteArray()方法
        return cw.toByteArray();
    }
}
```

### 读取Custom Attribute

核心代码段：

```text
Attribute[] attrs = new Attribute[]{
    new SuperPackageAttribute(),
};

new ClassReader(className).accept(traceClassVisitor, attrs, parsingOptions);
```

首先，不使用“核心代码段”：

```java
public class HelloWorldAnalysisCore {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes = FileUtils.readBytes(filepath);

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes);

        //（2）分析ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new InfoClassVisitor(api, null);

        //（3）结合ClassReader和ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);
    }
}
```

输出内容：自定义属性无法解析

```text
ClassVisitor.visitAttribute(org.objectweb.asm.Attribute@3cd1a2f1);
```

接着，使用“核心代码段”：

```text
Attribute[] attrs = new Attribute[] {
    new SuperPackageAttribute(),
};
int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
cr.accept(cv, attrs, parsingOptions);
```

输出内容：自定义属性解析成功

```text
ClassVisitor.visitAttribute(Superpackage {name='cn/lsieun/my/package'});
```
