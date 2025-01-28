---
title: "Spring Boot Logging"
sequence: "101"
---

### Basic

{%
assign filtered_posts = site.spring-boot |
where_exp: "item", "item.url contains '/spring-boot/logging/'" |
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

- [Spring Boot Logback and Log4j2 Extensions](https://www.baeldung.com/spring-boot-logback-log4j2)
- [Logging In Spring Boot](https://reflectoring.io/springboot-logging/)
- [Saving Time with Structured Logging](https://reflectoring.io/structured-logging/)
- [Per-Environment Logging with Plain Java and Spring Boot](https://reflectoring.io/profile-specific-logging-spring-boot/)

