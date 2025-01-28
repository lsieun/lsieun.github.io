---
title: "Software Architecture"
categories: software
image: /assets/images/architecture/software-architecture.png
permalink: /software-architecture.html
---

什么是软件架构？软件架构是一种特殊化的思考方式。这种思考方式，就是将复杂的事物拆分成几个简单的组成部分。这样，人们就能很容易的学习它，学会它之后，就可以使它帮助我们解决具体的问题。

认知（Cognition），就是一种思考方式，更直白的来说，就是运用人内在的逻辑思维（Logic）来理解外部的世界（World）。认知（Cognition），在不同的知识领域当中，有不同的名字。例如，在科学当中，被人们所接受的认知（Cognition）被称为“理论”（Theory），尚有待于验证的认知（Cognition）被称为“假设”（Assumption）。

## 主要内容

### 第一章 架构

{%
assign filtered_posts = site.architecture |
sort: "sequence"
%}
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
