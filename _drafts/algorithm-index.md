---
title: "Algorithm"
image: /assets/images/algorithm/algorithm-cover.png
permalink: /algorithm.html
---

An algorithm is a set of instructions for solving a problem or accomplishing a task.

## 简单

{%
assign filtered_posts = site.algorithm |
where_exp: "item", "item.url contains '/algorithm/ip/'" |
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

## 集合

{%
assign filtered_posts = site.algorithm |
where_exp: "item", "item.url contains '/algorithm/list/'" |
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

## 排序

{%
assign filtered_posts = site.algorithm |
where_exp: "item", "item.url contains '/algorithm/sort/'" |
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

## 动态规划

{%
assign filtered_posts = site.algorithm |
where_exp: "item", "item.url contains '/algorithm/dynamic-programming/'" |
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

## 计时器

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">时间轮</th>
        <th style="text-align: center;">总结</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.algorithm |
where_exp: "item", "item.url contains '/algorithm/timer/basic/'" |
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
assign filtered_posts = site.algorithm |
where_exp: "item", "item.url contains '/algorithm/timer/timing-wheel/'" |
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
assign filtered_posts = site.algorithm |
where_exp: "item", "item.url contains '/algorithm/timer/summary/'" |
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

- [Algorithm types and algorithm examples – illustrated](https://www.lavivienpost.com/algorithms-types-and-algorithm-examples/)
- [Data Structure Visualizations](https://www.cs.usfca.edu/~galles/visualization/Algorithms.html)
    - [Min Heap](https://www.cs.usfca.edu/~galles/visualization/Heap.html)
- [wangkuiwu.github.io](https://wangkuiwu.github.io/2100/01/01/index/)
    - [第3部分 数据结构和算法](https://wangkuiwu.github.io/2013/01/01/datastruct-index/)
