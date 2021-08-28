---
title:  "Java ASM系列三：Tree API"
categories: java asm
image: /assets/images/manga/pig-run.jpg
tags: java asm
published: true
---

ASM is an open-source java library for manipulating bytecode.（不断更新中。。。）

---

- 《[Java ASM系列一：Core API]({% link _posts/2021-04-22-java-asm-season-01.md %})》主要是针对ASM当中Core API的内容进行展开。
- 《[Java ASM系列二：OPCODE]({% link _posts/2021-04-29-java-asm-season-02.md %})》主要是针对`MethodVisitor.visitXxxInsn()`方法与200个opcode之间的关系展开，同时也会涉及到opcode对于Stack Frame的影响。
- 《[Java ASM系列三：Tree API]({% link _posts/2021-05-01-java-asm-season-03.md %})》主要是针对ASM当中Tree API的内容进行展开。
- 《[Java ASM系列四：代码模板]({% link _posts/2021-06-01-java-asm-season-04.md %})》主要是整理ASM代码，将常用的功能编写成“模板”，在使用时进行必要的修改，才能使用。
- 《[Java ASM系列五：源码分析]({% link _posts/2021-07-01-java-asm-season-05.md %})》主要是对ASM源代码进行介绍。

---



## 主要内容

### 第一章 基础

{% assign filtered_posts = site.java-asm-03 | sort: "sequence" %}
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

### 第二章 Class Generation

{% assign filtered_posts = site.java-asm-03 | sort: "sequence" %}
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

### 第三章 Class Transformation

{% assign filtered_posts = site.java-asm-03 | sort: "sequence" %}
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

### 第四章 Method Analysis

{% assign filtered_posts = site.java-asm-03 | sort: "sequence" %}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 400 and num < 500 %}
    <li>
        <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

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
