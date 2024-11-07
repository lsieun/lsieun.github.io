---
title: "Java Concurrency"
image: /assets/images/java/concurrency/concurrency-vs-parallelism.jpg
permalink: /java/java-concurrency-index.html
---

Java Concurrency. The more ordering we can ensure, the better we can reason about the behaviour of the program.

## 基础

<table>
    <thead>
    <tr>
        <th>Overview</th>
        <th>Concept</th>
        <th>其它</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/concurrency/basic/overview/'" |
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
where_exp: "item", "item.path contains 'java/concurrency/basic/concept/'" |
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
where_exp: "item", "item.path contains 'java/concurrency/basic/other/'" |
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

## 硬件/进程

<table>
    <thead>
    <tr>
        <th>CPU</th>
        <th>Memory</th>
        <th>OS</th>
        <th>Process</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/concurrency/hardware/cpu/'" |
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
where_exp: "item", "item.path contains 'java/concurrency/hardware/memory/'" |
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
where_exp: "item", "item.path contains 'java/concurrency/hardware/os/'" |
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
where_exp: "item", "item.path contains 'java/concurrency/hardware/process/'" |
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

## 线程

### 单个线程

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Lifecycle</th>
        <th>Trivial</th>
        <th>FAQ</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/concurrency/thread/individual/basic/'" |
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
where_exp: "item", "item.path contains 'java/concurrency/thread/individual/lifecycle/'" |
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
where_exp: "item", "item.path contains 'java/concurrency/thread/individual/trivial/'" |
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
where_exp: "item", "item.path contains 'java/concurrency/thread/individual/faq/'" |
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

### Virtual Thread

- [The Long Road to Java Virtual Threads](https://dzone.com/articles/the-long-road-to-java-virtual-threads)

### 线程池

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>线程池</th>
        <th>共享</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/concurrency/thread/pool/basic/'" |
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
where_exp: "item", "item.path contains 'java/concurrency/thread/pool/pool/'" |
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
where_exp: "item", "item.path contains 'java/concurrency/thread/pool/share/'" |
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

## 资源共享

![](/assets/images/java/concurrency/pool/thread-pool-executor-illustration.png)

### 线程安全

```text
多线程 --> 数据不一致 --> 线程安全 --> 锁 --> 死锁
                              --> CAS
```

<table>
    <thead>
    <tr>
        <th>基础</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/concurrency/shared-resource/safety/'" |
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

### 锁

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>synchronized</th>
        <th>JUC 锁</th>
        <th>对比</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/concurrency/shared-resource/lock/basic/'" |
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
where_exp: "item", "item.path contains 'java/concurrency/shared-resource/lock/synchronized/'" |
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
where_exp: "item", "item.path contains 'java/concurrency/shared-resource/lock/juc-lock/'" |
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
where_exp: "item", "item.path contains 'java/concurrency/shared-resource/lock/vs/'" |
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

### 死锁

<table>
    <thead>
    <tr>
        <th>死锁</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/concurrency/shared-resource/dead-lock/'" |
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

### CAS （无锁）

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Number</th>
        <th>Object</th>
        <th>Array</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/concurrency/shared-resource/cas/basic/'" |
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
where_exp: "item", "item.path contains 'java/concurrency/shared-resource/cas/num/'" |
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
where_exp: "item", "item.path contains 'java/concurrency/shared-resource/cas/obj/'" |
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
where_exp: "item", "item.path contains 'java/concurrency/shared-resource/cas/array/'" |
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

### 其它数据

<table>
    <thead>
    <tr>
        <th>ThreadLocal</th>
        <th>JUC 并发容器</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/concurrency/shared-resource/threadlocal/'" |
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
where_exp: "item", "item.path contains 'java/concurrency/shared-resource/coll/'" |
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

## 线程协作

### 顺序控制

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>JUC</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/concurrency/cooperate/basic/'" |
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
where_exp: "item", "item.path contains 'java/concurrency/cooperate/juc/'" |
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

### 数据交换

<table>
    <thead>
    <tr>
        <th>JUC</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/concurrency/cooperate/data/'" |
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

### 模式

<table>
    <thead>
    <tr>
        <th>执行顺序</th>
        <th>交换数据</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/concurrency/cooperate/pattern/execution-order/'" |
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
where_exp: "item", "item.path contains 'java/concurrency/cooperate/pattern/data-exchange/'" |
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

## 经典问题

<table>
    <thead>
    <tr>
        <th style="text-align: center;">经典问题</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/concurrency/problems/'" |
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

书籍参考

- [ ] 《Mastering Design Patterns in Java: Essential Skills》 Ed Norex
    - [ ] Chapter 5. Concurrency Patterns in Java: Managing Multi-Threading and Synchronization

- [Baeldung Tag: Java Concurrency](https://www.baeldung.com/category/java/java-concurrency)
    - lifecycle
        - [How to Start a Thread in Java](https://www.baeldung.com/java-start-thread)
        - [wait and notify() Methods in Java](https://www.baeldung.com/java-wait-notify)
        - [Difference Between Wait and Sleep in Java](https://www.baeldung.com/java-wait-and-sleep)
        - [Understanding java.lang.Thread.State: WAITING (parking)](https://www.baeldung.com/java-lang-thread-state-waiting-parking)
    - Executor
        - [Thread vs. Single Thread Executor Service](https://www.baeldung.com/java-single-thread-executor-service)
        - [A Guide to the Java ExecutorService](https://www.baeldung.com/java-executor-service-tutorial)
    - Safety
        - Atomic
            - [An Introduction to Atomic Variables in Java](https://www.baeldung.com/java-atomic-variables)
    - Other
        - [Overview of the java.util.concurrent](https://www.baeldung.com/java-util-concurrent)
        - [Guide to the Fork/Join Framework in Java](https://www.baeldung.com/java-fork-join)
        - [Guide to java.util.concurrent.Locks](https://www.baeldung.com/java-concurrent-locks)
        - [Passing Parameters to Java Threads](https://www.baeldung.com/java-thread-parameters)
        - [A Guide to False Sharing and @Contended](https://www.baeldung.com/java-false-sharing-contended)
        - [Design Principles and Patterns for Highly Concurrent Applications](https://www.baeldung.com/concurrency-principles-patterns)
        - [The Dining Philosophers Problem in Java](https://www.baeldung.com/java-dining-philoshophers)
        - [Java Concurrency Interview Questions (+ Answers)](https://www.baeldung.com/java-concurrency-interview-questions)
        - [Guide to the Java Phaser](https://www.baeldung.com/java-phaser)
        - [Start Two Threads at the Exact Same Time in Java](https://www.baeldung.com/java-start-two-threads-at-same-time)
        - [How to Kill a Java Thread](https://www.baeldung.com/java-thread-stop)
        - [Structured Concurrency in Java 19](https://www.baeldung.com/java-structured-concurrency)
- [Concurrency Patterns](https://www.dre.vanderbilt.edu/~schmidt/POSA/POSA2/conc-patterns.html)

- [GitHub: RedSpider1/concurrent](https://github.com/RedSpider1/concurrent)
    - [GitBook: 深入浅出 Java 多线程](https://redspider.gitbook.io/concurrent/)

- [奥义喷火恐龙 JUC](https://blog.csdn.net/fine____/category_11391367.html)

- [Alibaba Java Coding Guidelines](https://alibaba.github.io/Alibaba-Java-Coding-Guidelines/)
- [SEI CERT Oracle Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)

- [Java Multithreading for Senior Engineering Interviews](https://www.educative.io/courses/java-multithreading-for-senior-engineering-interviews)
  付费内容
    - [Annotations](https://www.educative.io/courses/java-multithreading-for-senior-engineering-interviews/annotations)
      @ThreadSafe
- [Guide to Multithreading Annotations in Java](https://medium.com/double-pointer/guide-to-multithreading-annotations-in-java-a61b94e6bf23)

- [Race Conditions and Critical Sections](https://jenkov.com/tutorials/java-concurrency/race-conditions-and-critical-sections.html)

- [Java并发全解之并发理论概述](https://www.bilibili.com/video/BV15j411A78S/)

- [全网最硬核 Java 新内存模型解析与实验单篇版（不断更新QA中）](https://juejin.cn/post/7080869319407566879)

- [Introduction to Thread Pools in Java: A Comprehensive Guide](https://delta-dev-software.fr/introduction-to-thread-pools-in-java-a-comprehensive-guide)
