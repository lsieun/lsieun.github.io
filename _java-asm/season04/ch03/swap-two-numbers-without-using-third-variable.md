---
title: "Swap Two Numbers Without Using Third Variable"
sequence: "302"
---

使用Java语言，借助于第三个变量`tmp`，交换`a`和`b`两个变量的值：

```java
public class HelloWorld {
    public static void main(String[] args) {
        // a = 2, b = 3
        int a = 2;
        int b = 3;

        // swap a and b
        int tmp = a;
        a = b;
        b = tmp;

        // print a and b
        System.out.println(a); // 3
        System.out.println(b); // 2
    }
}
```

使用Java语言，不借助于第三个变量，交换`a`和`b`两个变量的值：

```java
public class HelloWorld {
    public static void main(String[] args) {
        // a = 2, b = 3
        int a = 2;
        int b = 3;

        // swap a and b
        a = a + b; // a = 5
        b = a - b; // b = 2
        a = a - b; // a = 3

        // print a and b
        System.out.println(a); // 3
        System.out.println(b); // 2
    }
}
```

使用ASM，交换`a`和`b`两个变量的值：

```java
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
            mv1.visitMaxs(1, 1);
            mv1.visitEnd();
        }

        {
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC | ACC_STATIC, "main", "([Ljava/lang/String;)V", null, null);
            mv2.visitCode();

            // a = 2, b = 3
            mv2.visitInsn(ICONST_2);
            mv2.visitVarInsn(ISTORE, 1);
            mv2.visitInsn(ICONST_3);
            mv2.visitVarInsn(ISTORE, 2);

            // swap a and b
            mv2.visitVarInsn(ILOAD, 1);
            mv2.visitVarInsn(ILOAD, 2);
            mv2.visitVarInsn(ISTORE, 1);
            mv2.visitVarInsn(ISTORE, 2);

            // print a and b
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitVarInsn(ILOAD, 1);
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(I)V", false);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitVarInsn(ILOAD, 2);
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(I)V", false);
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(2, 3);
            mv2.visitEnd();
        }
        cw.visitEnd();

        // (3) 调用toByteArray()方法
        return cw.toByteArray();
    }
}
```
