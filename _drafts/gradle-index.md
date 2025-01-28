---
title: "Gradle"
image: /assets/images/gradle/gradle-logo.png
permalink: /gradle.html
---

Gradle is a versatile and powerful build tool for any language, platform and project.

## Content

{%
assign filtered_posts = site.gradle |
where_exp: "item", "item.url contains '/gradle/basic/'" |
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

## Groovy

{%
assign filtered_posts = site.gradle |
where_exp: "item", "item.url contains '/gradle/groovy/'" |
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

- [【尚硅谷】Gradle教程入门到进阶](https://www.bilibili.com/video/BV1yT41137Y7/)
    - [文档](https://www.yuque.com/youyi-ai1ik/emphm9/kyhenl?)


