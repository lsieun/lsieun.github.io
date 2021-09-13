---
title:  "Java Agent in Action"
categories: java agent
image: /assets/images/java/agent/java-agent-in-action.png
tags: java agent instrumentation
published: false
---

Java agent is a powerful tool introduced with Java 5. It has been highly useful in profiling activities where developers and application users can monitor tasks carried out within servers and applications.

## 主要内容

### 第一章 基础

{% assign filtered_posts = site.java-agent | sort: "sequence" %}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 100 and num < 200 %}
    <li>
        <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

### 第二章 Load-Time Instrumentation

### 第三章 Dynamic Instrumentation

## 参考资料

- 课程源码：[learn-java-agent](https://gitee.com/lsieun/learn-java-agent)
