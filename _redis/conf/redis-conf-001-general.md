---
title: "General：进程、日志"
sequence: "101"
---

按照指定的配置文件启动：

```text
./redis-server /path/to/redis.conf
```

## 数据库

- `databases 16`：设置数据库的数量，默认启动时使用 DB0，使用 `select <dbid>` 可以更换数据库

## IP 和 Port

- `bind IP`：监听指定的网络接口
- `port 6379`：指定使用的端口号
- `unixsocket /tmp/redis.sock`：指定监听的 socket，适用于 unix 环境

```text
bind 192.168.1.100 10.0.0.1     # listens on two specific IPv4 addresses
bind 127.0.0.1 ::1              # listens on loopback IPv4 and IPv6
bind * -::*                     # like the default, all available interfaces
```

在 Redis 的配置文件中，`bind` 指令用于指定 Redis 服务器监听哪些网络接口。
在默认的配置文件中，如果不指定 `bind` 指令，Redis 将会监听所有的网络接口。

- `bind *`：表示 Redis 服务器将会监听所有的 IPv4 地址上的网络接口，即所有可用的 IPv4 地址。
- `bind -::*`：表示 Redis 服务器将会监听所有的 IPv6 地址上的网络接口，即所有可用的 IPv6 地址。
- `bind 0.0.0.0`：也表示 Redis 服务器将会监听所有的 IPv4 地址上的网络接口，与 `bind *` 效果相同。

因此，`bind *` 和 `bind 0.0.0.0` 在实际应用过程中没有区别。只有在需要指定 IPv6 地址时，才需使用 `bind -::*`。

## 进程

- `daemonize yes`：启用后台守护进程运行模式
- `pidfile /var/run/redis.pid`：Redis 启动后的进程 ID 保存文件

## 密码

第 1 步，修改 `redis.conf`

输入 `/requirepass` 进行查找，找到 `#requirepass foobared`，在下面添加一行：

```text
requirepass str0ng_passw0rd
```

第 2 步，启动

```text
$ redis-server /opt/redis/conf/redis.conf
```

第 3 步，连接

```text
$ redis-cli -h 192.168.80.130 -p 6379 -a str0ng_passw0rd
```

## 日志

- `loglevel notice`：指定服务器信息显示的等级，4 个参数分别为 `debug`/`verbose`/`notice`/`warning`
- `logfile ""`：指定日志文件，默认是使用系统的标准输出

- `syslog-enabled no`：是否启用将记录记载到系统日志功能，默认为不启用
- `syslog-ident redis`：若启用日志记录，则需要设置日志记录的身份
- `syslog-facility local0`：若启用日志记录，则需要设置日志 facility，可取值范围为 local0~local7，表示不同的日志级别

## 其它配置

- `include /path/to/other.conf`：包含其它的 Redis 配置文件


