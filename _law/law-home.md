---
title: "法律"
sequence: "102"
---

[UP](/law/law-index.html)

- [主页]({% link _law/law-home.md %})
- [刑法]({% link _law/criminal-law-index.md %})
- [刑诉法]({% link _law/criminal-procedure-law-index.md %})
- [民法]({% link _law/civil-law-index.md %})
- [民诉法]({% link _law/civil-procedure-law-index.md %})
- [行政法]({% link _law/administration-law-index.md %})
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

- [厚德汇法](http://www.ahdhf.com/)
- [法律文库](http://lawdb.cncourt.org/)

- [国家法律法规数据库](https://flk.npc.gov.cn/)

宪法

- [中华人民共和国宪法](http://www.npc.gov.cn/c2/c30834/201905/t20190521_281393.html)

刑诉法

- [中华人民共和国刑事诉讼法](http://www.npc.gov.cn/npc/c2/c12435/201905/t20190521_276591.html)
- [刑诉解释（最高法关于适用《中华人民共和国刑事诉讼法》的解释）](https://www.court.gov.cn/fabu/xiangqing/286491.html)

公安

- [中华人民共和国人民警察法](https://www.gov.cn/ziliao/flfg/2005-08/05/content_20891.htm)
- [公安部规定（公安机关办理刑事案件程序规定）](https://www.gov.cn/zhengce/2021-12/25/content_5712867.htm)
- [公安机关人民警察执法过错责任追究规定](https://www.gov.cn/zhengce/2021-12/25/content_5712901.htm)

行政

- [中华人民共和国行政许可法](http://www.npc.gov.cn/npc/c2/c30834/201906/t20190608_298033.html)
- [中华人民共和国行政处罚法](https://www.gov.cn/xinwen/2021-01/23/content_5582030.htm)
- [中华人民共和国行政复议法](https://www.gov.cn/yaowen/liebiao/202309/content_6901584.htm)

最高法

- [最高法司法解释列表](https://www.court.gov.cn/fabu/gengduo/16.html)

检察院

- [高检规则（人民检察院刑事诉讼规则）](https://www.spp.gov.cn/spp/xwfbh/wsfbh/201912/t20191230_451490.shtml)
- [人民检察院司法责任追究条例 2024-07-24](https://www.spp.gov.cn/xwfbh/wsfbh/202407/t20240724_661172.shtml)

- [中华人民共和国司法部](https://www.moj.gov.cn/)
    - [司法部国家司法考试中心](https://www.moj.gov.cn/pub/sfbgw/jgsz/jgszzsdw/zsdwgjsfkszx/)
        - [国家统一法律职业资格考试实施办法 2018-04-29](https://www.moj.gov.cn/pub/sfbgw/jgsz/jgszzsdw/zsdwgjsfkszx/gjsfkszcfg/202106/t20210622_428245.html)

- [中华人民共和国立法法](https://www.gov.cn/xinwen/2023-03/14/content_5746569.htm)

- [法官法](http://www.npc.gov.cn/zgrdw/npc/xinwen/2019-04/23/content_2086082.htm)

```text
《立法法》
部门规章规定的事项应当属于执行法律或者国务院的行政法规、决定、命令的事项。
没有法律或者国务院的行政法规、决定、命令的依据，
部门规章不得设定减损公民、法人和其他组织权利或者增加其义务的规范，
不得增加本部门的权力或者减少本部门的法定职责。
```

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

- [微博：刑法柏浪涛](https://weibo.com/bltxf)
- [微博：左宁刑诉](https://weibo.com/u/3153511812)
- [微博：行政法李佳](https://weibo.com/u/1552849431)
- [微博：民商法孟献贵](https://weibo.com/u/2342740757)
- [微博：民法钟秀勇](https://www.weibo.com/u/1313315380)
