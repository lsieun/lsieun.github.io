---
title: "Java Logging"
image: /assets/images/java/log/log-running.jpg
permalink: /java/java-logging-index.html
---

Logging is the process of printing or recording the activities in an application
which helps the developers to understand and analyze when there are any unexpected errors in the system.

## JUL

Java Logging API (`java.util.logging`, also called **JUL**):
The Java Logging API is a built-in logging framework in the Java standard library.
It provides basic logging features such as log levels, loggers, and handlers,
but lacks some advanced features compared to other logging frameworks.

- [jenkov.com](https://jenkov.com/)
    - [Java Logging](https://jenkov.com/tutorials/java-logging/index.html)

## SLF4J

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Conf</th>
        <th>Advanced</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/logging/slf4j/basic/'" |
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
where_exp: "item", "item.path contains 'java/logging/slf4j/conf/'" |
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
where_exp: "item", "item.path contains 'java/logging/slf4j/advanced/'" |
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

## Logback

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Configuration</th>
        <th>Extra</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/logging/logback/basic/'" |
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
where_exp: "item", "item.path contains 'java/logging/logback/conf/'" |
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
where_exp: "item", "item.path contains 'java/logging/logback/extra/'" |
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

- [lsieun/learn-java-logging](https://github.com/lsieun/learn-java-logging)

- [SL4J](https://www.slf4j.org/index.html)
    - [SLF4J user manual](https://www.slf4j.org/manual.html)
    - []()

- [MVN Repository: SLF4J](https://mvnrepository.com/artifact/org.slf4j)
    - [slf4j-api](https://mvnrepository.com/artifact/org.slf4j/slf4j-api)
    - [slf4j-nop](https://mvnrepository.com/artifact/org.slf4j/slf4j-nop)
    - [slf4j-simple](https://mvnrepository.com/artifact/org.slf4j/slf4j-simple)
    - [logback-classic][mvn-repo-logback-classic-url]

- [Logback Project](https://logback.qos.ch/)
    - [Logback documentation](https://logback.qos.ch/documentation.html)
        - [The logback manual](https://logback.qos.ch/manual/index.html)
            - [Chapter 1: Introduction to logback](https://logback.qos.ch/manual/introduction.html)
            - [Chapter 2: Architecture](https://logback.qos.ch/manual/architecture.html)
            - [Chapter 3: Configuration](https://logback.qos.ch/manual/configuration.html)
            - [Chapter 4: Appenders](https://logback.qos.ch/manual/appenders.html)
            - [Chapter 5: Encoders](https://logback.qos.ch/manual/encoders.html)
            - [Chapter 6: Layouts](https://logback.qos.ch/manual/layouts.html)
                - [Conversion Word](https://logback.qos.ch/manual/layouts.html#conversionWord)
                - [Format modifiers](https://logback.qos.ch/manual/layouts.html#formatModifiers)
            - [Chapter 7: Filters](https://logback.qos.ch/manual/filters.html)
            - [Chapter 8: Mapped Diagnostic Contexts](https://logback.qos.ch/manual/mdc.html)
            - [Chapter 9: Logging Separation](https://logback.qos.ch/manual/loggingSeparation.html)
            - [Chapter 10: Joran](https://logback.qos.ch/manual/onJoran.html)
            - [Chapter 11: Migration from log4j](https://logback.qos.ch/manual/migrationFromLog4j.html)
            - [Chapter 12: Receivers](https://logback.qos.ch/manual/receivers.html)
            - [Chapter 13: Using SSL](https://logback.qos.ch/manual/usingSSL.html)

- Baeldung
    - [Tag: Logback](https://www.baeldung.com/tag/logback)
        - [A Guide To Logback](https://www.baeldung.com/logback)
        - [Mask Sensitive Data in Logs With Logback](https://www.baeldung.com/logback-mask-sensitive-data)
        - [Spring Boot Logback and Log4j2 Extensions](https://www.baeldung.com/spring-boot-logback-log4j2)
        - [Sending Emails with Logback](https://www.baeldung.com/logback-send-email)
        - [Improved Java Logging with Mapped Diagnostic Context (MDC)](https://www.baeldung.com/mdc-in-log4j-2-logback)
        - [A Guide to Rolling File Appenders](https://www.baeldung.com/java-logging-rolling-file-appenders)
    - [Tag: SLF4J](https://www.baeldung.com/tag/slf4j)
        - [Introduction to SLF4J](https://www.baeldung.com/slf4j-with-log4j2-logback)
    - [Introduction to Java Logging](https://www.baeldung.com/java-logging-intro)

- [Solving Your Logging Problems with Logback](https://stackify.com/logging-logback/)
- [Java Logging Frameworks: Summary and Best Practices](https://www.alibabacloud.com/blog/java-logging-frameworks-summary-and-best-practices_598223)

- [Mastering Java Logging Frameworks with Examples — Part 1](https://medium.com/hello-java/master-java-logging-frameworks-with-examples-part-1-6c20bfbf26c5)
- [Mastering Java Logging Frameworks with Examples — Part 2](https://medium.com/hello-java/mastering-java-logging-frameworks-with-examples-part-2-a5d6d039bafb)
- [Java Logging Best Practices: 10+ Tips You Should Know to Get the Most Out of Your Logs](https://sematext.com/blog/java-logging-best-practices/)
- [SLF4J Tutorial: Example of How to Configure It for Logging Java Applications](https://sematext.com/blog/slf4j-tutorial/)
- [Logback Tutorial](https://howtodoinjava.com/logback/logback-tutorial/)

- [How to Log to the Console in Color](https://www.baeldung.com/java-log-console-in-color)

[mvn-repo-logback-classic-url]: https://mvnrepository.com/artifact/ch.qos.logback/logback-classic
