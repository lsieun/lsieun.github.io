---
title:  "Tree Based Method Transformation示例"
sequence: "304"
---

[上级目录]({% link _posts/2021-05-01-java-asm-season-03.md %})

## 示例一：方法计时

### 预期目标

假如有一个`HelloWorld`类，代码如下：

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

我们想实现的预期目标：计算出方法的运行时间。

### 编码实现

```java
import org.objectweb.asm.tree.*;

import java.util.ListIterator;

import static org.objectweb.asm.Opcodes.*;

public class MethodAddTimerTransformer extends ClassTransformer {
    public MethodAddTimerTransformer(ClassTransformer ct) {
        super(ct);
    }

    @Override
    public void transform(ClassNode cn) {
        for (MethodNode mn : cn.methods) {
            if ("<init>".equals(mn.name) || "<clinit>".equals(mn.name)) {
                continue;
            }
            InsnList instructions = mn.instructions;
            if (instructions.size() == 0) {
                continue;
            }
            ListIterator<AbstractInsnNode> it = instructions.iterator();
            while (it.hasNext()) {
                AbstractInsnNode item = it.next();
                int opcode = item.getOpcode();
                if ((opcode >= IRETURN && opcode <= RETURN) || (opcode == ATHROW)) {
                    InsnList il = new InsnList();
                    il.add(new FieldInsnNode(GETSTATIC, cn.name, "timer", "J"));
                    il.add(new MethodInsnNode(INVOKESTATIC, "java/lang/System", "currentTimeMillis", "()J"));
                    il.add(new InsnNode(LADD));
                    il.add(new FieldInsnNode(PUTSTATIC, cn.name, "timer", "J"));
                    instructions.insert(item.getPrevious(), il);
                }
            }

            InsnList il = new InsnList();
            il.add(new FieldInsnNode(GETSTATIC, cn.name, "timer", "J"));
            il.add(new MethodInsnNode(INVOKESTATIC, "java/lang/System", "currentTimeMillis", "()J"));
            il.add(new InsnNode(LSUB));
            il.add(new FieldInsnNode(PUTSTATIC, cn.name, "timer", "J"));
            instructions.insert(il);

            mn.maxLocals = 0;
            mn.maxStack = 0;
        }

        int acc = ACC_PUBLIC | ACC_STATIC;
        cn.fields.add(new FieldNode(acc, "timer", "J", null, null));
        super.transform(cn);
    }
}
```

### 进行转换

```java
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.ClassNode;

public class HelloWorldTransformTree {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        // (1)构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        // (2) 构建ClassNode
        int api = Opcodes.ASM9;
        ClassNode cn = new ClassNode(api);
        cr.accept(cn, ClassReader.SKIP_FRAMES | ClassReader.SKIP_DEBUG);

        // (3) 进行transform
        ClassTransformer ct = new MethodAddTimerTransformer(null);
        ct.transform(cn);

        // (4) 构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
        cn.accept(cw);

        // (5) 生成byte[]内容输出
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

### 验证结果

```java
import sample.HelloWorld;

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

## 示例二：移除字段赋值

### 预期目标

假如有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public int val;

    public void test(int a, int b) {
        int c = a + b;
        this.val = this.val;
        System.out.println(c);
    }
}
```

我们想要实现的预期目标：删除掉`this.val = this.val;`语句。

### 编码实现

```java
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.InsnList;
import org.objectweb.asm.tree.MethodNode;

public class MethodRemoveFieldSelfAssignTransformer extends ClassTransformer {

    public MethodRemoveFieldSelfAssignTransformer(ClassTransformer ct) {
        super(ct);
    }

    @Override
    public void transform(ClassNode cn) {
        for (MethodNode mn : cn.methods) {
            if ("<init>".equals(mn.name) || "<clinit>".equals(mn.name)) {
                continue;
            }
            InsnList instructions = mn.instructions;
            if (instructions.size() == 0) {
                continue;
            }
            MethodConverter mc = new MethodRemoveFieldSelfAssignConverter(null);
            mc.transform(mn);
        }

        super.transform(cn);
    }
}
```

```java
import org.objectweb.asm.tree.*;

import java.util.ListIterator;

import static org.objectweb.asm.Opcodes.*;

public class MethodRemoveFieldSelfAssignConverter extends MethodConverter {
    public MethodRemoveFieldSelfAssignConverter(MethodConverter mt) {
        super(mt);
    }

    @Override
    public void transform(MethodNode mn) {
        InsnList instructions = mn.instructions;
        ListIterator<AbstractInsnNode> it = instructions.iterator();
        while (it.hasNext()) {
            AbstractInsnNode node1 = it.next();
            if (isALOAD0(node1)) {
                AbstractInsnNode node2 = getNext(node1);
                if (node2 != null && isALOAD0(node2)) {
                    AbstractInsnNode node3 = getNext(node2);
                    if (node3 != null && node3.getOpcode() == GETFIELD) {
                        AbstractInsnNode node4 = getNext(node3);
                        if (node4 != null && node4.getOpcode() == PUTFIELD) {
                            if (sameField(node3, node4)) {
                                while (it.next() != node4) {
                                }
                                instructions.remove(node1);
                                instructions.remove(node2);
                                instructions.remove(node3);
                                instructions.remove(node4);
                            }
                        }
                    }
                }
            }
        }

        super.transform(mn);
    }

    private static AbstractInsnNode getNext(AbstractInsnNode insn) {
        do {
            insn = insn.getNext();
            if (insn != null && !(insn instanceof LineNumberNode)) {
                break;
            }
        } while (insn != null);
        return insn;
    }

    private static boolean isALOAD0(AbstractInsnNode insnNode) {
        return insnNode.getOpcode() == ALOAD && ((VarInsnNode) insnNode).var == 0;
    }

    private static boolean sameField(AbstractInsnNode oneInsnNode, AbstractInsnNode anotherInsnNode) {
        if (!(oneInsnNode instanceof FieldInsnNode)) return false;
        if (!(anotherInsnNode instanceof FieldInsnNode)) return false;
        FieldInsnNode fieldInsnNode1 = (FieldInsnNode) oneInsnNode;
        FieldInsnNode fieldInsnNode2 = (FieldInsnNode) anotherInsnNode;
        String name1 = fieldInsnNode1.name;
        String name2 = fieldInsnNode2.name;
        return name1.equals(name2);
    }
}
```

### 进行转换

```java
import lsieun.asm.tree.*;
import lsieun.asm.tree.ClassTransformer;
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.ClassNode;

public class HelloWorldTransformTree {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        // (1)构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        // (2) 构建ClassNode
        int api = Opcodes.ASM9;
        ClassNode cn = new ClassNode(api);
        cr.accept(cn, ClassReader.SKIP_FRAMES | ClassReader.SKIP_DEBUG);

        // (3) 进行transform
        ClassTransformer ct = new MethodRemoveFieldSelfAssignTransformer(null);
        ct.transform(cn);

        // (4) 构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
        cn.accept(cw);

        // (5) 生成byte[]内容输出
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

### 验证结果

```text
$ javap -c sample.HelloWorld
public class sample.HelloWorld {
  public int val;
...
  public void test(int, int);
    Code:
       0: iload_1
       1: iload_2
       2: iadd
       3: istore_3
       4: getstatic     #18                 // Field java/lang/System.out:Ljava/io/PrintStream;
       7: iload_3
       8: invokevirtual #24                 // Method java/io/PrintStream.println:(I)V
      11: return
}
```

## 示例三：优化跳转

### 预期目标

假如有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test(int val) {
        System.out.println(val == 0 ? "val is 0" : "val is not 0");
    }
}
```

接着，我们查看`test`方法所包含的instructions内容：

```text
javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test(int);
    Code:
       0: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
       3: iload_1
       4: ifne          12
       7: ldc           #3                  // String val is 0
       9: goto          14
      12: ldc           #4                  // String val is not 0
      14: invokevirtual #5                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      17: return
}
```

在保证`test`方法正常运行的前提下，打乱内部instructions之间的顺序：

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
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC, "test", "(I)V", null, null);

            Label startLabel = new Label();
            Label middleLabel = new Label();
            Label endLabel = new Label();
            Label ifLabel = new Label();
            Label elseLabel = new Label();
            Label printLabel = new Label();
            Label returnLabel = new Label();

            mv2.visitCode();
            mv2.visitJumpInsn(GOTO, middleLabel);
            mv2.visitLabel(returnLabel);
            mv2.visitInsn(RETURN);

            mv2.visitLabel(startLabel);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitVarInsn(ILOAD, 1);
            mv2.visitJumpInsn(GOTO, ifLabel);

            mv2.visitLabel(middleLabel);
            mv2.visitJumpInsn(GOTO, endLabel);

            mv2.visitLabel(ifLabel);
            mv2.visitJumpInsn(IFNE, elseLabel);
            mv2.visitLdcInsn("val is 0");
            mv2.visitJumpInsn(GOTO, printLabel);

            mv2.visitLabel(elseLabel);
            mv2.visitLdcInsn("val is not 0");

            mv2.visitLabel(printLabel);
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            mv2.visitJumpInsn(GOTO, returnLabel);

            mv2.visitLabel(endLabel);
            mv2.visitJumpInsn(GOTO, startLabel);

            mv2.visitMaxs(2, 2);
            mv2.visitEnd();
        }
        cw.visitEnd();

        // (3) 调用toByteArray()方法
        return cw.toByteArray();
    }
}
```

接着，我们查看`test`方法包含的instructions内容：

```text
$ javap -c sample.HelloWorld
public class sample.HelloWorld {
...
  public void test(int);
    Code:
       0: goto          11
       3: return
       4: getstatic     #16                 // Field java/lang/System.out:Ljava/io/PrintStream;
       7: iload_1
       8: goto          14
      11: goto          30
      14: ifne          22
      17: ldc           #18                 // String val is 0
      19: goto          24
      22: ldc           #20                 // String val is not 0
      24: invokevirtual #26                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      27: goto          3
      30: goto          4
}
```

我们想要实现的预期目标：优化instruction的跳转。

### 编码实现

```java
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.InsnList;
import org.objectweb.asm.tree.MethodNode;

public class MethodOptimizeJumpTransformer extends ClassTransformer {
    public MethodOptimizeJumpTransformer(ClassTransformer ct) {
        super(ct);
    }

    @Override
    public void transform(ClassNode cn) {
        // 首先，处理自己的代码逻辑
        for (MethodNode mn : cn.methods) {
            if ("<init>".equals(mn.name) || "<clinit>".equals(mn.name)) {
                continue;
            }
            InsnList insns = mn.instructions;
            if (insns.size() == 0) {
                continue;
            }
            MethodTransformer mt = new MethodOptimizeJumpConverter(null);
            mt.transform(mn);
        }

        // 其次，调用父类的方法实现
        super.transform(cn);
    }
}
```

```java
import org.objectweb.asm.tree.*;

import static org.objectweb.asm.Opcodes.*;

public class MethodOptimizeJumpConverter extends MethodTransformer {
    public MethodOptimizeJumpConverter(MethodTransformer mt) {
        super(mt);
    }

    @Override
    public void transform(MethodNode mn) {
        // 首先，处理自己的代码逻辑
        InsnList instructions = mn.instructions;
        for (AbstractInsnNode insnNode : instructions) {
            if (insnNode instanceof JumpInsnNode) {
                JumpInsnNode jumpInsnNode = (JumpInsnNode) insnNode;
                LabelNode label = jumpInsnNode.label;
                AbstractInsnNode target;
                while (true) {
                    target = label;
                    while (target != null && target.getOpcode() < 0) {
                        target = target.getNext();
                    }

                    if (target != null && target.getOpcode() == GOTO) {
                        label = ((JumpInsnNode) target).label;
                    }
                    else {
                        break;
                    }
                }

                // update target
                jumpInsnNode.label = label;
                // if possible, replace jump with target instruction
                if (insnNode.getOpcode() == GOTO && target != null) {
                    int opcode = target.getOpcode();
                    if ((opcode >= IRETURN && opcode <= RETURN) || opcode == ATHROW) {
                        instructions.set(insnNode, target.clone(null));
                    }
                }
            }
        }

        // 其次，调用父类的方法实现
        super.transform(mn);
    }
}
```

### 进行转换

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
        if (bytes1 == null) {
            throw new RuntimeException("bytes1 is null");
        }

        // (1)构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        // (2) 构建ClassNode
        int api = Opcodes.ASM9;
        ClassNode cn = new ClassNode(api);
        cr.accept(cn, ClassReader.SKIP_FRAMES | ClassReader.SKIP_DEBUG);

        // (3) 进行transform
        ClassTransformer ct = new MethodOptimizeJumpTransformer(null);
        ct.transform(cn);

        // (4) 构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
        cn.accept(cw);

        // (5) 生成byte[]内容输出
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

### 验证结果

```java
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Object instance = clazz.newInstance();
        Method m = clazz.getDeclaredMethod("test", int.class);
        m.invoke(instance, 0);
        m.invoke(instance, 1);
    }
}
```

```text
$ javap -c sample.HelloWorld
public class sample.HelloWorld {
...
  public void test(int);
    Code:
       0: goto          4
       3: athrow
       4: getstatic     #16                 // Field java/lang/System.out:Ljava/io/PrintStream;
       7: iload_1
       8: goto          14
      11: nop
      12: nop
      13: athrow
      14: ifne          22
      17: ldc           #18                 // String val is 0
      19: goto          24
      22: ldc           #20                 // String val is not 0
      24: invokevirtual #26                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      27: return
      28: nop
      29: nop
      30: athrow
}
```
