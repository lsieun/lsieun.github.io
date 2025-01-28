---
title: "Redis 分布式锁（Redisson）"
sequence: "106"
---

**Watchdog 是 Redisson 的实现，而不是 Redis 的机制。**

Redisson 提供的分布式锁是支持锁自动续期的，如果线程仍旧没有执行完，Redisson 会自动给 Redis 中的目标 key 延长超时时间，
这在 Redisson 中称之为 Watchdog（看门狗）机制。

## 基于 REDISSON 做分布式锁

Redisson 是基于 Redis 的分布式对象和服务库，它实现了一系列分布式数据结构和分布式服务。
下面是 Redisson 分布式锁的基本实现原理：

Redisson 客户端： 开发者通过引入 Redisson 的依赖库，创建 Redisson 客户端连接到 Redis 服务器。
分布式锁对象创建： 使用 Redisson 客户端，通过 getLock 方法创建分布式锁对象。
锁的获取： 当一个客户端想要获取锁时，它会向 Redis 服务器发送 SETNX（SET if Not eXists）命令，尝试在 Redis 中创建一个指定键名的值。
设置过期时间： 锁的持有者可以在创建锁时设置一个过期时间，用于防止锁被长时间持有。过期时间一般通过 Redis 的 EXPIRE 命令实现。
锁的续期： 当一个客户端成功获取锁后，它可以通过定时任务或其他机制定期向 Redis 更新锁的过期时间，从而实现锁的续期。
锁的释放： 当锁的持有者完成任务后，它可以通过解锁操作释放锁。解锁操作会发送 DEL（Delete）命令，删除锁对应的 Redis 键。
监听锁状态： Redisson 支持锁的监听机制，当锁的状态发生变化时，可以触发相应的监听事件。

Redisson 的实现原理基于 Redis 提供的原子操作，如 SETNX 和 EXPIRE 命令，以及 Redis 提供的发布 - 订阅机制来实现锁的监听。
通过这些机制，Redisson 能够提供可靠的分布式锁，并支持锁的续期和监听等功能。

使用方式：
Redisson 分布式锁的使用非常简单，通常包括以下几个步骤：

引入 Redisson 依赖：在项目中引入 Redisson 的依赖库。
创建 Redisson 客户端：通过配置 Redisson 的连接信息创建一个 Redisson 客户端。
获取分布式锁：使用 Redisson 客户端调用 getLock 方法获取分布式锁对象。
加锁和解锁：使用分布式锁对象的 lock 方法进行加锁操作，使用 unlock 方法进行解锁操作。
锁续期：Redisson 会自动续期锁，不需要手动操作。

优点：

丰富的功能： Redisson 提供了丰富的分布式锁功能，包括可重入锁、续期锁、公平锁等，适应不同的业务需求。
易于使用： Redisson 的 API 设计简单易用，开发人员可以快速上手使用分布式锁。
高性能： Redisson 底层使用 Redis，具有高性能和高并发的特点。
维护更新： Redisson 是一个活跃维护的开源项目，可以享受到持续的更新和 bug 修复。

缺点：

依赖性： 使用 Redisson 需要引入额外的依赖库，增加了项目的复杂性。
集成难度： 对于不熟悉 Redisson 的开发人员，初次集成可能需要一些时间。

