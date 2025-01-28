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

## Jar

<table>
    <thead>
    <tr>
        <th style="text-align: center;">概念</th>
        <th style="text-align: center;">工具</th>
        <th style="text-align: center;">API</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/archive/jar/concept/'" |
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
where_exp: "item", "item.path contains 'java/archive/jar/tool/'" |
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
where_exp: "item", "item.path contains 'java/archive/jar/api/'" |
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

- [lsieun/learn-java-archive](https://github.com/lsieun/learn-java-archive)

- [WiX Toolset on GitHub](https://github.com/wixtoolset/wix3)

- [Creating a Windows Service with Java 21, JPackage, Wix, and Maven: A Step-by-Step Guide](https://medium.com/@nassim.boutek/creating-a-windows-service-with-java-21-jpackage-and-maven-a-step-by-step-guid-42fd476e68c9)

- [Lesson: Packaging Programs in JAR Files](https://docs.oracle.com/javase/tutorial/deployment/jar/index.html)
- [JAR File Overview](https://docs.oracle.com/javase/8/docs/technotes/guides/jar/jarGuide.html)

- [Java Archive (JAR) Files](https://docs.oracle.com/javase/8/docs/technotes/guides/jar/index.html)
- [JAR File Specification](https://docs.oracle.com/javase/8/docs/technotes/guides/jar/jar.html)


- [Baeldung Tag: Jar](https://www.baeldung.com/tag/jar)
    - [Understanding the JAR Manifest File](https://www.baeldung.com/java-jar-manifest)
    - [Get Names of Classes Inside a JAR File](https://www.baeldung.com/jar-file-get-class-names)
    - [Get the Full Path of a JAR File From a Class](https://www.baeldung.com/java-full-path-of-jar-from-class)
    - [Extracting JAR to a Specified Directory](https://www.baeldung.com/extract-jar-to-a-specified-directory)
    - [Extracting a Tar File in Java](https://www.baeldung.com/java-extract-tar-file)
    - [How to Create an Executable JAR with Maven](https://www.baeldung.com/executable-jar-with-maven)
    - [Zipping and Unzipping in Java](https://www.baeldung.com/java-compress-and-uncompress)
