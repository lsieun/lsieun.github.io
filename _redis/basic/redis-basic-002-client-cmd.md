---
title: "Redis 客户端（命令行）"
sequence: "102"
---

## 单机

### 连接

```text
redis-cli -h 127.0.0.1 -p 6379 -a "*********" --no-auth-warning
```

```text
$ redis-cli -h host -p 6379
$ auth password
```

```text
$ redis-cli shutdown
```

## 集群

### 连接

```text
$ redis-cli -h host -p 6379 -c
$ auth password
```

### 命令

```text
cluster info：打印集群的信息。
```

节点相关：

```text
cluster nodes：列出集群当前已知的所有节点（node）的相关信息。
cluster meet <ip> <port>：将 ip 和 port 所指定的节点添加到集群当中。
cluster slaves <node_id>：列出指定节点下面的从节点信息。 比如：  cluster slaves 11f9169577352c33d85ad0d1ca5f5bf0deba3209  这个实际查的是 nodes.conf
cluster replicate <node_id>：将当前节点设置为指定节点的从节点。


```

Slot：

```text
cluster addslots <slot> [slot ...]：将一个或多个槽（slot）指派（assign）给当前节点。
cluster delslots <slot> [slot ...]：移除一个或多个槽对当前节点的指派。
cluster slots：列出槽位、节点信息。


cluster keyslot <key>：      列出 key 被放置在哪个槽上。 例如：cluster keyslot 9223372036854742675
cluster countkeysinslot <slot>：      返回槽目前包含的键值对数量。

cluster getkeysinslot <slot 槽号> <key 的数量>：返回 count 个槽中的键。  比如：cluster getkeysinslot 202 3   
cluster setslot <slot> node <node_id> 将槽指派给指定的节点，如果槽已经指派给另一个节点，那么先让另一个节点删除该槽，然后再进行指派。  
cluster setslot <slot> migrating <node_id> 将本节点的槽迁移到指定的节点中。  
cluster setslot <slot> importing <node_id> 从 node_id 指定的节点中导入槽 slot 到本节点。  
cluster setslot <slot> stable 取消对槽 slot 的导入（import）或者迁移（migrate）。 

cluster flushslots：         移除指派给当前节点的所有槽，让当前节点变成一个没有指派任何槽的节点。
```

Config

```text
cluster saveconfig：         手动执行命令保存保存集群的配置文件，集群默认在配置修改的时候会自动保存配置文件。
```

HA



```text
cluster failover：　　　　  手动进行故障转移。
cluster forget <node_id>： 从集群中移除指定的节点，这样就无法完成握手，过期时为 60s，60s 后两节点又会继续完成握手。
cluster reset [HARD|SOFT]：重置集群信息，soft 是清空其他节点的信息，但不修改自己的 id，hard 还会修改自己的 id，不传该参数则使用 soft 方式。
cluster count-failure-reports <node_id>：列出某个节点的故障报告的长度。
cluster SET-CONFIG-EPOCH： 设置节点 epoch，只有在节点加入集群前才能设置。
```
