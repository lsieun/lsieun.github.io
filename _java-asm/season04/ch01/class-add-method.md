---
title: "方法：添加"
sequence: "103"
---

## 预期目标

假如有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public int add(int a, int b) {
        return a + b;
    }

    public int sub(int a, int b) {
        return a - b;
    }
}
```

我们想实现的预期目标：为`HelloWorld`类添加`mul()`方法。

## 编码实现

`ClassAddMethodVisitor`类本身是一个抽象类，因此不能直接使用。

我们可以为`ClassAddMethodVisitor`类提供一个具体的子类，并实现它的`generateMethodBody()`方法；在使用过程当中，可以对`generateMethodBody()`方法接收的参数进行调整。

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;

public abstract class ClassAddMethodVisitor extends ClassVisitor {
    private final int methodAccess;
    private final String methodName;
    private final String methodDesc;
    private final String methodSignature;
    private final String[] methodExceptions;
    private boolean isMethodPresent;

    public ClassAddMethodVisitor(int api, ClassVisitor cv, int methodAccess, String methodName, String methodDesc,
                                 String signature, String[] exceptions) {
        super(api, cv);
        this.methodAccess = methodAccess;
        this.methodName = methodName;
        this.methodDesc = methodDesc;
        this.methodSignature = signature;
        this.methodExceptions = exceptions;
        this.isMethodPresent = false;
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        if (name.equals(methodName) && descriptor.equals(methodDesc)) {
            isMethodPresent = true;
        }
        return super.visitMethod(access, name, descriptor, signature, exceptions);
    }

    @Override
    public void visitEnd() {
        if (!isMethodPresent) {
            MethodVisitor mv = super.visitMethod(methodAccess, methodName, methodDesc, methodSignature, methodExceptions);
            if (mv != null) {
                // create method body
                generateMethodBody(mv);
            }
        }

        super.visitEnd();
    }

    protected abstract void generateMethodBody(MethodVisitor mv);
}
```

## 验证结果

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
        ClassVisitor cv = new ClassAddMethodVisitor(api, cw, Opcodes.ACC_PUBLIC, "mul", "(II)I", null, null) {
            @Override
            protected void generateMethodBody(MethodVisitor mv) {
                mv.visitCode();
                mv.visitVarInsn(Opcodes.ILOAD, 1);
                mv.visitVarInsn(Opcodes.ILOAD, 2);
                mv.visitInsn(Opcodes.IMUL);
                mv.visitInsn(Opcodes.IRETURN);
                mv.visitMaxs(2, 3);
                mv.visitEnd();
            }
        };

        //（4）结合ClassReader和ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

## 总结
