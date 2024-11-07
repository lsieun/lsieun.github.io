---
title: "Lombok"
image: /assets/images/java/lombok/lombok-cover.png
permalink: /lombok/lombok-index.html
---

Project Lombok is a java library that automatically plugs into your editor and build tools, spicing up your java.

The way Lombok works is by plugging into our build process and auto-generating Java bytecode into our `.class` files.

## Content

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
assign filtered_posts = site.lombok |
where_exp: "item", "item.path contains 'lombok/basic/'" |
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

## Annotation

<table>
    <thead>
    <tr>
        <th>Intern</th>
        <th>Theme</th>
        <th>Extern</th>
        <th>Experimental</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.lombok |
where_exp: "item", "item.path contains 'lombok/annotation/intern/'" |
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
assign filtered_posts = site.lombok |
where_exp: "item", "item.path contains 'lombok/annotation/theme/'" |
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
assign filtered_posts = site.lombok |
where_exp: "item", "item.path contains 'lombok/annotation/extern/'" |
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
assign filtered_posts = site.lombok |
where_exp: "item", "item.path contains 'lombok/annotation/experimental/'" |
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

## Configuration

<table>
    <thead>
    <tr>
        <th>Config</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.lombok |
where_exp: "item", "item.path contains 'lombok/config/'" |
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

- [lsieun/learn-java-lombok](https://github.com/lsieun/learn-java-lombok)

- [Project Lombok](https://projectlombok.org/)
    - [Lombok features](https://projectlombok.org/features/)
    - [Configuration system](https://projectlombok.org/features/configuration)

- [Baeldung Tag: Lombok](https://www.baeldung.com/tag/lombok)
    - [Introduction to Project Lombok](https://www.baeldung.com/intro-to-project-lombok)
    - [Lombok Configuration System](https://www.baeldung.com/lombok-configuration-system)

