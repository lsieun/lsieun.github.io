---
title: "Spring Boot"
image: /assets/images/spring-boot/spring-boot-planter.avif
permalink: /spring-boot.html
---

Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications that you can "just run".

- [Spring Boot Web]({% link _spring-boot/spring-boot-web-index.md %})

## Basic

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/basic/'" |
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

## Configuration

<table>
    <thead>
    <tr>
        <th>Properties</th>
        <th>YAML</th>
        <th>Profile</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/config/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 100 and num < 200 %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/config/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 200 and num < 300 %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/config/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 300 and num < 400 %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

## mechanism

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/mechanism/'" |
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

## Testing Framework

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/unit-test/'" |
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

## 部署 Deploy

- 配置高级
    - 临时属性设置
    - 配置文件分类
    - 自定义配置文件
- 多环境开发
- 日志

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/deploy/'" |
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

## Metrics

<table>
    <thead>
    <tr>
        <th>Actuator</th>
        <th>Custom Metrics</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/actuator/'" |
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
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/metrics/'" |
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

## 源码解析

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/src/'" |
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

## Container

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/container/'" |
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

- [lsieun/learn-java-spring](https://github.com/lsieun/learn-java-spring)
- [lsieun/learn-spring-boot](https://github.com/lsieun/learn-spring-boot)
- [lsieun/learn-spring-cloud](https://github.com/lsieun/learn-spring-cloud)

- [spring.io](https://spring.io/)
    - [Spring Initializer](https://start.spring.io/)
    - [Spring Framework Documentation](https://docs.spring.io/spring-framework/docs/current/reference/html/index.html)
        - [Overview](https://docs.spring.io/spring-framework/docs/current/reference/html/overview.html)
        - [Core](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html)
        - [Testing](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html)
        - [Data Access](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html)
        - [Web Servlet](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html)
        - [Web Reactive](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html)
        - [Integration](https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html)
        - [Languages](https://docs.spring.io/spring-framework/docs/current/reference/html/languages.html)
        - [Appendix](https://docs.spring.io/spring-framework/docs/current/reference/html/appendix.html)
        - [Wiki](https://github.com/spring-projects/spring-framework/wiki)
    - [Spring Boot Project](https://spring.io/projects/spring-boot/)
        - [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
        - [Spring Boot Core Features](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html)
    - [Spring Boot - Introduction](https://www.tutorialspoint.com/spring_boot/spring_boot_introduction.htm)
- [Spring Boot 框架入门教程（快速学习版）](http://c.biancheng.net/spring_boot/)

视频

- [SpringBoot2 全套视频教程](https://www.youtube.com/playlist?list=PLjwE8m3kyOlcrZHxQT_ACuDsdfr6hcOQD)
- [SpringBoot 最新教程 IDEA 版通俗易懂](https://www.bilibili.com/video/BV1PE411i7CV?p=20)
- [2022 年讲的最好的 Spring Boot 零基础教程](https://www.bilibili.com/video/BV1qY4y1e7Kr?p=2)
- [SpringBoot 源码解析](https://www.bilibili.com/video/BV1Mr4y1b72d)
- [黑马程序员 SpringBoot2 全套视频教程](https://www.bilibili.com/video/BV15b4y1a7yG)中 143~174 原理篇
- [2022 最新版 Spring 框架视频教程 - 手写 spring 从基础到高级 spring5 源码精讲](https://www.bilibili.com/video/BV1xS4y1D7Ub)
- [SpringBoot2核心技术与响应式编程](https://www.youtube.com/playlist?list=PLmOn9nNkQxJFKh2PMfWbGT7RVuMowsx-u)

源码讲解视频：

- [精通Spring_Boot_Cloud](https://www.youtube.com/playlist?list=PLSGSXGjRyTbYqL_tsaFvsyqc0sNDv4j2g)
  - [20 Spring Boot Loader源码分析及自定义类加载器作用分析](https://www.youtube.com/watch?v=e2W2yiiph2o&ab_channel=zengbo)

文章

- [Guide to Spring Type Conversions](https://www.baeldung.com/spring-type-conversions)
- [Spring Boot 中使用 Convert 接口实现类型转换器](https://blog.csdn.net/huangjhai/article/details/104214894)

Baeldung

- [Learn Spring Boot](https://www.baeldung.com/spring-boot)
    - [Spring Boot Without A Web Server](https://www.baeldung.com/spring-boot-no-web-server)
    - [Spring Boot Application as a Service](https://www.baeldung.com/spring-boot-app-as-a-service)
    - [Shutdown a Spring Boot Application](https://www.baeldung.com/spring-boot-shutdown)
    - [Spring Boot Exit Codes](https://www.baeldung.com/spring-boot-exit-codes)
    - [Intro to Spring Boot Starters](https://www.baeldung.com/spring-boot-starters)
    - [Configure a Spring Boot Web Application](https://www.baeldung.com/spring-boot-application-configuration)
    - [DispatcherServlet and web.xml in Spring Boot](https://www.baeldung.com/spring-boot-dispatcherservlet-web-xml)
    - [How to Configure Spring Boot Tomcat](https://www.baeldung.com/spring-boot-configure-tomcat)
    - [Spring 5 and Servlet 4 – The PushBuilder](https://www.baeldung.com/spring-5-push)
    - [Spring Boot 3 and Spring Framework 6.0 – What's New](https://www.baeldung.com/spring-boot-3-spring-6-new)

优秀的 Spring 学习网站

- [Reflectoring](https://reflectoring.io/)
- [dolszewski](http://dolszewski.com/category/spring/)
- [Spring Framework](https://memorynotfound.com/category/spring-framework/)

