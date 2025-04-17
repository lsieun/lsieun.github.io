---
title: "行政法"
sequence: "xing-zheng-fa"
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
大家学习的第一步是
要意识到每个学科它自身的这个特点。
它的分值、它的难度、它的得分的难易程度，
它是靠理解的，是靠背诵的。

你再来开始学习，稳稳地制定一个
符合自己的学习规律的一个计划。
我刑法多少天听完？
我民法多少天听完？
有个这样的计划严格的来执行，
这个是我对大家的一个奉劝
```

```text
我微博上说想去南极
我妈看到了
我以为老太太会担心，会骂我
我妈说，孩子，去吧
我说，妈去趟南极花销很大的
要花15万呢
我妈说，钱可以挣
人生就应该多一点体验

我真觉得，我妈太好了
孩子们，真的每个人都是自己命运的主人
没有一种生活模式是最优的生活模式
最好的状态是活成你心目当中那个面貌

一个优秀的父母
其实是能够引导孩子
活成你心目当中那个
最美的面貌的那个父母

你如果光说，按我的走
你不能这样，不能那样
这个孩子有时候活得很没自信

但是，父母你引导的多了，做的多了
这孩子其实挺自信，也挺自由
而且我该努力的时候
我会对我的人生负责的
```

- 最终的结案
    - 诉讼
        - 裁定
        - 判决
        - 决定
    - 复议
        - 决定

## 笔记

<table>
    <thead>
    <tr>
        <th style="text-align: center;">行政实体法</th>
        <th style="text-align: center;">行政救济法</th>
        <th style="text-align: center;">总结</th>
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
        <td>
{%
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/administration/note/p3/'" |
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

- 《行政处罚法》，开始于 1996 年，最新修改于 2021 年
- 《行政许可法》，开始于 2003 年，最新修改于 2019 年
- 《行政强制法》，开始于 2011 年

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

梁慧星王利明之争

一本是梁慧星老师的民法总则 绿色封皮的
一本儿是蔡定剑先生的宪法精解

- [森林法](https://www.mee.gov.cn/ywgz/fgbz/fl/202106/t20210608_836755.shtml)
