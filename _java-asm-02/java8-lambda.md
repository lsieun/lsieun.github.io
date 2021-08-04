---
title:  "Java 8 Lambda"
sequence: "304"
---

[上级目录]({% link _posts/2021-04-22-java-asm-season-01.md %})

在《[Java ASM系列一：Core API]({% link _posts/2021-04-22-java-asm-season-01.md %})》当中，主要是对Core API进行了介绍，但是并没有使用Core API来生成Java 8 Lambda表达式。

在本文当中，我们主要对Java 8 Lambda的两方面进行介绍：

- 第一方面，如何使用ASM生成Lambda表达式？
- 第二方面，Lambda表达式的实现原理是什么？

## 使用ASM生成Lambda

### 预期目标

我们的预期目标是生成一个`HelloWorld`类，代码如下：

```java
import java.util.function.BiFunction;

public class HelloWorld {
    public void test() {
        BiFunction<Integer, Integer, Integer> func = Math::max;
        Integer result = func.apply(10, 20);
        System.out.println(result);
    }
}
```

### 编码实现

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

        {
            MethodVisitor mv1 = cw.visitMethod(ACC_PUBLIC, "<init>", "()V", null, null);
            mv1.visitCode();
            mv1.visitVarInsn(ALOAD, 0);
            mv1.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
            mv1.visitInsn(RETURN);
            mv1.visitMaxs(0, 0);
            mv1.visitEnd();
        }

        {
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC, "test", "()V", null, null);
            mv2.visitCode();
            Handle bootstrapMethodHandle = new Handle(H_INVOKESTATIC, "java/lang/invoke/LambdaMetafactory", "metafactory",
                    "(Ljava/lang/invoke/MethodHandles$Lookup;Ljava/lang/String;Ljava/lang/invoke/MethodType;Ljava/lang/invoke/MethodType;" +
                            "Ljava/lang/invoke/MethodHandle;Ljava/lang/invoke/MethodType;)Ljava/lang/invoke/CallSite;", false);
            mv2.visitInvokeDynamicInsn("apply", "()Ljava/util/function/BiFunction;",
                    bootstrapMethodHandle,
                    Type.getType("(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;"),
                    new Handle(H_INVOKESTATIC, "java/lang/Math", "max", "(II)I", false),
                    Type.getType("(Ljava/lang/Integer;Ljava/lang/Integer;)Ljava/lang/Integer;")
            );
            mv2.visitVarInsn(ASTORE, 1);
            mv2.visitVarInsn(ALOAD, 1);
            mv2.visitIntInsn(BIPUSH, 10);
            mv2.visitMethodInsn(INVOKESTATIC, "java/lang/Integer", "valueOf", "(I)Ljava/lang/Integer;", false);
            mv2.visitIntInsn(BIPUSH, 20);
            mv2.visitMethodInsn(INVOKESTATIC, "java/lang/Integer", "valueOf", "(I)Ljava/lang/Integer;", false);
            mv2.visitMethodInsn(INVOKEINTERFACE, "java/util/function/BiFunction", "apply",
                    "(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;", true);
            mv2.visitTypeInsn(CHECKCAST, "java/lang/Integer");
            mv2.visitVarInsn(ASTORE, 2);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitVarInsn(ALOAD, 2);
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/Object;)V", false);
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(0, 0);
            mv2.visitEnd();
        }

        cw.visitEnd();

        // (3) 调用toByteArray()方法
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
        Object obj = clazz.newInstance();

        Method m = clazz.getDeclaredMethod("test");
        m.invoke(obj);
    }
}
```

## Lambda的实现原理

### 追踪Lambda

我们使用`javap -v -p sample.HelloWorld`命令查看输出结果：

```text
$ javap -v -p sample.HelloWorld
...
BootstrapMethods:
  0: #28 invokestatic java/lang/invoke/LambdaMetafactory.metafactory:(
        Ljava/lang/invoke/MethodHandles$Lookup;
        Ljava/lang/String;Ljava/lang/invoke/MethodType;
        Ljava/lang/invoke/MethodType;
        Ljava/lang/invoke/MethodHandle;
        Ljava/lang/invok e/MethodType;
      )Ljava/lang/invoke/CallSite;
    Method arguments:
      #29 (Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
      #30 invokestatic java/lang/Math.max:(II)I
      #31 (Ljava/lang/Integer;Ljava/lang/Integer;)Ljava/lang/Integer;
```

通过上面的输出结果，我们可以定位到`java.lang.invoke.LambdaMetafactory`类的`metafactory()`方法。

![LambdaMetafactory的metafactory方法](/assets/images/java/asm/LambdaMetafactory-metafactory.png)


接着，我们跳转到`java.lang.invoke.InnerClassLambdaMetafactory`类的`buildCallSite()`方法

![InnerClassLambdaMetafactory的buildCallSite方法](/assets/images/java/asm/InnerClassLambdaMetafactory-buildCallSite.png)

在`java.lang.invoke.InnerClassLambdaMetafactory`类的`spinInnerClass()`方法中，找到如下代码：

```text
final byte[] classBytes = cw.toByteArray();
```

在其语句上，打一个断点：

![InnerClassLambdaMetafactory的spinInnerClass方法](/assets/images/java/asm/InnerClassLambdaMetafactory-spinInnerClass-toByteArray.png)

调试运行，然后使用如下表达式来查看`classBytes`的值：

```text
Arrays.toString(classBytes)
```

### 查看生成的类

```text
public class ASMPrint {
    public static void main(String[] args) throws IOException {
        // (1) 设置参数
        String str = "[-54, -2, -70, -66, ...]";
        byte[] bytes = StringUtils.array2Bytes(str);
        int parsingOptions = ClassReader.SKIP_FRAMES | ClassReader.SKIP_DEBUG;
        boolean asmCode = false;

        // (2) 打印结果
        Printer printer = asmCode ? new ASMifier() : new Textifier();
        PrintWriter printWriter = new PrintWriter(System.out, true);
        TraceClassVisitor traceClassVisitor = new TraceClassVisitor(null, printer, printWriter);
        new ClassReader(bytes).accept(traceClassVisitor, parsingOptions);
    }
}
```
