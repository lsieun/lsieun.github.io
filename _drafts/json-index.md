---
title: "Json"
image: /assets/images/json/json-cover.png
permalink: /json.html
---

JavaScript Object Notation (full form of JSON) is a standard file format used to interchange data.
The data objects are stored and transmitted using key-value pairs and array data types.

## Basic

{%
assign filtered_posts = site.json |
where_exp: "item", "item.url contains '/json/basic/'" |
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

## Jackson

- [Jackson]({% link _json/jackson-index.md %})

## 工具

- [JSON FORMATTER & VALIDATION](https://jsonformatter.curiousconcept.com/)

## 参考

- [What is JSON - The Only Guide You Need To Understand JSON](https://www.crio.do/blog/what-is-json/)
