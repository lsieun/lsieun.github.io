---
title: "Java Network"
image: /assets/images/java/network/java-client-server-request-response.png
permalink: /java-network.html
---

Network

<IMG
SRC="data:image/gif;base64,R0lGODdhMAAwAPAAAAAAAP///ywAAAAAMAAw
AAAC8IyPqcvt3wCcDkiLc7C0qwyGHhSWpjQu5yqmCYsapyuvUUlvONmOZtfzgFz
ByTB10QgxOR0TqBQejhRNzOfkVJ+5YiUqrXF5Y5lKh/DeuNcP5yLWGsEbtLiOSp
a/TPg7JpJHxyendzWTBfX0cxOnKPjgBzi4diinWGdkF8kjdfnycQZXZeYGejmJl
ZeGl9i2icVqaNVailT6F5iJ90m6mvuTS4OK05M0vDk0Q4XUtwvKOzrcd3iq9uis
F81M1OIcR7lEewwcLp7tuNNkM3uNna3F2JQFo97Vriy/Xl4/f1cf5VWzXyym7PH
hhx4dbgYKAAA7"
ALT="Larry">

## IP

{%
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/network/ip/'" |
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

## Socket

### Socket Common

{%
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/network/socket/'" |
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

### Socket Client

{%
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/network/socket-client/'" |
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

### Socket Server

{%
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/network/socket-server/'" |
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

## URL

{%
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/network/url/'" |
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

## Connection

{%
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/network/connection/'" |
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

## Data

{%
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/network/data/'" |
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

## Security

{%
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/network/security/'" |
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
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/network/proxy/'" |
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
where_exp: "item", "item.url contains '/java-theme/network/api/'" |
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

- [Github: learn-java-network](https://github.com/lsieun/learn-java-network)

书籍

- 《Advanced Java Programming》第 12,13 章

EBook

- [Learning Network Programming with Java]()
- [Java Network Programming, Fourth Edition]()

- [Network Next](https://www.networknext.com/)
- [Nxt](https://www.jelurida.com/nxt)
- [t-io 文档](https://www.tiocloud.com/doc/tio/85)
