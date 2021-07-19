---
title:  "Try-Catch:为整个方法添加try-catch"
sequence: "202"
---

## 预期目标

假如有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test(String name, int age) {
        try {
            int length = name.length();
            System.out.println("length = " + length);
        } catch (Exception ex) {
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

我们想实现的预期目标：将整个`test()`方法添加一个try-catch语句。

## 编码实现

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.Label;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

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
                mv = new MethodWithWholeTryCatchAdapter(api, mv);
            }
        }
        return mv;
    }

    private static class MethodWithWholeTryCatchAdapter extends MethodVisitor {
        private Label startLabel = new Label();
        private Label endLabel = new Label();
        private Label handlerLabel = new Label();

        public MethodWithWholeTryCatchAdapter(int api, MethodVisitor methodVisitor) {
            super(api, methodVisitor);
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
            super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            super.visitLdcInsn("catch Exception");
            super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            super.visitInsn(Opcodes.ATHROW);

            // (4) visitTryCatchBlock
            super.visitTryCatchBlock(startLabel, endLabel, handlerLabel, "java/lang/Exception");

            // 其次，调用父类的方法实现
            super.visitMaxs(maxStack, maxLocals);
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
        ClassVisitor cv = new MethodWithWholeTryCatchVisitor(api, cw, "test", "(Ljava/lang/String;I)V");

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
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        instance.test(null, 0);
    }
}
```
