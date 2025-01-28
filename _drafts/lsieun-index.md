---
title: "Lsieun"
image: /assets/images/bash/bash-cover.jpg
permalink: /lsieun/lsieun-index.html
---

My Personal Tech

## ASM

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Transformation</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.lsieun |
where_exp: "item", "item.path contains 'lsieun/utils/asm/'" |
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
        </td>
    </tr>
    </tbody>
</table>

## Reference

- [lsieun/lsieun-utils](https://github.com/lsieun/lsieun-utils)
