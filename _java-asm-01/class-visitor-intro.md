---
title:  "ClassVisitor介绍"
sequence: "007"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

## ClassVisitor类

### class info

第一个要注意的地方，`ClassVisitor`是一个抽象类。
由于`ClassVisitor类`是一个`abstract`类，所以不能直接使用`new`关键字创建`ClassVisitor`对象。

{% highlight java %}
{% raw %}
public abstract class ClassVisitor {
}
{% endraw %}
{% endhighlight %}

同时，由于`ClassVisitor类`是一个`abstract`类，要想使用它，就必须有具体的子类来继承它。比较常见的`ClassVisitor`子类有`ClassWriter`类（Core API）和`ClassNode`类（Tree API）。

{% highlight java %}
{% raw %}
public class ClassWriter extends ClassVisitor {
}
{% endraw %}
{% endhighlight %}

{% highlight java %}
{% raw %}
public class ClassNode extends ClassVisitor {
}
{% endraw %}
{% endhighlight %}

三个类的关系如下：

- `org.objectweb.asm.ClassVisitor`
    - `org.objectweb.asm.ClassWriter`
    - `org.objectweb.asm.tree.ClassNode`

### fields

第二个要注意的地方，就是`ClassVisitor`定义的字段有哪些。

{% highlight java %}
{% raw %}
public abstract class ClassVisitor {
    protected final int api;
    protected ClassVisitor cv;
}
{% endraw %}
{% endhighlight %}

- `api`字段：它是一个`int`类型的数据，指出了当前使用的ASM API版本，其取值有`Opcodes.ASM4`、`Opcodes.ASM5`、`Opcodes.ASM6`、`Opcodes.ASM7`、`Opcodes.ASM8`和`Opcodes.ASM9`。
- `cv`字段：它是一个`ClassVisitor`类型的数据，它的作用是将多个`ClassVisitor`串连起来。

![](/assets/images/java/asm/class-visitor-cv-field.png)
  
随着时间的发展，Java语言也在不断发展，从原来的Java 1.0到Java 5，再到Java 8，再到Java 16。作为每一次新的Java版本的出现，它多多少少都会带有新的特性，例如，Java 5引入泛型、枚举，Java 8引入Lambda等内容。我们可以编写`.java`文件内容时，可以使用这些新的Java语言特性，这些`.java`文件当中的语言特性会被编译到相应的`.class`文件当中。为了能够让`.class`文件支持这些新的语言特性，那么其相应的Java ClassFile结构也需要不断扩展。相应的，ASM作为一个操作字节码的类库，为了跟上时代的变迁，也在不断演进，所以ASM就会有不同版本之间的变化。不同的ASM版本之间，它的变迁并不是一帆风顺的，可能就会存在某种不兼容的情况，就需要给ASM指定一个明确的版本信息。

我们使用的ASM版本是9.0，因此我们在给`api`字段赋值的时候，选择`Opcodes.ASM9`就可以了。

下面，我们来看一下ASM版本与Java版本之间的对应关系：

- 2011, ASM 4.0, full support of Java 7
- 2014, ASM 5.0, full support of Java 8
- 2017, ASM 6.0, Codebase migrated to gitlab
- 2018, ASM 7.0, support of JDK 11
- 2020.03, ASM 8.0, Java 14 support
- 2020.09, ASM 9.0, JDK 16 support

### constructors

第三个要注意的地方，就是`ClassVisitor`定义的构造函数。

{% highlight java %}
{% raw %}
public abstract class ClassVisitor {
    public ClassVisitor(final int api) {
        this(api, null);
    }

    public ClassVisitor(final int api, final ClassVisitor classVisitor) {
        this.api = api;
        this.cv = classVisitor;
    }
}
{% endraw %}
{% endhighlight %}

### methods

第四个要注意的地方，就是`ClassVisitor`定义的方法。

Each method in this class corresponds to the class file structure.

- **Simple sections** are visited with a single method call whose arguments describe their content, and which returns `void`.
- **Sections whose content can be of arbitrary length and complexity** are visited with a initial method call that returns an auxiliary visitor class.
  This is the case of the `visitField` and `visitMethod` methods, which return a `FieldVisitor` and a `MethodVisitor` respectively.

在`ClassVisitor`类当中，定义许多`visitXxx`方法，我们目前只关注这4个方法：`visit()`、`visitField()`、`visitMethod()`和`visitEnd()`。

{% highlight java %}
{% raw %}
public abstract class ClassVisitor {
    public void visit(
        final int version,
        final int access,
        final String name,
        final String signature,
        final String superName,
        final String[] interfaces);
    public FieldVisitor visitField( // 访问字段
        final int access,
        final String name,
        final String descriptor,
        final String signature,
        final Object value);
    public MethodVisitor visitMethod( // 访问方法
        final int access,
        final String name,
        final String descriptor,
        final String signature,
        final String[] exceptions);
    public void visitEnd();
    // ......
}
{% endraw %}
{% endhighlight %}

在`ClassVisitor`的`visit()`方法、`visitField()`方法和`visitMethod()`方法中都带有`signature`参数。这个`signature`参数“泛型”密切相关；换句话说，如果处理的是一个带有泛型信息的类、字段或方法，那么就需要给`signature`参数提供一定的值；如果处理的类、字段或方法不带有“泛型”信息，那么将`signature`参数设置为`null`就可以了。在本次课程当中，我们不去考虑“泛型”相关的内容，所以我们都将`signature`参数设置成`null`值。

如果大家对`signature`参数感兴趣，我们可以使用之前介绍的`ASMPrint`类去打印一下某个泛型类的ASM代码。例如，`java.lang.Comparable`是一个泛型接口，我们就可以使用`ASMPrint`类来打印一下它的ASM代码，从来查看`signature`参数的值是什么。

`ClassVisitor`的`visitXxx`方法与`ClassFile`之间存在对应关系。在`ClassVisitor`中定义的`visitXxx`方法，并不是凭空产生的，这些方法存在的目的就是为了生成一个合法的`.class`文件，而这个`.class`文件要符合ClassFile的结构，所以这些`visitXxx`方法与ClassFile的结构密切相关。

#### visit()方法

{% highlight java %}
{% raw %}
public void visit(
    final int version,
    final int access,
    final String name,
    final String signature,
    final String superName,
    final String[] interfaces);
{% endraw %}
{% endhighlight %}

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

<table>
<thead>
<tr>
    <th>ClassVisitor方法</th>
    <th>参数</th>
    <th>ClassFile</th>
</tr>
</thead>
<tbody>
<tr>
    <td rowspan="6"><code>ClassVisitor.visit()</code></td>
    <td><code>version</code></td>
    <td><code>minor_version</code>和<code>major_version</code></td>
</tr>
<tr>
    <td><code>access</code></td>
    <td><code>access_flags</code></td>
</tr>
<tr>
    <td><code>name</code></td>
    <td><code>this_class</code></td>
</tr>
<tr>
    <td><code>signature</code></td>
    <td><code>attributes</code>的一部分信息</td>
</tr>
<tr>
    <td><code>superName</code></td>
    <td><code>super_class</code></td>
</tr>
<tr>
    <td><code>interfaces</code></td>
    <td><code>interfaces_count</code>和<code>interfaces</code></td>
</tr>
<tr>
    <td><code>ClassVisitor.visitField()</code></td>
    <td></td>
    <td><code>field_info</code></td>
</tr>
<tr>
    <td><code>ClassVisitor.visitMethod()</code></td>
    <td></td>
    <td><code>method_info</code></td>
</tr>
</tbody>
</table>

#### visitField()方法

{% highlight java %}
{% raw %}
public FieldVisitor visitField( // 访问字段
    final int access,
    final String name,
    final String descriptor,
    final String signature,
    final Object value);
{% endraw %}
{% endhighlight %}

{% highlight text %}
field_info {
    u2             access_flags;
    u2             name_index;
    u2             descriptor_index;
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
{% endhighlight %}

<table>
<thead>
<tr>
    <th>ClassVisitor方法</th>
    <th>参数</th>
    <th>field_info</th>
</tr>
</thead>
<tbody>
<tr>
    <td rowspan="5"><code>ClassVisitor.visitField()</code></td>
    <td><code>access</code></td>
    <td><code>access_flags</code></td>
</tr>
<tr>
    <td><code>name</code></td>
    <td><code>name_index</code></td>
</tr>
<tr>
    <td><code>descriptor</code></td>
    <td><code>descriptor_index</code></td>
</tr>
<tr>
    <td><code>signature</code></td>
    <td><code>attributes</code>的一部分信息</td>
</tr>
<tr>
    <td><code>value</code></td>
    <td><code>attributes</code>的一部分信息</td>
</tr>
</tbody>
</table>

#### visitMethod()方法

{% highlight java %}
{% raw %}
public MethodVisitor visitMethod( // 访问方法
    final int access,
    final String name,
    final String descriptor,
    final String signature,
    final String[] exceptions);
{% endraw %}
{% endhighlight %}

{% highlight text %}
method_info {
    u2             access_flags;
    u2             name_index;
    u2             descriptor_index;
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
{% endhighlight %}

<table>
<thead>
<tr>
    <th>ClassVisitor方法</th>
    <th>参数</th>
    <th>method_info</th>
</tr>
</thead>
<tbody>
<tr>
    <td rowspan="5"><code>ClassVisitor.visitMethod()</code></td>
    <td><code>access</code></td>
    <td><code>access_flags</code></td>
</tr>
<tr>
    <td><code>name</code></td>
    <td><code>name_index</code></td>
</tr>
<tr>
    <td><code>descriptor</code></td>
    <td><code>descriptor_index</code></td>
</tr>
<tr>
    <td><code>signature</code></td>
    <td><code>attributes</code>的一部分信息</td>
</tr>
<tr>
    <td><code>exceptions</code></td>
    <td><code>attributes</code>的一部分信息</td>
</tr>
</tbody>
</table>

#### visitEnd()方法

`visitEnd()`方法，它是这些`visitXxx()`方法当中最后一个调用的方法。

为什么`visitEnd()`方法是“最后一个调用的方法”呢？是因为在`ClassVisitor`当中，定义了多个`visitXxx()`方法，这些个`visitXxx()`方法之间要遵循一个先后调用的顺序，而`visitEnd()`方法是最后才去调用的。等到`visitEnd()`方法调用之后，就表示说再也不去调用其它的`visitXxx()`方法了，所有的“工作”已经做完了，到了要结束的时候了。

{% highlight java %}
{% raw %}
/*
 * Visits the end of the class.
 * This method, which is the last one to be called,
 * is used to inform the visitor that all the fields and methods of the class have been visited.
 */
public void visitEnd() {
    if (cv != null) {
        cv.visitEnd();
    }
}
{% endraw %}
{% endhighlight %}
   
## ClassVisitor类遵循访问者模式

在ASM当中，使用到了Visitor Pattern（访问者模式）。Visitor Pattern的一个主要作用就是将“算法”和“数据”进行分离。

> the visitor design pattern is a way of separating an algorithm from an object structure on which it operates.

在`ClassVisitor`类当中，我们可以看到定义了许多的`visitXxx()`方法。另外，在`FieldVisitor`类和`MethodVisitor`类当中，也定义了许多的`visitXxx()`方法。那么，这些`visitXxx()`方法，就是Visitor Pattern当中“算法”的部分（algorithm）。

相对而言，Visitor Pattern当中“数据”的部分（an object structure），它在ASM的源码当中表现的比较模糊。因为在ASM源码当中，它并没有将Visitor Pattern当中“数据”的部分，去具体化的呈现为某一个具体的类。但是，这个“数据”的部分到底是什么呢？这个“数据”的部分其实就是一个class file，就是一个符合ClassFile的数据。我们这里所说的class file，是一个泛化的概念、抽象的概念，它可能表现为一个具体的`.class`文件，也可能是一个符合ClassFile的字节数组（`byte[]`）。

这几段内容的一个目的，就是想说明这样一个事情：因为ASM遵循了Visitor Pattern的设计模式，所以`ClassVisitor`当中定义了那么的`visitXxx()`方法，也是为什么会有这么多`visitXxx()`方法的原因。

## ClassVisitor类的方法调用顺序

在`ClassVisitor`类当中，定义了多个`visitXxx()`方法。这些`visitXxx()`方法，遵循一定的调用顺序。这个调用顺序，是参考自`ClassVisitor`类的API文档。

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

其中，涉及到一些符号，它们的含义如下：

- `[]`: 表示最多调用一次，可以不调用，但最多调用一次。
- `()`和`|`: 表示在多个方法之间，可以选择任意一个，并且多个方法之间不分前后顺序
- `*`: 表示方法可以调用0次或多次，

因为在本次课程当中，我们只关注`ClassVisitor`类当中的`visit()`方法、`visitField()`方法、`visitMethod()`方法和`visitEnd()`方法这4个方法，所以我们可以将上面的调用顺序简化如下：

{% highlight text %}
visit
(
 visitField |
 visitMethod
)* 
visitEnd
{% endhighlight %}

也就是说，先调用`visit()`方法，接着调用`visitField()`方法或`visitMethod()`方法，最后调用`visitEnd()`方法。

## 总结

本篇文章的内容总结如下：

- 第一，介绍了`ClassVisitor`类的成员有哪些。我们去了解这些类成员的目的，是为了让大家去熟悉`ClassVisitor`这个类。
- 第二，从总体设计上来说，在ASM当中，许多类都采用了Visitor Pattern，因此我们会遇到许多的`visitXxx()`方法。
- 第三，在`ClassVisitor`类当中，定义了许多`visitXxx()`方法，这些方法的调用要遵循一定的顺序。

