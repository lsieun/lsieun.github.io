---
title: "Intro"
sequence: "101"
---

```text
https://skywalking.apache.org
```

```text
https://mirrors.tuna.tsinghua.edu.cn/apache/skywalking/
```

## Skywalking 概念

URL:

```text
http://demo.skywalking.apache.org/
```

- Username: `skywalking`
- Password: `skywalking`

关键概念：

- 服务（抽象的概念，由一组服务实例构成）
- 服务实例（具体的、运行的应用）
- 端点（请求的 URI 地址，一个服务实例可以提供许多端点）

架构组件：

- 探针（Agent） - 客户端
- 服务端（OAP） Observability Analysis Platform
- 存储（Storage）
    - ElasticSearch
    - H2
    - MySQL 集群（Sharding-Sphere 管理）
- 用户界面（UI）

## 分析语言

SkyWalking 中的分析语言：

- OAL: Observability Analysis Language
    - processes native traces and service mesh data
- MAL: Meter Analysis Language
    - responsible for metrics calculation for native meter data, and adopts a stable and widely used metrics system,
      such as Prometheus and OpenTelemetry
- LAL: Log Analysis Language
    - Focus on log contents and collaborate with Meter Analysis Language

## 主要部分及功能

SkyWalking 主要由三大部分组成：Agent、Collector 和 Web。

- Agent：作用是使用 Java Agent 字节码增强技术，将 Agent 的代码织入程序中，完成 Agent 无代码侵入地获取程序内方法的上下文，
  并进行增强和收集信息并发送给 Collector；与 Collector 进行心跳，表示 Agent 客户端的存活。
- Collector：作用是维护存活的 Agent 实例，并收集从 Agent 发送至 Collector 的数据，进行处理及持久化。
- Web：作用是将 Collector 收集的参数进行不同维度的展示。

## 同类型产品

开源 APM 系统：

- 大众点评的 CAT
- 韩国的 PinPoint
- 老牌 APM ZipKin

## Reference

- [Observability Analysis Language](https://skywalking.apache.org/docs/main/next/en/concepts-and-designs/oal/)
- [Meter Analysis Language](https://skywalking.apache.org/docs/main/next/en/concepts-and-designs/mal/)
- [Log Analysis Language](https://skywalking.apache.org/docs/main/next/en/concepts-and-designs/lal/)
