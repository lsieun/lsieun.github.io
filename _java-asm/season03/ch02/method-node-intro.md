---
title: "MethodNode介绍"
sequence: "203"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## MethodNode

### class info

第一个部分，`MethodNode`类继承自`MethodVisitor`类。

```java
public class MethodNode extends MethodVisitor {
}
```

### fields

第二个部分，`MethodNode`类定义的字段有哪些。

方法，由方法头(Method Header)和方法体(Method Body)组成。在这里，我们将这些字段分成两部分：

- 第一部分，与方法头(Method Header)相关的字段。
- 第二部分，与方法体(Method Body)相关的字段。

首先，我们来看与方法头(Method Header)相关的字段：

```java
public class MethodNode extends MethodVisitor {
    public int access;
    public String name;
    public String desc;
    public String signature;
    public List<String> exceptions;
}
```

这些字段与`method_info`结构相对应：

```text
method_info {
    u2             access_flags;
    u2             name_index;
    u2             descriptor_index;
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
```

接着，我们来看与方法体(Method Body)相关的字段：

```java
public class MethodNode extends MethodVisitor {
    public InsnList instructions;
    public List<TryCatchBlockNode> tryCatchBlocks;
    public int maxStack;
    public int maxLocals;
}
```

在上面的字段中，我们看到`InsnList`和`TryCatchBlockNode`两个类：

- `InsnList`类，表示有序的指令集合，是方法体的具体实现。它与`Code`结构当中的`code_length`和`code[]`相对应。
- `TryCatchBlockNode`类，表示方法内异常处理的逻辑。它与`Code`结构当中的`exception_table_length`和`exception_table[]`相对应。

这些字段与`Code_attribute`结构相对应：

```text
Code_attribute {
    u2 attribute_name_index;
    u4 attribute_length;
    u2 max_stack;
    u2 max_locals;
    u4 code_length;
    u1 code[code_length];
    u2 exception_table_length;
    {   u2 start_pc;
        u2 end_pc;
        u2 handler_pc;
        u2 catch_type;
    } exception_table[exception_table_length];
    u2 attributes_count;
    attribute_info attributes[attributes_count];
}
```

### constructors

第三个部分，`MethodNode`类定义的构造方法有哪些。

```java
public class MethodNode extends MethodVisitor {
    public MethodNode() {
        this(Opcodes.ASM9);
        if (getClass() != MethodNode.class) {
            throw new IllegalStateException();
        }
    }

    public MethodNode(final int api) {
        super(api);
        this.instructions = new InsnList();
    }

    public MethodNode(int access, String name, String descriptor, String signature, String[] exceptions) {
        this(Opcodes.ASM9, access, name, descriptor, signature, exceptions);
        if (getClass() != MethodNode.class) {
            throw new IllegalStateException();
        }
    }

    public MethodNode(int api, int access, String name, String descriptor, String signature, String[] exceptions) {
        super(api);
        this.access = access;
        this.name = name;
        this.desc = descriptor;
        this.signature = signature;
        this.exceptions = Util.asArrayList(exceptions);
        
        this.tryCatchBlocks = new ArrayList<>();
        this.instructions = new InsnList();
    }
}
```

### methods

第四个部分，`MethodNode`类定义的方法有哪些。

#### visitXxx方法

这里介绍的`visitXxx()`方法，就是将指令存储到`InsnList instructions`字段内。

```java
public class MethodNode extends MethodVisitor {
    @Override
    public void visitCode() {
        // Nothing to do.
    }

    @Override
    public void visitInsn(final int opcode) {
        instructions.add(new InsnNode(opcode));
    }

    @Override
    public void visitIntInsn(final int opcode, final int operand) {
        instructions.add(new IntInsnNode(opcode, operand));
    }
    
    // ...

    @Override
    public void visitMaxs(final int maxStack, final int maxLocals) {
        this.maxStack = maxStack;
        this.maxLocals = maxLocals;
    }

    @Override
    public void visitEnd() {
        // Nothing to do.
    }
}
```

#### accept方法

在`MethodNode`类，有两个`accept`方法：一个接收`ClassVisitor`类型的参数，另一个接收`MethodVisitor`参数。

```java
public class MethodNode extends MethodVisitor {
    public void accept(ClassVisitor classVisitor) {
        String[] exceptionsArray = exceptions == null ? null : exceptions.toArray(new String[0]);
        MethodVisitor methodVisitor = classVisitor.visitMethod(access, name, desc, signature, exceptionsArray);
        if (methodVisitor != null) {
            accept(methodVisitor);
        }
    }
    
    public void accept(MethodVisitor methodVisitor) {
        // ...
        // Visit the code.
        if (instructions.size() > 0) {
            methodVisitor.visitCode();
            // Visits the try catch blocks.
            if (tryCatchBlocks != null) {
                for (int i = 0, n = tryCatchBlocks.size(); i < n; ++i) {
                    tryCatchBlocks.get(i).updateIndex(i);
                    tryCatchBlocks.get(i).accept(methodVisitor);
                }
            }
            // Visit the instructions.
            instructions.accept(methodVisitor);
            // ...
            methodVisitor.visitMaxs(maxStack, maxLocals);
            visited = true;
        }
        methodVisitor.visitEnd();
    }
}
```

## 示例：类

### 预期目标

我们想实现的预期目标是生成`HelloWorld`类，代码如下：

```java
public class HelloWorld {
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

        // (2) 使用ClassWriter类生成字节码
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
        cn.accept(cw);
        return cw.toByteArray();
    }
}
```

### 验证结果

```java
import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        System.out.println(clazz);

        Field[] declaredFields = clazz.getDeclaredFields();
        if (declaredFields.length > 0) {
            System.out.println("fields:");
            for (Field f : declaredFields) {
                System.out.println("    " + f.getName());
            }
        }

        Method[] declaredMethods = clazz.getDeclaredMethods();
        if (declaredMethods.length > 0) {
            System.out.println("methods:");
            for (Method m : declaredMethods) {
                System.out.println("    " + m.getName());
            }
        }
    }
}
```

## 总结

本文内容总结如下：

- 第一点，介绍`MethodNode`类各个部分的信息。
- 第二点，代码示例，使用`MethodNode`类生成方法。
- 第三点，方法内代码实现需要使用到`InsnList`类。
