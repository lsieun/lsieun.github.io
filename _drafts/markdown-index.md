---
title: "Markdown"
image: /assets/images/git/git-vs-github.png
permalink: /markdown/markdown-index.html
---

Markdown

## 内容

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Link</th>
        <th style="text-align: center;">Image</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.markdown |
where_exp: "item", "item.path contains 'markdown/link/'" |
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
        <td>
{%
assign filtered_posts = site.markdown |
where_exp: "item", "item.path contains 'markdown/image/'" |
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

