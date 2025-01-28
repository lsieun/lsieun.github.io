---
title: "MQTT Components"
sequence: "104"
---

In MQTT there are a few basic concepts that you need to understand:

## Broker

Broker – The broker is the server that distributes the information to the interested clients connected to the server.
This is the heart of the publish/subscribe protocol.
The MQTT Broker is optimally designed to handle many thousands of concurrently connected MQTT clients.

## Client

Client – The device that connects to broker to send or receive information.
The MQTT Client, be it Subscriber or Publisher (or both in one device) is any device
from small Microcontroller up to a fully-fledged server,
that has an MQTT library running and is connected to an MQTT Broker over any kind of network.

## Topic

Topic – Messages make their way from a publisher, through a broker, to one or more subscribers using topics.
Topics are hierarchical UTF-8 strings.
Clients publish, subscribe, or do both to a topic.
In other words, topics are the way you register interest for incoming messages or
how you specify where you want to publish the message.

## Publish

Publish – Clients that send information to the broker to distribute to interested clients based on the topic name.

## Subscribe

Subscribe – Clients tell the broker which topic(s) they're interested in.
When a client subscribes to a topic,
any message published to the broker is distributed to the subscribers of that topic.
Clients can also unsubscribe to stop receiving messages from the broker about that topic.
