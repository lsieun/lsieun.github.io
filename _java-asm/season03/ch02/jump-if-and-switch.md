---
title: "if和switch示例"
sequence: "206"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

实现if语句，要用到`JumpInsnNode`类；而实现switch语句，则需要用到`TableSwitchInsnNode`或`LookupSwitchInsnNode`类。

## 示例：if语句

### 预期目标

我们想实现的预期目标是生成`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test(int val) {
        if (val == 0) {
            System.out.println("val is 0");
        }
        else {
            System.out.println("val is not 0");
        }
    }
}
```

### 编码实现

```java
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.tree.*;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldGenerateTree {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);

        // (1) 生成byte[]内容
        byte[] bytes = dump();

        // (2) 保存byte[]到文件
        FileUtils.writeBytes(filepath, bytes);
    }

    public static byte[] dump() throws Exception {
        // (1) 使用ClassNode类收集数据
        ClassNode cn = new ClassNode();
        cn.version = V1_8;
        cn.access = ACC_PUBLIC | ACC_SUPER;
        cn.name = "sample/HelloWorld";
        cn.signature = null;
        cn.superName = "java/lang/Object";

        {
            MethodNode mn1 = new MethodNode(ACC_PUBLIC, "<init>", "()V", null, null);
            cn.methods.add(mn1);

            InsnList il = mn1.instructions;
            il.add(new VarInsnNode(ALOAD, 0));
            il.add(new MethodInsnNode(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false));
            il.add(new InsnNode(RETURN));

            mn1.maxStack = 1;
            mn1.maxLocals = 1;
        }

        {
            MethodNode mn2 = new MethodNode(ACC_PUBLIC, "test", "(I)V", null, null);
            cn.methods.add(mn2);

            LabelNode elseLabelNode = new LabelNode();
            LabelNode returnLabelNode = new LabelNode();

            // 第1段
            InsnList il = mn2.instructions;
            il.add(new VarInsnNode(ILOAD, 1));
            il.add(new JumpInsnNode(IFNE, elseLabelNode));

            // 第2段
            il.add(new FieldInsnNode(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;"));
            il.add(new LdcInsnNode("val is 0"));
            il.add(new MethodInsnNode(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false));
            il.add(new JumpInsnNode(GOTO, returnLabelNode));

            // 第3段
            il.add(elseLabelNode);
            il.add(new FieldInsnNode(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;"));
            il.add(new LdcInsnNode("val is not 0"));
            il.add(new MethodInsnNode(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false));

            // 第4段
            il.add(returnLabelNode);
            il.add(new InsnNode(RETURN));

            mn2.maxStack = 2;
            mn2.maxLocals = 2;
        }

        // (2) 使用ClassWriter类生成字节码
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
        cn.accept(cw);
        return cw.toByteArray();
    }
}
```

### 验证结果

```java
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Method m = clazz.getDeclaredMethod("test", int.class);
        Object instance = clazz.newInstance();
        m.invoke(instance, 0);
    }
}
```

## 示例：tableswitch

### 预期目标

我们想实现的预期目标是生成`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test(int val) {
        switch (val) {
            case 1:
                System.out.println("val = 1");
                break;
            case 2:
                System.out.println("val = 2");
                break;
            case 3:
                System.out.println("val = 3");
                break;
            case 4:
                System.out.println("val = 4");
                break;
            default:
                System.out.println("val is unknown");
        }
    }
}
```

### 编码实现

```java
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.tree.*;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldGenerateTree {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);

        // (1) 生成byte[]内容
        byte[] bytes = dump();

        // (2) 保存byte[]到文件
        FileUtils.writeBytes(filepath, bytes);
    }

    public static byte[] dump() throws Exception {
        // (1) 使用ClassNode类收集数据
        ClassNode cn = new ClassNode();
        cn.version = V1_8;
        cn.access = ACC_PUBLIC | ACC_SUPER;
        cn.name = "sample/HelloWorld";
        cn.signature = null;
        cn.superName = "java/lang/Object";

        {
            MethodNode mn1 = new MethodNode(ACC_PUBLIC, "<init>", "()V", null, null);
            cn.methods.add(mn1);

            InsnList il = mn1.instructions;
            il.add(new VarInsnNode(ALOAD, 0));
            il.add(new MethodInsnNode(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false));
            il.add(new InsnNode(RETURN));

            mn1.maxStack = 1;
            mn1.maxLocals = 1;
        }

        {
            MethodNode mn2 = new MethodNode(ACC_PUBLIC, "test", "(I)V", null, null);
            cn.methods.add(mn2);

            LabelNode caseLabelNode1 = new LabelNode();
            LabelNode caseLabelNode2 = new LabelNode();
            LabelNode caseLabelNode3 = new LabelNode();
            LabelNode caseLabelNode4 = new LabelNode();
            LabelNode defaultLabelNode = new LabelNode();
            LabelNode returnLabelNode = new LabelNode();

            // 第1段
            InsnList il = mn2.instructions;
            il.add(new VarInsnNode(ILOAD, 1));
            il.add(new TableSwitchInsnNode(1, 4, defaultLabelNode, new LabelNode[] { caseLabelNode1, caseLabelNode2, caseLabelNode3, caseLabelNode4 }));

            // 第2段
            il.add(caseLabelNode1);
            il.add(new FieldInsnNode(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;"));
            il.add(new LdcInsnNode("val = 1"));
            il.add(new MethodInsnNode(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false));
            il.add(new JumpInsnNode(GOTO, returnLabelNode));

            // 第3段
            il.add(caseLabelNode2);
            il.add(new FieldInsnNode(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;"));
            il.add(new LdcInsnNode("val = 2"));
            il.add(new MethodInsnNode(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false));
            il.add(new JumpInsnNode(GOTO, returnLabelNode));

            // 第4段
            il.add(caseLabelNode3);
            il.add(new FieldInsnNode(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;"));
            il.add(new LdcInsnNode("val = 3"));
            il.add(new MethodInsnNode(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false));
            il.add(new JumpInsnNode(GOTO, returnLabelNode));

            // 第5段
            il.add(caseLabelNode4);
            il.add(new FieldInsnNode(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;"));
            il.add(new LdcInsnNode("val = 4"));
            il.add(new MethodInsnNode(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false));
            il.add(new JumpInsnNode(GOTO, returnLabelNode));

            // 第6段
            il.add(defaultLabelNode);
            il.add(new FieldInsnNode(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;"));
            il.add(new LdcInsnNode("val is unknown"));
            il.add(new MethodInsnNode(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false));

            // 第7段
            il.add(returnLabelNode);
            il.add(new InsnNode(RETURN));

            mn2.maxStack = 2;
            mn2.maxLocals = 2;
        }

        // (2) 使用ClassWriter类生成字节码
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
        cn.accept(cw);
        return cw.toByteArray();
    }
}
```

### 验证结果

```java
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Method m = clazz.getDeclaredMethod("test", int.class);
        Object instance = clazz.newInstance();
        for (int i = 0; i < 5; i++) {
            m.invoke(instance, i);
        }
    }
}
```

## 示例：lookupswitch

### 预期目标

我们想实现的预期目标是生成`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test(int val) {
        switch (val) {
            case 10:
                System.out.println("val = 10");
                break;
            case 20:
                System.out.println("val = 20");
                break;
            case 30:
                System.out.println("val = 30");
                break;
            case 40:
                System.out.println("val = 40");
                break;
            default:
                System.out.println("val is unknown");
        }
    }
}
```

### 编码实现

```java
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.tree.*;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldGenerateTree {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);

        // (1) 生成byte[]内容
        byte[] bytes = dump();

        // (2) 保存byte[]到文件
        FileUtils.writeBytes(filepath, bytes);
    }

    public static byte[] dump() throws Exception {
        // (1) 使用ClassNode类收集数据
        ClassNode cn = new ClassNode();
        cn.version = V1_8;
        cn.access = ACC_PUBLIC | ACC_SUPER;
        cn.name = "sample/HelloWorld";
        cn.signature = null;
        cn.superName = "java/lang/Object";

        {
            MethodNode mn1 = new MethodNode(ACC_PUBLIC, "<init>", "()V", null, null);
            cn.methods.add(mn1);

            InsnList il = mn1.instructions;
            il.add(new VarInsnNode(ALOAD, 0));
            il.add(new MethodInsnNode(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false));
            il.add(new InsnNode(RETURN));

            mn1.maxStack = 1;
            mn1.maxLocals = 1;
        }

        {
            MethodNode mn2 = new MethodNode(ACC_PUBLIC, "test", "(I)V", null, null);
            cn.methods.add(mn2);

            LabelNode caseLabelNode1 = new LabelNode();
            LabelNode caseLabelNode2 = new LabelNode();
            LabelNode caseLabelNode3 = new LabelNode();
            LabelNode caseLabelNode4 = new LabelNode();
            LabelNode defaultLabelNode = new LabelNode();
            LabelNode returnLabelNode = new LabelNode();

            // 第1段
            InsnList il = mn2.instructions;
            il.add(new VarInsnNode(ILOAD, 1));
            il.add(new LookupSwitchInsnNode(defaultLabelNode, new int[] { 10, 20, 30, 40 }, 
                                            new LabelNode[] { caseLabelNode1, caseLabelNode2, caseLabelNode3, caseLabelNode4 }));

            // 第2段
            il.add(caseLabelNode1);
            il.add(new FieldInsnNode(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;"));
            il.add(new LdcInsnNode("val = 10"));
            il.add(new MethodInsnNode(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false));
            il.add(new JumpInsnNode(GOTO, returnLabelNode));

            // 第3段
            il.add(caseLabelNode2);
            il.add(new FieldInsnNode(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;"));
            il.add(new LdcInsnNode("val = 20"));
            il.add(new MethodInsnNode(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false));
            il.add(new JumpInsnNode(GOTO, returnLabelNode));

            // 第4段
            il.add(caseLabelNode3);
            il.add(new FieldInsnNode(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;"));
            il.add(new LdcInsnNode("val = 30"));
            il.add(new MethodInsnNode(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false));
            il.add(new JumpInsnNode(GOTO, returnLabelNode));

            // 第5段
            il.add(caseLabelNode4);
            il.add(new FieldInsnNode(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;"));
            il.add(new LdcInsnNode("val = 40"));
            il.add(new MethodInsnNode(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false));
            il.add(new JumpInsnNode(GOTO, returnLabelNode));

            // 第6段
            il.add(defaultLabelNode);
            il.add(new FieldInsnNode(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;"));
            il.add(new LdcInsnNode("val is unknown"));
            il.add(new MethodInsnNode(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false));

            // 第7段
            il.add(returnLabelNode);
            il.add(new InsnNode(RETURN));

            mn2.maxStack = 2;
            mn2.maxLocals = 2;
        }

        // (2) 使用ClassWriter类生成字节码
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
        cn.accept(cw);
        return cw.toByteArray();
    }
}
```

### 验证结果

```java
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Method m = clazz.getDeclaredMethod("test", int.class);
        Object instance = clazz.newInstance();
        for (int i = 0; i < 5; i++) {
            m.invoke(instance, i * 10);
        }
    }
}
```

## 总结

本文内容总结如下：

- 第一点，实现if语句，要用到`JumpInsnNode`类。
- 第二点，实现switch语句，要用到`TableSwitchInsnNode`或`LookupSwitchInsnNode`类。
