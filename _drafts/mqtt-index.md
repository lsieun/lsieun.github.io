---
title: "MQTT"
image: /assets/images/mqtt/what-is-mqtt.png
permalink: /mqtt.html
---

MQTT is one of the most commonly used protocols in IoT projects.
**MQTT (Message Queuing Telemetry Transport)** is a messaging protocol that works on top of the TCP/IP protocol.

## Basic

{%
assign filtered_posts = site.mqtt |
where_exp: "item", "item.url contains '/mqtt/basic/'" |
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

## Client

{%
assign filtered_posts = site.mqtt |
where_exp: "item", "item.url contains '/mqtt/client/'" |
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

### Java

{%
assign filtered_posts = site.mqtt |
where_exp: "item", "item.url contains '/mqtt/client/'" |
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

### Spring Boot

{%
assign filtered_posts = site.mqtt |
where_exp: "item", "item.url contains '/mqtt/client/'" |
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

### Websocket

{%
assign filtered_posts = site.mqtt |
where_exp: "item", "item.url contains '/mqtt/client/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 400 and num < 500 %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

## Server

{%
assign filtered_posts = site.mqtt |
where_exp: "item", "item.url contains '/mqtt/server/'" |
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

### Mosquitto

{%
assign filtered_posts = site.mqtt |
where_exp: "item", "item.url contains '/mqtt/server/'" |
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

### EMQX

{%
assign filtered_posts = site.mqtt |
where_exp: "item", "item.url contains '/mqtt/server/'" |
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

## Protocol

{%
assign filtered_posts = site.mqtt |
where_exp: "item", "item.url contains '/mqtt/format/'" |
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

{%
assign filtered_posts = site.mqtt |
where_exp: "item", "item.url contains '/mqtt/ref/'" |
sort: "sequence"
%}
<ul>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ul>

- [mica mqtt 组件](https://gitee.com/596392912/mica-mqtt) 基于 `t-io` 实现的低延迟、高性能的 `mqtt` 物联网组件。

