---
title: "ip forward"
sequence: "ip-forward"
---

[UP](/linux.html)


**IP forwarding** is the ability for an operating system to accept incoming network packets on one interface,
recognize that it is not meant for the system itself,
but that it should be passed on to another network, and then forwards it accordingly.

Linux 系统默认是禁止数据包转发的。
当主机拥有多块网卡时，其中一块收到数据包，
根据数据包的目的 IP 地址将数据包发往另一块网卡，
该网卡根据路由表继续发送数据包。
这通常是路由器所要实现的功能。

## 查看是否开启

第一种方式，使用 `sysctl` 命令查看是否开启了 IP Forward 功能：

```text
$ sysctl net.ipv4.ip_forward
net.ipv4.ip_forward = 1
```

第二种方式，查看 `/proc/sys/net/ipv4/ip_forward` 文件的值：

```text
$ cat /proc/sys/net/ipv4/ip_forward
1
```

## 临时开启 IP 转发

第一种方法：

```text
echo 1 > /proc/sys/net/ipv4/ip_forward
```

第二种方法：

```text
sysctl -w net.ipv4.ip_forward=1
```

其中，`-w` 表示临时改变某个指定参数的值。

## 永久开启 IP 转发

```text
vi /etc/sysctl.conf
```

```text
net.ipv4.ip_forward=1
```

## 从指定的文件加载系统参数

```text
sysctl -p <filename> (default /etc/sysctl.conf)
```

## 测试跨网段 Ping 通



## Reference

文章：

- [Kernel IP Forwarding](https://www.baeldung.com/linux/kernel-ip-forwarding)
- [What is and how do I enable IP forwarding on Linux?](https://openvpn.net/faq/what-is-and-how-do-i-enable-ip-forwarding-on-linux/)

视频

- [IP(路由)转发 ip_forward](https://www.bilibili.com/video/BV1A3411P7Eu/)
