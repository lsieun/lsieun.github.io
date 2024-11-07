---
title: "修改已有的方法（优化－删除－复杂的变换）"
sequence: "312"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

```text
                      ┌─── stateless transformations
                      │
                      │
                      │                                                       ┌─── a finite number of states
ASM Transformation ───┤                                                       │
                      │                                 ┌─── state machine ───┼─── current state
                      │                                 │                     │
                      │                                 │                     └─── state transitions
                      └─── stateful transformations ────┤
                                                        │                     ┌─── iconst_0 iadd
                                                        │                     │
                                                        └─── examples ────────┼─── aload_0 aload_0 getfield putfield
                                                                              │
                                                                              └─── getstatic ldc invokevirtual
```

## 复杂的变换

### stateless transformations

The stateless transformation does not depend on **the instructions that have been visited before the current one**.

举几个关于 stateless transformation 的例子：

- 添加指令：在方法进入和方法退出时，打印方法的参数和返回值、计算方法的运行时间。
- 删除指令：移除 NOP、清空方法体。
- 修改指令：替换调用的方法。

这种 stateless transformation 实现起来比较容易，所以也被称为 simple transformations。

### stateful transformations

The **stateful transformation** require memorizing **some state** about **the instructions that have been visited before the current one**.
This requires storing state inside the method adapter.

举几个关于 stateful transformation 的例子：

- 删除指令：移除 `ICONST_0 IADD`。例如，`int d = c + 0;` 与 `int d = c;` 两者效果是一样的，所以 `+ 0` 的部分可以删除掉。
- 删除指令：移除 `ALOAD_0 ALOAD_0 GETFIELD PUTFIELD`。例如，`this.val = this.val;`，将字段的值赋值给字段本身，无实质意义。
- 删除指令：移除 `GETSTATIC LDC INVOKEVIRTUAL`。例如，`System.out.println("Hello World");`，删除打印信息。

这种 stateful transformation 实现起来比较困难，所以也被称为 complex transformations。

那么，为什么 stateless transformation 实现起来比较容易，而 stateful transformation 会实现起来比较困难呢？做个类比，stateless transformation 就类似于“一人吃饱，全家不饿”，不用考虑太多，所以实现起来就比较简单；而 stateful transformation 类似于“成家之后，要考虑一家人的生活状态”，考虑的事情就多一点，所以实现起来就比较困难。难归难，但是我们还是应该想办法进行实现。

那么，stateful transformation 到底该如何开始着手实现呢？在 stateful transformation 过程中，一般都是涉及到对多个指令（Instruction）同时判断，这多个指令是一个“组合”，不能轻易拆散。我们通过三个步骤来进行实现：

- 第一步，就是将问题本身转换成 Instruction 指令，然后对多个指令组合的“特征”或遵循的“模式”进行总结。
- 第二步，就是使用这个总结出来的“特征”或“模式”对指令进行识别。在识别的过程当中，每一条 Instruction 的加入，都会引起原有状态（state）的变化，这就对应着 `stateful` 的部分；
- 第三步，识别成功之后，要对 Class 文件进行转换，这就对应着 `transformation` 的部分。谈到 transformation，无非就是对 Instruction 的内容进行增加、删除和修改等操作。

到这里，就有一个新的问题产生：如何去记录第二步当中的状态（state）变化呢？我们的回答就是，借助于 state machine。

### state machine

首先，我们回答一个问题：什么是 state machine ？

A state machine is a behavior model. It consists of **a finite number of states** and is therefore also called finite-state machine (FSM). Based on the **current state** and **a given input** the machine performs **state transitions** and produces outputs.

对于 state machine，我想到了这句话：“吾生也有涯，而知也无涯。以有涯随无涯，殆已”。这句话的意思是讲，人们的生命是有限的，而知识却是无限的。以有限的生命去追求无限的知识，势必体乏神伤。我觉得，state machine 的聪明之处，就是将“无限”的操作步骤给限定在“有限”的状态里来思考。

接下来，就是给出一个具体的 state machine。也就是说，下面的 `MethodPatternAdapter` 类，就是一个原始的 state machine，我们从三个层面来把握它：

- 第一个层面，class info。`MethodPatternAdapter` 类，继承自 `MethodVisitor` 类，本身也是一个抽象类。
- 第二个层面，fields。`MethodPatternAdapter` 类，定义了两个字段，其中 `SEEN_NOTHING` 字段，是一个常量值，表示一个“初始状态”，而 `state` 字段则是用于记录不断变化的状态。
- 第三个层面，methods。`MethodPatternAdapter` 类定义 `visitXxxInsn()` 方法，都会去调用一个自定义的 `visitInsn()` 方法。`visitInsn()` 方法，是一个抽象方法，它的作用就是让所有的其它状态（state）都回归“初始状态”。

那么，应该怎么使用 `MethodPatternAdapter` 类呢？我们就是写一个 `MethodPatternAdapter` 类的子类，这个子类就是一个更“先进”的 state machine，它做以下三件事情：

- 第一件事情，从字段层面，根据处理的问题，来定义更多的状态；也就是，类似于 `SEEN_NOTHING` 的字段。这里就是**对 a finite number of states 进行定义**。
- 第二件事情，从方法层面，处理好 `visitXxxInsn()` 的调用，对于 `state` 字段状态的影响。也就是，输入新的指令（Instruction），都会对 `state` 字段产生影响。这里就是**构建状态（state）变化的机制**。
- 第三件事情，从方法层面，实现 `visitInsn()` 方法，根据 `state` 字段的值，如何回归到“初始状态”。这里就是添加一个“恢复出厂设置”的功能，**让状态（state）归零**，回归到一个初始状态。**让状态（state）归零**，是**构建状态（state）变化的机制**一个比较特殊的环节。结合生活来说，生活中有不顺的地方，就从新开始，从零开始。

```java
import org.objectweb.asm.Handle;
import org.objectweb.asm.Label;
import org.objectweb.asm.MethodVisitor;

public abstract class MethodPatternAdapter extends MethodVisitor {
    protected final static int SEEN_NOTHING = 0;
    protected int state;

    public MethodPatternAdapter(int api, MethodVisitor methodVisitor) {
        super(api, methodVisitor);
    }

    @Override
    public void visitInsn(int opcode) {
        visitInsn();
        super.visitInsn(opcode);
    }

    @Override
    public void visitIntInsn(int opcode, int operand) {
        visitInsn();
        super.visitIntInsn(opcode, operand);
    }

    @Override
    public void visitVarInsn(int opcode, int var) {
        visitInsn();
        super.visitVarInsn(opcode, var);
    }

    @Override
    public void visitTypeInsn(int opcode, String type) {
        visitInsn();
        super.visitTypeInsn(opcode, type);
    }

    @Override
    public void visitFieldInsn(int opcode, String owner, String name, String descriptor) {
        visitInsn();
        super.visitFieldInsn(opcode, owner, name, descriptor);
    }

    @Override
    public void visitMethodInsn(int opcode, String owner, String name, String descriptor) {
        visitInsn();
        super.visitMethodInsn(opcode, owner, name, descriptor);
    }

    @Override
    public void visitMethodInsn(int opcode, String owner, String name, String descriptor, boolean isInterface) {
        visitInsn();
        super.visitMethodInsn(opcode, owner, name, descriptor, isInterface);
    }

    @Override
    public void visitInvokeDynamicInsn(String name, String descriptor, Handle bootstrapMethodHandle, Object... bootstrapMethodArguments) {
        visitInsn();
        super.visitInvokeDynamicInsn(name, descriptor, bootstrapMethodHandle, bootstrapMethodArguments);
    }

    @Override
    public void visitJumpInsn(int opcode, Label label) {
        visitInsn();
        super.visitJumpInsn(opcode, label);
    }

    @Override
    public void visitLdcInsn(Object value) {
        visitInsn();
        super.visitLdcInsn(value);
    }

    @Override
    public void visitIincInsn(int var, int increment) {
        visitInsn();
        super.visitIincInsn(var, increment);
    }

    @Override
    public void visitTableSwitchInsn(int min, int max, Label dflt, Label... labels) {
        visitInsn();
        super.visitTableSwitchInsn(min, max, dflt, labels);
    }

    @Override
    public void visitLookupSwitchInsn(Label dflt, int[] keys, Label[] labels) {
        visitInsn();
        super.visitLookupSwitchInsn(dflt, keys, labels);
    }

    @Override
    public void visitMultiANewArrayInsn(String descriptor, int numDimensions) {
        visitInsn();
        super.visitMultiANewArrayInsn(descriptor, numDimensions);
    }

    @Override
    public void visitTryCatchBlock(Label start, Label end, Label handler, String type) {
        visitInsn();
        super.visitTryCatchBlock(start, end, handler, type);
    }

    @Override
    public void visitLabel(Label label) {
        visitInsn();
        super.visitLabel(label);
    }

    @Override
    public void visitFrame(int type, int numLocal, Object[] local, int numStack, Object[] stack) {
        visitInsn();
        super.visitFrame(type, numLocal, local, numStack, stack);
    }

    @Override
    public void visitMaxs(int maxStack, int maxLocals) {
        visitInsn();
        super.visitMaxs(maxStack, maxLocals);
    }

    protected abstract void visitInsn();
}
```

## 示例一：加零

### 预期目标

假如有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test(int a, int b) {
        int c = a + b;
        int d = c + 0;
        System.out.println(d);
    }
}
```

我们想要实现的预期目标：将 `int d = c + 0;` 转换成 `int d = c;`。

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test(int, int);
    Code:
       0: iload_1
       1: iload_2
       2: iadd
       3: istore_3
       4: iload_3
       5: iconst_0
       6: iadd
       7: istore        4
       9: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
      12: iload         4
      14: invokevirtual #3                  // Method java/io/PrintStream.println:(I)V
      17: return
}
```

### 编码实现

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;

import static org.objectweb.asm.Opcodes.*;

public class MethodRemoveAddZeroVisitor extends ClassVisitor {
    public MethodRemoveAddZeroVisitor(int api, ClassVisitor classVisitor) {
        super(api, classVisitor);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = cv.visitMethod(access, name, descriptor, signature, exceptions);
        if (mv != null && !"<init>".equals(name) && !"<clinit>".equals(name)) {
            boolean isAbstractMethod = (access & ACC_ABSTRACT) != 0;
            boolean isNativeMethod = (access & ACC_NATIVE) != 0;
            if (!isAbstractMethod && !isNativeMethod) {
                mv = new MethodRemoveAddZeroAdapter(api, mv);
            }
        }
        return mv;
    }

    private class MethodRemoveAddZeroAdapter extends MethodPatternAdapter {
        private static final int SEEN_ICONST_0 = 1;

        public MethodRemoveAddZeroAdapter(int api, MethodVisitor methodVisitor) {
            super(api, methodVisitor);
        }

        @Override
        public void visitInsn(int opcode) {
            // 第一，对于感兴趣的状态进行处理
            switch (state) {
                case SEEN_NOTHING:
                    if (opcode == ICONST_0) {
                        state = SEEN_ICONST_0;
                        return;
                    }
                    break;
                case SEEN_ICONST_0:
                    if (opcode == IADD) {
                        state = SEEN_NOTHING;
                        return;
                    }
                    else if (opcode == ICONST_0) {
                        mv.visitInsn(ICONST_0);
                        return;
                    }
                    break;
            }

            // 第二，对于不感兴趣的状态，交给父类进行处理
            super.visitInsn(opcode);
        }

        @Override
        protected void visitInsn() {
            if (state == SEEN_ICONST_0) {
                mv.visitInsn(ICONST_0);
            }
            state = SEEN_NOTHING;
        }
    }
}
```

### 进行转换

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

public class HelloWorldTransformCore {
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
        ClassVisitor cv = new MethodRemoveAddZeroVisitor(api, cw);

        //（4）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成 byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

### 验证结果

```text
$ javap -c sample.HelloWorld
public class sample.HelloWorld {
...
  public void test(int, int);
    Code:
       0: iload_1
       1: iload_2
       2: iadd
       3: istore_3
       4: iload_3
       5: istore        4
       7: getstatic     #16                 // Field java/lang/System.out:Ljava/io/PrintStream;
      10: iload         4
      12: invokevirtual #22                 // Method java/io/PrintStream.println:(I)V
      15: return
}
```

## 示例二：字段赋值

### 预期目标

假如有一个 `HelloWorld` 类，代码如下：

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

我们想要实现的预期目标：删除掉 `this.val = this.val;` 语句。

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
  public int val;

...

  public void test(int, int);
    Code:
       0: iload_1
       1: iload_2
       2: iadd
       3: istore_3
       4: aload_0
       5: aload_0
       6: getfield      #2                  // Field val:I
       9: putfield      #2                  // Field val:I
      12: getstatic     #3                  // Field java/lang/System.out:Ljava/io/PrintStream;
      15: iload_3
      16: invokevirtual #4                  // Method java/io/PrintStream.println:(I)V
      19: return
}
```

### 编码实现

![](/assets/images/java/asm/state_machine_for_aload0_aload0_getfield_putfield.png)

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;

import static org.objectweb.asm.Opcodes.*;

public class MethodRemoveGetFieldPutFieldVisitor extends ClassVisitor {
    public MethodRemoveGetFieldPutFieldVisitor(int api, ClassVisitor classVisitor) {
        super(api, classVisitor);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = cv.visitMethod(access, name, descriptor, signature, exceptions);
        if (mv != null && !"<init>".equals(name) && !"<clinit>".equals(name)) {
            boolean isAbstractMethod = (access & ACC_ABSTRACT) != 0;
            boolean isNativeMethod = (access & ACC_NATIVE) != 0;
            if (!isAbstractMethod && !isNativeMethod) {
                mv = new MethodRemoveGetFieldPutFieldAdapter(api, mv);
            }
        }
        return mv;
    }

    private class MethodRemoveGetFieldPutFieldAdapter extends MethodPatternAdapter {
        private final static int SEEN_ALOAD_0 = 1;
        private final static int SEEN_ALOAD_0_ALOAD_0 = 2;
        private final static int SEEN_ALOAD_0_ALOAD_0_GETFIELD = 3;

        private String fieldOwner;
        private String fieldName;
        private String fieldDesc;

        public MethodRemoveGetFieldPutFieldAdapter(int api, MethodVisitor methodVisitor) {
            super(api, methodVisitor);
        }

        @Override
        public void visitVarInsn(int opcode, int var) {
            // 第一，对于感兴趣的状态进行处理
            switch (state) {
                case SEEN_NOTHING:
                    if (opcode == ALOAD && var == 0) {
                        state = SEEN_ALOAD_0;
                        return;
                    }
                    break;
                case SEEN_ALOAD_0:
                    if (opcode == ALOAD && var == 0) {
                        state = SEEN_ALOAD_0_ALOAD_0;
                        return;
                    }
                    break;
                case SEEN_ALOAD_0_ALOAD_0:
                    if (opcode == ALOAD && var == 0) {
                        mv.visitVarInsn(opcode, var);
                        return;
                    }
                    break;
            }

            // 第二，对于不感兴趣的状态，交给父类进行处理
            super.visitVarInsn(opcode, var);
        }

        @Override
        public void visitFieldInsn(int opcode, String owner, String name, String descriptor) {
            // 第一，对于感兴趣的状态进行处理
            switch (state) {
                case SEEN_ALOAD_0_ALOAD_0:
                    if (opcode == GETFIELD) {
                        state = SEEN_ALOAD_0_ALOAD_0_GETFIELD;
                        fieldOwner = owner;
                        fieldName = name;
                        fieldDesc = descriptor;
                        return;
                    }
                    break;
                case SEEN_ALOAD_0_ALOAD_0_GETFIELD:
                    if (opcode == PUTFIELD && name.equals(fieldName)) {
                        state = SEEN_NOTHING;
                        return;
                    }
                    break;
            }

            // 第二，对于不感兴趣的状态，交给父类进行处理
            super.visitFieldInsn(opcode, owner, name, descriptor);
        }

        @Override
        protected void visitInsn() {
            switch (state) {
                case SEEN_ALOAD_0:
                    mv.visitVarInsn(ALOAD, 0);
                    break;
                case SEEN_ALOAD_0_ALOAD_0:
                    mv.visitVarInsn(ALOAD, 0);
                    mv.visitVarInsn(ALOAD, 0);
                    break;
                case SEEN_ALOAD_0_ALOAD_0_GETFIELD:
                    mv.visitVarInsn(ALOAD, 0);
                    mv.visitVarInsn(ALOAD, 0);
                    mv.visitFieldInsn(GETFIELD, fieldOwner, fieldName, fieldDesc);
                    break;
            }
            state = SEEN_NOTHING;
        }
    }
}
```

### 进行转换

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

public class HelloWorldTransformCore {
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
        ClassVisitor cv = new MethodRemoveGetFieldPutFieldVisitor(api, cw);

        //（4）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成 byte[]
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

  public sample.HelloWorld();
    Code:
       0: aload_0
       1: invokespecial #10                 // Method java/lang/Object."<init>":()V
       4: return

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

## 示例三：删除打印语句

### 预期目标

假如有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test(int a, int b) {
        System.out.println("Before a + b");
        int c = a + b;
        System.out.println("After a + b");
        System.out.println(c);
    }
}
```

我们想要实现的预期目标：删除掉打印字符串的语句。

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test(int, int);
    Code:
       0: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
       3: ldc           #3                  // String Before a + b
       5: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
       8: iload_1
       9: iload_2
      10: iadd
      11: istore_3
      12: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
      15: ldc           #5                  // String After a + b
      17: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      20: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
      23: iload_3
      24: invokevirtual #6                  // Method java/io/PrintStream.println:(I)V
      27: return
}
```

### 编码实现

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;

import static org.objectweb.asm.Opcodes.*;

public class MethodRemovePrintVisitor extends ClassVisitor {
    public MethodRemovePrintVisitor(int api, ClassVisitor classVisitor) {
        super(api, classVisitor);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = cv.visitMethod(access, name, descriptor, signature, exceptions);
        if (mv != null && !"<init>".equals(name) && !"<clinit>".equals(name)) {
            boolean isAbstractMethod = (access & ACC_ABSTRACT) != 0;
            boolean isNativeMethod = (access & ACC_NATIVE) != 0;
            if (!isAbstractMethod && !isNativeMethod) {
                mv = new MethodRemovePrintAdaptor(api, mv);
            }
        }
        return mv;
    }

    private class MethodRemovePrintAdaptor extends MethodPatternAdapter {
        private static final int SEEN_GETSTATIC = 1;
        private static final int SEEN_GETSTATIC_LDC = 2;

        private String message;

        public MethodRemovePrintAdaptor(int api, MethodVisitor methodVisitor) {
            super(api, methodVisitor);
        }

        @Override
        public void visitFieldInsn(int opcode, String owner, String name, String descriptor) {
            // 第一，对于感兴趣的状态进行处理
            boolean flag = (opcode == GETSTATIC && owner.equals("java/lang/System") && name.equals("out") 
                           && descriptor.equals("Ljava/io/PrintStream;"));
            switch (state) {
                case SEEN_NOTHING:
                    if (flag) {
                        state = SEEN_GETSTATIC;
                        return;
                    }
                    break;
                case SEEN_GETSTATIC:
                    if (flag) {
                        mv.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
                        return;
                    }
            }

            // 第二，对于不感兴趣的状态，交给父类进行处理
            super.visitFieldInsn(opcode, owner, name, descriptor);
        }

        @Override
        public void visitLdcInsn(Object value) {
            // 第一，对于感兴趣的状态进行处理
            switch (state) {
                case SEEN_GETSTATIC:
                    if (value instanceof String) {
                        state = SEEN_GETSTATIC_LDC;
                        message = (String) value;
                        return;
                    }
                    break;
            }

            // 第二，对于不感兴趣的状态，交给父类进行处理
            super.visitLdcInsn(value);
        }

        @Override
        public void visitMethodInsn(int opcode, String owner, String name, String descriptor, boolean isInterface) {
            // 第一，对于感兴趣的状态进行处理
            switch (state) {
                case SEEN_GETSTATIC_LDC:
                    if (opcode == INVOKEVIRTUAL && owner.equals("java/io/PrintStream") &&
                            name.equals("println") && descriptor.equals("(Ljava/lang/String;)V")) {
                        state = SEEN_NOTHING;
                        return;
                    }
                    break;
            }

            // 第二，对于不感兴趣的状态，交给父类进行处理
            super.visitMethodInsn(opcode, owner, name, descriptor, isInterface);
        }

        @Override
        protected void visitInsn() {
            switch (state) {
                case SEEN_GETSTATIC:
                    mv.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
                    break;
                case SEEN_GETSTATIC_LDC:
                    mv.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
                    mv.visitLdcInsn(message);
                    break;
            }

            state = SEEN_NOTHING;
        }
    }
}
```

### 进行转换

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

public class HelloWorldTransformCore {
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
        ClassVisitor cv = new MethodRemovePrintVisitor(api, cw);

        //（4）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成 byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

### 验证结果

```text
$ javap -c sample.HelloWorld
public class sample.HelloWorld {
...
  public void test(int, int);
    Code:
       0: iload_1
       1: iload_2
       2: iadd
       3: istore_3
       4: getstatic     #16                 // Field java/lang/System.out:Ljava/io/PrintStream;
       7: iload_3
       8: invokevirtual #22                 // Method java/io/PrintStream.println:(I)V
      11: return
}
```

## 总结

本文对 stateful transformations 进行介绍，内容总结如下：

- 第一点，stateful transformations 可以实现复杂的操作，它是借助于 state machine 来进行实现的。
- 第二点，对于 `MethodPatternAdapter` 类来说，它是一个原始的 state machine，本身是一个抽象类；我们写一个具体的子类，作为更“先进”的 state machine，在子类当中主要做三件事情：
    - 第一件事情，从字段层面，根据处理的问题，来定义更多的状态。
    - 第二件事情，从方法层面，处理好 `visitXxxInsn()` 的调用，对于 `state` 字段状态的影响。
    - 第三件事情，从方法层面，实现 `visitInsn()` 方法，根据 `state` 字段的值，如何回归到“初始状态”。
