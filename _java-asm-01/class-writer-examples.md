---
title:  "ClassWriter代码示例"
sequence: "010"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

The ASM core API for **generating** and **transforming** compiled Java classes is based on the `ClassVisitor` abstract class.

![](/assets/images/java/asm/what-asm-can-do.png)

在当前阶段，我们只能进行Class Generation的操作。

## 示例一：接口

预期结果：

{% highlight java %}
{% raw %}
public interface HelloWorld {
}
{% endraw %}
{% endhighlight %}

实现代码：

{% highlight java %}
{% raw %}
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassWriter;

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
        cw.visit(
                V1_8,                                        // version
                ACC_PUBLIC + ACC_ABSTRACT + ACC_INTERFACE,   // access
                "sample/HelloWorld",                         // name
                null,                                        // signature
                "java/lang/Object",                          // superName
                null                                         // interfaces
        );

        cw.visitEnd();

        // (3) 调用toByteArray()方法
        return cw.toByteArray();
    }
}
{% endraw %}
{% endhighlight %}

在上述代码中，我们调用了`visit()`方法、`visitEnd()`方法和`toByteArray()`方法。

由于`sample.HelloWorld`这个接口中，并没有定义任何的字段和方法，因此，在上述代码中没有调用`visitField()`方法和`visitMethod()`方法。

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

在这里，我们重点介绍一下`visit(version, access, name, signature, superName, interfaces)`方法的各个参数：

- `version`: 表示当前类的版本信息。在上述示例代码中，其取值为`Opcodes.V1_8`，表示使用Java 8版本。
- `access`: 表示当前类的访问标识（access flag）信息。如果想进一步了解，可以参考[Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)的Chapter 4. The class File Format部分
- `name`: 表示当前类的名字，它采用的格式是Internal Name的形式。
- `signature`: 表示当前类的泛型信息。因为在这个接口当中不包含任何的泛型信息，因此它的值为`null`。
- `superName`: 表示当前类的父类信息，它采用的格式是Internal Name的形式。
- `interfaces`: 表示当前类实现了哪些接口信息。

同时，我们也要介绍一下Internal Name的概念：在`.java`文件中，我们使用Java语言来编写代码，使用类名的形式是**Fully Qualified Class Name**，例如`java.lang.String`；将`.java`文件编译之后，就会生成`.class`文件；在`.class`文件中，类名的形式会发生变化，称之为**Internal Name**，例如`java/lang/String`。因此，将**Fully Qualified Class Name**转换成**Internal Name**的方式就是，将`.`字符转换成`/`字符。

<table>
<thead>
<tr>
    <th></th>
    <th>Java Language</th>
    <th>Java ClassFile</th>
</tr>
</thead>
<tbody>
<tr>
    <td>文件格式</td>
    <td><code>.java</code></td>
    <td><code>.class</code></td>
</tr>
<tr>
    <td>类名</td>
    <td>Fully Qualified Class Name</td>
    <td>Internal Name</td>
</tr>
<tr>
    <td>类名示例</td>
    <td><code>java.lang.String</code></td>
    <td><code>java/lang/String</code></td>
</tr>
</tbody>
</table>

在[Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)文档中，是这样描述的：

> For historical reasons, **the syntax of binary names** that appear in **class file structures** differs from the syntax of binary names documented in Java Language Specification.
> In this internal form, the ASCII periods (`.`) that normally separate the identifiers which make up the binary name are replaced by ASCII forward slashes (`/`).

> For example, the normal binary name of class `Thread` is `java.lang.Thread`. In the **internal form** used in descriptors in the **class file format**, a reference to the name of class `Thread` is implemented using a `CONSTANT_Utf8_info` structure representing the string `java/lang/Thread`.

## 示例二：接口+字段+方法

预期结果：

{% highlight java %}
{% raw %}
public interface HelloWorld extends Cloneable {
    int LESS = -1;
    int EQUAL = 0;
    int GREATER = 1;
    int compareTo(Object o);
}
{% endraw %}
{% endhighlight %}

实现代码：

{% highlight java %}
{% raw %}
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassWriter;

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

    public static byte[] dump () throws Exception {
        // (1) 创建ClassWriter对象
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (2) 调用visitXxx()方法
        cw.visit(V1_8, ACC_PUBLIC + ACC_ABSTRACT + ACC_INTERFACE, "sample/HelloWorld",
                null, "java/lang/Object", new String[]{"java/lang/Cloneable"});
        cw.visitField(ACC_PUBLIC + ACC_FINAL + ACC_STATIC, "LESS", "I",
                null, Integer.valueOf(-1)).visitEnd();
        cw.visitField(ACC_PUBLIC + ACC_FINAL + ACC_STATIC, "EQUAL", "I",
                null, Integer.valueOf(0)).visitEnd();
        cw.visitField(ACC_PUBLIC + ACC_FINAL + ACC_STATIC, "GREATER", "I",
                null, Integer.valueOf(1)).visitEnd();
        cw.visitMethod(ACC_PUBLIC + ACC_ABSTRACT, "compareTo", "(Ljava/lang/Object;)I",
                null, null).visitEnd();
        cw.visitEnd();

        // (3) 调用toByteArray()方法
        return cw.toByteArray();
    }
}
{% endraw %}
{% endhighlight %}

在上述代码中，我们调用了`visit()`方法、`visitField()`方法、`visitMethod()`方法、`visitEnd()`方法和`toByteArray()`方法。

验证结果：

{% highlight java %}
{% raw %}
import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Field[] declaredFields = clazz.getDeclaredFields();
        if (declaredFields.length > 0) {
            System.out.println("fields:");
            for (Field f : declaredFields) {
                System.out.println("    " + f.getName());
            }
        }

        Method[] declaredMethods = clazz.getDeclaredMethods();
        if (declaredMethods.length > 0) {
            System.out.println("methods:");
            for (Method m : declaredMethods) {
                System.out.println("    " + m.getName());
            }
        }
    }
}
{% endraw %}
{% endhighlight %}

输出结果：

{% highlight text %}
fields:
    LESS
    EQUAL
    GREATER
methods:
    compareTo
{% endhighlight %}

在这里，我们重点说一下`visitField()`方法和`visitMethod()`方法的各个参数：

- `visitField(access, name, descriptor, signature, value)`
- `visitMethod(access, name, descriptor, signature, exceptions)`

这两个方法的前4个参数是相同的，不同的地方只在于第5个参数。

- `access`参数：表示当前字段或方法带有的访问标识（access flag）信息，例如`ACC_PUBLIC`、`ACC_STATIC`和`ACC_FINAL`等。
- `name`参数：表示当前字段或方法的名字。
- `descriptor`参数：表示当前字段或方法的描述符。这些描述符，与我们平时使用的Java类型是有区别的。
- `signature`参数：表示当前字段或方法是否带有泛型信息。换句话说，如果不带有泛型信息，提供一个`null`就可以了；如果带有泛型信息，就需要给它提供某一个具体的值。
- `value`参数：是`visitField()`方法的第5个参数。这个参数的取值，与当前字段是否为常量有关系。如果当前字段是一个常量，就需要给`value`参数提供某一个具体的值；如果当前字段不是常量，那么使用`null`就可以了。
- `exceptions`参数：是`visitMethod()`方法的第5个参数。这个参数的取值，与当前方法声明中是否具有`throws XxxException`相关。

我们可以使用`ASMPrint`类来查看下面的`sample.HelloWorld`类的ASM代码，从而观察`value`参数和`exceptions`参数的取值：

{% highlight java %}
{% raw %}
package sample;

import java.io.FileNotFoundException;
import java.io.IOException;

public class HelloWorld {
    // 这是一个常量字段，使用static、final关键字修饰
    public static final int constant_field = 10;
    // 这是一个非常量字段
    public int non_constant_field;

    public void test() throws FileNotFoundException, IOException {
        // do nothing
    }
}
{% endraw %}
{% endhighlight %}

对于上面的代码，

- `constant_field`字段：对应于`visitField(ACC_PUBLIC | ACC_FINAL | ACC_STATIC, "constant_field", "I", null, new Integer(10))`
- `non_constant_field`字段：对应于`visitField(ACC_PUBLIC, "non_constant_field", "I", null, null)`
- `test()`方法：对应于`visitMethod(ACC_PUBLIC, "test", "()V", null, new String[] { "java/io/FileNotFoundException", "java/io/IOException" })`

在ClassFile当中，描述符（descriptor）是对“类型”的简单化描述。为什么要进行“简单化”描述呢？是为了节省占用的磁盘空间，比如说`int`类型，如果使用“int”表示，就使用3个字母，占用3个byte空间；如果使用“I”来表示，就只使用1个字母，占用1byte空间，相对而言节省了2个byte的空间。

- 对于字段（field）来说，描述符就是对字段本身的类型进行简单化描述。
- 对于方法（method）来说，描述符就是对方法的输入参数的类型和输出参数的类型进行简单化描述。

<table>
<thead>
<tr>
    <th>Java类型</th>
    <th>ClassFile描述符</th>
</tr>
</thead>
<tbody>
<tr>
    <td><code>boolean</code></td>
    <td><code>Z</code>（Z表示Zero，零表示`false`，非零表示`true`）</td>
</tr>
<tr>
    <td><code>byte</code></td>
    <td><code>B</code></td>
</tr>
<tr>
    <td><code>char</code></td>
    <td><code>C</code></td>
</tr>
<tr>
    <td><code>double</code></td>
    <td><code>D</code></td>
</tr>
<tr>
    <td><code>float</code></td>
    <td><code>F</code></td>
</tr>
<tr>
    <td><code>int</code></td>
    <td><code>I</code></td>
</tr>
<tr>
    <td><code>long</code></td>
    <td><code>J</code></td>
</tr>
<tr>
    <td><code>short</code></td>
    <td><code>S</code></td>
</tr>
<tr>
    <td><code>void</code></td>
    <td><code>V</code></td>
</tr>
<tr>
    <td><code>non-array reference</code></td>
    <td><code>L&lt;InternalName&gt;;</code></td>
</tr>
<tr>
    <td><code>array reference</code></td>
    <td><code>[</code></td>
</tr>
</tbody>
</table>

对字段描述符的举例：

- `boolean flag`: `Z`
- `byte byteValue`: `B`
- `int intValue`: `I`
- `float floatValue`: `F`
- `double doubleValue`: `D`
- `String strValue`: `Ljava/lang/String;`
- `Object objValue`: `Ljava/lang/Object;`
- `byte[] bytes`: `[B`
- `String[] array`: `[Ljava/lang/String;`
- `Object[][] twoDimArray`: `[[Ljava/lang/Object;`

对方法描述符的举例：

- `int add(int a, int b)`: `(II)I`
- `void test(int a, int b)`: `(II)V`
- `boolean compare(Object obj)`: `(Ljava/lang/Object;)Z`
- `void main(String[] args)`: `([Ljava/lang/String;)V`

## 示例三：类

预期结果：

{% highlight java %}
{% raw %}
public class HelloWorld {
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

对于一个类（Class）来说，如果没有提供任何构造方法，Java编译器会自动生成一个默认构造方法。在所有的`.class`文件中，构造方法的名字是`<init>`。

另外，如果在`.class`文件中包含静态代码块，那么就会有一个`<clinit>`方法。

{% highlight java %}
{% raw %}
package sample;

public class HelloWorld {
    static {
        System.out.println("static code block");
    }
}
{% endraw %}
{% endhighlight %}

上面的静态代码码，对应于`visitMethod(ACC_STATIC, "<clinit>", "()V", null, null)`的调用。

## 总结

本篇文章的目的是为了介绍几个关于`ClassWriter`类的代码示例，希望大家能够对`ClassWriter`类熟悉起来。

同时，我们对于`visit()`方法、`visitField()`方法和`visitMethod()`方法的参数进行了介绍。但是，我们并没有特别介绍`visitEnd()`方法和`toByteArray()`方法，并不表示这两个方法不重要，只是因为这两个方法不接收任何参数。

在示例当中，我们也涉及到了Internal Name和Descriptor（描述符）这两个概念，需要我们在使用时候加以注意，因为它们与我们在使用Java语言编写代码时是不一样的。

另外，`visitField()`方法会返回一个`FieldVisitor`对象，而`visitMethod()`方法会返回一个`MethodVisitor`对象；在后续的内容当中，我们会分别介绍`FieldVisitor`类和`MethodVisitor`类。
