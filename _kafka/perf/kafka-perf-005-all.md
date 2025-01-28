---
title: "总体"
sequence: "105"
---

## 数据精准一次


### 生产者角度

- acks 设置为 `-1`（`acks=-1`）
- 幂等性（`enable.idempotence = true`） + 事务


### Broker 服务端

- 分区副本大于等于 2
- ISR 里应答的最小副本数量大于等于 2（`min.insync.replicas=2`）

### 消费者

- 事务 + 手动提交 offset （`enable.auto.commit = false`）
- 消费者输出目的地必须支持事务（MySQL、Kafka）
