---
title: "Maven"
image: /assets/images/maven/apache-maven-cover.png
---

Maven is a build automation tool used primarily for Java projects.

- Maven 软件的配置
    - Repository
- Project 层面的配置

## Content

### 第一章 软件层面

### Maven

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Properties</th>
        <th>LifeCycle</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.maven |
where_exp: "item", "item.path contains 'maven/basic/'" |
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
assign filtered_posts = site.maven |
where_exp: "item", "item.path contains 'maven/properties/'" |
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
assign filtered_posts = site.maven |
where_exp: "item", "item.path contains 'maven/lifecycle/'" |
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

### 配置 settings.xml

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">常用配置</th>
        <th style="text-align: center;">其他</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.maven |
where_exp: "item", "item.path contains 'maven/config/basic/'" |
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
assign filtered_posts = site.maven |
where_exp: "item", "item.path contains 'maven/config/common/'" |
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
assign filtered_posts = site.maven |
where_exp: "item", "item.path contains 'maven/config/other/'" |
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

### JVM

{%
assign filtered_posts = site.maven |
where_exp: "item", "item.path contains 'maven/jvm/'" |
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

## 项目层面

### Jar 包依赖

<table>
    <thead>
    <tr>
        <th>Dependency</th>
        <th></th>
        <th></th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.maven |
where_exp: "item", "item.path contains 'maven/dependency/'" |
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
        <td></td>
        <td></td>
    </tr>
    </tbody>
</table>

### 插件

<table>
    <thead>
    <tr>
        <th>插件</th>
        <th>插件配置</th>
        <th>插件管理</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.maven |
where_exp: "item", "item.path contains 'maven/plugins/'" |
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
assign filtered_posts = site.maven |
where_exp: "item", "item.path contains 'maven/plugin-configuration/'" |
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
assign filtered_posts = site.maven |
where_exp: "item", "item.path contains 'maven/plugin-manage/'" |
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

### 多模块

## Deploy

{%
assign filtered_posts = site.maven |
where_exp: "item", "item.path contains 'maven/deploy/'" |
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

```xml

<properties>
    <!-- Resource -->
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>

    <!-- JDK -->
    <java.version>8</java.version>
    <maven.compiler.source>${java.version}</maven.compiler.source>
    <maven.compiler.target>${java.version}</maven.compiler.target>
</properties>
```

```text
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    <java.version>1.8</java.version>
    <maven.compiler.source>${java.version}</maven.compiler.source>
    <maven.compiler.target>${java.version}</maven.compiler.target>
</properties>

<build>
    <plugins>
        <!-- Java Compiler -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.13.0</version>
            <configuration>
                <source>${java.version}</source>
                <target>${java.version}</target>
                <fork>true</fork>
                <compilerArgs>
                    <arg>-g</arg>
                    <arg>-parameters</arg>
                    <arg>-XDignore.symbol.file</arg>
                </compilerArgs>
            </configuration>
        </plugin>
    </plugins>
</build>
```

### 第三章 高级应用

- [插件开发]({% link _maven/maven-plugin-dev.md %})

## References

- [Apache Maven](https://maven.apache.org/)

Ebook

- 《Apache Maven Cookbook》，作者 Raghuram Bharathan

- [MVN Repository](https://mvnrepository.com/)
- [sonatype/Maven Central Repository Search](https://central.sonatype.com/) [New](https://central.sonatype.dev/)

Baeldung

- [Maven](https://www.baeldung.com/category/maven/)

CSDN

- [Maven](https://blog.csdn.net/liupeifeng3514/category_7500193.html)
- [Maven学习与理解(彻底理解Maven)](https://blog.csdn.net/dghkgjlh/article/details/113471655)

