---
title: "法律"
sequence: "102"
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

## 考试

```text
因与果：因上努力，果上随缘。
```

```text
当然，遗忘了，同学也不要心灰意冷
这个不是你的问题

法考本来就这样
最大的敌人是遗忘
最大的方法是重复对吧
谁也没有那个记忆力
说我听一遍课，我咔都能记住了
都是通过做题，重复背诵，来成长出来的
```

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">资料</th>
        <th style="text-align: center;">规划</th>
        <th style="text-align: center;">共同问题</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/examination/basic/'" |
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
where_exp: "item", "item.path contains 'law/examination/resource/'" |
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
where_exp: "item", "item.path contains 'law/examination/schedule/'" |
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
where_exp: "item", "item.path contains 'law/examination/scenario/'" |
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

![](/assets/images/law/exam/judicial-exam-score.jpg)

## 基础

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
where_exp: "item", "item.path contains 'law/basic/'" |
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

## 生活

- 警察权的原则：法无授权不可为
- 公民权的原则：法无禁止即可为

最有效的刑事辩护，一定是**技巧性的进攻**。

```text
“盖天下之事，不难于立法，而难于法之必行”
出自明代张居正的《请稽查章奏随事考成以修实政疏》。
```

### 公检法

<table>
    <thead>
    <tr>
        <th style="text-align: center;">看守所</th>
        <th style="text-align: center;">警察</th>
        <th style="text-align: center;">检察院</th>
        <th style="text-align: center;">法院</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/life/detention/'" |
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
where_exp: "item", "item.path contains 'law/life/police/'" |
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
where_exp: "item", "item.path contains 'law/life/procuratorate/'" |
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
where_exp: "item", "item.path contains 'law/life/court/'" |
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

### 律师和当事人

<table>
    <thead>
    <tr>
        <th style="text-align: center;">律师</th>
        <th style="text-align: center;">陷阱</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/life/lawyer/'" |
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
where_exp: "item", "item.path contains 'law/life/trap/'" |
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

### 控告

```text
在法律之外，
还有一个更狠、更公平的东西叫
因果!
```

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">对象</th>
        <th style="text-align: center;">到哪儿</th>
        <th style="text-align: center;">模板</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/life/report/general/'" |
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
where_exp: "item", "item.path contains 'law/life/report/obj/'" |
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
where_exp: "item", "item.path contains 'law/life/report/to/'" |
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
where_exp: "item", "item.path contains 'law/life/report/template/'" |
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



```text
《权力的边界》是中国政法大学行政法学赵宏教授的法律随笔，
以近年的时事新闻引入，普及公权与私权的界限。
"对个人而言，法无禁止即可为；对公权而言，法无授权即禁止。" 
法律说到底，真正关心的是每个人的自由与权利。
行政法作为"小刑法"，与公民生活息息相关，
权力的边界，就是个人自由的边界。

中国政法大学赵宏教授，法律随笔集，
法律真正关心的是每个人的自由与权利。
```

## 微博

- [微博：刑法柏浪涛](https://weibo.com/bltxf)
- [微博：左宁刑诉](https://weibo.com/u/3153511812)
- [微博：行政法李佳](https://weibo.com/u/1552849431)
- [微博：民商法孟献贵](https://weibo.com/u/2342740757)
- [微博：民法钟秀勇](https://www.weibo.com/u/1313315380)

## 写作

- [公文写作规范及相关知识](https://www.chinacourt.org/article/detail/2006/04/id/202451.shtml)

```text
字体：仿宋GB2312

第一层用“一、”“二、”“三、”……
第二层用“（一）”“（二）”“（三）”……
第三层用“1、”“2、”“3、”……
第四层用“（1）”“（2）”“（3）”……

公文的字体大小要求如下：
正文中一般采用小四号或五号宋体，即12或10.5磅。
正文中的标题一般采用小二号或三号黑体，即16或15磅。
抬头中一般采用二号黑体，即22磅。
落款一般采用小五号或六号宋体，即10.5或9磅。
页码一般从正文开始标注，放在页面底端居中的位置。
```
