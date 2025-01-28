---
title: "AnalyzerAdapter 介绍"
sequence: "408"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

对于 `AnalyzerAdapter` 类来说，它的特点是“可以模拟 frame 的变化”，或者说“可以模拟 local variables 和 operand stack 的变化”。

The `AnalyzerAdapter` is a `MethodVisitor` that keeps track of stack map frame changes between `visitFrame(int, int, Object[], int, Object[])` calls.
This `AnalyzerAdapter` adapter must be used with the `ClassReader.EXPAND_FRAMES` option.

This method adapter computes the **stack map frames** before each instruction, based on the frames visited in `visitFrame`.
Indeed, `visitFrame` is only called before some specific instructions in a method, in order to save space,
and because "the other frames can be easily and quickly inferred from these ones".
This is what this adapter does.

![](/assets/images/java/asm/frame-local-variables-operand-stack.png)

## AnalyzerAdapter 类

### class info

第一个部分，`AnalyzerAdapter` 类的父类是 `MethodVisitor` 类。

```java
public class AnalyzerAdapter extends MethodVisitor {
}
```

### fields

第二个部分，`AnalyzerAdapter` 类定义的字段有哪些。

我们将以下列出的字段分成 3 个组：

- 第 1 组，包括 `locals`、`stack`、`maxLocals` 和 `maxStack` 字段，它们是与 local variables 和 operand stack 直接相关的字段。
- 第 2 组，包括 `labels` 和 `uninitializedTypes` 字段，它们记录的是未初始化的对象类型，是属于一些特殊情况。
- 第 3 组，是 `owner` 字段，表示当前类的名字。

```java
public class AnalyzerAdapter extends MethodVisitor {
    // 第 1 组字段：local variables 和 operand stack
    public List<Object> locals;
    public List<Object> stack;
    private int maxLocals;
    private int maxStack;

    // 第 2 组字段：uninitialized 类型
    private List<Label> labels;
    public Map<Object, Object> uninitializedTypes;

    // 第 3 组字段：类的名字
    private String owner;
}
```



### constructors

第三个部分，`AnalyzerAdapter` 类定义的构造方法有哪些。

有一个问题：`AnalyzerAdapter` 类的构造方法，到底是想实现一个什么样的代码逻辑呢？回答：它想构建方法刚进入时的 Frame 状态。在方法刚进入时，Frame 的初始状态是什么样的呢？其中，operand stack 上没有任何元素，而 local variables 则需要考虑存储 `this` 和方法的参数信息。在 `AnalyzerAdapter` 类的构造方法中，主要就是围绕着 `locals` 字段来展开，它需要将 `this` 和方法参数添加进入。

```java
public class AnalyzerAdapter extends MethodVisitor {
    public AnalyzerAdapter(String owner, int access, String name, String descriptor, MethodVisitor methodVisitor) {
        this(Opcodes.ASM9, owner, access, name, descriptor, methodVisitor);
    }

    protected AnalyzerAdapter(int api, String owner, int access, String name, String descriptor, MethodVisitor methodVisitor) {
        super(api, methodVisitor);
        this.owner = owner;
        locals = new ArrayList<>();
        stack = new ArrayList<>();
        uninitializedTypes = new HashMap<>();
        
        // 首先，判断是不是 static 方法、是不是构造方法，来更新 local variables 的初始状态
        if ((access & Opcodes.ACC_STATIC) == 0) {
            if ("<init>".equals(name)) {
                locals.add(Opcodes.UNINITIALIZED_THIS);
            } else {
                locals.add(owner);
            }
        }

        // 其次，根据方法接收的参数，来更新 local variables 的初始状态
        for (Type argumentType : Type.getArgumentTypes(descriptor)) {
            switch (argumentType.getSort()) {
                case Type.BOOLEAN:
                case Type.CHAR:
                case Type.BYTE:
                case Type.SHORT:
                case Type.INT:
                    locals.add(Opcodes.INTEGER);
                    break;
                case Type.FLOAT:
                    locals.add(Opcodes.FLOAT);
                    break;
                case Type.LONG:
                    locals.add(Opcodes.LONG);
                    locals.add(Opcodes.TOP);
                    break;
                case Type.DOUBLE:
                    locals.add(Opcodes.DOUBLE);
                    locals.add(Opcodes.TOP);
                    break;
                case Type.ARRAY:
                    locals.add(argumentType.getDescriptor());
                    break;
                case Type.OBJECT:
                    locals.add(argumentType.getInternalName());
                    break;
                default:
                    throw new AssertionError();
            }
        }
        maxLocals = locals.size();
    }
}
```

### methods

第四个部分，`AnalyzerAdapter` 类定义的方法有哪些。

#### execute 方法

在 `AnalyzerAdapter` 类当中，多数的 `visitXxxInsn()` 方法都会去调用 `execute()` 方法；而 `execute()` 方法是模拟每一条 instruction 对于 local variables 和 operand stack 的影响。

```java
public class AnalyzerAdapter extends MethodVisitor {
    private void execute(final int opcode, final int intArg, final String stringArg) {
        // ......
    }
}
```

#### return 和 throw

当遇到 `return` 或 `throw` 时，会将 `locals` 字段和 `stack` 字段设置为 `null`。如果遇到 `return` 之后，就代表了“正常结束”，方法的代码执行结束了；如果遇到 `throw` 之后，就代表了“出现异常”，方法处理不了某种情况而退出。

```java
public class AnalyzerAdapter extends MethodVisitor {
    // 这里对应 return 语句
    public void visitInsn(final int opcode) {
        super.visitInsn(opcode);
        execute(opcode, 0, null);
        if ((opcode >= Opcodes.IRETURN && opcode <= Opcodes.RETURN) || opcode == Opcodes.ATHROW) {
            this.locals = null;
            this.stack = null;
        }
    }
}
```

#### jump

当遇到 `goto`、`switch`（`tableswitch` 和 `lookupswitch`）时，也会将 `locals` 字段和 `stack` 字段设置为 `null`。遇到 jump 相关的指令，意味着代码的逻辑要进行“跳转”，从一个地方跳转到另一个地方执行。

```java
public class AnalyzerAdapter extends MethodVisitor {
    // 这里对应 goto 语句
    public void visitJumpInsn(final int opcode, final Label label) {
        super.visitJumpInsn(opcode, label);
        execute(opcode, 0, null);
        if (opcode == Opcodes.GOTO) {
            this.locals = null;
            this.stack = null;
        }
    }

    // 这里对应 switch 语句
    public void visitTableSwitchInsn(int min, int max, Label dflt, Label... labels) {
        super.visitTableSwitchInsn(min, max, dflt, labels);
        execute(Opcodes.TABLESWITCH, 0, null);
        this.locals = null;
        this.stack = null;
    }
    
    // 这里对应 switch 语句
    public void visitLookupSwitchInsn(Label dflt, int[] keys, Label[] labels) {
        super.visitLookupSwitchInsn(dflt, keys, labels);
        execute(Opcodes.LOOKUPSWITCH, 0, null);
        this.locals = null;
        this.stack = null;
    }
}
```

#### visitFrame 方法

当遇到 jump 相关的指令后，程序的代码会发生跳转。那么，跳转到新位置之后，就需要给 local variables 和 operand stack 重新设置一个新的状态；而 `visitFrame()` 方法，是将 local variables 和 operand stack 设置成某一个状态。跳转之后的代码，就是在这个新状态的基础上发生变化。

```java
public class AnalyzerAdapter extends MethodVisitor {
    public void visitFrame(int type, int numLocal, Object[] local, int numStack, Object[] stack) {
        if (type != Opcodes.F_NEW) { // Uncompressed frame.
            throw new IllegalArgumentException("AnalyzerAdapter only accepts expanded frames (see ClassReader.EXPAND_FRAMES)");
        }
        
        super.visitFrame(type, numLocal, local, numStack, stack);
        
        if (this.locals != null) {
            this.locals.clear();
            this.stack.clear();
        } else {
            this.locals = new ArrayList<>();
            this.stack = new ArrayList<>();
        }

        visitFrameTypes(numLocal, local, this.locals);
        visitFrameTypes(numStack, stack, this.stack);
        maxLocals = Math.max(maxLocals, this.locals.size());
        maxStack = Math.max(maxStack, this.stack.size());
    }

    private static void visitFrameTypes(int numTypes, Object[] frameTypes, List<Object> result) {
        for (int i = 0; i < numTypes; ++i) {
            Object frameType = frameTypes[i];
            result.add(frameType);
            if (frameType == Opcodes.LONG || frameType == Opcodes.DOUBLE) {
                result.add(Opcodes.TOP);
            }
        }
    }
}
```

#### new 和 invokespecial

在执行程序代码的时候，有些特殊的情况需要处理：

- 当遇到 `new` 时，会创建 `Label` 对象来表示“未初始化的对象”，并将 label 存储到 `uninitializedTypes` 字段内；
- 当遇到 `invokespecial` 时，会把“未初始化的对象”从 `uninitializedTypes` 字段内取出来，转换成“经过初始化之后的对象”，然后同步到 `locals` 字段和 `stack` 字段内。

```java
public class AnalyzerAdapter extends MethodVisitor {
    // 对应于 new
    public void visitTypeInsn(final int opcode, final String type) {
        if (opcode == Opcodes.NEW) {
            if (labels == null) {
                Label label = new Label();
                labels = new ArrayList<>(3);
                labels.add(label);
                if (mv != null) {
                    mv.visitLabel(label);
                }
            }
            for (Label label : labels) {
                uninitializedTypes.put(label, type);
            }
        }
        super.visitTypeInsn(opcode, type);
        execute(opcode, 0, type);
    }

    // 对应于 invokespecial
    public void visitMethodInsn(int opcodeAndSource, String owner, String name, String descriptor, boolean isInterface) {
        super.visitMethodInsn(opcodeAndSource, owner, name, descriptor, isInterface);
        int opcode = opcodeAndSource & ~Opcodes.SOURCE_MASK;
        
        if (this.locals == null) {
            labels = null;
            return;
        }
        pop(descriptor);
        if (opcode != Opcodes.INVOKESTATIC) {
            Object value = pop();
            if (opcode == Opcodes.INVOKESPECIAL && name.equals("<init>")) {
                Object initializedValue;
                if (value == Opcodes.UNINITIALIZED_THIS) {
                    initializedValue = this.owner;
                } else {
                    initializedValue = uninitializedTypes.get(value);
                }
                for (int i = 0; i < locals.size(); ++i) {
                    if (locals.get(i) == value) {
                        locals.set(i, initializedValue);
                    }
                }
                for (int i = 0; i < stack.size(); ++i) {
                    if (stack.get(i) == value) {
                        stack.set(i, initializedValue);
                    }
                }
            }
        }
        pushDescriptor(descriptor);
        labels = null;
    }
}
```

## 工作原理

在上面的内容，我们分别介绍了 `AnalyzerAdapter` 类的各个部分的信息，那么在这里，我们的目标是按照一个抽象的逻辑顺序来将各个部分组织到一起。那么，这个抽象的逻辑是什么呢？就是 local variables 和 operand stack 的状态变化，从初始状态，到中间状态，再到结束状态。

一个类能够为外界提供什么样的“信息”，只要看它的 `public` 成员就可以了。如果我们仔细观察一下 `AnalyzerAdapter` 类，就会发现：除了从 `MethodVisitor` 类继承的 `visitXxxInsn()` 方法，`AnalyzerAdapter` 类自己只定义了三个 `public` 类型的字段，即 `locals`、`stack` 和 `uninitializedTypes`。如果我们想了解和使用 `AnalyzerAdapter` 类，只要把握住这三个字段就可以了。

`AnalyzerAdapter` 类的主要作用就是记录 stack map frame 的变化情况；在 frame 当中，有两个重要的结构，即 local variables 和 operand stack。结合刚才的三个字段，其中 `locals` 和 `stack` 分别表示 local variables 和 operand stack；而 `uninitializedTypes` 则是记录一种特殊的状态，这个状态就是“对象已经通过 new 创建了，但是还没有调用它的构造方法”，这个状态只是一个“临时”的状态，等后续调用它的构造方法之后，它就是一个真正意义上的对象了。举一个例子，一个人拿到了大学录取通知书，可以笼统的叫作”大学生“，但是还不是真正意义上的”大学生“，是一种”临时“的过渡状态，等到去大学报到之后，才成为真正意义上的大学生。

```java
public class AnalyzerAdapter extends MethodVisitor {
    // 第 1 组字段：local variables 和 operand stack
    public List<Object> locals;
    public List<Object> stack;

    // 第 2 组字段：uninitialized 类型
    private List<Label> labels;
    public Map<Object, Object> uninitializedTypes;
}
```

我们在研究 local variables 和 operand stack 的变化时，遵循下面的思路就可以了：

- 首先，初始状态。也就是说，最开始的时候，local variables 和 operand stack 是如何布局的。
- 其次，中间状态。local variables 和 operand stack 会随着 Instruction 的执行而发生变化。按照 Instruction 执行的顺序，我们这里又分成两种情况：
    - 第一种情况，Instruction 按照顺序一条一条的向下执行。在这第一种情况里，还有一种特殊情况，就是 new 对象时，出现的特殊状态下的对象，也就是“已经分配内存空间，但还没有调用构造方法的对象”。
    - 第二种情况，遇到 jump 相关的 Instruction，程序代码逻辑要发生跳转。
- 最后，结束状态。方法退出，可以是正常退出（return），也可以异常退出（throw）。

这三种状态，可以与“生命体”作一个类比。在这个世界上，大多数的生命体，都会经历出生、成长、衰老和死亡的变化。

---

在 Java 语言当中，流程控制语句有三种，分别是顺序（sequential structure）、选择（selective structure）和循环（cycle structure）。但是，如果进入到 ByteCode 层面或 Instruction 层面，那么选择（selective structure）和循环（cycle structure）本质上是一样的，都是跳转（Jump）。

---

### 初始状态

首先，就是 local variables 和 operand stack 的初始状态，它是通过 `AnalyzerAdapter` 类的构造方法来为 `locals` 和 `stack` 字段赋值。

```java
public class AnalyzerAdapter extends MethodVisitor {
    protected AnalyzerAdapter(int api, String owner, int access, String name, String descriptor, MethodVisitor methodVisitor) {
        super(api, methodVisitor);
        this.owner = owner;
        locals = new ArrayList<>();
        stack = new ArrayList<>();
        uninitializedTypes = new HashMap<>();
        
        // 首先，判断是不是 static 方法、是不是构造方法，来更新 local variables 的初始状态
        if ((access & Opcodes.ACC_STATIC) == 0) {
            if ("<init>".equals(name)) {
                locals.add(Opcodes.UNINITIALIZED_THIS);
            } else {
                locals.add(owner);
            }
        }

        // 其次，根据方法接收的参数，来更新 local variables 的初始状态
        for (Type argumentType : Type.getArgumentTypes(descriptor)) {
            switch (argumentType.getSort()) {
                case Type.BOOLEAN:
                case Type.CHAR:
                case Type.BYTE:
                case Type.SHORT:
                case Type.INT:
                    locals.add(Opcodes.INTEGER);
                    break;
                case Type.FLOAT:
                    locals.add(Opcodes.FLOAT);
                    break;
                case Type.LONG:
                    locals.add(Opcodes.LONG);
                    locals.add(Opcodes.TOP);
                    break;
                case Type.DOUBLE:
                    locals.add(Opcodes.DOUBLE);
                    locals.add(Opcodes.TOP);
                    break;
                case Type.ARRAY:
                    locals.add(argumentType.getDescriptor());
                    break;
                case Type.OBJECT:
                    locals.add(argumentType.getInternalName());
                    break;
                default:
                    throw new AssertionError();
            }
        }
        maxLocals = locals.size();
    }
}
```


在上面的构造方法中，operand stack 的初始状态是空的；而 local variables 的初始状态需要考虑两方面的内容：

- 第一方面，当前方法是不是 static 方法、当前方法是不是 `<init>()` 方法。
- 第二方面，方法接收的参数。

### 中间状态

#### 顺序执行

接着，就是 instruction 的执行会使得 local variables 和 operand stack 状态发生变化。在这个过程中，`visitXxxInsn()` 方法大多是通过调用 `execute(opcode, intArg, stringArg)` 方法来完成。

```java
public class AnalyzerAdapter extends MethodVisitor {
    private void execute(final int opcode, final int intArg, final String stringArg) {
        // ......
    }
}
```

#### 发生跳转

当遇到 jump 相关的指令时，程序代码会从一个地方跳转到另一个地方。

当程序跳转完成之后，需要通过 `visitFrame()` 方法为 `locals` 和 `stack` 字段赋一个新的初始值。再往下执行，可能就进入到“顺序执行”的过程了。

#### 特殊情况：new 对象

对于“未初始化的对象类型”，我们来举个例子，比如说 `new String()` 会创建一个 `String` 类型的对象，但是对应到 ByteCode 层面是 3 条 instruction：

```text
NEW java/lang/String
DUP
INVOKESPECIAL java/lang/String.<init> ()V
```

- 第 1 条 instruction，是 `NEW java/lang/String`，会为即将创建的对象分配内存空间，确切的说是在堆（heap）上分配内存空间，同时将一个 `reference` 放到 operand stack 上，这个 `reference` 就指向这块内存空间。由于这块内存空间还没有进行初始化，所以这个 `reference` 对应的内容并不能确切的叫作“对象”，只能叫作“未初始化的对象”，也就是“uninitialized object”。
- 第 2 条 instruction，是 `DUP`，会将 operand stack 上的原有的 `reference` 复制一份，这时候 operand stack 上就有两个 `reference`，这两个 `reference` 都指向那块未初始化的内存空间，这两个 `reference` 的内容都对应于同一个“uninitialized object”。
- 第 3 条 instruction，是 `INVOKESPECIAL java/lang/String.<init> ()V`，会将那块内存空间进行初始化，同时会“消耗”掉 operand stack 最上面的 `reference`，那么就只剩下一个 `reference` 了。由于那块内存空间进行了初始化操作，那么剩下的 `reference` 对应的内容就是一个“经过初始化的对象”，就是一个平常所说的“对象”了。

### 结束状态

从 JVM 内存空间的角度来说，每一个方法都有对应的 frame 内存空间：当方法开始的时候，就会创建相应的 frame 内存空间；当方法结束的时候，就会清空相应的 frame 内存空间。换句话说，当方法结束的时候，frame 内存空间的 local variables 和 operand stack 也就被清空了。所以，从 JVM 内存空间的角度来说，结束状态，就是 local variables 和 operand stack 所占用的内存空间都“消失了”。

从 Java 代码的角度来说，方法的退出，就对应于 `visitInsn(opcode)` 方法中 `return` 和 `throw` 的情况。

对于 local variables 和 operand stack 的结束状态，它又重要，又不重要：

- 它不重要，是因为它的内存空间被回收了或“消失了”，不需要我们花费太多的时间去思考它，这是从“自身所包含内容的多与少”的角度来考虑。
- 它重要，是因为它在“初始状态－中间状态－结束状态”这个环节当中是必不可少的一部分，这是从“整体性”的角度上来考虑。

## 示例：打印方法的 Frame

### 预期目标

假如有一个 `HelloWorld` 类，代码如下：

```java
import java.util.Random;

public class HelloWorld {
    public HelloWorld() {
        super();
    }

    public boolean getFlag() {
        Random rand = new Random();
        return rand.nextBoolean();
    }

    public void test(boolean flag) {
        if (flag) {
            System.out.println("value is true");
        }
        else {
            System.out.println("value is false");
        }
    }

    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        boolean flag = instance.getFlag();
        instance.test(flag);
    }
}
```

我们想实现的预期目标：打印出 `HelloWorld` 类当中各个方法的 frame 变化情况。


### 编码实现

```java
import org.objectweb.asm.*;
import org.objectweb.asm.commons.AnalyzerAdapter;

import java.util.Arrays;
import java.util.List;

public class MethodStackMapFrameVisitor extends ClassVisitor {
    private String owner;

    public MethodStackMapFrameVisitor(int api, ClassVisitor classVisitor) {
        super(api, classVisitor);
    }

    @Override
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        super.visit(version, access, name, signature, superName, interfaces);
        this.owner = name;
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        return new MethodStackMapFrameAdapter(api, owner, access, name, descriptor, mv);
    }

    private static class MethodStackMapFrameAdapter extends AnalyzerAdapter {
        private final String methodName;
        private final String methodDesc;

        public MethodStackMapFrameAdapter(int api, String owner, int access, String name, String descriptor, MethodVisitor methodVisitor) {
            super(api, owner, access, name, descriptor, methodVisitor);
            this.methodName = name;
            this.methodDesc = descriptor;
        }

        @Override
        public void visitCode() {
            super.visitCode();
            System.out.println();
            System.out.println(methodName + methodDesc);
            printStackMapFrame();
        }

        @Override
        public void visitInsn(int opcode) {
            super.visitInsn(opcode);
            printStackMapFrame();
        }

        @Override
        public void visitIntInsn(int opcode, int operand) {
            super.visitIntInsn(opcode, operand);
            printStackMapFrame();
        }

        @Override
        public void visitVarInsn(int opcode, int var) {
            super.visitVarInsn(opcode, var);
            printStackMapFrame();
        }

        @Override
        public void visitTypeInsn(int opcode, String type) {
            super.visitTypeInsn(opcode, type);
            printStackMapFrame();
        }

        @Override
        public void visitFieldInsn(int opcode, String owner, String name, String descriptor) {
            super.visitFieldInsn(opcode, owner, name, descriptor);
            printStackMapFrame();
        }

        @Override
        public void visitMethodInsn(int opcode, String owner, String name, String descriptor, boolean isInterface) {
            super.visitMethodInsn(opcode, owner, name, descriptor, isInterface);
            printStackMapFrame();
        }

        @Override
        public void visitInvokeDynamicInsn(String name, String descriptor, Handle bootstrapMethodHandle, Object... bootstrapMethodArguments) {
            super.visitInvokeDynamicInsn(name, descriptor, bootstrapMethodHandle, bootstrapMethodArguments);
            printStackMapFrame();
        }

        @Override
        public void visitJumpInsn(int opcode, Label label) {
            super.visitJumpInsn(opcode, label);
            printStackMapFrame();
        }

        @Override
        public void visitLdcInsn(Object value) {
            super.visitLdcInsn(value);
            printStackMapFrame();
        }

        @Override
        public void visitIincInsn(int var, int increment) {
            super.visitIincInsn(var, increment);
            printStackMapFrame();
        }

        @Override
        public void visitTableSwitchInsn(int min, int max, Label dflt, Label... labels) {
            super.visitTableSwitchInsn(min, max, dflt, labels);
            printStackMapFrame();
        }

        @Override
        public void visitLookupSwitchInsn(Label dflt, int[] keys, Label[] labels) {
            super.visitLookupSwitchInsn(dflt, keys, labels);
            printStackMapFrame();
        }

        @Override
        public void visitMultiANewArrayInsn(String descriptor, int numDimensions) {
            super.visitMultiANewArrayInsn(descriptor, numDimensions);
            printStackMapFrame();
        }

        @Override
        public void visitTryCatchBlock(Label start, Label end, Label handler, String type) {
            super.visitTryCatchBlock(start, end, handler, type);
            printStackMapFrame();
        }

        private void printStackMapFrame() {
            String locals_str = locals == null ? "[]" : list2Str(locals);
            String stack_str = stack == null ? "[]" : list2Str(stack);
            String line = String.format("%s %s", locals_str, stack_str);
            System.out.println(line);
        }

        private String list2Str(List<Object> list) {
            if (list == null || list.size() == 0) return "[]";
            int size = list.size();
            String[] array = new String[size];
            for (int i = 0; i < size; i++) {
                Object item = list.get(i);
                array[i] = item2Str(item);
            }
            return Arrays.toString(array);
        }

        private String item2Str(Object obj) {
            if (obj == Opcodes.TOP) {
                return "top";
            }
            else if (obj == Opcodes.INTEGER) {
                return "int";
            }
            else if (obj == Opcodes.FLOAT) {
                return "float";
            }
            else if (obj == Opcodes.DOUBLE) {
                return "double";
            }
            else if (obj == Opcodes.LONG) {
                return "long";
            }
            else if (obj == Opcodes.NULL) {
                return "null";
            }
            else if (obj == Opcodes.UNINITIALIZED_THIS) {
                return "uninitialized_this";
            }
            else if (obj instanceof Label) {
                Object value = uninitializedTypes.get(obj);
                if (value == null) {
                    return obj.toString();
                }
                else {
                    return "uninitialized_" + value;
                }
            }
            else {
                return obj.toString();
            }
        }
    }
}
```

### 验证结果

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Opcodes;

public class HelloWorldFrameCore {
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
        ClassVisitor cv = new MethodStackMapFrameVisitor(api, cw);

        //（4）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.EXPAND_FRAMES; // 注意，这里使用了 EXPAND_FRAMES
        cr.accept(cv, parsingOptions);

        //（5）生成 byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

## 总结

本文对 `AnalyzerAdapter` 类进行介绍，内容总结如下：

- 第一点，了解 `AnalyzerAdapter` 类的各个不同部分。
- 第二点，理解 `AnalyzerAdapter` 类的代码原理，它是围绕着 local variables 和 operand stack 如何变化来展开的。
- 第三点，需要注意的一点是，在使用 `AnalyzerAdapter` 类时，要记得用 `ClassReader.EXPAND_FRAMES` 选项。

`AnalyzerAdapter` 类，更多的是具有“学习特性”，而不是“实用特性”。所谓的“学习特性”，具体来说，就是 `AnalyzerAdapter` 类让我们能够去学习 local variables 和 operand stack 随着 instruction 的向下执行而发生变化。所谓的“实用特性”，就是像 `AdviceAdapter` 类那样，它有明确的使用场景，能够在“方法进入”的时候和“方法退出”的时候来添加一些代码逻辑。


