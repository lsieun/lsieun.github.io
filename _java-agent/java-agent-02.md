---
title: "Java Agent 系列二：进阶篇"
---

[UP]({% link _posts/2022-01-01-java-agent.md %})



{%
assign filtered_posts = site.java-agent |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 200 and num < 300 %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

### Stack Trace

{%
assign filtered_posts = site.java-agent |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 600 and num < 700 %}
    <li>
        <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

### Thread

{%
assign filtered_posts = site.java-agent |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 700 and num < 800 %}
    <li>
        <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

## Reference

- [ ] [JVM 源码分析之 javaagent 原理完全解读](http://lovestblog.cn/blog/2015/09/14/javaagent/)

