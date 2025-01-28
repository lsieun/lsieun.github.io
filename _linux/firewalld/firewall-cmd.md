---
title: "firewall-cmd"
sequence: "firewall-cmd"
---

[UP](/linux.html)


## 防火墙开启和关闭

### 查看防火墙状态

```text
$ sudo firewall-cmd --state
```

### 开启防火墙

```text
$ sudo systemctl enable firewalld
$ sudo systemctl start firewalld
```

或者：

```text
$ sudo systemctl enable --now firewalld
```

### 关闭防火墙

```text
$ sudo systemctl disable firewalld
$ sudo systemctl stop firewalld
```

或者：

```text
$ sudo systemctl disable --now firewalld
```

## 端口

### 端口开放

```text
$ sudo firewall-cmd --zone=public --add-port=26379/tcp --permanent
$ sudo firewall-cmd --reload
```

### 端口列表

查看目前开放的端口号 - 检查是否开启成功

```text
$ sudo firewall-cmd --list-ports
```
