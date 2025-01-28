---
title: "JMX"
sequence: "jmx"
---

## Three-Level Model

{%
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/jmx/'" |
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

## JMX Connectors

{%
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/jmx/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 300 and num < 400 %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

## All

{%
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/jmx/'" |
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



There are two types of [profiling implementations](https://stackoverflow.com/a/19912148/10202942),
via **sampling** and via **instrumentation**.

## Sampling

**Sampling** works by recording stack traces (samples) periodically.
This does not trace every method call but still detect hot spots as they occur multiple times in the recorded stack traces.
The advantage is that it does not require agents nor special APIs and you have the control over the profiler's overhead.
You can implement it via the `ThreadMXBean` which allows you to get stack traces of all running threads.
In fact, even a `Thread.getAllStackTraces()` would do but the `ThreadMXBean` provides more detailed information about the threads.

## instrumentation

Profilers hunting for every method invocation
without going through the debugging API use instrumentation to add notification code to every method they are interested in.
The advantage is that they never miss a method invocation but on the other hand they are adding a significant overhead to the execution
which might influence the result when searching for hot spots.
And it's way more complicated to implement. I can't give you a code example for such a byte code transformation.

The `Instrumentation` API is provided to Java agents only but in case you want to go into the `Instrumentation` direction,
here is a program which demonstrates how to connect to its own JVM and load itself as a Java agent:

```java

```

## 参考书籍

- [Beginning Java SE 6 Platform: From Novice to Professional](#)的CHAPTER 7. Monitoring and Management

## Reference

- [ ] [Basic Introduction to JMX](https://www.baeldung.com/java-management-extensions)

- [Lesson: Overview of the JMX Technology](https://docs.oracle.com/javase/tutorial/jmx/overview/index.html)
- [Java Management Extensions (JMX)](https://www.oracle.com/java/technologies/javase/javamanagement.html)

- [JMX Documentation](https://www.oracle.com/java/technologies/javase/docs-jmx-jsp.html)
- [Java Management Extensions (JMX) Best Practices](https://www.oracle.com/java/technologies/javase/management-extensions-best-practices.html)
- [Java 17: Java Management Extensions Guide](https://docs.oracle.com/en/java/javase/17/jmx/jmx-technology-versions.html)
- [Java 11: Monitoring and Management Guide](https://docs.oracle.com/en/java/javase/11/management/monitoring-and-management-using-jmx-technology.html)
- [Java 11: Java Management Extensions Guide](https://docs.oracle.com/en/java/javase/11/jmx/using-jmx-agents.html)
- [Java 8: Monitoring and Management for the Java Platform](https://docs.oracle.com/javase/8/docs/technotes/guides/management/index.html)
- [Java 8: Java Management Extensions (JMX) Technology Overview](https://docs.oracle.com/javase/8/docs/technotes/guides/jmx/overview/JMXoverviewTOC.html)
  - [3. Instrumenting Your Resources for JMX Technology](https://docs.oracle.com/javase/8/docs/technotes/guides/jmx/overview/instrumentation.html#wp998567)
  - [4. Using JMX Agents](https://docs.oracle.com/javase/8/docs/technotes/guides/jmx/overview/agent.html#wp996882)
- [Java 7: MXBean specification](https://docs.oracle.com/javase/7/docs/api/javax/management/MXBean.html#MXBean-spec)
- [MX4J English Documentation](http://mx4j.sourceforge.net/docs/index.html)
  - [Chapter 3. JSR 160 (JMX Remoting) Explained](http://mx4j.sourceforge.net/docs/ch03s04.html)

- [JSR 3: JavaTM Management Extensions (JMX) Specification](https://jcp.org/en/jsr/detail?id=3)
