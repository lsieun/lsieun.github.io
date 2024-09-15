---
title: "TryCatchBlockNode介绍"
sequence: "207"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## TryCatchBlockNode

### class info

第一个部分，`TryCatchBlockNode`类直接继承自`Object`类。注意：`TryCatchBlockNode`的父类并不是`AbstractInsnNode`类。

```java
public class TryCatchBlockNode {
}
```

### fields

第二个部分，`TryCatchBlockNode`类定义的字段有哪些。

我们可以将字段分成两组：

- 第一组字段，包括`start`和`end`字段，用来标识异常处理的范围（`start~end`）。
- 第二组字段，包括`handler`和`type`字段，用来标识异常处理的类型（`type`字段）和手段（`handler`字段）。

```java
public class TryCatchBlockNode {
    // 第一组字段
    public LabelNode start;
    public LabelNode end;

    // 第二组字段
    public LabelNode handler;
    public String type;
}
```

### constructors

第三个部分，`TryCatchBlockNode`类定义的构造方法有哪些。

```java
public class TryCatchBlockNode {
    public TryCatchBlockNode(LabelNode start, LabelNode end, LabelNode handler, String type) {
        this.start = start;
        this.end = end;
        this.handler = handler;
        this.type = type;
    }
}
```

### methods

第四个部分，`TryCatchBlockNode`类定义的方法有哪些。在这里，我们只关注`accept`方法，它接收一个`MethodVisitor`类型的参数。

```java
public class TryCatchBlockNode {
    public void accept(MethodVisitor methodVisitor) {
        methodVisitor.visitTryCatchBlock(start.getLabel(), end.getLabel(), handler == null ? null : handler.getLabel(), type);
    }
}
```

## 示例：try-catch

### 预期目标

我们想实现的预期目标是生成`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test() {
        try {
            System.out.println("Before Sleep");
            Thread.sleep(1000L);
            System.out.println("After Sleep");
        }
        catch (InterruptedException ex) {
            ex.printStackTrace();
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
            MethodNode mn2 = new MethodNode(ACC_PUBLIC, "test", "()V", null, null);
            cn.methods.add(mn2);

            LabelNode startLabelNode = new LabelNode();
            LabelNode endLabelNode = new LabelNode();
            LabelNode exceptionHandlerLabelNode = new LabelNode();
            LabelNode returnLabelNode = new LabelNode();

            InsnList il = mn2.instructions;
            mn2.tryCatchBlocks.add(new TryCatchBlockNode(startLabelNode, endLabelNode, exceptionHandlerLabelNode, "java/lang/InterruptedException"));

            il.add(startLabelNode);
            il.add(new FieldInsnNode(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;"));
            il.add(new LdcInsnNode("Before Sleep"));
            il.add(new MethodInsnNode(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false));
            il.add(new LdcInsnNode(new Long(1000L)));
            il.add(new MethodInsnNode(INVOKESTATIC, "java/lang/Thread", "sleep", "(J)V", false));
            il.add(new FieldInsnNode(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;"));
            il.add(new LdcInsnNode("After Sleep"));
            il.add(new MethodInsnNode(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false));

            il.add(endLabelNode);
            il.add(new JumpInsnNode(GOTO, returnLabelNode));

            il.add(exceptionHandlerLabelNode);
            il.add(new VarInsnNode(ASTORE, 1));
            il.add(new VarInsnNode(ALOAD, 1));
            il.add(new MethodInsnNode(INVOKEVIRTUAL, "java/lang/InterruptedException", "printStackTrace", "()V", false));

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
        Method m = clazz.getDeclaredMethod("test");
        Object instance = clazz.newInstance();
        m.invoke(instance);
    }
}
```

## 总结

本文内容总结如下：

- 第一点，介绍`TryCatchBlockNode`类各个部分的信息。
- 第二点，代码示例，如何使用`TryCatchBlockNode`类生成try-catch语句。
