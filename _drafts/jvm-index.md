---
title: "JVM"
image: /assets/images/java/jvm/duke-ride-motor-bike.jpg
permalink: /jvm.html
---

Java Virtual Machine

- 类加载子系统
- 内存模型
- 执行引擎
- 垃圾回收器
- JIT（热点代码缓存）

## ClassFile

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/jvm/classfile/'" |
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

## ClassLoader

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>ClassLoader</th>
        <th>Resource</th>
        <th>FAQ</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/jvm/classloader-subsystem/basic/'" |
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
where_exp: "item", "item.url contains '/java/jvm/classloader-subsystem/classloader/'" |
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
where_exp: "item", "item.url contains '/java/jvm/classloader-subsystem/resource/'" |
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
where_exp: "item", "item.url contains '/java/jvm/classloader-subsystem/faq/'" |
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

## Memory

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Heap</th>
        <th>Other</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/jvm/memory/basic/'" |
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
where_exp: "item", "item.url contains '/java/jvm/memory/heap/'" |
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
where_exp: "item", "item.url contains '/java/jvm/memory/other/'" |
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

## Engine

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/jvm/engine/'" |
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

### GC

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Collector</th>
        <th>FAQ</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/jvm/gc/basic/'" |
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
where_exp: "item", "item.url contains '/java/jvm/gc/collector/'" |
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
where_exp: "item", "item.url contains '/java/jvm/gc/faq/'" |
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

## Performance

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/jvm/performance/'" |
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

## Sources

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/jvm/source/'" |
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

- [JVM 调优](https://www.bilibili.com/video/BV1ar4y1t7BG)
- [JVM 性能调优](https://www.bilibili.com/video/BV1Hr4y1t7i5)
- [JVM 底层原理](https://www.bilibili.com/video/BV17B4y1y75X)
- [马士兵老师 JVM 性能调优与多线程合集](https://www.bilibili.com/video/BV1Xv4y1N7cj)
- [黑马程序员 JVM 完整教程](https://www.bilibili.com/video/BV1yE411Z7AP)

尚硅谷宋红康 JVM 全套教程（详解 java 虚拟机）

- [黑马程序员JVM完整教程](https://www.bilibili.com/video/BV1yE411Z7AP)
- [黑马程序员JVM虚拟机入门到实战全套视频教程](https://www.bilibili.com/video/BV1r94y1b7eS)
- [尚硅谷宋红康 JVM 全套教程（详解 java 虚拟机）](https://www.bilibili.com/video/BV1PJ411n7xZ?p=363)
- [笔记：JVM](https://imlql.cn/categories/JVM/)
- [学习 Java 虚拟机笔记](https://gitee.com/tcl192243051/studyJVM/tree/master)


- [JVM GC 频繁优化](https://developer.aliyun.com/article/1252907)

- Baeldung
    - [A Guide to Java Profilers](https://www.baeldung.com/java-profilers)
    - [Different Ways to Capture Java Heap Dumps](https://www.baeldung.com/java-heap-dump-capture)
    - [Monitoring Java Applications with Flight Recorder](https://www.baeldung.com/java-flight-recorder-monitoring)
    - [Capturing a Java Thread Dump](https://www.baeldung.com/java-thread-dump)
    - [Diagnosing a Running JVM](https://www.baeldung.com/running-jvm-diagnose)
    - [External Debugging With JMXTerm](https://www.baeldung.com/java-jmxterm-external-debugging)
    - [Create and Detect Memory Leaks in Java](https://www.baeldung.com/java-create-detect-memory-leaks)
    - [Differences Between Heap Dump, Thread Dump and Core Dump](https://www.baeldung.com/java-heap-thread-core-dumps)
    - []()

- [JVM Troubleshooting](http://ksoong.org/troubleshooting/)
