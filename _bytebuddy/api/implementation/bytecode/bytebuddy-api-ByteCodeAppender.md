---
title: "ByteCodeAppender"
sequence: "102"
---

## 概览

### 是什么

```text
Implementation --> ByteCodeAppender --> StackManipulation
```

`ByteCodeAppender` 由 `ByteCode`（字节码） 和 `Appender`（追加） 两个单词组成，
它的作用就是“在方法的实现里，添加一些字节码的指令”。

### ByteBuddy 视野

更大范围，形成整体

![](/assets/images/bytebuddy/implementation/bytebuddy-implementation-overview.png)

### JVM 层支撑：Stack Frame

```text
Implementation --> ByteCodeAppender --> StackManipulation
---------------------------------------------------------
                 JVM Stack Frame
```

```java
public class HelloWorld {
    public void test(int a, int b) {
        int sum = a + b;
        System.out.print("sum = ");
        System.out.println(sum);
    }
}
```

```text
test:(II)V
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │   locals: 4
│    operand stack                                                   │   stacks: 0
│    ┌───────────────────────────┐                                   │
│    │                           │      local variable               │   0: HelloWorld
│    ├───────────────────────────┤      ┌─────┬─────┬─────┬─────┐    │   1: I
│    │                           │      │  0  │  1  │  2  │  3  │    │   2: I
│    └───────────────────────────┘      └─────┴─────┴─────┴─────┘    │   3: .
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

000:    iload_1                                 {HelloWorld, I, I, .} | {}
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │   locals: 4
│    operand stack                                                   │   stacks: 1
│    ┌───────────────────────────┐                                   │
│    │                           │      local variable               │   0: HelloWorld
│    ├───────────────────────────┤      ┌─────┬─────┬─────┬─────┐    │   1: I
│    │             I             │      │  0  │  1  │  2  │  3  │    │   2: I
│    └───────────────────────────┘      └─────┴─────┴─────┴─────┘    │   3: .
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

001:    iload_2                                 {HelloWorld, I, I, .} | {I}
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │   locals: 4
│    operand stack                                                   │   stacks: 2
│    ┌───────────────────────────┐                                   │
│    │             I             │      local variable               │   0: HelloWorld
│    ├───────────────────────────┤      ┌─────┬─────┬─────┬─────┐    │   1: I
│    │             I             │      │  0  │  1  │  2  │  3  │    │   2: I
│    └───────────────────────────┘      └─────┴─────┴─────┴─────┘    │   3: .
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

002:    iadd                                    {HelloWorld, I, I, .} | {I, I}
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │   locals: 4
│    operand stack                                                   │   stacks: 1
│    ┌───────────────────────────┐                                   │
│    │                           │      local variable               │   0: HelloWorld
│    ├───────────────────────────┤      ┌─────┬─────┬─────┬─────┐    │   1: I
│    │             I             │      │  0  │  1  │  2  │  3  │    │   2: I
│    └───────────────────────────┘      └─────┴─────┴─────┴─────┘    │   3: .
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

003:    istore_3                                {HelloWorld, I, I, .} | {I}
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │   locals: 4
│    operand stack                                                   │   stacks: 0
│    ┌───────────────────────────┐                                   │
│    │                           │      local variable               │   0: HelloWorld
│    ├───────────────────────────┤      ┌─────┬─────┬─────┬─────┐    │   1: I
│    │                           │      │  0  │  1  │  2  │  3  │    │   2: I
│    └───────────────────────────┘      └─────┴─────┴─────┴─────┘    │   3: I
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

004:    getstatic System.out                    {HelloWorld, I, I, I} | {}
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │   locals: 4
│    operand stack                                                   │   stacks: 1
│    ┌───────────────────────────┐                                   │
│    │                           │      local variable               │   0: HelloWorld
│    ├───────────────────────────┤      ┌─────┬─────┬─────┬─────┐    │   1: I
│    │        PrintStream        │      │  0  │  1  │  2  │  3  │    │   2: I
│    └───────────────────────────┘      └─────┴─────┴─────┴─────┘    │   3: I
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

005:    ldc "sum = "                            {HelloWorld, I, I, I} | {PrintStream}
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │   locals: 4
│    operand stack                                                   │   stacks: 2
│    ┌───────────────────────────┐                                   │
│    │          String           │      local variable               │   0: HelloWorld
│    ├───────────────────────────┤      ┌─────┬─────┬─────┬─────┐    │   1: I
│    │        PrintStream        │      │  0  │  1  │  2  │  3  │    │   2: I
│    └───────────────────────────┘      └─────┴─────┴─────┴─────┘    │   3: I
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

006:    invokevirtual PrintStream.print         {HelloWorld, I, I, I} | {PrintStream, String}
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │   locals: 4
│    operand stack                                                   │   stacks: 0
│    ┌───────────────────────────┐                                   │
│    │                           │      local variable               │   0: HelloWorld
│    ├───────────────────────────┤      ┌─────┬─────┬─────┬─────┐    │   1: I
│    │                           │      │  0  │  1  │  2  │  3  │    │   2: I
│    └───────────────────────────┘      └─────┴─────┴─────┴─────┘    │   3: I
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

007:    getstatic System.out                    {HelloWorld, I, I, I} | {}
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │   locals: 4
│    operand stack                                                   │   stacks: 1
│    ┌───────────────────────────┐                                   │
│    │                           │      local variable               │   0: HelloWorld
│    ├───────────────────────────┤      ┌─────┬─────┬─────┬─────┐    │   1: I
│    │        PrintStream        │      │  0  │  1  │  2  │  3  │    │   2: I
│    └───────────────────────────┘      └─────┴─────┴─────┴─────┘    │   3: I
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

008:    iload_3                                 {HelloWorld, I, I, I} | {PrintStream}
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │   locals: 4
│    operand stack                                                   │   stacks: 2
│    ┌───────────────────────────┐                                   │
│    │             I             │      local variable               │   0: HelloWorld
│    ├───────────────────────────┤      ┌─────┬─────┬─────┬─────┐    │   1: I
│    │        PrintStream        │      │  0  │  1  │  2  │  3  │    │   2: I
│    └───────────────────────────┘      └─────┴─────┴─────┴─────┘    │   3: I
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

009:    invokevirtual PrintStream.println       {HelloWorld, I, I, I} | {PrintStream, I}
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │   locals: 4
│    operand stack                                                   │   stacks: 0
│    ┌───────────────────────────┐                                   │
│    │                           │      local variable               │   0: HelloWorld
│    ├───────────────────────────┤      ┌─────┬─────┬─────┬─────┐    │   1: I
│    │                           │      │  0  │  1  │  2  │  3  │    │   2: I
│    └───────────────────────────┘      └─────┴─────┴─────┴─────┘    │   3: I
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

010:    return                                  {HelloWorld, I, I, I} | {}
================================================================
```

## API 设计

### 两个组成部分

#### ByteCodeAppender

```java
public interface ByteCodeAppender {
    Size apply(MethodVisitor methodVisitor,
               Implementation.Context implementationContext,
               MethodDescription instrumentedMethod);
}
```

`ByteCodeAppender` 是 ByteBuddy 定义的类型，
`MethodVisitor` 是 ASM 定义的类型；
实现 `ByteCodeAppender.apply()` 方法，就是对 `MethodVisitor` 进行调用。


#### Size

`ByteCodeAppender.Size` 是对 Stack Frame 影响，包含 operand stack 和 local variables 两部分。

```java
public interface ByteCodeAppender {
    class Size {
        private final int operandStackSize;
        private final int localVariableSize;

        public Size(int operandStackSize, int localVariableSize) {
            this.operandStackSize = operandStackSize;
            this.localVariableSize = localVariableSize;
        }

        public Size merge(Size other) {
            // 取两者之中的较大者
            return new Size(
                    Math.max(operandStackSize, other.operandStackSize),
                    Math.max(localVariableSize, other.localVariableSize)
            );
        }
    }
}
```

### 具体实现

```text
                    ┌─── Simple
ByteCodeAppender ───┤
                    └─── Compound
```

#### Simple

```java
public interface ByteCodeAppender {
    class Simple implements ByteCodeAppender {
        private final StackManipulation stackManipulation;

        public Simple(StackManipulation... stackManipulation) {
            this(Arrays.asList(stackManipulation));
        }

        public Simple(List<? extends StackManipulation> stackManipulations) {
            this.stackManipulation = new StackManipulation.Compound(stackManipulations);
        }

        public Size apply(MethodVisitor methodVisitor,
                          Implementation.Context implementationContext,
                          MethodDescription instrumentedMethod) {
            return new Size(
                    stackManipulation.apply(methodVisitor, implementationContext).getMaximalSize(),
                    instrumentedMethod.getStackSize()
            );
        }
    }
}
```

#### Compound

```java
public interface ByteCodeAppender {
    class Compound implements ByteCodeAppender {
        private final List<ByteCodeAppender> byteCodeAppenders;

        public Compound(ByteCodeAppender... byteCodeAppender) {
            this(Arrays.asList(byteCodeAppender));
        }

        public Compound(List<? extends ByteCodeAppender> byteCodeAppenders) {
            this.byteCodeAppenders = new ArrayList<ByteCodeAppender>();
            for (ByteCodeAppender byteCodeAppender : byteCodeAppenders) {
                if (byteCodeAppender instanceof Compound) {
                    this.byteCodeAppenders.addAll(((Compound) byteCodeAppender).byteCodeAppenders);
                } else {
                    this.byteCodeAppenders.add(byteCodeAppender);
                }
            }
        }

        public Size apply(MethodVisitor methodVisitor,
                          Implementation.Context implementationContext,
                          MethodDescription instrumentedMethod) {
            Size size = new Size(0, instrumentedMethod.getStackSize());
            for (ByteCodeAppender byteCodeAppender : byteCodeAppenders) {
                size = size.merge(
                        byteCodeAppender.apply(methodVisitor, implementationContext, instrumentedMethod)
                );
            }
            return size;
        }
    }
}
```

## 注意事项

在 `MethodVisitor` 类当中，定义了许多的 `visitXxx()` 方法，这些方法的调用，也要遵循一定的顺序。

```text
(visitParameter)*
[visitAnnotationDefault]
(visitAnnotation | visitAnnotableParameterCount | visitParameterAnnotation | visitTypeAnnotation | visitAttribute)*
[
    visitCode
    (
        visitFrame |
        visitXxxInsn |
        visitLabel |
        visitInsnAnnotation |
        visitTryCatchBlock |
        visitTryCatchAnnotation |
        visitLocalVariable |
        visitLocalVariableAnnotation |
        visitLineNumber
    )*
    visitMaxs
]
visitEnd
```

The `ByteCodeAppender` is not allowed to **write annotations to the method** or
call the `MethodVisitor.visitCode()`, `MethodVisitor.visitMaxs(int, int)` or `MethodVisitor.visitEnd()` methods
which is both done by the entity delegating the call to the `ByteCodeAppender`.

```text
                                 ┌─── write ───┼─── annotations
                                 │
ByteCodeAppender::not.allowed ───┤             ┌─── MethodVisitor.visitCode()
                                 │             │
                                 └─── call ────┼─── MethodVisitor.visitMaxs(int, int)
                                               │
                                               └─── MethodVisitor.visitEnd()
```

This is done in order to allow for the concatenation of several byte code appenders and
therefore a more modular description of method implementations.

```text
设计意图：可以将多个 ByteCodeAppender 进行“串联”
```

## 示例

预期目标：

```java
public class HelloWorld {
    static {
        System.out.println("Abc");
        System.out.println("Xyz");
    }
}
```

进行测试：

```java
public class HelloWorldLoad {
    public static void main(String[] args) throws ClassNotFoundException {
        String className = "sample.HelloWorld";
        ClassLoader classLoader = ClassLoader.getSystemClassLoader();
        Class.forName(className, true, classLoader);
    }
}
```

### ASM


```text
                 ┌─── 1.visitCode()
                 │
                 │                        ┌─── visitFieldInsn
                 │                        │
                 │                        ├─── visitLdcInsn
                 ├─── 2.visitXxxInsn() ───┤
MethodVisitor ───┤                        ├─── visitMethodInsn
                 │                        │
                 │                        └─── ...
                 │
                 ├─── 3.visitMaxs()
                 │
                 └─── 4.visitEnd()
```

```java
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.MethodVisitor;

import static org.objectweb.asm.Opcodes.*;

public class HelloASM {
    public static void main(String[] args) {
        ClassWriter classWriter = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        classWriter.visit(V1_8, ACC_PUBLIC | ACC_SUPER, "sample/HelloWorld", null, "java/lang/Object", null);

        {
            MethodVisitor mv1 = classWriter.visitMethod(ACC_PUBLIC, "<init>", "()V", null, null);
            mv1.visitCode();

            mv1.visitVarInsn(ALOAD, 0);
            mv1.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
            mv1.visitInsn(RETURN);

            mv1.visitMaxs(1, 1);
            mv1.visitEnd();
        }
        {
            MethodVisitor mv2 = classWriter.visitMethod(ACC_STATIC, "<clinit>", "()V", null, null);

            // 1. visitCode()
            mv2.visitCode();

            // 2. visitXxxInsn()
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("Abc");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);

            // 2. visitXxxInsn()
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("Xyz");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            mv2.visitInsn(RETURN);

            // 3. visitMaxs()
            mv2.visitMaxs(2, 0);

            // 4. visitEnd()
            mv2.visitEnd();
        }
        classWriter.visitEnd();

        byte[] bytes = classWriter.toByteArray();

        String filePath = FileUtils.getFilePath("sample/HelloWorld.class");
        FileUtils.writeBytes(filePath, bytes);
    }
}
```

### ByteBuddy

```java
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.implementation.Implementation;
import net.bytebuddy.implementation.bytecode.ByteCodeAppender;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

public class MyByteCodeAppender implements ByteCodeAppender {
    private final String str;

    private MyByteCodeAppender(String str) {
        this.str = str;
    }

    @Override
    public Size apply(MethodVisitor methodVisitor,
                      Implementation.Context implementationContext,
                      MethodDescription instrumentedMethod) {
        methodVisitor.visitFieldInsn(Opcodes.GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
        methodVisitor.visitLdcInsn(str);
        methodVisitor.visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
        return new Size(2, instrumentedMethod.getStackSize());
    }

    public static MyByteCodeAppender of(String str) {
        return new MyByteCodeAppender(str);
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import sample.MyByteCodeAppender;


public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.initializer(MyByteCodeAppender.of("Abc"));

        builder = builder.initializer(MyByteCodeAppender.of("Xyz"));


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```
