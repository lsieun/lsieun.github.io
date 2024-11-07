---
title: "Static IP"
sequence: "ip"
---

## 设置 IP 地址

第 1 步，找到 ethernet interface 的名字：

```text
$ ip address
$ ip addr
$ ip a
```

![](/assets/images/centos/network/cmd-ip-address-ethernet-interface.png)

从上图可以看到，ethernet interface 的名字是 `ens32`。

第 2 步，切换 `/etc/sysconfig/network-scripts/` 目录，找到 `ifcfg-INTERFACENAME` 文件：

```text
/etc/sysconfig/network-scripts/ifcfg-INTERFACENAME
```

![](/assets/images/centos/network/ifcfg-ens32.png)


第 3 步，修改 `ifcfg-INTERFACENAME` 文件：

- 检查 `NAME` 和 `DEVICE`
- `BOOTPROTO`：将 `dhcp` 修改为 `static`，IP 地址设置为静态
- `ONBOOT`：`yes`，是否开机启用
- `UUID`：Optional – This is system specific and can be created using `uuidgen <interface name>` command

在结尾处添加：

```text
IPADDR=192.168.80.200
NETMASK=255.255.255.0
GATEWAY=192.168.80.2
DNS1=223.5.5.5
DNS2=223.6.6.6
```

示例：

```text
DEVICE="ens32"
TYPE="Ethernet"
ONBOOT="yes"             #是否开机启用
BOOTPROTO="static"       #IP地址设置为静态
IPADDR=192.168.80.200
NETMASK=255.255.255.0
GATEWAY=192.168.80.2
DNS1=223.5.5.5
DNS2=223.6.6.6
```

第 4 步，重新启动 `network` 服务：

```text
sudo systemctl restart network
```

## 备注

### 子网掩码

也可以将 `NETMASK`

```text
NETMASK=255.255.255.0
```

替换成 `PREFIX`:

```text
PREFIX=24
```

如果 `NETMASK` 和 `PREFIX` 都设置了，`PREFIX` 的优先级更高。

### 网关

如果使用 `VMWare Workstation`，那么网关可以参考 NAT 的设置：

![](/assets/images/centos/network/vmware-nat-gateway.png)

### BOOTPROTO

在设置静态 IP 地址时，BOOTPROTO 的取值通常是设置为 "static"，而不是 "none"。

BOOTPROTO（Bootstrap Protocol）是一个用于自动配置网络设置的协议。
在静态 IP 地址的设置中，我们通常不使用 BOOTPROTO 来进行网络设置，而是手动设置 IP 地址、子网掩码、网关和 DNS 等参数。

设置 BOOTPROTO 为 "static" 告诉系统使用静态的网络配置，以手动设置的方式进行网络连接，可以自定义和固定 IP 地址等网络参数。

而设置 BOOTPROTO 为 "none" 则意味着禁用自动配置协议，系统将不会尝试通过协议（如 DHCP）自动获取网络配置，需要手动设置网络参数。

总的来说，对于静态 IP 地址的设置，BOOTPROTO 应该被设置为 "static"，以便手动配置网络参数，而非 "none"。

### ens

网卡一般以 "ens" 开头的命名约定是在 Linux 系统中采用了 systemd（系统初始化和服务管理工具）后引入的一种命名规则。
它代表 "Ethernet Network Slot"（以太网网络槽位），数字部分 "32" 表示具体的槽位编号。

这种命名约定的目的是为了提供一种持久且可预测的接口命名方式，以简化系统管理和配置。
在传统的基于设备节点名称的命名方式中，网卡的命名可能会随着系统启动顺序的变化而改变，给管理和配置带来一些困扰。
而使用"ens"开头的命名规则，可以确保网卡在不同启动状态下，名称保持不变。

"ens32" 中的 "32" 表示槽位的编号，这个数字取决于具体的硬件和系统配置。
在各种不同的硬件平台上，网卡的槽位编号可能会有不同的取值，因此，具体的编号可能会因系统而异。

需要注意的是，"ens" 开头的命名约定并不是系统默认的命名方式，它需要系统管理员在配置文件中进行相应的设置，以启用这种命名规则。
如果系统中没有配置此规则，网卡的命名可能会使用其他的方式，如传统的 "eth0"、"eth1" 等方式命名。

## Reference

```text
/usr/share/doc/initscripts-*/sysconfig.txt
# 或者
/usr/share/doc/network-scripts-*/sysconfig.txt
```

在 `/etc/sysconfig/network-scripts/ifcfg-<interface_name>` 文件中，可以配置一系列的网络接口参数。以下是常见的一些配置项：

1. `DEVICE`：指定网络接口的设备名称。
2. `BOOTPROTO`：指定网络接口的启动协议，如 DHCP、静态分配等。
3. `ONBOOT`：指定是否在系统启动时激活该网络接口。
4. `IPADDR`：设置网络接口的 IPv4 地址。
5. `NETMASK`：设置网络接口的子网掩码。
6. `GATEWAY`：设置网络接口的默认网关。
7. `DNS1`、`DNS2`：设置网络接口的首选和备用 DNS 服务器。
8. `DOMAIN`：设置网络接口的搜索域。
9. `HWADDR`：设置网络接口的 MAC 地址。
10. `PREFIX`：设置网络接口的 IPv6 前缀长度。
11. `IPV6ADDR`：设置网络接口的 IPv6 地址。
12. `IPV6_DEFAULTGW`：设置网络接口的 IPv6 默认网关。
13. `ZONE`：指定网络接口所属的防火墙区域（适用于使用 firewalld 的系统）。

这仅是一些常见的配置项，实际上还有更多的配置可以进行。具体支持哪些配置项以及它们的默认值可能会因系统版本和网络组件的不同而有所差异。

要了解特定系统和版本中所支持的配置项及其默认值，最好查阅相关系统文档或官方文档。
对于大多数 Linux 发行版，你可以查看其官方文档/手册或相关的文档站点，如 Red Hat 官方文档、Ubuntu 官方文档等。
此外，你还可以查看网络接口配置文件的模板文件（如`/usr/share/doc/initscripts-*/sysconfig.txt` 或
`/usr/share/doc/network-scripts-*/sysconfig.txt`）以获取更多信息和示例。

请注意，不同的 Linux 发行版和网络配置工具可能会略有不同，因此确保参考适用于你的操作系统和配置工具的相关文档和指南。
