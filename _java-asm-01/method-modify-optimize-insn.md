---
title:  "修改已有的方法（优化－删除－去掉没有必要的Instruction）"
sequence: "312"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

## 复杂的变换

The transformation seen in the previous section is local and
does not depend on the instructions that have been visited before the current one:
the code added at the beginning is always the same and is always added,
and likewise for the code inserted before each `RETURN` instruction.
Such transformations are called **stateless transformations**.
They are simple to implement but only the simplest transformations verify this property.

More **complex transformations** require **memorizing some state about the instructions that have been visited before the current one**.
Consider for example a transformation that removes all occurrences of the `ICONST_0 IADD` sequence, whose empty effect is to add `0`.
It is clear that when an `IADD` instruction is visited, it must be removed only if the last visited instruction was an `ICONST_0`.
This requires storing state inside the method adapter.
For this reason such transformations are called **stateful transformations**.

Let’s look in more details at this example.
When an `ICONST_0` is visited, it must be removed only if the next instruction is an `IADD`.
**The problem is that the next instruction is not yet known**.
**The solution is to postpone this decision to the next instruction**:
if it is an `IADD` then remove both instructions, otherwise emit the `ICONST_0` and the current instruction.

In order to implement transformations that remove or replace some instruction sequence,
it is convenient to introduce a `MethodVisitor` subclass whose `visitXxxInsn()` methods call a common `visitInsn()` method:

{% highlight java %}
{% raw %}
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
{% endraw %}
{% endhighlight %}

在上面的代码中，最后一个方法是`visitInsn()`，它是一个抽象方法。在这个抽象方法中，我们要做的事情就是让所有的其它状态都回归“初始状态”。

## 示例一：加零

### 预期目标

{% highlight java %}
{% raw %}
public class HelloWorld {
    public void test(int a, int b) {
        int c = a + b;
        int d = c + 0;
        System.out.println(d);
    }
}
{% endraw %}
{% endhighlight %}

{% highlight text %}
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
  public sample.HelloWorld();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

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
{% endhighlight %}

### 编码实现

{% highlight java %}
{% raw %}
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
{% endraw %}
{% endhighlight %}

### 进行转换

{% highlight java %}
{% raw %}
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

public class HelloWorldTransformCore {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new MethodRemoveAddZeroVisitor(api, cw);

        //（4）结合ClassReader和ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
{% endraw %}
{% endhighlight %}

### 验证结果

{% highlight text %}
$ javap -c sample.HelloWorld
public class sample.HelloWorld {
  public sample.HelloWorld();
    Code:
       0: aload_0
       1: invokespecial #8                  // Method java/lang/Object."<init>":()V
       4: return

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
{% endhighlight %}

## 示例二：字段赋值

{:refdef: style="text-align: center;"}
![](/assets/images/java/asm/state_machine_for_aload0_aload0_getfield_putfield.png)
{: refdef}

### 预期目标

{% highlight java %}
{% raw %}
public class HelloWorld {
    public int val;

    public void test(int a, int b) {
        int c = a + b;
        this.val = this.val;
        System.out.println(c);
    }
}
{% endraw %}
{% endhighlight %}

{% highlight text %}
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
  public int val;

  public sample.HelloWorld();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

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
{% endhighlight %}

### 编码实现

{% highlight java %}
{% raw %}
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
{% endraw %}
{% endhighlight %}

### 进行转换

{% highlight java %}
{% raw %}
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

public class HelloWorldTransformCore {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new MethodRemoveGetFieldPutFieldVisitor(api, cw);

        //（4）结合ClassReader和ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
{% endraw %}
{% endhighlight %}

### 验证结果

{% highlight text %}
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
{% endhighlight %}

## 示例三：删除打印语句

### 预期目标

{% highlight java %}
{% raw %}
public class HelloWorld {
    public void test(int a, int b) {
        System.out.println("Before a + b");
        int c = a + b;
        System.out.println("After a + b");
        System.out.println(c);
    }
}
{% endraw %}
{% endhighlight %}

{% highlight text %}
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
  public sample.HelloWorld();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

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
{% endhighlight %}

### 编码实现

{% highlight java %}
{% raw %}
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
{% endraw %}
{% endhighlight %}

### 进行转换

{% highlight java %}
{% raw %}
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

public class HelloWorldTransformCore {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new MethodRemovePrintVisitor(api, cw);

        //（4）结合ClassReader和ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
{% endraw %}
{% endhighlight %}

### 验证结果

{% highlight text %}
$ javap -c sample.HelloWorld
public class sample.HelloWorld {
  public sample.HelloWorld();
    Code:
       0: aload_0
       1: invokespecial #8                  // Method java/lang/Object."<init>":()V
       4: return

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
{% endhighlight %}

## 总结

本文对stateful transformations进行介绍，内容总结如下：

- 第一点，stateful transformations可以实现复杂的操作，它需要记录Instruction的状态信息。
- 第二点，在`MethodPatternAdapter`类当中，最后一个方法是自定义的`visitInsn()`方法，它是一个抽象方法。在这个抽象方法中，我们要做的事情就是让所有的其它状态都回归“初始状态”。
