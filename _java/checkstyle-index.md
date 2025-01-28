---
title: "Checkstyle"
sequence: "101"
---

## Content

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/checkstyle/'" |
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

- [lsieun/learn-java-checkstyle](https://github.com/lsieun/learn-java-checkstyle)

- [Checkstyle Configuration](https://checkstyle.sourceforge.io/config.html)

示例：

- [checkstyle-checks.xml](https://github.com/checkstyle/checkstyle/blob/master/config/checkstyle-checks.xml)

