---
title: "Java ByteBuddy"
image: /assets/images/bytebuddy/byte-buddy-cover.png
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
- MemberSubstitution



<table>
<tr>
  <th>ByteBuddy 头</th>
  <th>ByteBuddy 主体</th>
  <th>ByteBuddy 尾</th>
</tr>
</table>

## Episode 01：Class Generation

### 第一章 基础

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">核心概念</th>
        <th style="text-align: center;">其他</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/ch01/basic/'" |
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
where_exp: "item", "item.path contains 'bytebuddy/ch01/concept/'" |
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
where_exp: "item", "item.path contains 'bytebuddy/ch01/other/'" |
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

### 第二章 生成类型

<table>
    <thead>
    <tr>
        <th style="text-align: center;">类</th>
        <th style="text-align: center;">方法体</th>
        <th style="text-align: center;">其它类型</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/ch02-generation/clazz/'" |
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
where_exp: "item", "item.path contains 'bytebuddy/ch02-generation/method-body/'" |
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
where_exp: "item", "item.path contains 'bytebuddy/ch02-generation/types/'" |
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

### 第三章 查看类型

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">TypePool</th>
        <th style="text-align: center;">Description</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td></td>
        <td></td>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/ch03-analysis/description/'" |
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

#### 匹配

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
where_exp: "item", "item.path contains 'bytebuddy/ch03-analysis/match/'" |
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

### 第四章 修改类型

#### 基础

<table>
    <thead>
    <tr>
        <th style="text-align: center;">概念</th>
        <th style="text-align: center;">其它</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/ch04-transform/basic/concept/'" |
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
where_exp: "item", "item.path contains 'bytebuddy/ch04-transform/basic/other/'" |
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

#### Advice

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">实例/字段/名称</th>
        <th style="text-align: center;">方法</th>
        <th style="text-align: center;">局部变量</th>
        <th style="text-align: center;">其它</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/ch04-transform/advice/basic/'" |
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
where_exp: "item", "item.path contains 'bytebuddy/ch04-transform/advice/annotation/outer/'" |
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
where_exp: "item", "item.path contains 'bytebuddy/ch04-transform/advice/annotation/method/'" |
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
where_exp: "item", "item.path contains 'bytebuddy/ch04-transform/advice/annotation/local/'" |
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
where_exp: "item", "item.path contains 'bytebuddy/ch04-transform/advice/annotation/other/'" |
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

#### MethodDelegation

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">Annotation1</th>
        <th style="text-align: center;">Annotation2</th>
        <th style="text-align: center;">Annotation3</th>
        <th style="text-align: center;">Other</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/ch04-transform/delegation/basic/'" |
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
where_exp: "item", "item.path contains 'bytebuddy/ch04-transform/delegation/annotation1/'" |
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
where_exp: "item", "item.path contains 'bytebuddy/ch04-transform/delegation/annotation2/'" |
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
where_exp: "item", "item.path contains 'bytebuddy/ch04-transform/delegation/annotation3/'" |
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
where_exp: "item", "item.path contains 'bytebuddy/ch04-transform/delegation/other/'" |
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
where_exp: "item", "item.path contains 'bytebuddy/buddy/'" |
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
where_exp: "item", "item.path contains 'bytebuddy/dynamic/'" |
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
where_exp: "item", "item.path contains 'bytebuddy/asm/'" |
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
where_exp: "item", "item.path contains 'bytebuddy/implementation/'" |
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
where_exp: "item", "item.path contains 'bytebuddy/agent/'" |
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
where_exp: "item", "item.path contains 'bytebuddy/generic/'" |
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
where_exp: "item", "item.path contains 'bytebuddy/annotation/'" |
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
  - [AdviceLocalValueTest.java](https://github.com/raphw/byte-buddy/blob/master/byte-buddy-dep/src/test/java/net/bytebuddy/asm/AdviceLocalValueTest.java)
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
- [Using Byte Buddy for proxy creation](https://mydailyjava.blogspot.com/2022/02/using-byte-buddy-for-proxy-creation.html)
- [ByteBuddy: how to add local variable across enter/exit when transforming a method](https://stackoverflow.com/questions/57167773/bytebuddy-how-to-add-local-variable-across-enter-exit-when-transforming-a-metho)

- [bytebuddy 核心教程](https://www.bilibili.com/video/BV1G24y1a7bd/)
- [bytebuddy 进阶实战 - skywalking agent 可插拔式架构实现](https://www.bilibili.com/video/BV1Jv4y1a7Kw/)

Baeldung

- [A Guide to Byte Buddy](https://www.baeldung.com/byte-buddy)

- [GitHub: Rafael Winterhalter](https://github.com/raphw)
- [The Java memory model explained, Rafael Winterhalter](https://www.youtube.com/watch?v=qADk_tj4wY8&ab_channel=BulgarianJavaUserGroup)
- [Java Memory Management Garbage Collection, JVM Tuning, and Spotting Memory Leaks](https://www.youtube.com/watch?v=W4SvLYU9H1I&ab_channel=AlphaTutorials-Programming)

Agent

- [When using Advice of byte buddy, Exception of java.lang.NoClassDefFoundError is throwed](https://stackoverflow.com/questions/53625549/when-using-advice-of-byte-buddy-exception-of-java-lang-noclassdeffounderror-is)
- [Java Agents with Byte-Buddy](https://shehan-a-perera.medium.com/java-agents-with-byte-buddy-93185305c9e9)
- [Monkey-patching in Java](https://itnext.io/monkey-patching-in-java-dde4122df84c)
- [How to override private method in Java](https://medium.com/@mark.andreev/how-to-rewrite-private-method-in-java-4e7c0e0ec167)
- [Comparing Different Ways to Build Proxies In Java](https://levelup.gitconnected.com/comparing-different-ways-to-build-proxies-in-java-2d09ae9c233a)

Spring Boot

- [Instrumentation of Spring Boot application with Byte Buddy](https://medium.com/@jakubhal/instrumentation-of-spring-boot-application-with-byte-buddy-bbd28619b7c)
- [用 Byte Buddy 於執行期生成程式碼](https://medium.com/java-magazine-translation/%E7%94%A8-byte-buddy-%E6%96%BC%E5%9F%B7%E8%A1%8C%E6%9C%9F%E7%94%9F%E6%88%90%E7%A8%8B%E5%BC%8F%E7%A2%BC-50055bb48e2c)

