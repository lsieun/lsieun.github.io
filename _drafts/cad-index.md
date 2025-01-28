---
title: "AutoCAD"
image: /assets/images/cad/auto-cad-logo.png
permalink: /autocad.html
---

AutoCAD is computer-aided design (CAD) software
that is used for precise 2D and 3D drafting, design, and modeling with solids, surfaces, mesh objects,
documentation features, and more.

## 安装

<table>
    <thead>
    <tr>
        <th>安装</th>
        <th>启动</th>
        <th>用户界面</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.cad |
where_exp: "item", "item.url contains '/cad/installation/'" |
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
assign filtered_posts = site.cad |
where_exp: "item", "item.url contains '/cad/start/'" |
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
assign filtered_posts = site.cad |
where_exp: "item", "item.url contains '/cad/gui/'" |
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


## 概念

{%
assign filtered_posts = site.cad |
where_exp: "item", "item.url contains '/cad/concept/'" |
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

## CAD 操作

{%
assign filtered_posts = site.cad |
where_exp: "item", "item.url contains '/cad/cmd/'" |
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

视频：

- [CAD实用经验技巧分享](https://space.bilibili.com/1599274972/channel/collectiondetail?sid=1480903)

下载

- [AutoCAD 2024简体中文版](https://www.32r.com/soft/12322.html) 2.34G

