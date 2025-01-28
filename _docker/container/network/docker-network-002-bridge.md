---
title: "bridge"
sequence: "102"
---

- **default bridge network**: the default `bridge` network that Docker sets up for you automatically.
  This network is not the best choice for production systems.
- **user-defined bridge network**: This is recommended for standalone containers running in production.

## 概览

<table>
    <thead>
    <tr>
        <th>对比</th>
        <th>默认Bridge网络<br/>（default bridge network）</th>
        <th>自定义Bridge网络<br/>（user-defined bridge network）</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>创建</td>
        <td>Docker 自带</td>
        <td>由用户创建</td>
    </tr>
    <tr>
        <td>容器名解析</td>
        <td>不能</td>
        <td>能</td>
    </tr>
    <tr>
        <td>生产环境</td>
        <td>不推荐</td>
        <td>推荐</td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    </tbody>
</table>

- Remember, the default `bridge` network is not recommended for production.

## 默认的 Bridge 网络

### 创建

默认的 bridge 网络，不需要手动创建，而是由 Docker 自动创建的。

事实上，Docker 会自动创建 `bridge`、`host` 和 `none` 三个默认网络，
我们可以使用 `docker network ls` 命令查看：

```text
$ docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
8412f57ef132   bridge    bridge    local
96342d7006e9   host      host      local
2854c578bf00   none      null      local
```

The `host` and `none` are not fully-fledged networks,
but are used to start a container connected directly to the Docker daemon host's networking stack,
or to start a container with no network devices.

### 网络是否通畅

```text
$ docker run -dit --name alpine1 alpine ash
$ docker run -dit --name alpine2 alpine ash
```

- `ash`: the Alpine's default shell rather than `bash`.
- The `-dit` flags mean to start the container detached (in the background),
  interactive (with the ability to type into it), and with a TTY (so you can see the input and output).

Because you have not specified any `--network` flags,
the containers connect to the default `bridge` network.

```text
$ docker run -dit --name alpine1 alpine ash
4b8c7108f9f33a751155f61d93095059f235aa96a68c638db080a97a5f4015a1

$ docker run -dit --name alpine2 alpine ash
08cd53765cd6edabe66ea76831851c6eed947b626427dd4170172c9f1f69df3e

$ docker container ls
CONTAINER ID   IMAGE     COMMAND   CREATED         STATUS         PORTS     NAMES
08cd53765cd6   alpine    "ash"     2 minutes ago   Up 2 minutes             alpine2
4b8c7108f9f3   alpine    "ash"     3 minutes ago   Up 3 minutes             alpine1
```

第 3 步，查看 `bridge` 的信息：

```text
$ docker network inspect bridge
[
    {
        "Name": "bridge",      # A. Name
        "Id": "841...cd1",     # A. Id
        "Scope": "local",      # A. Scope
        "Driver": "bridge",    # A. Driver
        "IPAM": {
            "Driver": "default",
            "Config": [
                {
                    "Subnet": "172.17.0.0/16",    # B. 子网
                    "Gateway": "172.17.0.1"       # B. 网关
                }
            ]
        },
        "Containers": {
            "08c...f3e": {
                "Name": "alpine2",                 # C. alpine2
                "IPv4Address": "172.17.0.3/16",    # C. IP 地址
                "MacAddress": "02:42:ac:11:00:03",
            },
            "4b8...5a1": {
                "Name": "alpine1",                 # D. alpine1
                "IPv4Address": "172.17.0.2/16",    # D. IP 地址
                "MacAddress": "02:42:ac:11:00:02",
            }
        },
        "Options": {
            "com.docker.network.bridge.name": "docker0",
        },
        "Labels": {}
    }
]
```

第 4 步，进入容器，查看 IP 信息：

```text
$ docker attach alpine1
```

```text
# ip addr show
1: lo: <LOOPBACK,UP,LOWER_UP>
    inet 127.0.0.1/8 scope host lo
80: eth0@if81: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN>
    inet 172.17.0.2/16 brd 172.17.255.255 scope global eth0    # 这里的 IP 地址与上一步的 IP 地址是一致的
```

第 5 步，在 alpine1 中尝试 ping 一下百度：

```text
# ping -c 2 baidu.com
PING baidu.com (39.156.66.10): 56 data bytes
64 bytes from 39.156.66.10: seq=0 ttl=127 time=23.566 ms
64 bytes from 39.156.66.10: seq=1 ttl=127 time=32.000 ms

--- baidu.com ping statistics ---
2 packets transmitted, 2 packets received, 0% packet loss
round-trip min/avg/max = 23.566/27.783/32.000 ms
```

- The `-c 2` flag limits the command to two ping attempts.

第 6 步，在 alpine1 中 ping 一下 alpine2 的 IP 地址：

```text
# ping -c 2 172.17.0.3
PING 172.17.0.3 (172.17.0.3): 56 data bytes
64 bytes from 172.17.0.3: seq=0 ttl=64 time=0.109 ms
64 bytes from 172.17.0.3: seq=1 ttl=64 time=0.186 ms

--- 172.17.0.3 ping statistics ---
2 packets transmitted, 2 packets received, 0% packet loss
round-trip min/avg/max = 0.109/0.147/0.186 ms
```

### 停止

```text
$ docker container stop alpine1 alpine2
$ docker container rm alpine1 alpine2
```

## 用户自定义的 Bridge 网络

### 创建

自定义 bridge 网络，则需要我们使用命令进行创建：

```text
$ docker network create --driver bridge alpine-net
```

其中，`--driver bridge` 可以省略，因为默认情况下就是使用 `bridge`。

### 详细信息

```text
$ docker network create --driver bridge alpine-net
a93c27b43a2a7cb44d872bf3b9aae866b9445dd1643513d79f9c72bb4c98cceb

$ docker network ls
NETWORK ID     NAME         DRIVER    SCOPE
a93c27b43a2a   alpine-net   bridge    local
0c899c19becb   bridge       bridge    local
96342d7006e9   host         host      local
2854c578bf00   none         null      local
```

```text
$ docker network inspect alpine-net
[
    {
        "Name": "alpine-net",
        "Id": "a93c27b43a2a7cb44d872bf3b9aae866b9445dd1643513d79f9c72bb4c98cceb",
        "Created": "2024-01-28T17:30:57.435299019+08:00",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "172.18.0.0/16",
                    "Gateway": "172.18.0.1"
                }
            ]
        },
        ...
    }
]
```

### 创建容器实例

Create your four containers. 

创建 4 个容器：

- bridge:
    - alpine3
    - alpine4
- alpine-net
    - alpine1
    - alpine2
    - alpine4

```text
$ docker run -dit --name alpine1 --network alpine-net alpine ash

$ docker run -dit --name alpine2 --network alpine-net alpine ash

$ docker run -dit --name alpine3 alpine ash

$ docker run -dit --name alpine4 --network alpine-net alpine ash

# 注意：这里让 alpine4 加入默认的 bridge 网络
$ docker network connect bridge alpine4
```

注意：

- `docker run`：只能连接一个网络。
- `docker network connect`：可以连接更多的网络

```text
Notice the `--network` flags.
You can only connect to one network during the `docker run` command,
so you need to use `docker network connect` afterward to connect `alpine4` to the `bridge` network as well.
```

### 查看网络信息

```text
$ docker container ls
CONTAINER ID   IMAGE     COMMAND   CREATED              STATUS              PORTS     NAMES
4c752ae899c7   alpine    "ash"     About a minute ago   Up About a minute             alpine4
71ccaf3337cb   alpine    "ash"     About a minute ago   Up About a minute             alpine3
0ad77bd08ca1   alpine    "ash"     About a minute ago   Up About a minute             alpine2
4c3570597af5   alpine    "ash"     2 minutes ago        Up 2 minutes                  alpine1
```

```text
$ docker network inspect bridge
[
    {
        "Name": "bridge",
        "Id": "0c899c19becbe40c06df113a8611577ea811cbf4f3cb24dc2c18ca7d578413a9",
        "Created": "2024-01-28T16:07:32.456937211+08:00",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": null,
            "Config": [
                {
                    "Subnet": "172.17.0.0/16",
                    "Gateway": "172.17.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "4c752ae899c7190b95dc55fc836bbe53c82f42ca2350707f2530b111dd756f6c": {
                "Name": "alpine4",
                "EndpointID": "4f268967811185d4f44fbf17728b456275f77d9a020676a5d7215e9a1438d4e6",
                "MacAddress": "02:42:ac:11:00:03",
                "IPv4Address": "172.17.0.3/16",
                "IPv6Address": ""
            },
            "71ccaf3337cbaa99e209fddd71ced16330178458b012a804083eb01caaa285ce": {
                "Name": "alpine3",
                "EndpointID": "92981c2fe45e35c0d1d5353894bf568d10e85c36d596fcd37fd71bcb92006eb1",
                "MacAddress": "02:42:ac:11:00:02",
                "IPv4Address": "172.17.0.2/16",
                "IPv6Address": ""
            }
        },
        ...
    }
]
```

```text
$ docker network inspect alpine-net
[
    {
        "Name": "alpine-net",
        "Id": "a93c27b43a2a7cb44d872bf3b9aae866b9445dd1643513d79f9c72bb4c98cceb",
        "Created": "2024-01-28T17:30:57.435299019+08:00",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "172.18.0.0/16",
                    "Gateway": "172.18.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "0ad77bd08ca140212dcd6bd07ea3ae89850ba66e282a1544e25eb88acb1199b7": {
                "Name": "alpine2",
                "EndpointID": "4367eb7a63672e814b352883a153ce98b7a63762e2568f61934be15e7373699b",
                "MacAddress": "02:42:ac:12:00:03",
                "IPv4Address": "172.18.0.3/16",
                "IPv6Address": ""
            },
            "4c3570597af52f2081c0a7aacdfa3923ab26e960cea66045d25d1bee16bca4c0": {
                "Name": "alpine1",
                "EndpointID": "3e79235eb0bb1cebab8dff4383f95f74315fce69685885fbf89a19501f0b1e2f",
                "MacAddress": "02:42:ac:12:00:02",
                "IPv4Address": "172.18.0.2/16",
                "IPv6Address": ""
            },
            "4c752ae899c7190b95dc55fc836bbe53c82f42ca2350707f2530b111dd756f6c": {
                "Name": "alpine4",
                "EndpointID": "23da3866fdcb1585d55521734a38470752a1abf006bcb2125cf7dd7991a9feea",
                "MacAddress": "02:42:ac:12:00:04",
                "IPv4Address": "172.18.0.4/16",
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {}
    }
]
```

### 网络是否畅通

On user-defined networks like `alpine-net`,
containers can not only communicate by IP address, but can also resolve a **container name** to an IP address.
This capability is called **automatic service discovery**.

Let's connect to `alpine1` and test this out.
alpine1 should be able to resolve `alpine2` and `alpine4` (and `alpine1`, itself) to IP addresses.

```text
Automatic service discovery can only resolve custom container names, not default automatically generated container names.
```

```text
$ docker container attach alpine1

# ping -c 2 alpine2
PING alpine2 (172.18.0.3): 56 data bytes
64 bytes from 172.18.0.3: seq=0 ttl=64 time=0.153 ms
64 bytes from 172.18.0.3: seq=1 ttl=64 time=0.122 ms

# ping -c 2 alpine4

# ping -c 2 alpine1

# ping -c 2 alpine3
ping: bad address 'alpine3'
```

```text
$ docker container attach alpine4

# ping -c 2 alpine1
# ping -c 2 alpine2

# ping -c 2 alpine3
ping: bad address 'alpine3'

# 这里是 alpine3 的IP地址
# ping -c 2 172.17.0.2
PING 172.17.0.2 (172.17.0.2): 56 data bytes
64 bytes from 172.17.0.2: seq=0 ttl=64 time=0.158 ms
64 bytes from 172.17.0.2: seq=1 ttl=64 time=0.187 ms

# ping -c 2 alpine4
```

### 停止

```text
$ docker container stop alpine1 alpine2 alpine3 alpine4
$ docker container rm alpine1 alpine2 alpine3 alpine4
$ docker network rm alpine-net
```

## Bridge 本质

![](/assets/images/docker/network/bridge-network.jpg)

第 1 步，从 Host 上查看：

```text
$ ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
2: ens32: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:0c:29:d1:e2:9b brd ff:ff:ff:ff:ff:ff
    inet 192.168.80.130/24 brd 192.168.80.255 scope global noprefixroute ens32
       valid_lft forever preferred_lft forever
3: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default 
    link/ether 02:42:eb:5f:fe:41 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
8: br-a93c27b43a2a: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default 
    link/ether 02:42:1b:fc:b3:ea brd ff:ff:ff:ff:ff:ff
    inet 172.18.0.1/16 brd 172.18.255.255 scope global br-a93c27b43a2a
       valid_lft forever preferred_lft forever
```

第 2 步，分别查看 `bridge` 和 `alpine-net`：

```text
$ docker inspect bridge
[
    {
        "Name": "bridge",
        "Id": "0c899c19becbe40c06df113a8611577ea811cbf4f3cb24dc2c18ca7d578413a9",
        "Created": "2024-01-28T16:07:32.456937211+08:00",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": null,
            "Config": [
                {
                    "Subnet": "172.17.0.0/16",
                    "Gateway": "172.17.0.1"
                }
            ]
        },
        ...
    }
]
```

```text
$ docker inspect alpine-net
[
    {
        "Name": "alpine-net",
        "Id": "a93c27b43a2a7cb44d872bf3b9aae866b9445dd1643513d79f9c72bb4c98cceb",
        "Created": "2024-01-28T17:30:57.435299019+08:00",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "172.18.0.0/16",
                    "Gateway": "172.18.0.1"
                }
            ]
        },
        ...
    }
]
```

## Reference

- [Networking with standalone containers](https://docs.docker.com/network/network-tutorial-standalone/)
- [Bridge Network 簡介](https://godleon.github.io/blog/Docker/docker-network-bridge/)
