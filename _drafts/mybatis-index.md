---
title: "MyBatis"
image: /assets/images/db/mybatis/mybatis-x-logo.png
permalink: /mybatis.html
---

MyBatis is a Java persistence framework
that couples objects with stored procedures or SQL statements using an XML descriptor or annotations.

## 内容介绍

- MyBatis
    - MyBatis 简介
    - MyBatis 框架搭建
    - MyBatis 基础功能
        - MyBatis 的核心配置文件的解与编写
        - MyBatis 的映射文件
        - MyBatis 实现增删改查
        - MyBatis 获取参数的两种方式
        - MyBatis 的各种查询功能
        - MyBatis 的自定义映射 resultMap
        - MyBatis 的动态 SQL
    - MyBatis 的分页插件
    - MyBatis 的逆向工程
    - MyBatis 的缓存

## Basic

{%
assign filtered_posts = site.db |
where_exp: "item", "item.url contains '/db/mybatis/basic/'" |
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

## Config

{%
assign filtered_posts = site.db |
where_exp: "item", "item.url contains '/db/mybatis/config/'" |
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

## Custom

{%
assign filtered_posts = site.db |
where_exp: "item", "item.url contains '/db/mybatis/custom/'" |
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

## Cache

{%
assign filtered_posts = site.db |
where_exp: "item", "item.url contains '/db/mybatis/cache/'" |
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

## FAQ

{%
assign filtered_posts = site.db |
where_exp: "item", "item.url contains '/db/mybatis/faq/'" |
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

- [lsieun/learn-java-mybatis](https://github.com/lsieun/learn-java-mybatis)

- [MyBatis](https://mybatis.org/mybatis-3/index.html)
    - [Configuration](https://mybatis.org/mybatis-3/configuration.html)
    - [Mapper XML Files](https://mybatis.org/mybatis-3/sqlmap-xml.html)
- [Maven: MyBatis](https://mvnrepository.com/artifact/org.mybatis/mybatis)
- Baeldung
  - [MyBatis with Spring](https://www.baeldung.com/spring-mybatis)

- [Mybatis系列全解（八）：Mybatis的9大动态SQL标签你知道几个？](https://www.cnblogs.com/panshenlian/p/14479856.html)

视频：

- [【尚硅谷】2022 版 MyBatis 零基础入门教程](https://www.bilibili.com/video/BV1VP4y1c7j7/)
- [【尚硅谷】SSM 框架全套教程](https://www.bilibili.com/video/BV1Ya411S7aT)
- [这是全网讲的最好的 MyBatis 基础入门到精通教程](https://www.bilibili.com/video/BV1At4y1578D)


- [MyBatis 批量插入几千条数据，请慎用 foreach](https://www.bilibili.com/video/BV1r34y1W7EL/)
- [MySQL8 开窗函数单 SQL 实现复杂数据分析](https://www.bilibili.com/video/BV1zL4y1w7Q2/)

- [mybatis-plus 根据日期检索查询](https://www.cnblogs.com/ckfeng/p/15667779.html)
- [mybatis 根据时间检索查询](http://www.manongjc.com/detail/28-jdxwnwebivzraea.html)
- [mybatis 时间范围查询](https://www.cnblogs.com/zhihongming/p/15782367.html)
- [Mybatis 和 Mybatis-Plus 时间范围查询，亲测有效](https://www.jianshu.com/p/bf409032b5b7)
- [Mybatis 使用 in 传入 List 的三种方法](https://blog.csdn.net/Koikoi12/article/details/121243849)
- [聊聊 Mybatis 中 sql 语句不等于的表示](https://www.jb51.net/article/217291.htm)
- [详解 Java 的 MyBatis 框架中动态 SQL 的基本用法](https://www.jb51.net/article/82031.htm)
- [mybatis 判断集合长度](https://blog.csdn.net/aeteoi5717/article/details/102408963)
- [Mybatis 中传递多个参数的 4 种方法](https://blog.csdn.net/weixin_45433031/article/details/123208290)
- [mybatis 中 if else 用法](https://blog.csdn.net/gb4215287/article/details/119756703)

源码分析

- [Mybatis 源码解析 01 - 配置、启动加载](https://my.oschina.net/mingshashan/blog/7635703)
- [Mybatis 源码解析 02-SQL 执行概述](https://my.oschina.net/mingshashan/blog/7635907)
- [Mybatis 源码解析 03 - 关键组件 SqlSession](https://my.oschina.net/mingshashan/blog/7635705)
- [Mybatis 源码解析 04 - 关键组件 Executor](https://my.oschina.net/mingshashan/blog/7635706)
- [Mybatis 源码解析 05 - 关键组件 StatementHandler](https://my.oschina.net/mingshashan/blog/7792267)
- [Mybatis 源码解析 06 - 关键组件 ParameterHandler](https://my.oschina.net/mingshashan/blog/7793221)
- [Mybatis 源码解析 07 - 关键组件 ResultSetHandler](https://my.oschina.net/mingshashan/blog/7793973)
- [JDBC 关键部分简单梳理](https://my.oschina.net/mingshashan/blog/7682787)
