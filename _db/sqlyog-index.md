---
title: "SQLyog"
sequence: "101"
---

## Basic

{%
assign filtered_posts = site.db |
where_exp: "item", "item.url contains '/db/sqlyog/basic/'" |
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

## Reference

- [webyog/sqlyog-community](https://github.com/webyog/sqlyog-community/wiki/Downloads)
- [MySQL server-8 not connecting with SQLyog-13](https://stackoverflow.com/questions/51202510/mysql-server-8-not-connecting-with-sqlyog-13)
