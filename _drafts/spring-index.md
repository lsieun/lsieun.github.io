---
title: "Spring"
image: /assets/images/spring/spring-cover.jpg
permalink: /spring.html
---

Spring 概念

- Spring 轻量级的开源的 JavaEE 框架
- Spring 有两个核心部分：IOC 和 AOP
  - IOC：控制反转，把创建对象的过程交给 Spring 进行管理
  - AOP：面向切面，不修改源代码进行功能增强

```text
BeanDefinition --> BeanDefinitionRegistry
```

## Core

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>FAQ</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.spring |
where_exp: "item", "item.url contains '/spring/core/basic/'" |
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
assign filtered_posts = site.spring |
where_exp: "item", "item.url contains '/spring/core/faq/'" |
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

## IOC

### XML

<table>
    <thead>
    <tr>
        <th>默认标签</th>
        <th>其它标签</th>
        <th>第三方集成</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.spring |
where_exp: "item", "item.url contains '/spring/ioc/xml/bean/'" |
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
assign filtered_posts = site.spring |
where_exp: "item", "item.url contains '/spring/ioc/xml/extra/'" |
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
assign filtered_posts = site.spring |
where_exp: "item", "item.url contains '/spring/ioc/xml/external/'" |
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

### Annotation

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Extra</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.spring |
where_exp: "item", "item.url contains '/spring/ioc/anno/basic/'" |
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
assign filtered_posts = site.spring |
where_exp: "item", "item.url contains '/spring/ioc/anno/extra/'" |
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

### IOC

{%
assign filtered_posts = site.spring |
where_exp: "item", "item.url contains '/spring/ioc/basic/'" |
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


## AOP

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>XML</th>
        <th>Annotation</th>
        <th>FAQ</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.spring |
where_exp: "item", "item.url contains '/spring/aop/basic/'" |
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
assign filtered_posts = site.spring |
where_exp: "item", "item.url contains '/spring/aop/xml/'" |
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
assign filtered_posts = site.spring |
where_exp: "item", "item.url contains '/spring/aop/anno/'" |
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
assign filtered_posts = site.spring |
where_exp: "item", "item.url contains '/spring/aop/faq/'" |
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

## MVC

{%
assign filtered_posts = site.spring |
where_exp: "item", "item.url contains '/spring/mvc/'" |
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

## JDBCTemplate

事务管理

Spring 5 新特性

## Reference

- [Spring](https://spring.io/)
- [Spring Framework Documentation](https://docs.spring.io/spring-framework/reference/)

- [廖雪峰：手写 Spring](https://www.liaoxuefeng.com/wiki/1539348902182944)
- [廖雪峰：手写 Tomcat](https://www.liaoxuefeng.com/wiki/1545956031987744)

- [spring5.3.x最新源码阅读环境搭建-基于gradle构建](https://www.bilibili.com/video/BV1P54y1q7LQ/)
- [黑马满叔spring高级50讲！详解AOP](https://www.bilibili.com/video/BV1iu4y1C7cy/)

- [黑马程序员新版Spring零基础入门到精通](https://www.bilibili.com/video/BV1rt4y1u7q5/)
- [Spring 文章](https://www.cnblogs.com/ZhuChangwu/category/1527131.html)
