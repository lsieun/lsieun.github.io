---
title: "Java Archive"
image: /assets/images/java/archive/java-archive-cover.png
permalink: /java/java-archive-index.html
---

Java Archive

## Content

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Jar</th>
        <th>Zip</th>
        <th>GZip</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/archive/basic/'" |
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
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/archive/jar/'" |
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
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/archive/zip/'" |
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
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/archive/gzip/'" |
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


## Reference

- [Lesson: Packaging Programs in JAR Files](https://docs.oracle.com/javase/tutorial/deployment/jar/index.html)
- [JAR File Overview](https://docs.oracle.com/javase/8/docs/technotes/guides/jar/jarGuide.html)

- [Java Archive (JAR) Files](https://docs.oracle.com/javase/8/docs/technotes/guides/jar/index.html)
- [JAR File Specification](https://docs.oracle.com/javase/8/docs/technotes/guides/jar/jar.html)

Baeldung

- [Understanding the JAR Manifest File](https://www.baeldung.com/java-jar-manifest)
