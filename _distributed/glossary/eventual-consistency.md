---
title: "Eventual Consistency"
sequence: "eventual-consistency"
---

## 概念

**Consistency** refers to a database query returning the same data each time the same request is made.

**Strong consistency** means the latest data is returned, but, due to internal consistency methods,
it may result with higher latency or delay.

```text
Strong consistency --> higher latency
```

With **eventual consistency**, results are less consistent early on,
but they are provided much faster with low latency.
Early results of eventual consistency data queries may not have the most recent updates
because it takes time for updates to reach replicas across a database cluster.

```text
eventual consistency
```

## 应用场景

### NoSQL

A key benefit of an eventually consistent database is that it supports the high availability model of NoSQL.
Eventually consistent databases prioritize availability over strong consistency.

### 微服务

Eventual consistency in **microservices** can support an always-available API that must be responsive,
even if the query results may occasionally be missing the latest commit.


