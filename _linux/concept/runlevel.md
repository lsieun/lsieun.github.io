---
title: "runlevel"
sequence: "runlevel"
---

[UP](/linux.html)


Linux 是通过**运行级别**来确定系统启动时到底启动哪些服务的。

Linux 默认有 7 个运行级别（runlevel），具体如下：

- 0: 关机
- 1: 单用户模式，可以想象为 Windows 的安全模式，主要用于系统修复
- 2: 不完全的命令行模式，不含 NFS 服务
- 3: 完全的命令行模式，就是标准字符界面
- 4: 系统保留
- 5: 图形模式
- 6: 重新启动

在 Linux 系统中可以使用 `runlevel` 命令来查看系统的运行级别，命令如下：

```text
$ runlevel
N 3
```

使用 init 切换不同运行级别，只需使用 init 命令（注意这不是 init 进程）即可，命令如下：

```text
[root@localhost ~]# init 5
# 进入图形界面，当然要已经安装了图形界面才可以
[root@localhost ~]# init 0
# 关机
[root@localhost ~]# init 6
# 重新启动
```

使用 `init` 命令关机和重启并不是太安全，容易造成数据丟失。所以推荐大家使用 `shutdown` 命令进行关机和重启。
`/etc/inittab` 配置文件的功能就是确定系统的默认运行级别，也就是系统开机后会进入那个运行级别。
