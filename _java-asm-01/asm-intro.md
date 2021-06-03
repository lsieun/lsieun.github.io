---
title:  "ASM介绍"
sequence: "101"
---

ASM is an open source java library for manipulating java byte code.

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

## 了解ASM

### ASM是什么？

简单来说，**[ASM](https://asm.ow2.io/)是一个操作Java字节码的类库**。为了能够更好的理解ASM是什么，我们需要来搞清楚两个问题。

首先，我们先来搞清楚第一个问题：**ASM的操作对象是谁呢？**

我们都知道，一个`.java`文件经过Java编译器（`javac`）编译之后会生成一个`.class`文件。
在`.class`文件中，存储的是字节码（bytecode）数据，如下图所示。

{:refdef: style="text-align: center;"}
![From Java to Class](/assets/images/java/javac-from-dot-java-to-dot-class.jpeg)
{: refdef}

ASM所操作的对象是字节码（bytecode）数据。结合上图来说，ASM所操作对象的具体表现形式是`.class`文件，而不是针对`.java`文件。

---

接着，我们需要来搞清楚第二个问题：**ASM是如何处理字节码（bytecode）数据的呢？**

在[Wikipedia](https://en.wikipedia.org/wiki/ObjectWeb_ASM)上，对ASM进行了如下描述：

<div class="w3-panel w3-light-grey w3-border w3-round">
<p>
ASM provides a simple API for decomposing(将一个整体拆分成多个部分), modifying(修改某一个部分的信息), and recomposing(将多个部分重新组织成一个整体) binary Java classes (i.e. bytecode).
</p>
</div>

ASM处理字节码（bytecode）数据的思路是这样的：第一步，将`.class`文件拆分成多个小的部分；第二步，对某一个小的部分的信息进行修改；第三步，将多个小的部分重新组织成一个新的`.class`文件。

### ASM的过去（作者和名字）

在这里，我们主要说明三个问题：

- ASM是什么时候开始出现的？
- ASM的作者是谁？
- ASM的名字代表什么意思？

The ASM project was originally conceived and developed by **Eric Bruneton**.

在**2002年**的时候，Eric Bruneton、Romain Lenglet和Thierry Coupaye发表了一篇文章，名为《[ASM: a code manipulation tool to implement adaptable systems](/assets/pdf/asm-eng.pdf)》。在这篇文章当中，他们提出了ASM的设计思路。在当时的情况下，已经存在其它的操作字节码的类库，例如BCEL、SERP和JOIE。他们分析了当时其它类库所面临的问题，也提出了相应的解决方法，于是ASM就诞生了。与其它类库相比，ASM的特点就是占用空间小、运行速度快。

一般来说，大写字母的组合，可能是多个单词的缩写形式，例如，JVM表示“Java Virtual Machine”。但是，ASM并不是多个单词的首字母缩写形式。

The ASM name does not mean anything: it is just a reference to the `__asm__` keyword in C,
which allows some functions to be implemented in assembly language.

### ASM的现在（机构和版本）

在这里，我们也是要说明三个问题：

- ASM属于哪一个机构？
- ASM的Logo是什么样的？
- ASM版本的发展与Java版本的发展，两者之间对应关系是怎样的？

The ASM library is a project of the [OW2 Consortium](https://www.ow2.org/).

OW2 is an independent, global, **open-source software community**. The OW2 consortium is an independent **non-profit organization** open to companies, public organizations, academia and individuals.

作为一个小故事，我们来说一下OW2组织是如何形成的。OW2组织的形成，与中国的一些大学和公司也有很大的关系（下面的内容来自[这里](https://www.ow2.org/view/About/OW2_Introduction)）：

- After its inception in January 2002, ObjectWeb, a joint project between INRIA, Bull, and France Telecom, grew into a mature open source community spanning three continents.
- Orientware was launched two years(2004年) later by Peking University(北京大学), Beijing University of Aeronautics and Astronautics (北航), National University of Defense Technology (国防科技大学), CVIC Software Engineering Co., Ltd.(中创软件) and Institute of Software, Chinese Academy of Sciences (中国科学院软件研究所).
- In September 2005, ObjectWeb and Orientware signed an agreement by which they committed to share their code base and jointly develop open source middleware software.
- The two communities merged at the end of 2006.
- In the same way that biological ecosystems develop, the ObjectWeb and Orientware communities developed over time. They became ready to support a fully fledged independent open source organization: the **OW2 Consortium**.
- The initial thrust of the co-founders who dedicated time(时间), expertise(专业知识) and financial(资金) resources to the project quickly gained the support of open source activists from around the world. A continuous cycle of contribution and expanding benefits has resulted in a rich business ecosystem of some 100 projects backed by more than 5,000 enthusiastic supporters. The OW2 business ecosystem did not happen overnight; much still remains to be done to take it to the next level.

ASM的Logo设计的也很有趣，它在旋转的过程中，会分别呈现出“A”、“S”和“M”这三个字母，如下图所示：

{:refdef: style="text-align: center;"}
![ASM Logo](/assets/images/java/asm/asm-logo.gif)
{: refdef}

再接下来，我们来看一下ASM版本与Java版本之间的关系，如下表所示。

<table>
<thead>
<tr>
    <th>ASM Release</th>
    <th>Release Date</th>
    <th>Java Support</th>
</tr>
</thead>
<tbody>
<tr>
    <td>2.0</td>
    <td>2005-05-17</td>
    <td>Java 5 language support</td>
</tr>
<tr>
    <td>3.2</td>
    <td>2009-06-11</td>
    <td>support for the new invokedynamic code.</td>
</tr>
<tr>
    <td>4.0</td>
    <td>2011-10-29</td>
    <td>Java 7 language support</td>
</tr>
<tr>
    <td>5.0</td>
    <td>2014-03-16</td>
    <td><b>Java 8 language support</b></td>
</tr>
<tr>
    <td>6.0</td>
    <td>2017-09-23</td>
    <td>Java 9 language support</td>
</tr>
<tr>
    <td>6.1</td>
    <td>2018-03-11</td>
    <td>Java 10 language support</td>
</tr>
<tr>
    <td>7.0</td>
    <td>2018-10-27</td>
    <td><b>Java 11 language support</b></td>
</tr>
<tr>
    <td>7.1</td>
    <td>2019-03-03</td>
    <td>Java 13 language support</td>
</tr>
<tr>
    <td>8.0</td>
    <td>2020-03-28</td>
    <td>Java 14 language support</td>
</tr>
<tr>
    <td>9.0</td>
    <td>2020-09-22</td>
    <td>Java 16 language support</td>
</tr>
<tr>
    <td>9.1</td>
    <td>2021-02-06</td>
    <td>Java 17 language support</td>
</tr>
<tr>
    <td></td>
    <td></td>
    <td></td>
</tr>
<tr>
    <td></td>
    <td></td>
    <td></td>
</tr>
</tbody>
</table>

为什么我们要关心ASM版本与Java版本之间的对应关系呢？大家知道，Java版本，随着时间的演进，在不断的发展，它的语言特性也在持续增加；为了适应新的Java版本的出现，ASM的版本也要不断演进更新。简单来说，就是Java要发展，ASM也要发展。我们关心ASM版本与Java版本之间的对应关系，是为了避免版本不支持造成不必要的麻烦。

什么是不必要的麻烦呢？现在，我们常用的Java版本是Java 8和Java 11。比如说，针对Java 8的版本，我们需要使用ASM 5.0的版本，就能正常工作。对于Java 11的版本，如果我们编写的ASM代码没有错，但我们使用ASM 5.0的版本，那就可能会出错；如果我们将ASM的版本提升到7.0以上，那错误就消失了。所以，我们在使用ASM进行编码的过程中，尽量使用较高的ASM版本。

## ASM能够做什么

在上面的内容当中，我们对ASM有了初步的了解，那么，有的同学可能会好奇，ASM到底能做什么呢？

> ASM is an all-purpose Java bytecode **manipulation** and **analysis** framework.
> It can be used to modify existing classes or to dynamically generate classes, directly in binary form.

### 通俗的理解

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

### 专业的描述

接下来，就是ASM是如何描述的。

The goal of the ASM library is to **generate**, **transform** and **analyze** compiled Java classes,
represented as byte arrays (as they are stored on disk and loaded in the Java Virtual Machine).

{:refdef: style="text-align: center;"}
![What ASM Can Do](/assets/images/java/asm/what-asm-can-do.png)
{: refdef}

- **Program analysis**, which can range from a simple syntactic parsing to a full semantic analysis, can be used to find potential bugs in applications, to detect unused code, to reverse engineer code, etc.
- **Program generation** is used in compilers. This includes traditional compilers, but also stub or skeleton compilers used for distributed programming, Just in Time compilers, etc.
- **Program transformation** can be used to optimize or obfuscate programs, to insert debugging or performance monitoring code into applications, for aspect oriented programming, etc.

## 为什么要学习ASM？

为什么要学习ASM呢？或者说，学习ASM是不是一个有必要的事情呢？其实，我想，对这个问题的回答，可能会因人而异。假如说，你的工作更多的侧重于应用，例如，使用开源的框架来解决公司的业务问题，可能ASM对你来说，就是一个可有可无的技能；但如果你致力于当一个架构师，或者让自己的技术更精湛，那就不仅仅要会使用各种框架，还要对框架底层的原理有所了解，而ASM往往在框架底层起着重要的作用。

为了让大家能够更清晰的了解ASM的作用，我们用一种更形象的方式来说明。平常的时候，我们使用Java语言进行开发，也能解决很多的问题。同时，我们也要注意到，Java语言能够解决的问题，它有一个边界。超过这个边界之外的问题，Java语言就解决不了了。我们可以把这个边界之内的范围称之为“Java语言的世界”。那么，ASM起什么作用呢？**ASM就是一处位于“Java语言的世界”边界上的一扇大门，通过这扇大门，我们可以前往“字节码的世界”。**在“字节码的世界”里，我们会看到不一样的“风景”，能够解决不一样的“问题”。

在影视作品中，会经常涉及到“不同世界”之间的穿梭。例如，动画片《哈尔的移动城堡》中，每一扇门背后都有一个不同的世界。

{:refdef: style="text-align: center;"}
![哈尔的移动城堡](/assets/images/manga/Howls-Moving-Castle-Another-World.gif)
{: refdef}

---

接下来，我们来讲**两个关于ASM的应用场景：Spring和JDK**。举这两个应用场景例子的目的，就是希望大家了解到ASM的重要性。

### Spring当中的ASM

**第一个应用场景，是Spring框架当中的AOP。** 在现在的Java程序开发当中，很多项目都会使用到Spring框架，而Spring框架当中的AOP（Aspect Oriented Programming）也要依赖于ASM。

在[Spring Framework Reference Documentation](https://docs.spring.io/spring-framework/docs/3.0.0.M3/reference/html/index.html)的[8.6 Proxying mechanisms](https://docs.spring.io/spring-framework/docs/3.0.0.M3/reference/html/ch08s06.html)中，如下描述：

Spring AOP uses either **JDK dynamic proxies** or **CGLIB** to create the proxy for a given target object. (JDK dynamic proxies are preferred whenever you have a choice).

- If the target object to be proxied implements at least one interface then a JDK dynamic proxy will be used. All of the interfaces implemented by the target type will be proxied.
- If the target object does not implement any interfaces then a CGLIB proxy will be created.

从实现的角度上来看，Spring的AOP，要么通过JDK的动态代理实现，要么通过CGLIB实现。然而，**CGLib** (**C**ode **G**eneration **Li**brary)是在**ASM**的基础上构建起来的，所以我们可以说，Spring AOP是间接的使用了ASM。

### JDK当中的ASM

**第二个应用场景，是JDK当中的Lambda表达式**。 在Java 8中引入了一个非常重要的特性，就是支持Lambda表达式。Lambda表达式，允许把方法作为参数进行传递，它能够使代码变的更加简洁紧凑。但是，我们可能没有注意到，其实，**在现阶段（Java 8版本），Lambda表达式的调用是通过ASM来实现的**。

在`rt.jar`文件的`jdk.internal.org.objectweb.asm`包当中，就包含了JDK内置的ASM代码。在JDK 8版本当中，它所使用的ASM 5.0版本。

如果我们跟踪Lambda表达式的编码实现，就会找到`InnerClassLambdaMetafactory.spinInnerClass()`方法。在这个方法当中，我们就会看到：JDK会使用`jdk.internal.org.objectweb.asm.ClassWriter`来生成一个类，将lambda表达式的代码包装起来。

- LambdaMetafactory.metafactory()  第一步，找到这个方法
    - InnerClassLambdaMetafactory.buildCallSite()  第二步，找到这个方法
        - InnerClassLambdaMetafactory.spinInnerClass()  第三步，找到这个方法
    
## 总结

本文主要是对ASM进行简单的介绍，希望大家能够对ASM有基本的了解，内容总结如下：

- 第一点，ASM所处理对象是**字节码数据**，也可以直观的理解成`.class`文件，不是`.java`文件。
- 第二点，ASM能够**字节码数据**进行哪些操作呢？回答：analyze、generate、transform。
- 第三点，ASM可以形象的理解为“Java语言世界”的边缘上一扇大门，通过这扇大门，可以帮助我们进入到“**字节码**的世界”。

同时，本文当中并没有涉及到“技术性”的知识点，因此也不需要“记忆”任何内容，了解一下就够了。
