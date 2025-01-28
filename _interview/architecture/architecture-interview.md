---
title: "架构"
sequence: "architecture"
---

- [ ] 高并发下如何保证接口的幂等性？ https://www.bilibili.com/video/BV1PM411D7EA/

- 单机架构
- 分布式架构
- 微服务架构
- 服务网格
- ...

作为架构师，考虑不仅仅是架构越新越好、越高大上越好，而是综合考虑人、事（业务逻辑）、物（现有资源）、钱各方面因素，来保证系统的核心利益

- 不谈场景的架构设计，都是耍流氓
- 架构没有对不对，只有合适不合适


可能有两个方向：

- 对现有的系统，看看有什么可以优化的地方
- 是否引入新的中间件来解决问题，例如 Redis

## 架构与框架的区别

- 架构是软件目标的宏观设计：软件的目标是什么（满足 1000 人同时在线）、服务器如何部署、模块如何切分、数据如何流转、带宽需要多少、人员需要多少、数据库和选型是什么
- 框架是具体的：Spring、MyBatis、Tomcat、Nginx


- 架构是宏观设计的标准
- 框架是具体实现的规则

## CAP

- Consistency: All clients see the same view of data, even right after update or delete
- Availability: All clients can find a replica of data, even in case partial node failure
- Partitioning: The system continues to work as expected, even in the presence of partial network failure

- 一致性（C）：在更新操作之后，所有节点在同一时间的数据完全一致。
- 可用性（A）：当用户访问数据时，系统是否能够在正常响应时间返回预期结果。
- 分区容错性（P）：当分布式系统在遇到某节点或网络故障的时候，仍然能够对外提供满足一致性或可用性。


## 中台

- 可共享的业务能力和数据能力的下沉。
- 企业级的能力利用平台

```text
数据服务
--------
数据资产
```

## 架构设计方案

- 单机架构
- 分布式架构
- 微服务架构
- 服务网格
- ...

- Client-Server （Web 服务器）
- 主从 （MySQL 一主多从）
- 代理（客户端代理、服务端代理）
- 分布式
