---
title: "VMWare Workstation"
image: /assets/images/vmware/vmware-cover.jpg
permalink: /vmware.html
---

VMware Workstation supports bridging existing host network adapters and
sharing physical disk drives and USB devices with a virtual machine.

## Basic

{%
assign filtered_posts = site.vmware |
where_exp: "item", "item.url contains '/vmware/basic/'" |
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
assign filtered_posts = site.vmware |
where_exp: "item", "item.url contains '/vmware/network/'" |
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

## OS

<table>
    <thead>
    <tr>
        <th>Linux</th>
        <th>Windows</th>
        <th>Other</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.vmware |
where_exp: "item", "item.url contains '/vmware/linux/'" |
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
assign filtered_posts = site.vmware |
where_exp: "item", "item.url contains '/vmware/win/'" |
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
assign filtered_posts = site.vmware |
where_exp: "item", "item.url contains '/vmware/other/'" |
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

- [VMWareWorkstation 15.5 的使用](https://edu.51cto.com/course/19913.html)
