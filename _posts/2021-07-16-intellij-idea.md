---
title:  "IntelliJ IDEA使用技巧"
categories: jetbrains
image: /assets/images/ide/intellij-idea.png
tags: ide idea
published: false
---

IntelliJ IDEA is an integrated development environment written in Java for developing computer software. It is developed by JetBrains.

## 主要内容

### 第一章 基础

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

## 参考资料

- [The IntelliJ IDEA Blog](https://blog.jetbrains.com/idea/)
- [IntelliJ IDEA Guide](https://www.jetbrains.com/idea/guide/)
