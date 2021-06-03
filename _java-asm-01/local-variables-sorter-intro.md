---
title:  "LocalVariablesSorter介绍"
sequence: "407"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

对于`LocalVariablesSorter`类来说，它的特点是“可以引入新的局部变量，并且能够对局部变量重新排序”。

## LocalVariablesSorter类

### class info

`LocalVariablesSorter`类继承自`MethodVisitor`类。

- org.objectweb.asm.MethodVisitor
    - org.objectweb.asm.commons.LocalVariablesSorter
        - org.objectweb.asm.commons.GeneratorAdapter
            - org.objectweb.asm.commons.AdviceAdapter
    
{% highlight java %}
{% raw %}
public class LocalVariablesSorter extends MethodVisitor {
}
{% endraw %}
{% endhighlight %}

### fields

{% highlight java %}
{% raw %}
public class LocalVariablesSorter extends MethodVisitor {
    // The mapping from old to new local variable indices.
    // A local variable at index i of size 1 is remapped to 'mapping[2*i]',
    // while a local variable at index i of size 2 is remapped to 'mapping[2*i+1]'.
    private int[] remappedVariableIndices = new int[40];

    // The local variable types after remapping.
    private Object[] remappedLocalTypes = new Object[20];

    protected final int firstLocal;
    protected int nextLocal;
}
{% endraw %}
{% endhighlight %}

### constructors

{% highlight java %}
{% raw %}
public class LocalVariablesSorter extends MethodVisitor {
    public LocalVariablesSorter(final int access, final String descriptor, final MethodVisitor methodVisitor) {
        this(Opcodes.ASM9, access, descriptor, methodVisitor);
    }

    protected LocalVariablesSorter(final int api, final int access, final String descriptor,
                                   final MethodVisitor methodVisitor) {
        super(api, methodVisitor);
        nextLocal = (Opcodes.ACC_STATIC & access) == 0 ? 1 : 0;
        for (Type argumentType : Type.getArgumentTypes(descriptor)) {
            nextLocal += argumentType.getSize();
        }
        firstLocal = nextLocal;
    }
}
{% endraw %}
{% endhighlight %}

### methods

#### newLocal method

`LocalVariablesSorter`类要处理好“新添加的变量”与“原有变量”之间的关系。

{% highlight java %}
{% raw %}
public class LocalVariablesSorter extends MethodVisitor {
    public int newLocal(final Type type) {
        Object localType;
        switch (type.getSort()) {
            case Type.BOOLEAN:
            case Type.CHAR:
            case Type.BYTE:
            case Type.SHORT:
            case Type.INT:
                localType = Opcodes.INTEGER;
                break;
            case Type.FLOAT:
                localType = Opcodes.FLOAT;
                break;
            case Type.LONG:
                localType = Opcodes.LONG;
                break;
            case Type.DOUBLE:
                localType = Opcodes.DOUBLE;
                break;
            case Type.ARRAY:
                localType = type.getDescriptor();
                break;
            case Type.OBJECT:
                localType = type.getInternalName();
                break;
            default:
                throw new AssertionError();
        }
        int local = newLocalMapping(type);
        setLocalType(local, type);
        setFrameLocal(local, localType);
        return local;
    }

    protected int newLocalMapping(final Type type) {
        int local = nextLocal;
        nextLocal += type.getSize();
        return local;
    }

    protected void setLocalType(final int local, final Type type) {
        // The default implementation does nothing.
    }

    private void setFrameLocal(final int local, final Object type) {
        int numLocals = remappedLocalTypes.length;
        if (local >= numLocals) { // 这里是处理分配空间不足的情况
            Object[] newRemappedLocalTypes = new Object[Math.max(2 * numLocals, local + 1)];
            System.arraycopy(remappedLocalTypes, 0, newRemappedLocalTypes, 0, numLocals);
            remappedLocalTypes = newRemappedLocalTypes;
        }
        remappedLocalTypes[local] = type; // 真正的处理逻辑只有这一句代码
    }
}
{% endraw %}
{% endhighlight %}

#### local variables method

{% highlight java %}
{% raw %}
public class LocalVariablesSorter extends MethodVisitor {
    @Override
    public void visitVarInsn(final int opcode, final int var) {
        Type varType;
        switch (opcode) {
            case Opcodes.LLOAD:
            case Opcodes.LSTORE:
                varType = Type.LONG_TYPE;
                break;
            case Opcodes.DLOAD:
            case Opcodes.DSTORE:
                varType = Type.DOUBLE_TYPE;
                break;
            case Opcodes.FLOAD:
            case Opcodes.FSTORE:
                varType = Type.FLOAT_TYPE;
                break;
            case Opcodes.ILOAD:
            case Opcodes.ISTORE:
                varType = Type.INT_TYPE;
                break;
            case Opcodes.ALOAD:
            case Opcodes.ASTORE:
            case Opcodes.RET:
                varType = OBJECT_TYPE;
                break;
            default:
                throw new IllegalArgumentException("Invalid opcode " + opcode);
        }
        super.visitVarInsn(opcode, remap(var, varType));
    }

    @Override
    public void visitIincInsn(final int var, final int increment) {
        super.visitIincInsn(remap(var, Type.INT_TYPE), increment);
    }

    private int remap(final int var, final Type type) {
        // 第一部分，处理方法的输入参数
        if (var + type.getSize() <= firstLocal) {
            return var;
        }

        // 第二部分，处理方法体内定义的局部变量
        int key = 2 * var + type.getSize() - 1;
        int size = remappedVariableIndices.length;
        if (key >= size) { // 这段代码，主要是处理分配空间不足的情况。我们可以假设分配的空间一直是足够的，那么可以忽略此段代码
            int[] newRemappedVariableIndices = new int[Math.max(2 * size, key + 1)];
            System.arraycopy(remappedVariableIndices, 0, newRemappedVariableIndices, 0, size);
            remappedVariableIndices = newRemappedVariableIndices;
        }
        int value = remappedVariableIndices[key];
        if (value == 0) { // 如果是0，则表示还没有记录下来
            value = newLocalMapping(type);
            setLocalType(value, type);
            remappedVariableIndices[key] = value + 1;
        } else { // 如果不是0，则表示有具体的值
            value--;
        }
        return value;
    }

    protected int newLocalMapping(final Type type) {
        int local = nextLocal;
        nextLocal += type.getSize();
        return local;
    }
}
{% endraw %}
{% endhighlight %}

## 如何使用

This method adapter **renumbers the local variables** used in a method **in the order they appear in this method**.

This adapter is useful to insert **new local variables** in a method.
Without this adapter it would be necessary to add new local variables after all the existing ones,
but unfortunately their number is not known until the end of the method, in `visitMaxs()`.

## 示例

### 预期目标

修改前：

{% highlight java %}
{% raw %}
import java.util.Random;

public class HelloWorld {
    public void test(int a, int b) throws Exception {
        int c = a + b;
        int d = c * 10;
        Random rand = new Random();
        int value = rand.nextInt(d);
        Thread.sleep(value);
    }
}
{% endraw %}
{% endhighlight %}

修改后：

{% highlight java %}
{% raw %}
import java.util.Random;

public class HelloWorld {
    public void test(int a, int b) throws Exception {
        long t = System.currentTimeMillis();

        int c = a + b;
        int d = c * 10;
        Random rand = new Random();
        int value = rand.nextInt(d);
        Thread.sleep(value);

        t = System.currentTimeMillis() - t;
        System.out.println("test method execute: " + t);
    }
}
{% endraw %}
{% endhighlight %}

### 编码实现

{% highlight java %}
{% raw %}
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Type;
import org.objectweb.asm.commons.LocalVariablesSorter;

import static org.objectweb.asm.Opcodes.*;

public class MethodTimerVisitor3 extends ClassVisitor {
    public MethodTimerVisitor3(int api, ClassVisitor cv) {
        super(api, cv);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);

        if (mv != null && !"<init>".equals(name) && !"<clinit>".equals(name)) {
            boolean isAbstractMethod = (access & ACC_ABSTRACT) != 0;
            boolean isNativeMethod = (access & ACC_NATIVE) != 0;
            if (!isAbstractMethod && !isNativeMethod) {
                mv = new MethodTimerAdapter3(api, access, name, descriptor, mv);
            }
        }
        return mv;
    }

    private static class MethodTimerAdapter3 extends LocalVariablesSorter {
        private final String methodName;
        private final String methodDesc;
        private int slotIndex;

        public MethodTimerAdapter3(int api, int access, String name, String descriptor, MethodVisitor methodVisitor) {
            super(api, access, descriptor, methodVisitor);
            this.methodName = name;
            this.methodDesc = descriptor;
        }

        @Override
        public void visitCode() {
            // 首先，实现自己的逻辑
            slotIndex = newLocal(Type.LONG_TYPE);
            super.visitMethodInsn(INVOKESTATIC, "java/lang/System", "currentTimeMillis", "()J", false);
            super.visitVarInsn(LSTORE, slotIndex);

            // 其次，调用父类的实现
            super.visitCode();
        }

        @Override
        public void visitInsn(int opcode) {
            // 首先，实现自己的逻辑
            if ((opcode >= IRETURN && opcode <= RETURN) || opcode == ATHROW) {
                super.visitMethodInsn(INVOKESTATIC, "java/lang/System", "currentTimeMillis", "()J", false);
                super.visitVarInsn(LLOAD, slotIndex);
                super.visitInsn(LSUB);
                super.visitVarInsn(LSTORE, slotIndex);
                super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
                super.visitTypeInsn(NEW, "java/lang/StringBuilder");
                super.visitInsn(DUP);
                super.visitMethodInsn(INVOKESPECIAL, "java/lang/StringBuilder", "<init>", "()V", false);
                super.visitLdcInsn(methodName + methodDesc + " method execute: ");
                super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;", false);
                super.visitVarInsn(LLOAD, slotIndex);
                super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(J)Ljava/lang/StringBuilder;", false);
                super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "toString", "()Ljava/lang/String;", false);
                super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            }

            // 其次，调用父类的实现
            super.visitInsn(opcode);
        }
    }
}
{% endraw %}
{% endhighlight %}

{% highlight java %}
{% raw %}
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Type;
import org.objectweb.asm.commons.AdviceAdapter;

public class MethodTimerVisitor4 extends ClassVisitor {
    public MethodTimerVisitor4(int api, ClassVisitor classVisitor) {
        super(api, classVisitor);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        if (mv != null) {
            mv = new MethodTimerAdapter4(api, mv, access, name, descriptor);
        }
        return mv;
    }

    private class MethodTimerAdapter4 extends AdviceAdapter {
        private int slotIndex;

        public MethodTimerAdapter4(int api, MethodVisitor mv, int access, String name, String descriptor) {
            super(api, mv, access, name, descriptor);
        }

        @Override
        protected void onMethodEnter() {
            slotIndex = newLocal(Type.LONG_TYPE);
            mv.visitMethodInsn(INVOKESTATIC, "java/lang/System", "currentTimeMillis", "()J", false);
            mv.visitVarInsn(LSTORE, slotIndex);
        }

        @Override
        protected void onMethodExit(int opcode) {
            if ((opcode >= IRETURN && opcode <= RETURN) || opcode == ATHROW) {
                mv.visitMethodInsn(INVOKESTATIC, "java/lang/System", "currentTimeMillis", "()J", false);
                mv.visitVarInsn(LLOAD, slotIndex);
                mv.visitInsn(LSUB);
                mv.visitVarInsn(LSTORE, slotIndex);
                mv.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
                mv.visitTypeInsn(NEW, "java/lang/StringBuilder");
                mv.visitInsn(DUP);
                mv.visitMethodInsn(INVOKESPECIAL, "java/lang/StringBuilder", "<init>", "()V", false);
                mv.visitLdcInsn(getName() + methodDesc + " method execute: ");
                mv.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;", false);
                mv.visitVarInsn(LLOAD, slotIndex);
                mv.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(J)Ljava/lang/StringBuilder;", false);
                mv.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "toString", "()Ljava/lang/String;", false);
                mv.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            }
        }
    }
}
{% endraw %}
{% endhighlight %}

### 进行转换

{% highlight java %}
{% raw %}
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Opcodes;

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
        ClassVisitor cv = new MethodTimerVisitor4(api, cw);

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

{% highlight java %}
{% raw %}
public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        HelloWorld instance = new HelloWorld();
        instance.test(10, 20);
    }
}
{% endraw %}
{% endhighlight %}

## 总结


