---
title: "JCTools"
image: /assets/images/jctools/jctools-cover.png
permalink: /jctools.html
---

Java Concurrency Tools for the JVM.

## Basic

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/jctools/basic/'" |
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

## Queue

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/jctools/queue/'" |
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

- [JCTools/JCTools](https://github.com/JCTools/JCTools)
    - [Getting Started With JCTools](https://github.com/JCTools/JCTools/wiki/Getting-Started-With-JCTools)

- [Java Concurrency Utility with JCTools](https://www.baeldung.com/java-concurrency-jc-tools)
- [Novel Algos and Optimizations in JCTools Concurrent Queues](https://www.infoq.com/presentations/jctools-algorithms-optimization/)
