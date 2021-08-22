---
title:  "Java ASM系列二：OPCODE"
categories: java asm
image: /assets/images/manga/pig-dream.jpg
tags: java asm
published: true
---

ASM is an open-source java library for manipulating bytecode.

---

- 《[Java ASM系列一：Core API]({% link _posts/2021-04-22-java-asm-season-01.md %})》主要是针对ASM当中Core API的内容进行展开。
- 《[Java ASM系列二：OPCODE]({% link _posts/2021-04-29-java-asm-season-02.md %})》主要是针对`MethodVisitor.visitXxxInsn()`方法与200个opcode之间的关系展开，同时也会涉及到opcode对于Stack Frame的影响。
- 《[Java ASM系列三：Tree API]({% link _posts/2021-05-01-java-asm-season-03.md %})》主要是针对ASM当中Tree API的内容进行展开。
- 《[Java ASM系列四：代码模板]({% link _posts/2021-06-01-java-asm-season-04.md %})》主要是整理ASM代码，将常用的功能编写成“模板”，在使用时进行必要的修改，才能使用。
- 《[Java ASM系列五：源码分析]({% link _posts/2021-07-01-java-asm-season-05.md %})》主要是对ASM源代码进行介绍。

---

对于《Java ASM系列二：OPCODE》有配套的视频讲解，可以点击[这里](https://edu.51cto.com/course/28870.html)和[这里](https://space.bilibili.com/1321054247/channel/detail?cid=197480)进行查看；同时，也可以点击[这里](https://gitee.com/lsieun/learn-java-asm)查看源码资料。

---


## 主要内容

### 第一章 基础

{% assign filtered_posts = site.java-asm-02 | sort: "sequence" %}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 100 and num < 200 %}
    <li>
        <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

### 第二章 OPCODE

在JVM文档中，一共定义了205个[opcode](/static/java/opcode.html)，内容比较多，我们可以根据自己的兴趣进行有选择性的学习。在下面文章的标题后面都带有`(m/n/sum)`标识，其中，`m`表示当前文章当中介绍多少个opcode，`n`表示到目前为止介绍了多少个opcode，`sum`表示一共有多少个opcode。

{% assign filtered_posts = site.java-asm-02 | sort: "sequence" %}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 200 and num < 300 %}
    <li>
        <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

### 第三章 难点解析

{% assign filtered_posts = site.java-asm-02 | sort: "sequence" %}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 300 and num < 400 %}
    <li>
        <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

[comment]: <> (### 所有章节)

[comment]: <> ({% assign filtered_posts = site.java-asm-02 | sort: "sequence" %})

[comment]: <> (<ol>)

[comment]: <> (    {% for post in filtered_posts %})

[comment]: <> (    <li>)

[comment]: <> (        <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>)

[comment]: <> (    </li>)

[comment]: <> (    {% endfor %})

[comment]: <> (</ol>)

## 参考资料

- 课程源码：[learn-java-asm](https://gitee.com/lsieun/learn-java-asm)
- [ASM官网](https://asm.ow2.io/)
- [ASM API文档](https://asm.ow2.io/javadoc/index.html)
- [Oracle: The Java Virtual Machine Specification, Java SE 8 Edition](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)
  - [Chapter 2. The Structure of the Java Virtual Machine](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html)
  - [Chapter 4. The class File Format](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html)
  - [Chapter 6. The Java Virtual Machine Instruction Set](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html)

{:refdef: style="text-align: center;"}
![QQ Group](/assets/images/contact/qq-group.jpg)
{: refdef}
