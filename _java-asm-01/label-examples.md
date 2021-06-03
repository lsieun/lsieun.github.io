---
title:  "Label代码示例"
sequence: "210"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

## 示例一：if语句

### 预期目标

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

### 验证结果

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

### 预期目标

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

### 验证结果

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

### 预期目标

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

### 验证结果

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

### 预期目标

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

### 验证结果

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

因为instruction的内容（对应于`visitXxxInsn()`方法的调用）存储于`Code`结构当中的`code[]`内，而try-catch的内容（对应于`visitTryCatchBlock()`方法的调用），存储在`Code`结构当中的`exception_table[]`内，所以`visitTryCatchBlock()`方法的调用时机，可以早一点，也可以晚一点，只要整体上遵循`MethodVisitor`类对就于`visitXxx()`方法调用的顺序要求就可以了。

对于`test()`方法，在`.class`文件存储的`Code`结构如下：

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

虽然上面的内容符合`Code`结构，但是对于其中`code`的展示并不直观，我们可以转换成如下的表示形式：

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

第二个问题，刚才的示例当中只有try...catch，而没有`finally`，那出现`finally`会怎么样处理呢？

{% highlight java %}
{% raw %}
public class HelloWorld {
    public void test() {
        try {
            System.out.println("try clause");
        }
        catch (Exception ex) {
            System.out.println("catch clause");
        }
        finally {
            System.out.println("finally Clause");
        }
    }
}
{% endraw %}
{% endhighlight %}

实际上，当一个Java文件编译成Class文件过程中，`finally`代码块里的语句，会被“复制”到`try`代码块和`catch`代码块中，因此在bytecode中不存在`finally`对应的opcode，在ASM代码中也不存在`visitXxx()`方法来生成`finally`内容。

{% highlight text %}
=== === ===  === === ===  === === ===
Method test:()V
=== === ===  === === ===  === === ===
max_stack = 2
max_locals = 3
code_length = 51
code = B200021203B60004B200021205B60004A700224CB200021207B60004B200021205B60004A7000E4DB200021205B600042CBFB1
Exception Table:
from    to  target  type
   0     8      19  java/lang/Exception
   0     8      39  All Exceptions(catch_type = 0)
  19    28      39  All Exceptions(catch_type = 0)
=== === ===  === === ===  === === ===
0000: getstatic       #2   // B20002     || java/lang/System.out:Ljava/io/PrintStream;
0003: ldc             #3   // 1203       || try clause
0005: invokevirtual   #4   // B60004     || java/io/PrintStream.println:(Ljava/lang/String;)V
0008: getstatic       #2   // B20002     || java/lang/System.out:Ljava/io/PrintStream;
0011: ldc             #5   // 1205       || finally Clause
0013: invokevirtual   #4   // B60004     || java/io/PrintStream.println:(Ljava/lang/String;)V
0016: goto            34   // A70022
0019: astore_1             // 4C
0020: getstatic       #2   // B20002     || java/lang/System.out:Ljava/io/PrintStream;
0023: ldc             #7   // 1207       || catch clause
0025: invokevirtual   #4   // B60004     || java/io/PrintStream.println:(Ljava/lang/String;)V
0028: getstatic       #2   // B20002     || java/lang/System.out:Ljava/io/PrintStream;
0031: ldc             #5   // 1205       || finally Clause
0033: invokevirtual   #4   // B60004     || java/io/PrintStream.println:(Ljava/lang/String;)V
0036: goto            14   // A7000E
0039: astore_2             // 4D
0040: getstatic       #2   // B20002     || java/lang/System.out:Ljava/io/PrintStream;
0043: ldc             #5   // 1205       || finally Clause
0045: invokevirtual   #4   // B60004     || java/io/PrintStream.println:(Ljava/lang/String;)V
0048: aload_2              // 2C
0049: athrow               // BF
0050: return               // B1
=== === ===  === === ===  === === ===
{% endhighlight %}

## 总结

本文主要对`Label`类的示例进行介绍，内容总结如下：

- 第一点，`Label`类的主要作用是实现程序代码的跳转，例如，if语句、switch语句、for语句和try-catch语句。
- 第二点，在生成try-catch语句时，`visitTryCatchBlock()`方法的调用时机，可以早一点，也可以晚一点，只要整体上遵循`MethodVisitor`类对就于`visitXxx()`方法调用的顺序就可以了。
