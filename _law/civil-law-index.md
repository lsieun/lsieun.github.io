---
title: "民法"
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

```text
以上，以下，是包括本数的
不满，超过，是不包括本数的
```

```text
- 合同/契约
    - 形式：口头、书面
    - 内容
- 当事人
    - 两个人
        - 要约+承诺
        - 合意一致
- 社会
    - 内容：公序良俗
- 国家
    - 内容：法律
    - 程序：必要的批准和登记

```

![](/assets/images/law/civil/民事法律行为-合同-四个层面.svg)

```text
合同成立需要满足以下几个基本条件：

1. **当事人**：合同必须有至少两方当事人。这些当事人应该是具有相应的民事行为能力和民事权利能力的个人或组织。

2. **要约和承诺**：合同的成立需要经过要约（offer）和承诺（acceptance）两个阶段。
要约是指一方以明确的方式向另一方提出订立合同的意愿，并确定了合同的基本条款；
承诺则是指受要约人对要约表示完全同意的意思表示，一旦承诺生效，合同即告成立。

3. **合意一致**：双方当事人对于合同的主要条款必须达成一致意见，即意思表示一致。
这意味着双方就合同的内容没有异议，
包括但不限于标的物、数量、质量、价款或报酬、履行期限、地点和方式等。

4. **合法目的和内容**：合同的目的和内容必须符合法律法规的规定和社会公共秩序、善良风俗的要求。
如果合同内容违反法律强制性规定或社会公序良俗，则该合同无效。

5. **形式要求**：虽然很多情况下合同可以口头达成，
但某些类型的合同根据法律规定必须采用书面形式或者其他特定形式才能成立。
例如，房地产交易通常要求书面合同。

6. **必要的批准和登记**：在一些特殊情况下，合同的成立还需要获得有关政府部门的批准或者完成特定的登记程序，比如不动产转让合同。

上述条件是合同成立的一般要求，不同类型的合同可能还会有额外的特殊成立要件。
此外，《民法典》等相关法律法规也对合同成立的具体细节做出了详细规定。
```

## 基础知识

### 基础

<table>
    <thead>
    <tr>
        <th style="text-align: center;">基础</th>
        <th style="text-align: center;">权利</th>
        <th style="text-align: center;">义务/责任</th>
        <th style="text-align: center;">维权/救济</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/civil/fundamental/basic/'" |
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
where_exp: "item", "item.path contains 'law/civil/fundamental/right/'" |
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
where_exp: "item", "item.path contains 'law/civil/fundamental/liability/'" |
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
where_exp: "item", "item.path contains 'law/civil/fundamental/remedy/'" |
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

### 财产

<table>
    <thead>
    <tr>
        <th style="text-align: center;">财产</th>
        <th style="text-align: center;">商业</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/civil/fundamental/property/'" |
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
where_exp: "item", "item.path contains 'law/civil/fundamental/business/'" |
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

### 人身

<table>
    <thead>
    <tr>
        <th style="text-align: center;">人身</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/civil/fundamental/person/'" |
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

### 公权力

<table>
    <thead>
    <tr>
        <th style="text-align: center;">公权力</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/civil/fundamental/power/'" |
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

## 考试

### 权利义务

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">概览</th>
        <th style="text-align: center;">法律</th>
        <th style="text-align: center;">权利</th>
        <th style="text-align: center;">赔偿</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/civil/exam/basic/'" |
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
where_exp: "item", "item.path contains 'law/civil/exam/overview/'" |
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
where_exp: "item", "item.path contains 'law/civil/exam/summary/'" |
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
where_exp: "item", "item.path contains 'law/civil/exam/right/'" |
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
where_exp: "item", "item.path contains 'law/civil/exam/compensation/'" |
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

### 维度2

<table>
    <thead>
    <tr>
        <th style="text-align: center;">时间</th>
        <th style="text-align: center;">情景</th>
        <th style="text-align: center;">法院</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/civil/exam/time/'" |
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
where_exp: "item", "item.path contains 'law/civil/exam/situation/'" |
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
where_exp: "item", "item.path contains 'law/civil/exam/power/'" |
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

### 财产

<table>
    <thead>
    <tr>
        <th style="text-align: center;">物权</th>
        <th style="text-align: center;">债权</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/civil/exam/property/real/'" |
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
where_exp: "item", "item.path contains 'law/civil/exam/property/credit/'" |
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

### 人身

<table>
    <thead>
    <tr>
        <th style="text-align: center;">人格权</th>
        <th style="text-align: center;">身份权</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td></td>
    </tr>
    </tbody>
</table>

## 课程笔记

<table>
    <thead>
    <tr>
        <th style="text-align: center;">总则</th>
        <th style="text-align: center;">财产</th>
        <th style="text-align: center;">合同</th>
        <th style="text-align: center;">人身</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/civil/note/general/'" |
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
where_exp: "item", "item.path contains 'law/civil/note/property/'" |
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
where_exp: "item", "item.path contains 'law/civil/note/contract/'" |
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
where_exp: "item", "item.path contains 'law/civil/note/family/'" |
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
        <th style="text-align: center;">总则编</th>
        <th style="text-align: center;">物权编</th>
        <th style="text-align: center;">债权编</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/civil/video/p1/'" |
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
where_exp: "item", "item.path contains 'law/civil/video/p2/'" |
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
where_exp: "item", "item.path contains 'law/civil/video/p3/'" |
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

---

<table>
    <thead>
    <tr>
        <th style="text-align: center;">合同编通则</th>
        <th style="text-align: center;">典型合同</th>
        <th style="text-align: center;">人身权利</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/civil/video/p4/'" |
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
where_exp: "item", "item.path contains 'law/civil/video/p5/'" |
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
where_exp: "item", "item.path contains 'law/civil/video/p6/'" |
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
        <th style="text-align: center;">法条</th>
        <th style="text-align: center;">司法解释</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.law |
where_exp: "item", "item.path contains 'law/civil/article/raw/'" |
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
where_exp: "item", "item.path contains 'law/civil/article/explain/'" |
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

- [微博：民商法孟献贵](https://www.weibo.com/u/2342740757)
- [2025 年法考客观题【精讲卷】民法 众合孟献贵](https://www.bilibili.com/video/BV1hsSvY7Ev1/)
- [民法典](http://www.npc.gov.cn/npc/c2/c30834/202006/t20200602_306457.html)
- 参考书籍
    - 《民法典注释本（第三版）》

### 法条

- [最高法司法解释](http://gongbao.court.gov.cn/ArticleList.html?serial_no=sfjs)
    - [检索](http://gongbao.court.gov.cn/QueryArticle.html)
    - [诉讼时效的规定 2020.12.23](http://gongbao.court.gov.cn/Details/25e280bb70c3568615e0ef974d068f.html)
