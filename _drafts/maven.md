---
title:  "Apache Maven"
categories: apache
image: /assets/images/maven/apache-maven-cover.png
tags: maven
published: false
---

Maven is a build automation tool used primarily for Java projects.

## Content

### 第一章 基础

{% assign filtered_posts = site.maven | sort: "sequence" %}
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

### 第三章 高级应用

{% assign filtered_posts = site.maven | sort: "sequence" %}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 300 and num < 400 %}
    <li>
        <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

## References

Ebook

- 《Apache Maven Cookbook》，作者 Raghuram Bharathan

