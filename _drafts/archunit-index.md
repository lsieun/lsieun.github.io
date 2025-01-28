---
title: "ArchUnit"
image: /assets/images/archunit/java-land-banner.jpg
permalink: /archunit/archunit-index.html
---

Simply put, ArchUnit is a test library
that allows us to verify that an application adheres to a given set of architectural rules.

## API

### Core

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Import</th>
        <th style="text-align: center;">JavaCode</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.archunit |
where_exp: "item", "item.path contains 'archunit/api/core/import/'" |
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
assign filtered_posts = site.archunit |
where_exp: "item", "item.path contains 'archunit/api/core/domain/'" |
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

### Lang

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Manage</th>
        <th style="text-align: center;">Match</th>
        <th style="text-align: center;">Should</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.archunit |
where_exp: "item", "item.path contains 'archunit/api/rule/manage/'" |
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
assign filtered_posts = site.archunit |
where_exp: "item", "item.path contains 'archunit/api/rule/match/'" |
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
assign filtered_posts = site.archunit |
where_exp: "item", "item.path contains 'archunit/api/rule/constraint/'" |
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

## ArchUnit

<table>
    <thead>
    <tr>
        <th style="text-align: center;">快速开始</th>
        <th style="text-align: center;">Class</th>
        <th style="text-align: center;">Package</th>
        <th style="text-align: center;">Architecture</th>
        <th style="text-align: center;">Other</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.archunit |
where_exp: "item", "item.path contains 'archunit/basic/quick/'" |
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
assign filtered_posts = site.archunit |
where_exp: "item", "item.path contains 'archunit/basic/clazz/'" |
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
assign filtered_posts = site.archunit |
where_exp: "item", "item.path contains 'archunit/basic/pkg/'" |
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
assign filtered_posts = site.archunit |
where_exp: "item", "item.path contains 'archunit/basic/architecture/'" |
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
assign filtered_posts = site.archunit |
where_exp: "item", "item.path contains 'archunit/basic/other/'" |
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

## PlantUML

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
assign filtered_posts = site.archunit |
where_exp: "item", "item.path contains 'archunit/plantuml/'" |
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

- [ArcUnit](https://www.archunit.org/)
    - [ArchUnit Examples](https://github.com/TNG/ArchUnit-Examples)
    - [Use Cases](https://www.archunit.org/use-cases)
    - [ArchUnit User Guide](https://www.archunit.org/userguide/html/000_Index.html)
- [ArchUnit: Unit test your Java architecture Spring Boot Example](https://www.youtube.com/watch?v=6R8ghUojHHI)

- GitHub
    - [TNG/ArchUnit](https://github.com/TNG/ArchUnit)
    - [TNG/ArchUnit-Examples](https://github.com/TNG/ArchUnit-Examples)

- [Baeldung Architecture](https://www.baeldung.com/category/architecture):
    - [Introduction to ArchUnit](https://www.baeldung.com/java-archunit-intro)

- [ReflectoringIo](https://reflectoring.io/)
    - [Enforcing Your Architecture with ArchUnit](https://reflectoring.io/enforce-architecture-with-arch-unit/)
    - [Clean Architecture Boundaries with Spring Boot and ArchUnit](https://reflectoring.io/java-components-clean-boundaries/)

- [实战 Arch Unit](https://zhuanlan.zhihu.com/p/107151861)

- [ArchUnit 実践：Onion Architecture のアーキテクチャテスト](https://laptrinhx.com/archunit-shi-jian-onion-architecture-noakitekuchatesuto-1777158206/)
- [Onion Architecture](https://laptrinhx.com/onion-architecture-4219738984/)
- [Test your architecture with Archunit](https://speakerdeck.com/thirion/test-your-architecture-with-archunit)
- [使用Spring Boot和ArchUnit绑定干净的架构组件](https://tech-zh.netlify.app/articles/zh-cn528128/)
- [Architektur absichern in Java](https://www.maibornwolff.de/know-how/architektur-absichern-in-java/)
- [What are some most useful things you coded with ArchUnit?](https://www.reddit.com/r/java/comments/p45niw/what_are_some_most_useful_things_you_coded_with/)

视频：

- [ArchUnit: Unit test your Java architecture Spring Boot Example](https://www.youtube.com/watch?v=6R8ghUojHHI)
- [Unit Test Your Java Architecture With ArchUnit by Roland Weisleder](https://www.youtube.com/watch?v=ef0lUToWxI8)
- [ArchUnit - Unit Testing Architecture and Design](https://www.youtube.com/watch?v=_ZUtb_hsm4Q)

