---
title: "ProtoBuf"
image: /assets/images/protobuf/protobuf-cover.webp
permalink: /protobuf.html
---

Protocol Buffers is a free and open-source cross-platform data format used to serialize structured data.

## Basic

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>编译器</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.protobuf |
where_exp: "item", "item.url contains '/protobuf/basic/'" |
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
assign filtered_posts = site.protobuf |
where_exp: "item", "item.url contains '/protobuf/compiler/'" |
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

## Java

<table>
    <thead>
    <tr>
        <th>Java</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.protobuf |
where_exp: "item", "item.url contains '/protobuf/java/'" |
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

- [Protocol Buffers Documentation](https://protobuf.dev/)
    - [Language Guide (proto 3)](https://protobuf.dev/programming-guides/proto3/)


