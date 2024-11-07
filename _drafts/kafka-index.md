---
title: "Kafka"
image: /assets/images/kafka/apache-kafka-cover.png
permalink: /kafka.html
---

Apache Kafka is an open-source distributed event streaming platform.

Kafka separates **storage** from **compute**.
**Storage** is handled by the **brokers** and
**compute** is mainly handled by **consumers** or **frameworks built on top of consumers** (Kafka Streams, ksqlDB).


![Two Hard Problems in Distributed System](/assets/images/kafka/two-hard-problems.jpg)


## Basic

<table>
    <thead>
    <tr>
        <th>Basic</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/basic/'" |
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


## Installation

<table>
    <thead>
    <tr>
        <th rowspan="2" style="text-align: center;">Windows</th>
        <th rowspan="2" style="text-align: center;">Linux</th>
        <th colspan="2" style="text-align: center;">Docker</th>
    </tr>
    <tr>
        <th style="text-align: center;">Bitnami</th>
        <th style="text-align: center;">Confluentinc</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/installation/windows/'" |
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
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/installation/linux/'" |
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
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/installation/docker/bitnami/'" |
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
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/installation/docker/confluentinc/'" |
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

## Concept

<table>
    <thead>
    <tr>
        <th colspan="2" style="text-align: center;">Client</th>
        <th colspan="3" style="text-align: center;">Server</th>
    </tr>
    <tr>
        <th style="text-align: center;">Producer</th>
        <th style="text-align: center;">Consumer</th>
        <th style="text-align: center;">Broker</th>
        <th style="text-align: center;">Topic</th>
        <th style="text-align: center;">Partition</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/concept/producer/'" |
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
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/concept/consumer/'" |
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
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/concept/broker/'" |
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
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/concept/topic/'" |
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
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/concept/partition/'" |
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

## Command

<table>
    <thead>
      <tr>
        <th colspan="3" style="text-align: center">Client</th>
        <th colspan="3" style="text-align: center">Server</th>
        <th rowspan="2" style="text-align: center">Other</th>
    </tr>
    <tr>
        <th style="text-align: center">Basic</th>        
        <th style="text-align: center">Producer</th>
        <th style="text-align: center">Consumer</th>
        <th style="text-align: center">Broker</th>
        <th style="text-align: center">Topic</th>
        <th style="text-align: center">Partition</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/cmd/basic/'" |
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
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/cmd/producer/'" |
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
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/cmd/consumer/'" |
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
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/cmd/broker/'" |
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
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/cmd/topic/'" |
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
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/cmd/partition/'" |
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
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/cmd/other/'" |
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

## Java

### Client

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Producer</th>
        <th>Common</th>
        <th>Consumer</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/java/basic/'" |
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
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/java/client/producer/'" |
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
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/java/client/common/'" |
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
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/java/client/consumer/'" |
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

### Server

<table>
    <thead>
    <tr>
        <th>Server</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/java/server/'" |
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

## Advanced

<table>
    <thead>
    <tr>
        <th>Kraft</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/advanced/'" |
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

## Kafka 源码

<table>
    <thead>
    <tr>
        <th>源码</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.kafka |
where_exp: "item", "item.url contains '/kafka/src/'" |
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

- [APACHE KAFKA](https://kafka.apache.org/)
    - [Kafka Documentation](https://kafka.apache.org/documentation/)
- [Baeldung Tag: Kafka](https://www.baeldung.com/tag/kafka/)
- [Apache Kafka](https://docs.confluent.io/kafka/index.html)

- [2022 版 Kafka3.x 教程（从入门到调优，深入全面）](https://www.bilibili.com/video/BV1vr4y1677k?p=41) 12 小时
- [2022 版大数据 Kafka 教程](https://www.bilibili.com/video/BV1kU4y197yb?p=10)

- [Kafka3.0 集群搭建(Kraft 模式)- 尝鲜](https://zhuanlan.zhihu.com/p/448673264)

- [Kafka（一）使用 Docker Compose 安装单机 Kafka 以及 Kafka UI](https://blog.csdn.net/dghkgjlh/article/details/133418837)
- [Kafka（二）消息系统设计](https://blog.csdn.net/dghkgjlh/article/details/134221924)
- [Kafka（三）生产者发送 JSON 消息 + 使用统一序列化器 + 提升吞吐量](https://blog.csdn.net/dghkgjlh/article/details/134360108)
- [Kafka（四）消费者消费 JSON 消息 + 使用统一反序列化器 + 提升吞吐量](https://blog.csdn.net/dghkgjlh/article/details/134477889)
- [Kafka（五）消费者回调 + 定时重试 + 理解 Rebalance](https://blog.csdn.net/dghkgjlh/article/details/134610052)
- [Kafka（六）利用 Kafka Connect+Debezium 通过 CDC 方式将 Oracle 数据库的数据同步至 PostgreSQL 中](https://blog.csdn.net/dghkgjlh/article/details/134751835)

EBook

- [The Internals of Apache Kafka](https://books.japila.pl/kafka-internals/)
    - [japila-books/kafka-internals](https://github.com/japila-books/kafka-internals)

Kafka 调优

- [10 张图，5 个问题带你彻底理解 Kafka 架构调优](https://zhuanlan.zhihu.com/p/496547001)
- [胡夕：Apache Kafka监控与调优](https://zhuanlan.zhihu.com/p/43702590)

- [kafka修炼之道](https://space.bilibili.com/436492104/channel/collectiondetail?sid=353444)
