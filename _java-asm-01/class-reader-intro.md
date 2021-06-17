---
title:  "ClassReader介绍"
sequence: "301"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

## ClassReader类

`ClassReader`类和`ClassWriter`类，从功能角度来说，是完全相反的两个类，一个用于读取`.class`文件，另一个用于生成`.class`文件。

### class info

与`ClassWriter`类不同的是，`ClassReader`类并没有继承自`ClassVisitor`类。

`ClassReader`类的定义如下：

{% highlight java %}
{% raw %}
public class ClassReader {
}
{% endraw %}
{% endhighlight %}

`ClassWriter`类的定义如下：

{% highlight java %}
{% raw %}
public class ClassWriter extends ClassVisitor {
}
{% endraw %}
{% endhighlight %}

### fields

在`ClassReader`类当中，定义了许多的字段，但是，我们选取出其中的3个字段进行介绍，即`classFileBuffer`字段、`cpInfoOffsets`字段和`header`字段。

{% highlight java %}
{% raw %}
public class ClassReader {
    //第1组，真实的数据部分
    final byte[] classFileBuffer;

    //第2组，数据的索引信息
    private final int[] cpInfoOffsets;
    public final int header;
}
{% endraw %}
{% endhighlight %}

为什么选择这3个字段呢？因为这3个字段，从整体上来说，代表了`ClassReader`类代码处理的整体思路，而其它字段则是关注于一些实现的细节。

- 第1组，`classFileBuffer`字段：它里面包含的信息，就是从`.class`文件中读取出来的字节码数据。
- 第2组，`cpInfoOffsets`字段和`header`字段：它们分别标识了`classFileBuffer`中数据里包含的常量池（constant pool）和访问标识（access flag）的位置信息。

我们拿到`classFileBuffer`字段后，一个主要目的就是对它的内容进行修改，来实现一个新的功能。这样一个对已有的类进行修改的大体思路是这样的：

{% highlight text %}
.class文件 --> ClassReader --> byte[] --> 经过各种转换 --> ClassWriter --> byte[] --> .class文件
{% endhighlight %}

首先，从一个`.class`文件（例如`HelloWorld.class`）开始，它可能存储于磁盘的某个位置；接着，使用`ClassReader`类将这个`.class`文件的内容读取出来，其实这些内容（`byte[]`）就是`ClassReader`对象中的`classFileBuffer`字段的内容；再接着，为了增加某些功能，就对这些原始内容（`byte[]`）进行转换，后续我们会讲如何进行转换；等各种转换都完成之后，再交给`ClassWriter`类处理，调用它的`toByteArray()`方法，从而得到新的内容（`byte[]`）；最后，将新生成的内容（`byte[]`）存储到一个具体的`.class`文件中，那么这个新的`.class`文件就具备了一些新的功能。

### constructors

在`ClassReader`类当中定义了多个构造方法。但是，从本质上来说，这多个构造方法本质上是同一个构造方法的不同表现形式。其中，最常用的构造方法有两个：

- 第一个是`ClassReader cr = new ClassReader("sample.HelloWorld");`
- 第二个是`ClassReader cr = new ClassReader(bytes);`

{% highlight java %}
{% raw %}
public class ClassReader {

    public ClassReader(final String className) throws IOException { // 第一个构造方法（常用）
        this(
            readStream(ClassLoader.getSystemResourceAsStream(className.replace('.', '/') + ".class"), true)
        );
    }

    public ClassReader(final byte[] classFile) { // 第二个构造方法（常用）
        this(classFile, 0, classFile.length);
    }

    public ClassReader(
        final byte[] classFileBuffer,
        final int classFileOffset,
        final int classFileLength) {
        this(classFileBuffer, classFileOffset, true);
    }

    ClassReader( // 这是最根本、最本质的构造方法
        final byte[] classFileBuffer,
        final int classFileOffset,
        final boolean checkClassVersion) {
        // ......
    }

    private static byte[] readStream(final InputStream inputStream, final boolean close) throws IOException {
        if (inputStream == null) {
            throw new IOException("Class not found");
        }
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            byte[] data = new byte[INPUT_STREAM_DATA_CHUNK_SIZE];
            int bytesRead;
            while ((bytesRead = inputStream.read(data, 0, data.length)) != -1) {
                outputStream.write(data, 0, bytesRead);
            }
            outputStream.flush();
            return outputStream.toByteArray();
        } finally {
            if (close) {
                inputStream.close();
            }
        }
    }
}
{% endraw %}
{% endhighlight %}

所有构造方法，本质上都执行下面的逻辑：

{% highlight java %}
{% raw %}
public class ClassReader {
    ClassReader(final byte[] classFileBuffer, final int classFileOffset, final boolean checkClassVersion) {
        this.classFileBuffer = classFileBuffer;

        // Check the class' major_version.
        // This field is after the magic and minor_version fields, which use 4 and 2 bytes respectively.
        if (checkClassVersion && readShort(classFileOffset + 6) > Opcodes.V16) {
            throw new IllegalArgumentException("Unsupported class file major version " + readShort(classFileOffset + 6));
        }

        // Create the constant pool arrays.
        // The constant_pool_count field is after the magic, minor_version and major_version fields,
        // which use 4, 2 and 2 bytes respectively.
        int constantPoolCount = readUnsignedShort(classFileOffset + 8);
        cpInfoOffsets = new int[constantPoolCount];
        constantUtf8Values = new String[constantPoolCount];

        // Compute the offset of each constant pool entry,
        // as well as a conservative estimate of the maximum length of the constant pool strings.
        // The first constant pool entry is after the magic, minor_version, major_version and constant_pool_count fields,
        // which use 4, 2, 2 and 2 bytes respectively.
        int currentCpInfoIndex = 1;
        int currentCpInfoOffset = classFileOffset + 10;
        int currentMaxStringLength = 0;
        boolean hasBootstrapMethods = false;
        boolean hasConstantDynamic = false;

        // The offset of the other entries depend on the total size of all the previous entries.
        while (currentCpInfoIndex < constantPoolCount) {
            cpInfoOffsets[currentCpInfoIndex++] = currentCpInfoOffset + 1;
            int cpInfoSize;
            switch (classFileBuffer[currentCpInfoOffset]) {
                case Symbol.CONSTANT_FIELDREF_TAG:
                case Symbol.CONSTANT_METHODREF_TAG:
                case Symbol.CONSTANT_INTERFACE_METHODREF_TAG:
                case Symbol.CONSTANT_INTEGER_TAG:
                case Symbol.CONSTANT_FLOAT_TAG:
                case Symbol.CONSTANT_NAME_AND_TYPE_TAG:
                    cpInfoSize = 5;
                    break;
                case Symbol.CONSTANT_DYNAMIC_TAG:
                    cpInfoSize = 5;
                    hasBootstrapMethods = true;
                    hasConstantDynamic = true;
                    break;
                case Symbol.CONSTANT_INVOKE_DYNAMIC_TAG:
                    cpInfoSize = 5;
                    hasBootstrapMethods = true;
                    break;
                case Symbol.CONSTANT_LONG_TAG:
                case Symbol.CONSTANT_DOUBLE_TAG:
                    cpInfoSize = 9;
                    currentCpInfoIndex++;
                    break;
                case Symbol.CONSTANT_UTF8_TAG:
                    cpInfoSize = 3 + readUnsignedShort(currentCpInfoOffset + 1);
                    if (cpInfoSize > currentMaxStringLength) {
                        // The size in bytes of this CONSTANT_Utf8 structure provides a conservative estimate
                        // of the length in characters of the corresponding string, and is much cheaper to
                        // compute than this exact length.
                        currentMaxStringLength = cpInfoSize;
                    }
                    break;
                case Symbol.CONSTANT_METHOD_HANDLE_TAG:
                    cpInfoSize = 4;
                    break;
                case Symbol.CONSTANT_CLASS_TAG:
                case Symbol.CONSTANT_STRING_TAG:
                case Symbol.CONSTANT_METHOD_TYPE_TAG:
                case Symbol.CONSTANT_PACKAGE_TAG:
                case Symbol.CONSTANT_MODULE_TAG:
                    cpInfoSize = 3;
                    break;
                default:
                    throw new IllegalArgumentException();
            }
            currentCpInfoOffset += cpInfoSize;
        }

        maxStringLength = currentMaxStringLength;
        // The Classfile's access_flags field is just after the last constant pool entry.
        header = currentCpInfoOffset;

        // Allocate the cache of ConstantDynamic values, if there is at least one.
        constantDynamicValues = hasConstantDynamic ? new ConstantDynamic[constantPoolCount] : null;

        // Read the BootstrapMethods attribute, if any (only get the offset of each method).
        bootstrapMethodOffsets = hasBootstrapMethods ? readBootstrapMethodsAttribute(currentMaxStringLength) : null;
    }
}
{% endraw %}
{% endhighlight %}

上面的代码，要结合ClassFile的结构进行理解：

{% highlight text %}
ClassFile {
    u4             magic;
    u2             minor_version;
    u2             major_version;
    u2             constant_pool_count;
    cp_info        constant_pool[constant_pool_count-1];
    u2             access_flags;
    u2             this_class;
    u2             super_class;
    u2             interfaces_count;
    u2             interfaces[interfaces_count];
    u2             fields_count;
    field_info     fields[fields_count];
    u2             methods_count;
    method_info    methods[methods_count];
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
{% endhighlight %}

### methods

#### getXxx()方法

这里介绍的几个`getXxx()`方法，都是在`header`字段的基础上获得的：

{% highlight java %}
{% raw %}
public class ClassReader {
    public int getAccess() {
        return readUnsignedShort(header);
    }

    public String getClassName() {
        // this_class is just after the access_flags field (using 2 bytes).
        return readClass(header + 2, new char[maxStringLength]);
    }

    public String getSuperName() {
        // super_class is after the access_flags and this_class fields (2 bytes each).
        return readClass(header + 4, new char[maxStringLength]);
    }

    public String[] getInterfaces() {
        // interfaces_count is after the access_flags, this_class and super_class fields (2 bytes each).
        int currentOffset = header + 6;
        int interfacesCount = readUnsignedShort(currentOffset);
        String[] interfaces = new String[interfacesCount];
        if (interfacesCount > 0) {
            char[] charBuffer = new char[maxStringLength];
            for (int i = 0; i < interfacesCount; ++i) {
                currentOffset += 2;
                interfaces[i] = readClass(currentOffset, charBuffer);
            }
        }
        return interfaces;
    }
}
{% endraw %}
{% endhighlight %}

同样，上面的几个`getXxx()`方法也需要参考ClassFile结构来理解：

{% highlight text %}
ClassFile {
    u4             magic;
    u2             minor_version;
    u2             major_version;
    u2             constant_pool_count;
    cp_info        constant_pool[constant_pool_count-1];
    u2             access_flags;
    u2             this_class;
    u2             super_class;
    u2             interfaces_count;
    u2             interfaces[interfaces_count];
    u2             fields_count;
    field_info     fields[fields_count];
    u2             methods_count;
    method_info    methods[methods_count];
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
{% endhighlight %}

假如，有如下一个类：

{% highlight java %}
{% raw %}
import java.io.Serializable;

public class HelloWorld extends Exception implements Serializable, Cloneable {

}
{% endraw %}
{% endhighlight %}

我们可以使用`ClassReader`类中的`getXxx()`方法来获取相应的信息：

{% highlight java %}
{% raw %}
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;

import java.util.Arrays;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes = FileUtils.readBytes(filepath);

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes);

        // (2) 调用getXxx()方法
        int access = cr.getAccess();
        System.out.println("access: " + access);

        String className = cr.getClassName();
        System.out.println("className: " + className);

        String superName = cr.getSuperName();
        System.out.println("superName: " + superName);

        String[] interfaces = cr.getInterfaces();
        System.out.println("interfaces: " + Arrays.toString(interfaces));
    }
}
{% endraw %}
{% endhighlight %}

输出结果：

{% highlight text %}
access: 33
className: sample/HelloWorld
superName: java/lang/Exception
interfaces: [java/io/Serializable, java/lang/Cloneable]
{% endhighlight %}

#### accept()方法

在`ClassReader`类当中，有一个`accept()`方法，这个方法接收一个`ClassVisitor`类型的参数，因此`accept()`方法是将`ClassReader`和`ClassVisitor`进行连接的“桥梁”。`accept()`方法的代码逻辑就是按照一定的顺序来调用`ClassVisitor`当中的`visitXxx()`方法。

{% highlight java %}
{% raw %}
public class ClassReader {
    // A flag to skip the Code attributes.
    public static final int SKIP_CODE = 1;

    // A flag to skip the SourceFile, SourceDebugExtension,
    // LocalVariableTable, LocalVariableTypeTable,
    // LineNumberTable and MethodParameters attributes.
    public static final int SKIP_DEBUG = 2;

    // A flag to skip the StackMap and StackMapTable attributes.
    public static final int SKIP_FRAMES = 4;

    // A flag to expand the stack map frames.
    public static final int EXPAND_FRAMES = 8;


    public void accept(final ClassVisitor classVisitor, final int parsingOptions) {
        accept(classVisitor, new Attribute[0], parsingOptions);
    }

    public void accept(
        final ClassVisitor classVisitor,
        final Attribute[] attributePrototypes,
        final int parsingOptions) {
        Context context = new Context();
        context.attributePrototypes = attributePrototypes;
        context.parsingOptions = parsingOptions;
        context.charBuffer = new char[maxStringLength];

        // Read the access_flags, this_class, super_class, interface_count and interfaces fields.
        char[] charBuffer = context.charBuffer;
        int currentOffset = header;
        int accessFlags = readUnsignedShort(currentOffset);
        String thisClass = readClass(currentOffset + 2, charBuffer);
        String superClass = readClass(currentOffset + 4, charBuffer);
        String[] interfaces = new String[readUnsignedShort(currentOffset + 6)];
        currentOffset += 8;
        for (int i = 0; i < interfaces.length; ++i) {
          interfaces[i] = readClass(currentOffset, charBuffer);
          currentOffset += 2;
        }

        // ......

        // Visit the class declaration. The minor_version and major_version fields start 6 bytes before
        // the first constant pool entry, which itself starts at cpInfoOffsets[1] - 1 (by definition).
        classVisitor.visit(readInt(cpInfoOffsets[1] - 7), accessFlags, thisClass, signature, superClass, interfaces);

        // ......

        // Visit the fields and methods.
        int fieldsCount = readUnsignedShort(currentOffset);
        currentOffset += 2;
        while (fieldsCount-- > 0) {
          currentOffset = readField(classVisitor, context, currentOffset);
        }
        int methodsCount = readUnsignedShort(currentOffset);
        currentOffset += 2;
        while (methodsCount-- > 0) {
          currentOffset = readMethod(classVisitor, context, currentOffset);
        }

        // Visit the end of the class.
        classVisitor.visitEnd();
    }

}
{% endraw %}
{% endhighlight %}

另外，我们也可以回顾一下`ClassVisitor`类中`visitXxx()`方法的调用顺序：

{% highlight text %}
visit
[visitSource][visitModule][visitNestHost][visitPermittedSubclass][visitOuterClass]
(
 visitAnnotation |
 visitTypeAnnotation |
 visitAttribute
)*
(
 visitNestMember |
 visitInnerClass |
 visitRecordComponent |
 visitField |
 visitMethod
)* 
visitEnd
{% endhighlight %}

## 如何使用ClassReader类

The ASM core API for **generating** and **transforming** compiled Java classes is based on the `ClassVisitor` abstract class.

{:refdef: style="text-align: center;"}
![](/assets/images/java/asm/what-asm-can-do.png)
{: refdef}

在现阶段，我们接触了`ClassVisitor`、`ClassWriter`和`ClassReader`类，因此可以介绍Class Transformation的操作。

{% highlight java %}
{% raw %}
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Opcodes;

public class HelloWorldTransformCore {
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
        ClassVisitor cv = new ClassVisitor(api, cw) { /**/ };

        //（4）结合ClassReader和ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
{% endraw %}
{% endhighlight %}

代码的整体处理流程是如下这样的：

{% highlight text %}
.class --> ClassReader --> ClassVisitor1 ... --> ClassVisitorN --> ClassWriter --> .class文件
{% endhighlight %}

我们可以将整体的处理流程想像成一条河流，那么

- 第一步，构建`ClassReader`。生成的`ClassReader`对象，它是这条“河流”的“源头”。
- 第二步，构建`ClassWriter`。生成的`ClassWriter`对象，它是这条“河流”的“归处”，它可以想像成是“百川东到海”中的“大海”。
- 第三步，串连`ClassVisitor`。生成的`ClassVisitor`对象，它是这条“河流”上的重要节点，可以想像成一个“水库”；可以有多个`ClassVisitor`对象，也就是在这条“河流”上存在多个“水库”，这些“水库”可以对“河水”进行一些处理，最终会这些“水库”的水会流向“大海”；也就是说多个`ClassVisitor`对象最终会连接到`ClassWriter`对象上。
- 第四步，结合`ClassReader`和`ClassVisitor`。在`ClassReader`类上，有一个`accept()`方法，它接收一个`ClassVisitor`类型的对象；换句话说，就是将“河流”的“源头”和后续的“水库”连接起来。
- 第五步，生成`byte[]`。到这一步，就是所有的“河水”都流入`ClassWriter`这个“大海”当中，这个时候我们调用`ClassWriter.toByteArray()`方法，就能够得到`byte[]`内容。

{:refdef: style="text-align: center;"}
![](/assets/images/java/asm/asm-core-classes.png)
{: refdef}

## parsingOptions参数

在`ClassReader`类当中，`accept()`方法接收一个`int`类型的`parsingOptions`参数。

{% highlight java %}
{% raw %}
public void accept(final ClassVisitor classVisitor, final int parsingOptions)
{% endraw %}
{% endhighlight %}

`parsingOptions`参数可以选取的值有以下5个：

- `0`
- `ClassReader.SKIP_CODE`
- `ClassReader.SKIP_DEBUG`
- `ClassReader.SKIP_FRAMES`
- `ClassReader.EXPAND_FRAMES`

推荐使用：

- 在调用`ClassReader.accept()`方法时，其中的`parsingOptions`参数，推荐使用`ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES`。
- 在创建`ClassWriter`对象时，其中的`flags`参数，推荐使用`ClassWriter.COMPUTE_FRAMES`。

示例代码如下：

{% highlight java %}
{% raw %}
ClassReader cr = new ClassReader(bytes);
int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
cr.accept(cv, parsingOptions);

ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
{% endraw %}
{% endhighlight %}

为什么我们推荐使用`ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES`呢？因为使用这样的一个值，可以生成最少的ASM代码，但是又能实现完整的功能。

- `0`：会生成所有的ASM代码，包括调试信息、frame信息和代码信息。
- `ClassReader.SKIP_CODE`：会忽略代码信息，例如，会忽略对于`MethodVisitor.visitXxxInsn()`方法的调用。
- `ClassReader.SKIP_DEBUG`：会忽略调试信息，例如，会忽略对于`MethodVisitor.visitParameter()`、`MethodVisitor.visitLineNumber()`和`MethodVisitor.visitLocalVariable()`等方法的调用。
- `ClassReader.SKIP_FRAMES`：会忽略frame信息，例如，会忽略对于`MethodVisitor.visitFrame()`方法的调用。
- `ClassReader.EXPAND_FRAMES`：会对frame信息进行扩展，例如，会对`MethodVisitor.visitFrame()`方法的参数有影响。

对于这些参数的使用，我们可以在`ASMPrint`类的基础上进行实验。

我们使用`ClassReader.SKIP_DEBUG`的时候，就不会生成调试信息。因为这些调试信息主要是记录某一条instruction在代码当中的行数，以及变量的名字等信息；如果没有这些调试信息，也不会影响程序的正常运行，也就是说功能不受影响，因此省略这些信息，就会让ASM代码尽可能的简洁。

我们使用`ClassReader.SKIP_FRAMES`的时候，就会忽略frame的信息。为什么要忽略这些frame信息呢？因为frame计算的细节会很繁琐，需要处理的情况也有很多，总的来说，就是比较麻烦。我们解决这个麻烦的方式，就是让ASM帮助我们来计算frame的情况，也就是在创建`ClassWriter`对象的时候使用`ClassWriter.COMPUTE_FRAMES`选项。

在刚开始学习ASM的时候，对于`parsingOptions`参数，我们推荐使用`ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES`的组合值。但是，以后，随着大家对ASM的知识越来越熟悉，或者随着功能需求的变化，大家可以尝试着使用其它的选项值。

## 总结

本文主要对`ClassReader`类进行了介绍，内容总结如下：

- 第一点，了解`ClassReader`类的成员都有哪些。
- 第二点，如何使用`ClassReader`类，来进行Class Transformation的操作。
- 第三点，在`ClassReader`类当中，对于`accept()`方法的`parsingOptions`参数，我们推荐使用`ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES`。
