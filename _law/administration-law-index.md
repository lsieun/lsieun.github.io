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
        <th style="text-align: center;">P1</th>
        <th style="text-align: center;">P2</th>
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

## 参考

- [中华人民共和国行政诉讼法](http://www.ahdhf.com/law/xz/3378.html)
