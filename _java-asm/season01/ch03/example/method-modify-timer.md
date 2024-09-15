---
title: "修改已有的方法（添加－进入和退出－方法计时）"
sequence: "307"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## 预期目标

假如有一个 `HelloWorld` 类，代码如下：

```java
import java.util.Random;

public class HelloWorld {

    public int add(int a, int b) throws InterruptedException {
        int c = a + b;
        Random rand = new Random(System.currentTimeMillis());
        int num = rand.nextInt(300);
        Thread.sleep(100 + num);
        return c;
    }

    public int sub(int a, int b) throws InterruptedException {
        int c = a - b;
        Random rand = new Random(System.currentTimeMillis());
        int num = rand.nextInt(400);
        Thread.sleep(100 + num);
        return c;
    }
}
```

我们想实现的预期目标：计算出方法的运行时间。这里有两种实现方式：

- 计算所有方法的运行时间
- 计算每个方法的运行时间

第一种方式，计算所有方法的运行时间，将该时间记录在 `timer` 字段当中：

```java
import java.util.Random;

public class HelloWorld {
    public static long timer;

    public int add(int a, int b) throws InterruptedException {
        timer -= System.currentTimeMillis();
        int c = a + b;
        Random rand = new Random(System.currentTimeMillis());
        int num = rand.nextInt(300);
        Thread.sleep(100 + num);
        timer += System.currentTimeMillis();
        return c;
    }

    public int sub(int a, int b) throws InterruptedException {
        timer -= System.currentTimeMillis();
        int c = a - b;
        Random rand = new Random(System.currentTimeMillis());
        int num = rand.nextInt(400);
        Thread.sleep(100 + num);
        timer += System.currentTimeMillis();
        return c;
    }
}
```

第二种方式，计算每个方法的运行时间，将每个方法的运行时间单独记录在对应的字段当中：

```java
import java.util.Random;

public class HelloWorld {
    public static long timer_add;
    public static long timer_sub;

    public int add(int a, int b) throws InterruptedException {
        timer_add -= System.currentTimeMillis();
        int c = a + b;
        Random rand = new Random(System.currentTimeMillis());
        int num = rand.nextInt(300);
        Thread.sleep(100 + num);
        timer_add += System.currentTimeMillis();
        return c;
    }

    public int sub(int a, int b) throws InterruptedException {
        timer_sub -= System.currentTimeMillis();
        int c = a - b;
        Random rand = new Random(System.currentTimeMillis());
        int num = rand.nextInt(400);
        Thread.sleep(100 + num);
        timer_sub += System.currentTimeMillis();
        return c;
    }
}
```

实现这个功能的思路：在“方法进入”的时候，减去一个时间戳；在“方法退出”的时候，加上一个时间戳，在这个过程当中就记录一个时间差。

有一个问题，我们为什么要计算方法的运行时间呢？如果我们想对现有的程序进行优化，那么需要对程序的整体性能有所了解，而方法的运行时间是衡量程序性能的一个重要参考。

## 第一种实现方式

### 编码实现

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.FieldVisitor;
import org.objectweb.asm.MethodVisitor;

import static org.objectweb.asm.Opcodes.*;

public class MethodTimerVisitor extends ClassVisitor {
    private String owner;
    private boolean isInterface;

    public MethodTimerVisitor(int api, ClassVisitor classVisitor) {
        super(api, classVisitor);
    }

    @Override
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        super.visit(version, access, name, signature, superName, interfaces);
        owner = name;
        isInterface = (access & ACC_INTERFACE) != 0;
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        if (!isInterface && mv != null && !"<init>".equals(name) && !"<clinit>".equals(name)) {
            boolean isAbstractMethod = (access & ACC_ABSTRACT) != 0;
            boolean isNativeMethod = (access & ACC_NATIVE) != 0;
            if (!isAbstractMethod && !isNativeMethod) {
                mv = new MethodTimerAdapter(api, mv, owner);
            }
        }
        return mv;
    }

    @Override
    public void visitEnd() {
        if (!isInterface) {
            FieldVisitor fv = super.visitField(ACC_PUBLIC | ACC_STATIC, "timer", "J", null, null);
            if (fv != null) {
                fv.visitEnd();
            }
        }
        super.visitEnd();
    }

    private static class MethodTimerAdapter extends MethodVisitor {
        private final String owner;

        public MethodTimerAdapter(int api, MethodVisitor mv, String owner) {
            super(api, mv);
            this.owner = owner;
        }

        @Override
        public void visitCode() {
            // 首先，处理自己的代码逻辑
            super.visitFieldInsn(GETSTATIC, owner, "timer", "J");
            super.visitMethodInsn(INVOKESTATIC, "java/lang/System", "currentTimeMillis", "()J", false);
            super.visitInsn(LSUB);
            super.visitFieldInsn(PUTSTATIC, owner, "timer", "J");

            // 其次，调用父类的方法实现
            super.visitCode();
        }

        @Override
        public void visitInsn(int opcode) {
            // 首先，处理自己的代码逻辑
            if ((opcode >= IRETURN && opcode <= RETURN) || opcode == ATHROW) {
                super.visitFieldInsn(GETSTATIC, owner, "timer", "J");
                super.visitMethodInsn(INVOKESTATIC, "java/lang/System", "currentTimeMillis", "()J", false);
                super.visitInsn(LADD);
                super.visitFieldInsn(PUTSTATIC, owner, "timer", "J");
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
        ClassVisitor cv = new MethodTimerVisitor(api, cw);

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
import java.lang.reflect.Field;
import java.util.Random;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        // 第一部分，先让“子弹飞一会儿”，让程序运行一段时间
        HelloWorld instance = new HelloWorld();
        Random rand = new Random(System.currentTimeMillis());
        for (int i = 0; i < 10; i++) {
            boolean flag = rand.nextBoolean();
            int a = rand.nextInt(50);
            int b = rand.nextInt(50);
            if (flag) {
                int c = instance.add(a, b);
                String line = String.format("%d + %d = %d", a, b, c);
                System.out.println(line);
            }
            else {
                int c = instance.sub(a, b);
                String line = String.format("%d - %d = %d", a, b, c);
                System.out.println(line);
            }
        }

        // 第二部分，来查看方法运行的时间
        Class<?> clazz = HelloWorld.class;
        Field[] declaredFields = clazz.getDeclaredFields();
        for (Field f : declaredFields) {
            String fieldName = f.getName();
            f.setAccessible(true);
            if (fieldName.startsWith("timer")) {
                Object FieldValue = f.get(null);
                System.out.println(fieldName + " = " + FieldValue);
            }
        }
    }
}
```

## 第二种实现方式

### 编码实现

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.FieldVisitor;
import org.objectweb.asm.MethodVisitor;

import static org.objectweb.asm.Opcodes.*;

public class MethodTimerVisitor2 extends ClassVisitor {
    private String owner;
    private boolean isInterface;

    public MethodTimerVisitor2(int api, ClassVisitor classVisitor) {
        super(api, classVisitor);
    }

    @Override
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        super.visit(version, access, name, signature, superName, interfaces);
        owner = name;
        isInterface = (access & ACC_INTERFACE) != 0;
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        if (!isInterface && mv != null && !"<init>".equals(name) && !"<clinit>".equals(name)) {
            boolean isAbstractMethod = (access & ACC_ABSTRACT) != 0;
            boolean isNativeMethod = (access & ACC_NATIVE) != 0;
            if (!isAbstractMethod && !isNativeMethod) {
                // 每遇到一个合适的方法，就添加一个相应的字段
                FieldVisitor fv = super.visitField(ACC_PUBLIC | ACC_STATIC, getFieldName(name), "J", null, null);
                if (fv != null) {
                    fv.visitEnd();
                }

                mv = new MethodTimerAdapter2(api, mv, owner, name);
            }
            
        }
        return mv;
    }


    private String getFieldName(String methodName) {
        return "timer_" + methodName;
    }

    private class MethodTimerAdapter2 extends MethodVisitor {
        private final String owner;
        private final String methodName;

        public MethodTimerAdapter2(int api, MethodVisitor mv, String owner, String methodName) {
            super(api, mv);
            this.owner = owner;
            this.methodName = methodName;
        }

        @Override
        public void visitCode() {
            // 首先，处理自己的代码逻辑
            super.visitFieldInsn(GETSTATIC, owner, getFieldName(methodName), "J"); // 注意，字段名字要对应
            super.visitMethodInsn(INVOKESTATIC, "java/lang/System", "currentTimeMillis", "()J", false);
            super.visitInsn(LSUB);
            super.visitFieldInsn(PUTSTATIC, owner, getFieldName(methodName), "J"); // 注意，字段名字要对应

            // 其次，调用父类的方法实现
            super.visitCode();
        }

        @Override
        public void visitInsn(int opcode) {
            // 首先，处理自己的代码逻辑
            if ((opcode >= IRETURN && opcode <= RETURN) || opcode == ATHROW) {
                super.visitFieldInsn(GETSTATIC, owner, getFieldName(methodName), "J"); // 注意，字段名字要对应
                super.visitMethodInsn(INVOKESTATIC, "java/lang/System", "currentTimeMillis", "()J", false);
                super.visitInsn(LADD);
                super.visitFieldInsn(PUTSTATIC, owner, getFieldName(methodName), "J"); // 注意，字段名字要对应
            }

            // 其次，调用父类的方法实现
            super.visitInsn(opcode);
        }
    }
}
```

输出结果：

```text
7 + 30 = 37
19 - 26 = -7
27 + 36 = 63
8 + 5 = 13
42 - 10 = 32
27 + 17 = 44
16 - 40 = -24
44 + 23 = 67
14 + 29 = 43
20 - 27 = -7
timer_add = 1596
timer_sub = 974
```

## 总结

本文主要介绍了如何计算方法的运行时间，内容总结如下：

- 第一点，从实现思路的角度来说，计算方法的运行时间，是在“方法进入”和“方法退出”的基础上实现的。在“方法进入”的时候，减去一个时间戳；在“方法退出”的时候，加上一个时间戳。
- 第二点，我们提供了两种实现方式
    - 第一种实现方式，计算类里面所有方法的总运行时间
    - 第二种实现方式，计算类里面每个方法的单独运行时间
  
其实，遵循同样的思路，我们也可以计算方法运行的总次数；再进一步，我们可以计算出方法多次运行后的平均执行时间。

