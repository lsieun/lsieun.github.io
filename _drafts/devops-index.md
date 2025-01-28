---
title: "DevOps"
image: /assets/images/devops/devops-cycle.png
permalink: /devops.html
---

**DevOps** is a combination of software development (**dev**) and operations (**ops**).

## Content

{%
assign filtered_posts = site.devops |
where_exp: "item", "item.url contains '/devops/'" |
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


