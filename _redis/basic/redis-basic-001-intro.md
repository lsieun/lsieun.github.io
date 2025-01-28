---
title: "Redis Intro"
sequence: "101"
---

NoSQL 最常见的解释是 non-relational，Not Only SQL。

## 用户

### 默认用户

Redis 默认的用户名称是 `default`。
当安装并启动 Redis 服务器时，默认情况下会创建一个名为 `default` 的用户。
我们可以使用这个用户连接到 Redis 服务器，并进行相应的操作。

### 查看当前用户

在 Redis 中，可以使用 ACL（Access Control List）功能来查看当前用户是谁：

```text
> acl whoami
"default"
```

需要注意的是，要使用 ACL 功能，需要先配置 ACL 规则，否则无法查看当前用户。

## Client

- [AnotherRedisDesktopManager](https://github.com/qishibo/AnotherRedisDesktopManager)
