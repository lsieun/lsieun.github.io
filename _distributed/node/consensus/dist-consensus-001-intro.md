---
title: "一致性算法"
sequence: "101"
---

The fundamental challenge:
**the need to reach a consensus among numerous components**
dispersed across various locations,
frequently vulnerable to failures or disruptions.

The inventive field of **consensus algorithms** is at the core of solving this problem.

- consensus algorithms: agreement and coherence in distributed systems
    - data consistency
    - machine fault tolerance

## Consensus

**Consensus**, in the context of distributed systems,
is the act of getting a group of nodes to agree on a single value or outcome,
even if failures and network delays occur.

At the heart of many **consensus algorithms** is the concept of **Leader election**,
as it establishes a single node responsible for coordinating and
making decisions on behalf of the group.
In other words, this leader ensures that
all nodes in the system agree on a common value or decision,
promoting order and preventing conflicts in distributed environments.

```text
consensus algorithms --> Leader election
```

**Fault tolerance** is a critical aspect of **consensus algorithms** as well,
as it allows systems to continue functioning even in the presence of node failures,
network partitions, or other unforeseen issues.

## 一致性的分类

- 强一致性
    - 说明：保证系统改变提交以后立即改变集群的状态。
    - 模型：
        - Paxos
        - Raft（muti-paxos）
        - ZAB（muti-paxos）
- 弱一致性
    - 说明：也叫最终一致性，系统不保证改变提交以后立即改变集群的状态，但是随着时间的推移最终状态是一致的。
    - 模型：
        - DNS 系统
        - Gossip 协议

一致性算法实现举例

- Google 的 Chubby 分布式锁服务，采用了 Paxos 算法
- etcd 分布式键值数据库，采用了 Raft 算法
- ZooKeeper 分布式应用协调服务，Chubby 的开源实现，采用 ZAB 算法

## Reference

- [Exploring the Role of Consensus Algorithms in Distributed System Design](https://dzone.com/articles/exploring-the-role-of-consensus-algorithms-in-dist)
- [拜占庭将军问题 (The Byzantine Generals Problem)](https://zhuanlan.zhihu.com/p/107439021)
- [分布式一致性算法 -Paxos、Raft、ZAB、Gossip](https://zhuanlan.zhihu.com/p/130332285)
- [分布式一致性（共识）算法(Paxos,raft,ZAB)的一些总结](https://blog.csdn.net/Z_Stand/article/details/108547684)
- [Raft 协议详解](https://zhuanlan.zhihu.com/p/27207160)
- [Raft 协议详解](https://blog.csdn.net/Jinliang_890905/article/details/129905523)
- [Paxos](https://martinfowler.com/articles/patterns-of-distributed-systems/paxos.html)
- [分布式共识算法 (Consensus Algorithm)](https://blog.csdn.net/INGNIGHT/article/details/120595398)
- [Consensus Algorithm -- Raft](https://blog.csdn.net/chinus_yan/article/details/128608819)

