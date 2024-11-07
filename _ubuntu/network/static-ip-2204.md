---
title: "Static IP: Ubuntu 22.04"
sequence: "101"
---

After installing Ubuntu 22.04 the default network interface assigns an IP address using the DHCP server.
Also, the wireless network will be active and enable networking over the Wi-Fi network.

You can also configure the network interface with static IPv4 addresses.
Ubuntu 22.04 uses the **Netplan** as a network manager.

## 命令行

第 1 步，查看 IP 地址：

```text
$ ip address
```

![](/assets/images/ubuntu/network/ip-address-cmd.png)

第 2 步，编辑配置文件：

```text
$ cd /etc/netplan/
$ sudo vi 01-network-manager-all.yaml
```

```yaml
network:
  version: 2
  renderer: NetworkManager
  ethernets:
    ens32:
      dhcp4: false
      addresses:
        - 192.168.80.131/24
      nameservers:
        addresses: [223.5.5.5, 8.8.8.8]
      routes:
        - to: default
          via: 192.168.80.2

```

![](/assets/images/ubuntu/network/etc-netplan-network-manager-all-ens32.png)

- `ens32` – is the network interface name
- `addresses` – is used to configure IPv4 address on an interface. Make sure to define **CIDR**.
- `nameservers` – Set the name servers here.
- `routes` – This is used to set gateway on your system.

第 3 步，使用配置生效：

```text
$ sudo netplan apply
```

或者

```text
$ sudo netplan --debug apply
```


