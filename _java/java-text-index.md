---
title: "Text"
sequence: "java-text"
---

## API

<table>
    <thead>
    <tr>
        <th style="text-align: center;">API</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/text/api/'" |
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

## Content

<table>
<tr>
    <th>UTF8</th>
    <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/text/utf8/'" |
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
<tr>
    <th>Format</th>
    <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/text/format/'" |
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
<tr>
    <th>合并</th>
    <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/text/concat/'" |
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
<tr>
    <th>拆分</th>
    <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/text/split/'" |
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

<tr>
    <th>排序</th>
    <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/text/sort/'" |
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
<tr>
    <th>移除</th>
    <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/text/remove/'" |
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
</table>

## Reference

- [lsieun/learn-java-text](https://github.com/lsieun/learn-java-text)

书籍

- [ ] [Java I/O, NIO and NIO.2]() Jeff Friesen
    - [ ] Chapter 09. Regular Expressions
    - [ ] Chapter 10. Charsets
