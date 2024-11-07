---
title: "Java Agent 系列一：基础篇"
---

[UP]({% link _posts/2022-01-01-java-agent.md %})

《Java Agent 基础篇》，课程地址：[腾讯课堂](https://ke.qq.com/course/4335150)、[CSDN](https://edu.csdn.net/course/detail/36763)和[51CTO](https://edu.51cto.com/course/30137.html)。（三者内容相同，只是目录有差异）

## 主要内容

### 第一章 三个组成部分

{%
assign filtered_posts = site.java-agent |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 100 and num < 110 %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

### 第二章 两种启动方式

{%
assign filtered_posts = site.java-agent |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 110 and num < 130 %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

### 第三章 Instrumentation API

{%
assign filtered_posts = site.java-agent |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 130 and num < 150 %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

### 第四章 应用与技巧

{%
assign filtered_posts = site.java-agent |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 150 and num < 170 %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

## Reference

Oracle

- java.lang.instrument API
  - [Java 8 LTS](https://docs.oracle.com/javase/8/docs/api/java/lang/instrument/package-summary.html)
  - [Java 9](https://docs.oracle.com/javase/9/docs/api/java/lang/instrument/package-summary.html)
  - [Java 11 LTS](https://docs.oracle.com/en/java/javase/11/docs/api/java.instrument/java/lang/instrument/package-summary.html)
  - [Java 17 LTS](https://docs.oracle.com/en/java/javase/17/docs/api/java.instrument/java/lang/instrument/package-summary.html)
- Attach API
  - [Java 8: Attach API](https://docs.oracle.com/javase/8/docs/jdk/api/attach/spec/overview-summary.html)
  - [Java 11: jdk.attach](https://docs.oracle.com/en/java/javase/11/docs/api/jdk.attach/module-summary.html)
  - [Java 17: jdk.attach](https://docs.oracle.com/en/java/javase/17/docs/api/jdk.attach/module-summary.html)

OpenJDK

- [JDK 8 Source Code](https://hg.openjdk.java.net/jdk8)
  - [Package sun](https://hg.openjdk.java.net/jdk8/jdk8/jdk/file/tip/src/share/classes/sun)
    - [com.sun.tools.attach Source Code](https://hg.openjdk.java.net/jdk8/jdk8/jdk/file/tip/src/share/classes/com/sun/tools/attach)
    - [sun.instrument Source Code](https://hg.openjdk.java.net/jdk8/jdk8/jdk/file/tip/src/share/classes/sun/instrument)

![学习字节码技术 - lsieun.github.io](/assets/images/java/bytecode-lsieun.png)
