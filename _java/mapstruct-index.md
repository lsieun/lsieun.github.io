---
title: "MapStruct"
sequence: "101"
---

IDEA当中，安装MapStruct Support插件：

![](/assets/images/java/mapstruct/intellij-idea-mapstruct-plugin.png)

目前，我对于 MapStruct 的理解是这样的：

- 第一步，建立一个 Mapper 接口，也就是建立一种”映射“关系
- 第二步，获取这个 Mapper 接口的实现，来进行具体”转换“

## Basic

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/mapstruct/basic/'" |
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

## Mapping

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/mapstruct/mapping/'" |
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

## Annotation

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/mapstruct/annotation/'" |
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

## Extention

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/mapstruct/ext/'" |
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

```text
@Mapper(componentModel="spring")
@Mappings(
    @Mapping(target="girlFriends", ignore=true)
)

@Mappings(
    @Mapping(target="girlType", expression = "java(girlType(coolGirl.getGirlType))")
)

@Mapping(source="salary", target="salary", numberFormat="￥#.00", defaultValue="￥0.00")
```


## Reference

- [lsieun/learn-java-dto](https://github.com/lsieun/learn-java-dto)

- [Intellij IDEA: MapStruct Support](https://plugins.jetbrains.com/plugin/10036-mapstruct-support)

- [Reference Guide](https://mapstruct.org/documentation/reference-guide/)
  - [MapStruct Reference Guide](https://mapstruct.org/documentation/stable/reference/html/)
- [Frequently Asked Questions (FAQ)](https://mapstruct.org/faq/)
  - [Can I use MapStruct together with Project Lombok?](https://mapstruct.org/faq/#Can-I-use-MapStruct-together-with-Project-Lombok)
- [Using MapStruct with Project Lombok](https://springframework.guru/using-mapstruct-with-project-lombok/)

- [One-Stop Guide to Mapping with MapStruct](https://reflectoring.io/java-mapping-with-mapstruct/)
- [Baeldung Tag: MapStruct](https://www.baeldung.com/tag/mapstruct)

