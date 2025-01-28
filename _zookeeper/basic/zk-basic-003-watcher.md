---
title: "Watcher 机制"
sequence: "103"
---

ZooKeeper 使用 Watcher 机制实现分布式数据的发布/订阅功能。

一个典型的**发布/订阅模型**系统，定义了一种一对多的订阅关系，能够让多个订阅者同时监听某一个主题对象，
当这个主题对象自身状态变化时，会通知所有订阅者，使它们能够做出相应的处理。

在 ZooKeeper 中，引入了 Watcher 机制来实现这种分布式的通知功能。
ZooKeeper 允许客户端向服务端注册一个 Watcher 监听，
当服务端的一些指定事件触发了这个 Watcher，那么 ZK 就会向指定客户端发送一个事件通知来实现分布式的通知功能。

ZooKeeper 的 Watcher 机制主要包括 **客户端线程**、**客户端 WatcherManager**、**ZooKeeper服务器** 三部分。

具体工作流程：

- 客户端向 ZooKeeper 服务器注册的同时，会将 Watcher 对象存储在客户端的 WatchManager 当中
- 当 ZooKeeper 服务器触发 Watcher 事件后，会向客户端发送通知
- 客户端线程从 WatchManager 中取出对应的 Watcher 对象来执行回调逻辑
