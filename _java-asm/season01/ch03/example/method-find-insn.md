---
title: "查找已有的方法（查找－方法调用）"
sequence: "311"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## 查找 Instruction

### 如何查找 Instruction

在方法当中，查找某一个特定的 Instruction，那么应该怎么做呢？简单来说，就是**通过 `MethodVisitor` 类当中定义的 `visitXxxInsn()` 方法来查找**。

让我们回顾一下 `MethodVisitor` 类当中定义了哪些 `visitXxx()` 方法。

![](/assets/images/java/asm/method-visitor-visit-xxx-insn-methods.png)

在 `MethodVisitor` 类当中，定义的主要 `visitXxx()` 方法可以分成四组：

- 第一组，`visitCode()` 方法，标志着方法体（method body）的开始。
- 第二组，`visitXxxInsn()` 方法，对应方法体（method body）本身，这里包含多个方法。
- 第三组，`visitMaxs()` 方法，标志着方法体（method body）的结束。
- 第四组，`visitEnd()` 方法，是最后调用的方法。


在方法当中，任何一条 Instruction，放在 ASM 代码中，它都是通过调用 `MethodVisitor.visitXxxInsn()` 方法的形式来呈现的。换句话说，想去找某一条特定的 Instruction，分成两个步骤：

- 第一步，找到该 Instruction 对应的 `visitXxxInsn()` 方法。
- 第二步，对该 `visitXxxInsn()` 方法接收的 `opcode` 和其它参数进行判断。

**简而言之，查找 Instruction 的过程，就是对 `visitXxxInsn()` 方法接收的参数进行检查的过程。** 举一个形象的例子，平时我们坐地铁，随身物品要过安检，其实就是对书包（方法）里的物品（参数）进行检查，如下图：

![ 安检机器 ](/assets/images/java/asm/security-instrument.jpg)

### Class Analysis

**查找 Instruction 的过程，** 并不属于 Class Transformation（因为没有生成新的类），而**是属于 Class Analysis。** 在下图当中，Class Analysis 包括 find potential bugs、detect unused code 和 reverse engineer code 等操作。但是，这些分析操作（analysis）是比较困难的，它需要编程经验的积累和对问题模式的识别，需要编码处理各种不同情况，所以不太容易实现。

![What ASM Can Do](/assets/images/java/asm/what-asm-can-do.png)

但是，Class Analysis，并不是只包含复杂的分析操作，也包含一些简单的分析操作。例如，当前方法里调用了哪些其它的方法、当前的方法被哪些别的方法所调用。对于方法的调用，就对应着 `MethodVisitor.visitMethodInsn(int opcode, String owner, String name, String descriptor, boolean isInterface)` 方法。

另外，要注意一点：在 Class Transformation 当中，需要用到 `ClassReader`、`ClassVisitor` 和 `ClassWriter` 类；但是，在 Class Analysis 中，我们只需要用到 `ClassReader` 和 `ClassVisitor` 类，而不需要用到 `ClassWriter` 类。

![ASM Core Classes](/assets/images/java/asm/asm-core-classes.png)

## 示例一：调用了哪些方法

### 预期目标

假如有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test(int a, int b) {
        int c = Math.addExact(a, b);
        String line = String.format("%d + %d = %d", a, b, c);
        System.out.println(line);
    }
}
```

我们想要实现的预期目标：打印出 `test()` 方法当中调用了哪些方法。

在编写 ASM 代码之前，可以使用 `javap` 命令查看 `test()` 方法所包含的 Instruction 内容：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test(int, int);
    Code:
       0: iload_1
       1: iload_2
       2: invokestatic  #2                  // Method java/lang/Math.addExact:(II)I
       5: istore_3
       6: ldc           #3                  // String %d + %d = %d
       8: iconst_3
       9: anewarray     #4                  // class java/lang/Object
      12: dup
      13: iconst_0
      14: iload_1
      15: invokestatic  #5                  // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
      18: aastore
      19: dup
      20: iconst_1
      21: iload_2
      22: invokestatic  #5                  // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
      25: aastore
      26: dup
      27: iconst_2
      28: iload_3
      29: invokestatic  #5                  // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
      32: aastore
      33: invokestatic  #6                  // Method java/lang/String.format:(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;
      36: astore        4
      38: getstatic     #7                  // Field java/lang/System.out:Ljava/io/PrintStream;
      41: aload         4
      43: invokevirtual #8                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      46: return
}
```

### 编码实现

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.util.Printer;

import java.util.ArrayList;
import java.util.List;

public class MethodFindInvokeVisitor extends ClassVisitor {
    private final String methodName;
    private final String methodDesc;

    public MethodFindInvokeVisitor(int api, ClassVisitor classVisitor, String methodName, String methodDesc) {
        super(api, classVisitor);
        this.methodName = methodName;
        this.methodDesc = methodDesc;
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        if (methodName.equals(name) && methodDesc.equals(descriptor)) {
            return new MethodFindInvokeAdapter(api, null);
        }
        return null;
    }

    private static class MethodFindInvokeAdapter extends MethodVisitor {
        private final List<String> list = new ArrayList<>();

        public MethodFindInvokeAdapter(int api, MethodVisitor methodVisitor) {
            super(api, methodVisitor);
        }

        @Override
        public void visitMethodInsn(int opcode, String owner, String name, String descriptor, boolean isInterface) {
            // 首先，处理自己的代码逻辑
            String info = String.format("%s %s.%s%s", Printer.OPCODES[opcode], owner, name, descriptor);
            if (!list.contains(info)) {
                list.add(info);
            }

            // 其次，调用父类的方法实现
            super.visitMethodInsn(opcode, owner, name, descriptor, isInterface);
        }

        @Override
        public void visitEnd() {
            // 首先，处理自己的代码逻辑
            for (String item : list) {
                System.out.println(item);
            }

            // 其次，调用父类的方法实现
            super.visitEnd();
        }
    }
}
```

### 进行分析

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.Opcodes;

public class HelloWorldAnalysisCore {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes = FileUtils.readBytes(filepath);

        //（1）构建 ClassReader
        ClassReader cr = new ClassReader(bytes);

        //（2）分析 ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new MethodFindInvokeVisitor(api, null, "test", "(II)V");

        //（3）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);
    }
}
```

输出结果：

```text
INVOKESTATIC java/lang/Math.addExact(II)I
INVOKESTATIC java/lang/Integer.valueOf(I)Ljava/lang/Integer;
INVOKESTATIC java/lang/String.format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;
INVOKEVIRTUAL java/io/PrintStream.println(Ljava/lang/String;)V
```

## 示例二：被哪些方法所调用

在 IDEA 当中，有一个 Find Usages 功能：在类名、字段名、或方法名上，右键之后，选择 Find Usages，就可以查看该项内容在哪些地方被使用了。

![Find Usages](/assets/images/java/asm/find-usages.png)

查找结果如下：

![Find Usages Result](/assets/images/java/asm/find-usgaes-result.png)

这样一个功能，如果我们自己来实现，那该怎么编写 ASM 代码呢？

### 预期目标

假如有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public int add(int a, int b) {
        int c = a + b;
        test(a, b, c);
        return c;
    }

    public int sub(int a, int b) {
        int c = a - b;
        test(a, b, c);
        return c;
    }

    public int mul(int a, int b) {
        return a * b;
    }

    public int div(int a, int b) {
        return a / b;
    }

    public void test(int a, int b, int c) {
        String line = String.format("a = %d, b = %d, c = %d", a, b, c);
        System.out.println(line);
    }
}
```

我们想要实现的预期目标：找出是哪些方法对 `test()` 方法进行了调用。

### 编码实现

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;

import java.util.ArrayList;
import java.util.List;

import static org.objectweb.asm.Opcodes.ACC_ABSTRACT;
import static org.objectweb.asm.Opcodes.ACC_NATIVE;

public class MethodFindRefVisitor extends ClassVisitor {
    private final String methodOwner;
    private final String methodName;
    private final String methodDesc;

    private String owner;
    private final List<String> resultList = new ArrayList<>();

    public MethodFindRefVisitor(int api, ClassVisitor classVisitor, String methodOwner, String methodName, String methodDesc) {
        super(api, classVisitor);
        this.methodOwner = methodOwner;
        this.methodName = methodName;
        this.methodDesc = methodDesc;
    }

    @Override
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        super.visit(version, access, name, signature, superName, interfaces);
        this.owner = name;
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        boolean isAbstractMethod = (access & ACC_ABSTRACT) != 0;
        boolean isNativeMethod = (access & ACC_NATIVE) != 0;
        if (!isAbstractMethod && !isNativeMethod) {
            return new MethodFindRefAdaptor(api, null, owner, name, descriptor);
        }
        return null;
    }

    @Override
    public void visitEnd() {
        // 首先，处理自己的代码逻辑
        for (String item : resultList) {
            System.out.println(item);
        }

        // 其次，调用父类的方法实现
        super.visitEnd();
    }

    private class MethodFindRefAdaptor extends MethodVisitor {
        private final String currentMethodOwner;
        private final String currentMethodName;
        private final String currentMethodDesc;

        public MethodFindRefAdaptor(int api, MethodVisitor methodVisitor, String currentMethodOwner, String currentMethodName, String currentMethodDesc) {
            super(api, methodVisitor);
            this.currentMethodOwner = currentMethodOwner;
            this.currentMethodName = currentMethodName;
            this.currentMethodDesc = currentMethodDesc;
        }

        @Override
        public void visitMethodInsn(int opcode, String owner, String name, String descriptor, boolean isInterface) {
            // 首先，处理自己的代码逻辑
            if (methodOwner.equals(owner) && methodName.equals(name) && methodDesc.equals(descriptor)) {
                String info = String.format("%s.%s%s", currentMethodOwner, currentMethodName, currentMethodDesc);
                if (!resultList.contains(info)) {
                    resultList.add(info);
                }
            }

            // 其次，调用父类的方法实现
            super.visitMethodInsn(opcode, owner, name, descriptor, isInterface);
        }
    }
}
```

### 进行分析

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.Opcodes;

public class HelloWorldAnalysisCore {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes = FileUtils.readBytes(filepath);

        //（1）构建 ClassReader
        ClassReader cr = new ClassReader(bytes);

        //（2）分析 ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new MethodFindRefVisitor(api, null, "sample/HelloWorld", "test", "(III)V");

        //（3）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);
    }
}
```

输出结果：

```text
sample/HelloWorld.add(II)I
sample/HelloWorld.sub(II)I
```

## 总结

本文主要对查找 Instruction 进行了介绍，内容总结如下：

- 第一点，查找 Instruction 的过程，就是对 `MethodVisitor` 类的 `visitXxxInsn()` 方法及参数进行判断的过程。
- 第二点，查找 Instruction，并不属于 Class Transformation，而属于 Class Analysis。Class Analysis，只需要用到 `ClassReader` 和 `ClassVisitor` 类，而不需要用到 `ClassWriter` 类。
- 第三点，在两个代码示例中，都是围绕着“方法调用”展开，而“方法调用”就对应着 `MethodVisitor.visitMethodInsn()` 方法。

