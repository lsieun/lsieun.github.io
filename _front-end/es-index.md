---
title: "ECMAScript"
sequence: "201"
---

## Basic

{%
assign filtered_posts = site.front-end |
where_exp: "item", "item.url contains '/front-end/es/basic/'" |
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

## ES6

{%
assign filtered_posts = site.front-end |
where_exp: "item", "item.url contains '/front-end/es/es06/'" |
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

- [尚硅谷Web前端ES6教程，涵盖ES6-ES11](https://www.bilibili.com/video/BV1uK411H7on)
- [ES6超级简单](https://www.bilibili.com/video/BV13S4y1Q7Et)
