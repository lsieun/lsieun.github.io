---
title: "JMS (Java Message Service)"
sequence: "101"
---

Java 消息服务（Java Message Service），是一种与厂商无关的 API，用来访问消息收发系统消息，
它类似于 JDBC（Java Database Connectivity）。 JDBC 是可以用来访问不同关系数据的 API。

## 特性

- 有 queues 和 topics 两种消息传递模型
- 支持事务、能够定义消息格式（消息头、属性和内容）

## 常见概念

- JMS 提供者：连接面向消息中间件的，JMS 接口的一个实现，RocketMQ、ActiveMQ、Kafka 等。
- JMS 生产者（Message Producer）：生产消息的服务
- JMS 消费者（Message Consumer）：消费消息的服务
- JMS 消息：数据对象
- JMS 队列：存储待消费消息的区域
- JMS 主题：一种支持发送消息给多个订阅者的机制
- JMS 消息通常有两种类型：点对点（Point-to-Point）、发布/订阅（Publish/Subscribe）

## 基础编程模型

MQ 中需要用到一些类：

- ConnectionFactory：连接工厂，JMS 用它创建连接
- Connection：JMS 客户端到 JMS Provider 的连接
- Session：一个发送或接收消息的线程
- Destination：消息的目的地；消息发送给谁
- MessageConsumer/MessageProducer：消息消费者，消息生产者

## Reference

- [Getting Started with Java Message Service (JMS)](https://www.oracle.com/technical-resources/articles/java/intro-java-message-service.html)
- [Getting Started with Spring JMS](https://www.baeldung.com/spring-jms)
- [Testing Spring JMS](https://www.baeldung.com/spring-jms-testing)
