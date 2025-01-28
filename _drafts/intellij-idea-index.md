---
title: "IntelliJ IDEA"
image: /assets/images/intellij/intellij-idea.png
permalink: /ide/intellij-idea-index.html
---

IntelliJ IDEA is an integrated development environment written in Java for developing computer software.

安装之后，要做的事情：

- [ ] 禁用插件，因为有些用不到。

在 idea 的安装目录的 `plugins` 文件夹，只剩下 `java` 和 `java-ide-customization` 两个文件夹，也能启动。

## 主要内容

### 窗口

目标：将手放在键盘上，尽量不用鼠标

<table>
    <thead>
    <tr>
        <th>Project</th>
        <th>Editor</th>
        <th>Tool</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.ide |
where_exp: "item", "item.path contains 'ide/intellij/window/project/'" |
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
assign filtered_posts = site.ide |
where_exp: "item", "item.path contains 'ide/intellij/window/editor/'" |
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
assign filtered_posts = site.ide |
where_exp: "item", "item.path contains 'ide/intellij/window/tool/'" |
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

### 文本内容

<table>
    <thead>
    <tr>
        <th>代码</th>
        <th>操作</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.ide |
where_exp: "item", "item.path contains 'ide/intellij/content/code/'" |
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
assign filtered_posts = site.ide |
where_exp: "item", "item.path contains 'ide/intellij/content/text/'" |
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

### 键盘+鼠标

<table>
    <thead>
    <tr>
        <th>键盘</th>
        <th>鼠标</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.ide |
where_exp: "item", "item.path contains 'ide/intellij/io/keyboard/'" |
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
assign filtered_posts = site.ide |
where_exp: "item", "item.path contains 'ide/intellij/io/mouse/'" |
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

### 插件

<table>
    <thead>
    <tr>
        <th>常用插件</th>
        <th>工具插件</th>
        <th>AI</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.ide |
where_exp: "item", "item.path contains 'ide/intellij/plugins/common/'" |
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
assign filtered_posts = site.ide |
where_exp: "item", "item.path contains 'ide/intellij/plugins/tool/'" |
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
assign filtered_posts = site.ide |
where_exp: "item", "item.path contains 'ide/intellij/plugins/ai/'" |
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

## 配置和原理

Disabling unused plugins

Shared JDK Indexes

{%
assign filtered_posts = site.ide |
where_exp: "item", "item.path contains 'ide/intellij/index/'" |
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

### IDE Configuration

### Project Configuration

### Source Code

## 分析

<table>
    <thead>
    <tr>
        <th style="text-align: center;">类</th>
        <th style="text-align: center;">分析</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.ide |
where_exp: "item", "item.path contains 'ide/intellij/analysis/clazz/'" |
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
assign filtered_posts = site.ide |
where_exp: "item", "item.path contains 'ide/intellij/analysis/penpx/'" |
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

## 参考资料

- [jetbrains.com: Discover IntelliJ IDEA](https://www.jetbrains.com/help/idea/discover-intellij-idea.html)
- [The IntelliJ IDEA Blog](https://blog.jetbrains.com/idea/)
- [IntelliJ IDEA Guide](https://www.jetbrains.com/idea/guide/)

Baeldung

- [Auto-import Classes in IntelliJ](https://www.baeldung.com/intellij-auto-import-class)
- [Basic IntelliJ Configuration](https://www.baeldung.com/intellij-basics)
- Shortcut
    - [Common Shortcuts in IntelliJ IDEA](https://www.baeldung.com/intellij-idea-shortcuts)
- Refactor
    - [An Introduction to Refactoring with IntelliJ IDEA](https://www.baeldung.com/intellij-refactoring)
    - [Creating the Java Builder for a Class in IntelliJ](https://www.baeldung.com/intellij-idea-java-builders)
- Debugging
    - [IntelliJ Debugging Tricks](https://www.baeldung.com/intellij-debugging-tricks)
    - [Debugging Java Streams with IntelliJ](https://www.baeldung.com/intellij-debugging-java-streams)
    - [Remote Debugging with IntelliJ IDEA](https://www.baeldung.com/intellij-remote-debugging)
- [A Guide to async-profiler](https://www.baeldung.com/java-async-profiler)
- [JetBrains @Contract Annotation](https://www.baeldung.com/jetbrains-contract-annotation)
- [How to Stop or Limit Indexing in Intellij IDEA](https://www.baeldung.com/intellij-stop-limit-indexing)
- Config
    - [What Is the .idea Directory?](https://www.baeldung.com/intellij-idea-directory)

