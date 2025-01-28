---
title: "CentOS"
image: /assets/images/centos/centos-stream-relationship-to-rhel.png
permalink: /centos.html
---

CentOS Linux. Consistent, manageable platform that suits a wide variety of deployments.

## Installation

{%
assign filtered_posts = site.centos |
where_exp: "item", "item.url contains '/centos/installation/'" |
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

## Network

{%
assign filtered_posts = site.centos |
where_exp: "item", "item.url contains '/centos/network/'" |
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

## Privilege

{%
assign filtered_posts = site.centos |
where_exp: "item", "item.url contains '/centos/privilege/'" |
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

## Software

{%
assign filtered_posts = site.centos |
where_exp: "item", "item.url contains '/centos/software/'" |
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

## Kernel

<table>
    <thead>
    <tr>
        <th>内核升级</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.centos |
where_exp: "item", "item.url contains '/centos/kernel/update/'" |
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

- [CentOS7 系统服务器初始化配置、安全加固、内核升级优化常用软件安装的 Shell 脚本分享](https://www.cnblogs.com/hahaha111122222/p/16445319.html)
