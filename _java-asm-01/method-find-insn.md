---
title:  "查找已有的方法（查找－方法调用）"
sequence: "311"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

## 对现有方法进行分析

{:refdef: style="text-align: center;"}
![What ASM Can Do](/assets/images/java/asm/what-asm-can-do.png)
{: refdef}

在前面的示例当中，我们都是对已有的`.class`文件进行转换，也就是由一个已有的`.class`文件经过Class Transformation操作生成一个新的`.class`文件。其实，我们也可以做一些分析操作（analysis），比如上图所示，包括find potential bugs、detect unused code和reverse engineer code等操作。但是，这些分析操作（analysis）是比较难的，它需要我们编程经验的积累和对问题模式的识别，需要编码处理各种不同情况，所以不太容易实现。

当然，Class Analysis，并不只是包含这些复杂的分析操作，也包含一些简单的分析操作，例如，当前方法里调用了哪些其它的方法、当前的方法被哪些别的方法所调用。那么，这些简单的分析操作，我们就可以通过Core API进行实现。再一步的说，分析之后的结果，也可以用于Class Transformation操作。比如说，先分析一下当前方法里调用了哪些方法，得到一个方法列表；在这个方法列表，是否有你想替换的方法呢；如果有，那就对该方法进行替换就可以了。

另外，Class Analysis，虽然从“名字”上来说，我们是对“类”来进行分析，但是，我们在分析的时候，很多情况下是针对“方法”里的代码进行分析。比如说，find potential bugs是在方法里进行查找，不太可能是从字段层面查找bug。所以，我们这里的标题是“对现有方法进行分析”。

在Class Transformation当中，我们需要用到`ClassReader`、`ClassVisitor`和`ClassWriter`类；但是，在Class Analysis中，我们只需要用到`ClassReader`和`ClassVisitor`类，而不需要用到`ClassWriter`类。

{:refdef: style="text-align: center;"}
![ASM Core Classes](/assets/images/java/asm/asm-core-classes.png)
{: refdef}

## 示例：调用了哪些方法

### 预期目标

我们想要实现的预期目标是，打印出`test()`方法当中调用了哪些方法。

{% highlight java %}
{% raw %}
public class HelloWorld {
    public void test(int a, int b) {
        int c = Math.addExact(a, b);
        String line = String.format("%d + %d = %d", a, b, c);
        System.out.println(line);
    }
}
{% endraw %}
{% endhighlight %}

上面的`test()`方法对应的Instruction如下：

{% highlight text %}
  public test(II)V
    ILOAD 1
    ILOAD 2
    INVOKESTATIC java/lang/Math.addExact (II)I
    ISTORE 3
    LDC "%d + %d = %d"
    ICONST_3
    ANEWARRAY java/lang/Object
    DUP
    ICONST_0
    ILOAD 1
    INVOKESTATIC java/lang/Integer.valueOf (I)Ljava/lang/Integer;
    AASTORE
    DUP
    ICONST_1
    ILOAD 2
    INVOKESTATIC java/lang/Integer.valueOf (I)Ljava/lang/Integer;
    AASTORE
    DUP
    ICONST_2
    ILOAD 3
    INVOKESTATIC java/lang/Integer.valueOf (I)Ljava/lang/Integer;
    AASTORE
    INVOKESTATIC java/lang/String.format (Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;
    ASTORE 4
    GETSTATIC java/lang/System.out : Ljava/io/PrintStream;
    ALOAD 4
    INVOKEVIRTUAL java/io/PrintStream.println (Ljava/lang/String;)V
    RETURN
    MAXSTACK = 5
    MAXLOCALS = 5
{% endhighlight %}

### 编码实现

{% highlight java %}
{% raw %}
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.util.Printer;

import java.util.ArrayList;
import java.util.List;

public class MethodFindInvokeVisitor extends ClassVisitor {
    private final String methodName;
    private final String methodDesc;

    public MethodFindInvokeVisitor(int api, ClassVisitor classVisitor, String methodName, String methodDesc) {
        super(api, classVisitor);
        this.methodName = methodName;
        this.methodDesc = methodDesc;
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        if (methodName.equals(name) && methodDesc.equals(descriptor)) {
            return new MethodFindInvokeAdapter(api, null);
        }
        return null;
    }

    private static class MethodFindInvokeAdapter extends MethodVisitor {
        private final List<String> list = new ArrayList<>();

        public MethodFindInvokeAdapter(int api, MethodVisitor methodVisitor) {
            super(api, methodVisitor);
        }

        @Override
        public void visitMethodInsn(int opcode, String owner, String name, String descriptor, boolean isInterface) {
            // 首先，处理自己的代码逻辑
            String info = String.format("%s %s.%s%s", Printer.OPCODES[opcode], owner, name, descriptor);
            if (!list.contains(info)) {
                list.add(info);
            }

            // 其次，调用父类的方法实现
            super.visitMethodInsn(opcode, owner, name, descriptor, isInterface);
        }

        @Override
        public void visitEnd() {
            // 首先，处理自己的代码逻辑
            for (String item : list) {
                System.out.println(item);
            }

            // 其次，调用父类的方法实现
            super.visitEnd();
        }
    }
}
{% endraw %}
{% endhighlight %}

### 进行分析

{% highlight java %}
{% raw %}
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.Opcodes;

public class HelloWorldAnalysisCore {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes = FileUtils.readBytes(filepath);

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes);

        //（2）分析ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new MethodFindInvokeVisitor(api, null, "test", "(II)V");

        //（3）结合ClassReader和ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);
    }
}
{% endraw %}
{% endhighlight %}

输出结果：

{% highlight text %}
INVOKESTATIC java/lang/Math.addExact(II)I
INVOKESTATIC java/lang/Integer.valueOf(I)Ljava/lang/Integer;
INVOKESTATIC java/lang/String.format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;
INVOKEVIRTUAL java/io/PrintStream.println(Ljava/lang/String;)V
{% endhighlight %}

## 示例：被哪些方法调用了

在IDEA当中，有一个Find Usages功能：在类名、字段名、或方法名上，右键之后，选择Find Usages，就可以查看该项内容在哪些地方被使用了。

{:refdef: style="text-align: center;"}
![Find Usages](/assets/images/java/asm/find-usages.png)
{: refdef}

查找结果如下：

{:refdef: style="text-align: center;"}
![Find Usages Result](/assets/images/java/asm/find-usgaes-result.png)
{: refdef}

这样一个功能，我们也可以通过Core API来进行实现，它具体的实现思路是这样的：

- 首先，读取一个`.class`文件，找到其中包含的所有方法，得到一个方法列表。
- 其次，对方法列表进行一个过滤操作，例如，不考虑带有`abstract`和`native`标识的方法。
- 接着，针对每一个单独的方法，遍历该方法包含的所有Instruction
    - 如果在遍历过程当中，找到了对于`test()`方法的调用，那么就把这个方法记录下来
    - 如果在遍历完之后，也没有找到对于`test()`方法的调用，那么跳过当前方法，从下一个方法查找

### 预期目标

我们的预期目标是，找出是哪些方法对`test()`方法进行了调用。

{% highlight java %}
{% raw %}
public class HelloWorld {
    public int add(int a, int b) {
        int c = a + b;
        test(a, b, c);
        return c;
    }

    public int sub(int a, int b) {
        int c = a - b;
        test(a, b, c);
        return c;
    }

    public int mul(int a, int b) {
        return a * b;
    }

    public int div(int a, int b) {
        return a / b;
    }

    public void test(int a, int b, int c) {
        String line = String.format("a = %d, b = %d, c = %d", a, b, c);
        System.out.println(line);
    }
}
{% endraw %}
{% endhighlight %}

### 编码实现

{% highlight java %}
{% raw %}
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;

import java.util.ArrayList;
import java.util.List;

import static org.objectweb.asm.Opcodes.ACC_ABSTRACT;
import static org.objectweb.asm.Opcodes.ACC_NATIVE;

public class MethodFindRefVisitor extends ClassVisitor {
    private final String methodOwner;
    private final String methodName;
    private final String methodDesc;

    private String currentOwner;

    public MethodFindRefVisitor(int api, ClassVisitor classVisitor, String methodOwner, String methodName, String methodDesc) {
        super(api, classVisitor);
        this.methodOwner = methodOwner;
        this.methodName = methodName;
        this.methodDesc = methodDesc;
    }

    @Override
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        super.visit(version, access, name, signature, superName, interfaces);
        this.currentOwner = name;
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        boolean isAbstractMethod = (access & ACC_ABSTRACT) != 0;
        boolean isNativeMethod = (access & ACC_NATIVE) != 0;
        if (!isAbstractMethod && !isNativeMethod) {
            return new MethodFindRefAdaptor(api, null, name, descriptor);
        }
        return null;
    }

    private class MethodFindRefAdaptor extends MethodVisitor {
        private final List<String> list = new ArrayList<>();
        private final String currentMethodName;
        private final String currentMethodDesc;

        public MethodFindRefAdaptor(int api, MethodVisitor methodVisitor, String currentMethodName, String currentMethodDesc) {
            super(api, methodVisitor);
            this.currentMethodName = currentMethodName;
            this.currentMethodDesc = currentMethodDesc;
        }

        @Override
        public void visitMethodInsn(int opcode, String owner, String name, String descriptor, boolean isInterface) {
            // 首先，处理自己的代码逻辑
            if (methodOwner.equals(owner) && methodName.equals(name) && methodDesc.equals(descriptor)) {
                String info = String.format("%s.%s%s", currentOwner, currentMethodName, currentMethodDesc);
                if (!list.contains(info)) {
                    list.add(info);
                }
            }

            // 其次，调用父类的方法实现
            super.visitMethodInsn(opcode, owner, name, descriptor, isInterface);
        }

        @Override
        public void visitEnd() {
            // 首先，处理自己的代码逻辑
            for (String item : list) {
                System.out.println(item);
            }

            // 其次，调用父类的方法实现
            super.visitEnd();
        }
    }
}
{% endraw %}
{% endhighlight %}

### 进行分析

{% highlight java %}
{% raw %}
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.Opcodes;

public class HelloWorldAnalysisCore {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes = FileUtils.readBytes(filepath);

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes);

        //（2）分析ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new MethodFindRefVisitor(api, null, "sample/HelloWorld", "test", "(III)V");

        //（3）结合ClassReader和ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);
    }
}
{% endraw %}
{% endhighlight %}

输出结果：

{% highlight text %}
sample/HelloWorld.add(II)I
sample/HelloWorld.sub(II)I
{% endhighlight %}

## 总结

本文主要对“调用了哪些方法”进行了介绍，是属于比较简单的分析`.class`文件的操作，内容总结如下：

- 第一点，Class Analysis，从难易程度上来说，可以有复杂的分析，也可以有简单的分析。本文示例，就是对方法进行简单的分析。复杂的分析，则需要长期的知识经验积累和对问题模式的识别。
- 第二点，Class Analysis，从类的结构上来说，大多数的分析是对“方法代码”进行分析。在类里面，有当前类名、父类、实现的接口、字段和方法，其中，方法是进行分析的主要对象。
- 第三点，Class Analysis，在编写代码过程中，我们只需要用到`ClassReader`和`ClassVisitor`类，而不需要用到`ClassWriter`类。

当然，除了方法之外，我们也可以对别的内容进行分析。例如，对于一个“接口”来说，有哪些类实现了该接口；对于一个“类”来说，它有哪些父类和子类。
