---
title:  "Label代码示例"
sequence: "016"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

## 示例一：if语句

预期结果：

{% highlight java %}
{% raw %}
public class HelloWorld {
    public void test(int value) {
        if (value == 0) {
            System.out.println("value is 0");
        }
        else {
            System.out.println("value is not 0");
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
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC, "test", "(I)V", null, null);
            Label elseLabel = new Label();
            Label returnLabel = new Label();

            // 第1段
            mv2.visitCode();
            mv2.visitVarInsn(ILOAD, 1);
            mv2.visitJumpInsn(IFNE, elseLabel);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("value is 0");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            mv2.visitJumpInsn(GOTO, returnLabel);

            // 第2段
            mv2.visitLabel(elseLabel);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("value is not 0");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);

            // 第3段
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

        Method method = clazz.getDeclaredMethod("test", int.class);
        method.invoke(obj, 0);
        method.invoke(obj, 1);
    }
}
{% endraw %}
{% endhighlight %}

## 示例二：switch语句

预期目标：

{% highlight java %}
{% raw %}
public class HelloWorld {
    public void test(int val) {
        switch (val) {
            case 1:
                System.out.println("val = 1");
                break;
            case 2:
                System.out.println("val = 2");
                break;
            case 3:
                System.out.println("val = 3");
                break;
            case 4:
                System.out.println("val = 4");
                break;
            default:
                System.out.println("val is unknown");
        }
    }
}
{% endraw %}
{% endhighlight %}

编码实现：

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
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC, "test", "(I)V", null, null);
            Label caseLabel1 = new Label();
            Label caseLabel2 = new Label();
            Label caseLabel3 = new Label();
            Label caseLabel4 = new Label();
            Label defaultLabel = new Label();
            Label returnLabel = new Label();

            // 第1段
            mv2.visitCode();
            mv2.visitVarInsn(ILOAD, 1);
            mv2.visitTableSwitchInsn(1, 4, defaultLabel, new Label[]{caseLabel1, caseLabel2, caseLabel3, caseLabel4});

            // 第2段
            mv2.visitLabel(caseLabel1);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("val = 1");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            mv2.visitJumpInsn(GOTO, returnLabel);

            // 第3段
            mv2.visitLabel(caseLabel2);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("val = 2");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            mv2.visitJumpInsn(GOTO, returnLabel);

            // 第4段
            mv2.visitLabel(caseLabel3);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("val = 3");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            mv2.visitJumpInsn(GOTO, returnLabel);

            // 第5段
            mv2.visitLabel(caseLabel4);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("val = 4");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            mv2.visitJumpInsn(GOTO, returnLabel);

            // 第6段
            mv2.visitLabel(defaultLabel);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("val is unknown");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);

            // 第7段
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

        Method method = clazz.getDeclaredMethod("test", int.class);
        for (int i = 1; i < 6; i++) {
            method.invoke(obj, i);
        }
    }
}
{% endraw %}
{% endhighlight %}

## 示例三：for语句

预期结果：

{% highlight java %}
{% raw %}
public class HelloWorld {
    public void test() {
        for (int i = 0; i < 10; i++) {
            System.out.println(i);
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
            MethodVisitor methodVisitor = cw.visitMethod(ACC_PUBLIC, "test", "()V", null, null);
            Label conditionLabel = new Label();
            Label returnLabel = new Label();

            // 第1段
            methodVisitor.visitCode();
            methodVisitor.visitInsn(ICONST_0);
            methodVisitor.visitVarInsn(ISTORE, 1);

            // 第2段
            methodVisitor.visitLabel(conditionLabel);
            methodVisitor.visitVarInsn(ILOAD, 1);
            methodVisitor.visitIntInsn(BIPUSH, 10);
            methodVisitor.visitJumpInsn(IF_ICMPGE, returnLabel);
            methodVisitor.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            methodVisitor.visitVarInsn(ILOAD, 1);
            methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(I)V", false);
            methodVisitor.visitIincInsn(1, 1);
            methodVisitor.visitJumpInsn(GOTO, conditionLabel);

            // 第3段
            methodVisitor.visitLabel(returnLabel);
            methodVisitor.visitInsn(RETURN);
            methodVisitor.visitMaxs(0, 0);
            methodVisitor.visitEnd();
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

        Method method = clazz.getDeclaredMethod("test");
        method.invoke(obj);
    }
}
{% endraw %}
{% endhighlight %}

## 示例四：try-catch语句

预期结果：

{% highlight java %}
{% raw %}
public class HelloWorld {
    public void test() {
        try {
            System.out.println("Before Sleep");
            Thread.sleep(1000);
            System.out.println("After Sleep");
        } catch (InterruptedException e) {
            e.printStackTrace();
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
            Label startLabel = new Label();
            Label endLabel = new Label();
            Label handlerLabel = new Label();
            Label returnLabel = new Label();

            // 第1段
            mv2.visitCode();

            // 第2段
            mv2.visitLabel(startLabel);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("Before Sleep -- ASM");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            mv2.visitLdcInsn(new Long(1000L));
            mv2.visitMethodInsn(INVOKESTATIC, "java/lang/Thread", "sleep", "(J)V", false);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("After Sleep -- ASM");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);

            // 第3段
            mv2.visitLabel(endLabel);
            mv2.visitJumpInsn(GOTO, returnLabel);

            // 第4段
            mv2.visitLabel(handlerLabel);
            mv2.visitVarInsn(ASTORE, 1);
            mv2.visitVarInsn(ALOAD, 1);
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/lang/InterruptedException", "printStackTrace", "()V", false);

            // 第5段
            mv2.visitLabel(returnLabel);
            mv2.visitInsn(RETURN);

            // 第6段
            mv2.visitTryCatchBlock(startLabel, endLabel, handlerLabel, "java/lang/InterruptedException");
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

        Method method = clazz.getDeclaredMethod("test");
        method.invoke(obj);
    }
}
{% endraw %}
{% endhighlight %}

第一个问题，`visitTryCatchBlock()`方法为什么可以在后边的位置调用呢？

这与`Code`属性的结构有关系：

{% highlight text %}
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
{% endhighlight %}

{% highlight text %}
attribute_name_index='000F' (#15)
attribute_length='00000080' (128)
max_stack='0002' (2)
max_locals='0002' (2)
code_length='0000001F' (31)
code: B200021203B60004140005B80007B200021208B60004A700084C2BB6000AB1
exception_table_length='0001' (1)
exception_table[0] {
    start_pc='0000' (0)
    end_pc='0016' (22)
    handler_pc='0019' (25)
    catch_type='0009' (#9)
}
attributes_count='0003' (3)
    LineNumberTable: 00100000001E00070000000600080007000E00080016000B00190009001A000A001E000C
    LocalVariableTable: 0011000000160002001A00040015001600010000001F001200130000
    StackMapTable: 00170000000700025907001804
{% endhighlight %}

{% highlight text %}
=== === ===  === === ===  === === ===
Method test:()V
=== === ===  === === ===  === === ===
max_stack = 2
max_locals = 2
code_length = 31
code = B200021203B60004140005B80007B200021208B60004A700084C2BB6000AB1
Exception Table:
from    to  target  type
   0    22      25  java/lang/InterruptedException
=== === ===  === === ===  === === ===
0000: getstatic       #2   // B20002     || java/lang/System.out:Ljava/io/PrintStream;
0003: ldc             #3   // 1203       || Before Sleep
0005: invokevirtual   #4   // B60004     || java/io/PrintStream.println:(Ljava/lang/String;)V
0008: ldc2_w          #5   // 140005     || 1000
0011: invokestatic    #7   // B80007     || java/lang/Thread.sleep:(J)V
0014: getstatic       #2   // B20002     || java/lang/System.out:Ljava/io/PrintStream;
0017: ldc             #8   // 1208       || After Sleep
0019: invokevirtual   #4   // B60004     || java/io/PrintStream.println:(Ljava/lang/String;)V
0022: goto            8    // A70008
0025: astore_1             // 4C
0026: aload_1              // 2B
0027: invokevirtual   #10  // B6000A     || java/lang/InterruptedException.printStackTrace:()V
0030: return               // B1
=== === ===  === === ===  === === ===
{% endhighlight %}
