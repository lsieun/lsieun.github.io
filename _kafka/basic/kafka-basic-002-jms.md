---
title: "JMS"
sequence: "102"
---

## JMS 核心组件

<table>
    <thead>
    <tr>
        <th>组件名称</th>
        <th>组件作用</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>JMS 提供者</td>
        <td>
            连接面向消息中间件，是 JMS 接口的一个实现<br/>
            提供者可以是 Java 平台的 JMS 实现，也可以是非 Java 平台的面积消息中间件的适配器。
        </td>
    </tr>
    <tr>
        <td>JMS 客户</td>
        <td>生产或消费基于消息的Java应用程序或对象</td>
    </tr>
    <tr>
        <td>JMS 生产者</td>
        <td>创建并发送消息的 JMS 客户</td>
    </tr>
    <tr>
        <td>JMS 消费者</td>
        <td>接收消息的 JMS 客户</td>
    </tr>
    <tr>
        <td>JMS 消息</td>
        <td>包括可以在 JMS 客户之间传递数据的对象</td>
    </tr>
    <tr>
        <td>JMS 队列</td>
        <td>
            一个容纳那些被发生的、等待阅读的消息的区域<br/>
            与队列名字所暗示的意义不同，消息的接收顺序并不一定要与消息的发送顺序一致。<br/>
            一旦一个消息被阅读（消费），该消息将被从队列中移走。
        </td>
    </tr>
    <tr>
        <td>JMS 主题</td>
        <td>一种支持发送消息给多个订阅者的机制。</td>
    </tr>
    </tbody>
</table>

## JMS 对象模型

![](/assets/images/kafka/jms-object-model.png)

<table>
    <thead>
    <tr>
        <th>组件名称</th>
        <th>功能介绍</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>ConnectionFactory</td>
        <td>
            创建 Connection 对象的工厂，针对两种不同的 JMS 消息模型，
            分别有 QueueConnectionFactory 和 TopicConnectionFactory 两种。
            可以通过 JNDI 来查找 ConnectionFactory 对象模型。
        </td>
    </tr>
    <tr>
        <td>Connection</td>
        <td>
            Connection 表示在客户端和 JMS 系统之间建立的连接（针对TCP/IP包的封装）。
            Connection 可以产生一个或多个 Session。
            跟 ConnectionFactory 一样，Connection 也有两种类型：QueueConnection 和 TopicConnection。
        </td>
    </tr>
    <tr>
        <td>Session</td>
        <td>
            Session 是操作消息的接口。
            可以通过 Session 创建生产者、消费者、消息等。
            Session 提供了事务的功能。
            当需要使用 Session 发送/接收多个消息时，可以将这些发送、接收的动作放到一个事务中。
            同样，Session 也分为 QueueSession 和 TopicSession。
        </td>
    </tr>
    <tr>
        <td>MessageProducer</td>
        <td>
            消息生产者，由 Session 创建，并用于将消息发送到 Destination。
            同样，消息生产者分两种类型：QueueSender、TopicPublisher。
            可以调用消息生产者的方法（send或publish方法）发送消息。
        </td>
    </tr>
    <tr>
        <td>MessageConsumer</td>
        <td>
            消息消费者，由 Session 创建，用于接收被发送到 Destination 的消息。
            两种类型：QueueReceiver、TopicSubscriber。
            可分别通过 Session 的 createReceiver(Queue) 或 createSubscriber(Topic) 来创建。
            当然，也可以用 Session 的 createDurableSubscriber 方法创建持久化的订阅者。
        </td>
    </tr>
    <tr>
        <td>Destination</td>
        <td>
            Destination 是“消息生产者的消息发送目标”或“消费者消费数据的来源”。
            对于消息生产者来说，它的 Destination 是某个队列（Queue）或某个主题（Topic）；
            对于消息消费者来说，它的 Destination 也是某个队列（Queue）或主题（Topic）。
        </td>
    </tr>
    </tbody>
</table>

## JMS 消息传输模型

在 JMS 标准中，有两种消息模型：P2P（Point To Point）、Pub/Sub（Publish/Subscribe）。

