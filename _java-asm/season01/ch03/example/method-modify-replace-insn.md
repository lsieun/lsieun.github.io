---
title: "修改已有的方法（修改－替换方法调用）"
sequence: "310"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## 如何替换 Instruction

有的时候，我们想替换掉某一条 instruction，那应该如何实现呢？其实，实现起来也很简单，就是**先找到该 instruction，然后在同样的位置替换成另一个 instruction 就可以了**。

![ 多个 FieldVisitor 和 MethodVisitor 串联到一起 ](/assets/images/java/asm/multiple-field-method-vistors-connected.png)

同样，我们也要注意：**在替换 instruction 的过程当中，operand stack 在修改前和修改后是一致的**。

在方法当中，替换 Instruction，有什么样的使用场景呢？比如说，第三方提供的 jar 包当中，可能在某一个 `.class` 文件当中调用了一个方法。这个方法，从某种程度上来说，你可能对它“不满意”。假如说，这个方法是一个验证逻辑的方法，你想替换成自己的验证逻辑，又或者说，它实现的功能比较简单，你想替换成功能更完善的方法，就可以把这个方法对应的 Instruction 替换掉。

## 示例：替换方法调用

### 预期目标

假如有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test(int a, int b) {
        int c = Math.max(a, b);
        System.out.println(c);
    }
}
```

其中，`test()` 方法对应的指令如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test(int, int);
    Code:
       0: iload_1
       1: iload_2
       2: invokestatic  #2                  // Method java/lang/Math.max:(II)I
       5: istore_3
       6: getstatic     #3                  // Field java/lang/System.out:Ljava/io/PrintStream;
       9: iload_3
      10: invokevirtual #4                  // Method java/io/PrintStream.println:(I)V
      13: return
}
```

我们想实现的预期目标有两个：

- 第一个，就是将静态方法 `Math.max()` 方法替换掉。
- 第二个，就是将非静态方法 `PrintStream.println()` 方法替换掉。

### 编码实现

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;

import static org.objectweb.asm.Opcodes.ACC_ABSTRACT;
import static org.objectweb.asm.Opcodes.ACC_NATIVE;

public class MethodReplaceInvokeVisitor extends ClassVisitor {
    private final String oldOwner;
    private final String oldMethodName;
    private final String oldMethodDesc;

    private final int newOpcode;
    private final String newOwner;
    private final String newMethodName;
    private final String newMethodDesc;

    public MethodReplaceInvokeVisitor(int api, ClassVisitor classVisitor,
                                      String oldOwner, String oldMethodName, String oldMethodDesc,
                                      int newOpcode, String newOwner, String newMethodName, String newMethodDesc) {
        super(api, classVisitor);
        this.oldOwner = oldOwner;
        this.oldMethodName = oldMethodName;
        this.oldMethodDesc = oldMethodDesc;

        this.newOpcode = newOpcode;
        this.newOwner = newOwner;
        this.newMethodName = newMethodName;
        this.newMethodDesc = newMethodDesc;
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        if (mv != null && !"<init>".equals(name) && !"<clinit>".equals(name)) {
            boolean isAbstractMethod = (access & ACC_ABSTRACT) != 0;
            boolean isNativeMethod = (access & ACC_NATIVE) != 0;
            if (!isAbstractMethod && !isNativeMethod) {
                mv = new MethodReplaceInvokeAdapter(api, mv);
            }
        }
        return mv;
    }

    private class MethodReplaceInvokeAdapter extends MethodVisitor {
        public MethodReplaceInvokeAdapter(int api, MethodVisitor methodVisitor) {
            super(api, methodVisitor);
        }

        @Override
        public void visitMethodInsn(int opcode, String owner, String name, String descriptor, boolean isInterface) {
            if (oldOwner.equals(owner) && oldMethodName.equals(name) && oldMethodDesc.equals(descriptor)) {
                // 注意，最后一个参数是 false，会不会太武断呢？
                super.visitMethodInsn(newOpcode, newOwner, newMethodName, newMethodDesc, false);
            }
            else {
                super.visitMethodInsn(opcode, owner, name, descriptor, isInterface);
            }
        }
    }
}
```

在 `MethodReplaceInvokeAdapter` 类当中，`visitMethodInsn()` 方法有这么一行代码：

```text
// 注意，最后一个参数是 false，会不会太武断呢？
super.visitMethodInsn(newOpcode, newOwner, newMethodName, newMethodDesc, false);
```

在 `visitMethodInsn()` 方法中，最后一个参数是 `boolean isInterface`，它可以取值为 `true`，也可以取值为 `false`。如果它的值为 `true`，表示调用的方法是一个接口里的方法；如果它的值为 `false`，则表示调用的方法是类里面的方法。换句话说，这个 `boolean isInterface` 参数，本来可以有两个可选值，即 `true` 或 `false`；但是，我们直接提供一个固定值 `false`，完成没有考虑 `true` 的情况，这么做是不是太过武断了呢？

之所以要这么做，是因为一般情况下，替换后的方法是“自己写的某一个方法”，那么对于“这个方法”，我们有很大的“自主权”，可以把它放到一个接口里，也可以放在一个类里，可以把它写成一个 non-static 方法，也可以写成一个 static 方法。这样，我们完全可以把“这个方法”写成一个在类里的 static 方法。

### 进行转换

#### 替换 static 方法

在替换 static 方法的时候，要保证一点：替换方法前，和替换方法后，要保持“方法接收的参数”和“方法的返回类型”是一致的。

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
        ClassVisitor cv = new MethodReplaceInvokeVisitor(api, cw,
                "java/lang/Math", "max", "(II)I",
                Opcodes.INVOKESTATIC, "java/lang/Math", "min", "(II)I");

        //（4）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成 byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

#### 替换 non-static 方法

对于 non-static 方法来说，它有一个隐藏的 `this` 变量。我们在替换 non-static 方法的时候，要把 `this` 变量给“消耗”掉。

```java
public class ParameterUtils {
    public static void output(PrintStream printStream, int val) {
        printStream.println("ParameterUtils: " + val);
    }
}
```

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
        ClassVisitor cv = new MethodReplaceInvokeVisitor(api, cw,
                "java/io/PrintStream", "println", "(I)V",
                Opcodes.INVOKESTATIC, "sample/ParameterUtils", "output", "(Ljava/io/PrintStream;I)V");

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
        instance.test(10, 20);
    }
}
```

## 总结

本文主要对替换 Instruction 进行了介绍，内容总结如下：

- 第一点，替换 Instruction，实现思路是，先找到该 instruction，然后在同样的位置替换成另一个 instruction 就可以了。
- 第二点，替换 Instruction，要注意的地方是，保持 operand stack 在修改前和修改后是一致的。对于 static 方法和 non-static 方法，我们需要考虑是否要处理 `this` 变量。

其实，按照相同的思路，我们也可以将“对于字段的调用”替换成“对于方法的调用”。
