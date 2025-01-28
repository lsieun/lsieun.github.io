---
title: "DITA"
image: /assets/images/dita/what-is-dita.jpg
permalink: /dita.html
---

DITA stands for "Darwin Information Typing Architecture."

The word “Darwin” in the name makes sense when you realize that the system is built on the idea of **inheritance**.
Child elements “evolve” from the parent elements and are based on them.

![](/assets/images/dita/dita-logo.png)

## Basic

{%
assign filtered_posts = site.dita |
where_exp: "item", "item.url contains '/dita/basic/'" |
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

## XML

{%
assign filtered_posts = site.dita |
where_exp: "item", "item.url contains '/dita/xml/'" |
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

## Oxygen XML Author

{%
assign filtered_posts = site.dita |
where_exp: "item", "item.url contains '/dita/oxygen/'" |
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

- [DITA Open Toolkit](https://www.dita-ot.org/)
  - [DITA Open Toolkit 4.0](https://www.dita-ot.org/dev/)
- [DITA for the Impatient](https://www.xmlmind.com/tutorials/DITA/)
- [What Is DITA XML? - An Introduction](https://ivannovation.com/blog/what-is-dita-xml/)
- [What Is DITA?](https://techwhirl.com/what-is-dita/)


