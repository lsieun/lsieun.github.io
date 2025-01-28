---
title: "BusyBox"
sequence: "busybox"
---

BusyBox combines tiny versions of many common UNIX utilities into a single small executable.

## 镜像

DockerHub:

```text
https://hub.docker.com/_/busybox
```

```text
$ docker pull busybox
```

查看 busybox 的详细信息：

```text
$ docker inspect busybox
```

```text
$ docker inspect busybox
[
    {
        "Id": "sha256:f5f...ee8",
        "Config": {
            # PATH 路径
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
            ],
            # 运行命令
            "Cmd": [
                "sh"
            ],
            # 工作目录
            "WorkingDir": "/",
        }
    }
]
```

## 运行 BusyBox

```text
$ docker run -it --rm busybox
```

This will drop you into an `sh` shell to allow you to do what you want inside a BusyBox system.

## Dockerfile

Create a Dockerfile for a binary

```text
FROM busybox
COPY ./my-static-binary /my-static-binary
CMD ["/my-static-binary"]
```

This `Dockerfile` will allow you to create a minimal image for your statically compiled binary.
You will have to compile the binary in some other place like another container.
