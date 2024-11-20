---
title: "PlantUML"
image: /assets/images/plantuml/plantuml-banner.png
permalink: /plantuml/plantuml-index.html
---

PlantUML is an open-source tool allowing users to create diagrams from a plain text language.

## UML

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
assign filtered_posts = site.plantuml |
where_exp: "item", "item.path contains 'plantuml/class/type/'" |
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
assign filtered_posts = site.plantuml |
where_exp: "item", "item.path contains 'plantuml/class/member/'" |
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
assign filtered_posts = site.plantuml |
where_exp: "item", "item.path contains 'plantuml/class/link/'" |
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
assign filtered_posts = site.plantuml |
where_exp: "item", "item.path contains 'plantuml/class/pkg/'" |
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
assign filtered_posts = site.plantuml |
where_exp: "item", "item.path contains 'plantuml/class/other/'" |
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
assign filtered_posts = site.plantuml |
where_exp: "item", "item.path contains 'plantuml/object/component/'" |
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
assign filtered_posts = site.plantuml |
where_exp: "item", "item.path contains 'plantuml/object/link/'" |
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

## MindMap

- [MindMap](https://plantuml.com/mindmap-diagram)

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">Structure</th>
        <th style="text-align: center;">Style</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.plantuml |
where_exp: "item", "item.path contains 'plantuml/mindmap/basic/'" |
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
assign filtered_posts = site.plantuml |
where_exp: "item", "item.path contains 'plantuml/mindmap/structure/'" |
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
assign filtered_posts = site.plantuml |
where_exp: "item", "item.path contains 'plantuml/mindmap/style/'" |
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

## Preprocessing

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
assign filtered_posts = site.plantuml |
where_exp: "item", "item.path contains 'plantuml/preprocessing/include/'" |
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
    - [Creole](https://plantuml.com/creole)
    - [Colors](https://plantuml.com/color)

- GitHub
    - [plantuml/plantuml.js](https://github.com/plantuml/plantuml.js)
    - [plantuml/plantuml](https://github.com/plantuml/plantuml)

- [UML Modeling with PlantUML: A Comprehensive Guide with Examples](https://mycodingdays.com/uml_modeling_with_plantuml_a_comprehensive_guide_with_examples/)

