---
title: "Algorithm"
image: /assets/images/algorithm/data-structures-and-algorithms.png
permalink: /algorithm/algorithm-index.html
---

An algorithm is a set of instructions for solving a problem or accomplishing a task.

## 简单

{%
assign filtered_posts = site.algorithm |
where_exp: "item", "item.path contains 'algorithm/ip/'" |
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
where_exp: "item", "item.path contains 'algorithm/list/'" |
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
where_exp: "item", "item.path contains 'algorithm/sort/'" |
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

- [What is Dynamic Programming? Working, Algorithms, and Examples](https://www.linkedin.com/pulse/what-dynamic-programming-working-algorithms-examples-rohit-bhatu-us9hf/)

{%
assign filtered_posts = site.algorithm |
where_exp: "item", "item.path contains 'algorithm/dynamic-programming/'" |
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
where_exp: "item", "item.path contains 'algorithm/timer/basic/'" |
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
where_exp: "item", "item.path contains 'algorithm/timer/timing-wheel/'" |
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
where_exp: "item", "item.path contains 'algorithm/timer/summary/'" |
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

## 专题处理

<table>
    <thead>
    <tr>
        <th style="text-align: center;">文本处理</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.algorithm |
where_exp: "item", "item.path contains 'algorithm/theme/text/'" |
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

## 参考

- [labuladong 的算法笔记](https://labuladong.online/algo/)

- [Algorithm types and algorithm examples – illustrated](https://www.lavivienpost.com/algorithms-types-and-algorithm-examples/)
- [Data Structure Visualizations](https://www.cs.usfca.edu/~galles/visualization/Algorithms.html)
    - [Min Heap](https://www.cs.usfca.edu/~galles/visualization/Heap.html)
- [wangkuiwu.github.io](https://wangkuiwu.github.io/2100/01/01/index/)
    - [第3部分 数据结构和算法](https://wangkuiwu.github.io/2013/01/01/datastruct-index/)

- [ALGORITHMS INSIGHT](https://algorithmsinsight.wordpress.com/)
- [Types of Algorithms](https://www.educba.com/types-of-algorithms/)

代码

- [GitHub: arksha/Algorithm](https://github.com/arksha/Algorithm)
