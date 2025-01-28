---
title: "节点之间的数据同步"
sequence: "105"
---

## REPLICATION

Redis 的主从复制采用异步的方式进行。

如果同步连接时，Slave 端短暂的与 Master 端断开了连接，那连接恢复后，允许 Slave 端与 Master 端进行一次局部的再同步。

主从复制是自动进行的，并不需要用户的介入，Slave 端会自动尝试重连 Master 并进行数据同步。

- `slaveof <master ip> <master port>`：设置 Master 端的 IP 与 Port 信息
- `masterauth <master-password>`：如果 master 端启用了密码保护（`requirepass`），那 Slave 端就需要配置此选项
- `slave-serve-stale-data yes`：当 Slave 端在主从复制的过程中与 Master 端断开了连接，此时有 2 种处理方法：
  一种是继续提供服务（即使数据可能不是最新的），另一种是对请求返回一个错误信息，**默认配置是继续提供服务**
- `slave-read-only yes`：自 Redis 2.6 版本开始，Slave 端默认为 readonly

主从同步支持两种策略，即 disk 和 socket 方式（socket 方式尚不完善，还处于实验阶段）。

新的 Slave 端和重连的 Salve 端不允许去继续同步进程，这被称之为“完全同步”。

一个 RDB 文件从 Master 端传到 Slave 端，分为两种情况：

- 1、支持 disk：Master 端将 RDB file 写到 disk，稍后再传送到 Slave 端；
- 2、无磁盘 diskless：Master 端直接将 RDB file 传到 Slave socket，不需要与 disk 进行交互。

无磁盘 diskless 方式适合磁盘读写速度慢但网络带宽非常高的环境。

- `repl-diskless-sync no`：默认不使用 diskless 同步方式
- `repl-diskless-sync-delay 5`：无磁盘 diskless 方式在进行数据传递之前会有一个时间的延迟，以便 slave 端能够进行到待传送的目标队列中，这个时间默认是 5 秒
- `repl-ping-slave-period 10`：slave 端向 server 端发送 pings 的时间区间设置，默认为 10 秒
- `repl-timeout 60`：设置超时时间
- `repl-disable-tcp-nodelay no`：是否启用 TCP_NODELAY，如果启用则会使用少量的 TCP 包和带宽去进行数据传输到 slave 端，当然速度会比较慢；如果不启用则传输速度比较快，但是会占用比较多的带宽。
- `repl-backlog-size 1mb`：设置 backlog 的大小，backlog 是一个缓冲区，在 slave 端失连时存放要同步到 slave 的数据，因此当一个 slave 要重连时，经常是不需要完全同步的，执行局部同步就足够了。backlog 设置的越大，slave 可以失连的时间就越长。
- `repl-backlog-ttl 3600`：如果一段时间后没有 slave 连接到 master，则 backlog size 的内存将会被释放。如果值为 0 则表示永远不释放这部份内存。
- `slave-priority 100`：slave 端的优先级设置，值是一个整数，数字越小表示优先级越高。当 master 故障时将会按照优先级来选择 slave 端进行恢复，如果值设置为 0，则表示该 slave 永远不会被选择。
- `min-slaves-to-write 3`
- `min-slaves-max-lag 10`：设置当一个 master 端的可用 slave 少于 N 个，延迟时间大于 M 秒时，不接收写操作。

## REDIS CLUSTER

一个正常的 redis 实例是不能做为一个 redis 集群的节点的，除非它是以一个集群节点的方式进行启动。

cluster-enabled yes 配置 redis 做为一个集群节点来启动
cluster-config-file node-6379.conf 每个集群节点都有一个集群配置文件，这个文件不需要编辑，它由 redis 节点来创建和更新。每个 redis 节点的集群配置文件不可以相同。
cluster-node-timeout 15000 设置集群节点超时时间，如果超过了指定的超时时间后仍不可达，则节点被认为是失败状态，单位为毫秒。

一个属于失效的 master 端的 slave，如果它的数据较旧，将不会启动 failover。
现在来讲并没有一个简单的方法去解决如何判定一个 slave 端的数据的时效性问题，所以可以执行以下两个选择：
1、如果有多个 slave 可用于 failover，它们会交换信息以便选出一个最优的进行主从复制的 offset，slave 端会尝试依据 offset 去获取每个 slave 的 rank，这样在启动 failover 时对每个 slave 的利用就与 slave 端的 rank 成正比。
2、每个 slave 端和它的 master 端进行最后交互的时间，这可能是最近的 ping 或指令接收时间，或自与 master 端失连的过时时间。如果最近的交互时间太久，slave 就不会尝试去进行 failover。
第 2 点可以由用户来进行调整，明确一个 slave 不会进行 failover。自最近一次与 master 端进行交互，过时时间有一个计算公式：
（node-timeout * slave-validity-factor）+repl-ping-slave-period
一个比较大的 slave-validity-factor 参数能够允许 slave 端使用比较旧的数据去 failover 它的 master 端，而一个比较小的值可能会阻止集群去选择 slave 端。
为获得最大的可用性，可以设置 slave-validity-factor 的值为 0，这表示 slave 端将会一直去尝试 failover 它的 master 端而不管它与 master 端的最后交互时间。
cluster-slave-validity-factor 10 默认值为 10

集群中的 slave 可以迁移到那些没有可用 slave 的 master 端，这提升了集群处理故障的能力。毕竟一个没有 slave 的 master 端如果发生了故障是没有办法去进行 failover 的。
要将一个 slave 迁移到别的 master，必须这个 slave 的原 master 端有至少给定数目的可用 slave 才可以进行迁移，这个给定的数目由 migration barrier 参数来进行设置，默认值为 1，表示这个要进行迁移的 slave 的原 master 端应该至少还有 1 个可用的 slave 才允许其进行迁移，要禁用这个功能只需要将此参数设置为一个非常大的值。
cluster-migration-barrier 1

默认情况下当 redis 集群节点发现有至少一个 hashslot 未被 covered 时将会停止接收查询。
这种情况下如果有一部份的集群 down 掉了，那整个集群将变得不可用。
集群将会在所有的 slot 重新 covered 之后自动恢复可用。
若想要设置集群在部份 key space 没有 cover 完成时继续去接收查询，就将参数设置为 no。
cluster-require-full-coverage yes

