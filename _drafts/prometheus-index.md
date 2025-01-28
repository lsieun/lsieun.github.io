---
title: "Prometheus"
image: /assets/images/prometheus/prometheus-monitoring.jpeg
permalink: /prometheus.html
---

Prometheus is an open-source systems **monitoring** and **alerting** toolkit.
It collects metrics from configured targets at given intervals, evaluates rule expressions, displays the results,
and can trigger alerts when specified conditions are observed.

```text
collect metrics --> evaluate rule --> display graph --> trigger alert
```

## Basic

{%
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/prometheus/basic/'" |
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

## Installation

{%
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/prometheus/installation/'" |
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

## Docker

{%
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/prometheus/container/'" |
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

## Conf

{%
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/prometheus/conf/'" |
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


<table>
  <thead>
  <tr>
    <th>Query</th>
    <th>Exporter</th>
    <th>Rule</th>
    <th>AlertManager</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td>
{%
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/prometheus/query/'" |
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
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/prometheus/exporter/'" |
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
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/prometheus/rule/'" |
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
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/prometheus/alert/'" |
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

## FAQ

{%
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/prometheus/faq/'" |
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

- [Prometheus DOCS](https://prometheus.io/docs/introduction/overview/)
    - [GETTING STARTED](https://prometheus.io/docs/prometheus/latest/getting_started/)

优秀文章：

- [Kubernetes 技术栈](https://www.k8stech.net/)
- [Prometheus 中文文档](https://www.prometheus.wang/)

GitHub:

- [GitHub: Prometheus](https://github.com/prometheus)
    - [prometheus](https://github.com/prometheus/prometheus): The Prometheus monitoring system and time series database.
    - [node_exporter](https://github.com/prometheus/node_exporter): Exporter for machine metrics
    - [client_java](https://github.com/prometheus/client_java): Prometheus instrumentation library for JVM applications
    - [alertmanager](https://github.com/prometheus/alertmanager): Prometheus Alertmanager
    - [windows_exporter](https://github.com/prometheus-community/windows_exporter)
    - [pushgateway](https://github.com/prometheus/pushgateway)


- [Prometheus 教程](https://www.bilibili.com/video/BV1m54y1o79r/)
- [基于 Prometheus+Grafana+Alertmanager+ 飞书通知的智能监控平台](https://www.bilibili.com/video/BV1HN4y157Zk/)
    - [Prometheus+Grafana 搭建监控系统](https://baijiahao.baidu.com/s?id=1753604903559944316&wfr=spider&for=pc)
- [Prometheus+Grafana（Kubernetes）企业级监控](https://www.bilibili.com/video/BV13o4y1U78E/)
- [速通 Windows 平台部署 prometheus+grafana 监控自机](https://www.bilibili.com/video/BV1uN4y1P72U/)
- [Prometheus+Grafana 全方位立体式监控系统](https://www.bilibili.com/video/BV1M24y1B7Fg)

- [Grafana 入门系列(1)——介绍](https://www.bilibili.com/video/BV1DA411s7L8)
- [Grafana 入门系列(2)——配置和启动](https://www.bilibili.com/video/BV1ma4y1n7S2)
- [Grafana 入门系列(3)——页面整体介绍](https://www.bilibili.com/video/BV1St4y1r7iQ/)
- [Grafana 入门系列(4)—— Dashboard 和 Panel](https://www.bilibili.com/video/BV1w5411n7Le)
- [Grafana 入门系列(5)——可视化 Graph 详解(上）](https://www.bilibili.com/video/BV1kU4y1x7dG)
- [Grafana 入门系列(6)——可视化 Graph 详解(中）](https://www.bilibili.com/video/BV18A411W7Cg)
- [Grafana 入门系列(7)——可视化 Graph 详解(下）](https://www.bilibili.com/video/BV1Lr4y1T7SD)
- [Grafana 入门系列(8)——可视化之 Stat、Gauge 和 Bar Gauge](https://www.bilibili.com/video/BV1TK411u7aC)
- [Grafana 入门系列(9)——可视化之 Table](https://www.bilibili.com/video/BV1454y1s7o9)
- [Grafana 入门系列(10)—— Dashboard Variable 的使用](https://www.bilibili.com/video/BV14i4y1c7T7/)
- [Grafana 入门系列(11)——插件 Plugin](https://www.bilibili.com/video/BV1B5411n71d)
- [Grafana 入门系列(12)——基于 Grafana 的报警](https://www.bilibili.com/video/BV11v411W7gu)


- [Vagrant 入门系列](https://www.bilibili.com/video/BV15t4y167zX)

- [Getting Started with Prometheus and Grafana](https://medium.com/devops-dudes/install-prometheus-on-ubuntu-18-04-a51602c6256b)