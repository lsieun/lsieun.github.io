---
title: "Redis"
image: /assets/images/redis/redis-explained.jpg
permalink: /redis/redis-index.html
---

Redis (**RE**mote **DI**ctionary **S**ervice) is an open-source key-value database server.

## Basic

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>命令</th>
        <th>安装</th>
        <th>Docker(Official)</th>
        <th>Docker(Bitnami)</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/basic/'" |
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
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/cmd/'" |
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
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/installation/'" |
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
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/docker/official/'" |
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
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/docker/bitnami/'" |
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

## Conf

{%
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/conf/'" |
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

## Cache

<table>
    <thead>
    <tr>
        <th>Memory</th>
        <th>Persistence</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/memory/'" |
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
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/persistence/'" |
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

## Lua

{%
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/lua/'" |
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

## HA

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Replication</th>
        <th>Sentinel</th>
        <th>Cluster</th>
        <th>VS</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/ha/basic/'" |
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
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/ha/replication/'" |
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
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/ha/sentinel/'" |
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
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/ha/cluster/'" |
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
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/ha/vs/'" |
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

## Security

{%
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/security/'" |
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

## Client

### Jedis

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Advanced</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/client/jedis/basic/'" |
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
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/client/jedis/advanced/'" |
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

### Lettuce

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Advanced</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/client/lettuce/basic/'" |
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
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/client/lettuce/advanced/'" |
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

### Redisson

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Lock</th>
        <th>Other</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/client/redisson/basic/'" |
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
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/client/redisson/lock/'" |
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
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/client/redisson/other/'" |
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

### Spring

<table>
    <thead>
    <tr>
        <th>Spring</th>
        <th>Spring Boot</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/client/spring/basic/'" |
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
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/client/spring/boot/'" |
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

## Extra

{%
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/extra/'" |
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

## FAQ

{%
assign filtered_posts = site.redis |
where_exp: "item", "item.path contains 'redis/faq/'" |
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

- [lsieun/learn-java-redis](https://github.com/lsieun/learn-java-redis)

- [Redis](https://redis.io/)
    - [Redis Commands](https://redis.io/commands/)

- [Redis Sentinel vs Clustering](https://www.baeldung.com/redis-sentinel-vs-clustering)
- [Redis Explained](https://architecturenotes.co/redis/)

- [Baeldung Tag: Redis](https://www.baeldung.com/tag/redis)
    - Client
        - [Intro to Jedis – the Java Redis Client Library](https://www.baeldung.com/jedis-java-redis-client-library)
        - [Introduction to Lettuce – the Java Redis Client](https://www.baeldung.com/java-redis-lettuce)
        - [A Guide to Redis with Redisson](https://www.baeldung.com/redis-redisson)
    - Theme
        - [Spring Boot Cache with Redis](https://www.baeldung.com/spring-boot-redis-cache)
        - [Delete Everything in Redis](https://www.baeldung.com/redis-delete-data)
    - Spring Boot
        - [Using Redis with Spring Boot](https://bhanuchaddha.github.io/using-redis-with-spring-boot/)
    - Spring Data
        - [Introduction to Spring Data Redis](https://www.baeldung.com/spring-data-redis-tutorial)
    - Spring Boot Test
        - [Spring Boot – Testing Redis With Testcontainers](https://www.baeldung.com/spring-boot-redis-testcontainers)
        - [Embedded Redis Server with Spring Boot Test](https://www.baeldung.com/spring-embedded-redis)
