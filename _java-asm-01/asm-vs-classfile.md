---
title:  "ASM VS. ClassFile"
sequence: "002"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

{:toc}

## Class File Format

我们都知道，在`.class`文件中，存储的是bytecode数据。

![From Java to Class](/assets/images/java/javac-from-dot-java-to-dot-class.jpeg)

但是，这些bytecode数据并不是杂乱无章的，而是遵循某一定的数据结构。
这个数据结构就是由[Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)中定义的
[The class File Format](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html)，如下所示。

{% highlight java %}
{% raw %}
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
{% endraw %}
{% endhighlight %}

![From Java to Class](/assets/images/java/asm/class-file-asm-tree.png)

Java ClassFile相当于“树根”部分，ObjectWeb ASM相当于“树干”部分，而各种应用场景属于“树枝”或“树叶”部分。

## 其它字节码类库

大家知道，ASM是用来操作Java字节码（bytecode）的类库。但是，ASM并不是唯一的，还有许多其它可以修改Java字节码（bytecode）的类库。

在下面，我们列举了几个比较常见的Java ByteCode Libraries：

- [Apache Commons BCEL](https://commons.apache.org/proper/commons-bcel/)：其中BCEL为Byte Code Engineering Library首字母的缩写。
- [Byte Buddy](https://bytebuddy.net/)：在ASM基础上实现的一个类库。
- [Javassist](http://www.javassist.org/)：Javassist表示**Java** programming **assist**ant
- [ObjectWeb ASM](https://asm.ow2.io/)：本课程的研究对象。

## ASM的特点

问题：与其它的操作Java字节码（bytecode）的类库相比，ASM有哪些与众不同的地方呢？  
 回答：在实现相同的功能前提下，使用ASM，运行速度更快，占用的内存空间更小。

The ASM was designed to be as **fast** and as **small** as possible.

- Being as **fast** as possible is important in order not to slow down too much the applications that use ASM at runtime, for dynamic class generation or transformation.
- And being as **small** as possible is important in order to be used in memory constrained environments, and to avoid bloating the size of small applications or libraries using ASM.

简而言之，ASM的特点就是fast和small。
