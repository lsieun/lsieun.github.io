---
title: "GraalVM"
image: /assets/images/graalvm/graalvm-cover.jpeg
permalink: /graalvm.html
---

GraalVM is a high performance JDK
that speeds up the performance of Java and JVM-based applications and
simplifies the building and running of Java cloud native services.

## Basic

{%
assign filtered_posts = site.graalvm |
where_exp: "item", "item.url contains '/graalvm/basic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

## Reference

- [GraalVM](https://www.graalvm.org/)
- [Oracle GraalVM](https://www.oracle.com/java/graalvm/)
    - [Doc](https://docs.oracle.com/en/graalvm/index.html)

文章：

- [Madhukar's Blog](https://blog.madhukaraphatak.com/categories/graal-vm/)

视频：

- [GraalVM Native Image in depth](https://www.youtube.com/playlist?list=PLWchVAowvRxAoU0jE9Vk6fTt3yX3IuPDq)


