---
title: "Java Graphics"
image: /assets/images/java/fx/java-fx-cover.png
permalink: /java/java-graphics-index.html
---

Java Graphics

## A.W.T

```text
A.W.T = Abstract Window Toolkit
```

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Components</th>
        <th style="text-align: center;">Layout</th>
        <th style="text-align: center;">Geometry</th>
        <th style="text-align: center;">Other</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/graphics/awt/components/'" |
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
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/graphics/awt/layout/'" |
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
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/graphics/awt/geometry/'" |
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
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/graphics/awt/other/'" |
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

## Swing



## Reference

书籍

- [ ] 《Java In Depth》
    - [ ] Chapter 09. Applets And Applications
    - [ ] Chapter 14. A.W.T (Abstract Window Toolkit)
    - [ ] Chapter 15. Layouts
    - [ ] Chapter 16. Event Handling
