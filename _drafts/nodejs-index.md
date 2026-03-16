---
title: "Node.js"
image: /assets/images/nodejs/nodejs-cover.png
permalink: /nodejs/index.html
---

Node.js

## Basic

<table>
    <thead>
    <tr>
        <th style="text-align: center;">快速开始</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.nodejs |
where_exp: "item", "item.path contains 'nodejs/installation/'" |
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
