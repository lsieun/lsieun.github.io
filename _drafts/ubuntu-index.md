---
title: "Ubuntu"
image: /assets/images/ubuntu/ubuntu-logo.png
permalink: /ubuntu.html
---

Ubuntu is a Linux distribution based on Debian and composed mostly of free and open-source software.

## Network

{%
assign filtered_posts = site.ubuntu |
where_exp: "item", "item.url contains '/ubuntu/network/'" |
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

{%
assign filtered_posts = site.ubuntu |
where_exp: "item", "item.url contains '/ubuntu/repo/'" |
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

- [阿里开源镜像站](https://developer.aliyun.com/mirror/)
    - [Ubuntu 镜像](https://developer.aliyun.com/mirror/ubuntu)
- [中国科学技术大学开源软件镜像](https://mirrors.ustc.edu.cn/ubuntu-releases/)
- [ubuntu](https://mirrors.ustc.edu.cn/ubuntu/)
- [Ubuntu Downloads](https://ubuntu.com/download/server)
