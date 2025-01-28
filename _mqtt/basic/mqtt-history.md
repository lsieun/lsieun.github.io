---
title: "MQTT"
sequence: "101"
---

MQTT is a standards-based messaging protocol, or set of rules,
used for machine-to-machine communication.

> MQTT是一个协议，用于机器与机器之间的沟通（machine-to-machine communication）。

Smart sensors, wearables, and other Internet of Things (IoT) devices typically
have to transmit and receive data over a resource-constrained network with limited bandwidth.
These IoT devices use MQTT for data transmission,
as it is easy to implement and can communicate IoT data efficiently.

> 使用MQTT的设备有一个特点：资源有限、带宽有限

MQTT supports messaging between devices to the cloud and the cloud to the device.

> MQTT 支付从 device 到 cloud，也支持从 cloud 到 device。

## history

What is the history behind MQTT protocol?

The MQTT protocol was invented in 1999 for use in the oil and gas industry.
Engineers needed a protocol for minimal bandwidth and minimal battery loss to monitor oil pipelines
via satellite.
Initially, the protocol was known as **Message Queuing Telemetry Transport**
due to the IBM product MQ Series that first supported its initial phase.

In 2010, IBM released MQTT 3.1 as a free and open protocol for anyone to implement,
which was then submitted,
in 2013, to **Organization for the Advancement of Structured Information Standards (OASIS)**
specification body for maintenance.
In 2019, an upgraded MQTT version 5 was released by OASIS.

Now MQTT is no longer an acronym but is considered to be the official name of the protocol.

| Year | Memo     |
|------|----------|
| 1999 | IBM      |
| 2010 | MQTT 3.1 |
| 2013 | OASIS    |
| 2019 | MQTT 5.0 |

## principle

What is the principle behind MQTT?

The MQTT protocol works on the principles of the **publish/subscribe model**.
In traditional network communication, clients and servers communicate with each other directly.
The clients request resources or data from the server,
then the server processes and sends back a response.
However, MQTT uses a publish/subscribe pattern to
decouple the message sender (publisher) from the message receiver (subscriber).

Instead, a third component, called a **message broker**,
handles the communication between publishers and subscribers.
The broker's job is to filter all incoming messages from publishers and
distribute them correctly to subscribers.

The broker decouples the publishers and subscribers as below:

### Space decoupling

The publisher and subscriber are not aware of each other's network location and
do not exchange information such as IP addresses or port numbers.

### Time decoupling

The publisher and subscriber don't run or have network connectivity at the same time.

### Synchronization decoupling

Both publishers and subscribers can send or receive messages without interrupting each other.
For example, the subscriber does not have to wait for the publisher to send a message.


