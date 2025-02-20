---
title: "法律"
image: /assets/images/law/law-cover.jpeg
permalink: /law/law-index.html
---

用良知驾驭我们之所学，而不因所学蒙蔽了良知。
格拉底说，承认自己的无知乃是开启智慧的大门。

![](/assets/images/law/合格的法律人.svg)

```text
法律越完善，（坏人的）人性越复杂
```

```text
兩個翅膀
一個是正確的價值觀
一個是精湛的方法論
```

```text
我们研究刑法，适用刑法啊
一定要有悲天悯人的情怀
一定要体察民间疾苦
不能高高在上机械、冷血地去适用刑法
```

```text
行政法和刑法有个区别

行政法它是要保护一些行政法的一些制度是吧
这个制度那个制度

但是我们刑法就要追问这个制度本身
它又是为了保护什么
我们刑法不会为保护制度而保护制度
```

```text
刑法和民法的区别

刑法当中经常强调法益
民法当中也是要强调一种秩序
```

```text
想不清楚某个法律问题（制度、权利）时，
就想里面涉及的哪几方，
这个制度和权利对谁是有利的，
因为这里面涉及的利益的均衡
```

- 法律体系
    - 宪法
    - 民商法
    - 行政法
    - 经济法
    - 社会法
    - [刑法]({% link _law/criminal-law-index.md %})
    - 程序法

- [刑法]({% link _law/criminal-law-index.md %})
- [民法]({% link _law/civil-law-index.md %})
- [刑诉法]({% link _law/criminal-procedure-law-index.md %})

## 考试

```text
因与果：因上努力，果上随缘。
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

## 刑诉法

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
where_exp: "item", "item.path contains 'law/criminal-procedural-law/overview/'" |
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

## 参考

- [中国刑事辩护网](http://www.chnlawyer.net/)

- [高效学习方法教程](https://www.bilibili.com/video/BV1eCDWYbEQk/)

- [中国审判流程信息公开网](https://splcgk.court.gov.cn/gzfwww/)

- [人民法院案例库](https://rmfyalk.court.gov.cn/)

- [中国法院网](https://www.chinacourt.org/index.shtml)
    - [审判](https://www.chinacourt.org/article/index/id/MzAwNDAwMgCRhAEA.shtml)

- [人民检察院刑事诉讼规则（2019）](https://www.spp.gov.cn/spp/xwfbh/wsfbh/201912/t20191230_451490.shtml)

- [法律文库](http://lawdb.cncourt.org/)

宪法

- [中华人民共和国宪法](http://www.npc.gov.cn/c2/c30834/201905/t20190521_281393.html)

刑诉法

- [中华人民共和国刑事诉讼法](http://www.npc.gov.cn/npc/c2/c12435/201905/t20190521_276591.html)
- [最高法关于适用《中华人民共和国刑事诉讼法》的解释](https://www.court.gov.cn/fabu/xiangqing/286491.html)

公安

- [中华人民共和国人民警察法](https://www.gov.cn/ziliao/flfg/2005-08/05/content_20891.htm)
- [公安机关办理刑事案件程序规定](https://www.gov.cn/zhengce/2021-12/25/content_5712867.htm)

行政

- [中华人民共和国行政许可法](http://www.npc.gov.cn/npc/c2/c30834/201906/t20190608_298033.html)
- [中华人民共和国行政处罚法](https://www.gov.cn/xinwen/2021-01/23/content_5582030.htm)
- [中华人民共和国行政复议法](https://www.gov.cn/yaowen/liebiao/202309/content_6901584.htm)

最高法

- [最高法司法解释列表](https://www.court.gov.cn/fabu/gengduo/16.html)
