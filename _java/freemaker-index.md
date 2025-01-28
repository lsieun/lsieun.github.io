---
title: "Free Marker"
sequence: "101"
---

- FreeMarker概述
    - FreeMarker概念
    - FreeMaker特性
    - FreeMaker环境搭建
- FreeMarker数据类型
    - 布尔类型
    - 日期类型
    - 数值类型
    - 字符串类型
    - sequence类型
    - hash类型
- FreeMarker常见指令
    - assign 自定义变量指令
    - if elseif else 逻辑判断指令
    - list 遍历指令
    - macro 自定义指令
    - nested 占位符指令
    - import 导入指令
    - include 包含指令
- FreeMarker页面静态化
- FreeMarker运算符

## Basic

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/freemarker/basic/'" |
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

## Directive

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/freemarker/directive/'" |
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

- [Apache FreeMarker](https://freemarker.apache.org/)
  - [Built-in Reference](https://freemarker.apache.org/docs/ref_builtins.html)
    - [Alphabetical index](https://freemarker.apache.org/docs/ref_builtins_alphaidx.html)
    - [Built-ins for strings](https://freemarker.apache.org/docs/ref_builtins_string.html)
    - [Built-ins for numbers](https://freemarker.apache.org/docs/ref_builtins_number.html)
    - [Built-ins for date/time/date-time values](https://freemarker.apache.org/docs/ref_builtins_date.html)
    - [Built-ins for booleans](https://freemarker.apache.org/docs/ref_builtins_boolean.html)
    - [Built-ins for sequences](https://freemarker.apache.org/docs/ref_builtins_sequence.html)
    - [Built-ins for hashes](https://freemarker.apache.org/docs/ref_builtins_hash.html)
    - [Built-ins for nodes (for XML)](https://freemarker.apache.org/docs/ref_builtins_node.html)
    - [Loop variable built-ins](https://freemarker.apache.org/docs/ref_builtins_loop_var.html)
    - [Type independent built-ins](https://freemarker.apache.org/docs/ref_builtins_type_independent.html)
    - [Seldom used and expert built-ins](https://freemarker.apache.org/docs/ref_builtins_expert.html)
  - [Directive Reference](https://freemarker.apache.org/docs/ref_directives.html)
- [Java之利用Freemarker模板引擎实现代码生成器，提高效率](https://blog.csdn.net/huangwenyi1010/article/details/71249258)
- [一个java代码生成器的简单实现](https://blog.csdn.net/qiyongkang520/article/details/50822010)

视频：

- [最新最全FreeMarker超详细教程](https://www.bilibili.com/video/BV1do4y1m7Pp)

- [阿里：知行动手实验室](https://start.aliyun.com/)

在`mybatis-plus-generator-3.5.3.jar`内的`templates`下有多个模板用来生成Controller、Service等内容。
