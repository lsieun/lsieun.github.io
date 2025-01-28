---
title: "Tree Based Class Transformation"
sequence: "301"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## Core Based Class Transformation

在Core API当中，使用`ClassReader`、`ClassVisitor`和`ClassWriter`类来进行Class Transformation操作的整体思路是这样的：

```text
ClassReader --> ClassVisitor(1) --> ... --> ClassVisitor(N) --> ClassWriter
```

在这些类当中，它们有各自的职责：

- `ClassReader`类负责“读”Class。
- `ClassWriter`类负责“写”Class。
- `ClassVisitor`类负责进行“转换”（Transformation）。

因此，我们可以说，`ClassVisitor`类是Class Transformation的核心操作。

## Class Transformation的本质

对于Class Transformation来说，它的本质就是“中间人攻击”（Man-in-the-middle attack）。

在[Wiki](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)当中，是这样描述Man-in-the-middle attack的：

> In cryptography and computer security, a man-in-the-middle(MITM) attack is a cyberattack where the attacker secretly relays and possibly alters the communications between two parties who believe that they are directly communicating with each other.

![Man-in-the-middle attack](/assets/images/network/man-in-the-middle-attack.png)

## Tree Based Class Transformation

首先，思考一个问题：基于Tree API的Class Transformation要怎么进行呢？它是要完全开发一套全新的处理流程，还是利用已有的Core API的Class Transformation流程呢？

回答：要实现Tree API的Class Transformation，Java ASM利用了已有的Core API的Class Transformation流程。

```text
ClassReader --> ClassVisitor(1) --> ... --> ClassNode(M) --> ... --> ClassVisitor(N) --> ClassWriter
```

因为`ClassNode`类（Tree API）是继承自`ClassVisitor`类（Core API），因此这里的处理流程和上面的处理流程本质上一样的。

虽然处理流程本质上是一样的，但是还有三个具体的技术细节需要处理：

- 第一个，如何将Core API（`ClassReader`和`ClassVisitor`）转换成Tree API（`ClassNode`）。
- 第二个，如何将Tree API（`ClassNode`）转换成Core API（`ClassVisitor`和`ClassWriter`）。
- 第三个，如何对`ClassNode`进行转换。

### 从Core API到Tree API

从Core API到Tree API的转换，有两种情况。

第一种情况，将`ClassReader`类转换成`ClassNode`类，要依赖于`ClassReader`的`accept(ClassVisitor)`方法：

```text
ClassNode cn = new ClassNode(Opcodes.ASM9);

ClassReader cr = new ClassReader(bytes);
int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
cr.accept(cn, parsingOptions);
```

第二种情况，将`ClassVisitor`类转换成`ClassNode`类，要依赖于`ClassVisitor`的构造方法：

```text
int api = Opcodes.ASM9;
ClassNode cn = new ClassNode();
ClassVisitor cv = new XxxClassVisitor(api, cn);
```

### 从Tree API到Core API

从Tree API到Core API的转换，要依赖于`ClassNode`的`accept(ClassVisitor)`方法：

```text
ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
cn.accept(cw);
```

### 如何对ClassNode进行转换

对`ClassNode`对象实例进行转换，其实就是对其字段的值进行修改。

#### 第一个版本

首先，我们来看第一个版本，就是在拿到`ClassNode cn`之后，直接对`cn`里的字段值进行修改。

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.ClassNode;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);
        if (bytes1 == null) {
            throw new RuntimeException("bytes1 is null");
        }
        
        // (1)构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        // (2) 构建ClassNode
        int api = Opcodes.ASM9;
        ClassNode cn = new ClassNode(api);
        cr.accept(cn, ClassReader.SKIP_FRAMES | ClassReader.SKIP_DEBUG);

        // (3) 进行transform
        cn.interfaces.add("java/lang/Cloneable");

        // (4) 构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
        cn.accept(cw);

        // (5) 生成byte[]内容输出
        byte[] bytes2 = cw.toByteArray();
        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

这个版本有点“鲁莽”和“原始”，如果进行变换的内容复杂，代码就会变得很“臃肿”，缺少一点面向对象的“美”。那么，怎么改进呢？

#### 第二个版本

在第二个版本中，我们就引入一个`ClassTransformer`类，它的作用就是将“需要进行的变换”封装成一个“类”。

```java
import org.objectweb.asm.tree.ClassNode;

public class ClassTransformer {
    protected ClassTransformer ct;

    public ClassTransformer(ClassTransformer ct) {
        this.ct = ct;
    }

    public void transform(ClassNode cn) {
        if (ct != null) {
            ct.transform(cn);
        }
    }
}
```

对于`ClassTransformer`类，我们主要理解两点内容：

- 第一点，`transform()`方法是主要的关注点，它的作用是对某一个`ClassNode`对象进行转换。
- 第二点，`ct`字段是次要的关注点，它的作用是将多个`ClassTransformer`对象连接起来，这就能够对某一个`ClassNode`对象进行连续多次处理。

代码片段：

```text
// (1)构建ClassReader
ClassReader cr = new ClassReader(bytes1);

// (2) 构建ClassNode
int api = Opcodes.ASM9;
ClassNode cn = new ClassNode(api);
cr.accept(cn, ClassReader.SKIP_FRAMES | ClassReader.SKIP_DEBUG);

// (3) 进行transform
ClassTransformer ct = ...;
ct.transform(cn);

// (4) 构建ClassWriter
ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
cn.accept(cw);

// (5) 生成byte[]内容输出
byte[] bytes2 = cw.toByteArray();
```

完整代码示例：

```java
import lsieun.asm.tree.transformer.ClassAddFieldTransformer;
import lsieun.asm.tree.transformer.ClassAddMethodTransformer;
import lsieun.asm.tree.transformer.ClassTransformer;
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.InsnList;
import org.objectweb.asm.tree.InsnNode;
import org.objectweb.asm.tree.MethodNode;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);
        if (bytes1 == null) {
            throw new RuntimeException("bytes1 is null");
        }

        // (1)构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        // (2) 构建ClassNode
        int api = Opcodes.ASM9;
        ClassNode cn = new ClassNode(api);
        cr.accept(cn, ClassReader.SKIP_FRAMES | ClassReader.SKIP_DEBUG);

        // (3) 进行transform
        ClassTransformer ct1 = new ClassAddFieldTransformer(null, Opcodes.ACC_PUBLIC, "intValue", "I");
        ClassTransformer ct2 = new ClassAddMethodTransformer(ct1, Opcodes.ACC_PUBLIC, "abc", "()V") {
            @Override
            protected void generateMethodBody(MethodNode mn) {
                InsnList il = mn.instructions;
                il.add(new InsnNode(Opcodes.RETURN));
                mn.maxStack = 0;
                mn.maxLocals = 1;
            }
        };
        ct2.transform(cn);

        // (4) 构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
        cn.accept(cw);

        // (5) 生成byte[]内容输出
        byte[] bytes2 = cw.toByteArray();
        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

第二个版本，其实挺好的，但是仍然有改进的余地，就是“学会内敛”。“学会内敛”是什么意思呢？我们结合生活当中的例子来说一下，有一句话叫“腹有诗书气自华”。
如果你有才华，但到处卖弄，会非常招人讨厌；但如果你将才华藏于自身，不轻易示人，这样你的才华就会体现你的气质中。

那么，应该怎么进一步改进呢？在ASM的官方文档（[asm4-guide.pdf](https://asm.ow2.io/asm4-guide.pdf)）提出了两种Common Patterns。

## Two Common Patterns

### First Pattern

The first pattern uses inheritance:

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.tree.ClassNode;

public class MyClassNode extends ClassNode {
    public MyClassNode(int api, ClassVisitor cv) {
        super(api);
        this.cv = cv;
    }

    @Override
    public void visitEnd() {
        // 首先，处理自己的代码逻辑
        // put your transformation code here
        // 使用ClassTransformer进行转换

        // 其次，调用父类的方法实现（根据实际情况，选择保留，或删除）
        super.visitEnd();

        // 最后，向后续ClassVisitor传递
        if (cv != null) {
            accept(cv);
        }
    }
}
```

那么，可以对`MyClassNode`按如下思路进行使用：

```text
// (1)构建ClassReader
ClassReader cr = new ClassReader(bytes1);

// (2)构建ClassWriter
ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

// (3)串连ClassNode
int api = Opcodes.ASM9;
ClassNode cn = new MyClassNode(api, cw);

//（4）结合ClassReader和ClassNode
int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
cr.accept(cn, parsingOptions);

// (5) 生成byte[]
byte[] bytes2 = cw.toByteArray();
```

### Second Pattern

The second pattern uses delegation instead of inheritance:

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.tree.ClassNode;

public class MyClassVisitor extends ClassVisitor {
    private final ClassVisitor next;

    public MyClassVisitor(int api, ClassVisitor classVisitor) {
        super(api, new ClassNode());    // 注意一：这里创建了一个ClassNode对象
        this.next = classVisitor;
    }

    @Override
    public void visitEnd() {
        // 首先，处理自己的代码逻辑
        ClassNode cn = (ClassNode) cv;    // 注意二：这里获取的是上面创建的ClassNode对象
        // put your transformation code here
        // 使用ClassTransformer进行转换

        // 其次，调用父类的方法实现（根据实际情况，选择保留，或删除）
        super.visitEnd();

        // 最后，向后续ClassVisitor传递
        if (next != null) {
            cn.accept(next);
        }
    }
}
```

那么，可以对`MyClassVisitor`按如下思路进行使用：

```text
//（1）构建ClassReader
ClassReader cr = new ClassReader(bytes1);

//（2）构建ClassWriter
ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

//（3）串连ClassVisitor
int api = Opcodes.ASM9;
ClassVisitor cv = new MyClassVisitor(api, cw);

//（4）结合ClassReader和ClassVisitor
int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
cr.accept(cv, parsingOptions);

//（5）生成byte[]
byte[] bytes2 = cw.toByteArray();
```

## 总结

本文内容总结如下：

- 第一点，介绍Core Based Class Transformation的处理流程是什么。
- 第二点，Class Transformation的本质是什么。（中间人攻击）
- 第三点，Tree Based Class Transformation是利用了已有的Core API处理流程，在过程中需要解决三个技术细节问题：
  - 第一个问题，如何将Core API转换成Tree API
  - 第二个问题，如何将Tree API转换成Core API
  - 第三个问题，如何对`ClassNode`类进行转换
- 第四点，使用Tree API进行Class Transformation的两种Pattern是什么。

在刚接触Tree Based Class Transformation的时候，可能不知道如何开始着手，我们可以按下面的步骤来进行思考：

- 第一步，读取具体的`.class`文件，是使用`ClassReader`类，它属于Core API的内容。
- 第二步，思考如何将Core API转换成Tree API。
- 第三步，思考如何使用Tree API进行Class Transformation操作。
- 第四步，思考如何将Tree API转换成Core API。
- 第五步，最后落实到`ClassWriter`类，调用其`toByteArray()`方法来生成`byte[]`内容。
