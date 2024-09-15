---
title: "接口：添加"
sequence: "105"
---

## 预期目标

假如有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

我们想实现的预期目标：为`HelloWorld`类添加`Cloneable`接口。

## 编码实现

```java
import org.objectweb.asm.ClassVisitor;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class ClassAddInterfaceVisitor extends ClassVisitor {
    private final String[] newInterfaces;

    public ClassAddInterfaceVisitor(int api, ClassVisitor cv, String[] newInterfaces) {
        super(api, cv);
        this.newInterfaces = newInterfaces;
    }

    @Override
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        Set<String> set = new HashSet<>(); // 注意，这里使用Set是为了避免出现重复接口
        if (interfaces != null) {
            set.addAll(Arrays.asList(interfaces));
        }
        if (newInterfaces != null) {
            set.addAll(Arrays.asList(newInterfaces));
        }
        super.visit(version, access, name, signature, superName, set.toArray(new String[0]));
    }
}
```

## 进行转换

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

public class HelloWorldTransformCore {
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
        ClassVisitor cv = new ClassAddInterfaceVisitor(api, cw, new String[]{"java/lang/Cloneable"});

        //（4）结合ClassReader和ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

## 验证结果

```java
import sample.HelloWorld;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        HelloWorld obj = new HelloWorld();
        Object anotherObj = obj.clone();
        System.out.println(anotherObj);
    }
}
```

## 总结
