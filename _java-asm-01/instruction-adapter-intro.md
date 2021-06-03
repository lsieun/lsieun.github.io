---
title:  "InstructionAdapter介绍"
sequence: "409"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

`InstructionAdapter`类继承自`MethodVisitor`类，它提供了更详细的API用于generate和transform instruction。

在JVM Specification中，一共定义了200多个opcode，在ASM的`MethodVisitor`类当中定义了20多个`visitXxxInsn()`方法。这说明一个问题，也就是在`MethodVisitor`类的每个`visitXxxInsn()`方法都会对应JVM Specification当中多个opcode。

那么，`InstructionAdapter`类起到一个什么样的作用呢？`InstructionAdapter`类继承了`MethodVisitor`类，也就继承了那些`visitXxxInsn()`方法，同时它也添加了80多个新的方法，这些新的方法与opcode更加接近。

从功能上来说，`InstructionAdapter`类和`MethodVisitor`类是一样的，两者没有差异。对于`InstructionAdapter`类来说，它可能更适合于熟悉opcode的人来使用。但是，如果我们已经熟悉`MethodVisitor`类里的`visitXxxIns()`方法，那就完全可以不去使用`InstructionAdapter`类。

接下来，我们来看一个使用`InstructionAdapter`生成类的示例：

{% highlight java %}
{% raw %}
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Type;
import org.objectweb.asm.commons.InstructionAdapter;

import static org.objectweb.asm.Opcodes.*;

public class InstructionAdapterExample01 {
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
            InstructionAdapter ia = new InstructionAdapter(mv1);
            ia.visitCode();
            ia.load(0, InstructionAdapter.OBJECT_TYPE);
            ia.invokespecial("java/lang/Object", "<init>", "()V", false);
            ia.areturn(Type.VOID_TYPE);
            ia.visitMaxs(1, 1);
            ia.visitEnd();
        }

        {
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC, "test", "()V", null, null);
            InstructionAdapter ia = new InstructionAdapter(mv2);
            ia.visitCode();
            ia.getstatic("java/lang/System", "out", "Ljava/io/PrintStream;");
            ia.aconst("Hello World");
            ia.invokevirtual("java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            ia.areturn(Type.VOID_TYPE);
            ia.visitMaxs(2, 1);
            ia.visitEnd();
        }

        cw.visitEnd();

        // (3) 调用toByteArray()方法
        return cw.toByteArray();
    }
}
{% endraw %}
{% endhighlight %}
