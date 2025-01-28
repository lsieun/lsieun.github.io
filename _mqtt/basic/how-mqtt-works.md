---
title: "How MQTT works?"
sequence: "103"
---

MQTT uses your existing Internet home network to send messages to your IoT devices and respond to the messages.

At the core of MQTT is the **MQTT broker** and the **MQTT clients**.
The broker is responsible for dispatching messages between the sender and the rightful receivers.
An MQTT client publishes a message to a broker and other clients can subscribe to the broker to receive messages.

> MQTT 的两个核心组成：MQTT broker 和 MQTT client

Each MQTT message includes a topic.
A client publishes a message to a specific topic and MQTT clients subscribe to the topics they want to receive.
The MQTT broker uses the topics and the subscriber list to dispatch messages to appropriate clients.

> message 与 topic 的关系

If the connection from a subscribing client to a broker is broken,
then the broker will buffer messages and push them out to the subscriber when it is back online.
If the connection from the publishing client to the broker is disconnected without notice,
then the broker can close the connection and send subscribers a cached message with instructions from the publisher.
