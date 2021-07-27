---
title:  "Java ASM系列二：OPCODE"
categories: java asm
image: /assets/images/manga/pig-dream.jpg
tags: java asm
published: true
---

ASM is an open-source java library for manipulating bytecode.（不断更新中。。。）

《Java ASM系列二：OPCODE》主要是针对`MethodVisitor.visitXxxInsn()`方法与200个opcode之间的关系展开，同时也会涉及到opcode对于Stack Frame的影响。

因此，本系列就像一个“胶水”一样，将不同的事物粘合到一起。这里一共涉及三个事物：

- instruction/opcode，它是属`.class`文件里的内容。
- MethodVisitor.visitXxxInsn()方法，它是属于ASM API的内容。
- Stack Frame，它是属于JVM运行过程中的一个内存空间。

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

### 第二章 opcode

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

### 第三章

处理exception，将exception存储到什么位置
创建对象，new/dup/invokespecial
调用方法，加载this、方法参数，最后调用方法
Java 8 Lambda到底是怎么回事

## 参考资料

- 课程源码：[learn-java-asm](https://gitee.com/lsieun/learn-java-asm)
- [ASM官网](https://asm.ow2.io/)
- [ASM API文档](https://asm.ow2.io/javadoc/index.html)
- [Oracle: The Java Virtual Machine Specification, Java SE 8 Edition](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)
