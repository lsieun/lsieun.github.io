---
title: "MySQL"
image: /assets/images/db/mysql/mysql-cover.avif
permalink: /mysql.html
---

MySQL

```text
select 查询列表
from 表名;
```

特点：

- 查询列表可以是：表中的字段、常量值、表达式、函数
- 查询的结果是一个虚拟的视图

SQL 优化

- 创建索引、创建联合索引，减少回表，少使用函数查询

## Basic

<table>
    <thead>
    <tr>
        <th>基础</th>
        <th>配置</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.mysql |
where_exp: "item", "item.url contains '/mysql/basic/'" |
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
assign filtered_posts = site.mysql |
where_exp: "item", "item.url contains '/mysql/config/'" |
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

## 安装

<table>
    <thead>
    <tr>
        <th>Windows</th>
        <th>Linux</th>
        <th>Docker</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.mysql |
where_exp: "item", "item.url contains '/mysql/installation/windows/'" |
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
assign filtered_posts = site.mysql |
where_exp: "item", "item.url contains '/mysql/installation/linux/'" |
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
assign filtered_posts = site.mysql |
where_exp: "item", "item.url contains '/mysql/installation/docker/'" |
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

## 内置

<table>
    <thead>
    <tr>
        <th>数据类型</th>
        <th>函数</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.mysql |
where_exp: "item", "item.url contains '/mysql/builtin/type/'" |
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
assign filtered_posts = site.mysql |
where_exp: "item", "item.url contains '/mysql/builtin/function/'" |
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

## SQL 语句

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>DDL</th>
        <th>DML</th>
        <th>DCL</th>
        <th>常用SQL语句</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.mysql |
where_exp: "item", "item.url contains '/mysql/sql/basic/'" |
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
assign filtered_posts = site.mysql |
where_exp: "item", "item.url contains '/mysql/sql/ddl/'" |
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
assign filtered_posts = site.mysql |
where_exp: "item", "item.url contains '/mysql/sql/dml/'" |
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
assign filtered_posts = site.mysql |
where_exp: "item", "item.url contains '/mysql/sql/dcl/'" |
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
assign filtered_posts = site.mysql |
where_exp: "item", "item.url contains '/mysql/sql/common/'" |
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

## MySQL 脚本

{%
assign filtered_posts = site.mysql |
where_exp: "item", "item.url contains '/mysql/script/'" |
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

## MySQL 性能优化

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>存储引擎</th>
        <th>索引</th>
        <th>事务</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.mysql |
where_exp: "item", "item.url contains '/mysql/performance/basic/'" |
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
assign filtered_posts = site.mysql |
where_exp: "item", "item.url contains '/mysql/performance/engine/'" |
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
assign filtered_posts = site.mysql |
where_exp: "item", "item.url contains '/mysql/performance/index/'" |
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
assign filtered_posts = site.mysql |
where_exp: "item", "item.url contains '/mysql/performance/transaction/'" |
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

## 数据库扩展

数据库的扩展方式主要包括：业务分库、主从复制、数据库分表。

需要选择合适的方式去应对数据规模的增长，以应对逐渐增长的访问压力和数据量。

### 数据库分表

将**不同业务数据**分散存储到**不同的数据库服务器**，能够支撑百万甚至千万用户规模的业务；
但如果业务继续发展，**同一业务的单表数据**也会达到单台数据库服务器的处理瓶颈。
例如，淘宝的几亿用户数据，如果全部存放在一台数据库服务器的一张表中，肯定是无法满足性能要求的，
此时就需要对单表数据进行拆分。

单表数据拆分有两种方式：**垂直分表**和**水平分表**。

<table>
    <thead>
    <tr>
        <th>高级</th>
        <th>用户和权限管理</th>
        <th>备份和还原</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.mysql |
where_exp: "item", "item.url contains '/mysql/maintenance/advanced/'" |
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
assign filtered_posts = site.mysql |
where_exp: "item", "item.url contains '/mysql/maintenance/user/'" |
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
assign filtered_posts = site.mysql |
where_exp: "item", "item.url contains '/mysql/maintenance/backup/'" |
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

- [MySQL Documentation](https://dev.mysql.com/doc/)
    - [MySQL 8.0 Reference Manual](https://dev.mysql.com/doc/refman/8.0/en/)
    - [Java, JDBC, and MySQL Types](https://dev.mysql.com/doc/connector-j/8.0/en/connector-j-reference-type-conversions.html)
    - [Functions and Operators](https://dev.mysql.com/doc/refman/8.0/en/functions.html)

- [MySQL Functions](https://www.w3schools.com/sqL/sql_ref_mysql.asp)

视频：

- [韩立刚-MySQL数据库管理（安全设置+管理授权用户+备份还原）](https://edu.51cto.com/course/5054.html)
- [MySQL数据库高级开发（自定义函数+触发器+索引）视频课程](https://edu.51cto.com/course/5053.html)
- [MySQL数据库深度讲解（设计+SQL语句）视频课程](https://edu.51cto.com/course/5052.html)
- [mySQL8数据库设计和开发](https://edu.51cto.com/course/29252.html)
- [MySQL_基础+高级篇- 数据库](https://www.bilibili.com/video/BV12b411K7Zu/)

文章

- [SQL JOINs](https://learnsql.com/blog/sql-joins/)
- [一分钟让你搞明白 left join、right join和join的区别](https://blog.csdn.net/Li_Jian_Hui_/article/details/105801454)

- [通过 docker-compose 快速部署 MySQL](https://juejin.cn/post/7238570834343264315)


