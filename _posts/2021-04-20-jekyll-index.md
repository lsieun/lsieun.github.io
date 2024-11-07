---
title: "Jekyll"
image: /assets/images/jekyll/jekyll-logo.png
permalink: /jekyll/jekyll-index.html
---

Jekyll Cheat Sheet

## 基础

<table>
    <thead>
    <tr>
        <th style="text-align: center;">介绍</th>
        <th style="text-align: center;">安装</th>
        <th style="text-align: center;">快速开始</th>
        <th style="text-align: center;">其它</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.jekyll |
where_exp: "item", "item.path contains 'jekyll/ch01/basic/'" |
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
assign filtered_posts = site.jekyll |
where_exp: "item", "item.path contains 'jekyll/ch01/installation/'" |
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
assign filtered_posts = site.jekyll |
where_exp: "item", "item.path contains 'jekyll/ch01/quick-start/'" |
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
assign filtered_posts = site.jekyll |
where_exp: "item", "item.path contains 'jekyll/ch01/other/'" |
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

## Liquid

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Liquid</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.jekyll |
where_exp: "item", "item.path contains 'jekyll/liquid/'" |
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

## 内容

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Front Matter</th>
        <th style="text-align: center;">Link</th>
        <th style="text-align: center;">Page</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.jekyll |
where_exp: "item", "item.path contains 'jekyll/content/front/'" |
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
assign filtered_posts = site.jekyll |
where_exp: "item", "item.path contains 'jekyll/content/link/'" |
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
assign filtered_posts = site.jekyll |
where_exp: "item", "item.path contains 'jekyll/content/page/'" |
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

## 使用技巧

<table>
    <thead>
    <tr>
        <th style="text-align: center;">技巧</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.jekyll |
where_exp: "item", "item.path contains 'jekyll/trick/'" |
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

- [Jekyll](https://jekyllrb.com/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [The GitHub Training Team: GitHub Pages](https://lab.github.com/githubtraining/github-pages)  
- [Jekyll Notes](http://stories.upthebuzzard.com/jekyll_notes/)

