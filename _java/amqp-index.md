---
title: "AMQP (Advanced Message Queuing Protocol)"
sequence: "101"
---

## 背景

JMS 或者 NMS 都没有标准的底层协议，API 是与编程语言绑定的，每个消息队列厂商就存在多种不同格式规范的产品，
对使用者就产生了很多问题，AMQP 解决了这个问题，它使用了一套标准的底层协议。

## 什么是 AMQP

AMQP （Advanced Message Queuing Protocol），在 2003 年时被提出，最早用于解决金融领域不同平台之间的消息传递交互问题，
就是一种协议，兼容 JMS。

更准确的说，链接协议（Binary-Wire-Level-Protocol）直接定义网络交换的数据格式，类似HTTP。

具体的产品实现比较多，RabbitMQ 就是其中一种。

## 特性

- 独立于平台的底层消息传递协议
- 消费者驱动消息传递
- 跨语言和平台的互用性、属于底层协议
- 有 5 种交换类型：direct、fanout、topic、headers、system
- 支持长周期消息传递、支持事务（跨消息队列）

## AMQP 和 JMS 的主要区别

- AMQP 不从 API 层进行限定，直接定义网络交换的数据格式，这使得实现了 AMQP 的 provider 天然性就是跨平台
  - 比如 Java 语言产生的消息，可以用其它语言比如 Python 进行消费
- AMQP 可以用 HTTP 来进行类比，不关心实现接口的语言，只要都按照相应的数据格式去发送报文请示，不同语言的 Client 可以和不语言的 Server 进行通讯
- JMS 消息类型：TextMessage/ObjectMessage/StreamMessage 等
- AMQP 消息类型：`byte[]`

> AMQP 是数据层面的规范，JMS 是编程语言层面的规范。

## MQTT

MQTT（Message Queueing Telemetry Transport）

背景：

- 我们有面向基于 Java 的企业应用的 JMS 和 面向其它应用需求的 AMQP，那这个 MQTT 是做啥的呢？

原因：

- 计算性能不高的设备不能适应 AMQP 上的复杂操作，MQTT 是专门为小设备设计的
- MQTT 主要是物联网（IOT）中大量的使用

特性

- 内存占用低，为小无声设备之间通过低带宽发送短消息而设计
- 不支持长周期存储和转发，不允许分段消息（很难发送长消息）
- 支持主题发布-订阅、不支持事务（仅基本确认）
- 消息实际上是短暂的（短周期）
- 简单用户名和密码、不支持安全连接、消息不透明

## Reference

- [AMQP协议简介](https://www.bilibili.com/video/BV1Pe411V77b/)
