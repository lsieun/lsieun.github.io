---
title:  "IntelliJ IDEA"
categories: jetbrains
image: /assets/images/intellij/intellij-idea.png
tags: intellij
published: false
---

IntelliJ IDEA is an integrated development environment written in Java for developing computer software. It is developed by JetBrains.

## 主要内容

### 第一章 基础操作（将手放在键盘上，不用鼠标）

{% assign filtered_posts = site.intellij-idea | sort: "sequence" %}
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

### 第二章 配置和原理（配置IDEA，让工作更高效）

Disabling unused plugins

Shared JDK Indexes

{% assign filtered_posts = site.intellij-idea | sort: "sequence" %}
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

### IDE Configuration

### Project Configuration

### Source Code



### 所有章节

{% assign filtered_posts = site.intellij-idea | sort: "sequence" %}

<ol>
    {% for post in filtered_posts %}
    <li>
        <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

## 参考资料

- [jetbrains.com: Discover IntelliJ IDEA](https://www.jetbrains.com/help/idea/discover-intellij-idea.html)
- [The IntelliJ IDEA Blog](https://blog.jetbrains.com/idea/)
- [IntelliJ IDEA Guide](https://www.jetbrains.com/idea/guide/)
