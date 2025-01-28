---
title: "ZooKeeper"
image: /assets/images/zookeeper/zookeeper-logo.png
permalink: /zookeeper.html
---

ZooKeeper is a centralized service for maintaining configuration information,
naming, providing distributed synchronization, and providing group services.

## Basic

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Installation</th>
        <th>Docker(Official)</th>
        <th>Docker(Bitnami)</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.zookeeper |
where_exp: "item", "item.url contains '/zookeeper/basic/'" |
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
assign filtered_posts = site.zookeeper |
where_exp: "item", "item.url contains '/zookeeper/installation/'" |
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
assign filtered_posts = site.zookeeper |
where_exp: "item", "item.url contains '/zookeeper/docker/official/'" |
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
assign filtered_posts = site.zookeeper |
where_exp: "item", "item.url contains '/zookeeper/docker/bitnami/'" |
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

## Advanced

<table>
    <thead>
    <tr>
        <th>Theory</th>
        <th>Usage</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.zookeeper |
where_exp: "item", "item.url contains '/zookeeper/theory/'" |
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
assign filtered_posts = site.zookeeper |
where_exp: "item", "item.url contains '/zookeeper/usage/'" |
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

## Client

<table>
    <thead>
    <tr>
        <th>Apache ZooKeeper</th>
        <th>Apache Curator</th>
        <th>ZkClient</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.zookeeper |
where_exp: "item", "item.url contains '/zookeeper/client/raw/'" |
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
assign filtered_posts = site.zookeeper |
where_exp: "item", "item.url contains '/zookeeper/client/curator/'" |
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
assign filtered_posts = site.zookeeper |
where_exp: "item", "item.url contains '/zookeeper/client/itec/'" |
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

## Reference

- [Apache ZooKeeper](https://zookeeper.apache.org/)

- [ZooKeeper 教程](https://www.bilibili.com/video/BV12Q4y1o7qE)
