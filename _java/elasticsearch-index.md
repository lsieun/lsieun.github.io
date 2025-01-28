---
title: "Elasticsearch"
sequence: "101"
---

- 倒排索引
- ES的一些概念
- 安装ES、Kibana

Elasticsearch是与名为Logstash的数据收集和日志解析引擎以及名为Kibana的分析和可视化平台一起开发的。这三个产品被设计成一个集成解决方案，称为“Elastic
Stack”（以前称为“ELK stack”）。

```text
Elasticsearch + Kibana + Logstash + Beats
```



- Elasticsearch 是 Elastic Stack 的核心，负责存储、搜索、分析数据
- Logstash 和 Beats 负责数据抓取
- Kibana 负责数据可视化

Elasticsearch 是基于 Lucene

Lucene 的优势：

- 易扩展
- 高性能（基于倒排索引）

## Basic

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/elasticsearch/basic/'" |
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

## ES Java Client

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/elasticsearch/client/'" |
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

## Cluster

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/elasticsearch/cluster/'" |
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

- [Elasticsearch](https://www.elastic.co/elasticsearch/)
    - [Elastic Stack](https://www.elastic.co/elastic-stack/)
    - [Elasticsearch Guide](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)

视频

- [ElasticSearch教程入门到精通 v7.12](https://www.bilibili.com/video/BV1Gh411j7d6/)
- [Elasticsearch 8.x教程](https://www.bilibili.com/video/BV1Ea4y1u7xS/)
- [图灵 ElasticSearch v7.17.3](https://www.bilibili.com/video/BV1Th4y1W7mk)
- [尚硅谷 - ElasticSearch教程入门到精通 2021](https://www.bilibili.com/video/BV1hh411D7sb/)
