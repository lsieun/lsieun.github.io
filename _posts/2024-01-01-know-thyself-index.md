---
title: "Know Thyself"
image: /assets/images/thyself/know-thyself.png
permalink: /thyself/know-thyself-index.html
---

"Know thyself" is a philosophical maxim
which was inscribed upon the Temple of Apollo in the ancient Greek precinct of Delphi.

![](/assets/images/thyself/know-thyself-gold.webp)

## 戒为良药

- abstention: 戒；戒除 the act of not allowing yourself to have or do sth enjoyable or sth that is considered bad

<table>
    <thead>
    <tr>
        <th style="text-align: center;">基础</th>
        <th style="text-align: center;">色情</th>
        <th style="text-align: center;">其他</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.thyself |
where_exp: "item", "item.path contains 'thyself/abstention/basic/'" |
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
assign filtered_posts = site.thyself |
where_exp: "item", "item.path contains 'thyself/abstention/lust/'" |
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
assign filtered_posts = site.thyself |
where_exp: "item", "item.path contains 'thyself/abstention/other/'" |
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

## 长大为人

<table>
    <thead>
    <tr>
        <th style="text-align: center;">成长</th>
        <th style="text-align: center;">做人</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.thyself |
where_exp: "item", "item.path contains 'thyself/person/'" |
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
assign filtered_posts = site.thyself |
where_exp: "item", "item.path contains 'thyself/be-a-man/'" |
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

## 事业

<table>
    <thead>
    <tr>
        <th style="text-align: center;">内在（心智/心志）</th>
        <th style="text-align: center;">外在（方式/方法）</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.thyself |
where_exp: "item", "item.path contains 'thyself/career/internal/'" |
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

## 人生修行

<table>
    <thead>
    <tr>
        <th style="text-align: center;">情绪</th>
        <th style="text-align: center;">心志</th>
        <th style="text-align: center;">看法/理解/洞察力</th>
        <th style="text-align: center;">学说/教导</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.thyself |
where_exp: "item", "item.path contains 'thyself/cultivation/emotion/'" |
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
assign filtered_posts = site.thyself |
where_exp: "item", "item.path contains 'thyself/cultivation/grit/'" |
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
assign filtered_posts = site.thyself |
where_exp: "item", "item.path contains 'thyself/cultivation/perception/'" |
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
assign filtered_posts = site.thyself |
where_exp: "item", "item.path contains 'thyself/cultivation/teaching/'" |
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

## 医与食

<table>
    <thead>
    <tr>
        <th style="text-align: center;">医</th>
        <th style="text-align: center;">食</th>
        <th style="text-align: center;">医文</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.thyself |
where_exp: "item", "item.path contains 'thyself/medicine/base/'" |
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
assign filtered_posts = site.thyself |
where_exp: "item", "item.path contains 'thyself/food/'" |
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
assign filtered_posts = site.thyself |
where_exp: "item", "item.path contains 'thyself/medicine/extra/'" |
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

## 治国

<table>
    <thead>
    <tr>
        <th style="text-align: center;">治国</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.thyself |
where_exp: "item", "item.path contains 'thyself/govern/'" |
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

- [Know thyself: how self-awareness helps you at work](https://www.atlassian.com/blog/teamwork/know-thyself-how-self-awareness-helps-you-at-work)
- [How to Develop Self-Knowledge and Why it Matters](https://proveritas.com.au/blog-home/how-to-develop-self-knowledge-and-why-it-matters)
