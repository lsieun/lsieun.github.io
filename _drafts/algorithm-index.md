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

## 时间轮

{%
assign filtered_posts = site.algorithm |
where_exp: "item", "item.url contains '/algorithm/timing-wheel/'" |
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

- [Algorithm types and algorithm examples – illustrated](https://www.lavivienpost.com/algorithms-types-and-algorithm-examples/)
- [Data Structure Visualizations](https://www.cs.usfca.edu/~galles/visualization/Algorithms.html)
    - [Min Heap](https://www.cs.usfca.edu/~galles/visualization/Heap.html)
