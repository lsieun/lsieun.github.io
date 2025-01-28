---
title: "Intro"
sequence: "101"
---

## 介绍

At the core of **Prometheus** is a **time-series database**
that can be queried with a powerful language for everything – this includes not only **graphing** but also **alerting**.
**Alerts** generated with Prometheus are usually sent to **Alertmanager** to deliver
via various media like email or Slack message.

```text
Prometheus (time-series database) --> Graph
Prometheus (time-series database) --> Alert --> Alert Manager --> Email/Slack
```

Prometheus collects and stores its **metrics** as time series data,
i.e. metrics information is stored with the **timestamp**
at which it was recorded, alongside optional key-value pairs called **labels**.

```text
metrics = data + timestamp + labels 
```

### Features

Prometheus's main features are:

- a multi-dimensional data model with time series data identified by metric name and key/value pairs
- PromQL, a flexible query language to leverage this dimensionality
- no reliance on distributed storage; single server nodes are autonomous
- time series collection happens via a pull model over HTTP
- pushing time series is supported via an intermediary gateway
- targets are discovered via service discovery or static configuration
- multiple modes of graphing and dashboarding support

### What are metrics?

In layperson terms, **metrics** are **numeric measurements**.

> metrics 是使用 number 进行测量

Time series means that changes are recorded over time.

> time series 意味着随时间而变化

What users want to measure differs from application to application.
For a web server it might be request times,
for a database it might be number of active connections or number of active queries etc.

> 测量的目标，也是变化的



## 发展历史

- 2012 年，由 SoundCloud 开发。
- 2016 年，Prometheus 加入 [Cloud Native Computing Foundation](https://cncf.io/)，成为 Kubernetes 之后第 2 个加入的项目。
    - 2016 年 03 月 10 日，Kubernetes 加入 CNCF。
    - 2016 年 05 月 09 日，Prometheus 加入 CNCF。

### 基本原理

Prometheus 的基本原理是通过 HTTP 协议周期性抓取被监控组件的状态，
任意组件只要提供对应的 HTTP 接口就可以接入监控，不需要任何 SDK 或者其他的集成过程。

输出被监控组件信息的 HTTP 接口被叫作 Exporter。
目前，开发常用的组件大部分都有 exporter 可以直接使用，例如 Nginx、MySQL、Linux 系统信息、Mongo、ES 等。

### Exporter

Prometheus 可以理解为一个 数据库+数据抓取工具，工具从各处抓来统一的数据，放入 Prometheus 这一个时间序列数据库中。
那如何保证各处的数据格式是统一的呢？就是通过 exporter。

Exporter 是一类数据采集组件的总称。
Exporter 负责从目标处搜集数据，并将其转化为 Promethues 支持的格式，它开放了一个 http 接口，以便 Prometheus 来抓取数据。

与传统的数据采集组件不同的是，Exporter 并不会主动向中央服务器发送数据，而是等待中央服务器（如 Prometheus 等）主动来抓取。

`https://github.com/prometheus` 有很多写好的 exporter，可以直接下载：

```text
https://github.com/prometheus
```

