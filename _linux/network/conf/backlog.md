---
title: "backlog"
sequence: "109"
---

[UP](/linux.html)


## 什么是 backlog

在 Linux 中，backlog 是用于管理 socket 连接的一个参数，它主要用于限制新连接进入队列的最大长度。
当应用程序调用 listen 系统调用让一个 socket 进入 LISTEN 状态时，需要指定一个 backlog 参数。
这个参数决定了服务器同时处理客户端连接的数量上限。

backlog 的作用主要体现在以下几点：

- 第 1 点，限制同时处理连接的数量：当服务器接收到客户端的连接请求时，会将其放入连接队列中。
  backlog 参数决定了队列的长度限制，从而避免了过多的连接请求导致系统资源耗尽。
- 第 2 点，缓冲连接请求：当服务器处于繁忙状态时，新的连接请求可能会被拒绝。
  backlog 参数允许服务器在一段时间内累积连接请求，以便在资源释放后尽快处理这些请求。
- 第 3 点，简化连接管理：backlog 参数使得服务器可以在一个队列中管理不同状态的连接，从而简化了连接管理的工作。

总的来说，backlog 在 Linux 中起到了限制并发连接数量、缓冲连接请求以及简化连接管理的作用。这有助于确保服务器在处理大量连接时能够保持稳定运行。

## 如何设置 backlog

在 CentOS 7 中，可以使用下面的方法设置 backlog 值：

1. 编辑 `/etc/sysctl.conf` 文件：

```
$ sudo vi /etc/sysctl.conf
```

2. 在文件末尾添加以下行（如果已存在，可以修改对应的值）：

```
net.core.somaxconn = 256
```

该参数表示系统 wide 最大监听队列长度。默认值为 128。

3. 保存并关闭文件。

4. 更新系统配置：

```
$ sudo sysctl -p
```

5. 通过命令确认参数是否生效：

```
$ sudo sysctl net.core.somaxconn
```

输出应显示新的 backlog 值。

请注意，修改 backlog 值可能会对系统性能产生影响，应根据实际需求进行调整。

## 什么是 somaxconn

somaxconn 应该是 socket max connection 的缩写。

`net.core.somaxconn` 是一个 Linux 内核参数，用于设置系统 wide 最大监听队列的长度。它决定了 backlog 参数的上限。

在 Linux 系统中，当一个 socket 处于监听状态时，新的连接请求会放入一个连接队列中，等待被接受。
`somaxconn` 参数用于限制这个连接队列的长度。当队列已满时，新的连接请求将被拒绝。

通常情况下，操作系统默认将 `somaxconn` 设置为一个较小的值，如 128 或者 256。
这可能会导致并发连接过多时，系统无法及时处理连接请求，从而影响性能。

通过增大 `somaxconn` 的值，可以提高系统对并发连接的支持能力。
但需要注意，过大的 `somaxconn` 值可能会导致系统资源的过度消耗，因此需要根据服务器的实际情况来进行调整。

## tcp_max_syn_backlog

`tcp_max_syn_backlog` 是一个 Linux 内核参数，用于设置 TCP 协议最大 SYN 连接请求队列长度。
当服务器接收到来自客户端的 SYN 连接请求时，这些请求会被放入一个队列中，等待确认。
`tcp_max_syn_backlog` 决定了这个队列的长度限制。

在网络拥堵或者高并发的场景中，`tcp_max_syn_backlog` 的大小对于系统的性能有着重要影响。如果队列满，服务器将拒绝新的 SYN 连接请求。

默认情况下，`tcp_max_syn_backlog` 的值为 1024。可以通过修改该参数来调整连接队列的长度，从而适应不同的网络环境
。需要注意的是，修改这个参数时要根据服务器的实际情况和网络负载来进行调整，以保证系统的稳定性和性能。

要查看和修改 `tcp_max_syn_backlog` 参数，可以使用以下方法：

1. 查看当前值：

```text
$ sudo sysctl -a
```

在输出中查找 `tcp_max_syn_backlog` 的值。

2. 修改参数：

```text
$ sudo sysctl -w net.ipv4.tcp_max_syn_backlog=new_value
```

将 `new_value` 替换为您希望设置的新值。

请注意，修改内核参数可能会对系统性能产生影响，请在了解相关知识并确保需要的情况下进行调整。

## VS

`net.core.somaxconn` 和 `net.ipv4.tcp_max_syn_backlog` 都是与连接队列长度相关的内核参数，但它们在功能和作用上有一些区别。

1. `net.core.somaxconn`：这个参数是系统 wide 的，用于设置所有类型的套接字的最大连接队列长度，默认为 128。它是监听队列的总体上限，包括 TCP、UDP、RAW 等各种类型的套接字队列。该参数主要影响 `listen` 系统调用，即处于监听状态的套接字的连接队列。

2. `net.ipv4.tcp_max_syn_backlog`：这个参数是 TCP 协议特有的，用于设置 TCP 的 SYN 连接请求队列的最大长度。当服务器收到客户端的 SYN 连接请求时，这些请求会放入 SYN 队列中，等待确认。该参数主要针对 TCP SYN 队列，影响 TCP 监听队列的长度，不影响其他类型的套接字。

总的来说，`net.core.somaxconn` 用于设置所有类型套接字的最大连接队列长度，而 `net.ipv4.tcp_max_syn_backlog` 只针对 TCP 协议的 SYN 连接请求队列。因此，如果只关注 TCP 连接队列的长度，可以更改 `net.ipv4.tcp_max_syn_backlog`；如果希望同时调整所有类型套接字的连接队列长度，可以修改 `net.core.somaxconn`。
