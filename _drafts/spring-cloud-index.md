---
title: "Spring Cloud"
image: /assets/images/spring-cloud/spring-cloud-cover.png
permalink: /spring-cloud.html
---

Spring Cloud provides tools for developers to quickly build some common patterns in distributed systems
(e.g. configuration management, service discovery, circuit breakers, intelligent routing, micro-proxy,
control bus, one-time tokens, global locks, leadership election, distributed sessions, cluster state).

## Overview

{%
assign filtered_posts = site.spring-cloud |
where_exp: "item", "item.url contains '/spring-cloud/overview/'" |
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
assign filtered_posts = site.spring-cloud |
where_exp: "item", "item.url contains '/spring-cloud/config/'" |
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

## Nacos

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Configuration</th>
        <th>服务注册和发现</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.spring-cloud |
where_exp: "item", "item.url contains '/spring-cloud/nacos/basic/'" |
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
assign filtered_posts = site.spring-cloud |
where_exp: "item", "item.url contains '/spring-cloud/nacos/config/'" |
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
assign filtered_posts = site.spring-cloud |
where_exp: "item", "item.url contains '/spring-cloud/nacos/service/'" |
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


## 服务调用

### OpenFeign

{%
assign filtered_posts = site.spring-cloud |
where_exp: "item", "item.url contains '/spring-cloud/open-feign/'" |
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

## Gateway

{%
assign filtered_posts = site.spring-cloud |
where_exp: "item", "item.url contains '/spring-cloud/gateway/'" |
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

- [【2022 最新】目前 B 站最详细的 Nacos 从入门到高级全套教程](https://www.bilibili.com/video/BV1j14y147Vp?p=6)
- [B 站讲的最好的 Spring Cloud Alibaba 教程全集（2022 最新版）](https://www.bilibili.com/video/BV1pF41147Aa/)


- [Spring][spring]
- [Spring Boot][spring-boot]
- [Spring Cloud][spring-cloud]
  - [Spring Cloud Alibaba][spring-cloud-alibaba]: [Doc][spring-cloud-alibaba-doc]
    - Nacos: [英文][spring-cloud-alibaba-doc-en], [中文][spring-cloud-alibaba-doc-zh]
  - [Spring Cloud Gateway][spring-cloud-gateway]: [Doc][spring-cloud-gateway-doc]
  - [Spring Cloud OpenFeign][spring-cloud-openfeign]: [Doc][spring-cloud-openfeign-doc]


[spring]: https://spring.io/
[spring-boot]: https://spring.io/projects/spring-boot
[spring-cloud]: https://spring.io/projects/spring-cloud
[spring-cloud-alibaba]: https://spring.io/projects/spring-cloud-alibaba
[spring-cloud-alibaba-doc]: https://spring-cloud-alibaba-group.github.io/github-pages/2021/en-us/index.html
[spring-cloud-alibaba-doc-en]: https://nacos.io/en-us/index.html
[spring-cloud-alibaba-doc-zh]: https://nacos.io/zh-cn/index.html
[spring-cloud-gateway]: https://spring.io/projects/spring-cloud-gateway
[spring-cloud-gateway-doc]: https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/
[spring-cloud-openfeign]: https://spring.io/projects/spring-cloud-openfeign
[spring-cloud-openfeign-doc]: https://docs.spring.io/spring-cloud-openfeign/docs/current/reference/html/

