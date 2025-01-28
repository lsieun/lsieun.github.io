---
title: "Google Guava"
image: /assets/images/google/google-guava-cover.png
permalink: /guava.html
---

Guava is a set of core Java libraries from Google
that includes new collection types (such as multimap and multiset), immutable collections, a graph library,
and utilities for concurrency, I/O, hashing, caching, primitives, strings, and more!
It is widely used on most Java projects within Google, and widely used by many other companies as well.

Guava comes in two flavors:

- The JRE flavor requires JDK 1.8 or higher.
- If you need support for Android, use the Android flavor.

## Adding Guava to your build

Guava's Maven group ID is `com.google.guava`, and its artifact ID is `guava`.
Guava provides two different “flavors”:
one for use on a (Java 8+) JRE and one for use on Android or by any library that wants to be compatible with Android.
These flavors are specified in the Maven version field as either `31.1-jre` or `31.1-android`.

To add a dependency on Guava using Maven, use the following:

```xml

<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>31.1-jre</version>
    <!-- or, for Android: -->
    <version>31.1-android</version>
</dependency>
```

## Content

{%
assign filtered_posts = site.guava |
where_exp: "item", "item.url contains '/guava/concurrency/'" |
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

- [lsieun/learn-java-guava](https://github.com/lsieun/learn-java-guava)

- [Guava](https://guava.dev/)
- [Baeldung: Guava Guide](https://www.baeldung.com/guava-guide)

视频教程：

- [Guava 讲解](https://www.bilibili.com/video/BV1R4411s7GX/)
