---
title: "Nexus"
image: /assets/images/nexus3/nexus-repo.png
permalink: /nexus.html
---

Nexus is a repository manager.
It allows you to proxy, collect, and manage your dependencies
so that you are not constantly juggling a collection of JARs.
It makes it easy to distribute your software.
Internally, you configure your build to publish artifacts to Nexus,
and they then become available to other developers.
You get the benefits of having your own 'central', and there is no easier way to collaborate.

## Basic

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Installation</th>
        <th>Post Install</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.nexus |
where_exp: "item", "item.url contains '/nexus/basic/'" |
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
assign filtered_posts = site.nexus |
where_exp: "item", "item.url contains '/nexus/installation/'" |
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
assign filtered_posts = site.nexus |
where_exp: "item", "item.url contains '/nexus/post-install/'" |
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
assign filtered_posts = site.nexus |
where_exp: "item", "item.url contains '/nexus/config/'" |
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

## Repo

<table>
    <thead>
    <tr>
        <th>Repository</th>
        <th>Client</th>
        <th>Policy</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.nexus |
where_exp: "item", "item.url contains '/nexus/repo/'" |
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
assign filtered_posts = site.nexus |
where_exp: "item", "item.url contains '/nexus/client/'" |
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
assign filtered_posts = site.nexus |
where_exp: "item", "item.url contains '/nexus/policy/'" |
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

- ["Why Nexus?" for the Non-Programmer](https://blog.sonatype.com/2010/04/why-nexus-for-the-non-programmer/)

视频

- [基于 Jenkins 的 DevOps 工程实践](https://www.bilibili.com/video/BV11P4y1m7nG?p=33)

- [1. nexus 的安装](https://www.cnblogs.com/hahaha111122222/p/13098712.html)
- [2. 使用 nexus3 配置 docker 私有仓库](https://www.cnblogs.com/hahaha111122222/p/13099635.html)
- [3. 使用 nexus3 配置 maven 私有仓库](https://www.cnblogs.com/hahaha111122222/p/13099980.html)
- [4. maven 私服 nexus2 迁移到 nexus3](https://www.cnblogs.com/hahaha111122222/p/13100208.html)
- [5. 使用 nexus3 配置 npm 私有仓库](https://www.cnblogs.com/hahaha111122222/p/13100534.html)
- [6. 使用 nexus3 配置 yum 私有仓库](https://www.cnblogs.com/hahaha111122222/p/13100982.html)
- [7. nexus 版本升级](https://www.cnblogs.com/hahaha111122222/p/13101032.html)
- [8. maven 上传 jar 包以及 SNAPSHOT 的一个坑](https://www.cnblogs.com/hahaha111122222/p/13105009.html)
- [9. 使用 nexus3 配置 Python 私有仓库](https://www.cnblogs.com/hahaha111122222/p/13106771.html)
- [10.使用 nexus3 配置 golang 私有仓库](https://www.cnblogs.com/hahaha111122222/p/13129328.html)
