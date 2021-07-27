---
title:  "Hexagonal Architecture"
sequence: "102"
---

## Intro

- Alias: Ports And Adapters Architecture
- Author: [Alistar Cockburn](https://heartofagile.com/alistair-cockburn/)
- Date: 2005

The hexagonal architecture principle was created by [Alistair Cockburn](https://heartofagile.com/alistair-cockburn/) in 2005. It is also known as **Ports and Adapters Architecture**.

### Name

The hexagon concept isn’t related to a six side architecture nor does it have anything to do with the geometrical form. A hexagon has six sides indeed, but the idea is to illustrate concept of many ports.

## Layered Architecture

我们知道，Layered Architecture是将软件系统分成不同的层（layer），最常使用的就是三层架构。

三层架构就是把软件系统中各个功能模块划分为表现层、业务逻辑层和数据访问层：

{:refdef: style="text-align: center;"}
![三层架构](/assets/images/architecture/three-layer-architecture.png)
{: refdef}

在Layered Architecture当中，不同层（layer）之间的“沟通”（调用关系）只能向下进行：表现层能调用业务逻辑层，业务逻辑层不能调用表现层；业务逻辑层能够调用数据访问层，数据访问层不能调用业务逻辑层。另外，不同层（layer）之间不能跨层调用，例如表现层不能直接调用数据访问层。

## Intent

Allow an application

- to equally be driven by users, programs, automated test or batch scripts, and
- to be developed and tested in isolation from its eventual run-time devices and databases.

As events arrive from the outside world at a port, a technology-specific adapter converts it into a usable procedure call or message and passes it to the application.
The application is blissfully ignorant of the nature of the input device.
When the application has something to send out, it sends it out through a port to an adapter, which creates the appropriate signals needed by the receiving technology.
The application has a semantically sound interaction with the adapters on all sides of it, without actually knowing the nature of the things on the other side of the adapters.

## Motivation

One of the great bugaboos of software applications over the years has been infiltration of business logic into the user interface code. The problem this causes is threefold:

### Goal

The main goal of this architecture is to avoid knows structural pitfalls in software design. Such as the pollution of UI code with business logic or undesired dependencies between layers.[medium.com]()

## Main Content

### inside and outside

From an even broader concept we want to differentiate the concepts of **inside** and **outside**.
**Inside** is the business logic and the application itself and **outside** is whatever we are using to connect and interact with the application.

### Components

## similarities

According to Martin Fowler, the hexagonal architecture has the benefit of using similarities between presentation layer and data source layer to create symmetric components made of a core surrounded by interfaces, but with the drawback of hiding the inherent asymmetry between a service provider and a service consumer that would better be represented as layers.[Wiki: Hexagonal architecture]()

#### ports

Ports represent the boundaries of the application. Frequently they are implemented as **interfaces** to be used by outside parties. Their implementation resides outside the application, although they share the same domain.

#### driving ports and driven ports

However there is also a certain **asymmetry** to it, as well. What that means is that we can divide our **ports** into two groups: **driving ports** and **driven ports**.

**The way we make this distinction is based on communication with the Core**. In the case of **driving ports**, they are the ones that are initiating the communication with our core (driving the behavior of our application), while in the case of **driven ports** it is our Core that initiates the communication with them.

**Primary ports** are also known as **driving ports**. They are also known as **Inbound Ports**. These ports “drive” the application.

**Secondary ports** are in contrast known as **driven ports**. The application “drives” the port in order to get data. Because the application sends data to the outside, secondary ports also get called **Outbound Ports**.

- Primary ports / driving ports / Inbound Ports
- Secondary ports / driven ports / Outbound Ports

### adapters

The **adapters** form the outer layer of the hexagonal architecture. They are not part of the **core** but interact with it.

An input adapter could be a web interface, for instance. When a user clicks a button in a browser, the web adapter calls a certain input port to call the corresponding use case.

## Benefits

## References

- [alistair.cockburn.us: Hexagonal architecture](https://alistair.cockburn.us/hexagonal-architecture/)，这是原文，不过并不好理解
- [wiki.c2.com: Hexagonal Architecture](https://wiki.c2.com/?HexagonalArchitecture)
- [wiki.c2.com: Ports And Adapters Architecture](https://wiki.c2.com/?PortsAndAdaptersArchitecture)
- [madewithlove.com: Hexagonal Architecture demystified](https://madewithlove.com/blog/software-engineering/hexagonal-architecture-demystified/)，这是对Hexagonal architecture进行解读，写的很不错。只是讲理论，没有代码。
- [reflectoring.io: Hexagonal Architecture with Java and Spring](https://reflectoring.io/spring-hexagonal/)，我觉得，这个文章也不错，它提到Domain Objects、Use Cases、Input and Output Ports、Adapters。有代码，是关于从一个账户向另一个账户发送钱的例子。
- [medium.com: Hexagonal Architecture in Java](https://medium.com/swlh/hexagonal-architecture-in-java-b980bfc07366)
- [Hexagonal Architecture in Java](https://dzone.com/articles/hexagonal-architecture-in-java)

