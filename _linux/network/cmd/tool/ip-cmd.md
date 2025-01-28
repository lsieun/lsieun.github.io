---
title: "ip command"
sequence: "101"
---

[UP](/linux.html)


## 查看所有 IP 地址

```text
$ ip address
$ ip addr
$ ip a
```

```text
$ ip address
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: ens32: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 00:0c:29:7a:30:92 brd ff:ff:ff:ff:ff:ff
    altname enp2s0
    inet 192.168.80.131/24 brd 192.168.80.255 scope global noprefixroute ens32
       valid_lft forever preferred_lft forever
    inet6 fe80::20c:29ff:fe7a:3092/64 scope link 
       valid_lft forever preferred_lft forever
```

```text
$ ip link
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: ens32: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP mode DEFAULT group default qlen 1000
    link/ether 00:0c:29:04:f4:2b brd ff:ff:ff:ff:ff:ff
3: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN mode DEFAULT group default 
    link/ether 02:42:4a:1a:25:bd brd ff:ff:ff:ff:ff:ff
```

## 查看特定网卡的 IP 地址

```text
$ ip address show ens32
2: ens32: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 00:0c:29:7a:30:92 brd ff:ff:ff:ff:ff:ff
    altname enp2s0
    inet 192.168.80.131/24 brd 192.168.80.255 scope global noprefixroute ens32
       valid_lft forever preferred_lft forever
    inet6 fe80::20c:29ff:fe7a:3092/64 scope link 
       valid_lft forever preferred_lft forever
```
