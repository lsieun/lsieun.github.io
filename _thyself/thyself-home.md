---
title: "Home"
sequence: "101"
---

[UP](/thyself/know-thyself-index.html)

- [主页]({% link _thyself/thyself-home.md %})

## Everyday

<table>
    <thead>
    <tr>
        <th style="text-align: center;">内</th>
        <th style="text-align: center;">外</th>
        <th style="text-align: center;">思考</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.thyself |
where_exp: "item", "item.path contains 'thyself/everyday/include/'" |
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
where_exp: "item", "item.path contains 'thyself/everyday/exclude/'" |
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
where_exp: "item", "item.path contains 'thyself/everyday/thinking/'" |
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
        <th style="text-align: center;">对联</th>
        <th style="text-align: center;">做人</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.thyself |
where_exp: "item", "item.path contains 'thyself/couplet/'" |
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

## 人生修行

<table>
    <thead>
    <tr>
        <th style="text-align: center;">心</th>
        <th style="text-align: center;">行</th>
        <th style="text-align: center;">情</th>
        <th style="text-align: center;">看法/理解/洞察力</th>
        <th style="text-align: center;">学说/教导</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.thyself |
where_exp: "item", "item.path contains 'thyself/self-cultivation/mind/'" |
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
where_exp: "item", "item.path contains 'thyself/self-cultivation/action/'" |
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
where_exp: "item", "item.path contains 'thyself/self-cultivation/emotion/'" |
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
where_exp: "item", "item.path contains 'thyself/self-cultivation/perception/'" |
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
where_exp: "item", "item.path contains 'thyself/self-cultivation/teaching/'" |
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

## 齐家 + 社会

<table>
    <thead>
    <tr>
        <th style="text-align: center;" rowspan="2">齐家</th>
        <th style="text-align: center;" colspan="4">社会</th>
    </tr>
    <tr>
        <th style="text-align: center;">认知</th>
        <th style="text-align: center;">谋生</th>
        <th style="text-align: center;">人情</th>
        <th style="text-align: center;">阶层</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.thyself |
where_exp: "item", "item.path contains 'thyself/family-management/'" |
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
where_exp: "item", "item.path contains 'thyself/society/cognition/'" |
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
where_exp: "item", "item.path contains 'thyself/society/make-a-living/'" |
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
where_exp: "item", "item.path contains 'thyself/society/interpersonal-relationship/'" |
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
where_exp: "item", "item.path contains 'thyself/society/social-status/'" |
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

## 国家 + 天下

<table>
    <thead>
    <tr>
        <th style="text-align: center;">国家</th>
        <th style="text-align: center;">天下</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.thyself |
where_exp: "item", "item.path contains 'thyself/state-governance/'" |
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
where_exp: "item", "item.path contains 'thyself/under-heaven/'" |
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

- [Mental Models 思维模型](https://idtimw.com/tag/mental-models/)
    - [思维模型03 - First Principle 第一性原理](https://idtimw.com/first-principle/)

