---
title:  "FieldVisitor介绍"
sequence: "011"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

## FieldVisitor类

在学习`FieldVisitor`类的时候，可以与`ClassVisitor`类进行对比，这两个类之间有很大的相似性。因为这两个类之间有相似性，所以学习起来就会相对容易一些。

- 第一，两者都是abstract类。
- 第二，定义了哪些字段。
- 第三，定义了哪些构造方法。
- 第四，定义了哪些具体的`visitXxx()`方法。

{% highlight java %}
{% raw %}
public abstract class FieldVisitor {
    protected final int api;
    protected FieldVisitor fv;

    public FieldVisitor(final int api) {
        this(api, null);
    }

    public FieldVisitor(final int api, final FieldVisitor fieldVisitor) {
        this.api = api;
        this.fv = fieldVisitor;
    }

    // ......

    public void visitEnd() {
        if (fv != null) {
            fv.visitEnd();
        }
    }
}
{% endraw %}
{% endhighlight %}

在`FieldVisitor`类内，定义了多个`visitXxx()`方法，这些方法的调用也要遵循一定的调用顺序：

{% highlight text %}
(
 visitAnnotation |
 visitTypeAnnotation |
 visitAttribute
)*
visitEnd
{% endhighlight %}

相对于`ClassVisitor`类而言，`FieldVisitor`类会更简单一些，对于其中定义的`visitXxx()`方法，我们只关注`visitEnd()`方法就可以了。

为什么我们只关注`visitEnd()`方法呢？因为我们刚开始学习ASM，有许多东西不太熟悉，为了减少我们的学习和认知“负担”，那么对于一些非必要的方法，我们就暂时忽略它；将`visitXxx()`方法精简到一个最小的认知集合，那么就只剩下`visitEnd()`方法了。

随着而来的一个问题就是，对于其它的`visitXxx()`方法，我们什么时候学习呢？我们在学习ASM的时候，其实就是学习它的API；换句话说，就是学习使用ASM编写代码的思路。那么，这个思路是什么呢？这个思路，就是告诉我们，在使用ASM API的时候，要先做什么，后做什么。举例来说明，对于`ClassWriter`类而言，我们要先调用`visit()`方法，接着可能会调用`visitField()`方法或`visitMethod()`方法，最后要调用`visitEnd()`方法，我们不能扰乱顺序而随便调用某个方法，因为ASM对于我们调用方法的顺序是有要求的，这就是我们所说的学习使用ASM的思路，去遵循它的各个方法调用的顺序。当我们熟悉ASM的使用思路之后，针对某一个特定的`visitXxx()`方法，可能之前时候，我们没有使用过，我们只要找一、两个代码示例，就能够对这个`visitXxx()`方法熟悉起来，并把这个方法纳入到已经形成的“如何使用ASM”的整体思路当中。

假如说，将来的某一时刻，我们想看一下`visitAnnotation()`方法如何使用，可以编写一个类，让其中某个字段带有注解信息，例如：

{% highlight java %}
{% raw %}
package sample;

public class HelloWorld {
    @Deprecated
    public int intValue;
}
{% endraw %}
{% endhighlight %}

这个时候，我们运行一下`ASMPrint`类，就可以查看到对于`visitAnnotation()`方法的调用。

{% highlight java %}
{% raw %}
FieldVisitor fieldVisitor = classWriter.visitField(ACC_PUBLIC | ACC_DEPRECATED, "intValue", "I", null, null);
AnnotationVisitor annotationVisitor0 = fieldVisitor.visitAnnotation("Ljava/lang/Deprecated;", true);
annotationVisitor0.visitEnd();
{% endraw %}
{% endhighlight %}

## FieldWriter类

`FieldWriter`类是`FieldVisitor`类的一个子类。

需要注意的是，`FieldWriter`类并不带有`public`关键字修饰，因此它的有效访问范围，只局限于它所处的package当中，不能像其它的`public`类一样被外部所使用。

{% highlight java %}
{% raw %}
final class FieldWriter extends FieldVisitor {
    private final int accessFlags;
    private final int nameIndex;
    private final int descriptorIndex;
    private int signatureIndex;
}
{% endraw %}
{% endhighlight %}

另外，在`FieldWriter`类当中，所定义的几个字段，与ClassFile当中的`field_info`也是对应的：

{% highlight text %}
field_info {
    u2             access_flags;
    u2             name_index;
    u2             descriptor_index;
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
{% endhighlight %}

其实，对于`FieldWriter`类，我们不会去直接使用它，也并不需要我们花费太多的时间去了解它。在这里，我们把它介绍出来，很大原因是出于一种“对称性”：

- 在`ClassVisitor`类中，调用`visitField()`方法会返回一个`FieldVisitor`对象
- 在`ClassWriter`类中，调用`visitField()`方法会返回一个`FieldWriter`对象

同样的，`visitMethod()`也有相同的情况：

- 在`ClassVisitor`类中，调用`visitMethod()`方法会返回一个`MethodVisitor`对象
- 在`ClassWriter`类中，调用`visitMethod()`方法会返回一个`MethodWriter`对象

<table>
<thead>
<tr>
    <th>XxxVisitor类（父类）</th>
    <th>XxxWriter类（子类）</th>
</tr>
</thead>
<tbody>
<tr>
    <td><code>ClassVisitor</code>类</td>
    <td><code>ClassWriter</code>类</td>
</tr>
<tr>
    <td><code>FieldVisitor</code>类</td>
    <td><code>FieldWriter</code>类</td>
</tr>
<tr>
    <td><code>MethodVisitor</code>类</td>
    <td><code>MethodWriter</code>类</td>
</tr>
</tbody>
</table>

