---
title: "Java HttpClient"
sequence: "httpclient"
---

## Basic

{%
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/httpclient/basic/'" |
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

## API

{%
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/httpclient/api/'" |
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

## Request

### Header

{%
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/httpclient/request/header/'" |
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

### Body

{%
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/httpclient/request/payload/'" |
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

## Response

### Header

### Body

## Advanced

{%
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/httpclient/advanced/'" |
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

### Authentication

{%
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/httpclient/advanced/auth/'" |
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

### Async

{%
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/httpclient/advanced/async/'" |
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

- [Baeldung Tag: Java HttpClient](https://www.baeldung.com/tag/java-httpclient)
- [httpbin.org](https://httpbin.org)

