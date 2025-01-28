---
title: "面试 Interview"
image: /assets/images/interview/interview-index.webp
published: false
---

面试

- [ ] Java
    - [ ] 多线程
- [ ] JVM
    - [ ] 垃圾回收
- [ ] MySQL
    - [ ] MySQL 优化
- [ ] MyBatis
    - [ ] 二级缓存
- [ ] Spring
    - [ ] Bean 的生命周期
    - [ ] Spring AOP 的实现原理
- [ ] Spring MVC
    - [ ] Spring MVC 的启动流程
- [ ] Spring Boot
  - [ ] Spring Boot 的启动流程
  - [ ] Spring Boot 的自动配置
- [ ] Spring Cloud

## Java

{%
assign filtered_posts = site.interview |
where_exp: "item", "item.url contains '/interview/java/'" |
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

## 数据存储

{%
assign filtered_posts = site.interview |
where_exp: "item", "item.url contains '/interview/db/'" |
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

## Spring

{%
assign filtered_posts = site.interview |
where_exp: "item", "item.url contains '/interview/spring/'" |
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

视频：

- [黑马程序员深入学习Java并发编程](https://www.bilibili.com/video/BV16J411h7Rd/)
    - 评论说很好
    - 笔记：https://github.com/Seazean/JavaNote/blob/main/Prog.md
    - 笔记：https://www.yuque.com/mo_ming/gl7b70/gw2xt5
- [2023最新多线程面试27问](https://www.bilibili.com/video/BV1xM411s7tW/)
- [java多线程面试题合集](https://www.bilibili.com/video/BV1EV4y1T7hb/)
- [310道程序员必刷Java面试题，7天刷完直接面试上岸（Java基础、spring全家桶、MySQL、多线程高并](https://www.bilibili.com/video/BV1EN411e77V/)
- [【马士兵教育】2023新版Java面试题300问](https://www.bilibili.com/video/BV1ay4y1D7o7)
- [牛客网上的Java面试八股文整理成了视频合集](https://www.bilibili.com/video/BV18S4y1r7NW/)
- [马士兵-面试突击-Java速成班](https://www.bilibili.com/video/BV1cF411R7Ko/)



