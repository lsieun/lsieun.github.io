---
title:  "FieldVisitor代码示例"
sequence: "012"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

The ASM core API for **generating** and **transforming** compiled Java classes is based on the `ClassVisitor` abstract class.

![](/assets/images/java/asm/what-asm-can-do.png)

在当前阶段，我们只能进行Class Generation的操作。

## 示例

预期结果：

{% highlight java %}
{% raw %}
public interface HelloWorld {
    int intValue = 100;
    String strValue = "ABC";
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
        cw.visit(V1_8, ACC_PUBLIC + ACC_ABSTRACT + ACC_INTERFACE, "sample/HelloWorld",
                null, "java/lang/Object", null);

        {
            FieldVisitor fv1 = cw.visitField(ACC_PUBLIC + ACC_FINAL + ACC_STATIC, "intValue",
                    "I", null, Integer.valueOf(100));
            fv1.visitEnd();
        }
        {
            FieldVisitor fv2 = cw.visitField(ACC_PUBLIC + ACC_FINAL + ACC_STATIC, "strValue",
                    "Ljava/lang/String;", null, "ABC");
            fv2.visitEnd();
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
import java.lang.reflect.Field;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Field[] declaredFields = clazz.getDeclaredFields();
        if (declaredFields.length > 0) {
            System.out.println("fields:");
            for (Field f : declaredFields) {
                Object value = f.get(null);
                System.out.println("    " + f.getName() + ": " + value);
            }
        }
    }
}
{% endraw %}
{% endhighlight %}

## 总结

这里主要演示了一个代码示例，需要着重注意的地方有两点：

- 第一点，在调用`visitField()`方法时，它的输入参数中，描述符（descriptor）的格式应该怎么写。
- 第二点，在调用`visitField()`方法后，它的返回结果是一个`FieldVisitor`类型的对象，要记得调用该对象的`visitEnd()`方法。
