---
title: "ActiveMQ"
sequence: "101"
---

There are currently two "flavors" of ActiveMQ available - 
the well-known "classic" broker and 
the "next generation" broker code-named Artemis.
Once Artemis reaches a sufficient level of feature parity with the "Classic" code-base
it will become the next major version of ActiveMQ.

## Basic

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/activemq/basic/'" |
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

- [lsieun/learn-java-activemq](https://github.com/lsieun/learn-java-activemq)

- [Apache ActiveMQ](https://activemq.apache.org/)

- [Embedding Apache ActiveMQ Artemis](https://activemq.apache.org/components/artemis/documentation/1.0.0/embedding-activemq.html)
- [Integrate embedded Apache ActiveMQ 5 (Classic) JMS Broker with Spring Boot application](https://codeaches.com/spring-boot/embedded-activemq-5-jms-broker)
- [Integrate embedded Apache ActiveMQ Artemis JMS Broker with Spring Boot application](https://codeaches.com/spring-boot/embedded-activemq-artemis-jms-broker)
