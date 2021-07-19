---
title:  "Java ASM系列二：OPCODE"
categories: java asm
image: /assets/images/manga/pig-dream.jpg
tags: java asm
published: true
---

ASM is an open-source Java Library for manipulating java byte code.（不断更新中。。。）

《Java ASM系列二：OPCODE》主要是针对`MethodVisitor.visitXxxInsn()`方法与200个opcode之间的关系展开。

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

## 参考资料

- 课程源码：[learn-java-asm](https://gitee.com/lsieun/learn-java-asm)
- [ASM官网](https://asm.ow2.io/)
- ASM源码：[GitLab](https://gitlab.ow2.org/asm/asm)
- ASM API文档：[javadoc](https://asm.ow2.io/javadoc/index.html)
- ASM使用手册：[英文版](https://asm.ow2.io/asm4-guide.pdf)、[中文版](https://www.yuque.com/mikaelzero/asm)
- 参考文献
    - 2002年，[ASM: a code manipulation tool to implement adaptable systems(PDF)](/assets/pdf/asm-eng.pdf)
    - 2007年，[Using the ASM framework to implement common Java bytecode transformation patterns(PDF)](/assets/pdf/asm-transformations.pdf)
- [Oracle: The Java Virtual Machine Specification, Java SE 8 Edition](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)
