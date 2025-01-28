---
title: "Connection"
sequence: "103"
---

## 服务端

- `tcp-backlog 511`：此参数确定 TCP 连接中已完成队列（3 次握手之后）的长度，应小于 Linux 系统的/proc/sys/net/core/somaxconn 的值，此选项默认值为 511，而 Linux 的 somaxconn 默认值为 128，当并发量比较大且客户端反应缓慢的时候，可以同时提高这两个参数。
- `tcp-keepalive 0`：指定 ACKs 的时间周期，单位为秒，值非 0 的情况表示将周期性的检测客户端是否可用，默认值为 60 秒。

## 客户端

- `timeout N`：客户端空闲 N 秒后断开连接，参数 0 表示不启用
- `maxclients 10000` 同一时间内最大 clients 连接的数量，超过数量的连接会返回一个错误信息
