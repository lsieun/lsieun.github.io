---
title: "journalctl"
sequence: "journalctl"
---

[UP](/linux.html)


`journalctl` 是 Linux 操作系统中与日志相关的命令，它可以查看和管理 systemd journald 服务管理的系统日志。

在较早的版本中，Linux 通常使用 `syslogd` 或 `rsyslogd` 管理系统日志。而在更近的版本中，基于 `systemd` 的日志管理系统变得越来越普遍。
systemd-journald 服务是一个中心化的系统日志管理服务，它能够记录各种事件，包括服务启动、停止、错误、状态变化等等。
`journalctl` 命令就是用来访问和查询这些日志的。

`journalctl` 命令可以用于查看、检索和跟踪日志事件。
它不断地监控日志，而无需重启或重新加载服务，因此使用 `journalctl` 命令可以在实时中查看运行应用程序的日志。
还可以将它用于调试故障和分析服务的问题。

以下是几个常用的 `journalctl` 命令示例：

- `journalctl`: 查看所有日志信息。
- `journalctl -u <service>`: 查看指定服务的日志信息。
- `journalctl -f`: 在实时模式下跟踪最新的日志事件。
- `journalctl --since "2022-01-01 00:00:00" --until "2022-01-02 00:00:00"`: 按时间范围筛选显示日志。
- `journalctl -p err -b`: 查看最近一次启动的所有错误级别或更高级别的日志事件。

`journalctl` 的强大之处在于它提供了多种高级选项用于查询和分析日志数据，对于系统管理员或者开发人员来说都是非常实用的工具。


```text
journalctl -xeu kubelet
```

`journalctl -xeu kubelet` 命令是用来查看 `kubelet` 服务的日志信息。其中：

- `-x` 选项可以集成内核日志和系统日志。
- `-e` 选项会在显示最新的日志信息后，把 `journalctl` 命令挂起，等待新的日志信息产生，然后显示新的日志信息，类似于 `tail -f` 的效果。
- `-u` 选项用于指定要查看的服务名。

因此，执行 `journalctl -xeu kubelet` 命令会显示 `kubelet` 服务的日志信息，并在最后一行显示出命令挂起的信息，以便等待新的日志信息产生。
