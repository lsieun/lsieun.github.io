---
title:  "Java ASM系列一：Core API"
categories: java asm
image: /assets/images/java/asm/brew_your_own_bytecode_with_asm.jpg
tags: java asm
---

ASM is an open source java library for manipulating java byte code.

## 主要内容

### 第一章 基础

{% assign filtered_posts = site.java-asm-01 | sort: "sequence" %}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 0 and num < 7 %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endif %}
    
    {% endfor %}
</ol>

### 第二章 生成新的类

{% assign filtered_posts = site.java-asm-01 | sort: "sequence" %}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num >= 7 and num < 19 %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endif %}
    
    {% endfor %}
</ol>

### 第三章 修改已有的类

### 所有章节

{% assign filtered_posts = site.java-asm-01 | sort: "sequence" %}
<ol>
    {% for post in filtered_posts %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>


## 参考资料

- [ASM](https://asm.ow2.io/)
- [GitLab: asm source code](https://gitlab.ow2.org/asm/asm)
- [Oracle: The Java Virtual Machine Specification, Java SE 8 Edition](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)

