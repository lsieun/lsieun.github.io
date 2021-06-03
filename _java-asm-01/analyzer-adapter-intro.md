---
title:  "AnalyzerAdapter介绍"
sequence: "408"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

The `AnalyzerAdapter` is a `MethodVisitor` that keeps track of stack map frame changes between `visitFrame(int, int, Object[], int, Object[])` calls.
This `AnalyzerAdapter` adapter must be used with the `ClassReader.EXPAND_FRAMES` option.

This method adapter computes the **stack map frames** before each instruction, based on the frames visited in `visitFrame`.
Indeed, `visitFrame` is only called before some specific instructions in a method, in order to save space,
and because "the other frames can be easily and quickly inferred from these ones".
This is what this adapter does.

`AnalyzerAdapter`类是将

![](/assets/images/java/asm/frame-local-variables-operand-stack.png)

在画图的时候，我习惯将operand stack放在左边，将local variables放在右边。但是，当考虑某一条instruction所对应的frame状态的时候，我习惯于先描述local variables的状态，再去描述operand stack的状态。

## AnalyzerAdapter类

### class info

`AnalyzerAdapter`类的父类是`MethodVisitor`类。

{% highlight java %}
{% raw %}
public class AnalyzerAdapter extends MethodVisitor {
}
{% endraw %}
{% endhighlight %}

### fields

我们将以下列出的字段分成3个组：

- 第1组，包括`locals`、`stack`、`maxLocals`和`maxStack`字段，它们是与local variables和operand stack直接相关的字段。
- 第2组，包括`labels`和`uninitializedTypes`字段，它们记录的是未初始化的对象类型，是属于一些特殊情况。
- 第3组，是`owner`字段，表示当前类的名字。

{% highlight java %}
{% raw %}
public class AnalyzerAdapter extends MethodVisitor {
    // 第1组字段：local variables和operand stack
    public List<Object> locals;
    public List<Object> stack;
    private int maxLocals;
    private int maxStack;

    // 第2组字段：uninitialized类型
    private List<Label> labels;
    public Map<Object, Object> uninitializedTypes;

    // 第3组字段：类的名字
    private String owner;
}
{% endraw %}
{% endhighlight %}

对于“未初始化的对象类型”，我们来举个例子，比如说`new String()`会创建一个`String`类型的对象，但是对应到bytecode层面是3条instruction：

{% highlight text %}
NEW java/lang/String
DUP
INVOKESPECIAL java/lang/String.<init> ()V
{% endhighlight %}

- 第1条instruction，是`NEW java/lang/String`，会为即将创建的对象分配内存空间，确切的说是在堆（heap）上分配内存空间，同时将一个`reference`放到operand stack上，这个`reference`就指向这块内存空间。由于这块内存空间还没有进行初始化，所以这个`reference`对应的内容并不能确切的叫作“对象”，只能叫作“未初始化的对象”，也就是“uninitialized object”。
- 第2条instruction，是`DUP`，会将operand stack上的原有的`reference`复制一份，这时候operand stack上就有两个`reference`，这两个`reference`都指向那块未初始化的内存空间，这两个`reference`的内容都对应于同一个“uninitialized object”。
- 第3条instruction，是`INVOKESPECIAL java/lang/String.<init> ()V`，会将那块内存空间进行初始化，同时会“消耗”掉operand stack最上面的`reference`，那么就只剩下一个`reference`了。由于那块内存空间进行了初始化操作，那么剩下的`reference`对应的内容就是一个“经过初始化的对象”，就是一个平常所说的“对象”了。

### constructors

这里列出了两个构造方法，但这两个构造方法本质上是同一个。

大家知道，local variables和operand stack会随着后续instruction的执行而发生变化，但是它们总得有一个初始状态。那么，local variables和operand stack的初始状态怎么得来的呢？operand stack的初始状态是，栈里的元素是空的；而local variables的初始状态，主要是通过方法接收的参数得到的，同时要考虑当前方法是不是static方法、当前方法是不是`<init>()`方法。

构造方法的主要作用就是对local variables的内容进行初始化，为local variables赋予一个初始状态。

{% highlight java %}
{% raw %}
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
        
        // 首先，判断是不是static方法、是不是构造方法，来更新local variables的初始状态
        if ((access & Opcodes.ACC_STATIC) == 0) {
            if ("<init>".equals(name)) {
                locals.add(Opcodes.UNINITIALIZED_THIS);
            } else {
                locals.add(owner);
            }
        }

        // 其次，根据方法接收的参数，来更新local variables的初始状态
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
{% endraw %}
{% endhighlight %}

### methods

#### visitFrame方法

我们知道，构造方法（`<init>()`）会为local variables和operand stack赋予一个初始状态，但是在后续执行instruction的时候，可能会发生跳转，那跳转之后的local variables和operand stack的状态就不连贯了，这个时候就需要给local variables和operand stack重新设置一个新的状态。

`visitFrame()`方法，是将local variables和operand stack设置成某一个状态；后续的instruction在这个状态的基础上，local variables和operand stack一步一步的发生变化。

{% highlight java %}
{% raw %}
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
{% endraw %}
{% endhighlight %}

#### return和jump

当遇到`return`、`goto`、`switch`（`tableswitch`和`lookupswitch`）时，会将`locals`字段和`stack`字段设置为`null`。

{% highlight java %}
{% raw %}
public class AnalyzerAdapter extends MethodVisitor {
    // 这里对应return语句
    public void visitInsn(final int opcode) {
        super.visitInsn(opcode);
        execute(opcode, 0, null);
        if ((opcode >= Opcodes.IRETURN && opcode <= Opcodes.RETURN) || opcode == Opcodes.ATHROW) {
            this.locals = null;
            this.stack = null;
        }
    }

    // 这里对应goto语句
    public void visitJumpInsn(final int opcode, final Label label) {
        super.visitJumpInsn(opcode, label);
        execute(opcode, 0, null);
        if (opcode == Opcodes.GOTO) {
            this.locals = null;
            this.stack = null;
        }
    }

    // 这里对应switch语句
    public void visitTableSwitchInsn(int min, int max, Label dflt, Label... labels) {
        super.visitTableSwitchInsn(min, max, dflt, labels);
        execute(Opcodes.TABLESWITCH, 0, null);
        this.locals = null;
        this.stack = null;
    }
    
    // 这里对应switch语句
    public void visitLookupSwitchInsn(Label dflt, int[] keys, Label[] labels) {
        super.visitLookupSwitchInsn(dflt, keys, labels);
        execute(Opcodes.LOOKUPSWITCH, 0, null);
        this.locals = null;
        this.stack = null;
    }
}
{% endraw %}
{% endhighlight %}

#### new和invokespecial

当遇到`new`时，会创建`Label`对象来表示“未初始化的对象”，并将label存储到`uninitializedTypes`字段内；当遇到`invokespecial`时，会把“未初始化的对象”从`uninitializedTypes`字段内取出来，转换成“经过初始化之后的对象”，然后同步到`locals`字段和`stack`字段内。

{% highlight java %}
{% raw %}
public class AnalyzerAdapter extends MethodVisitor {
    // 对应于new
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

    // 对应于invokespecial
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
{% endraw %}
{% endhighlight %}

#### execute方法

`execute()`方法是模拟每一条instruction对于local variables和operand stack的影响。

{% highlight java %}
{% raw %}
public class AnalyzerAdapter extends MethodVisitor {
    private void execute(final int opcode, final int intArg, final String stringArg) {
        // ......
    }
}
{% endraw %}
{% endhighlight %}

## 示例

### 编码实现

{% highlight java %}
{% raw %}
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
        if (mv != null) {
            mv = new MethodStackMapFrameAdapter(api, owner, access, name, descriptor, mv);
        }
        return mv;
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
        public void visitMethodInsn(int opcode, String owner, String name, String descriptor) {
            super.visitMethodInsn(opcode, owner, name, descriptor);
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
            String locals_str = locals == null ? "[]": list2Str(locals);
            String stack_str = locals == null ? "[]": list2Str(stack);
            String line = String.format("%s %s", locals_str, stack_str);
            System.out.println(line);
        }

        private String list2Str(List<Object> list) {
            int size = list.size();
            String[] array = new String[size];
            for (int i = 0; i < size - 1; i++) {
                Object item = list.get(i);
                array[i] = item2Str(item);
            }
            if (size > 0) {
                int lastIndex = size - 1;
                Object item = list.get(lastIndex);
                array[lastIndex] = item2Str(item);
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
{% endraw %}
{% endhighlight %}

### 验证结果

{% highlight java %}
{% raw %}
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

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new MethodStackMapFrameVisitor(api, cw);

        //（4）结合ClassReader和ClassVisitor
        int parsingOptions = ClassReader.EXPAND_FRAMES; // 注意，这里使用了EXPAND_FRAMES
        cr.accept(cv, parsingOptions);

        //（5）生成byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
{% endraw %}
{% endhighlight %}

## 总结

这篇文章主要介绍`AnalyzerAdapter`类。首先，我们介绍了`AnalyzerAdapter`类的成员信息；其次，介绍了`AnalyzerAdapter`类的示例，在这个示例当中演示了一下local variables和operand stack是如何变化的。

需要注意的一点是，在使用`AnalyzerAdapter`类时，要记得用`ClassReader.EXPAND_FRAMES`选项。

对于我个人来说，`AnalyzerAdapter`类，更多的是具有“学习特性”，而不是“实用特性”。所谓的“学习特性”，具体来说，就是`AnalyzerAdapter`类让我们能够去学习local variables和operand stack随着instruction的向下执行而发生变化。所谓的“实用特性”，就是像`AdviceAdapter`类那样，它有明确的使用场景，也就是在“方法进入”的时候和“方法退出”的时候来添加一些代码。


