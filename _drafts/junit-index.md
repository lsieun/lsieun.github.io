---
title: "JUnit"
image: /assets/images/java/junit/junit5-banner.png
permalink: /junit/junit-index.html
---

JUnit is one of the most popular unit-testing frameworks in the Java ecosystem.

## Basic

{%
assign filtered_posts = site.junit |
where_exp: "item", "item.path contains 'junit/basic/'" |
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
assign filtered_posts = site.junit |
where_exp: "item", "item.path contains 'junit/annotation/basic/'" |
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
assign filtered_posts = site.junit |
where_exp: "item", "item.path contains 'junit/annotation/extra/'" |
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

## Parameterized Tests

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Core</th>
        <th>Extra</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.junit |
where_exp: "item", "item.path contains 'junit/params/base/'" |
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
assign filtered_posts = site.junit |
where_exp: "item", "item.path contains 'junit/params/core/'" |
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
assign filtered_posts = site.junit |
where_exp: "item", "item.path contains 'junit/params/extra/'" |
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

- [lsieun/learn-java-junit5](https://github.com/lsieun/learn-java-junit5)

- [Baeldung Tag: JUnit 5](https://www.baeldung.com/tag/junit-5)
    - [A Guide to JUnit 5](https://www.baeldung.com/junit-5)
    - [Guide to JUnit 5 Parameterized Tests](https://www.baeldung.com/parameterized-tests-junit-5)
- [Baeldung Category: Testing](https://www.baeldung.com/category/testing)
- [Baeldung Tag: AssertJ](https://www.baeldung.com/tag/assertj)
