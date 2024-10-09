---
title: "Design Patterns"
image: /assets/images/design-pattern/design-pattern-cover.png
permalink: /design-pattern/design-pattern-index.html
---

In software engineering, a design pattern is a general repeatable solution
to a commonly occurring problem in software design.

编程思路

- 面向对象
- 设计原则
- 设计模式
- 设计应用

## Basic

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Principle</th>
        <th>Behavior</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.design-pattern |
where_exp: "item", "item.path contains 'design-pattern/basic/'" |
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
assign filtered_posts = site.design-pattern |
where_exp: "item", "item.path contains 'design-pattern/principle/'" |
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
assign filtered_posts = site.design-pattern |
where_exp: "item", "item.path contains 'design-pattern/behavior/'" |
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

### Creational Patterns

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">Singleton</th>
        <th style="text-align: center;">Factory</th>
        <th style="text-align: center;">Builder</th>
        <th style="text-align: center;">Prototype</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.design-pattern |
where_exp: "item", "item.path contains 'design-pattern/creation/basic/'" |
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
assign filtered_posts = site.design-pattern |
where_exp: "item", "item.path contains 'design-pattern/creation/singleton/'" |
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
assign filtered_posts = site.design-pattern |
where_exp: "item", "item.path contains 'design-pattern/creation/factory/'" |
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
assign filtered_posts = site.design-pattern |
where_exp: "item", "item.path contains 'design-pattern/creation/builder/'" |
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
assign filtered_posts = site.design-pattern |
where_exp: "item", "item.path contains 'design-pattern/creation/prototype/'" |
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

### Structural Patterns

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Adapter</th>
        <th style="text-align: center;">Bridge</th>
        <th style="text-align: center;">Composite</th>
        <th style="text-align: center;">Decorator</th>
        <th style="text-align: center;">Facade</th>
        <th style="text-align: center;">Flyweight</th>
        <th style="text-align: center;">Proxy</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.design-pattern |
where_exp: "item", "item.path contains 'design-pattern/structure/adapter/'" |
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
assign filtered_posts = site.design-pattern |
where_exp: "item", "item.path contains 'design-pattern/structure/bridge/'" |
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
assign filtered_posts = site.design-pattern |
where_exp: "item", "item.path contains 'design-pattern/structure/composite/'" |
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
assign filtered_posts = site.design-pattern |
where_exp: "item", "item.path contains 'design-pattern/structure/decorator/'" |
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
assign filtered_posts = site.design-pattern |
where_exp: "item", "item.path contains 'design-pattern/structure/facade/'" |
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
assign filtered_posts = site.design-pattern |
where_exp: "item", "item.path contains 'design-pattern/structure/flyweight/'" |
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
assign filtered_posts = site.design-pattern |
where_exp: "item", "item.path contains 'design-pattern/structure/proxy/'" |
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

## Concurrency Patterns

## References

- [lsieun/learn-java-design-pattern](https://github.com/lsieun/learn-java-design-pattern)

- [Wiki: SOLID](https://en.wikipedia.org/wiki/SOLID)
- Wiki: GRASP: `https://en.wikipedia.org/wiki/GRASP_(object-oriented_design)`

Baeldung:

- [Baeldung Tag: Design Patterns](https://www.baeldung.com/cs/tag/design-patterns)

相关书籍

- [ ] 《Mastering Design Patterns in Java: Essential Skills》 Ed Norex，涉及的内容很广
- [ ] 《Dive Into Design Patterns》 Alexander Shvets 有许多形象的图
- [ ] 《Design Patterns with Java: An Introduction》Olaf Musch 语言使用的很『精准』，一些语句写的非常好
- [ ] 《Dive Into Refactoring》 Alexander Shvets
- [ ] 《24 Patterns for Clean Code》 Robert Beisert
- [ ] 《Anti Patterns: Refactoring Software, Architectures and Project in Crisis》
- [ ] 《Get Your Hands Dirty on Clean Architecture》Tom Hombergs
- [ ] 《Java Design Patterns: A Tour with 23 Gang of Four Design Patterns in Java》Vaskaran Sarcar
- [ ] 《Refactoring for Software Design Smells: Managing Technical Debt》
- [ ] Head First Design Patterns
- Design Patterns: Elements of Reusable Object-Oriented Software

视频：

- [编程思想介绍](https://www.bilibili.com/video/BV1Xv4y1T7by/)
- [华为大佬 11 小时讲完的设计模式](https://www.bilibili.com/video/BV17W4y1X74R)

系列文章

- [refactoring.guru: DESIGN PATTERNS](https://refactoring.guru/design-patterns)
- [sourcecodeexamples: Design Patterns Overview](https://www.sourcecodeexamples.net/2017/12/design-patterns-overview.html)
    - [Github:sourcecodeexamples 源码](https://github.com/RameshMF/gof-java-design-patterns)
- [The Software Architecture Chronicles](https://herbertograca.com/2017/07/03/the-software-architecture-chronicles/)
- [Design Patterns in Java Tutorial](https://www.tutorialspoint.com/design_pattern/index.htm)

单独文章

Bilibili

- [深入解读 23 种设计模式](https://www.bilibili.com/video/BV1fR4y1N74H)

- [设计模式之美](https://github.com/jianglinyang8/beauty-of-design-pattern)

