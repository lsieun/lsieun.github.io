---
title: "Git"
image: /assets/images/git/git-vs-github.png
permalink: /git/git-index.html
---


Git is software for tracking changes in any set of files,
usually used for coordinating work among programmers collaboratively developing source code during software development.

Git is fundamentally a content-addressable filesystem with a VCS user interface written on top of it.

| User Name   | Email                | Role      |
|-------------|----------------------|-----------|
| Jerry Mouse | jerry@example.com    | Author    |
| Tom Cat     | tom@example.com      | Committer |
| Zhang San   | zhangsan@example.com | Author    |
| Li Si       | lisi@example.com     | Committer |

```text
命令：porcelain plumbing
--------
配置：~/.gitconfig, .git/config
--------
文件格式：git object, index
```

```text
git reset --soft HEAD^
```

## 日常任务

<table>
    <thead>
    <tr>
        <th>Config</th>
        <th>Commit</th>
        <th>Branch</th>
        <th>Repo</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.git |
where_exp: "item", "item.path contains 'git/daily/config/'" |
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
assign filtered_posts = site.git |
where_exp: "item", "item.path contains 'git/daily/commit/'" |
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
assign filtered_posts = site.git |
where_exp: "item", "item.path contains 'git/daily/branch/'" |
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
assign filtered_posts = site.git |
where_exp: "item", "item.path contains 'git/daily/repo/'" |
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

<table>
    <thead>
    <tr>
        <th style="text-align: center;">基础</th>
        <th style="text-align: center;">HEAD</th>
        <th style="text-align: center;">其它</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.git |
where_exp: "item", "item.path contains 'git/concept/basic/'" |
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
assign filtered_posts = site.git |
where_exp: "item", "item.path contains 'git/concept/head/'" |
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
assign filtered_posts = site.git |
where_exp: "item", "item.path contains 'git/concept/other/'" |
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



## Command

### Basic

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">对比</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.git |
where_exp: "item", "item.path contains 'git/cmd/basic/basic/'" |
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
assign filtered_posts = site.git |
where_exp: "item", "item.path contains 'git/cmd/basic/vs/'" |
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

### Workdir + Index + Commit

<table>
    <thead>
    <tr>
        <th>Working Directory</th>
        <th>Index</th>
        <th>Commit</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.git |
where_exp: "item", "item.path contains 'git/cmd/workdir/'" |
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
assign filtered_posts = site.git |
where_exp: "item", "item.path contains 'git/cmd/index/'" |
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
assign filtered_posts = site.git |
where_exp: "item", "item.path contains 'git/cmd/commit/'" |
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

### Branch + Repo

<table>
    <thead>
    <tr>
        <th>Branch</th>
        <th>Repository</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.git |
where_exp: "item", "item.path contains 'git/cmd/branch/'" |
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
assign filtered_posts = site.git |
where_exp: "item", "item.path contains 'git/cmd/repo/'" |
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

## Configuration

{%
assign filtered_posts = site.git |
where_exp: "item", "item.path contains 'git/config/'" |
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

## Github

{%
assign filtered_posts = site.git |
where_exp: "item", "item.path contains 'git/github/'" |
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

## Host

{%
assign filtered_posts = site.git |
where_exp: "item", "item.path contains 'git/host/'" |
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

## plumbing

<table>
    <thead>
    <tr>
        <th style="text-align: center;" rowspan="2">Refs</th>
        <th style="text-align: center;" rowspan="2">Index Area</th>
        <th style="text-align: center;" colspan="3">Object Store</th>
    </tr>
    <tr>
        <th style="text-align: center;">Common</th>
        <th style="text-align: center;">Tree</th>
        <th style="text-align: center;">Blob</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.git |
where_exp: "item", "item.path contains 'git/plumbing/ref/'" |
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
assign filtered_posts = site.git |
where_exp: "item", "item.path contains 'git/plumbing/index/'" |
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
assign filtered_posts = site.git |
where_exp: "item", "item.path contains 'git/plumbing/obj/common/'" |
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
assign filtered_posts = site.git |
where_exp: "item", "item.path contains 'git/plumbing/obj/tree/'" |
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
assign filtered_posts = site.git |
where_exp: "item", "item.path contains 'git/plumbing/obj/blob/'" |
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



## Git Internals

Git Objects [lsieun/lsieun-git][lsieun-git]

{%
assign filtered_posts = site.git |
where_exp: "item", "item.path contains 'git/git-objects/'" |
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


## References

Doc

- [Reference](https://git-scm.com/docs): 各种命令

Ebook: 电子书

- [Ebook: Pro Git book](http://git-scm.com/book/en/v2)
- [The Git Community Book](https://shafiul.github.io//gitbook/index.html)
- Git In Practice
- Version Control with Git, 2nd Edition

Blog: 关于某一主题的系列文章，可能是不连贯的

- [AlBlue's Blog](https://alblue.bandlem.com/Tag/git/)
- [Reimplementing "git clone" in Haskell from the bottom up](https://stefan.saasen.me/articles/git-clone-in-haskell-from-the-bottom-up/)

Tutorial: 连贯且系统的教程

- [Git 大全](https://gitee.com/all-about-git)
- [Git Magic](http://www-cs-students.stanford.edu/~blynn/gitmagic/pr01.html)
- [30 天精通 Git 版本控管](https://github.com/doggy8088/Learn-Git-in-30-days)
- [Github: cirosantilli/git-tutorial](https://github.com/cirosantilli/git-tutorial)

Tools

- [GitHub Desktop](https://desktop.github.com/)

- [Shields IO](https://shields.io/)

[lsieun-git]: https://github.com/lsieun/lsieun-git

- [10 Must Know Git Commands That Almost Nobody Knows](https://blog.webdevsimplified.com/2021-10/advanced-git-commands/)

