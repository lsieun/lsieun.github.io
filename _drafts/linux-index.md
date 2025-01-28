---
title: "Linux"
image: /assets/images/linux/linux-cover2.png
permalink: /linux.html
---

Linux is a family of open-source Unix-like operating systems based on the Linux kernel,
an operating system kernel first released on September 17, 1991, by Linus Torvalds.

## Basic

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Concept</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.linux |
where_exp: "item", "item.url contains '/linux/basic/'" |
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
assign filtered_posts = site.linux |
where_exp: "item", "item.url contains '/linux/concept/'" |
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

## File System

<table>
    <thead>
    <tr>
        <th>Directory</th>
        <th>Disk</th>
        <th>Archive</th>
        <th>Text</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.linux |
where_exp: "item", "item.url contains '/linux/filesystem/directory/'" |
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
assign filtered_posts = site.linux |
where_exp: "item", "item.url contains '/linux/filesystem/disk/'" |
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
assign filtered_posts = site.linux |
where_exp: "item", "item.url contains '/linux/filesystem/archive/'" |
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
assign filtered_posts = site.linux |
where_exp: "item", "item.url contains '/linux/filesystem/text/'" |
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

## Bash

{%
assign filtered_posts = site.linux |
where_exp: "item", "item.url contains '/linux/bash/'" |
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

<table>
    <thead>
    <tr>
        <th>Host</th>
        <th>Http</th>
        <th>Tool</th>
        <th>Transfer</th>
        <th>Security</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.linux |
where_exp: "item", "item.url contains '/linux/network/cmd/host/'" |
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
assign filtered_posts = site.linux |
where_exp: "item", "item.url contains '/linux/network/cmd/http/'" |
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
assign filtered_posts = site.linux |
where_exp: "item", "item.url contains '/linux/network/cmd/tool/'" |
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
assign filtered_posts = site.linux |
where_exp: "item", "item.url contains '/linux/network/cmd/transfer/'" |
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
assign filtered_posts = site.linux |
where_exp: "item", "item.url contains '/linux/network/cmd/security/'" |
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

---

<table>
    <thead>
    <tr>
        <th>集群</th>
        <th>配置</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.linux |
where_exp: "item", "item.url contains '/linux/network/cluster/'" |
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
assign filtered_posts = site.linux |
where_exp: "item", "item.url contains '/linux/network/conf/'" |
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

## OS

{%
assign filtered_posts = site.linux |
where_exp: "item", "item.url contains '/linux/os/'" |
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

## Process

{%
assign filtered_posts = site.linux |
where_exp: "item", "item.url contains '/linux/process/'" |
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

## shell-builtin

{%
assign filtered_posts = site.linux |
where_exp: "item", "item.url contains '/linux/shell-builtin/'" |
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

## System

{%
assign filtered_posts = site.linux |
where_exp: "item", "item.url contains '/linux/system/'" |
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

## Terminal

{%
assign filtered_posts = site.linux |
where_exp: "item", "item.url contains '/linux/terminal/'" |
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
        <th>User</th>
        <th>Group</th>
        <th>Permission</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.linux |
where_exp: "item", "item.url contains '/linux/privilege/user/'" |
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
assign filtered_posts = site.linux |
where_exp: "item", "item.url contains '/linux/privilege/group/'" |
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
assign filtered_posts = site.linux |
where_exp: "item", "item.url contains '/linux/privilege/permission/'" |
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

## Encoding

{%
assign filtered_posts = site.linux |
where_exp: "item", "item.url contains '/linux/encoding/'" |
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



In the simplest terms, a **shell script** is a file containing a series of commands.
**The shell** reads this file and carries out the commands
as though they have been entered directly on the command line.

## Reference

- [Advanced Bash-Scripting Guide](http://tldp.org/LDP/abs/html/index.html)
- [Computer Science from the Bottom Up](http://www.bottomupcs.com/index.xhtml)
- [Linux Shell Scripting Tutorial (LSST) v2.0](https://bash.cyberciti.biz/guide/Main_Page)
- [The Art of Unix Programming](http://www.catb.org/~esr/writings/taoup/html/index.html)
- [BashGuide](http://mywiki.wooledge.org/BashGuide)
- [Bash Pitfalls](http://mywiki.wooledge.org/BashPitfalls)
- [Linux Tricks](https://www.tecmint.com/tag/linux-tricks/)
    - [5 Useful Commands to Manage File Types and System Time in Linux – Part 3](https://www.tecmint.com/manage-file-types-and-set-system-time-in-linux/)


- [Linux Process Management](https://www.educba.com/linux-process-management/)

- [《Linux性能优化实战》学习笔记 Day03](https://developer.aliyun.com/article/1253004)

