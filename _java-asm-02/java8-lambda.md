---
title:  "Java 8 Lambda"
sequence: "046"
---

[上级目录]({% link _posts/2021-04-22-java-asm-season-01.md %})

## 示例：lambda

### 预期目标

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
