---
title: "Try-Catch:使用相同的代码处理逻辑"
sequence: "201"
---

## 预期目标

假如有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test(String name, int age) {
        int a = 1;
        int b = 2;
        System.out.println("Start where you are.");

        try {
            int length = name.length();
            System.out.println("name length is " + length);
        } catch (NullPointerException ex) {
            // 这里对异常进行了处理
            System.out.println("name is null");
        }

        System.out.println("Use what you have.");

        try {
            int val = 100 / age;
            System.out.println("val = " + val);
        } catch (ArithmeticException ex) {
            // 这里没有对异常进行任何处理
        }

        System.out.println("Do what you can.");
        System.out.println(a);
        System.out.println(b);
    }
}
```

我们想实现的预期目标：对`HelloWorld`类当中的`catch`代码块内的异常（`ex`）进行统一处理。

## 编码实现

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.Label;
import org.objectweb.asm.MethodVisitor;

import java.util.ArrayList;
import java.util.List;

import static org.objectweb.asm.Opcodes.*;

public class MethodWithSameTryCatchLogicVisitor extends ClassVisitor {
    public MethodWithSameTryCatchLogicVisitor(int api, ClassVisitor classVisitor) {
        super(api, classVisitor);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        if (mv != null) {
            boolean isAbstractMethod = (access & ACC_ABSTRACT) != 0;
            boolean isNativeMethod = (access & ACC_NATIVE) != 0;
            if (!isAbstractMethod && !isNativeMethod) {
                mv = new MethodWithSameTryCatchLogicAdapter(api, mv);
            }
        }
        return mv;
    }


    private static class MethodWithSameTryCatchLogicAdapter extends MethodVisitor {
        private final List<Label> handlerList = new ArrayList<>();

        public MethodWithSameTryCatchLogicAdapter(int api, MethodVisitor methodVisitor) {
            super(api, methodVisitor);
        }

        @Override
        public void visitTryCatchBlock(Label start, Label end, Label handler, String type) {
            // 首先，处理自己的代码逻辑
            if (!handlerList.contains(handler)) {
                handlerList.add(handler);
            }

            // 其次，调用父类的方法实现
            super.visitTryCatchBlock(start, end, handler, type);
        }

        @Override
        public void visitLabel(Label label) {
            // 首先，调用父类的方法实现
            super.visitLabel(label);

            // 其次，处理自己的代码逻辑
            // 需要注意：不要将operand stack上的异常给弄丢了。
            if (handlerList.contains(label)) {
                // 在这里，我们复制一份来使用
                super.visitInsn(DUP);
                super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
                super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/Exception", "printStackTrace", "(Ljava/io/PrintStream;)V", false);
            }
        }
    }
}
```

## 进行转换

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

public class HelloWorldTransformCore {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new MethodWithSameTryCatchLogicVisitor(api, cw);

        //（4）结合ClassReader和ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

## 验证结果

```java
import sample.HelloWorld;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        HelloWorld instance = new HelloWorld();
        instance.test(null, 0);
    }
}
```

## 总结
