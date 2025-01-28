---
title: "Lettuce Intro"
sequence: "101"
---

## Intro

Lettuce supports both synchronous and asynchronous communication use of the complete Redis API,
including its data structures, pub/sub messaging, and high-availability server connections.

The most significant difference is its **asynchronous support**
via Java 8's `CompletionStage` interface and support for Reactive Streams.
As we'll see below, Lettuce offers a natural interface for making asynchronous requests
from the Redis database server and for creating streams.

It also uses Netty for communicating with the server.
This makes for a “heavier” API but also makes it better suited for sharing a connection with more than one thread.



## Reference

- [Lettuce](https://lettuce.io/)
- [Introduction to Lettuce – the Java Redis Client](https://www.baeldung.com/java-redis-lettuce)
