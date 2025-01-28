---
title: "Java Tomcat"
sequence: "tomcat"
---

## Content

### Basic

{%
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/tomcat/basic'" |
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

### Config

{%
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/tomcat/config'" |
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

- [Apache Tomcat](https://tomcat.apache.org/)
- [TecAdmin: TOMCAT](https://tecadmin.net/category/web-servers/tomcat-web-servers/)

- [TOMCAT 源码分析 -- 一次请求](https://developer.aliyun.com/article/1252896)
- [TOMCAT 源码分析 -- 构建环境](https://developer.aliyun.com/article/1252895)
- [TOMCAT 源码分析 -- 启动（上）](https://developer.aliyun.com/article/1252892)
- [TOMCAT 源码分析 -- 启动（下）](https://developer.aliyun.com/article/1252894)
