---
title:  "Software Architecture"
categories: software
image: /assets/images/architecture/software-architecture.png
tags: architecture
published: false
---

## 主要内容

### 第一章 架构

{% assign filtered_posts = site.architecture | sort: "sequence" %}
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
