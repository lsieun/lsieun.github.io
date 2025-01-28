---
title: "健康"
image: /assets/images/health/healthy-lifestyles.png
permalink: /health/health-index.html
---

Health has a variety of definitions, which have been used for different purposes over time.
In general, it refers to physical and emotional well-being,
especially that associated with normal functioning of the human body,
absent of disease, pain (including mental pain), or injury.

```text
山河依旧人见老，
余生只盼身体好；
富贵贫穷都看浅，
健康才是无价宝。
```

## 人体

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
assign filtered_posts = site.health |
where_exp: "item", "item.path contains 'health/body/'" |
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

## 情感

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
assign filtered_posts = site.health |
where_exp: "item", "item.path contains 'health/emotion/'" |
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

## 饮食

<table>
    <thead>
    <tr>
        <th style="text-align: center;">观点</th>
        <th style="text-align: center;">做饭</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.health |
where_exp: "item", "item.path contains 'health/food/view/'" |
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
assign filtered_posts = site.health |
where_exp: "item", "item.path contains 'health/food/cook/'" |
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

## 医

<table>
    <thead>
    <tr>
        <th style="text-align: center;">不舒服</th>
        <th style="text-align: center;">中医</th>
        <th style="text-align: center;">西医</th>
        <th style="text-align: center;">医文</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.health |
where_exp: "item", "item.path contains 'health/heal/discomfort/'" |
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
assign filtered_posts = site.health |
where_exp: "item", "item.path contains 'health/heal/chinese/'" |
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
assign filtered_posts = site.health |
where_exp: "item", "item.path contains 'health/heal/western/'" |
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
assign filtered_posts = site.health |
where_exp: "item", "item.path contains 'health/heal/doc/'" |
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

## TODO

- [ ] 久坐的坏处

## Reference

- [12 Tips for Maintaining a Healthy Lifestyle](https://www.healthline.com/health/how-to-maintain-a-healthy-lifestyle)
- [A Guide to a Healthy Lifestyle](https://www.news-medical.net/health/A-Guide-to-a-Healthy-Lifestyle.aspx)

- [发现中医太美《黄帝内经》-梁东徐文兵](https://www.bilibili.com/video/BV1Ys1vYkEwb/)
