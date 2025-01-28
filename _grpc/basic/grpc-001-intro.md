---
title: "Intro"
sequence: "101"
---

gRPC is a cross-platform open source high performance remote procedure call framework.
gRPC was initially created by Google,
which used a single general-purpose RPC infrastructure called Stubby
to connect the large number of microservices running within and across its data centers from about 2001.

## 进程间通信的演化过程

进程间通信的主要技术

### 传统的 RPC 技术

Java 远程方法调用（RMI），基于 TCP 通信实现远程调用，实现逻辑非常复杂，
且只能在 Java 应用之间实现远程通信。

### SOAP 协议

简单对象访问协议，通过 HTTP 协议上封装 XML 格式的 SOAP 数据包，实现跨进程通信，
是早期 WebService 技术的底层实现，消息格式的复杂性与以及围绕 SOAP 所构建的各种规范的复杂性，
妨碍了构建分布式应用程序的敏捷性，逐渐被 REST 架构风格的应用程序所替代。

### RESTful 

RESTful 的通用实现是 HTTP，通过 HTTP，可以将 RESTful Web 应用程序建模为能够通过 URI 的资源集合。
应用于资源的状态变更操作，会采用 HTTP 动词（GET、POST、PUT、DELETE 等）的形式，
资源的状态会以文本的格式来表述，如 JSON、XML 等。

RESTful 架构风格的问题

- 基于文本的低效消息协议
- 应用程序之间缺乏强类型接口
- RESTful 架构风格难以强制实施

## 什么是 RPC

```text
RPC = Remote Procedure Calls
```

A RPC is a form of Client-Server Communication that uses a function call rather than a usual HTTP call.

It uses IDL (Interface Definition Language) as a form of contract on functions to be called and on the data type.

![](/assets/images/grpc/operating-system-remote-call-procedure-working.png)

If you all haven't realized it yet, the RPC in gRPC stands for Remote Procedure Call.
And yes, gRPC does replicate this architectural style of client server communication, via function calls.

So gRPC is technically not a new concept.
Rather it was adopted from this old technique and improved upon,
making it very popular in just the span of 5 years.

## gRPC 的发展

### 初识 Google gRPC 框架

长期以来，谷歌有一个名为 Stubby 的通用 RPC 框架，用来连接成千上万的微服务，
Stubby 有许多很棒的特性，但无法标准化为业界通用的框架，这是因为它与谷歌内部的基础设施耦合得过于紧密。

2015年，谷歌发布了开源 RPC 框架 gRPC，这个RPC基础设施具有标准化、可通用和跨平台的特点，
旨在提供类似 Stubby 的可扩展性、性能和功能，但它主要面向社区。

### gRPC 的优势

- 提供高效的进程间通信
- 具有简单且定义良好的服务接口和模式
- 属于强类型调用
- 支持多语言
- 支持双工通信
- 大厂背书社区活跃

### gRPC 的劣势

- gRPC 不太适合面向外部的服务
- 巨大的服务定义变更是复杂的开发流程
- gRPC生态系统相对较小

### gRPC 传输格式 protobuf

protobuf(Google Protocol Buffers)是Google提供一个具有高效的协议数据交换格式工具库(类似Json)，
Protobuf 有更高的转化效率，时间效率和空间效率都是 JSON 的 3-5 倍。



