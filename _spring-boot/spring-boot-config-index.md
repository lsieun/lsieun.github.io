---
title: "Spring Boot Properties"
sequence: "101"
---

## Properties

### Basic

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/properties/config/basic/'" |
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

### YAML

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/properties/config/basic/'" |
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

### Core

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/properties/config/core/'" |
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

### Server

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/properties/config/server/'" |
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

### Web

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/properties/config/web/'" |
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

### Json

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/properties/config/json/'" |
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




