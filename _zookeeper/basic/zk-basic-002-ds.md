---
title: "ZooKeeper 数据结构"
sequence: "102"
---

## 数据模型 ZNode

在 ZooKeeper中，数据信息被保存在一个个数据节点上，这些节点被称为 ZNode。

ZNode 是 ZooKeeper 中最小数据单位，在 ZNode 下面又可以再挂 ZNode，
这样一层层下去就形成了一个层次化命名空间 ZNode 树，我们称为 ZNode Tree，
它采用类似文件系统的层级树状结构进行管理。

## ZNode 的类型

ZooKeeper 节点类型可以为分三大类：

- 时间
    - 持久性节点（Persistent）
    - 临时性节点（Ephemeral）
- 有序
    - 顺序性节点（Sequential）

在创建节点的时候，通过组合可以生成以下四种节点类型：

- 持久节点
- 持久顺序节点
- 临时节点
- 临时顺序节点

不同类型的节点，有不同的生命周期：

- **持久节点**：是 ZooKeeper 中最常见的一种节点类型。所谓持久节点，就是指节点被创建后一直存在于服务器，直到删除操作主动清除。
- **持久顺序节点**：就是有顺序的持久节点，节点特性和持久节点是一样的，只是额外特性表现在顺序上。
  顺序特性，实质是在创建节点的时候，会在节点名后面加上一个数字后缀，来表示其顺序。
- **临时节点**：就是会被自动清理掉的节点，它的生命周期和客户端会话绑在一起；客户端会话结束，节点会被删除掉。
  与持久性节点不同的是，临时节点不能创建子节点。
- **临时顺序节点**：就是有顺序的临时节点，和持久顺序节点相同，在其创建的时候，会在名字后面加上数字后缀。

事务 ID

在 ZooKeeper 中，事务是指能够改变 ZooKeeper 服务器状态的操作，我们也称之为事务操作或更新操作，
一般包括数据节点创建与删除、数据节点内容更新等操作。

对于每一个事务请求，ZooKeeper 都会为其分配一个全局唯一的事务 ID，用 `ZXID` 来表示，通常是一个 64 位的数字。
每一个 `ZXID` 对应一次更新操作，从这些 `ZXID` 中可以间接地识别出 ZooKeeper 处理这些更新操作请求的全局顺序。

## ZNode 的状态信息

整个 ZNode 节点内容包括两部分：

- 节点**数据内容**
- 节点**状态信息**

```text
ls /zookeeper 
[config, quota]

stat /zookeeper 
cZxid = 0x0
ctime = Thu Jan 01 08:00:00 CST 1970
mZxid = 0x0
mtime = Thu Jan 01 08:00:00 CST 1970
pZxid = 0x0
cversion = -2
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 0
numChildren = 2
```

状态信息：

- `cZxid` 就是 Create ZXID，表示节点被创建时的事务 ID
- `ctime` 就是 Create Time，表示节点创建时间
- `mZxid` 就是 Modified ZXID，表示节点最后一次被修改的事务 ID
- `mtime` 就是 Modified Time，表示节点最后一次被修改的时间
- `pZxid` 表示该节点的**子节点列表**最后一次被修改的事务 ID。只有**子节点列表**变更，才会更新 `pZxid`，子节点内容变更不会更新。
- `cVersion`：表示子节点的版本号
- `dataVersion`：表示内容版本号
- `aclVersion`：标识 acl 版本
- `ephemeralOwner` 表示创建该临时节点时的会话 sessionID。如果是持久性节点，那么值为 0。
- `dataLength`：表示数据长度。
- `numChildren` 表示真系子节点数量。

