---
title:  "ASM是什么？"
sequence: "001"
---

ASM is an open source java library for manipulating java byte code.

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

## ASM简单介绍

ASM是一个操作Java字节码的类库。在[ASM官网](https://asm.ow2.io/)上，对它进行了如下描述：

> ASM is an all purpose Java **bytecode** manipulation and analysis framework.  
> It can be used to modify existing classes or to dynamically generate classes, directly in binary form.

我们都知道，一个`.java`文件经过Java编译器（`javac`）编译之后会生成一个`.class`文件。
在`.class`文件中，存储的是字节码（bytecode）数据，如下图所示。

![From Java to Class](/assets/images/java/javac-from-dot-java-to-dot-class.jpeg)

需要明确的一点是

- ASM所操作的对象是字节码（bytecode）数据；更具体地来说，ASM所操作对象是`.class`文件，而不是针对`.java`文件。

## ASM具体可以做什么？

> ASM is an all purpose Java bytecode **manipulation** and **analysis** framework.
> It can be used to modify existing classes or to dynamically generate classes, directly in binary form.

- 父类：修改成一个新的父类
- 接口：添加一个新的接口、删除已有的接口
- 字段：添加一个新的字段、删除已有的字段
- 方法：添加一个新的方法、删除已有的方法、修改已有的方法
- ……（省略）

{% highlight java %}
{% raw %}
public class HelloWorld extends Object implements Cloneable {
    public int intValue;
    public String strValue;

    public int add(int a, int b) {
        return a + b;
    }

    public int sub(int a, int b) {
        return a - b;
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
{% endraw %}
{% endhighlight %}

## ASM能够做什么？

接下来，就是ASM是如何描述的。

The goal of the ASM library is to **generate**, **transform** and **analyze** compiled Java classes,
represented as byte arrays (as they are stored on disk and loaded in the Java Virtual Machine).

![What ASM Can Do](/assets/images/java/asm/what-asm-can-do.png)

- **Program analysis**, which can range from a simple syntactic parsing to a full semantic analysis, can be used to find potential bugs in applications, to detect unused code, to reverse engineer code, etc.
- **Program generation** is used in compilers. This include traditional compilers, but also stub or skeleton compilers used for distributed programming, Just in Time compilers, etc.
- **Program transformation** can be used to optimize or obfuscate programs, to insert debugging or performance monitoring code into applications, for aspect oriented programming, etc.

## 在哪些地方用到了ASM呢？

- Spring框架当中
- Java 8 Lambda当中

### Java 8 Lambda

- LambdaMetafactory.metafactory()
  - InnerClassLambdaMetafactory.buildCallSite()
    - InnerClassLambdaMetafactory.spinInnerClass()

## 为什么要学习ASM？

## 项目源代码

本课程的源代码位于[https://gitee.com/lsieun/learn-java-asm](https://gitee.com/lsieun/learn-java-asm)，可以使用以下命令进行下载：

```text
git clone https://gitee.com/lsieun/learn-java-asm
```

## 参考资料

- [ASM](https://asm.ow2.io/)，这是ASM的官方网站。
- [GitLab: asm source code](https://gitlab.ow2.org/asm/asm)，这是ASM的源代码仓库。
- [Oracle: The Java Virtual Machine Specification, Java SE 8 Edition](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)，这是Oracle提供的JVM文档。

