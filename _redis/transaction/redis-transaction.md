---
title: "Redis Transactions"
sequence: "101"
---

简单来说，事务，表示一组动作，要么全部执行，要么全部不执行。

例如，在社交网站上，用户 A 关注了 用户 B，那么需要在用户 A 的关注列表中加入 用户 B，
并且在用户B的粉丝列表中添加用户A，这两个行为要么全部执行，要么全部不执行；
否则，出现数据不一致的情况。

Redis 提供了简单的事务功能，将一组需要执行的命令放到 `multi` 和 `exec` 两个命令之间：

- `multi` 命令代表事务
- `exec` 命令代表事务结束
- `discard` 命令是回滚

```text
> multi
OK
> sadd A-follow B
QUEUED
> sadd B-fans A
QUEUED
> exec
```


