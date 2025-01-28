---
title: "RESTFul"
sequence: "116"
---

## RESTFul

REST: Representational State Tranfer

HTTP协议里面有四个表示操作方式的动词：GET、POST、PUT和DELETE。

它们分别对应四种基本操作：GET用来获取资源，POST用来新建资源，PUT用来更新资源，DELETE用来删除资源。


```text
<filter>
    <filter-name>HiddenHttpMethodFilter</filter-name>
    <filter-class>org.springframework.web.filter.HiddenHttpMethodFilter</filter-class>
</filter>
<filter-mapping>
    <filter-name>HiddenHttpMethodFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```
