---
title: "JUnit"
image: /assets/images/java/junit/junit5-banner.png
permalink: /junit.html
---

JUnit is one of the most popular unit-testing frameworks in the Java ecosystem.

## Basic

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/junit/basic/'" |
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

## Annotation

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Extra</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/junit/annotation/basic/'" |
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
where_exp: "item", "item.url contains '/java/junit/annotation/extra/'" |
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

- [Baeldung Tag: JUnit 5](https://www.baeldung.com/tag/junit-5)
    - [A Guide to JUnit 5](https://www.baeldung.com/junit-5)

