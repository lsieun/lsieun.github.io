---
title:  "MethodVisitor代码示例"
sequence: "208"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

{:refdef: style="text-align: center;"}
![What ASM Can Do](/assets/images/java/asm/what-asm-can-do.png)
{: refdef}

在当前阶段，我们只能进行Class Generation的操作。

## 示例一：`<init>()`方法

在`.class`文件中，构造方法的名字是`<init>`。其实，`<init>`是instance initialization method的缩写。

### 预期目标

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

### 编译实现

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

### 验证结果

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

如果我们省略掉`visitCode()`和`visitEnd()`方法，生成的`.class`文件也不会出错；当然，我们不建议这么做。但是，如果我们省略掉对于`visitMaxs()`方法的调用，生成的`.class`文件就会出错。

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

静态初始化方法的名字是`<clinit>`，它表示class initialization method的缩写。

### 预期目标

{% highlight java %}
{% raw %}
public class HelloWorld {
    static {
        System.out.println("class initialization method");
    }
}
{% endraw %}
{% endhighlight %}

### 编码实现

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

### 验证结果

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

## 示例四：try catch clause

### 预期目标

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

### 编码实现

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

### 验证结果

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

## 示例五：不同的MethodVisitor交叉使用

假如我们有两个`MethodVisitor`对象`mv1`和`mv2`，如下所示：

{% highlight java %}
{% raw %}
MethodVisitor mv1 = cw.visitMethod(...);
MethodVisitor mv2 = cw.visitMethod(...);
{% endraw %}
{% endhighlight %}

同时，我们也知道`MethodVisitor`类里的`visitXxx()`方法需要遵循一定的调用顺序：

- 第一步，调用`visitCode()`方法，调用一次
- 第二步，调用`visitXxxInsn()`方法，可以调用多次
- 第三步，调用`visitMaxs()`方法，调用一次
- 第四步，调用`visitEnd()`方法，调用一次

对于`mv1`和`mv2`这两个对象来说，它们的`visitXxx()`方法的调用顺序是彼此独立的、不会相互干扰。

一般情况下，我们可以如下写代码，这样逻辑比较清晰：

{% highlight java %}
{% raw %}
MethodVisitor mv1 = cw.visitMethod(...);
mv1.visitCode(...);
mv1.visitXxxInsn(...)
mv1.visitMaxs(...);
mv1.visitEnd();

MethodVisitor mv2 = cw.visitMethod(...);
mv2.visitCode(...);
mv2.visitXxxInsn(...)
mv2.visitMaxs(...);
mv2.visitEnd();
{% endraw %}
{% endhighlight %}

但是，我们也可以这样来写代码：

{% highlight java %}
{% raw %}
MethodVisitor mv1 = cw.visitMethod(...);
MethodVisitor mv2 = cw.visitMethod(...);

mv1.visitCode(...);
mv2.visitCode(...);

mv2.visitXxxInsn(...)
mv1.visitXxxInsn(...)

mv1.visitMaxs(...);
mv1.visitEnd();
mv2.visitMaxs(...);
mv2.visitEnd();
{% endraw %}
{% endhighlight %}

在上面的代码中，`mv1`和`mv2`这两个对象的`visitXxx()`方法交叉调用，这是可以的。换句话说，只要每一个`MethodVisitor`对象在调用`visitXxx()`方法时，遵循了调用顺序，那结果就是正确的；不同的`MethodVisitor`对象，是相互独立的、不会彼此影响。

那么，可能有的同学会问：`MethodVisitor`对象交叉使用有什么作用呢？有没有什么场景下的应用呢？回答是“有的”。在ASM当中，有一个`org.objectweb.asm.commons.StaticInitMerger`类，类当中有一个`MethodVisitor mergedClinitVisitor`，它就是一个很好的示例，在后续内容中，我们会介绍到这个类。

### 预期目标

{% highlight java %}
{% raw %}
import java.util.Date;

public class HelloWorld {
    public void test() {
        System.out.println("This is a test method.");
    }
    
    public void printDate() {
        Date now = new Date();
        System.out.println(now);
    }
}
{% endraw %}
{% endhighlight %}

### 编码实现（第一种方式，顺序）

{% highlight java %}
{% raw %}
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.MethodVisitor;

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
            mv1.visitMaxs(1, 1);
            mv1.visitEnd();
        }

        {
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC, "test", "()V", null, null);
            mv2.visitCode();
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("This is a test method.");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(2, 1);
            mv2.visitEnd();
        }

        {
            MethodVisitor mv3 = cw.visitMethod(ACC_PUBLIC, "printDate", "()V", null, null);
            mv3.visitCode();
            mv3.visitTypeInsn(NEW, "java/util/Date");
            mv3.visitInsn(DUP);
            mv3.visitMethodInsn(INVOKESPECIAL, "java/util/Date", "<init>", "()V", false);
            mv3.visitVarInsn(ASTORE, 1);
            mv3.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv3.visitVarInsn(ALOAD, 1);
            mv3.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/Object;)V", false);
            mv3.visitInsn(RETURN);
            mv3.visitMaxs(2, 2);
            mv3.visitEnd();
        }

        cw.visitEnd();

        // (3) 调用toByteArray()方法
        return cw.toByteArray();
    }
}
{% endraw %}
{% endhighlight %}

### 编码实现（第二种方式，交叉）

{% highlight java %}
{% raw %}
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.MethodVisitor;

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
            mv1.visitMaxs(1, 1);
            mv1.visitEnd();
        }

        {
            // 第1部分，mv2
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC, "test", "()V", null, null);

            // 第2部分，mv3
            MethodVisitor mv3 = cw.visitMethod(ACC_PUBLIC, "printDate", "()V", null, null);
            mv3.visitCode();
            mv3.visitTypeInsn(NEW, "java/util/Date");
            mv3.visitInsn(DUP);
            mv3.visitMethodInsn(INVOKESPECIAL, "java/util/Date", "<init>", "()V", false);

            // 第3部分，mv2
            mv2.visitCode();
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("This is a test method.");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);

            // 第4部分，mv3
            mv3.visitVarInsn(ASTORE, 1);
            mv3.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv3.visitVarInsn(ALOAD, 1);
            mv3.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/Object;)V", false);

            // 第5部分，mv2
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(2, 1);
            mv2.visitEnd();

            // 第6部分，mv3
            mv3.visitInsn(RETURN);
            mv3.visitMaxs(2, 2);
            mv3.visitEnd();
        }

        cw.visitEnd();

        // (3) 调用toByteArray()方法
        return cw.toByteArray();
    }
}
{% endraw %}
{% endhighlight %}

### 验证结果

{% highlight java %}
{% raw %}
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Object instance = clazz.newInstance();
        invokeMethod(clazz, "test", instance);
        invokeMethod(clazz, "printDate", instance);
    }

    public static void invokeMethod(Class<?> clazz, String methodName, Object instance) throws Exception {
        Method m = clazz.getDeclaredMethod(methodName);
        m.invoke(instance);
    }
}
{% endraw %}
{% endhighlight %}

## 总结

本文主要介绍了`MethodVisitor`类的示例，内容总结如下：

- 第一点，要注意`MethodVisitor`类里`visitXxx()`的调用顺序
    - 第一步，调用`visitCode()`方法，调用一次
    - 第二步，调用`visitXxxInsn()`方法，可以调用多次
    - 第三步，调用`visitMaxs()`方法，调用一次
    - 第四步，调用`visitEnd()`方法，调用一次
- 第二点，在使用`COMPUTE_FRAMES`的前提下，我们可以给`visitMaxs()`方法参数传入错误的值，但不能忽略对于`visitMaxs()`方法的调用。
- 第三点，构造方法的名字是`<init>`，静态初始化方法是`<clinit>`。
- 
其中的一个主要目的就是熟悉其中，即：



针对于某一个具体的`visitXxx()`方法，我们可能不太了解它的作用和如何使用它，这个是需要我们在日后的使用过程中一点一点熟悉起来的。

因此，通过这几个示例，我们应重点关注多个`visitXxx()`方法之间的调用顺序，而具体某一个`visitXxx()`方法如何使用，需要我们慢慢积累经验，才能熟练使用。
