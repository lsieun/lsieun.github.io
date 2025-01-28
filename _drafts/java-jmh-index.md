---
title: "JMH"
image: /assets/images/java/jmh/jmh-cover.png
permalink: /java-jmh.html
---

**Java Microbenchmark Harness** (**JMH**) is a Java harness for
building, running, and analysing nano/micro/milli/macro benchmarks
written in Java and other languages targeting the JVM.

## Content

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/jmh/'" |
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

- [GitHub: openjdk/jmh](https://github.com/openjdk/jmh)
- [JMH Visualizer](https://jmh.morethan.io/)

- [Baeldung Tag: JMH](https://www.baeldung.com/tag/jmh)
    - [Microbenchmarking with Java](https://www.baeldung.com/java-microbenchmark-harness)
- [JMH - Java Microbenchmark Harness](https://jenkov.com/tutorials/java-performance/jmh.html)
- [Java Microbenchmark Harness (JMH)](https://dzone.com/articles/java-microbenchmark-harness-jmh)

视频

- [基准测试框架JMH的使用](https://www.youtube.com/watch?v=EaEavx7k6-w&ab_channel=%E9%BB%91%E9%A9%AC%E7%A8%8B%E5%BA%8F%E5%91%98)
