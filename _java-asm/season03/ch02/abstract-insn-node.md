---
title: "AbstractInsnNode介绍"
sequence: "205"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## AbstractInsnNode

### class info

第一个部分，`AbstractInsnNode`类是一个抽象（`abstract`）类。

```java
public abstract class AbstractInsnNode {
}
```

### fields

第二个部分，`AbstractInsnNode`类定义的字段有哪些。

- `opcode`字段，记录当前指令是什么。
- `previousInsn`和`nextInsn`字段，用来记录不同指令之间的关联关系。
- `index`字段，用来记录当前指令在`InsnList`对象实例中索引值。
  - 如果当前指令没有加入任何`InsnList`对象实例，其`index`值为`-1`。
  - 如果当前指令刚加入某个`InsnList`对象实例时，其`index`值为`0`；在调用`InsnList.toArray()`方法后，会更新其`index`值。

```java
public abstract class AbstractInsnNode {
    protected int opcode;

    AbstractInsnNode previousInsn;
    AbstractInsnNode nextInsn;

    int index;
}
```

### constructors

第三个部分，`AbstractInsnNode`类定义的构造方法有哪些。

```java
public abstract class AbstractInsnNode {
    protected AbstractInsnNode(final int opcode) {
        this.opcode = opcode;
        this.index = -1;
    }
}
```

### methods

第四个部分，`AbstractInsnNode`类定义的方法有哪些。

#### getter方法

```java
public abstract class AbstractInsnNode {
    public int getOpcode() {
        return opcode;
    }

    public AbstractInsnNode getPrevious() {
        return previousInsn;
    }

    public AbstractInsnNode getNext() {
        return nextInsn;
    }
}
```

#### 抽象方法

我们知道，`AbstractInsnNode`本身就是一个抽象类，它里面有两个抽象方法：

- `getType()`方法，用来获取当前指令的类型。
- `accept(MethodVisitor)`方法，用来将当前指令发送给下一个`MethodVisitor`对象实例。

```java
public abstract class AbstractInsnNode {
    public abstract int getType();

    public abstract void accept(MethodVisitor methodVisitor);
}
```

## 指令分类

在`AbstractInsnNode`类当中，`getType()`是一个抽象方法，它具体的取值范围位于`0~15`之间，一共16个类别。这16个类型，也对应了16个具体的子类实现；由于这些子类的数量较多，并且代码实现也比较简单，我们就不一一进行介绍了。

```java
public abstract class AbstractInsnNode {
    // The type of InsnNode instructions.
    public static final int INSN = 0;

    // The type of IntInsnNode instructions.
    public static final int INT_INSN = 1;

    // The type of VarInsnNode instructions.
    public static final int VAR_INSN = 2;

    // The type of TypeInsnNode instructions.
    public static final int TYPE_INSN = 3;

    // The type of FieldInsnNode instructions.
    public static final int FIELD_INSN = 4;

    // The type of MethodInsnNode instructions.
    public static final int METHOD_INSN = 5;

    // The type of InvokeDynamicInsnNode instructions.
    public static final int INVOKE_DYNAMIC_INSN = 6;

    // The type of JumpInsnNode instructions.
    public static final int JUMP_INSN = 7;

    // The type of LabelNode "instructions".
    public static final int LABEL = 8;

    // The type of LdcInsnNode instructions.
    public static final int LDC_INSN = 9;

    // The type of IincInsnNode instructions.
    public static final int IINC_INSN = 10;

    // The type of TableSwitchInsnNode instructions.
    public static final int TABLESWITCH_INSN = 11;

    // The type of LookupSwitchInsnNode instructions.
    public static final int LOOKUPSWITCH_INSN = 12;

    // The type of MultiANewArrayInsnNode instructions.
    public static final int MULTIANEWARRAY_INSN = 13;

    // The type of FrameNode "instructions".
    public static final int FRAME = 14;

    // The type of LineNumberNode "instructions".
    public static final int LINE = 15;
}
```

## 示例：打印字符串

### 预期目标

我们想实现的预期目标是生成`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test() {
        System.out.println("Hello World");
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

            InsnList il = mn2.instructions;
            il.add(new FieldInsnNode(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;"));
            il.add(new LdcInsnNode("Hello World"));
            il.add(new MethodInsnNode(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false));
            il.add(new InsnNode(RETURN));

            mn2.maxStack = 2;
            mn2.maxLocals = 1;
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
import sample.HelloWorld;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        HelloWorld instance = new HelloWorld();
        instance.test();
    }
}
```

## 总结

本文内容总结如下：

- 第一点，介绍`AbstractInsnNode`类各个部分的信息。
- 第二点，`AbstractInsnNode`是一个抽象类，它有16个具体子类。
- 第三点，代码示例，使用`AbstractInsnNode`的子类生成打印字符串的代码。
