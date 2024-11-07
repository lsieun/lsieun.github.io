---
title: "Intro"
sequence: "101"
---

Remote procedure call (RPC) systems, including Java RMI, are synchronous --
the caller must block and wait until the called method completes execution,
and thus offer no potential for developing loosely coupled enterprise applications without the use of multiple threads.
In other words, RPC systems require the client and the server to be available at the same time.
However, such tight coupling may not be possible or desired in some applications.

> RPC 有不足：只能 synchronous，不能 asynchronous

Message-Oriented Middleware (MOM) systems provide solutions to such problems.
They are based on the asynchronous interaction model,
and provide the abstraction of a message queue that can be accessed across a network.
Note, however, that messaging here refers to asynchronous requests or events
that are consumed by enterprise applications and not humans as in electronic mail (email).
These messages contain formatted data that describe specific business actions.

> MOM 提供了解决方案：基于 asynchronous interaction model

The Java Message Service (JMS),
which is designed by Sun Microsystems and several other companies under the Java Community Process as JSR 914,
is the first enterprise messaging API that has received wide industry support.

> JMS 由 Sun 公司设计

The Java Message Service (JMS) was designed to make it easy to develop business applications
that asynchronously send and receive business data and events.
It defines a common enterprise messaging API that is designed to be easily and efficiently supported
by a wide range of enterprise messaging products.

> JMS 设计的主要目标：asynchronously send and receive business data and events

JMS supports both messaging models: point-to-point (queuing) and publish-subscribe.

> JMS 的两种 messaging model

JMS defines a set of interfaces and semantics
that allow Java applications to communicate with other messaging implementations.

> JMS 是抽象的接口

A JMS implementation is known as a JMS provider.

> JMS 的实现，称为 JMS provider

JMS makes the learning curve easy by minimizing the set of concepts
a Java developer must learn to use enterprise messaging products,
and at the same time it maximizes the portability of messaging applications.

> 开发者视角，JMS 让学习曲线更容易

## Architecture

A JMS application is composed of the following parts:

- **A JMS provider**: A messaging system that implements the JMS specification.
- **JMS clients**: Java applications that send and receive messages.
- **Messages**: Objects that are used to communicate information between JMS clients.
- **Administered objects**: Preconfigured JMS objects that are created by an administrator for the use of JMS clients.

## Message Delivery Models

JMS supports two different message delivery models:

- Point-to-Point (Queue destination)
- Publish/Subscribe (Topic destination)

### Point-to-Point

Point-to-Point (Queue destination):
In this model, a message is delivered from a producer to one consumer.
The messages are delivered to the destination, which is a queue,
and then delivered to one of the consumers registered for the queue.

While any number of producers can send messages to the queue,
each message is guaranteed to be delivered, and consumed by one consumer.

> 只有一个 consumer 消费

If no consumers are registered to consume the messages,
the queue holds them until a consumer registers to consume them.

> 如果没有 consumer 的情况

### Publish/Subscribe

Publish/Subscribe (Topic destination):
In this model, a message is delivered from a producer to any number of consumers.
Messages are delivered to the topic destination, and then to all active consumers who have subscribed to the topic.

In addition, any number of producers can send messages to a topic destination,
and each message can be delivered to any number of subscribers.

> 任意多个 consumer

If there are no consumers registered,
the topic destination doesn't hold messages unless it has **durable subscription** for inactive consumers.

> 如果没有 consumer

A **durable subscription** represents a consumer registered with the topic destination
that can be inactive at the time the messages are sent to the topic.

## The JMS Programming Model

A JMS application consists of a set of application-defined messages and a set of clients that exchange them.

```text
JMS application = a set of application-defined messages + a set of clients
```

JMS clients interact by sending and receiving messages using the JMS API.

```text
JMS client --> JMS API
```

A message is composed of three parts: header, properties, and a body.

```text
message = header + properties + body
```

- The **header**, which is required for every message,
  contains information that is used for routing and identifying messages.
  Some of these fields are set automatically, by the JMS provider, during producing and delivering a message,
  and others are set by the client on a message by message basis.
- **Properties**, which are optional, provide values that clients can use to filter messages.
  They provide additional information about the data, such as which process created it, the time it was created.
  Properties can be considered as an extension to the header, and consist of property name/value pairs.
  Using properties, clients can fine-tune their selection of messages
  by specifying certain values that act as selection criteria.
- The **body**, which is also optional, contains the actual data to be exchanged.
  The JMS specification defined six type or classes of messages that a JMS provider must support:
    - `Message`: This represents a message without a message body.
    - `StreamMessage`: A message whose body contains a stream of Java primitive types.
      It is written and read sequentially.
    - `MapMessage`: A message whose body contains a set of name/value pairs. The order of entries is not defined.
    - `TextMessage`: A message whose body contains a Java string...such as an XML message.
    - `ObjectMessage`: A message whose body contains a serialized Java object.
    - `BytesMessage`: A message whose body contains a stream of uninterpreted bytes.


## Producing and Consuming Messages

Here are the necessary steps to develop clients to produce and consumer messages.
Note that there are some common steps that shouldn't be duplicated
if the client is both producing and consuming messages.
The following figure depicts the high-level view of the steps:

![](/assets/images/java/jms/jms-produce-and-consume-messages.gif)

### Client to Produce Messages

Use the Java Naming and Directory Interface (JNDI) to find a `ConnectionFactory` object,
or instantiate a `ConnectionFactory` object directly and set its attributes.

A client uses a connection factory,
which is an instance of either `QueueConnectionFactory` (point-to-point) or `TopicConnectionFactory` (publish/subscribe),
to create a connection to a provider.

The following snippet of code demonstrates how to use JNDI to find a connection factory object:

```text
Context ctx = new InitialContext();
ConnectionFactory cf1 = (ConnectionFactory) ctx.lookup("jms/QueueConnectionFactory");
ConnectionFactory cf2 = (ConnectionFactory) ctx.lookup("/jms/TopicConnectionFactory");
```

Alternatively, you can directly instantiate a connection factory as follows:

```text
ConnectionFactory connFactory = new com.sun.messaging.ConnectionFactory();
```

## Reference

- [Getting Started with Java Message Service (JMS)](https://www.oracle.com/technical-resources/articles/java/intro-java-message-service.html)

