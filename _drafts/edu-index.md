---
title: "Education"
image: /assets/images/edu/Education-Empowers-Life-of-Every-Students.png
permalink: /edu/edu-index.html
---

The whole purpose of reading is to **understand** and **learn**!

## Basic



<table>
    <thead>
    <tr>
        <th style="text-align: center;">Language</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.edu |
where_exp: "item", "item.path contains 'edu/high/physics/'" |
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
