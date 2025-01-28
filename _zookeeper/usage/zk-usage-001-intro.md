---
title: "ZooKeeper 应用实践"
sequence: "101"
---

## ZooKeeper 两大特性

第 1 个特性：如果客户端对 ZooKeeper 的数据节点注册 Watcher 监听，那么当该数据节点的内容或其子节点列表发生变更时，
ZooKeeper 服务器就会向订阅的客户端发送变更通知。

第 2 个特性：在 ZooKeeper 上创建的临时节点，一旦客户端与服务器之间的会话失效，那么临时节点也会被自动删除。

```text
Watcher + 临时节点
```

复用这两大特性，可以实现集群机器存活监控系统，若监控系统在 `/clusterServers` 节点上注册一个 Watcher 监听，
那么动态添加机器的操作，就会在 `/clusterServers` 节点下创建一个临时节点：`/clusterServers/[Hostname]`，
这样，监控系统就能够实时监测机器的变动情况。


