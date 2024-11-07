---
title: "本章内容总结"
sequence: "214"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

![What ASM Can Do](/assets/images/java/asm/what-asm-can-do.png)

本章内容是围绕着 Class Generation（生成新的类）来展开，在这个过程当中，我们介绍了 ASM Core API 当中的一些类和接口。在本文当中，我们对这些内容进行一个总结。

## Java ClassFile

如果我们想要生成一个 `.class` 文件，就需要先对 `.class` 文件所遵循的文件格式（或者说是数据结构）有所了解。`.class` 文件所遵循的数据结构是由 [Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html) 定义的，其结构如下：

```text
ClassFile {
    u4             magic;
    u2             minor_version;
    u2             major_version;
    u2             constant_pool_count;
    cp_info        constant_pool[constant_pool_count-1];
    u2             access_flags;
    u2             this_class;
    u2             super_class;
    u2             interfaces_count;
    u2             interfaces[interfaces_count];
    u2             fields_count;
    field_info     fields[fields_count];
    u2             methods_count;
    method_info    methods[methods_count];
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
```

对上面的条目来进行一个简单的介绍：

- `magic`：表示 magic number，是一个固定值 `CAFEBABE`，它是一个标识信息，用来判断当前文件是否为 ClassFile。其实，不只是 `.class` 文件有 magic number。例如，`.pdf` 文件的 magic number 是 `%PDF`，`.png` 文件的 magic number 是 `PNG`。
- `minor_version` 和 `major_version`：表示当前 `.class` 文件的版本信息。因为 Java 语言不断发展，就存在不同版本之间的差异；记录 `.class` 文件的版本信息，是为了判断 JVM 的版本的 `.class` 文件的版本是否兼容。高版本的 JVM 可以执行低版本的 `.class` 文件，但是低版本的 JVM 不能执行高版本的 `.class` 文件。
- `constant_pool_count` 和 `constant_pool`：表示“常量池”信息，它是一个“资源仓库”。在这里面，存放了当前类的类名、父类的类名、所实现的接口名字，后面的 `this_class`、`super_class` 和 `interfaces[]` 存放的是一个索引值，该索引值指向常量池。
- `access_flags`、`this_class`、`super_class`、`interfaces_count` 和 `interfaces`：表示当前类的访问标识、类名、父类、实现接口的数量和具体的接口。
- `fields_count` 和 `fields`：表示字段的数量和具体的字段内容。
- `methods_count` 和 `methods`：表示方法的数量和具体的方法内容。
- `attributes_count` 和 `attributes`：表示属性的数量和具体的属性内容。

总结一下就是，magic number 是为了区分不同产品（PDF、PNG、ClassFile）之间的差异，而 version 则是为了区分同一个产品在不同版本之间的差异。 接下来的 Constant Pool、Class Info、Fields、Methods 和 Attributes 则是实实在在的映射 `.class` 文件当中的内容。

我们可以把这个 Java ClassFile 和一个 Java 文件的内容来做一个对照：

```java
public class HelloWorld extends Object implements Cloneable {
    private int intValue = 10;
    private String strValue = "ABC";

    public int add(int a, int b) {
        return a + b;
    }

    public int sub(int a, int b) {
        return a - b;
    }
}
```

## ASM Core API

要生成一个 `.class` 文件，直接使用记事本或十六进制编辑器，这是“不可靠的”，所以我们借助于 ASM 这个类库，使用其中 Core API 部分来帮助我们实现。

讲到任何的 API，其实就是讲它的类、接口、方法等内容；谈到 ASM Core API 就是讲其中涉及到的类、接口和里面的方法。在 ASM Core API 中，有三个非常重要的类，即 `ClassReader`、`ClassVisitor` 和 `ClassWriter` 类。但是，在 Class Generation 过程中，不会用到 `ClassReader`，所以我们就主要关注 `ClassVisitor` 和 `ClassWriter` 类。

![ASM 里的核心类 ](/assets/images/java/asm/asm-core-classes.png)

### ClassVisitor 和 ClassWriter

在 `ClassVisitor` 类当中，定义了许多的 `visitXxx()` 方法，并且这些 `visitXxx()` 方法要遵循一定的调用顺序。我们把这些 `visitXxx()` 方法进行精简，得到 4 个 `visitXxx()` 方法：

```java
public abstract class ClassVisitor {
    public void visit(
        final int version,
        final int access,
        final String name,
        final String signature,
        final String superName,
        final String[] interfaces);
    public FieldVisitor visitField( // 访问字段
        final int access,
        final String name,
        final String descriptor,
        final String signature,
        final Object value);
    public MethodVisitor visitMethod( // 访问方法
        final int access,
        final String name,
        final String descriptor,
        final String signature,
        final String[] exceptions);
    public void visitEnd();
    // ......
}
```

我们可以将这 4 个 `visitXxx()` 方法，与 Java ClassFile 进行比对，这样我们就能够理解“为什么会有这 4 个方法”以及“方法要接收参数的含义是什么”。

但是，`ClassVisitor` 类是一个抽象类，我们需要它的一个具体子类。这时候，就引出了 `ClassWriter` 类，它是 `ClassVisitor` 类的子类，继承了 `visitXxx()` 方法。同时，`ClassWriter` 类也定义了一个 `toByteArray()` 方法，它可以将 `visitXxx()` 方法执行后的结果转换成 `byte[]`。在创建 `ClassWriter(flags)` 对象的时候，对于 `flags` 参数，我们推荐使用 `ClassWriter.COMPUTE_FRAMES`。

使用 `ClassWriter` 生成一个 Class 文件，可以大致分成三个步骤：

- 第一步，创建 `ClassWriter` 对象。
- 第二步，调用 `ClassWriter` 对象的 `visitXxx()` 方法。
- 第三步，调用 `ClassWriter` 对象的 `toByteArray()` 方法。

示例代码如下：

```java
import org.objectweb.asm.ClassWriter;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldGenerateCore {
    public static byte[] dump () throws Exception {
        // (1) 创建 ClassWriter 对象
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (2) 调用 visitXxx() 方法
        cw.visit();
        cw.visitField();
        cw.visitMethod();
        cw.visitEnd();       // 注意，最后要调用 visitEnd() 方法

        // (3) 调用 toByteArray() 方法
        byte[] bytes = cw.toByteArray();
        return bytes;
    }
}
```

我们在介绍 Class Generation 示例的时候，直接使用 `ClassWriter` 类就可以了。但是，除了 `ClassVisitor` 和 `ClassWriter` 类，我们还需要更多的类来“丰富”这个类的“细节信息”，比如说 `FieldVisitor` 和 `MethodVisitor`，它们分别是为了“丰富”字段和方法的具体信息。

### FieldVisitor 和 MethodVisitor

在 `ClassVisitor` 类当中，`visitField()` 方法会返回一个 `FieldVisitor` 对象，`visitMethod()` 方法会返回一个 `MethodVisitor` 对象。其实，`FieldVisitor` 对象和 `MethodVisitor` 对象是为了让生成的字段和方法内容更“丰富、充实”。

相对来说，`FieldVisitor` 类比较简单，在刚开始学的时候，我们只需要关注它的 `visitEnd()` 方法就可以了。

相对来说，`MethodVisitor` 类就比较复杂，因为在调用 `ClassVisitor.visitMethod()` 方法的时候，只是说明了方法的名字、方法的参数类型、方法的描述符等信息，并没有说明方法的“方法体”信息，所以我们需要使用具体的 `MethodVisitor` 对象来实现具体的方法体。在 `MethodVisitor` 类当中，也定义了许多的 `visitXxx()` 方法。这里要注意一下，要注意与 `ClassVisitor` 类里定义的 `visitXxx()` 方法区分。`ClassVisitor` 类里的 `visitXxx()` 方法是提供类层面的信息，而 `MethodVisitor` 类里的 `visitXxx()` 方法是提供某一个具体方法里的信息。

`MethodVisitor` 类里的 `visitXxx()` 方法，也需要遵循一定的调用顺序，精简之后，如下：

```text
[
    visitCode
    (
        visitFrame |
        visitXxxInsn |
        visitLabel |
        visitTryCatchBlock
    )*
    visitMaxs
]
visitEnd
```

我们可以按照下面来记忆 `visitXxx()` 方法的调用顺序：

- 第一步，调用 `visitCode()` 方法，调用一次
- 第二步，调用 `visitXxxInsn()` 方法，可以调用多次。对这些方法的调用，就是在构建方法的“方法体”。
- 第三步，调用 `visitMaxs()` 方法，调用一次
- 第四步，调用 `visitEnd()` 方法，调用一次

---

> `ClassVisitor` 类里的 `visitXxx()` 方法需要遵循一定的调用顺序，`MethodVisitor` 类里的 `visitXxx()` 方法也需要遵循一定的调用顺序。

---

另外，我们也需要特别注意一些特殊的方法名字，例如，构造方法的名字是 `<init>`，而静态初始化方法的名字是 `<clinit>`。

我们在使用 `MethodVisitor` 来编写方法体的代码逻辑时，不可避免的会遇到程序逻辑 `true` 和 `false` 判断和执行流程的跳转，而 `Label` 在 ASM 代码中就标志着跳转的位置。借助于 `Label` 类，我们可以实现 if 语句、switch 语句、for 语句和 try-catch 语句。添加 label 位置，是通过 `MethodVisitor.visitLabel()` 方法实现的。

在 Java 6 之后，为了对方法的代码进行校验，于是就增加了 `StackMapTable` 属性。谈到 `StackMapTable` 属性，其实就是我们讲到的 frame，就是记录某一条 instruction 所对应的 local variables 和 operand stack 的状态。我们不推荐大家自己计算 frame，因此不推荐使用 `MethodVisitor.visitFrame()` 方法。

无论是 `Label` 类，还是 frame，它们都是 `MethodVisitor` 在实现“方法体”过程当中的“细节信息”，所以我们把这两者放到 `MethodVisitor` 一起来说明。



### 常量池去哪儿了？

有细心的同学，可能会发现这样的问题：在 ASM 当中，常量池去哪儿了？为什么没有常量池相关的类和方法呢？

其实，在 ASM 源码中，与常量池对应的是 `SymbolTable` 类，但我们并没有对它进行介绍。为什么没有介绍呢？

- 第一个原因，在调用 `ClassVisitor.visitXxx()` 方法和 `MethodVisitor.visitXxx()` 方法的过程中，ASM 会自动帮助我们去构建 `SymbolTable` 类里面具体的内容。
- 第二个原因，常量池中包含十几种具体的常量类型，内容多而复杂，需要结合 Java ClassFile 相关的知识才能理解。

我们的关注点还是在于如何使用 Core API 来进行 Class Generation 操作，ASM 的内部实现会帮助我们处理好 `SymbolTable` 类的内容。

## 总结

本文是对第二章的整体内容进行总结，大家可以从两方面进行把握：一个是 Java ClassFile 的格式是什么的，另一个就是 ASM Core API 里的具体类和方法的作用。
