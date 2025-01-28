---
title: "Java Feature"
image: /assets/images/java/feature/java-feature-cover.jpg
permalink: /java-feature.html
---

A takeaway line might be this: **languages need to evolve to track changing hardware or programmer expectations.**
To endure, Java has to evolve by adding new features.

## Basic

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/feature/basic/'" |
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

## 15

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/feature/15/'" |
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

## 21



## Reference

- [Baeldung](https://www.baeldung.com/)
    - Tag:
      [Java 9](https://www.baeldung.com/tag/java-9/), [Java 10](https://www.baeldung.com/tag/java-10/),
      [Java 11](https://www.baeldung.com/tag/java-11/), [Java 12](https://www.baeldung.com/tag/java-12/),
      [Java 13](https://www.baeldung.com/tag/java-13/), [Java 14](https://www.baeldung.com/tag/java-14/),
      [Java 15](https://www.baeldung.com/tag/java-15/), [Java 16](https://www.baeldung.com/tag/java-16/),
      [Java 17](https://www.baeldung.com/tag/java-17/), [Java 18](https://www.baeldung.com/tag/java-18/)
    - New:
      [Java 8](https://www.baeldung.com/java-8-new-features),
      [Java 9](https://www.baeldung.com/new-java-9), [Java 10](https://www.baeldung.com/java-10-overview),
      [Java 11](https://www.baeldung.com/java-11-new-features), [Java 12](https://www.baeldung.com/java-12-new-features),
      [Java 13](https://www.baeldung.com/java-13-new-features), [Java 14](https://www.baeldung.com/java-14-new-features),
      [Java 15](https://www.baeldung.com/java-15-new), [Java 16](https://www.baeldung.com/java-16-new-features),
      [Java 17](https://www.baeldung.com/java-17-new-features)
    - [Migrate From Java 8 to Java 17](https://www.baeldung.com/java-migrate-8-to-17)
    - [Java 19](https://www.baeldung.com/tag/java-19)
    - [>= Java 21](https://www.baeldung.com/tag/jdk21-and-later)

## Reference

- [Java Version History and Features](https://howtodoinjava.com/java-version-wise-features-history/)

Oracle

- [Java SE 7 Features and Enhancements](https://www.oracle.com/java/technologies/javase/jdk7-relnotes.html)

