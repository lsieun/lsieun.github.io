---
title: "Element UI"
sequence: "201"
---

## Basic

{%
assign filtered_posts = site.front-end |
where_exp: "item", "item.url contains '/front-end/element-plus/basic/'" |
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

## Form

{%
assign filtered_posts = site.front-end |
where_exp: "item", "item.url contains '/front-end/element-plus/form/'" |
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

## Data

{%
assign filtered_posts = site.front-end |
where_exp: "item", "item.url contains '/front-end/element-plus/data/'" |
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

## Feedback

{%
assign filtered_posts = site.front-end |
where_exp: "item", "item.url contains '/front-end/element-plus/feedback/'" |
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

Element Plus

- Element Plus：[国内地址](https://element-plus.gitee.io/en-US/)、[国外地址](https://element-plus.org/)



- [Element 表单验证：搞懂 model/prop/rules/validate](https://www.bilibili.com/video/BV1mQ4y1Q77A)
