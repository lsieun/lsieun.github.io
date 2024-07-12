---
title: "Java ByteBuddy"
image: /assets/images/bytebuddy/byte-buddy-cover.png
permalink: /bytebuddy.html
---

ByteBuddy is a library for generating Java classes dynamically at run-time.

三个应用场景：

- manually
- Java agent
- Build

简而言之，ByteBuddy，或者任何其它技术，都是“易于使用，难以精通”！

代码的编写，“流淌”着一种思路。

- 问题定位：
    - 字节码修改的问题
    - 后续处理：
        - 类加载的问题
- 本地有 `.class` 会先加载本地的 `.class` 文件
- 思考的思路是什么
- 听不懂，没有关系（一次听不懂，没有关系；我会再讲，逐渐熟悉）
- 有对 jdk 对象增强的例子吗？如：jdk.线程池
- 在应用的时候发现有的类在 onDiscovery 里监听到，但是 onTransformation 和 onIgnored 里都没有监听到的情况，这是什么原因呢
- ClassLoader
    - Bootstrap ClassLoader
    - Extention ClassLoader
    - App ClassLoader
- ClassLoadingStrategy



<table>
<tr>
  <th>ByteBuddy 头</th>
  <th>ByteBuddy 主体</th>
  <th>ByteBuddy 尾</th>
</tr>
</table>

## Episode 01：Class Generation

### 第一章 生成类型

<table>
    <thead>
    <tr>
        <th style="text-align: center;">概览</th>
        <th style="text-align: center;">生成类</th>
        <th style="text-align: center;">生成方法体</th>
        <th style="text-align: center;">生成其它类型</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.url contains '/bytebuddy/overview/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.url contains '/bytebuddy/generation/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.url contains '/bytebuddy/method-body/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.url contains '/bytebuddy/types/'" |
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

### 第二章 查看类型

### 第三章 修改类型

<table>
    <thead>
    <tr>
        <th style="text-align: center;">匹配</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.url contains '/bytebuddy/match/'" |
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

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Advice</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.url contains '/bytebuddy/advice/'" |
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

<table>
    <thead>
    <tr>
        <th style="text-align: center;">MethodDelegation</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.url contains '/bytebuddy/delegation/'" |
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


### buddy

{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.url contains '/bytebuddy/buddy/'" |
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

### dynamic

{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.url contains '/bytebuddy/dynamic/'" |
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

### asm

{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.url contains '/bytebuddy/asm/'" |
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

### Implementation

{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.url contains '/bytebuddy/implementation/'" |
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

### Agent

{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.url contains '/bytebuddy/agent/'" |
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

- [ ] `AgentBuilder.Transformer` 与 `java.lang.instrument.ClassFileTransformer` 是如何结合到一起的呢？

### 泛型 Generic

{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.url contains '/bytebuddy/generic/'" |
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

### 注解 Annotation

{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.url contains '/bytebuddy/annotation/'" |
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

### Description

{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.url contains '/bytebuddy/description/'" |
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



## TODO

- net.bytebuddy.dynamic.scaffold.TypeWriter#DUMP_PROPERTY: String DUMP_PROPERTY = "net.bytebuddy.dump"
- 读取注解 Annotation

## Java Agent

For the creation of Java agents, Byte Buddy offers a convenience API implemented by
the `net.bytebuddy.agent.builder.AgentBuilder`.
The API wraps a `ByteBuddy` instance and offers agent-specific configuration opportunities by integrating against the
instrument.Instrumentation API.

## Reference

- [ByteBuddy](https://bytebuddy.net/)
    - [ByteBuddy Tutorial](https://bytebuddy.net/#/tutorial)
    - [Byte Buddy release notes](https://github.com/raphw/byte-buddy/blob/master/release-notes.md)
    - [question](https://github.com/raphw/byte-buddy/labels/question)
    - [Google Group](https://groups.google.com/g/byte-buddy)
- [GitHub: byte-buddy](https://github.com/raphw/byte-buddy)
- [Stack Overflow: byte-buddy](https://stackoverflow.com/questions/tagged/byte-buddy)

电子书：

- 《Java Interceptor Development with ByteBuddy: Fundamental》 Eric Fong, 2020-10

一定要解决的问题

- [How to restore the modified bytecode?](https://github.com/raphw/byte-buddy/issues/1064)

TO Read

- [Easily Create Java Agents with Byte Buddy](https://www.infoq.com/articles/Easily-Create-Java-Agents-with-ByteBuddy/)
- [探秘 Java：用 ByteBuddy 编写一个简单的 Agent](https://www.swzgeek.com/archives/bytebuddy-javaagent)
- [Runtime Code Generation with Byte Buddy](https://blogs.oracle.com/javamagazine/post/runtime-code-generation-with-byte-buddy)
- [Java Code Manipulation with Byte Buddy](https://sergiomartinrubio.com/articles/java-code-manipulation-with-byte-buddy/)
- [bytebuddy 源码解析](https://www.codenong.com/cs106594057/)
- [JAVA 动态字节码实现方式对比之 Byte Buddy](https://segmentfault.com/a/1190000039808891)
- [bytebuddy 简单入门](https://blog.csdn.net/wanxiaoderen/article/details/106544773)
- [ByteBuddy（史上最全）](https://www.cnblogs.com/crazymakercircle/p/16635330.html)

- [bytebuddy 核心教程](https://www.bilibili.com/video/BV1G24y1a7bd/)
- [bytebuddy 进阶实战 - skywalking agent 可插拔式架构实现](https://www.bilibili.com/video/BV1Jv4y1a7Kw/)

Baeldung

- [A Guide to Byte Buddy](https://www.baeldung.com/byte-buddy)

- [GitHub: Rafael Winterhalter](https://github.com/raphw)
- [The Java memory model explained, Rafael Winterhalter](https://www.youtube.com/watch?v=qADk_tj4wY8&ab_channel=BulgarianJavaUserGroup)
- [Java Memory Management Garbage Collection, JVM Tuning, and Spotting Memory Leaks](https://www.youtube.com/watch?v=W4SvLYU9H1I&ab_channel=AlphaTutorials-Programming)
