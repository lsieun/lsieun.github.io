---
title: "Spring Cloud"
sequence: "104"
---

## 主要有哪些组成

- 注册中心：Nacos
- 配置中心：
- 服务通信：RestTemplate, OpenFeign, Dubbo
- 负载均衡：Spring Cloud LoadBalancer
- API 网关：Spring Cloud Gateway
- 服务保护： 服务熔断降级 Spring Cloud Alibaba Sentinel
- 分布式事务：Seata, @GlobalTransaction
- 链路追踪：Sleth, Zipkin
- 消息队列：Spring Cloud Stream, RabbitMQ, Kafka, RocketMQ

## Spring Cloud OpenFeign

OpenFeign:

- 可以设置超时的时间
- 可以设置重试的时间间隔和次数

- [Spring Cloud OpenFeign 重试机制及其源码分析](https://blog.csdn.net/forlinkext/article/details/128693522)
- [Spring Cloud OpenFeign 超时与重试](https://www.jianshu.com/p/935978489f83)

- [当 OpenFeign 遇上统一异常出现问题](https://www.bilibili.com/video/BV11w411v7Eb/)

## Sentinel

### 如何有效避免雪崩效应？

雪崩现象，是因为出现瞬间大流量 + 微服务响应慢造成的。

针对这两点，在架构设计时，要采用不同方案：

- 采用**限流**方式进行预防：可以采用限流方案，控制请求的流入，让流量有序的进入应用，保证流量在一个可控的范围内。
- 采用**服务降级与熔断**进行补救：针对响应慢问题，可以采用服务与熔断进行补救。
