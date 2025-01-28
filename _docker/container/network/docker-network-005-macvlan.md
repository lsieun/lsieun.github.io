---
title: "Macvlan"
sequence: "105"
---

We can use the `macvlan` network driver to assign a MAC address to each container's virtual network interface,
making it appear to be a physical network interface directly connected to the physical network.

In this case, you need to designate **a physical interface** on your **Docker host** to use for the Macvlan,
as well as the **subnet** and **gateway** of the network.

```text
cat >> /etc/sysctl.conf <<-'EOF'
net.ipv4.ip_forward=1
vm.max_map_count=655360
EOF
$ sudo sysctl -p
$ sudo systemctl disable --now firewalld
```

## 前提条件

使用 macvlan network 需要满足的条件：

- **操作系统**：Linux 操作系统支持，Windows 和 Mac 不支持。
- **Linux Kernel 的版本**：最低要求为 `3.9`，推荐使用 `4.0` 及以后版本。

```text
# 查看 Linux Kernel 版本
$ uname -r
```

## 命令行

### 创建 Macvlan 网络

第 1 步，创建一个新的 `macvlan80` 网络：

```text
$ docker network create --driver macvlan \
 --subnet=192.168.80.0/24 \
 --ip-range=192.168.80.0/24 \
 --gateway=192.168.80.2 \
 -o parent=ens32 \
 macvlan80
```

在上面的命令中，

- `--driver`（`-d`） 参数指定网络驱动为 `macvlan`
- `--subnet` 和 `--gateway` 分别指定子网和网关
- `-o parent` 指定父网卡名称

如果不确定 `parent` 写什么，可以使用 `ip addr` 命令查看：

```text
$ ip addr
1: lo: <LOOPBACK,UP,LOWER_UP>
    inet 127.0.0.1/8 scope host lo
2: ens32: <BROADCAST,MULTICAST,UP,LOWER_UP>    # 这里的名字是 ens32
    inet 192.168.80.130/24 brd 192.168.80.255 scope global noprefixroute ens32
```

```text
$ docker network create --driver macvlan \
>  --subnet=192.168.80.0/24 \
>  --ip-range=192.168.80.0/24 \
>  --gateway=192.168.80.2 \
>  -o parent=ens32 \
>  macvlan80
973b296b40751da2012a71e365f1b308ad7c46fb434a0b0b8d2d89c640cbf76d

$ docker network ls
NETWORK ID     NAME        DRIVER    SCOPE
8412f57ef132   bridge      bridge    local
96342d7006e9   host        host      local
973b296b4075   macvlan80   macvlan   local
2854c578bf00   none        null      local

$ docker inspect macvlan80
[
    {
        "Name": "macvlan80",
        "Id": "973b296b40751da2012a71e365f1b308ad7c46fb434a0b0b8d2d89c640cbf76d",
        "Created": "2023-12-16T21:56:07.444145163+08:00",
        "Scope": "local",
        "Driver": "macvlan",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "192.168.80.0/24",
                    "IPRange": "192.168.80.0/24",
                    "Gateway": "192.168.80.2"
                }
            ]
        }
    }
]
```

### 使用 Macvlan 网络

#### busybox

```text
$ docker run -it --rm \
  --network=macvlan80 \
  --ip=192.168.80.110 \
  busybox
```

#### Alpine

```text
$ docker run --name my-mini-linux \
  --rm -itd \
  --network=macvlan80 \
  --ip=192.168.80.120 \
  alpine:latest \
  /bin/sh
```

- `-itd`: run the container in the background and attach to it
- `–rm`: removes the container once it is stopped

```text
$ docker exec -it my-mini-linux /bin/sh
```

#### Nginx

```text
$ docker run -d --name=nginx \
  --ip=192.168.80.200 \
  --network macvlan80 \
  -p 80:80 \
  nginx:latest
```

## Docker Compose

### 静态 IP

File: `compose.yaml`

```yaml
services:
  nginx:
    container_name: nginx-test
    image: nginx:latest
    networks:
      macvlan80:
        ipv4_address: 192.168.80.200
networks:
  macvlan80:
    driver: macvlan
    driver_opts:
      parent: ens32
    ipam:
      config:
        - subnet: 192.168.80.0/24
          ip_range: 192.168.80.0/24
          gateway: 192.168.80.2
```

- `ipv4_address`：容器的 IP 地址
- `driver` 和 `driver_opts`：使用 Macvlan 网络，
- `ipam`：指 IP Address Management，即 **IP 地址管理**

启动：

```text
$ docker compose up
```

关闭：

```text
$ docker compose down
```

访问：

```text
http://192.168.80.200
```

## Reference

- [Networking using a macvlan network](https://docs.docker.com/network/network-tutorial-macvlan/)
- [Macvlan network driver](https://docs.docker.com/network/drivers/macvlan/)
- [ipam](https://docs.docker.com/compose/compose-file/06-networks/#ipam)
