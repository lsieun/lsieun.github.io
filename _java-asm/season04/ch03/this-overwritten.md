---
title: "this overwritten"
sequence: "305"
---

## Application

### HelloWorld

```java
package sample;

public class HelloWorld {
    public void test(int a, int b) {
        int hashCode = this.hashCode();
        int diff = a - b;
        int sum = a + b;
        int result = hashCode + diff * sum;
        System.out.println(result);
    }

    @Override
    public int hashCode() {
        return 100;
    }
}
```

```text
test:(II)V
000:    aload_0                                 {HelloWorld, I, I, ., ., ., .} | {}
001:    invokevirtual HelloWorld.hashCode       {HelloWorld, I, I, ., ., ., .} | {HelloWorld}
002:    istore_3                                {HelloWorld, I, I, ., ., ., .} | {I}
003:    iload_1                                 {HelloWorld, I, I, I, ., ., .} | {}
004:    iload_2                                 {HelloWorld, I, I, I, ., ., .} | {I}
005:    isub                                    {HelloWorld, I, I, I, ., ., .} | {I, I}
006:    istore 4                                {HelloWorld, I, I, I, ., ., .} | {I}
007:    iload_1                                 {HelloWorld, I, I, I, I, ., .} | {}
008:    iload_2                                 {HelloWorld, I, I, I, I, ., .} | {I}
009:    iadd                                    {HelloWorld, I, I, I, I, ., .} | {I, I}
010:    istore 5                                {HelloWorld, I, I, I, I, ., .} | {I}
011:    iload_3                                 {HelloWorld, I, I, I, I, I, .} | {}
012:    iload 4                                 {HelloWorld, I, I, I, I, I, .} | {I}
013:    iload 5                                 {HelloWorld, I, I, I, I, I, .} | {I, I}
014:    imul                                    {HelloWorld, I, I, I, I, I, .} | {I, I, I}
015:    iadd                                    {HelloWorld, I, I, I, I, I, .} | {I, I}
016:    istore 6                                {HelloWorld, I, I, I, I, I, .} | {I}
017:    getstatic System.out                    {HelloWorld, I, I, I, I, I, I} | {}
018:    iload 6                                 {HelloWorld, I, I, I, I, I, I} | {PrintStream}
019:    invokevirtual PrintStream.println       {HelloWorld, I, I, I, I, I, I} | {PrintStream, I}
020:    return                                  {HelloWorld, I, I, I, I, I, I} | {}
```

### HelloWorldRun

```java
import sample.HelloWorld;

public class HelloWorldRun {
    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            HelloWorld instance = new HelloWorld();
            instance.test(10, 5);
            System.out.println("===========================");
        }
    }
}
```

## 优化

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

import static org.objectweb.asm.Opcodes.*;

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
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC, "test", "(II)V", null, null);
            mv2.visitCode();
            mv2.visitVarInsn(ALOAD, 0);
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/lang/Object", "hashCode", "()I", false);
            mv2.visitVarInsn(ISTORE, 0);
            mv2.visitVarInsn(ILOAD, 1);
            mv2.visitInsn(DUP);
            mv2.visitVarInsn(ILOAD, 2);
            mv2.visitInsn(ISUB);
            mv2.visitVarInsn(ISTORE, 1);
            mv2.visitVarInsn(ILOAD, 2);
            mv2.visitInsn(IADD);
            mv2.visitVarInsn(ISTORE, 2);
            mv2.visitVarInsn(ILOAD, 0);
            mv2.visitVarInsn(ILOAD, 1);
            mv2.visitVarInsn(ILOAD, 2);
            mv2.visitInsn(IMUL);
            mv2.visitInsn(IADD);
            mv2.visitVarInsn(ISTORE, 0);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitVarInsn(ILOAD, 0);
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(I)V", false);
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(3, 3);
            mv2.visitEnd();
        }

        {
            MethodVisitor mv3 = cw.visitMethod(ACC_PUBLIC, "hashCode", "()I", null, null);
            mv3.visitCode();
            mv3.visitIntInsn(BIPUSH, 100);
            mv3.visitInsn(IRETURN);
            mv3.visitMaxs(1, 1);
            mv3.visitEnd();
        }
        cw.visitEnd();

        // (3) 调用toByteArray()方法
        return cw.toByteArray();
    }
}
```

```text
test:(II)V
000:    aload_0                                 {HelloWorld, I, I} | {}
001:    invokevirtual Object.hashCode           {HelloWorld, I, I} | {HelloWorld}
002:    istore_0                                {HelloWorld, I, I} | {I}
003:    iload_1                                 {I, I, I} | {}
004:    dup                                     {I, I, I} | {I}
005:    iload_2                                 {I, I, I} | {I, I}
006:    isub                                    {I, I, I} | {I, I, I}
007:    istore_1                                {I, I, I} | {I, I}
008:    iload_2                                 {I, I, I} | {I}
009:    iadd                                    {I, I, I} | {I, I}
010:    istore_2                                {I, I, I} | {I}
011:    iload_0                                 {I, I, I} | {}
012:    iload_1                                 {I, I, I} | {I}
013:    iload_2                                 {I, I, I} | {I, I}
014:    imul                                    {I, I, I} | {I, I, I}
015:    iadd                                    {I, I, I} | {I, I}
016:    istore_0                                {I, I, I} | {I}
017:    getstatic System.out                    {I, I, I} | {}
018:    iload_0                                 {I, I, I} | {PrintStream}
019:    invokevirtual PrintStream.println       {I, I, I} | {PrintStream, I}
020:    return                                  {I, I, I} | {}
```

## 处理

### ChangeThisNode

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.Type;
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.InsnList;
import org.objectweb.asm.tree.MethodNode;

import static org.objectweb.asm.Opcodes.*;

public class ChangeThisNode extends ClassNode {
    public ChangeThisNode(int api, ClassVisitor cv) {
        super(api);
        this.cv = cv;
    }

    @Override
    public void visitEnd() {
        // 首先，处理自己的代码逻辑
        int size = methods.size();
        for (int i = 0; i < size; i++) {
            MethodNode mn = methods.get(i);
            if ("<init>".equals(mn.name) || "<clinit>".equals(mn.name)) {
                continue;
            }
            InsnList instructions = mn.instructions;
            if (instructions.size() == 0) {
                continue;
            }

            int maxLocals = mn.maxLocals;

            int api = Opcodes.ASM9;
            MethodNode newMethodNode = new MethodNode(api, mn.access, mn.name, mn.desc, mn.signature, mn.exceptions.toArray(new String[0]));
            MethodVisitor mv = new ChangeThisAdapter(api, newMethodNode, mn.access, mn.name, mn.desc, maxLocals);
            mn.accept(mv);
            methods.set(i, newMethodNode);
        }

        // 其次，调用父类的方法实现（根据实际情况，选择保留，或删除）
        super.visitEnd();

        // 最后，向后续ClassVisitor传递
        if (cv != null) {
            accept(cv);
        }
    }

    private static class ChangeThisAdapter extends MethodVisitor {
        private final int methodAccess;
        private final String methodName;
        private final String methodDesc;
        private final int maxLocals;

        public ChangeThisAdapter(int api, MethodVisitor mv, int access, String methodName, String descriptor, int maxLocals) {
            super(api, mv);
            this.methodAccess = access;
            this.methodName = methodName;
            this.methodDesc = descriptor;
            this.maxLocals = maxLocals;
        }

        @Override
        public void visitCode() {
            // 首先，处理自己的代码逻辑
            boolean isStatic = (methodAccess & ACC_STATIC) != 0;

            // 第一步，考虑要不要复制this：
            // - 如果是static方法，就不复制了；
            // - 如果是non-static方法，就进行复制
            if (!isStatic) {
                //进入这里，说明是non-static方法，对this进行复制
                super.visitVarInsn(ALOAD, 0);
                super.visitVarInsn(ASTORE, getBackUpIndex(0));
            }

            // 第二步，考虑方法接收的参数
            // 根据方法描述符（methodDesc）获取各个参数的类型
            Type methodType = Type.getMethodType(methodDesc);
            Type[] argumentTypes = methodType.getArgumentTypes();

            // 对各个参数类型进行循环
            int localIndex = isStatic ? 0 : 1;
            for (Type t : argumentTypes) {
                // 将参数加载到栈上
                int load_opcode = t.getOpcode(ILOAD);
                super.visitVarInsn(load_opcode, localIndex);

                // 放到结尾目标位置
                int store_opcode = t.getOpcode(ISTORE);
                super.visitVarInsn(store_opcode, getBackUpIndex(localIndex));

                // 更新索引的位置
                localIndex += t.getSize();
            }

            // 其次，调用父类的方法实现
            super.visitCode();
        }

        @Override
        public void visitInsn(int opcode) {
            // 首先，处理自己的代码逻辑
            if (opcode == ATHROW || (opcode >= IRETURN && opcode <= RETURN)) {
                // 首先，处理自己的代码逻辑
                boolean isStatic = (methodAccess & ACC_STATIC) != 0;

                if (!isStatic) {
                    super.visitVarInsn(ALOAD, getBackUpIndex(0));
                    super.visitInsn(POP);
                }

                Type methodType = Type.getMethodType(methodDesc);
                Type[] argumentTypes = methodType.getArgumentTypes();
                int localIndex = isStatic ? 0 : 1;
                for (Type t : argumentTypes) {
                    int load_opcode = t.getOpcode(ILOAD);
                    super.visitVarInsn(load_opcode, getBackUpIndex(localIndex));
                    int size = t.getSize();
                    if (size == 1) {
                        super.visitInsn(POP);
                    }
                    else {
                        super.visitInsn(POP2);
                    }
                    localIndex += t.getSize();
                }

                super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
                super.visitLdcInsn("%s %s:%s");
                super.visitInsn(ICONST_3);
                super.visitTypeInsn(ANEWARRAY, "java/lang/Object");
                super.visitInsn(DUP);
                super.visitInsn(ICONST_0);
                super.visitVarInsn(ALOAD, getBackUpIndex(0));
                super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/Object", "getClass", "()Ljava/lang/Class;", false);
                super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/Class", "getName", "()Ljava/lang/String;", false);
                super.visitInsn(AASTORE);
                super.visitInsn(DUP);
                super.visitInsn(ICONST_1);
                super.visitLdcInsn(methodName);
                super.visitInsn(AASTORE);
                super.visitInsn(DUP);
                super.visitInsn(ICONST_2);
                super.visitLdcInsn(methodDesc);
                super.visitInsn(AASTORE);
                super.visitMethodInsn(INVOKESTATIC, "java/lang/String", "format", "(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;", false);
                super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            }

            // 其次，调用父类的方法实现
            super.visitInsn(opcode);
        }

        private int getBackUpIndex(int localIndex) {
            return maxLocals + localIndex;
        }
    }
}
```

### HelloWorldTransformTree

```java
import lsieun.asm.tree.*;
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.*;

public class HelloWorldTransformTree {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        // (1)构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        // (2)构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_MAXS);

        // (3)串连ClassNode
        int api = Opcodes.ASM9;
        ClassNode cn = new ChangeThisNode(api, cw);

        //（4）结合ClassReader和ClassNode
        int parsingOptions = ClassReader.SKIP_DEBUG;
        cr.accept(cn, parsingOptions);

        // (5) 生成byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

