---
title: "Java Servlet"
image: /assets/images/java/servlet/what-is-a-java-servlet.png
permalink: /java-servlet.html
---

Java Servlet

![](/assets/images/java/servlet/servlet-architecture-main.webp)

![](/assets/images/java/servlet/servlet-class-hierarchy.jpg)

![](/assets/images/java/servlet/servlet-class-hierarchy-2.jpg)

## Content

### Basic

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/servlet/basic/'" |
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

### FAQ

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/servlet/faq/'" |
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

### Servlet API

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/servlet/api/'" |
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

### File

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/servlet/file/'" |
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

### Servlet应用

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/servlet/servlet-app/'" |
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

### Cookie

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/servlet/cookie/'" |
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

### Session

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/servlet/session/'" |
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

### Filter

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/servlet/filter/'" |
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

### Listener

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/servlet/listener/'" |
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

### Servlet3

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/servlet/servlet3/'" |
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

- [Java Servlet Specification](https://javaee.github.io/servlet-spec/)
- [Jakarta Servlet](https://jakarta.ee/specifications/servlet/)
    - [Jakarta Servlet 4.0](https://jakarta.ee/specifications/servlet/4.0/)
    - [Jakarta Servlet 5.0](https://jakarta.ee/specifications/servlet/5.0/)
    - [Jakarta Servlet 6.0](https://jakarta.ee/specifications/servlet/6.0/)
- [Media Types](https://www.iana.org/assignments/media-types/media-types.xhtml)

- Baeldung:
    - [Introduction to Java Servlets](https://www.baeldung.com/intro-to-servlets)

文章：

- [廖雪峰：Servlet 规范](https://www.liaoxuefeng.com/wiki/1545956031987744/1545956220731425)
- [JSP and Servlet Overview](https://www.pearsonitcertification.com/articles/article.aspx?p=29786&seqNum=4)
- [Web Server VS Application Server VS Web Containers](https://lin-4.gitbook.io/java-ee-notebook/different-between-servlet-and-jsp)
- [Java Servlet Container vs Application server vs Web server](https://pathum-liyanagama.medium.com/java-servlet-container-vs-application-server-vs-web-server-7471f89402ac)
- [Introduction to Servlet Architecture](https://www.educba.com/servlet-architecture/)
- [What is Web Application?](https://www.educba.com/what-is-web-application/)
- [Java Servlet Architecture](https://www.testingdocs.com/java-servlet-architecture/)
- [Introduction to Java Servlets](http://j2eetutorials.50webs.com/servlet-hierarchy.html)

视频：

- [李兴华编程训练营](https://www.yootk.com/)
    - [Servlet 详解](https://www.bilibili.com/video/BV1R54y177Et/?p=87)
- [千锋教育Servlet视频教程：Servlet从入门到精通](https://www.bilibili.com/video/BV1Ga4y1Y7Ah?p=10)
- [最好的Servlet教程](https://www.bilibili.com/video/BV1Kr4y1V7ZE/)
- [黑马：JavaWeb快速入门教程](https://www.bilibili.com/video/BV1mE411h7Co/)
    - P203~P313: Servlet, JSP, EL, Filter
- [黑马程序员SpringBoot2全套视频教程](https://www.bilibili.com/video/BV15b4y1a7yG)
