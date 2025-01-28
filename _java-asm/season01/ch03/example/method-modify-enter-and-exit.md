---
title: "修改已有的方法（添加－进入和退出）"
sequence: "305"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## 预期目标

假如有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        System.out.println("this is a test method.");
    }
}
```

我们想实现的预期目标：对于 `test()` 方法，在“方法进入”时和“方法退出”时，添加一条打印语句。

第一种情况，在“方法进入”时，预期目标如下所示：

```java
public class HelloWorld {
    public void test() {
        System.out.println("Method Enter...");
        System.out.println("this is a test method.");
    }
}
```

第二种情况，在“方法退出”时，预期目标如下所示：

```java
public class HelloWorld {
    public void test() {
        System.out.println("this is a test method.");
        System.out.println("Method Exit...");
    }
}
```

现在，我们有了明确的预期目标；接下来，就是将这个预期目标转换成具体的 ASM 代码。那么，应该怎么实现呢？从哪里着手呢？

## 实现思路

我们知道，现在的内容是 Class Transformation 的操作，其中涉及到三个主要的类：`ClassReader`、`ClassVisitor` 和 `ClassWriter`。其中，`ClassReader` 负责读取 Class 文件，`ClassWriter` 负责生成 Class 文件，而具体的 `ClassVisitor` 负责进行 Transformation 的操作。换句话说，我们还是应该从 `ClassVisitor` 类开始。

第一步，回顾一下 `ClassVisitor` 类当中主要的 `visitXxx()` 方法有哪些。在 `ClassVisitor` 类当中，有 `visit()`、`visitField()`、`visitMethod()` 和 `visitEnd()` 方法；这些 `visitXxx()` 方法与 `.class` 文件里的不同部分之间是有对应关系的，如下图：

![](/assets/images/java/asm/class-visitor-visit-xxx-methods.png)

根据我们的预期目标，现在想要修改的是“方法”的部分，那么就对应着 `ClassVisitor` 类的 `visitMethod()` 方法。`ClassVisitor.visitMethod()` 会返回一个 `MethodVisitor` 类的实例；而 `MethodVisitor` 类就是用来生成方法的“方法体”。

第二步，回顾一下 `MethodVisitor` 类当中定义了哪些 `visitXxx()` 方法。

![](/assets/images/java/asm/method-visitor-visit-xxx-insn-methods.png)

在 `MethodVisitor` 类当中，定义的 `visitXxx()` 方法比较多，但是我们可以将这些 `visitXxx()` 方法进行分组：

- 第一组，`visitCode()` 方法，标志着方法体（method body）的开始。
- 第二组，`visitXxxInsn()` 方法，对应方法体（method body）本身，这里包含多个方法。
- 第三组，`visitMaxs()` 方法，标志着方法体（method body）的结束。
- 第四组，`visitEnd()` 方法，是最后调用的方法。

另外，我们也回顾一下，在 `MethodVisitor` 类中，`visitXxx()` 方法的调用顺序：

- 第一步，调用 `visitCode()` 方法，调用一次。
- 第二步，调用 `visitXxxInsn()` 方法，可以调用多次。
- 第三步，调用 `visitMaxs()` 方法，调用一次。
- 第四步，调用 `visitEnd()` 方法，调用一次。

到了这一步，我们基本上就知道了：需要修改的内容就位于 `visitCode()` 和 `visitMaxs()` 方法之间，这是一个大概的范围。

第三步，精确定位。也就是说，在 `MethodVisitor` 类当中，要确定出要在哪一个 `visitXxx()` 方法里进行修改。

### 方法进入

如果我们想在“方法进入”时，添加一些打印语句，那么我们有两个位置可以添加打印语句：

- 第一个位置，就是在 `visitCode()` 方法中。
- 第二个位置，就是在第 1 个 `visitXxxInsn()` 方法中。

在这两个位置当中，我们推荐使用 `visitCode()` 方法。因为 `visitCode()` 方法总是位于方法体（method body）的前面，而第 1 个 `visitXxxInsn()` 方法是不稳定的。

```text
public void visitCode() {
    // 首先，处理自己的代码逻辑
    // TODO: 添加“方法进入”时的代码

    // 其次，调用父类的方法实现
    super.visitCode();
}
```

### 方法退出

如果我们在“方法退出”时想添加的代码，是否可以添加到 `visitMaxs()` 方法内呢？这样做是不行的。因为在执行 `visitMaxs()` 方法之前，方法体（method body）已经执行过了：在方法体（method body）当中，里面会包含 return 语句；如果 return 语句一执行，后面的任何语句都不会再执行了；换句话说，如果在 `visitMaxs()` 方法内添加的打印输出语句，由于前面方法体（method body）中已经执行了 return 语句，后面的任何语句就执行不到了。

那么，到底是应该在哪里添加代码呢？为了回答这个问题，我们需要知道“方法退出”有哪几种情况。方法的退出，有两种情况，一种是正常退出（执行 return 语句），另一种是异常退出（执行 throw 语句）；接下来，就是将这两种退出情况应用到 ASM 的代码层面。

在 `MethodVisitor` 类当中，无论是执行 return 语句，还是执行 throw 语句，都是通过 `visitInsn(opcode)` 方法来实现的。所以，如果我们想在“方法退出”时，添加一些语句，那么这些语句放到 `visitInsn(opcode)` 方法中就可以了。

```text
public void visitInsn(int opcode) {
    // 首先，处理自己的代码逻辑
    if (opcode == Opcodes.ATHROW || (opcode >= Opcodes.IRETURN && opcode <= Opcodes.RETURN)) {
        // TODO: 添加“方法退出”时的代码
    }

    // 其次，调用父类的方法实现
    super.visitInsn(opcode);
}
```

---

我有一个编程的习惯：在编写 ASM 代码的时候，如果写了一个类，它继承自 `ClassVisitor`，那么就命名成 `XxxVisitor`；如果写了一个类，它继承自 `MethodVisitor`，那么就命名成 `XxxAdapter`。通过类的名字，我就可以区分出哪些类是继承自 `ClassVisitor`，哪些类是继承自 `MethodVisitor`。

---

## 示例一：方法进入

### 编码实现

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

public class MethodEnterVisitor extends ClassVisitor {
    public MethodEnterVisitor(int api, ClassVisitor classVisitor) {
        super(api, classVisitor);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        if (mv != null && !"<init>".equals(name)) {
            mv = new MethodEnterAdapter(api, mv);
        }
        return mv;
    }

    private static class MethodEnterAdapter extends MethodVisitor {
        public MethodEnterAdapter(int api, MethodVisitor methodVisitor) {
            super(api, methodVisitor);
        }

        @Override
        public void visitCode() {
            // 首先，处理自己的代码逻辑
            super.visitFieldInsn(Opcodes.GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            super.visitLdcInsn("Method Enter...");
            super.visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);

            // 其次，调用父类的方法实现
            super.visitCode();
        }
    }
}
```

在上面 `MethodEnterAdapter` 类的 `visitCode()` 方法中，主要是做两件事情：

- 首先，处理自己的代码逻辑。
- 其次，调用父类的方法实现。

在处理自己的代码逻辑中，有 3 行代码。这 3 条语句的作用就是添加 `System.out.println("Method Enter...");` 语句：

```text
super.visitFieldInsn(Opcodes.GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
super.visitLdcInsn("Method Enter...");
super.visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
```

注意，上面的代码中使用了 `super` 关键字。

事实上，在 `MethodVisitor` 类当中，定义了一个 `protected MethodVisitor mv;` 字段。我们也可以使用 `mv` 这个字段，代码也可以这样写：

```text
mv.visitFieldInsn(Opcodes.GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
mv.visitLdcInsn("Method Enter...");
mv.visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
```

但是这样写，可能会遇到 `mv` 为 `null` 的情况，这样就会出现 `NullPointerException` 异常。

如果使用 `super`，就会避免 `NullPointerException` 异常的情况。因为使用 `super` 的情况下，就是调用父类定义的方法，在本例中其实就是调用 `MethodVisitor` 类里定义的方法。在 `MethodVisitor` 类里的 `visitXxx()` 方法中，会先对 `mv` 进行是否为 `null` 的判断，所以就不会出现 `NullPointerException` 的情况。

```java
public abstract class MethodVisitor {
    protected MethodVisitor mv;

    public void visitCode() {
        if (mv != null) {
            mv.visitCode();
        }
    }

    public void visitInsn(final int opcode) {
        if (mv != null) {
            mv.visitInsn(opcode);
        }
    }

    public void visitIntInsn(final int opcode, final int operand) {
        if (mv != null) {
            mv.visitIntInsn(opcode, operand);
        }
    }

    public void visitVarInsn(final int opcode, final int var) {
        if (mv != null) {
            mv.visitVarInsn(opcode, var);
        }
    }

    public void visitFieldInsn(final int opcode, final String owner, final String name, final String descriptor) {
        if (mv != null) {
            mv.visitFieldInsn(opcode, owner, name, descriptor);
        }
    }

    // ......

    public void visitMaxs(final int maxStack, final int maxLocals) {
        if (mv != null) {
            mv.visitMaxs(maxStack, maxLocals);
        }
    }

    public void visitEnd() {
        if (mv != null) {
            mv.visitEnd();
        }
    }
}
```

### 进行转换

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

public class HelloWorldTransformCore {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        //（1）构建 ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建 ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连 ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new MethodEnterVisitor(api, cw);

        //（4）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成 byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

### 验证结果

```java
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Method m = clazz.getDeclaredMethod("test");

        Object instance = clazz.newInstance();
        m.invoke(instance);
    }
}
```

### 特殊情况：`<init>()` 方法

在 `.class` 文件中，`<init>()` 方法，就表示类当中的构造方法。

我们在“方法进入”时，有一个对于 `<init>` 的判断：

```text
if (mv != null && !"<init>".equals(name)) {
    // ......
}
```

为什么要对 `<init>()` 方法进行特殊处理呢？

> Java requires that if you call this() or super() in a constructor, it must be the first statement.

```java
public class HelloWorld {
    public HelloWorld() {
        System.out.println("Method Enter...");
        super(); // 报错：Call to 'super()' must be first statement in constructor body
    }
}
```

大家可以做个实践，就是去掉对于 `<init>()` 方法的判断，会发现它好像也是可以正常执行的。

但是，如果我们换一下添加的语句，就会出错了：

```text
super.visitFieldInsn(Opcodes.GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
super.visitVarInsn(Opcodes.ALOAD, 0);
super.visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/lang/Object", "toString", "()Ljava/lang/String;", false);
super.visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
```

## 示例二：方法退出

### 编码实现

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

public class MethodExitVisitor extends ClassVisitor {
    public MethodExitVisitor(int api, ClassVisitor classVisitor) {
        super(api, classVisitor);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        if (mv != null && !"<init>".equals(name)) {
            mv = new MethodExitAdapter(api, mv);
        }
        return mv;
    }

    private static class MethodExitAdapter extends MethodVisitor {
        public MethodExitAdapter(int api, MethodVisitor methodVisitor) {
            super(api, methodVisitor);
        }

        @Override
        public void visitInsn(int opcode) {
            // 首先，处理自己的代码逻辑
            if (opcode == Opcodes.ATHROW || (opcode >= Opcodes.IRETURN && opcode <= Opcodes.RETURN)) {
                super.visitFieldInsn(Opcodes.GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
                super.visitLdcInsn("Method Exit...");
                super.visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            }

            // 其次，调用父类的方法实现
            super.visitInsn(opcode);
        }
    }
}
```

### 进行转换

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

public class HelloWorldTransformCore {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        //（1）构建 ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建 ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连 ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new MethodExitVisitor(api, cw);

        //（4）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成 byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

### 验证结果

```java
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Method m = clazz.getDeclaredMethod("test");

        Object instance = clazz.newInstance();
        m.invoke(instance);
    }
}
```

输出结果：

```text
this is a test method.
Method Exit...
```

## 示例三：方法进入和方法退出

### 第一种方式

第一种方式，就是将多个 `ClassVisitor` 类串联起来。

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

public class HelloWorldTransformCore {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        //（1）构建 ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建 ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连 ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv1 = new MethodEnterVisitor(api, cw);
        ClassVisitor cv2 = new MethodExitVisitor(api, cv1);
        ClassVisitor cv = cv2;

        //（4）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成 byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

### 第二种方式

第二种方式，就是将所有的代码都放到一个 `ClassVisitor` 类里面。

编码实现：

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

public class MethodAroundVisitor extends ClassVisitor {
    public MethodAroundVisitor(int api, ClassVisitor classVisitor) {
        super(api, classVisitor);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        if (mv != null && !"<init>".equals(name)) {
            boolean isAbstractMethod = (access & Opcodes.ACC_ABSTRACT) == Opcodes.ACC_ABSTRACT;
            boolean isNativeMethod = (access & Opcodes.ACC_NATIVE) == Opcodes.ACC_NATIVE;
            if (!isAbstractMethod && !isNativeMethod) {
                mv = new MethodAroundAdapter(api, mv);
            }
        }
        return mv;
    }

    private static class MethodAroundAdapter extends MethodVisitor {
        public MethodAroundAdapter(int api, MethodVisitor methodVisitor) {
            super(api, methodVisitor);
        }

        @Override
        public void visitCode() {
            // 首先，处理自己的代码逻辑
            super.visitFieldInsn(Opcodes.GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            super.visitLdcInsn("Method Enter...");
            super.visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);

            // 其次，调用父类的方法实现
            super.visitCode();
        }

        @Override
        public void visitInsn(int opcode) {
            // 首先，处理自己的代码逻辑
            if (opcode == Opcodes.ATHROW || (opcode >= Opcodes.IRETURN && opcode <= Opcodes.RETURN)) {
                super.visitFieldInsn(Opcodes.GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
                super.visitLdcInsn("Method Exit...");
                super.visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            }

            // 其次，调用父类的方法实现
            super.visitInsn(opcode);
        }
    }
}
```

进行转换：

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

public class HelloWorldTransformCore {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        //（1）构建 ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建 ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连 ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new MethodAroundVisitor(api, cw);

        //（4）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成 byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

## 总结

本文主要是对“方法进入”和“方法退出”添加代码进行介绍，内容总结如下：

- 第一点，在“方法进入”时和“方法退出”时添加代码，应该如何实现？
    - 在“方法进入”时添加代码，是在 `visitCode()` 方法当中完成；
    - 在“方法退出”添加代码时，是在 `visitInsn(opcode)` 方法中，判断 `opcode` 为 return 或 throw 的情况下完成。
- 第二点，在“方法进入”时和“方法退出”时添加代码，有一些特殊的情况，需要小心处理：
    - 接口，是否需要处理？接口当中的抽象方法没有方法体，但也可能有带有方法体的 default 方法。
    - 带有特殊修饰符的方法：
        - 抽象方法，是否需要处理？不只是接口当中有抽象方法，抽象类里也可能有抽象方法。抽象方法，是没有方法体的。
        - native 方法，是否需要处理？ native 方法是没有方法体的。
    - 名字特殊的方法，例如，构造方法（`<init>()`）和静态初始化方法（`<clinit>()`），是否需要处理？

另外，在编写代码的时候，我们遵循一个“规则”：如果是 `ClassVisitor` 的子类，就取名为 `XxxVisitor` 类；如果是 `MethodVisitor` 的子类，就取名为 `XxxAdapter` 类。

在后续的内容中，我们会介绍 `AdviceAdapter` 类，它能很容易帮助我们在“方法进入”时和“方法退出”时添加代码。
那么，这就带来有一个问题，既然使用 `AdviceAdapter` 类实现起来很容易，那么为什么还要讲本文的实现方式呢？有两个原因。

- 第一个原因，本文的介绍方式侧重于让大家理解“工作原理”，而 `AdviceAdapter` 则侧重于“应用”，`AdviceAdapter` 的实现也是基于 `visitCode()` 和 `visitInsn(opcode)` 方法实现的，在理解上有一个步步递进的关系。
- 第二个原因，虽然 `AdviceAdapter` 在“方法进入”时和“方法退出”时添加代码比较容易，大多数情况，都是能正常工作，但也有极其特殊的情况下，它会失败。这个时候，我们还是要回归到本文介绍的实现方式。
