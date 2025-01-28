---
title: "RIME 小狼毫"
image: /assets/images/rime/rime-cover.png
permalink: /rime.html
---

小狼毫输入法

## Content

{%
assign filtered_posts = site.rime |
where_exp: "item", "item.url contains '/rime/'" |
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

- [RIME／中州韻輸入法引擎](https://rime.im/download/)
- [Windows 安装 Rime 小狼毫五笔拼音输入法](https://www.eallion.com/weasel/)
- [小狼毫 3 分钟入门及进阶指南](https://sspai.com/post/63916)
- []()
- []()
- []()


