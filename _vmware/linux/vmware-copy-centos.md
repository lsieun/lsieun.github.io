---
title: "复制 CentOS 虚拟机"
sequence: "101"
---

## Machine Id

```text
$ sudo rm -rf /etc/machine-id
$ sudo dbus-uuidgen --ensure=/etc/machine-id
```

## HostName

```text
$ sudo hostnamectl set-hostname server<IP>
```

```text
$ sudo hostnamectl set-hostname webserver.k8s.lab
```

## 静态 IP 地址配置

第 1 步，找到文件 `/etc/sysconfig/network-scripts/ifcfg-ens32`：

```text
$ cd /etc/sysconfig/network-scripts/
$ sudo vi ifcfg-ens32
```

第 2 步，修改内容：

```text
DEVICE="ens32"
TYPE="Ethernet"
ONBOOT="yes"             # 是否开机启用
BOOTPROTO="static"       #IP 地址设置为静态
IPADDR=192.168.80.200
NETMASK=255.255.255.0
GATEWAY=192.168.80.2
DNS1=223.5.5.5
DNS2=223.6.6.6
```

第 3 步，更新 UUID：

```text
:sh 
$ uuidgen ens32
Ctrl + D
```

```text
UUID=
```

第 4 步，重新启动 `network` 服务：

```text
$ sudo systemctl restart network
```

## /etc/hosts

```text
$ sudo tee -a /etc/hosts <<EOF
192.168.80.131 master01.k8s.lab
192.168.80.132 master02.k8s.lab
192.168.80.133 master03.k8s.lab
192.168.80.231 worker01.k8s.lab
192.168.80.232 worker02.k8s.lab
EOF
```
