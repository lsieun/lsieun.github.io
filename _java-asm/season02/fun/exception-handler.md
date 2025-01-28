---
title: "Exception 处理"
sequence: "303"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

当方法内部的 instructions 执行的时候，可能会遇到异常情况，那么 JVM 会将其封装成一个具体的 Exception 子类的对象；
然后，把这个“异常对象”放在 operand stack 上，接下来要怎么处理呢？

对于 operand stack 上的“异常对象”，有两种处理情况：

- 第一种，当前方法处理不了，只能再交给别的方法进行处理
- 第二种，当前方法能够处理，就按照自己的处理逻辑来进行处理了

在本文当中，我们就只关注第二种情况，也就是当前方法能够这个“异常对象”。

在当前方法中，处理异常的机制，在 `Code` 属性结构当中，分成了两个部分进行存储：

- 第一部分，是位于 `exception_table[]` 内，它类似于中国古代打仗当中“军师”（运筹帷幄），它会告诉我们应该怎么处理这个“异常对象”。
- 第二部分，是位于 `code[]` 内，它类似于中国古代打仗当中的“将军和士兵”（决胜千里），它是具体的来执行对“异常对象”处理的操作。

```text
Code_attribute {
    u2 attribute_name_index;
    u4 attribute_length;
    u2 max_stack;
    u2 max_locals;
    u4 code_length;
    u1 code[code_length];
    u2 exception_table_length;
    {   u2 start_pc;
        u2 end_pc;
        u2 handler_pc;
        u2 catch_type;
    } exception_table[exception_table_length];
    u2 attributes_count;
    attribute_info attributes[attributes_count];
}
```

## 异常处理的顺序

### 代码举例

假如有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test(int a, int b) {
        try {
            int val = a / b;
            System.out.println(val);
        }
        catch (ArithmeticException ex1) {
            System.out.println("catch ArithmeticException");
        }
        catch (Exception ex2) {
            System.out.println("catch Exception");
        }
    }
}
```

接着，我们来写一个 `HelloWorldRun` 类，来对 `HelloWorld.test()` 方法进行调用。

```java
import sample.HelloWorld;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        HelloWorld instance = new HelloWorld();
        instance.test(10, 0);
    }
}
```

我们来运行一下 `HelloWorldRun` 类，查看一下输出结果：

```text
catch ArithmeticException
```

### exception table 结构

那么，异常处理的逻辑是存储在哪里呢？

从 ClassFile 的角度来看，异常处理的逻辑，是存在 `Code` 属性的 `exception_table` 部分。

```text
Code_attribute {
    u2 attribute_name_index;
    u4 attribute_length;
    u2 max_stack;
    u2 max_locals;
    u4 code_length;
    u1 code[code_length];
    u2 exception_table_length;
    {   u2 start_pc;
        u2 end_pc;
        u2 handler_pc;
        u2 catch_type;
    } exception_table[exception_table_length];
    u2 attributes_count;
    attribute_info attributes[attributes_count];
}
```

接着，我们对 `HelloWorld.class` 文件进行分析，其 `test()` 方法的 `Code` 结构当中各个条目具体取值如下：

```text
Code_attribute {
    attribute_name_index='000D' (#13)
    attribute_length='000000C1' (193)
    max_stack='0002' (2)
    max_locals='0004' (4)
    code_length='00000024' (36)
    code: 1B1C6C3EB200021DB60003A700184EB200021205B60006A7000C4EB200021208B60006B1
    exception_table_length='0002' (2)        // 注意，这里的数量是 2
    exception_table[0] {                     // 这里是第 1 个异常处理
        start_pc='0000' (0)
        end_pc='000B' (11)
        handler_pc='000E' (14)
        catch_type='0004' (#4)               // 这里表示捕获的异常是 ArithmeticException
    }
    exception_table[1] {                     // 这里是第 2 个异常处理
        start_pc='0000' (0)
        end_pc='000B' (11)
        handler_pc='001A' (26)
        catch_type='0007' (#7)               // 这里表示捕获的异常是 Exception 类型
    }
    attributes_count='0003' (3)
    LineNumberTable: 000E00000026...
    LocalVariableTable: 000F0000003E...
    StackMapTable: 001C0000000B...
}

```

再接下来，我们结合着 `javap` 指令来理解一下 exception table 的含义：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test(int, int);
    Code:
       0: iload_1
       1: iload_2
       2: idiv
       3: istore_3
       4: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
       7: iload_3
       8: invokevirtual #3                  // Method java/io/PrintStream.println:(I)V
      11: goto          35
      14: astore_3
      15: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
      18: ldc           #5                  // String catch ArithmeticException
      20: invokevirtual #6                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      23: goto          35
      26: astore_3
      27: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
      30: ldc           #8                  // String catch Exception
      32: invokevirtual #6                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      35: return
    Exception table:
       from    to  target type
           0    11    14   Class java/lang/ArithmeticException
           0    11    26   Class java/lang/Exception
}
```

### 调换 exception table 顺序

在这里，我们想调换一下 exception table 顺序：先捕获 `Exception` 异常，再捕获 `ArithmeticException` 异常。

我们想通过 Java 语言来实现调换一下 exception table 顺序，会发现代码会报错：

```java
public class HelloWorld {
    public void test(int a, int b) {
        try {
            int val = a / b;
            System.out.println(val);
        }
        catch (Exception ex2) {
            System.out.println("catch Exception");
        }
        catch (ArithmeticException ex1) { // Exception 'java.lang.ArithmeticException' has already been caught
            System.out.println("catch ArithmeticException");
        }
    }
}
```

那么，应该怎么做呢？我们就通过 ASM 来帮助我们实现调换一下 exception table 顺序。

首先，我们来看一下，原本 `HelloWorld` 类的代码如何通过 ASM 代码来进行实现：

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldGenerateCore {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);

        // (1) 生成 byte[]内容
        byte[] bytes = dump();

        // (2) 保存 byte[]到文件
        FileUtils.writeBytes(filepath, bytes);
    }

    public static byte[] dump() throws Exception {
        // (1) 创建 ClassWriter 对象
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (2) 调用 visitXxx()方法
        cw.visit(V1_8, ACC_PUBLIC + ACC_SUPER, "sample/HelloWorld",
                null, "java/lang/Object", null);

        {
            MethodVisitor mv1 = cw.visitMethod(ACC_PUBLIC, "<init>", "()V", null, null);
            mv1.visitCode();
            mv1.visitVarInsn(ALOAD, 0);
            mv1.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
            mv1.visitInsn(RETURN);
            mv1.visitMaxs(1, 1);
            mv1.visitEnd();
        }

        {
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC, "test", "(II)V", null, null);
            Label startLabel = new Label();
            Label endLabel = new Label();
            Label exceptionHandler01 = new Label();
            Label exceptionHandler02 = new Label();
            Label returnLabel = new Label();

            mv2.visitCode();
            mv2.visitTryCatchBlock(startLabel, endLabel, exceptionHandler01, "java/lang/ArithmeticException");
            mv2.visitTryCatchBlock(startLabel, endLabel, exceptionHandler02, "java/lang/Exception");
            
            mv2.visitLabel(startLabel);
            mv2.visitVarInsn(ILOAD, 1);
            mv2.visitVarInsn(ILOAD, 2);
            mv2.visitInsn(IDIV);
            mv2.visitVarInsn(ISTORE, 3);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitVarInsn(ILOAD, 3);
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(I)V", false);
            
            mv2.visitLabel(endLabel);
            mv2.visitJumpInsn(GOTO, returnLabel);
            
            mv2.visitLabel(exceptionHandler01);
            mv2.visitVarInsn(ASTORE, 3);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("catch ArithmeticException");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            mv2.visitJumpInsn(GOTO, returnLabel);
            
            mv2.visitLabel(exceptionHandler02);
            mv2.visitVarInsn(ASTORE, 3);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("catch Exception");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            
            mv2.visitLabel(returnLabel);
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(2, 4);
            mv2.visitEnd();
        }
        cw.visitEnd();

        // (3) 调用 toByteArray()方法
        return cw.toByteArray();
    }
}
```

接下来，我们调换一下上述 ASM 代码中两个 `MethodVisitor.visitTryCatchBlock()` 方法调用的顺序：

```text
mv2.visitTryCatchBlock(startLabel, endLabel, exceptionHandler02, "java/lang/Exception");
mv2.visitTryCatchBlock(startLabel, endLabel, exceptionHandler01, "java/lang/ArithmeticException");
```

那么，我们执行一下 `HelloWorldGenerateCore` 类，就可以生成 `HelloWorld.class` 文件。
然后，我们执行一下 `javap -c sample.HelloWorld` 命令，来验证一下：

```text
$  javap -c sample.HelloWorld
public class sample.HelloWorld {
...
  public void test(int, int);
    Code:
       0: iload_1
       1: iload_2
       2: idiv
       3: istore_3
       4: getstatic     #20                 // Field java/lang/System.out:Ljava/io/PrintStream;
       7: iload_3
       8: invokevirtual #26                 // Method java/io/PrintStream.println:(I)V
      11: goto          35
      14: astore_3
      15: getstatic     #20                 // Field java/lang/System.out:Ljava/io/PrintStream;
      18: ldc           #28                 // String catch ArithmeticException
      20: invokevirtual #31                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      23: goto          35
      26: astore_3
      27: getstatic     #20                 // Field java/lang/System.out:Ljava/io/PrintStream;
      30: ldc           #33                 // String catch Exception
      32: invokevirtual #31                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      35: return
    Exception table:
       from    to  target type
           0    11    26   Class java/lang/Exception
           0    11    14   Class java/lang/ArithmeticException
}
```

再接着，我们来运行一下 `HelloWorldRun` 类，查看一下输出结果：

```text
catch Exception
```

这样的一个输出结果，说明：**exception table 就是根据先后顺序来判定的，而不是找到最匹配的异常类型**。

## 为整个方法添加异常处理的逻辑

### 代码举例

假如有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test(String name, int age) {
        try {
            int length = name.length();
            System.out.println("length = " + length);
        }
        catch (NullPointerException ex) {
            System.out.println("name is null");
        }

        int val = div(10, age);
        System.out.println("val = " + val);
    }

    public int div(int a, int b) {
        return a / b;
    }
}
```

我们想实现的预期目标：将整个 `test()` 方法添加一个 try-catch 语句。

首先，我们来运行一下 `HelloWorldRun` 类：

```java
import sample.HelloWorld;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        HelloWorld instance = new HelloWorld();
        instance.test(null, 0);
    }
}
```

其输出结果如下：

```text
name is null
Exception in thread "main" java.lang.ArithmeticException: / by zero
	at sample.HelloWorld.div(HelloWorld.java:18)
	at sample.HelloWorld.test(HelloWorld.java:13)
	at run.HelloWorldRun.main(HelloWorldRun.java:8)
```

使用 `javap` 命令查看 exception table 的内容：

```text
$  javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test(java.lang.String, int);
    Code:
       0: aload_1
       1: invokevirtual #2                  // Method java/lang/String.length:()I
       4: istore_3
       5: getstatic     #3                  // Field java/lang/System.out:Ljava/io/PrintStream;
       8: new           #4                  // class java/lang/StringBuilder
      11: dup
      12: invokespecial #5                  // Method java/lang/StringBuilder."<init>":()V
      15: ldc           #6                  // String length =
      17: invokevirtual #7                  // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
      20: iload_3
      21: invokevirtual #8                  // Method java/lang/StringBuilder.append:(I)Ljava/lang/StringBuilder;
      24: invokevirtual #9                  // Method java/lang/StringBuilder.toString:()Ljava/lang/String;
      27: invokevirtual #10                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      30: goto          42
      33: astore_3
      34: getstatic     #3                  // Field java/lang/System.out:Ljava/io/PrintStream;
      37: ldc           #12                 // String name is null
      39: invokevirtual #10                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      42: aload_0
      43: bipush        10
      45: iload_2
      46: invokevirtual #13                 // Method div:(II)I
      49: istore_3
      50: getstatic     #3                  // Field java/lang/System.out:Ljava/io/PrintStream;
      53: new           #4                  // class java/lang/StringBuilder
      56: dup
      57: invokespecial #5                  // Method java/lang/StringBuilder."<init>":()V
      60: ldc           #14                 // String val =
      62: invokevirtual #7                  // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
      65: iload_3
      66: invokevirtual #8                  // Method java/lang/StringBuilder.append:(I)Ljava/lang/StringBuilder;
      69: invokevirtual #9                  // Method java/lang/StringBuilder.toString:()Ljava/lang/String;
      72: invokevirtual #10                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      75: return
    Exception table:
       from    to  target type
           0    30    33   Class java/lang/NullPointerException

...
}
```

### 正确的异常捕获处理

```java
import org.objectweb.asm.*;

import static org.objectweb.asm.Opcodes.*;

public class MethodWithWholeTryCatchVisitor extends ClassVisitor {
    private final String methodName;
    private final String methodDesc;

    public MethodWithWholeTryCatchVisitor(int api, ClassVisitor classVisitor, String methodName, String methodDesc) {
        super(api, classVisitor);
        this.methodName = methodName;
        this.methodDesc = methodDesc;
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        if (mv != null && !"<init>".equals(name) && methodName.equals(name) && methodDesc.equals(descriptor)) {
            boolean isAbstractMethod = (access & ACC_ABSTRACT) != 0;
            boolean isNativeMethod = (access & ACC_NATIVE) != 0;
            if (!isAbstractMethod && !isNativeMethod) {
                mv = new MethodWithWholeTryCatchAdapter(api, mv, access, descriptor);
            }
        }
        return mv;
    }

    private static class MethodWithWholeTryCatchAdapter extends MethodVisitor {
        private final int methodAccess;
        private final String methodDesc;

        private final Label startLabel = new Label();
        private final Label endLabel = new Label();
        private final Label handlerLabel = new Label();

        public MethodWithWholeTryCatchAdapter(int api, MethodVisitor methodVisitor, int methodAccess, String methodDesc) {
            super(api, methodVisitor);
            this.methodAccess = methodAccess;
            this.methodDesc = methodDesc;
        }

        public void visitCode() {
            // 首先，处理自己的代码逻辑
            // (1) startLabel
            super.visitLabel(startLabel);

            // 其次，调用父类的方法实现
            super.visitCode();
        }

        @Override
        public void visitMaxs(int maxStack, int maxLocals) {
            // 首先，处理自己的代码逻辑
            // (2) endLabel
            super.visitLabel(endLabel);

            // (3) handlerLabel
            super.visitLabel(handlerLabel);
            int localIndex = getLocalIndex();
            super.visitVarInsn(ASTORE, localIndex);
            super.visitVarInsn(ALOAD, localIndex);
            super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/Exception", "printStackTrace", "(Ljava/io/PrintStream;)V", false);
            super.visitVarInsn(ALOAD, localIndex);
            super.visitInsn(Opcodes.ATHROW);

            // (4) visitTryCatchBlock
            super.visitTryCatchBlock(startLabel, endLabel, handlerLabel, "java/lang/Exception");

            // 其次，调用父类的方法实现
            super.visitMaxs(maxStack, maxLocals);
        }

        private int getLocalIndex() {
            Type t = Type.getType(methodDesc);
            Type[] argumentTypes = t.getArgumentTypes();

            boolean isStaticMethod = ((methodAccess & ACC_STATIC) != 0);
            int localIndex = isStaticMethod ? 0 : 1;
            for (Type argType : argumentTypes) {
                localIndex += argType.getSize();
            }
            return localIndex;
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
        ClassVisitor cv = new MethodWithWholeTryCatchVisitor(api, cw, "test", "(Ljava/lang/String;I)V");


        //（4）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成 byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

转换完成之后，再次运行 `HelloWorldRun` 类，得到如下输出内容：

```text
name is null
java.lang.ArithmeticException: / by zero
	at sample.HelloWorld.div(Unknown Source)
	at sample.HelloWorld.test(Unknown Source)
	at run.HelloWorldRun.main(HelloWorldRun.java:8)
Exception in thread "main" java.lang.ArithmeticException: / by zero
	at sample.HelloWorld.div(Unknown Source)
	at sample.HelloWorld.test(Unknown Source)
	at run.HelloWorldRun.main(HelloWorldRun.java:8)
```

使用 `javap` 命令查看 exception table 的内容：

```text
$ javap -c sample.HelloWorld
public class sample.HelloWorld {
...
  public void test(java.lang.String, int);
    Code:
       0: aload_1
       1: invokevirtual #18                 // Method java/lang/String.length:()I
       4: istore_3
       5: getstatic     #24                 // Field java/lang/System.out:Ljava/io/PrintStream;
       8: new           #26                 // class java/lang/StringBuilder
      11: dup
      12: invokespecial #27                 // Method java/lang/StringBuilder."<init>":()V
      15: ldc           #29                 // String length =
      17: invokevirtual #33                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
      20: iload_3
      21: invokevirtual #36                 // Method java/lang/StringBuilder.append:(I)Ljava/lang/StringBuilder;
      24: invokevirtual #40                 // Method java/lang/StringBuilder.toString:()Ljava/lang/String;
      27: invokevirtual #46                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      30: goto          42
      33: astore_3
      34: getstatic     #24                 // Field java/lang/System.out:Ljava/io/PrintStream;
      37: ldc           #48                 // String name is null
      39: invokevirtual #46                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      42: aload_0
      43: bipush        10
      45: iload_2
      46: invokevirtual #52                 // Method div:(II)I
      49: istore_3
      50: getstatic     #24                 // Field java/lang/System.out:Ljava/io/PrintStream;
      53: new           #26                 // class java/lang/StringBuilder
      56: dup
      57: invokespecial #27                 // Method java/lang/StringBuilder."<init>":()V
      60: ldc           #54                 // String val =
      62: invokevirtual #33                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
      65: iload_3
      66: invokevirtual #36                 // Method java/lang/StringBuilder.append:(I)Ljava/lang/StringBuilder;
      69: invokevirtual #40                 // Method java/lang/StringBuilder.toString:()Ljava/lang/String;
      72: invokevirtual #46                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      75: return
      76: astore_3
      77: aload_3
      78: getstatic     #24                 // Field java/lang/System.out:Ljava/io/PrintStream;
      81: invokevirtual #60                 // Method java/lang/Exception.printStackTrace:(Ljava/io/PrintStream;)V
      84: aload_3
      85: athrow
    Exception table:
       from    to  target type
           0    30    33   Class java/lang/NullPointerException
           0    76    76   Class java/lang/Exception

...
}
```

### 错误的异常捕获处理

```java
import org.objectweb.asm.*;

import static org.objectweb.asm.Opcodes.*;

public class MethodWithWholeTryCatchVisitor extends ClassVisitor {
    private final String methodName;
    private final String methodDesc;

    public MethodWithWholeTryCatchVisitor(int api, ClassVisitor classVisitor, String methodName, String methodDesc) {
        super(api, classVisitor);
        this.methodName = methodName;
        this.methodDesc = methodDesc;
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        if (mv != null && !"<init>".equals(name) && methodName.equals(name) && methodDesc.equals(descriptor)) {
            boolean isAbstractMethod = (access & ACC_ABSTRACT) != 0;
            boolean isNativeMethod = (access & ACC_NATIVE) != 0;
            if (!isAbstractMethod && !isNativeMethod) {
                mv = new MethodWithWholeTryCatchAdapter(api, mv, access, descriptor);
            }
        }
        return mv;
    }

    private static class MethodWithWholeTryCatchAdapter extends MethodVisitor {
        private final int methodAccess;
        private final String methodDesc;

        private final Label startLabel = new Label();
        private final Label endLabel = new Label();
        private final Label handlerLabel = new Label();

        public MethodWithWholeTryCatchAdapter(int api, MethodVisitor methodVisitor, int methodAccess, String methodDesc) {
            super(api, methodVisitor);
            this.methodAccess = methodAccess;
            this.methodDesc = methodDesc;
        }

        public void visitCode() {
            // 首先，处理自己的代码逻辑
            // (1) visitTryCatchBlock 和 startLabel （注意，修改的是 visitTryCatchBlock 方法的位置）
            super.visitTryCatchBlock(startLabel, endLabel, handlerLabel, "java/lang/Exception");
            super.visitLabel(startLabel);

            // 其次，调用父类的方法实现
            super.visitCode();
        }

        @Override
        public void visitMaxs(int maxStack, int maxLocals) {
            // 首先，处理自己的代码逻辑
            // (2) endLabel
            super.visitLabel(endLabel);

            // (3) handlerLabel
            super.visitLabel(handlerLabel);
            int localIndex = getLocalIndex();
            super.visitVarInsn(ASTORE, localIndex);
            super.visitVarInsn(ALOAD, localIndex);
            super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/Exception", "printStackTrace", "(Ljava/io/PrintStream;)V", false);
            super.visitVarInsn(ALOAD, localIndex);
            super.visitInsn(Opcodes.ATHROW);

            // 其次，调用父类的方法实现
            super.visitMaxs(maxStack, maxLocals);
        }

        private int getLocalIndex() {
            Type t = Type.getType(methodDesc);
            Type[] argumentTypes = t.getArgumentTypes();

            boolean isStaticMethod = ((methodAccess & ACC_STATIC) != 0);
            int localIndex = isStaticMethod ? 0 : 1;
            for (Type argType : argumentTypes) {
                localIndex += argType.getSize();
            }
            return localIndex;
        }
    }
}
```

转换完成之后，我们运行 `HelloWorldRun` 来查看一下输出内容：

```text
java.lang.NullPointerException
	at sample.HelloWorld.test(Unknown Source)
	at run.HelloWorldRun.main(HelloWorldRun.java:8)
Exception in thread "main" java.lang.NullPointerException
	at sample.HelloWorld.test(Unknown Source)
	at run.HelloWorldRun.main(HelloWorldRun.java:8)
```

我们使用 `javap` 命令查看 exception table 的内容：

```text
$ javap -c sample.HelloWorld
public class sample.HelloWorld {
...
  public void test(java.lang.String, int);
    Code:
       0: aload_1
       1: invokevirtual #20                 // Method java/lang/String.length:()I
       4: istore_3
       5: getstatic     #26                 // Field java/lang/System.out:Ljava/io/PrintStream;
       8: new           #28                 // class java/lang/StringBuilder
      11: dup
      12: invokespecial #29                 // Method java/lang/StringBuilder."<init>":()V
      15: ldc           #31                 // String length =
      17: invokevirtual #35                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
      20: iload_3
      21: invokevirtual #38                 // Method java/lang/StringBuilder.append:(I)Ljava/lang/StringBuilder;
      24: invokevirtual #42                 // Method java/lang/StringBuilder.toString:()Ljava/lang/String;
      27: invokevirtual #48                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      30: goto          42
      33: astore_3
      34: getstatic     #26                 // Field java/lang/System.out:Ljava/io/PrintStream;
      37: ldc           #50                 // String name is null
      39: invokevirtual #48                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      42: aload_0
      43: bipush        10
      45: iload_2
      46: invokevirtual #54                 // Method div:(II)I
      49: istore_3
      50: getstatic     #26                 // Field java/lang/System.out:Ljava/io/PrintStream;
      53: new           #28                 // class java/lang/StringBuilder
      56: dup
      57: invokespecial #29                 // Method java/lang/StringBuilder."<init>":()V
      60: ldc           #56                 // String val =
      62: invokevirtual #35                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
      65: iload_3
      66: invokevirtual #38                 // Method java/lang/StringBuilder.append:(I)Ljava/lang/StringBuilder;
      69: invokevirtual #42                 // Method java/lang/StringBuilder.toString:()Ljava/lang/String;
      72: invokevirtual #48                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      75: return
      76: astore_3
      77: aload_3
      78: getstatic     #26                 // Field java/lang/System.out:Ljava/io/PrintStream;
      81: invokevirtual #60                 // Method java/lang/Exception.printStackTrace:(Ljava/io/PrintStream;)V
      84: aload_3
      85: athrow
    Exception table:
       from    to  target type
           0    76    76   Class java/lang/Exception
           0    30    33   Class java/lang/NullPointerException
...
}
```

## 操作数栈上的异常对象

当方法执行过程中，遇到异常的时候，在 operand stack 上会有一个“异常对象”。

这个“异常对象”，可能有对应的代码处理逻辑；但是，我们想对这个“异常对象”进行多次处理，那下一步要怎么处理呢？

有两种处理方式：

- 第一种方式，就是将“异常对象”存储到 local variable 内；后续使用的时候，再将“异常对象”加载到 operand stack 上。
- 第二种方式，就是在 operand stack 上，要使用的时候，就进行一次 `dup`（复制）操作。

### 存储异常对象

对于第一种情况，我们要将“异常对象”存储到 local variable 当中，但是，我们应该把这个“异常对象”存储到哪个位置上呢？换句话说，我们怎么计算“异常对象”在 local variable 当中的位置呢？我们需要考虑三个因素：

- 第一个因素，是否需要存储 `this` 变量。
- 第二个因素，是否需要存储方法的参数（method parameters）。
- 第三个因素，是否需要存储方法内部定义的局部变量（method local var）。

考虑这三个因素之后，我们就可以确定“异常对象”应该存储的一个什么位置上了。

在上面的 `MethodWithWholeTryCatchAdapter` 当中，有一个 `getLocalIndex()` 方法。
这个方法就是考虑了 `this` 和方法的参数（method parameters），之后就是“异常对象”可以存储的位置。
再者，方法内部定义的局部变量（method local var），有的时候有，有的时候没有，大家根据实际的情况来决定是否添加。

```java
class MethodWithWholeTryCatchAdapter extends MethodVisitor {
    @Override
    public void visitMaxs(int maxStack, int maxLocals) {
        // 首先，处理自己的代码逻辑
        // (2) endLabel
        super.visitLabel(endLabel);

        // (3) handlerLabel
        super.visitLabel(handlerLabel);
        int localIndex = getLocalIndex();
        super.visitVarInsn(ASTORE, localIndex);
        super.visitVarInsn(ALOAD, localIndex);
        super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/Exception", "printStackTrace", "(Ljava/io/PrintStream;)V", false);
        super.visitVarInsn(ALOAD, localIndex);
        super.visitInsn(Opcodes.ATHROW);

        // 其次，调用父类的方法实现
        super.visitMaxs(maxStack, maxLocals);
    }    
    
    private int getLocalIndex() {
        Type t = Type.getType(methodDesc);
        Type[] argumentTypes = t.getArgumentTypes();

        boolean isStaticMethod = ((methodAccess & ACC_STATIC) != 0);
        int localIndex = isStaticMethod ? 0 : 1;
        for (Type argType : argumentTypes) {
            localIndex += argType.getSize();
        }
        return localIndex;
    }
}
```

### 操作数栈上复制

第二种方式，就是不依赖于 local variable，也就不用去计算一个具体的位置了。
那么，我们想对“异常对象”进行多次的处理，直接在 operand stack 进行 `dup`（复制），就能够进行多次处理了。

```java
import org.objectweb.asm.*;

import static org.objectweb.asm.Opcodes.*;

public class MethodWithWholeTryCatchVisitor extends ClassVisitor {
    private final String methodName;
    private final String methodDesc;

    public MethodWithWholeTryCatchVisitor(int api, ClassVisitor classVisitor, String methodName, String methodDesc) {
        super(api, classVisitor);
        this.methodName = methodName;
        this.methodDesc = methodDesc;
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        if (mv != null && !"<init>".equals(name) && methodName.equals(name) && methodDesc.equals(descriptor)) {
            boolean isAbstractMethod = (access & ACC_ABSTRACT) != 0;
            boolean isNativeMethod = (access & ACC_NATIVE) != 0;
            if (!isAbstractMethod && !isNativeMethod) {
                mv = new MethodWithWholeTryCatchAdapter(api, mv, access, descriptor);
            }
        }
        return mv;
    }

    private static class MethodWithWholeTryCatchAdapter extends MethodVisitor {
        private final int methodAccess;
        private final String methodDesc;

        private final Label startLabel = new Label();
        private final Label endLabel = new Label();
        private final Label handlerLabel = new Label();

        public MethodWithWholeTryCatchAdapter(int api, MethodVisitor methodVisitor, int methodAccess, String methodDesc) {
            super(api, methodVisitor);
            this.methodAccess = methodAccess;
            this.methodDesc = methodDesc;
        }

        public void visitCode() {
            // 首先，处理自己的代码逻辑
            // (1) startLabel
            super.visitLabel(startLabel);

            // 其次，调用父类的方法实现
            super.visitCode();
        }

        @Override
        public void visitMaxs(int maxStack, int maxLocals) {
            // 首先，处理自己的代码逻辑
            // (2) endLabel
            super.visitLabel(endLabel);

            // (3) handlerLabel
            super.visitLabel(handlerLabel);
            super.visitInsn(DUP);              // 注意，这里使用了 DUP 指令
            super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/Exception", "printStackTrace", "(Ljava/io/PrintStream;)V", false);
            super.visitInsn(Opcodes.ATHROW);

            // (4) visitTryCatchBlock
            super.visitTryCatchBlock(startLabel, endLabel, handlerLabel, "java/lang/Exception");

            // 其次，调用父类的方法实现
            super.visitMaxs(maxStack, maxLocals);
        }
    }
}
```

