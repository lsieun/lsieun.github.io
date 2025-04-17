---
title: "刑诉法"
sequence: "103"
---

[UP](/law/law-home.html)

- [主页]({% link _law/law-home.md %})
- [刑法]({% link _law/criminal-law-index.md %})
- [刑诉法]({% link _law/criminal-procedure-law-index.md %})
- [民法]({% link _law/civil-law-index.md %})
- [民诉法]({% link _law/civil-procedure-law-index.md %})
- [行政法]({% link _law/administration-law-index.md %})
- [法律法规]({% link _law/law-ref-index.md %})
- [法律案例]({% link _law/law-case-index.md %})

```text
『判决』和『裁定』的区别

『判决』是解决『实体』『问题』
就是『定罪』『量刑』是叫『判决』

而『裁定』是解决『程序』『问题』
比如说『裁定』『中止』『审理』
```

```text
在『一审』『专题』最后一个『知识点』
就是区分『判决』『裁定』和『决定』

我们说这个『判决』
它是只解决『实体』『问题』，就是『定罪』量型

『裁定』主要解决『程序』『问题』
比如说『裁定』『中止审理』
『裁定』按『撤诉』『处理』等等的
但是也解决一点点『实体』『问题』
就是这儿『执行阶段』
『裁定』『减刑』和『裁定』『假释』
它是用『裁定』的
不是『判决』也不是『决定』
『注意即可』
```

## 考试

<table>
    <thead>
    <tr>
        <th style="text-align: center;">P1</th>
        <th style="text-align: center;">P2</th>
        <th style="text-align: center;">P3</th>
        <th style="text-align: center;">P4</th>
        <th style="text-align: center;">总结</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/criminalp/note/p1/'" |
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
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/criminalp/note/p2/'" |
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
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/criminalp/note/p3/'" |
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
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/criminalp/note/p4/'" |
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
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/criminalp/note/summary/'" |
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

## 视频内容

<table>
    <thead>
    <tr>
        <th style="text-align: center;">P1</th>
        <th style="text-align: center;">P2</th>
        <th style="text-align: center;">P3</th>
        <th style="text-align: center;">P4</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/criminalp/video/p1/'" |
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
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/criminalp/video/p2/'" |
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
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/criminalp/video/p3/'" |
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
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/criminalp/video/p4/'" |
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

## 法条

- [刑事诉讼法](http://www.npc.gov.cn/npc/c2/c12435/201905/t20190521_276591.html)
- [公安部规定（公安机关办理刑事案件程序规定）](https://www.gov.cn/zhengce/2021-12/25/content_5712867.htm)
- [高检规则（人民检察院刑事诉讼规则）](https://www.spp.gov.cn/spp/xwfbh/wsfbh/201912/t20191230_451490.shtml)
- [刑诉解释（最高法关于适用《刑事诉讼法》的解释）](https://www.court.gov.cn/fabu/xiangqing/286491.html)

<table>
    <thead>
    <tr>
        <th style="text-align: center;">刑诉法</th>
        <th style="text-align: center;">侦查阶段</th>
        <th style="text-align: center;">起诉阶段</th>
        <th style="text-align: center;">审判阶段</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/criminalp/article/raw/'" |
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
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/criminalp/article/investigate/'" |
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
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/criminalp/article/prosecute/'" |
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
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/criminalp/article/judge/'" |
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

## 参考

- [左宁刑诉](https://space.bilibili.com/1631268420)
    - [2024左宁刑诉通关口诀](https://space.bilibili.com/1631268420/lists/2518861?type=season)
- [2025年法考客观题【精讲卷】刑诉法 众合左宁](https://www.bilibili.com/video/BV14jrrYBExd/)

