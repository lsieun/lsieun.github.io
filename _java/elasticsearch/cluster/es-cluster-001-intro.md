---
title: "Elasticsearch 集群"
sequence: "101"
---

- 搭建 ES 集群
- 集群脑裂问题
- 集群故障转移
- 集群分布式存储
- 集群分布式查询

## 单节点 ES

单机的 Elasticsearch 做数据存储，必须面临两个问题：

- 海量数据存储问题：将索引库从逻辑上拆分为 N 个分片（Shard），存储到多个节点
- 单点故障问题：将分片数据在不同的节点备份（replica）



