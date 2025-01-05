---
title: "Jackson"
sequence: "101"
---

## 概览

The Java JSON API called Jackson consists of one core JAR file (project) and
two other JAR files that use the core JAR file.
The three JAR files (projects) in the Jackson JSON API are:

- Jackson Core
- Jackson Annotations
- Jackson Databind

These projects use each other in that sequence too:
Jackson Annotation uses the Jackson Core features,
and the Jackson Databind uses Jackson Annotation.

Jackson also has a few extra projects for parsing other data formats than JSON.
For instance, to read and write CBOR you can add the `jackson-dataformat-cbor` artifact to your classpath too.

```text
                        ┌─── JSON
                        │
                        ├─── CSV
           ┌─── Text ───┤
           │            ├─── YAML
           │            │
Jackson ───┤            └─── XML
           │
           │            ┌─── Object
           └─── POJO ───┤
                        │                  ┌─── List
                        └─── Collection ───┤
                                           └─── Map
```

### Basic

{%
assign filtered_posts = site.json |
where_exp: "item", "item.url contains '/json/jackson/basic/'" |
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

### Date Type

{%
assign filtered_posts = site.json |
where_exp: "item", "item.url contains '/json/jackson/datatype/'" |
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

### Annotation

{%
assign filtered_posts = site.json |
where_exp: "item", "item.url contains '/json/jackson/annotation/'" |
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

### Configuration

{%
assign filtered_posts = site.json |
where_exp: "item", "item.url contains '/json/jackson/config/'" |
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

### Classes

{%
assign filtered_posts = site.json |
where_exp: "item", "item.url contains '/json/jackson/class/'" |
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

### Tree Model

{%
assign filtered_posts = site.json |
where_exp: "item", "item.url contains '/json/jackson/tree/'" |
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

### Usage

{%
assign filtered_posts = site.json |
where_exp: "item", "item.url contains '/json/jackson/usage/'" |
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

### Advanced

{%
assign filtered_posts = site.json |
where_exp: "item", "item.url contains '/json/jackson/advanced/'" |
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

Github:

- [lsieun/learn-java-json](https://github.com/lsieun/learn-java-json)
- [lsieun/learn-java-jackson](https://github.com/lsieun/learn-java-jackson)

Baeldung:


- [Jackson JSON Tutorial](https://www.baeldung.com/jackson)
  - [Jackson Basics](https://www.baeldung.com/tag/jackson-basics/)
    - [Intro to the Jackson ObjectMapper](https://www.baeldung.com/jackson-object-mapper-tutorial)

- [Jackson ObjectMapper](https://jenkov.com/tutorials/java-json/jackson-objectmapper.html)

TODO:

- [All You Need To Know About JSON Parsing With Jackson](https://reflectoring.io/jackson/)
- [Jackson – Bidirectional Relationships](https://www.baeldung.com/jackson-bidirectional-relationships-and-infinite-recursion)
- [享学 Jackson](https://blog.csdn.net/f641385712/category_9625300.html)
- [Three ways to use Jackson for JSON in Java](https://www.twilio.com/blog/java-json-with-jackson)

