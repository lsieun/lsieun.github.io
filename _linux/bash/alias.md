---
title: "alias"
sequence: "alias"
---

[UP](/linux.html)


## alias 是内置命令

通过 `type alias` 命令，可以得知 `alias` 是 `bash` 的内置命令

```bash
$ type alias

alias is a shell builtin
```

## 查看 alias

通过 `alias` 命令，可以查看已经定义好的命令别名。

```bash
$ alias

alias grep='grep --color=auto'
alias ll='ls -l --color=auto'
alias ls='ls --color=auto'
...
```

## 定义 alias

alias 定义命令别名的语法：

```bash
alias cmdalias='command [option] [argument]'
```

示例：

```bash
alias if0='ifconfig eth0'
```

妙用之处：可以通过使用 `alias` 简化命令的输入。例如，如果需要经常修改网络配置信息，可以定义以下命令别名：

```bash
alias cdnet='cd /etc/sysconfig/network-scripts'
```

那么，通过输入命令别名 `cdnet` 就可以直接切换到该目录(`/etc/sysconfig/network-scripts`)。

## 取消 alias

通过 `unalias` 命令，可以取消命令别名：

```bash
unalias cmdalias
```

示例：

```bash
unalias if0
```

## 调用命令本身

调用原来的命令的语法：

```bash
\cmdalias
```

这是一种特殊的情况。

例如，定义以下别名信息：

```bash
$ alias ifconfig='ifconfig eth0'
$ ifconfig

eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.80.70  netmask 255.255.255.0  broadcast 192.168.80.255
        inet6 fe80::20c:29ff:fe63:9a1a  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:63:9a:1a  txqueuelen 1000  (Ethernet)
        RX packets 148349  bytes 221799248 (211.5 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 71406  bytes 4315106 (4.1 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

此时输入 `ifconfig`，调用的是命令别名，只能查看到 `eth0` 网卡的信息。如果想调用原来的 `ifconfig` 命令，可以通过以下方式：

```bash
$ \ifconfig

eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.80.70  netmask 255.255.255.0  broadcast 192.168.80.255
        inet6 fe80::20c:29ff:fe63:9a1a  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:63:9a:1a  txqueuelen 1000  (Ethernet)
        RX packets 148349  bytes 221799248 (211.5 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 71406  bytes 4315106 (4.1 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

virbr0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        inet 192.168.122.1  netmask 255.255.255.0  broadcast 192.168.122.255
        ether 52:54:00:a7:57:42  txqueuelen 1000  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

## 保存 alias 命令：对当前用户有效

上面介绍的在 `terminal` 输入的 `alias` 命令，只在当前的用户 session 有效。如果用户重新连接，之前定义的 `alias` 就会全部失效。

为了将用户的 alias 保存下来（每次登录都有效），可以将 `alias` 定义在用户环境配置文件 `~/.bashrc` 中，示例如下：

```bash
# User specific aliases and functions
alias cdjava='cd ~/workdir/java_dir'
```

## 保存 alias 命令：对所有用户有效

在 `/etc/bashrc` 文件中，添加命令别名，可以对所有用户生效：

```bash
# System wide functions and aliases
alias cdnet='cd /etc/sysconfig/network-scripts'
```

## Demo

```bash
# User specific aliases and functions
alias cdnet='cd /etc/sysconfig/network-scripts'
alias vim='gvim -v'
alias cdo='cd -'
alias cdj='cd ~/workdir/java_dir'
alias cdp='cd ~/workdir/python'
alias eclipse='~/Software/jee-photon/eclipse/eclipse'
alias eclimd='~/Software/jee-photon/eclipse/eclimd'
alias mvnp='mvn clean package -Dmaven.test.skip=true'
alias jj='java -jar'
```
