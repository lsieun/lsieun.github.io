---
title: "Enum: Bytecode Perpective"
sequence: "110"
---

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldGenerateCore {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);

        // (1) 生成 byte[] 内容
        byte[] bytes = dump();

        // (2) 保存 byte[] 到文件
        FileUtils.writeBytes(filepath, bytes);
    }

    public static byte[] dump() throws Exception {
        // (1) 创建 ClassWriter 对象
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (2) 调用 visitXxx() 方法
        cw.visit(V1_8, ACC_PUBLIC | ACC_FINAL | ACC_SUPER | ACC_ENUM, "sample/HelloWorld",
                "Ljava/lang/Enum<Lsample/HelloWorld;>;", "java/lang/Enum", null);

        {
            FieldVisitor fv1 = cw.visitField(ACC_PUBLIC | ACC_FINAL | ACC_STATIC | ACC_ENUM, "AAA", "Lsample/HelloWorld;", null, null);
            fv1.visitEnd();
        }
        {
            FieldVisitor fv2 = cw.visitField(ACC_PUBLIC | ACC_FINAL | ACC_STATIC | ACC_ENUM, "BBB", "Lsample/HelloWorld;", null, null);
            fv2.visitEnd();
        }
        {
            FieldVisitor fv3 = cw.visitField(ACC_PRIVATE | ACC_FINAL | ACC_STATIC | ACC_SYNTHETIC, "$VALUES", "[Lsample/HelloWorld;", null, null);
            fv3.visitEnd();
        }
        {
            MethodVisitor mv1 = cw.visitMethod(ACC_PUBLIC | ACC_STATIC, "values", "()[Lsample/HelloWorld;", null, null);
            mv1.visitCode();
            mv1.visitFieldInsn(GETSTATIC, "sample/HelloWorld", "$VALUES", "[Lsample/HelloWorld;");
            mv1.visitMethodInsn(INVOKEVIRTUAL, "[Lsample/HelloWorld;", "clone", "()Ljava/lang/Object;", false);
            mv1.visitTypeInsn(CHECKCAST, "[Lsample/HelloWorld;");
            mv1.visitInsn(ARETURN);
            mv1.visitMaxs(1, 0);
            mv1.visitEnd();
        }
        {
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC | ACC_STATIC, "valueOf", "(Ljava/lang/String;)Lsample/HelloWorld;", null, null);
            mv2.visitCode();
            mv2.visitLdcInsn(Type.getType("Lsample/HelloWorld;"));
            mv2.visitVarInsn(ALOAD, 0);
            mv2.visitMethodInsn(INVOKESTATIC, "java/lang/Enum", "valueOf", "(Ljava/lang/Class;Ljava/lang/String;)Ljava/lang/Enum;", false);
            mv2.visitTypeInsn(CHECKCAST, "sample/HelloWorld");
            mv2.visitInsn(ARETURN);
            mv2.visitMaxs(2, 1);
            mv2.visitEnd();
        }
        {
            MethodVisitor mv3 = cw.visitMethod(ACC_PRIVATE, "<init>", "(Ljava/lang/String;I)V", "()V", null);
            mv3.visitCode();
            mv3.visitVarInsn(ALOAD, 0);
            mv3.visitVarInsn(ALOAD, 1);
            mv3.visitVarInsn(ILOAD, 2);
            mv3.visitMethodInsn(INVOKESPECIAL, "java/lang/Enum", "<init>", "(Ljava/lang/String;I)V", false);
            mv3.visitInsn(RETURN);
            mv3.visitMaxs(3, 3);
            mv3.visitEnd();
        }
        {
            MethodVisitor mv4 = cw.visitMethod(ACC_STATIC, "<clinit>", "()V", null, null);
            mv4.visitCode();
            mv4.visitTypeInsn(NEW, "sample/HelloWorld");
            mv4.visitInsn(DUP);
            mv4.visitLdcInsn("AAA");
            mv4.visitInsn(ICONST_0);
            mv4.visitMethodInsn(INVOKESPECIAL, "sample/HelloWorld", "<init>", "(Ljava/lang/String;I)V", false);
            mv4.visitFieldInsn(PUTSTATIC, "sample/HelloWorld", "AAA", "Lsample/HelloWorld;");
            
            mv4.visitTypeInsn(NEW, "sample/HelloWorld");
            mv4.visitInsn(DUP);
            mv4.visitLdcInsn("BBB");
            mv4.visitInsn(ICONST_1);
            mv4.visitMethodInsn(INVOKESPECIAL, "sample/HelloWorld", "<init>", "(Ljava/lang/String;I)V", false);
            mv4.visitFieldInsn(PUTSTATIC, "sample/HelloWorld", "BBB", "Lsample/HelloWorld;");
            
            mv4.visitInsn(ICONST_2);
            mv4.visitTypeInsn(ANEWARRAY, "sample/HelloWorld");
            mv4.visitInsn(DUP);
            mv4.visitInsn(ICONST_0);
            mv4.visitFieldInsn(GETSTATIC, "sample/HelloWorld", "AAA", "Lsample/HelloWorld;");
            mv4.visitInsn(AASTORE);
            
            mv4.visitInsn(DUP);
            mv4.visitInsn(ICONST_1);
            mv4.visitFieldInsn(GETSTATIC, "sample/HelloWorld", "BBB", "Lsample/HelloWorld;");
            mv4.visitInsn(AASTORE);
            
            mv4.visitFieldInsn(PUTSTATIC, "sample/HelloWorld", "$VALUES", "[Lsample/HelloWorld;");
            mv4.visitInsn(RETURN);
            mv4.visitMaxs(4, 0);
            mv4.visitEnd();
        }
        cw.visitEnd();

        // (3) 调用 toByteArray() 方法
        return cw.toByteArray();
    }
}
```
