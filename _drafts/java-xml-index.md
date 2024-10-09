---
title: "Java XML"
image: /assets/images/java/java-development.jpg
permalink: /java/java-xml-index.html
---

Java XML

## SAX

<table>
    <thead>
    <tr>
        <th style="text-align: center;">API</th>
        <th style="text-align: center;">SAX</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/xml/api/'" |
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
where_exp: "item", "item.path contains 'java/xml/sax/'" |
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

## DOM

{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/xml/dom/'" |
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

## XSLT

{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/xml/xslt/'" |
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

Oracle

- [Java API for XML Processing](https://docs.oracle.com/javase/8/docs/technotes/guides/xml/jaxp/index.html)
- [Java API for XML Processing (JAXP) Tutorial](https://www.oracle.com/java/technologies/jaxp-introduction.html)
- [Trail: Java API for XML Processing (JAXP)](https://docs.oracle.com/javase/tutorial/jaxp/index.html)

Apache

- [The Apache Xerces Project](https://xerces.apache.org/)
    - [Xerces2 Java XML Parser Readme](https://xerces.apache.org/xerces2-j/)
    - [Xerces2 Java XML Parser Features](https://xerces.apache.org/xerces2-j/features.html)


Other

- [SAX](http://www.saxproject.org/)
- [JAXP (Java API for XML Processing)](https://roytuts.com/jaxp/)
- [JDOM](http://www.jdom.org/)

