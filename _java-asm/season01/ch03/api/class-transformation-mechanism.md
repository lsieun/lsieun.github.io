---
title: "Class Transformation 的原理"
sequence: "303"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## Class-Reader/Visitor/Writer

我们使用 `ClassReader`、`ClassVisitor` 和 `ClassWriter` 类来进行 Class Transformation 操作的整体思路是这样的：

```text
ClassReader --> ClassVisitor(1) --> ... --> ClassVisitor(N) --> ClassWriter
```

其中，`ClassReader` 类负责“读”Class，`ClassWriter` 负责“写”Class，而 `ClassVisitor` 则负责进行“转换”（Transformation）。在 Class Transformation 过程中，可以有多个 `ClassVisitor` 参与。不过要注意，`ClassVisitor` 类是一个抽象类，我们需要写代码来实现一个 `ClassVisitor` 类的子类才能使用。

![ASM Core Classes](/assets/images/java/asm/asm-core-classes.png)

为了解释清楚 Class Transformation 是如何工作的，我们从两个问题来入手：

- 第一个问题，在编写代码的时候（程序未运行），`ClassReader`、`ClassVisitor` 和 `ClassWriter` 三个类的实例之间，是如何建立联系的？
- 第二个问题，在执行代码的时候（程序开始运行），类内部 `visitXxx()` 方法的调用顺序是什么样的？


### 建立联系

我们在进行 Class Transformation 操作时，一般是这样写代码的：

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Opcodes;

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
        ClassVisitor cv1 = new ClassVisitor1(api, cw);
        ClassVisitor cv2 = new ClassVisitor2(api, cv1);
        // ...
        ClassVisitor cvn = new ClassVisitorN(api, cvm);

        //（4）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cvn, parsingOptions);

        //（5）生成 byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

#### ClassReader-ClassVisitor

第一步，将 `ClassReader` 类与 `ClassVisitor` 类建立联系是通过 `ClassReader.accept()` 方法实现的。

```text
public void accept(ClassVisitor classVisitor, int parsingOptions)
```

在 `accept()` 方法中，`ClassReader` 类会不断调用 `ClassVisitor` 类当中的 `visitXxx()` 方法。

```text
public void accept(ClassVisitor classVisitor, int parsingOptions) {
    //......
    classVisitor.visit(readInt(cpInfoOffsets[1] - 7), accessFlags, thisClass, signature, superClass, interfaces);
    //...

    // Visit the fields and methods.
    int fieldsCount = readUnsignedShort(currentOffset);
    currentOffset += 2;
    while (fieldsCount-- > 0) {
        currentOffset = readField(classVisitor, context, currentOffset);
    }

    int methodsCount = readUnsignedShort(currentOffset);
    currentOffset += 2;
    while (methodsCount-- > 0) {
        currentOffset = readMethod(classVisitor, context, currentOffset);
    }

    // Visit the end of the class.
    classVisitor.visitEnd();
}
```

#### ClassVisitor-ClassVisitor

第二步，就是将一个 `ClassVisitor` 类与另一个 `ClassVisitor` 类建立联系。因为在进行 Class Transformation 的过程中，可能需要多个 `ClassVisitor` 类的参与。

当前 `ClassVisitor` 类与下一个 `ClassVisitor` 类建立初步联系（或外部联系，指一个类与另一个类之间的联系），是通过构造方法来实现的：

```java
public abstract class ClassVisitor {
    protected final int api;
    protected ClassVisitor cv;

    public ClassVisitor(final int api, final ClassVisitor classVisitor) {
        this.api = api;
        this.cv = classVisitor;
    }
}
```

当前 `ClassVisitor` 类与下一个 `ClassVisitor` 类建立后续联系（或内部联系，指字段、方法等层面的联系），是通过调用 `visitXxx()` 方法来实现的：

```java
public abstract class ClassVisitor {
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        if (cv != null) {
            cv.visit(version, access, name, signature, superName, interfaces);
        }
    }

    public FieldVisitor visitField(int access, String name, String descriptor, String signature, Object value) {
        if (cv != null) {
            return cv.visitField(access, name, descriptor, signature, value);
        }
        return null;
    }

    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        if (cv != null) {
            return cv.visitMethod(access, name, descriptor, signature, exceptions);
        }
        return null;
    }

    public void visitEnd() {
        if (cv != null) {
            cv.visitEnd();
        }
    }
}
```

#### ClassVisitor-ClassWriter

第三步，就是将一个 `ClassVisitor` 类与一个 `ClassWriter` 类建立联系。由于 `ClassWriter` 类是继承自 `ClassVisitor` 类，所以第三步的原理和第二步的原理是一样的。不过，`ClassWriter` 类是一个特殊的 `ClassVisitor` 类，它的主要作用是得到一个符合 ClassFile 结构的字节数组（`byte[]`）。

### 执行顺序

对于 Class Transformation 来说，它具体的代码执行顺序如下图所示：

![class transformation sequence diagram](/assets/images/java/asm/class-transformation-sequence-diagram.png)

为了方便理解代码的执行顺序，我们也结合生活当中的一些经验，来进行这样的类比：在生活当中，天下降下了雨水，这些雨水会慢慢的向下渗透，穿过不同的地层，最后形成地下水；这种“雨水向下渗透，穿过不同地层”的形式，它与多个 `ClassVisitor` 对象调用同名的 `visitXxx()` 方法是非常相似的。

![ 地层 ](/assets/images/java/asm/stratum.jpg)


- 第一步，可以将 `ClassReader` 类想像成最上面的土层
- 第二步，可以将 `ClassWriter` 类想像成最下面的土层
- 第三步，可以将 `ClassVisitor` 类想像成中间的多个土层

当调用 `visitXxx()` 方法的时，就像水在多个土层之间渗透：由最上面的 `ClassReader`“土层”开始，经历一个一个的 `ClassVisitor` 中间“土层”，最后进入最下面的 `ClassWriter`“土层”。

### 执行顺序的代码演示

为了查看代码的执行顺序，我们可以添加一个自定义的 `ClassVisitor` 类。在这个类当中，我们可以添加一些打印语句，将类名、方法名以及方法的接收的参数都打印出来，这样我们就能知道代码的执行过程了。

首先，我们来定义一个 `InfoClassVisitor` 类，它继承自 `ClassVisitor`；在 `InfoClassVisitor` 类当中，我们只打印了 `visit()`、`visitField()`、`visitMethod()` 和 `visitEnd()` 这 4 个方法的信息。

- 在 `visitField()` 方法中，我们自定义了一个 `InfoFieldVisitor` 对象
- 在 `visitMethod()` 方法中，我们也自定义了一个 `InfoMethodVisitor` 对象

另外，在 `InfoClassVisitor` 类当中，也定义了一个 `getAccess()` 方法，为了简便，我们只判断了 `public`、`protected` 和 `private` 标识符。大家可以根据自己的兴趣，来对这个类进行扩展。

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.FieldVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class InfoClassVisitor extends ClassVisitor {
    public InfoClassVisitor(int api, ClassVisitor classVisitor) {
        super(api, classVisitor);
    }

    @Override
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        String line = String.format("ClassVisitor.visit(%d, %s, %s, %s, %s, %s);", 
                                    version, getAccess(access), name, signature, superName, Arrays.toString(interfaces));
        System.out.println(line);
        super.visit(version, access, name, signature, superName, interfaces);
    }

    @Override
    public FieldVisitor visitField(int access, String name, String descriptor, String signature, Object value) {
        String line = String.format("ClassVisitor.visitField(%s, %s, %s, %s, %s);", 
                                    getAccess(access), name, descriptor, signature, value);
        System.out.println(line);

        FieldVisitor fv = super.visitField(access, name, descriptor, signature, value);
        return new InfoFieldVisitor(api, fv);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        String line = String.format("ClassVisitor.visitMethod(%s, %s, %s, %s, %s);",
                                    getAccess(access), name, descriptor, signature, exceptions);
        System.out.println(line);

        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        return new InfoMethodVisitor(api, mv);
    }

    @Override
    public void visitEnd() {
        String line = String.format("ClassVisitor.visitEnd();");
        System.out.println(line);
        super.visitEnd();
    }

    private String getAccess(int access) {
        List<String> list = new ArrayList<>();
        if ((access & Opcodes.ACC_PUBLIC) != 0) {
            list.add("ACC_PUBLIC");
        }
        else if ((access & Opcodes.ACC_PROTECTED) != 0) {
            list.add("ACC_PROTECTED");
        }
        else if ((access & Opcodes.ACC_PRIVATE) != 0) {
            list.add("ACC_PRIVATE");
        }
        return list.toString();
    }
}
```

接着，是 `InfoFieldVisitor` 类，它继承自 `FieldVisitor` 类。这个类很简单，它只打印其中的 `visitEnd()` 方法。

```java
import org.objectweb.asm.FieldVisitor;

public class InfoFieldVisitor extends FieldVisitor {
    public InfoFieldVisitor(int api, FieldVisitor fieldVisitor) {
        super(api, fieldVisitor);
    }

    @Override
    public void visitEnd() {
        String line = String.format("    FieldVisitor.visitEnd();");
        System.out.println(line);
        super.visitEnd();
    }
}
```

再接下来，是 `InfoMethodVisitor` 类，它继承自 `MethodVisitor` 类。在这个类当中，需要打印的方法比较多，但是这些方法分为 4 个类型：

- `visitCode()`
- `visitXxxInsn()`
- `visitMaxs()`
- `visitEnd()`

```java
import org.objectweb.asm.Label;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.util.Printer;

public class InfoMethodVisitor extends MethodVisitor {
    public InfoMethodVisitor(int api, MethodVisitor methodVisitor) {
        super(api, methodVisitor);
    }

    @Override
    public void visitCode() {
        String line = String.format("    MethodVisitor.visitCode();");
        System.out.println(line);
        super.visitCode();
    }

    @Override
    public void visitInsn(int opcode) {
        String line = String.format("    MethodVisitor.visitInsn(%s);", Printer.OPCODES[opcode]);
        System.out.println(line);
        super.visitInsn(opcode);
    }

    @Override
    public void visitIntInsn(int opcode, int operand) {
        String line = String.format("    MethodVisitor.visitIntInsn(%s, %s);", Printer.OPCODES[opcode], operand);
        System.out.println(line);
        super.visitIntInsn(opcode, operand);
    }

    @Override
    public void visitVarInsn(int opcode, int var) {
        String line = String.format("    MethodVisitor.visitVarInsn(%s, %s);", Printer.OPCODES[opcode], var);
        System.out.println(line);
        super.visitVarInsn(opcode, var);
    }

    @Override
    public void visitTypeInsn(int opcode, String type) {
        String line = String.format("    MethodVisitor.visitTypeInsn(%s, %s);", Printer.OPCODES[opcode], type);
        System.out.println(line);
        super.visitTypeInsn(opcode, type);
    }

    @Override
    public void visitFieldInsn(int opcode, String owner, String name, String descriptor) {
        String line = String.format("    MethodVisitor.visitFieldInsn(%s, %s, %s, %s);",
                                    Printer.OPCODES[opcode], owner, name, descriptor);
        System.out.println(line);
        super.visitFieldInsn(opcode, owner, name, descriptor);
    }

    @Override
    public void visitMethodInsn(int opcode, String owner, String name, String descriptor, boolean isInterface) {
        String line = String.format("    MethodVisitor.visitMethodInsn(%s, %s, %s, %s, %s);",
                                    Printer.OPCODES[opcode], owner, name, descriptor, isInterface);
        System.out.println(line);
        super.visitMethodInsn(opcode, owner, name, descriptor, isInterface);
    }

    @Override
    public void visitJumpInsn(int opcode, Label label) {
        String line = String.format("    MethodVisitor.visitJumpInsn(%s, %s);", Printer.OPCODES[opcode], label);
        System.out.println(line);
        super.visitJumpInsn(opcode, label);
    }

    @Override
    public void visitLabel(Label label) {
        String line = String.format("    MethodVisitor.visitLabel(%s);", label);
        System.out.println(line);
        super.visitLabel(label);
    }

    @Override
    public void visitLdcInsn(Object value) {
        String line = String.format("    MethodVisitor.visitLdcInsn(%s);", value);
        System.out.println(line);
        super.visitLdcInsn(value);
    }

    @Override
    public void visitIincInsn(int var, int increment) {
        String line = String.format("    MethodVisitor.visitIincInsn(%s, %s);", var, increment);
        System.out.println(line);
        super.visitIincInsn(var, increment);
    }

    @Override
    public void visitMaxs(int maxStack, int maxLocals) {
        String line = String.format("    MethodVisitor.visitMaxs(%s, %s);", maxStack, maxLocals);
        System.out.println(line);
        super.visitMaxs(maxStack, maxLocals);
    }

    @Override
    public void visitEnd() {
        String line = String.format("    MethodVisitor.visitEnd();");
        System.out.println(line);
        super.visitEnd();
    }
}
```

现在，准备工作已经做好了，我们只需要将自定义的 `InfoClassVisitor` 类加入到 Class Transformation 的过程中就可以了：

```java
import lsieun.core.info.InfoClassVisitor;
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
        ClassVisitor cv = new InfoClassVisitor(api, cw);

        //（4）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成 byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

准备一个示例代码：

```java
public class HelloWorld {
    public int intValue;
    public String strValue;

    public int add(int a, int b) {
        return a + b;
    }

    public int sub(int a, int b) {
        return a - b;
    }
}
```

输出结果：

```text
ClassVisitor.visit(52, [ACC_PUBLIC], sample/HelloWorld, null, java/lang/Object, []);
ClassVisitor.visitField([ACC_PUBLIC], intValue, I, null, null);
    FieldVisitor.visitEnd();
ClassVisitor.visitField([ACC_PUBLIC], strValue, Ljava/lang/String;, null, null);
    FieldVisitor.visitEnd();
ClassVisitor.visitMethod([ACC_PUBLIC], <init>, ()V, null, null);
    MethodVisitor.visitCode();
    MethodVisitor.visitVarInsn(ALOAD, 0);
    MethodVisitor.visitMethodInsn(INVOKESPECIAL, java/lang/Object, <init>, ()V, false);
    MethodVisitor.visitInsn(RETURN);
    MethodVisitor.visitMaxs(1, 1);
    MethodVisitor.visitEnd();
ClassVisitor.visitMethod([ACC_PUBLIC], add, (II)I, null, null);
    MethodVisitor.visitCode();
    MethodVisitor.visitVarInsn(ILOAD, 1);
    MethodVisitor.visitVarInsn(ILOAD, 2);
    MethodVisitor.visitInsn(IADD);
    MethodVisitor.visitInsn(IRETURN);
    MethodVisitor.visitMaxs(2, 3);
    MethodVisitor.visitEnd();
ClassVisitor.visitMethod([ACC_PUBLIC], sub, (II)I, null, null);
    MethodVisitor.visitCode();
    MethodVisitor.visitVarInsn(ILOAD, 1);
    MethodVisitor.visitVarInsn(ILOAD, 2);
    MethodVisitor.visitInsn(ISUB);
    MethodVisitor.visitInsn(IRETURN);
    MethodVisitor.visitMaxs(2, 3);
    MethodVisitor.visitEnd();
ClassVisitor.visitEnd();
```

## 串联的 Field/MethodVisitors

经过上面内容的讲解，相信大家已经了解到多个 `ClassVisitor` 之间是相互连接的，或者说是串联到一起的。

![ 多个 ClassVisitor 串联到一起 ](/assets/images/java/asm/multiple-class-vistors-connected.png)

其实，还有一些“细微之处”的连接，我们也要注意到：不同 `ClassVisitor` 对象里，对应同一个字段的多个 `FieldVisitor` 对象，也是串联到一起；不同 `ClassVisitor` 对象里，对应同一个方法的多个 `MethodVisitor` 对象，也是串联到一起，如下图所示。

![ 多个 FieldVisitor 和 MethodVisitor 串联到一起 ](/assets/images/java/asm/multiple-field-method-vistors-connected.png)

我们在讲删除“字段”和删除“方法”的时候，就是其中的某一个 `FieldVisitor` 或 `MethodVisitor` 不工作了，也就是不向后“传递数据”了，那么，相应的“字段”和“方法”就丢失了，就达到了“删除”的效果。类似的，添加“字段”和“方法”，其实就是“传递了额外的数据”，那么就会出现新的字段和方法，就达到了添加字段和方法的效果。

## Class Transformation 的本质

对于 Class Transformation 来说，它的本质就是“中间人攻击”（Man-in-the-middle attack）。

在 [Wiki](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) 当中，是这样描述 Man-in-the-middle attack 的：

> In cryptography and computer security, a man-in-the-middle(MITM) attack is a cyberattack where the attacker secretly relays and possibly alters the communications between two parties who believe that they are directly communicating with each other.

![Man-in-the-middle attack](/assets/images/network/man-in-the-middle-attack.png)

在计算机安全领域，我们应该尽量的避免遭受到“中间人攻击”，这样我们的信息就不会被窃取和篡改。但是，在 Java ASM 当中，Class Transformation 的本质就是利用了“中间人攻击”的方式来实现对已有的 Class 文件进行修改或转换。

更详细的来说，我们自己定义的 `ClassVisitor` 类就是一个“中间人”，那么这个“中间人”可以做什么呢？可以做三种类型的事情：

- 对“原有的信息”进行篡改，就可以实现“修改”的效果。对应到 ASM 代码层面，就是对 `ClassVisitor.visitXxx()` 和 `MethodVisitor.visitXxx()` 的参数值进行修改。
- 对“原有的信息”进行扔掉，就可以实现“删除”的效果。对应到 ASM 代码层面，将原本的 `FieldVisitor` 和 `MethodVisitor` 对象实例替换成 `null` 值，或者对原本的一些 `ClassVisitor.visitXxx()` 和 `MethodVisitor.visitXxx()` 方法不去调用了。
- 伪造一条“新的信息”，就可以实现“添加”的效果。对应到 ASM 代码层面，就是在原来的基础上，添加一些对于 `ClassVisitor.visitXxx()` 和 `MethodVisitor.visitXxx()` 方法的调用。

## 总结

本文主要对 Class Transformation 的工作原理进行介绍，内容总结如下：

- 第一点，在代码开始执行之前，`ClassReader`、`ClassVisitor` 和 `ClassWriter` 这三者之间是如何建立最初的联系的。例如，`ClassReader` 与 `ClassVisitor` 建立联系是通过 `ClassReader.accept()` 方法来实现的；而 `ClassVisitor` 与 `ClassWriter` 建立联系是通过 `ClassVisitor` 的构造方法来建立联系的。
- 第二点，在代码的执行过程中，其中涉及到 `ClassVisitor.visitXxx()` 和 `MethodVisitor.visitXxx()` 方法的执行顺序是什么样的。
- 第三点，在进行 Class Transformation 的过程中，内在的多个 FieldVisitor 和 MethodVisitor 是串联到一起的。
- 第四点，Class Transformation 的本质就是“中间人攻击”（Man-in-the-middle attack）。
