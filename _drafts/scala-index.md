---
title: "Scala"
image: /assets/images/scala/scala-cover.jpg
permalink: /scala.html
---

Scala is a strong statically typed high-level general-purpose programming language
that supports both object-oriented programming and functional programming.

## Content

{%
assign filtered_posts = site.scala |
where_exp: "item", "item.url contains '/scala/basic/'" |
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

- [Scala](https://www.scala-lang.org/)
- []()
