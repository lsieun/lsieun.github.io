---
title: "Network"
sequence: "101"
---

## 查看帮助

```text
$ docker network --help

Usage:  docker network COMMAND

Manage networks

Commands:
  connect     Connect a container to a network
  create      Create a network
  disconnect  Disconnect a container from a network
  inspect     Display detailed information on one or more networks
  ls          List networks
  prune       Remove all unused networks
  rm          Remove one or more networks

Run 'docker network COMMAND --help' for more information on a command.
```

## 操作

### docker network ls

```text
$ $ docker network ls
NETWORK ID     NAME          DRIVER    SCOPE
f4a2e6ffa3d1   bridge        bridge    local
873a6c48cb3f   host          host      local
bf92466ae79f   none          null      local
```

```text
$ ip addr
1: lo: <LOOPBACK,UP,LOWER_UP>
    inet 127.0.0.1/8 scope host lo
2: ens32: <BROADCAST,MULTICAST,UP,LOWER_UP>
    inet 192.168.80.130/24 brd 192.168.80.255 scope global noprefixroute ens32
3: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP>
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
```

```text
$ docker inspect bridge
[
    {
        "Name": "bridge",
        "Id": "f4a2e6ffa3d14a1f4d9f068a5e3ed8e590809ba1aade4665111170b9445e57d5",
        "Created": "2023-06-14T04:47:21.344114517-04:00",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": null,
            "Config": [
                {
                    "Subnet": "172.17.0.0/16",    # 注意：这里的网段与上面的 docker0 是一致的
                    "Gateway": "172.17.0.1"
                }
            ]
        }
    }
]
```

```text
$ docker inspect host
[
    {
        "Name": "host",
        "Id": "873a6c48cb3f5c12b50217c10fa052aa4485004d9b0440e896dd90bbdf14bf14",
        "Created": "2023-06-10T02:01:32.949689435-04:00",
        "Scope": "local",
        "Driver": "host",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": null,
            "Config": []
        }
    }
]
```

```text
$ docker inspect none
[
    {
        "Name": "none",
        "Id": "bf92466ae79f43318b2ee7388c5a11ef38fe89b8cd16f8af06f9193f47a824b5",
        "Created": "2023-06-10T02:01:32.94083598-04:00",
        "Scope": "local",
        "Driver": "null",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": null,
            "Config": []
        }
    }
]
```

### create/rm

```text
docker network create my_network
docker network inspect my_network
docker network rm my_network
```

```text
$ ip addr
1: lo: <LOOPBACK,UP,LOWER_UP>
    inet 127.0.0.1/8 scope host lo
2: ens32: <BROADCAST,MULTICAST,UP,LOWER_UP>
    inet 192.168.80.130/24 brd 192.168.80.255 scope global noprefixroute ens32
3: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP>
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0

$ docker network create my_network
e153de1b76e46afb07c42198496f4da02fcaf7e02f86acefa051ccc3a4ebfb9d

$ docker network ls
NETWORK ID     NAME         DRIVER    SCOPE
8412f57ef132   bridge       bridge    local
96342d7006e9   host         host      local
e153de1b76e4   my_network   bridge    local
2854c578bf00   none         null      local

$ ip addr
1: lo: <LOOPBACK,UP,LOWER_UP>
    inet 127.0.0.1/8 scope host lo
2: ens32: <BROADCAST,MULTICAST,UP,LOWER_UP>
    inet 192.168.80.130/24 brd 192.168.80.255 scope global noprefixroute ens32
3: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP>
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
74: br-e153de1b76e4: <NO-CARRIER,BROADCAST,MULTICAST,UP>    # 注意：这里是新增的
    inet 172.21.0.1/16 brd 172.21.255.255 scope global br-e153de1b76e4

$ docker network inspect my_network
[
    {
        "Name": "my_network",
        "Id": "e153de1b76e46afb07c42198496f4da02fcaf7e02f86acefa051ccc3a4ebfb9d",
        "Created": "2023-12-16T21:37:09.495500561+08:00",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "172.21.0.0/16",
                    "Gateway": "172.21.0.1"
                }
            ]
        }
    }
]

$ docker network rm my_network
my_network

$ docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
8412f57ef132   bridge    bridge    local
96342d7006e9   host      host      local
2854c578bf00   none      null      local

$ ip addr
1: lo: <LOOPBACK,UP,LOWER_UP>
    inet 127.0.0.1/8 scope host lo
2: ens32: <BROADCAST,MULTICAST,UP,LOWER_UP>
    inet 192.168.80.130/24 brd 192.168.80.255 scope global noprefixroute ens32
3: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP>
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
```

### docker run

```text
docker run --network host
```


