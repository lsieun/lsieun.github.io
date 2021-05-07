---
title:  "MethodVisitor代码示例"
sequence: "014"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

The ASM core API for **generating** and **transforming** compiled Java classes is based on the `ClassVisitor` abstract class.

![](/assets/images/java/asm/what-asm-can-do.png)

在当前阶段，我们只能进行Class Generation的操作。

## 示例一：`<init>()`方法

在`.class`文件中，构造方法的名字是`<init>`。

预期结果：

{% highlight java %}
{% raw %}
public class HelloWorld {
}
{% endraw %}
{% endhighlight %}

或者：

{% highlight java %}
{% raw %}
public class HelloWorld {
    public HelloWorld() {
        super();
    }
}
{% endraw %}
{% endhighlight %}

实现代码：

{% highlight java %}
{% raw %}
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

        MethodVisitor mv = cw.visitMethod(ACC_PUBLIC, "<init>", "()V", null, null);
        mv.visitCode();
        mv.visitVarInsn(ALOAD, 0);
        mv.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
        mv.visitInsn(RETURN);
        mv.visitMaxs(1, 1);
        mv.visitEnd();

        cw.visitEnd();

        // (3) 调用toByteArray()方法
        return cw.toByteArray();
    }
}
{% endraw %}
{% endhighlight %}

验证结果：

{% highlight java %}
{% raw %}
public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        System.out.println(clazz);
    }
}
{% endraw %}
{% endhighlight %}

通过上面的示例，我们强调3个关注点：

- 第一个关注点，在创建`ClassWriter`对象时，我们使用了`ClassWriter.COMPUTE_FRAMES`。
- 第二个关注点，在使用`MethodVisitor`类时，其中`visitXxx()`方法的调用顺序。
- 第三个关注点，在`.class`文件中，构造方法的名字是`<init>`。

第一个关注点，详细说明。使用`ClassWriter.COMPUTE_FRAMES`的效果，会自动计算max stacks、max locals和stack map frames的具体值。从代码的角度来说，使用`ClassWriter.COMPUTE_FRAMES`，会忽略我们在代码中`visitMaxs()`方法和`visitFrame()`方法传入的具体参数值；换句话说，无论我们传入的参数值是否正确，ASM会帮助我们从新计算一个正确的值，代替我们在代码中传入的参数。

- 第1种情况，在创建`ClassWriter`对象时，`flags`参数使用`ClassWriter.COMPUTE_FRAMES`值，在调用`mv.visitMaxs(0, 0)`方法之后，仍然能得到一个正确的`.class`文件。
- 第2种情况，在创建`ClassWriter`对象时，`flags`参数使用`0`值，在调用`mv.visitMaxs(0, 0)`方法之后，得到的`.class`文件就不能正确运行。

第二个关注点，详细说明。在使用`MethodVisitor`类时，其中`visitXxx()`方法调用应该遵循以下顺序：

- 第一步，调用`visitCode()`方法，调用一次
- 第二步，调用`visitXxxInsn()`方法，可以调用多次
- 第三步，调用`visitMaxs()`方法，调用一次
- 第四步，调用`visitEnd()`方法，调用一次

## 示例二：不调用`visitMaxs()`方法

在创建`ClassWriter`对象时，`flags`参数使用`ClassWriter.COMPUTE_FRAMES`值，我们可以给`visitMaxs()`方法传入一个错误的值，但是不能省略对于`visitMaxs()`方法的调用。

如果省略对于`visitMaxs()`方法的调用，会出现如下错误：

{% highlight text %}
Exception in thread "main" java.lang.VerifyError: Operand stack overflow
Exception Details:
  Location:
    sample/HelloWorld.<init>()V @0: aload_0
  Reason:
    Exceeded max stack size.
  Current Frame:
    bci: @0
    flags: { flagThisUninit }
    locals: { uninitializedThis }
    stack: { }
  Bytecode:
    0x0000000: 2ab7 0008 b1                           

	at java.lang.Class.forName0(Native Method)
	at java.lang.Class.forName(Class.java:264)
	at sample.HelloWorldRun.main(HelloWorldRun.java:5)
{% endhighlight %}

## 示例三：`<clinit>`方法

预期结果：

{% highlight java %}
{% raw %}
public class HelloWorld {
    static {
        System.out.println("class initialization method");
    }
}
{% endraw %}
{% endhighlight %}

实现代码：

{% highlight java %}
{% raw %}
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

        MethodVisitor mv1 = cw.visitMethod(ACC_PUBLIC, "<init>", "()V", null, null);
        mv1.visitCode();
        mv1.visitVarInsn(ALOAD, 0);
        mv1.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
        mv1.visitInsn(RETURN);
        mv1.visitMaxs(1, 1);
        mv1.visitEnd();

        MethodVisitor mv2 = cw.visitMethod(ACC_STATIC, "<clinit>", "()V", null, null);
        mv2.visitCode();
        mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
        mv2.visitLdcInsn("class initialization method");
        mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
        mv2.visitInsn(RETURN);
        mv2.visitMaxs(2, 0);
        mv2.visitEnd();

        cw.visitEnd();

        // (3) 调用toByteArray()方法
        return cw.toByteArray();
    }
}
{% endraw %}
{% endhighlight %}

验证结果：

{% highlight java %}
{% raw %}
public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        System.out.println(clazz);
    }
}
{% endraw %}
{% endhighlight %}

## 示例四：lambda

预期结果：

{% highlight java %}
{% raw %}
import java.util.function.BiFunction;

public class HelloWorld {
    public void test() {
        BiFunction<Integer, Integer, Integer> func = Math::max;
        Integer result = func.apply(10, 20);
        System.out.println(result);
    }
}
{% endraw %}
{% endhighlight %}

实现代码：

{% highlight java %}
{% raw %}
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
            mv1.visitMaxs(0, 0);
            mv1.visitEnd();
        }

        {
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC, "test", "()V", null, null);
            mv2.visitCode();
            Handle bootstrapMethodHandle = new Handle(H_INVOKESTATIC, "java/lang/invoke/LambdaMetafactory", "metafactory",
                    "(Ljava/lang/invoke/MethodHandles$Lookup;Ljava/lang/String;Ljava/lang/invoke/MethodType;Ljava/lang/invoke/MethodType;" +
                            "Ljava/lang/invoke/MethodHandle;Ljava/lang/invoke/MethodType;)Ljava/lang/invoke/CallSite;", false);
            mv2.visitInvokeDynamicInsn("apply", "()Ljava/util/function/BiFunction;",
                    bootstrapMethodHandle,
                    Type.getType("(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;"),
                    new Handle(H_INVOKESTATIC, "java/lang/Math", "max", "(II)I", false),
                    Type.getType("(Ljava/lang/Integer;Ljava/lang/Integer;)Ljava/lang/Integer;")
            );
            mv2.visitVarInsn(ASTORE, 1);
            mv2.visitVarInsn(ALOAD, 1);
            mv2.visitIntInsn(BIPUSH, 10);
            mv2.visitMethodInsn(INVOKESTATIC, "java/lang/Integer", "valueOf", "(I)Ljava/lang/Integer;", false);
            mv2.visitIntInsn(BIPUSH, 20);
            mv2.visitMethodInsn(INVOKESTATIC, "java/lang/Integer", "valueOf", "(I)Ljava/lang/Integer;", false);
            mv2.visitMethodInsn(INVOKEINTERFACE, "java/util/function/BiFunction", "apply",
                    "(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;", true);
            mv2.visitTypeInsn(CHECKCAST, "java/lang/Integer");
            mv2.visitVarInsn(ASTORE, 2);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitVarInsn(ALOAD, 2);
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/Object;)V", false);
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(0, 0);
            mv2.visitEnd();
        }

        cw.visitEnd();

        // (3) 调用toByteArray()方法
        return cw.toByteArray();
    }
}
{% endraw %}
{% endhighlight %}

验证结果：

{% highlight java %}
{% raw %}
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Object obj = clazz.newInstance();

        Method m = clazz.getDeclaredMethod("test");
        m.invoke(obj);
    }
}
{% endraw %}
{% endhighlight %}

## 示例五：try catch clause

预期结果：

{% highlight java %}
{% raw %}
public class HelloWorld {
    public void test() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException ex) {
            ex.printStackTrace();
        }
    }
}
{% endraw %}
{% endhighlight %}

实现代码：

{% highlight java %}
{% raw %}
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
            mv1.visitMaxs(0, 0);
            mv1.visitEnd();
        }

        {
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC, "test", "()V", null, null);
            Label tryStartLabel = new Label();
            Label tryEndLabel = new Label();
            Label handlerLabel = new Label();
            Label returnLabel = new Label();

            // 第1段
            mv2.visitCode();
            mv2.visitTryCatchBlock(tryStartLabel, tryEndLabel, handlerLabel, "java/lang/InterruptedException");

            // 第2段
            mv2.visitLabel(tryStartLabel);
            mv2.visitLdcInsn(new Long(1000L));
            mv2.visitMethodInsn(INVOKESTATIC, "java/lang/Thread", "sleep", "(J)V", false);

            // 第3段
            mv2.visitLabel(tryEndLabel);
            mv2.visitJumpInsn(GOTO, returnLabel);

            // 第4段
            mv2.visitLabel(handlerLabel);
            mv2.visitVarInsn(ASTORE, 1);
            mv2.visitVarInsn(ALOAD, 1);
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/lang/InterruptedException", "printStackTrace", "()V", false);

            // 第5段
            mv2.visitLabel(returnLabel);
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(0, 0);
            mv2.visitEnd();
        }

        cw.visitEnd();

        // (3) 调用toByteArray()方法
        return cw.toByteArray();
    }
}
{% endraw %}
{% endhighlight %}

验证结果：

{% highlight java %}
{% raw %}
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Object obj = clazz.newInstance();

        Method m = clazz.getDeclaredMethod("test");
        m.invoke(obj);
    }
}
{% endraw %}
{% endhighlight %}

## 总结

在这里，我们介绍了几个关于`MethodVisitor`类的示例，其中的一个主要目的就是熟悉其中`visitXxx()`的调用顺序，即：

- 第一步，调用`visitCode()`方法，调用一次
- 第二步，调用`visitXxxInsn()`方法，可以调用多次
- 第三步，调用`visitMaxs()`方法，调用一次
- 第四步，调用`visitEnd()`方法，调用一次

针对于某一个具体的`visitXxx()`方法，我们可能不太了解它的作用和如何使用它，这个是需要我们在日后的使用过程中一点一点熟悉起来的。

因此，通过这几个示例，我们应重点关注多个`visitXxx()`方法之间的调用顺序，而具体某一个`visitXxx()`方法如何使用，需要我们慢慢积累经验，才能熟练使用。
