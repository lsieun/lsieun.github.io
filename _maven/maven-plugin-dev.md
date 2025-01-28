---
title: "Maven 插件开发"
sequence: "102"
---

[UP](/maven-index.html)


## 主要内容

### 第一章 概览

{%
assign filtered_posts = site.maven |
where_exp: "item", "item.path contains 'maven/plugin-mojo/quick/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 100 and num < 200 %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

### 第二章 Mojo API（代码如何写）

{%
assign filtered_posts = site.maven |
where_exp: "item", "item.path contains 'maven/plugin-mojo/api/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 100 and num < 200 %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

### 第三章 生命周期（如何构建）

{%
assign filtered_posts = site.maven |
where_exp: "item", "item.path contains 'maven/plugin-mojo/lifecycle/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 100 and num < 200 %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

### 第四章 测试（如何测试）

{%
assign filtered_posts = site.maven |
where_exp: "item", "item.path contains 'maven/plugin-mojo/testing/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 100 and num < 200 %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

### 第五章 其它

{%
assign filtered_posts = site.maven |
where_exp: "item", "item.path contains 'maven/plugin-mojo/other/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 100 and num < 200 %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

## Reference

- [Plugin Developers Centre](https://maven.apache.org/plugin-developers/index.html)
- [maven-plugin-plugin:3.2:descriptor failed: 52264](https://blog.csdn.net/jiangxuexuanshuang/article/details/88733162)

- [Maven Plugin Development](https://khmarbaise.github.io/maui/mp-it-example.html)
- [Failed to load class org.slf4j.impl.StaticLoggerBinder](https://www.slf4j.org/codes.html#StaticLoggerBinder)

- [PluginDescriptor](https://maven.apache.org/ref/3.8.5/maven-plugin-api/plugin.html)
- [Maven Plugin Tools](https://maven.apache.org/plugin-tools/)
    - [Mojo Javadoc Tags](https://maven.apache.org/plugin-tools/maven-plugin-tools-java/index.html)
    - [Maven Plugin Tool for Annotations](https://maven.apache.org/plugin-tools/maven-plugin-tools-annotations/index.html)
    - [Using Plugin Tools Java Annotations](https://maven.apache.org/plugin-tools/maven-plugin-plugin/examples/using-annotations.html)

Baeldung

- [How to Create a Maven Plugin](https://www.baeldung.com/maven-plugin) 有生成文档的部分

- [How to Build a Maven Plugin](https://developer.okta.com/blog/2019/09/23/tutorial-build-a-maven-plugin)

Intellij IDEA

- [Debug Maven goals](https://www.jetbrains.com/help/idea/work-with-maven-goals.html#debug_goal)
