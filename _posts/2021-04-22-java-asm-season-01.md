---
title:  "Java ASM系列一：Core API"
categories: java asm
image: /assets/images/java/asm/brew_your_own_bytecode_with_asm.jpg
tags: java asm
---

ASM is an open-source java library for manipulating bytecode.

---

对于《Java ASM系列一：Core API》有配套的视频讲解，可以点击[这里](https://edu.51cto.com/course/28517.html)和[这里](https://space.bilibili.com/1321054247/channel/detail?cid=189917)进行查看；同时，也可以点击[这里](https://gitee.com/lsieun/learn-java-asm)查看源码资料。

---

## 主要内容

### 第一章 基础

{% assign filtered_posts = site.java-asm-01 | sort: "sequence" %}
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

### 第二章 生成新的类

{% assign filtered_posts = site.java-asm-01 | sort: "sequence" %}
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

### 第三章 转换已有的类

{% assign filtered_posts = site.java-asm-01 | sort: "sequence" %}
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

### 第四章 工具类和常用类

{% assign filtered_posts = site.java-asm-01 | sort: "sequence" %}
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

[comment]: <> (### 所有章节)

[comment]: <> ({% assign filtered_posts = site.java-asm-01 | sort: "sequence" %})

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
- ASM源码：[GitLab](https://gitlab.ow2.org/asm/asm)
- ASM API文档：[javadoc](https://asm.ow2.io/javadoc/index.html)
- ASM使用手册：[英文版](https://asm.ow2.io/asm4-guide.pdf)、[中文版](https://www.yuque.com/mikaelzero/asm)
- 参考文献
    - 2002年，[ASM: a code manipulation tool to implement adaptable systems(PDF)](/assets/pdf/asm-eng.pdf)
    - 2007年，[Using the ASM framework to implement common Java bytecode transformation patterns(PDF)](/assets/pdf/asm-transformations.pdf)
- [Oracle: The Java Virtual Machine Specification, Java SE 8 Edition](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)
