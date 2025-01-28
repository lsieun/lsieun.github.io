---
title: "Spring Boot Web"
sequence: "101"
---


## Basic

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/web/basic/'" |
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

## RESTful

REST (Representational State Transfer)，表现形式状态转换

### REST Server



### REST Client

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/web-restful/rest-template/'" |
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

### REST API

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/web-restful/api/'" |
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

## Web Config

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/web-config/'" |
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

## Web Parameter

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/web-parameter/'" |
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

## Web Response

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/web-response/'" |
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

## Advice

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/web-advice/'" |
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

## 请求参数验证 Request Validation

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/web-validation/'" |
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

## Response - JSON

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/web-json/'" |
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

## Response - 模板引擎

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/web-template-engine/'" |
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

## Response - 静态资源

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/web/static-resource/'" |
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

## 上传和下载文件

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/web-file/'" |
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

## Doc: Swagger, OpenAPI

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/web-doc/'" |
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

## Dev: 热部署 Hot Swap

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/web-dev/'" |
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

## Web Server

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/web-server/'" |
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

## 其它

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/web/other/'" |
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

