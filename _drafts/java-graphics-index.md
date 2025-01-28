---
title: "Java Graphics"
image: /assets/images/java/graphics/java-swing.png
permalink: /java/java-graphics-index.html
---

Java Graphics

## A.W.T

```text
A.W.T = Abstract Window Toolkit
```

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Components</th>
        <th style="text-align: center;">Layout</th>
        <th style="text-align: center;">Geometry</th>
        <th style="text-align: center;">Other</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/graphics/awt/components/'" |
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
where_exp: "item", "item.path contains 'java/graphics/awt/layout/'" |
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
where_exp: "item", "item.path contains 'java/graphics/awt/geometry/'" |
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
where_exp: "item", "item.path contains 'java/graphics/awt/other/'" |
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

## Swing

## Reference

书籍

- [ ] 《Java In Depth》
    - [ ] Chapter 09. Applets And Applications
    - [ ] Chapter 14. A.W.T (Abstract Window Toolkit)
    - [ ] Chapter 15. Layouts
    - [ ] Chapter 16. Event Handling

- [Simple Java Graphics](https://horstmann.com/sjsu/graphics/)
- [Java Games Code - Copy And Paste](https://copyassignment.com/java-games-code-copy-and-paste/)

- [Sami Khuri's Visualization and Animation Packages](https://www.cs.sjsu.edu/faculty/khuri/animation.html)
- [programming notes](https://www3.ntu.edu.sg/home/ehchua/programming/index.html)
    - [Java Graphics Programming Tic-Tac-Toe](https://www3.ntu.edu.sg/home/ehchua/programming/java/JavaGame_TicTacToe.html)
    - [Case Study on Tic-Tac-Toe Part 2: With AI](https://www3.ntu.edu.sg/home/ehchua/programming/java/JavaGame_TicTacToe_AI.html)
- [Fractal Trees in Java | Recursion Explained.](https://projectjava.medium.com/fractal-trees-in-java-recursion-explained-7bc1b6e6bd57)
- [Java (Swing) Fractal generation](https://github.com/witek1902/fractal-generator)
- [(Partially) Annotated Index to Sample Code](https://cs.smu.ca/~porter/csc/465/code/)
    - [Fractal.java](https://cs.smu.ca/~porter/csc/465/code/deitel/examples/ch15/fig15_23_24/Fractal.java2html)
