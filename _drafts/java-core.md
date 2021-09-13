---
title:  "Java Core"
categories: java
image: /assets/images/java/core/java-core-cover.jpg
tags: java
---

The word Core describes the basic concept of something, and here, the phrase 'Core Java' defines the basic Java that covers the basic concept of Java programming language.

## Java Core

{% assign filtered_posts = site.java-core | sort: "sequence" %}
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

## Java Generics

{% assign filtered_posts = site.java-generic | sort: "sequence" %}
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
