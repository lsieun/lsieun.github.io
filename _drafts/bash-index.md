---
title: "Bash Script"
image: /assets/images/bash/bash-cover.jpg
permalink: /bash.html
---

A Bash script is a plain text file which contains a series of commands.
Anything you can run normally on the command line can be put into a script, and it will do exactly the same thing.

需要考虑的问题：

- （1） 权限：执行 shell script 是否需要 root 权限
- （2） 目录：`cd /var/log || { echo "change directory fail"}` 切换目录可能会执行失败


Sometimes, you come across a command line tool that offers limited functionality on its own, but when used with other tools, you realize its actual potential.(例如，`seq` 命令)



## Basic

<table>
    <thead>
    <tr>
        <th>Basic</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bash |
where_exp: "item", "item.url contains '/bash/basic/'" |
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

## Grammar

<table>
    <thead>
    <tr>
        <th>Variable</th>
        <th>Type</th>
        <th>Jump</th>
        <th>Function</th>
        <th>IO</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bash |
where_exp: "item", "item.url contains '/bash/grammar/variable/'" |
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
assign filtered_posts = site.bash |
where_exp: "item", "item.url contains '/bash/grammar/type/'" |
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
assign filtered_posts = site.bash |
where_exp: "item", "item.url contains '/bash/grammar/jump/'" |
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
assign filtered_posts = site.bash |
where_exp: "item", "item.url contains '/bash/grammar/func/'" |
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
assign filtered_posts = site.bash |
where_exp: "item", "item.url contains '/bash/grammar/io/'" |
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

## Utility

{%
assign filtered_posts = site.bash |
where_exp: "item", "item.url contains '/bash/func/'" |
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

## Redirection

{%
assign filtered_posts = site.bash |
where_exp: "item", "item.url contains '/bash/redirect/'" |
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

## Regular Expressions

{%
assign filtered_posts = site.bash |
where_exp: "item", "item.url contains '/bash/regex/'" |
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

<table>
    <thead>
    <tr>
        <th>sudo</th>
        <th>user</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bash |
where_exp: "item", "item.url contains '/bash/privilege/sudo/'" |
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
assign filtered_posts = site.bash |
where_exp: "item", "item.url contains '/bash/privilege/user/'" |
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

## Script

{%
assign filtered_posts = site.bash |
where_exp: "item", "item.url contains '/bash/script/'" |
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

- [Shell脚本学习](https://www.bilibili.com/video/BV11K4y1A7LM/)
- [CentOS7 系统服务器初始化配置、安全加固、内核升级优化常用软件安装的Shell脚本分享](https://www.bilibili.com/read/cv13875630/)

