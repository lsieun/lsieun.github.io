---
title: "MyBatis Plus"
sequence: "201"
---

## 概览

{%
assign filtered_posts = site.db |
where_exp: "item", "item.url contains '/db/mybatis-plus/basic/'" |
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

## 基本功能：BaseMapper

{%
assign filtered_posts = site.db |
where_exp: "item", "item.url contains '/db/mybatis-plus/mapper/'" |
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

## 基本功能：IService

{%
assign filtered_posts = site.db |
where_exp: "item", "item.url contains '/db/mybatis-plus/service/'" |
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

## 基本功能：Annotation

{%
assign filtered_posts = site.db |
where_exp: "item", "item.url contains '/db/mybatis-plus/annotation/'" |
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

## 基本功能：Wrapper

{%
assign filtered_posts = site.db |
where_exp: "item", "item.url contains '/db/mybatis-plus/wrapper/'" |
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

## 插件

{%
assign filtered_posts = site.db |
where_exp: "item", "item.url contains '/db/mybatis-plus/plugin/'" |
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

## Type

{%
assign filtered_posts = site.db |
where_exp: "item", "item.url contains '/db/mybatis-plus/type/'" |
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

- [MyBatis-Plus](https://baomidou.com/)

B站视频

- [Mybatis-Plus 整合 SpringBoot 实战教程](https://www.bilibili.com/video/BV1pK411W7Hu)

- [【尚硅谷】2022 版 MyBatisPlus 教程](https://www.bilibili.com/video/BV12R4y157Be)


```text
链接：https://pan.baidu.com/s/16QHR4LIG8vFPnHwEfV8x2Q?pwd=n32x
提取码：n32x 
```

- [SpringBoot MybatisPlus 实现数据库表字段加解密 提升数据安全](https://www.bilibili.com/video/BV1LM411w7oS/)
- [SpringBoot MybatisPlus 多租户 数据隔离](https://www.bilibili.com/video/BV1ia4y1K7s1/)
- [SPRINGBOOT+MYBATIS/MYBATIS-PLUS 根据实体类自动创建数据库表](https://blog.csdn.net/HDXxiazai/article/details/121242923)
