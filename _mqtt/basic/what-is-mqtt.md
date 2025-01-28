---
title: "What Is MQTT?"
sequence: "102"
---

MQTT is one of the most commonly used protocols in IoT projects.

> 应用场景

MQTT (Message Queuing Telemetry Transport) is a messaging protocol
that works on top of the TCP/IP protocol.

> MQTT 与 TCP/IP 的关系

MQTT can also run on SSL/TLS.
SSL/TLS is a secure protocol built on TCP/IP to ensure
that all data communication between devices is encrypted and secure.

> MQTT 与 SSL/TLS 的关系

MQTT is a lightweight protocol that uses publish/subscribe operations to exchange data between clients and the server.

> MQTT 的 publish/subscribe 运行方式

Furthermore, its small size, low power usage, minimized data packets and ease of implementation
make the protocol ideal for the “machine-to-machine” or “Internet of Things” world.

> MQTT 的特点

Unlike HTTP's request/response paradigm, MQTT is event-driven, and clients receive published messages.
This type of architecture decouples the clients from each other to enable a highly scalable solution
without dependencies between data producers and data consumers.

> MQTT 与 HTTP 的区别