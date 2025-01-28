---
title: "修改已有的方法（添加－进入和退出－打印方法参数和返回值）"
sequence: "306"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## 预期目标

假如有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public int test(String name, int age, long idCard, Object obj) {
        int hashCode = 0;
        hashCode += name.hashCode();
        hashCode += age;
        hashCode += (int) (idCard % Integer.MAX_VALUE);
        hashCode += obj.hashCode();
        return hashCode;
    }
}
```

我们想实现的预期目标：打印出“方法接收的参数值”和“方法的返回值”。

```java
public class HelloWorld {
    public int test(String name, int age, long idCard, Object obj) {
        System.out.println(name);
        System.out.println(age);
        System.out.println(idCard);
        System.out.println(obj);
        int hashCode = 0;
        hashCode += name.hashCode();
        hashCode += age;
        hashCode += (int) (idCard % Integer.MAX_VALUE);
        hashCode += obj.hashCode();
        System.out.println(hashCode);
        return hashCode;
    }
}
```

实现这个功能的思路：在“方法进入”的时候，打印出“方法接收的参数值”；在“方法退出”的时候，打印出“方法的返回值”。

## 第一个版本

我们要实现的第一个版本是比较简单的，它是在 `MethodAroundVisitor` 类基础上直接修改得到的。

### 编码实现

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

import static org.objectweb.asm.Opcodes.*;

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

    private class MethodAroundAdapter extends MethodVisitor {
        public MethodAroundAdapter(int api, MethodVisitor methodVisitor) {
            super(api, methodVisitor);
        }

        @Override
        public void visitCode() {
            // 首先，处理自己的代码逻辑
            super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            super.visitVarInsn(ALOAD, 1);
            super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            super.visitVarInsn(ILOAD, 2);
            super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(I)V", false);
            super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            super.visitVarInsn(LLOAD, 3);
            super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(J)V", false);
            super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            super.visitVarInsn(ALOAD, 5);
            super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/Object;)V", false);

            // 其次，调用父类的方法实现
            super.visitCode();
        }

        @Override
        public void visitInsn(int opcode) {
            // 首先，处理自己的代码逻辑
            if (opcode == Opcodes.ATHROW || (opcode >= Opcodes.IRETURN && opcode <= Opcodes.RETURN)) {
                super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
                super.visitVarInsn(ILOAD, 6);
                super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(I)V", false);
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

### 验证结果

```java
public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        HelloWorld instance = new HelloWorld();
        int hashCode = instance.test("Tomcat", 10, System.currentTimeMillis(), new Object());
        int remainder = hashCode % 2;

        if (remainder == 0) {
            System.out.println("hashCode is even number.");
        }
        else {
            System.out.println("hashCode is odd number.");
        }
    }
}
```

### 小总结

缺点：不灵活。如果方法参数的数量和类型发生改变，这种方法就会失效。

那么，有没有办法来自动适应方法参数的数量和类型变化呢？答案是“有”。这个时候，就是 `Type` 类（`org.objectweb.asm.Type`）来发挥作用的地方。

## 第二个版本

### 编码实现

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.Type;

import static org.objectweb.asm.Opcodes.*;

public class MethodParameterVisitor extends ClassVisitor {
    public MethodParameterVisitor(int api, ClassVisitor classVisitor) {
        super(api, classVisitor);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        if (mv != null && !name.equals("<init>")) {
            boolean isAbstractMethod = (access & ACC_ABSTRACT) != 0;
            boolean isNativeMethod = (access & ACC_NATIVE) != 0;
            if (!isAbstractMethod && !isNativeMethod) {
                mv = new MethodParameterAdapter(api, mv, access, name, descriptor);
            }
        }
        return mv;
    }

    private static class MethodParameterAdapter extends MethodVisitor {
        private final int methodAccess;
        private final String methodName;
        private final String methodDesc;

        public MethodParameterAdapter(int api, MethodVisitor mv, int methodAccess, String methodName, String methodDesc) {
            super(api, mv);
            this.methodAccess = methodAccess;
            this.methodName = methodName;
            this.methodDesc = methodDesc;
        }

        @Override
        public void visitCode() {
            // 首先，处理自己的代码逻辑
            boolean isStatic = ((methodAccess & ACC_STATIC) != 0);
            int slotIndex = isStatic ? 0 : 1;

            printMessage("Method Enter: " + methodName + methodDesc);

            Type methodType = Type.getMethodType(methodDesc);
            Type[] argumentTypes = methodType.getArgumentTypes();
            for (Type t : argumentTypes) {
                int sort = t.getSort();
                int size = t.getSize();
                String descriptor = t.getDescriptor();

                int opcode = t.getOpcode(ILOAD);
                super.visitVarInsn(opcode, slotIndex);

                if (sort == Type.BOOLEAN) {
                    printBoolean();
                }
                else if (sort == Type.CHAR) {
                    printChar();
                }
                else if (sort == Type.BYTE || sort == Type.SHORT || sort == Type.INT) {
                    printInt();
                }
                else if (sort == Type.FLOAT) {
                    printFloat();
                }
                else if (sort == Type.LONG) {
                    printLong();
                }
                else if (sort == Type.DOUBLE) {
                    printDouble();
                }
                else if (sort == Type.OBJECT && "Ljava/lang/String;".equals(descriptor)) {
                    printString();
                }
                else if (sort == Type.OBJECT) {
                    printObject();
                }
                else {
                    printMessage("No Support");
                    if (size == 1) {
                        super.visitInsn(Opcodes.POP);
                    }
                    else {
                        super.visitInsn(Opcodes.POP2);
                    }
                }
                slotIndex += size;
            }

            // 其次，调用父类的方法实现
            super.visitCode();
        }

        @Override
        public void visitInsn(int opcode) {
            // 首先，处理自己的代码逻辑
            if ((opcode >= IRETURN && opcode <= RETURN) || opcode == ATHROW) {
                printMessage("Method Exit:");
                if (opcode == IRETURN) {
                    super.visitInsn(DUP);
                    Type methodType = Type.getMethodType(methodDesc);
                    Type returnType = methodType.getReturnType();
                    if (returnType == Type.BOOLEAN_TYPE) {
                        printBoolean();
                    }
                    else if (returnType == Type.CHAR_TYPE) {
                        printChar();
                    }
                    else {
                        printInt();
                    }
                }
                else if (opcode == FRETURN) {
                    super.visitInsn(DUP);
                    printFloat();
                }
                else if (opcode == LRETURN) {
                    super.visitInsn(DUP2);
                    printLong();
                }
                else if (opcode == DRETURN) {
                    super.visitInsn(DUP2);
                    printDouble();
                }
                else if (opcode == ARETURN) {
                    super.visitInsn(DUP);
                    printObject();
                }
                else if (opcode == RETURN) {
                    printMessage("    return void");
                }
                else {
                    printMessage("    abnormal return");
                }
            }

            // 其次，调用父类的方法实现
            super.visitInsn(opcode);
        }

        private void printBoolean() {
            super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            super.visitInsn(SWAP);
            super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Z)V", false);
        }

        private void printChar() {
            super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            super.visitInsn(SWAP);
            super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(C)V", false);
        }

        private void printInt() {
            super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            super.visitInsn(SWAP);
            super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(I)V", false);
        }

        private void printFloat() {
            super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            super.visitInsn(SWAP);
            super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(F)V", false);
        }

        private void printLong() {
            super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            super.visitInsn(DUP_X2);
            super.visitInsn(POP);
            super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(J)V", false);
        }

        private void printDouble() {
            super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            super.visitInsn(DUP_X2);
            super.visitInsn(POP);
            super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(D)V", false);
        }

        private void printString() {
            super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            super.visitInsn(SWAP);
            super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
        }

        private void printObject() {
            super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            super.visitInsn(SWAP);
            super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/Object;)V", false);
        }

        private void printMessage(String str) {
            super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            super.visitLdcInsn(str);
            super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
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
        ClassVisitor cv = new MethodParameterVisitor(api, cw);

        //（4）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成 byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

### 小总结

这种方式的特点就是，结合着 `Type` 类来使用，为方法参数的“类型”和“数量”赋予“灵魂”，让方法灵活起来。

#### Frame 的初始状态

在 JVM 执行的过程中，在内存空间中，每一个运行的方法（method）都对应一个 frame 空间；在 frame 空间当中，有两个重要的结构，即 local variables 和 operand stack，如下图所示。其中，local variables 是一个数组结构，它通过索引来读取或设置数据；而 operand stack 是一个栈结构，符合“后进先出”（LIFO, Last in, First out）的规则。

![stack frame](/assets/images/java/asm/frame-local-variables-operand-stack.png)


在方法刚进入时，operand stack 的初始状态是什么样的呢？回答：operand stack 是空的，换句话说，“栈上没有任何元素”。

在方法刚进入时，local variables 的初始状态是什么样的？相对来说，会比较复杂一些，因此我们重点说一下。对于 local variables 来说，我们把握以下三点：

- 第一点，local variables 是通过索引（index）来确定里的元素的，它的索引（index）是从 `0` 开始计算的，每一个位置可以称之为 slot。
- 第二点，在 local variables 中，存放数据的位置：**this- 方法接收的参数－方法内定义的局部变量**。
    - 对于非静态方法（non-static method）来说，索引位置为 `0` 的位置存放的是 `this` 变量；
    - 对于静态方法（static method）来说，索引位置为 `0` 的位置则不需要存储 `this` 变量。
- 第三点，在 local variables 中，`boolean`、`byte`、`char`、`short`、`int`、`float` 和 `reference` 类型占用 1 个 slot，而 `long` 和 `double` 类型占用 2 个 slot。

#### 打印语句

一般情况下，我们想打印一个字符串，可以如下写 ASM 代码：

```text
private void printMessage(String str) {
    super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
    super.visitLdcInsn(str);
    super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
}
```

但是，有些情况下，我们想要打印的值已经位于 operand stack 上了，此时可以这样：

```text
private void printString() {
    super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
    super.visitInsn(SWAP);
    super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
}
```

对于 `int` 类型的数据，它在 operand stack 当中占用 1 个位置，我们使用 `swap` 指令来完成 `int` 与 `System.out` 的位置互换。

```text
private void printInt() {
    super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
    super.visitInsn(SWAP);
    super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(I)V", false);
}
```

对于 `long` 类型的数据，它在 operand stack 当中占用 2 个位置，我们使用 `dup_x2` 和 `pop` 指令来完成 `long` 与 `System.out` 的位置互换。

```text
private void printLong() {
    super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
    super.visitInsn(DUP_X2);
    super.visitInsn(POP);
    super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(J)V", false);
}
```



![](/assets/images/java/asm/swap-int-and-long.png)

## 第三个版本

### 编码实现

首先，我们添加一个 `ParameterUtils` 类，在这个类定义了许多 print 方法，这些 print 方法可以打印不同类型的数据。

```java
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;

public class ParameterUtils {
    private static final ThreadLocal<SimpleDateFormat> formatter = ThreadLocal.withInitial(
            () -> new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
    );

    public static void printValueOnStack(boolean value) {
        System.out.println("    " + value);
    }

    public static void printValueOnStack(byte value) {
        System.out.println("    " + value);
    }

    public static void printValueOnStack(char value) {
        System.out.println("    " + value);
    }

    public static void printValueOnStack(short value) {
        System.out.println("    " + value);
    }

    public static void printValueOnStack(int value) {
        System.out.println("    " + value);
    }

    public static void printValueOnStack(float value) {
        System.out.println("    " + value);
    }

    public static void printValueOnStack(long value) {
        System.out.println("    " + value);
    }

    public static void printValueOnStack(double value) {
        System.out.println("    " + value);
    }

    public static void printValueOnStack(Object value) {
        if (value == null) {
            System.out.println("    " + value);
        }
        else if (value instanceof String) {
            System.out.println("    " + value);
        }
        else if (value instanceof Date) {
            System.out.println("    " + formatter.get().format(value));
        }
        else if (value instanceof char[]) {
            System.out.println("    " + Arrays.toString((char[])value));
        }
        else {
            System.out.println("    " + value.getClass() + ": " + value.toString());
        }
    }

    public static void printText(String str) {
        System.out.println(str);
    }
}
```

在下面的 `MethodParameterVisitor2` 类当中，我们将使用 `ParameterUtils` 类帮助我们打印信息。

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Type;

import static org.objectweb.asm.Opcodes.*;

public class MethodParameterVisitor2 extends ClassVisitor {
    public MethodParameterVisitor2(int api, ClassVisitor classVisitor) {
        super(api, classVisitor);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        if (mv != null && !name.equals("<init>")) {
            boolean isAbstractMethod = (access & ACC_ABSTRACT) != 0;
            boolean isNativeMethod = (access & ACC_NATIVE) != 0;
            if (!isAbstractMethod && !isNativeMethod) {
                mv = new MethodParameterAdapter2(api, mv, access, name, descriptor);
            }
        }
        return mv;
    }

    private static class MethodParameterAdapter2 extends MethodVisitor {
        private final int methodAccess;
        private final String methodName;
        private final String methodDesc;

        public MethodParameterAdapter2(int api, MethodVisitor mv, int methodAccess, String methodName, String methodDesc) {
            super(api, mv);
            this.methodAccess = methodAccess;
            this.methodName = methodName;
            this.methodDesc = methodDesc;
        }

        @Override
        public void visitCode() {
            // 首先，处理自己的代码逻辑
            boolean isStatic = ((methodAccess & ACC_STATIC) != 0);
            int slotIndex = isStatic ? 0 : 1;

            printMessage("Method Enter: " + methodName + methodDesc);

            Type methodType = Type.getMethodType(methodDesc);
            Type[] argumentTypes = methodType.getArgumentTypes();
            for (Type t : argumentTypes) {
                int sort = t.getSort();
                int size = t.getSize();
                String descriptor = t.getDescriptor();
                int opcode = t.getOpcode(ILOAD);
                super.visitVarInsn(opcode, slotIndex);
                if (sort >= Type.BOOLEAN && sort <= Type.DOUBLE) {
                    String methodDesc = String.format("(%s)V", descriptor);
                    printValueOnStack(methodDesc);
                }
                else {
                    printValueOnStack("(Ljava/lang/Object;)V");
                }

                slotIndex += size;
            }

            // 其次，调用父类的方法实现
            super.visitCode();
        }

        @Override
        public void visitInsn(int opcode) {
            // 首先，处理自己的代码逻辑
            if ((opcode >= IRETURN && opcode <= RETURN) || opcode == ATHROW) {
                printMessage("Method Exit: " + methodName + methodDesc);
                if (opcode >= IRETURN && opcode <= DRETURN) {
                    Type methodType = Type.getMethodType(methodDesc);
                    Type returnType = methodType.getReturnType();
                    int size = returnType.getSize();
                    String descriptor = returnType.getDescriptor();

                    if (size == 1) {
                        super.visitInsn(DUP);
                    }
                    else {
                        super.visitInsn(DUP2);
                    }
                    String methodDesc = String.format("(%s)V", descriptor);
                    printValueOnStack(methodDesc);
                }
                else if (opcode == ARETURN) {
                    super.visitInsn(DUP);
                    printValueOnStack("(Ljava/lang/Object;)V");
                }
                else if (opcode == RETURN) {
                    printMessage("    return void");
                }
                else {
                    printMessage("    abnormal return");
                }
            }

            // 其次，调用父类的方法实现
            super.visitInsn(opcode);
        }

        private void printMessage(String str) {
            super.visitLdcInsn(str);
            super.visitMethodInsn(INVOKESTATIC, "sample/ParameterUtils", "printText", "(Ljava/lang/String;)V", false);
        }

        private void printValueOnStack(String descriptor) {
            super.visitMethodInsn(INVOKESTATIC, "sample/ParameterUtils", "printValueOnStack", descriptor, false);
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
        ClassVisitor cv = new MethodParameterVisitor2(api, cw);

        //（4）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成 byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

### 小总结

这种方式的特点就是将“打印工作”放到一个单独的类里面。在这个单独的类里面，我们可以把内容打印出来，也可以输出到文件中，可以根据自己的需要进行修改。

## 总结

本文主要介绍了如何实现打印方法的参数和返回值，我们提供了三个版本：

- 第一个版本，它的特点是代码固定、不够灵活。
- 第二个版本，它的特点是结合 `Type` 来使用，为方法参数的“类型”和“数量”赋予“灵魂”，让方法灵活起来。
- 第三个版本，它的特点是将“打印工作”移交给“专业人员”来处理。

本文内容总结如下：

- 第一点，从实现思路的角度来说，打印方法的参数和返回值，是在“方法进入”和“方法退出”的基础上实现的。在“方法进入”的时候，先将方法的参数打印出来；在“方法退出”的时候，再将方法的返回值打印出来。
- 第二点，我们呈现三个版本的目的，是为了让大家理解一步一步迭代的过程。如果大家日后用到类似的功能，直接参照第三个版本实现就可以了。
