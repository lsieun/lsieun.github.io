---
title: "Raft"
sequence: "104"
---

Raft was introduced in 2013 by Ongaro and Ousterhout.
Unlike Paxos, Raft was designed for **understandability**
without compromising efficiency and guarantees.

Raft breaks down the consensus process into a few key steps:
leader election, log replication, and safety.
Its modularity and clear delineation of roles and phases make it a preferred choice
for many modern distributed systems.

说明：Paxos 算法不容易实现，Raft 算法是对 Paxos 算法的简化和改进

概念介绍

- Leader 总统节点，负责发出提案
- Follower 追随者节点，负责同意 Leader 发出的提案
- Candidate 候选人，负责争夺 Leader

步骤：Raft 算法将一致性问题分解为两个的子问题，**Leader 选举**和**状态复制**

## Leader 选举

- 每个 Follower 都持有一个**定时器**
- 当**定时器**时间到了，而集群中仍然没有 Leader 时，Follower 将声明自己是 Candidate 并参与 Leader 选举，
  同时将消息发给其他节点来争取他们的投票，若其他节点长时间没有响应 Candidate 将重新发送选举信息
- 集群中其他节点将给 Candidate 投票
- 获得多数派支持的 Candidate 将成为第 M 任 Leader（M 任是最新的任期）
- 在任期内的 Leader 会不断发送心跳给其他节点证明自己还活着，其他节点受到心跳以后就清空自己的计时器并回复 Leader 的心跳。
  这个机制，保证其他 Follower 节点不会在 Leader 任期内参与 Leader 选举。

---

- 当 Leader 节点出现故障而导致 Leader 失联，没有接收到心跳的 Follower 节点将准备成为 Candidate 进入下一轮 Leader 选举
- 若出现两个 Candidate 同时选举并获得了相同的票数，那么这两个 Candidate 将随机推迟一段时间后再向其他节点发出投票请求，这保证了再次发送投票请求以后不冲突

## 状态复制

- Leader 负责接收来自 Client 的提案请求（红色提案表示未确认）
