---
title: "Math"
image: /assets/images/math/math-cover.webp
permalink: /math.html
---

Math is Fun.

- algebra: 代数学 a type of mathematics in which letters and symbols are used to represent quantities
- trigonometry: 三角学 the type of mathematics that deals with the relationship between the sides and angles of
  triangles

## 数学符号

{%
assign filtered_posts = site.math |
where_exp: "item", "item.url contains '/math/notation/'" |
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

## Algebra 代数

{%
assign filtered_posts = site.math |
where_exp: "item", "item.url contains '/math/algebra/'" |
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

## Trigonometry 三角学

{%
assign filtered_posts = site.math |
where_exp: "item", "item.url contains '/math/trigonometry/'" |
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

## Geometry 几何

### 简单几何图形

{%
assign filtered_posts = site.math |
where_exp: "item", "item.url contains '/math/geometry/simple/'" |
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

### 几何变换

{%
assign filtered_posts = site.math |
where_exp: "item", "item.url contains '/math/geometry/transformation/'" |
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

## 向量

{%
assign filtered_posts = site.math |
where_exp: "item", "item.url contains '/math/vector/'" |
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

## Calculus

{%
assign filtered_posts = site.math |
where_exp: "item", "item.url contains '/math/calculus/'" |
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

## Fourier

{%
assign filtered_posts = site.math |
where_exp: "item", "item.url contains '/math/fourier/'" |
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

## MathJax

MathJax is an open-source JavaScript display engine for LaTeX, MathML,
and AsciiMath notation that works in all modern browsers.

{%
assign filtered_posts = site.math |
where_exp: "item", "item.url contains '/math/math-jax/'" |
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

More Resources:

- [Minimal MathJax package](https://tiborsimon.io/articles/web/minimal-mathjax/)
- [AsciiMath](http://asciimath.org/)
- [MathJax Documentation](https://docs.mathjax.org/)

## Reference

- [Math Is Fun](https://www.mathsisfun.com/index.htm)
    - [Algebra](https://www.mathsisfun.com/algebra/index.html)
        - [Vectors](https://www.mathsisfun.com/algebra/vectors.html)
        - [Trigonometry Index](https://www.mathsisfun.com/algebra/trigonometry-index.html)
    - [Geometry](https://www.mathsisfun.com/geometry/index.html)
    - [Calculus](https://www.mathsisfun.com/calculus/index.html)
      - [Fourier Series](https://www.mathsisfun.com/calculus/fourier-series.html)
- [MATH.net](https://www.math.net)
    - [Algebra](https://www.math.net/algebra)

漫画

- [Manga Guide Series](https://www.ohmsha.co.jp/english/manga.htm)
