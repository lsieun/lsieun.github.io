---
title: "行政法"
sequence: "xing-zheng-fa"
---

[UP](/law/law-index.html)

- [主页]({% link _law/law-home.md %})
- [刑法]({% link _law/criminal-law-index.md %})
- [刑诉法]({% link _law/criminal-procedure-law-index.md %})
- [民法]({% link _law/civil-law-index.md %})
- [行政法]({% link _law/administration-law-index.md %})

```text
大家学习的第一步是要意识到每个学科它自身的这个特点。
它的分值、它的难度、它的得分的易得程度，
它是靠理解的，是靠背诵的。

你再来开始学习，稳稳地制定一个符合自己的学习规律的一个计划。
我刑法多少天听完？我民法多少天听完？
有个这样的计划严格的来执行，
这个是我对大家的一个奉劝
```

## 笔记

<table>
    <thead>
    <tr>
        <th style="text-align: center;">行政实体法</th>
        <th style="text-align: center;">行政救济法</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/administration/note/p1/'" |
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
where_exp: "item", "item.path contains 'law/administration/note/p2/'" |
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

## 总结

<table>
    <thead>
    <tr>
        <th style="text-align: center;">行政实体法</th>
        <th style="text-align: center;">行政诉讼法</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/administration/summary/p1/'" |
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
where_exp: "item", "item.path contains 'law/administration/summary/p2/'" |
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

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/administration/article/'" |
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

- [行政诉讼法](http://www.ahdhf.com/law/xz/3378.html)
- [行政诉讼法司法解释](http://gongbao.court.gov.cn/Details/ff963094d7a6d678980d4972b5961e.html)

- [行政许可法](http://www.npc.gov.cn/npc/c2/c30834/201906/t20190608_298033.html)
- [行政处罚法](http://www.npc.gov.cn/c2/c30834/202101/t20210122_309857.html)
- [治安管理处罚法](https://www.gov.cn/ziliao/flfg/2005-08/29/content_27130.htm)
- [行政强制法](https://www.gov.cn/flfg/2011-07/01/content_1897308.htm)
- [行政复议法](https://www.gov.cn/yaowen/liebiao/202309/content_6901584.htm)
- [行政协议司法解释](http://www.npc.gov.cn/c2/c30834/201912/t20191210_303149.html)

案例

- [老农卖芹菜赚14元罚10万](https://www.thepaper.cn/newsDetail_forward_23530436)

梁慧星王利明之争

一本是梁慧星老师的民法总则 绿色封皮的
一本儿是蔡定剑先生的宪法精解
