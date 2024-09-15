---
title: "ByteArrayClassLoader"
sequence: "301"
---

通过`ByteArrayClassLoader`将ASM生成的`byte[]`加载到JVM当中，然后调用其`main`方法。

## ByteArrayClassLoader

```java
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.Type;

public class ByteArrayClassLoader extends ClassLoader {
    public final Class<?> defineClass(byte[] bytes) {
        ClassReader cr = new ClassReader(bytes);
        String internalName = cr.getClassName();
        String className = Type.getObjectType(internalName).getClassName();
        return defineClass(className, bytes);
    }

    public Class<?> defineClass(String name, byte[] bytes) {
        return super.defineClass(name, bytes, 0, bytes.length);
    }
}
```

## 示例

预期目标：

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello ASM");
    }
}
```

使用ASM生成`byte[]`内容：

```java
public class HelloWorldGenerateCore {
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
            mv1.visitMaxs(1, 1);
            mv1.visitEnd();
        }

        {
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC | ACC_STATIC, "main", "([Ljava/lang/String;)V", null, null);
            mv2.visitCode();
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("Hello ASM");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(2, 1);
            mv2.visitEnd();
        }
        cw.visitEnd();

        // (3) 调用toByteArray()方法
        return cw.toByteArray();
    }
}
```

进行测试：

```java
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        byte[] bytes = HelloWorldGenerateCore.dump();

        ByteArrayClassLoader loader = new ByteArrayClassLoader();
        Class<?> clazz = loader.defineClass(bytes);
        Method m = clazz.getDeclaredMethod("main", String[].class);
        m.invoke(null, (Object) new String[0]);
    }
}
```

输出结果：

```text
Hello ASM
```
