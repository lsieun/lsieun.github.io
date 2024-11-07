---
title: "UML"
image: /assets/images/uml/plantuml/plantuml-intro-feature.png
permalink: /uml/uml-index.html
---

**UML**, short for **Unified Modeling Language**,
is a standardized modeling language consisting of an integrated set of diagrams,
developed to help system and software developers for specifying, visualizing, constructing,
and documenting the artifacts of software systems,
as well as for business modeling and other non-software systems.

## Basic

<table>
    <thead>
    <tr>
        <th>Basic</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.uml |
where_exp: "item", "item.path contains 'uml/basic/'" |
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

## PlantUML

### Class Diagram

<table>
    <thead>
    <tr>
        <th>类</th>
        <th>字段/方法</th>
        <th>关系</th>
        <th>包</th>
        <th>其它</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.uml |
where_exp: "item", "item.path contains 'uml/plantuml/class/type/'" |
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
assign filtered_posts = site.uml |
where_exp: "item", "item.path contains 'uml/plantuml/class/member/'" |
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
assign filtered_posts = site.uml |
where_exp: "item", "item.path contains 'uml/plantuml/class/link/'" |
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
assign filtered_posts = site.uml |
where_exp: "item", "item.path contains 'uml/plantuml/class/pkg/'" |
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
assign filtered_posts = site.uml |
where_exp: "item", "item.path contains 'uml/plantuml/class/other/'" |
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

### Object Diagram

<table>
    <thead>
    <tr>
        <th>对象</th>
        <th>连接</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.uml |
where_exp: "item", "item.path contains 'uml/plantuml/object/component/'" |
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
assign filtered_posts = site.uml |
where_exp: "item", "item.path contains 'uml/plantuml/object/link/'" |
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

### Preprocessing

- [Preprocessing](https://plantuml.com/preprocessing)

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Include</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.uml |
where_exp: "item", "item.path contains 'uml/plantuml/preprocessing/include/'" |
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

- [PlantUML](https://plantuml.com/)
    - [Guide](https://plantuml.com/guide)
    - [Class Diagram](https://plantuml.com/class-diagram)
    - [Preprocessing](https://plantuml.com/preprocessing)
    - [在线测试](https://www.plantuml.com/plantuml/uml/)

- [GitHub: plantuml/plantuml.js](https://github.com/plantuml/plantuml.js)

- [What is Unified Modeling Language (UML)?](https://www.visual-paradigm.com/guide/uml-unified-modeling-language/what-is-uml/)
- [PlantUML tutorial to create diagrams as code](https://www.augmentedmind.de/2021/01/03/plantuml-tutorial-diagrams-as-code/)
- [Relationships in class diagrams](https://www.ibm.com/docs/en/rational-soft-arch/9.7.0?topic=diagrams-relationships-in-class)

- [UML Tutorial](https://www.javatpoint.com/uml)
