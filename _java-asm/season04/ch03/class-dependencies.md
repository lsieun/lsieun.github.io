---
title: "Class Dependencies"
sequence: "304"
---

## 查看当前类的依赖

假如有一个`HelloWorld`类：

```java
import java.util.Random;

public class HelloWorld {
    public static void main(String[] args) throws InterruptedException {
        Random rand = new Random();
        int val = rand.nextInt(1000);
        Thread.sleep(val);
        System.out.println("Hello World");
    }
}
```

查看`HelloWorld`类所依赖的类：

```java
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.commons.ClassRemapper;
import org.objectweb.asm.commons.Remapper;

import java.util.HashSet;
import java.util.Set;

public class HelloWorldAnalysisCore {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes = FileUtils.readBytes(filepath);

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes);

        //（2）分析ClassVisitor
        Set<String> dependencies = new HashSet<>();
        EmptyClassVisitor emptyVisitor = new EmptyClassVisitor(Opcodes.ASM9, null);
        ClassVisitor cv = new ClassRemapper(emptyVisitor, new Remapper() {
            @Override
            public String map(String internalName) {
                dependencies.add(internalName);
                return super.map(internalName);
            }
        });

        //（3）结合ClassReader和ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（4）打印依赖信息
        for (String item : dependencies) {
            System.out.println(item);
        }
    }
}

```

输出结果：

```text
java/lang/Object
java/lang/String
java/util/Random
sample/HelloWorld
java/lang/InterruptedException
java/lang/System
java/lang/Thread
java/io/PrintStream
```

## 代码分析

### 核心代码段

```text
Set<String> dependencies = new HashSet<>();
EmptyClassVisitor emptyVisitor = new EmptyClassVisitor(Opcodes.ASM9, null);
ClassVisitor cv = new ClassRemapper(emptyVisitor, new Remapper() {
    @Override
    public String map(String internalName) {
        dependencies.add(internalName);
        return super.map(internalName);
    }
});
```

### EmptyClassVisitor

对于`EmptyClassVisitor`类，它本身并没有做什么有用的操作，只是一个空的实现，有三点情况需要注意：

- 第一点，可以将`EmptyClassVisitor`类实例替换成`ClassWriter`类实例，但是没有很大的必要。原因：`ClassWriter`类功能更强大，但这些强大的功能，在当前场景下，并不需要使用到。
- 第二点，不能将`EmptyClassVisitor`类实例替换成匿名类`new ClassVisitor(Opcodes.ASM9) {}`。原因：在默认情况下，`ClassVisitor`的`visitField()`和`visitMethod()`返回值为`null`，影响功能发挥。
- 第三点，不能将`EmptyClassVisitor`类实例替换成`null`，影响功能正常发挥。

```java
import org.objectweb.asm.*;

public class EmptyClassVisitor extends ClassVisitor {
    public EmptyClassVisitor(int api, ClassVisitor classVisitor) {
        super(api, classVisitor);
    }

    @Override
    public ModuleVisitor visitModule(String name, int access, String version) {
        ModuleVisitor mv = super.visitModule(name, access, version);
        return new EmptyModuleVisitor(api, mv);
    }

    @Override
    public AnnotationVisitor visitAnnotation(String descriptor, boolean visible) {
        AnnotationVisitor av = super.visitAnnotation(descriptor, visible);
        return new EmptyAnnotationVisitor(api, av);
    }

    @Override
    public AnnotationVisitor visitTypeAnnotation(int typeRef, TypePath typePath, String descriptor, boolean visible) {
        AnnotationVisitor av = super.visitTypeAnnotation(typeRef, typePath, descriptor, visible);
        return new EmptyAnnotationVisitor(api, av);
    }

    @Override
    public RecordComponentVisitor visitRecordComponent(String name, String descriptor, String signature) {
        RecordComponentVisitor rcv = super.visitRecordComponent(name, descriptor, signature);
        return new EmptyRecordComponentVisitor(api, rcv);
    }

    @Override
    public FieldVisitor visitField(int access, String name, String descriptor, String signature, Object value) {
        FieldVisitor fv = super.visitField(access, name, descriptor, signature, value);
        return new EmptyFieldVisitor(api, fv);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        return new EmptyMethodVisitor(api, mv);
    }

}
```

### ClassRemapper和Remapper

在下面代码中，我们可以看到`ClassRemapper`和`Remapper`类，这两个类一般用于“混淆处理.class文件”，两者有各自的作用：

- `ClassRemapper`类负责找出所有可以替换的位置（类名、方法名和字段名）。
- `Remapper`类负责决定哪些位置需要进行替换。

```text
Set<String> dependencies = new HashSet<>();
EmptyClassVisitor emptyVisitor = new EmptyClassVisitor(Opcodes.ASM9, null);
ClassVisitor cv = new ClassRemapper(emptyVisitor, new Remapper() {
    @Override
    public String map(String internalName) {
        dependencies.add(internalName);
        return super.map(internalName);
    }
});
```

在`ClassRemapper`类当中，我们重点关注于`Remapper.mapType(String)`方法，它会再进一步调用`Remapper.map(String)`方法。在记录类的依赖关系时，正是在`Remapper.map(String)`方法中进行的。
另外，如果我们有兴趣，可以进一步查看`MethodRemapper.visitMethodInsn()`方法。

```java
public class ClassRemapper extends ClassVisitor {
    protected final Remapper remapper;

    public ClassRemapper(final ClassVisitor classVisitor, final Remapper remapper) {
        this(Opcodes.ASM9, classVisitor, remapper);
    }

    protected ClassRemapper(final int api, final ClassVisitor classVisitor, final Remapper remapper) {
        super(api, classVisitor);
        this.remapper = remapper;
    }

    @Override
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        this.className = name;
        super.visit(version, access,
                remapper.mapType(name),
                remapper.mapSignature(signature, false),
                remapper.mapType(superName),
                interfaces == null ? null : remapper.mapTypes(interfaces));
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        String remappedDescriptor = remapper.mapMethodDesc(descriptor);
        MethodVisitor methodVisitor =
                super.visitMethod(access,
                        remapper.mapMethodName(className, name, descriptor),
                        remappedDescriptor,
                        remapper.mapSignature(signature, false),
                        exceptions == null ? null : remapper.mapTypes(exceptions));
        return methodVisitor == null ? null : createMethodRemapper(methodVisitor);
    }

    protected MethodVisitor createMethodRemapper(final MethodVisitor methodVisitor) {
        return new MethodRemapper(api, methodVisitor, remapper);
    }
}
```



