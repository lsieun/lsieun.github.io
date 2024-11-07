---
title: "StaticInitMerger 介绍"
sequence: "411"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

`StaticInitMerger` 类的特点是，可以实现将多个 `<clinit>()` 方法合并到一起。

## 如何合并两个类文件

**首先，什么是合并两个类文件？** 假如有两个类，一个是 `sample.HelloWorld` 类，另一个是 `sample.GoodChild` 类，我们想将 `sample.GoodChild` 类里面定义的字段（fields）和方法（methods）全部放到 `sample.HelloWorld` 类里面，这样就是将两个类合并成一个新的 `sample.HelloWorld` 类。

**其次，合并两个类文件，有哪些应用场景呢？** 假如 `sample/HelloWorld.class` 是来自于第三方的软件产品，但是，我们可能会发现它的功能有些不足，所以想对这个类进行扩展。

- 第一种情况，如果扩展的功能比较简单，那么可以直接使用 `ClassVisitor` 和 `MethodVisitor` 类可以进行 Class Transformation 操作。
- 第二种情况，如果扩展的功能比较复杂，例如，需要添加的方法比较多、方法实现的代码逻辑比较复杂，那么使用 `ClassVisitor` 和 `MethodVisitor` 类直接修改就会变得比较麻烦。这个时候，如果我们把想添加的功能，使用 Java 语言编写代码，放到一个全新的 `sample.GoodChild` 类，将其编译成 `sample/GoodChild.class` 文件；再接下来，只要我们将 `sample/GoodChild.class` 定义的字段（fields）和方法（methods）全部迁移到 `sample/HelloWorld.class` 就可以了。

**再者，合并两个类文件，需要注意哪些地方呢？** 因为主要迁移的内容有接口（interface）、字段（fields）和方法（methods），那么就应该避免出现“重复”的接口、字段和方法。

- 第一点，在编写 Java 代码时，在编写 `sample.GoodChild` 类时，应该避免定义重复的字段和方法。
- 第二点，在合并两个类时，对于重复的接口信息进行处理。
- 第三点，在合并两个类时，对于重复的 `<init>()` 方法进行处理。对于 `sample/GoodChild.class` 里面的 `<init>()` 方法直接忽略就好了，只保留 `sample/HelloWorld.class` 定义的 `<init>()` 方法。
- 第四点，在合并两个类之后，对于重复的 `<clinit>()` 方法进行处理。对于 `sample/HelloWorld.class` 定义的 `<clinit>()` 方法和 `sample/GoodChild.class` 里面定义的 `<clinit>()` 方法，则需要合并到一起。`StaticInitMerger` 类的作用，就是将多个 `<clinit>()` 方法进行合并。

**最后，合并两个类文件，需要经历哪些步骤呢？** 在这里，我们列出了四个步骤：

- 第一步，读取两个类文件。
- 第二步，将 `sample.GoodChild` 类重命名为 `sample.HelloWorld`。在代码实现上，会用到 `ClassRemapper` 类。
- 第三步，合并两个类。在这个过程中，要对重复的接口（interface）和 `<init>()` 方法。在代码实现上，会用到 `ClassNode` 类（Tree API）。
- 第四步，处理重复的 `<clinit>()` 方法。在代码实现上，会用到 `StaticInitMerger` 类。

![ 合并两个类文件 ](/assets/images/java/asm/merge-two-classes.png)

## StaticInitMerger 类

### class info

第一个部分，`StaticInitMerger` 类继承自 `ClassVisitor` 类。

```java
public class StaticInitMerger extends ClassVisitor {
}
```

### fields

第二个部分，`StaticInitMerger` 类定义的字段有哪些。

在 `StaticInitMerger` 类里面，定义了 4 个字段：

- `owner` 字段，表示当前类的名字。
- `renamedClinitMethodPrefix` 字段和 `numClinitMethods` 字段一起来确定方法的新名字。
- `mergedClinitVisitor` 字段，负责生成新的 `<clinit>()` 方法。

```java
public class StaticInitMerger extends ClassVisitor {
    // 当前类的名字
    private String owner;
    
    // 新方法的名字
    private final String renamedClinitMethodPrefix;
    private int numClinitMethods;
    
    // 生成新方法的 MethodVisitor
    private MethodVisitor mergedClinitVisitor;
}
```

### constructors

第三个部分，`StaticInitMerger` 类定义的构造方法有哪些。

```java
public class StaticInitMerger extends ClassVisitor {
    public StaticInitMerger(final String prefix, final ClassVisitor classVisitor) {
        this(Opcodes.ASM9, prefix, classVisitor);
    }

    protected StaticInitMerger(final int api, final String prefix, final ClassVisitor classVisitor) {
        super(api, classVisitor);
        this.renamedClinitMethodPrefix = prefix;
    }
}
```

### methods

第四个部分，`StaticInitMerger` 类定义的方法有哪些。

在 `StaticInitMerger` 类里面，定义了 3 个 `visitXxx()` 方法：

- `visit()` 方法，负责将当前类的名字记录到 `owner` 字段
- `visitMethod()` 方法，负责将原来的 `<clinit>()` 方法进行重新命名成 `renamedClinitMethodPrefix + numClinitMethods`，并在新的 `<clinit>()` 方法中对 `renamedClinitMethodPrefix + numClinitMethods` 方法进行调用。
- `visitEnd()` 方法，为新的 `<clinit>()` 方法添加 `return` 语句。

```java
public class StaticInitMerger extends ClassVisitor {
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        super.visit(version, access, name, signature, superName, interfaces);
        this.owner = name;
    }

    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor methodVisitor;
        if ("<clinit>".equals(name)) {
            int newAccess = Opcodes.ACC_PRIVATE + Opcodes.ACC_STATIC;
            String newName = renamedClinitMethodPrefix + numClinitMethods++;
            methodVisitor = super.visitMethod(newAccess, newName, descriptor, signature, exceptions);
            
            if (mergedClinitVisitor == null) {
                mergedClinitVisitor = super.visitMethod(newAccess, name, descriptor, null, null);
            }
            mergedClinitVisitor.visitMethodInsn(Opcodes.INVOKESTATIC, owner, newName, descriptor, false);
        } else {
            methodVisitor = super.visitMethod(access, name, descriptor, signature, exceptions);
        }
        return methodVisitor;
    }

    public void visitEnd() {
        if (mergedClinitVisitor != null) {
            mergedClinitVisitor.visitInsn(Opcodes.RETURN);
            mergedClinitVisitor.visitMaxs(0, 0);
        }
        super.visitEnd();
    }
}
```

## 示例：合并两个类文件

### 预期目标

假如有一个 `HelloWorld` 类，代码如下：


```java
public class HelloWorld {
    static {
        System.out.println("This is static initialization method");
    }

    private String name;
    private int age;

    public HelloWorld() {
        this("tomcat", 10);
    }

    public HelloWorld(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void test() {
        System.out.println("This is test method.");
    }

    @Override
    public String toString() {
        return String.format("HelloWorld { name='%s', age=%d }", name, age);
    }
}
```

假如有一个 `GoodChild` 类，代码如下：

```java
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;

public class GoodChild implements Serializable {
    private static final ThreadLocal<SimpleDateFormat> formatter = ThreadLocal.withInitial(
            () -> new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
    );

    public void printDate() {
        Date now = new Date();
        String str = formatter.get().format(now);
        System.out.println(str);
    }
}
```

我们想实现的预期目标：将 `HelloWorld` 类和 `GoodChild` 类合并成一个新的 `HelloWorld` 类。

### 编码实现

下面的 `ClassMergeVisitor` 类的作用是负责将两个类合并到一起。我们需要注意以下三点：

- 第一点，`ClassNode`、`FieldNode` 和 `MethodNode` 都是属于 ASM 的 Tree API 部分。
- 第二点，将两个类进行合并的代码逻辑，放在了 `visitEnd()` 方法内。为什么要把代码逻辑放在 `visitEnd()` 方法内呢？因为参照 `ClassVisitor` 类里的 `visitXxx()` 方法调用的顺序，`visitField()` 方法和 `visitMethod()` 方法正好位于 `visitEnd()` 方法的前面。
- 第三点，在 `visitEnd()` 方法的代码逻辑中，忽略掉了 `<init>()` 方法，这样就避免新生成的类当中包含重复的 `<init>()` 方法。

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.FieldNode;
import org.objectweb.asm.tree.MethodNode;

import java.util.List;

public class ClassMergeVisitor extends ClassVisitor {
    private final ClassNode anotherClass;

    public ClassMergeVisitor(int api, ClassVisitor classVisitor, ClassNode anotherClass) {
        super(api, classVisitor);
        this.anotherClass = anotherClass;
    }

    @Override
    public void visitEnd() {
        List<FieldNode> fields = anotherClass.fields;
        for (FieldNode fn : fields) {
            fn.accept(this);
        }

        List<MethodNode> methods = anotherClass.methods;
        for (MethodNode mn : methods) {
            String methodName = mn.name;
            if ("<init>".equals(methodName)) {
                continue;
            }
            mn.accept(this);
        }
        super.visitEnd();
    }
}
```

下面的 `ClassAddInterfaceVisitor` 类是负责为类添加“接口信息”。

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
        Set<String> set = new HashSet<>(); // 注意，这里使用 Set 是为了避免出现重复接口
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

### 进行转换

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.commons.ClassRemapper;
import org.objectweb.asm.commons.Remapper;
import org.objectweb.asm.commons.SimpleRemapper;
import org.objectweb.asm.commons.StaticInitMerger;
import org.objectweb.asm.tree.ClassNode;

import java.util.List;

public class StaticInitMergerExample01 {
    private static final int API_VERSION = Opcodes.ASM9;

    public static void main(String[] args) {
        // 第一步，读取两个类文件
        String first_class = "sample/HelloWorld";
        String second_class = "sample/GoodChild";

        String first_class_filepath = getFilePath(first_class);
        byte[] bytes1 = FileUtils.readBytes(first_class_filepath);

        String second_class_filepath = getFilePath(second_class);
        byte[] bytes2 = FileUtils.readBytes(second_class_filepath);

        // 第二步，将 sample/GoodChild 类重命名为 sample/HelloWorld
        byte[] bytes3 = renameClass(second_class, first_class, bytes2);

        // 第三步，合并两个类
        byte[] bytes4 = mergeClass(bytes1, bytes3);

        // 第四步，处理重复的 class initialization method
        byte[] bytes5 = removeDuplicateStaticInitMethod(bytes4);
        FileUtils.writeBytes(first_class_filepath, bytes5);
    }

    public static String getFilePath(String internalName) {
        String relative_path = String.format("%s.class", internalName);
        return FileUtils.getFilePath(relative_path);
    }

    public static byte[] renameClass(String origin_name, String target_name, byte[] bytes) {
        //（1）构建 ClassReader
        ClassReader cr = new ClassReader(bytes);

        //（2）构建 ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连 ClassVisitor
        Remapper remapper = new SimpleRemapper(origin_name, target_name);
        ClassVisitor cv = new ClassRemapper(cw, remapper);

        //（4）两者进行结合
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）重新生成 Class
        return cw.toByteArray();
    }

    public static byte[] mergeClass(byte[] bytes1, byte[] bytes2) {
        //（1）构建 ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建 ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连 ClassVisitor
        ClassNode cn = getClassNode(bytes2);
        List<String> interface_list = cn.interfaces;
        int size = interface_list.size();
        String[] interfaces = new String[size];
        for (int i = 0; i < size; i++) {
            String item = interface_list.get(i);
            interfaces[i] = item;
        }
        ClassMergeVisitor cmv = new ClassMergeVisitor(API_VERSION, cw, cn);
        ClassAddInterfaceVisitor cv = new ClassAddInterfaceVisitor(API_VERSION, cmv, interfaces);

        //（4）两者进行结合
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）重新生成 Class
        return cw.toByteArray();
    }

    public static ClassNode getClassNode(byte[] bytes) {
        ClassReader cr = new ClassReader(bytes);
        ClassNode cn = new ClassNode();
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cn, parsingOptions);
        return cn;
    }

    public static byte[] removeDuplicateStaticInitMethod(byte[] bytes) {
        //（1）构建 ClassReader
        ClassReader cr = new ClassReader(bytes);

        //（2）构建 ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连 ClassVisitor
        ClassVisitor cv = new StaticInitMerger("class_init$", cw);

        //（4）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成 byte[]
        return cw.toByteArray();
    }
}
```

### 验证结果

```java
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Object instance = clazz.newInstance();
        System.out.println(instance);
        invokeMethod(clazz, "test", instance);
        invokeMethod(clazz, "printDate", instance);
    }

    public static void invokeMethod(Class<?> clazz, String methodName, Object instance) throws Exception {
        Method m = clazz.getDeclaredMethod(methodName);
        m.invoke(instance);
    }
}
```

## 总结

本文对 `StaticInitMerger` 类进行了介绍，内容总结如下：

- 第一点，`StaticInitMerger` 类的特点是可以将多个 `<clinit>()` 方法合并。
- 第二点，了解 `StaticInitMerger` 类各个部分的信息，以便理解 `StaticInitMerger` 类的工作原理。
- 第三点，将两个类文件合并，有什么样的应用场景、需要注意哪些内容、经过哪些步骤，以及如何编码进行实现。
