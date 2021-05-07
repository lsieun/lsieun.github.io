---
title:  "Java ClassFile快速参考"
sequence: "008"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

## Java ClassFile Format

对于一个具体的`.class`而言，它是遵循ClassFile结构的。

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

其中，

- `u1`: 表示占用1个字节
- `u2`: 表示占用2个字节
- `u4`: 表示占用4个字节
- `u8`: 表示占用8个字节

而`cp_info`、`field_info`、`method_info`和`attribute_info`表示较为复杂的结构，但它们也是由`u1`、`u2`、`u4`和`u8`组成的。

相应的，在`.class`文件当中，定义的字段，也要遵循`field_info`的结构。

{% highlight text %}
field_info {
    u2             access_flags;
    u2             name_index;
    u2             descriptor_index;
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
{% endhighlight %}

同样的，在`.class`文件当中，定义的方法，也要遵循`method_info`的结构。

{% highlight text %}
method_info {
    u2             access_flags;
    u2             name_index;
    u2             descriptor_index;
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
{% endhighlight %}

## 项目源码

这里使用到的项目源码位于[https://gitee.com/lsieun/java8-classfile-tutorial](https://gitee.com/lsieun/java8-classfile-tutorial)，我们可以使用git命令下载：

{% highlight bash %}
git clone https://gitee.com/lsieun/java8-classfile-tutorial
{% endhighlight %}

## 示例演示

假如，我们有一个`sample.HelloWorld`类，它的内容如下：

{% highlight java %}
{% raw %}
package sample;

public class HelloWorld implements Cloneable {
    private static final int intValue = 10;

    public void test() {
        int a = 1;
        int b = 2;
        int c = a + b;
    }

    public static void main(String[] args) {
        System.out.println("HelloWorld");
    }
}
{% endraw %}
{% endhighlight %}

针对`sample.HelloWorld`类，我们可以

- 第一，运行`run.A_File_Hex`类，查看`sample.HelloWorld`类当中包含的数据，以十六进制进行呈现。
- 第二，运行`run.B_ClassFile_Raw`类，能够对`sample.HelloWorld`类当中包含的数据进行拆分。这样做的目的，是为了与ClassFile的结构进行对照，进行参考。
- 第三，运行`run.K_Code_Locals`类，能够对`sample.HelloWorld`类当中某个方法里面包含的opcode进行查看。

## 总结

本篇文章的主要目的，希望大家能够对这一点有更直观的理解：一个具体的`.class`文件，它是要遵循ClassFile结构的。

当然，我们这里只是简略地进行了说明，让大家对于`.class`文件和ClassFile结构有初步的认识。如果大家想了解更多的关于ClassFile的知识，可以去参考[The Java Virtual Machine Specification, Java SE 8 Edition](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)。

另外，我针对ClassFile的结构单独录制了一个课程《[Java 8 ClassFile](https://edu.51cto.com/course/25908.html)》，有兴趣的同学可以进行查看。


