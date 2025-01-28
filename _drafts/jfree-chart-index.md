---
title: "JFreeChart"
image: /assets/images/jfreechart/chart-cover.jpg
permalink: /jfreechart.html
---

JfreeChart is an open source library developed in Java.

## 基础篇

{%
assign filtered_posts = site.jfreechart |
where_exp: "item", "item.url contains '/jfreechart/basic/'" |
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

## 示例

{%
assign filtered_posts = site.jfreechart |
where_exp: "item", "item.url contains '/jfreechart/example/'" |
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

## Plot 样式篇

{%
assign filtered_posts = site.jfreechart |
where_exp: "item", "item.url contains '/jfreechart/style/'" |
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

- [jfree/jfreechart](https://github.com/jfree/jfreechart)
- [jfree/jfreechart-fx](https://github.com/jfree/jfreechart-fx) JFreeChart-FX is an extension for JFreeChart
  that allows JFreeChart to be used in JavaFX applications.

- [lsieun/learn-java-jfreechart](https://github.com/lsieun/learn-java-jfreechart)

Tutorial

- [JFreeChart](https://zetcode.com/java/jfreechart/) 我觉得举的例子很好，但是还没有看
- [javatpoint: JFreeChart Tutorial](https://www.javatpoint.com/jfreechart-tutorial)
- [JFreeChart - Architecture](https://www.tutorialspoint.com/jfreechart/jfreechart_architecture.htm)

