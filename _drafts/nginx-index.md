---
title: "Nginx"
image: /assets/images/nginx/nginx.svg
permalink: /nginx.html
---

NGINX, pronounced as "engine-ex," is a famous open source web server software.

## Basic

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Installation(Linux)</th>
        <th>Installation(Win)</th>
        <th>Command</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.nginx |
where_exp: "item", "item.url contains '/nginx/basic/'" |
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
assign filtered_posts = site.nginx |
where_exp: "item", "item.url contains '/nginx/installation/linux/'" |
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
assign filtered_posts = site.nginx |
where_exp: "item", "item.url contains '/nginx/installation/win/'" |
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
assign filtered_posts = site.nginx |
where_exp: "item", "item.url contains '/nginx/cmd/'" |
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


## Config

{%
assign filtered_posts = site.nginx |
where_exp: "item", "item.url contains '/nginx/config/'" |
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



## Proxy

{%
assign filtered_posts = site.nginx |
where_exp: "item", "item.url contains '/nginx/proxy/'" |
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

## 常见问题

{%
assign filtered_posts = site.nginx |
where_exp: "item", "item.url contains '/nginx/problems/'" |
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

- [nginx.org](https://nginx.org/)
    - [nginx: download](https://nginx.org/en/download.html)
    - [nginx documentation](https://nginx.org/en/docs/)

Bilibili:

- [Nginx 教程 - 黑马](https://www.bilibili.com/video/BV1ov41187bq/)
- [2023 年最新版 Nginx 教程](https://www.bilibili.com/video/BV1nN411A7NV/)
- [尚硅谷 2022 版 Nginx 教程（亿级流量 nginx 架构设计）](https://www.bilibili.com/video/BV1yS4y1N76R) 23 个小时
- [尚硅谷 Nginx 教程由浅入深](https://www.bilibili.com/video/BV1zJ411w7SV)

YouTube:

- [Nginx 核心知識](https://www.youtube.com/playlist?list=PLoZQ0sz6CBHGG1qoq-tISRs9tKCLwCyMu)


- [Nginx 服务器性能优化与安全配置实践指南](https://www.cnblogs.com/hahaha111122222/p/16453714.html)
- [Nginx 相关模块学习使用实践指南](https://www.cnblogs.com/hahaha111122222/p/16453661.html)
- [Nginx 反代服务器进阶学习最佳配置实践指南](https://www.cnblogs.com/hahaha111122222/p/16453638.html)
- [Nginx 反代服务器基础配置实践案例](https://www.cnblogs.com/hahaha111122222/p/16453564.html)
- [HTTPS 安全加固配置最佳实践指南](https://www.cnblogs.com/hahaha111122222/p/16453508.html)
- [nginx 反向代理单独的 java 项目配置示例](https://www.cnblogs.com/hahaha111122222/p/16445166.html)

Baeldung

- [Using Nginx as a Forward Proxy](https://www.baeldung.com/nginx-forward-proxy)