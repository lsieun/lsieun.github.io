---
title: "普通用户管理"
sequence: "101"
---

```text
docker run hello-world
```

## 操作

第一步，创建 `docker` 组：

```text
$ sudo groupadd docker
```

第二步，将当前用户添加到 `docker` 组：

```text
$ sudo usermod -aG docker $USER
```

第三步，刷新权限:

```text
$ newgrp docker
```

如果不生效，可以登出，再进行登录。

第四步，验证：

```text
$ docker run hello-world
```

## 原因解释

The Docker daemon binds to a Unix socket, not a TCP port.
By default, it's the `root` user that owns the Unix socket,
and other users can only access it using `sudo`.
The Docker daemon always runs as the `root` user.

```text
docker daemon --> unix socket --> root

root 用户拥有 Unix socket，而普通用户只能通过 sudo 进行访问。
```

```text
什么是 Unix Socket？

Unix Socket 是一种特殊的套接字（Socket）。
与常规套接字一样，它也用于进程间通信，
但是不同的是它是通过文件系统实现的，而非网络。

Unix Socket 的作用是让两个不同的进程在同一个主机上进行通信，而不需要通过网络协议来传输数据。
这种方式比网络传输更加高效，并且可以减少网络延迟和负载。

Unix Socket 通常被用于在本地进行各种系统管理操作，例如启动和停止服务等。
在 Linux 系统上，很多服务都会使用 Unix Socket 来管理它们的进程。

Docker 也采用 Unix Socket 来管理它的守护进程和客户端之间的通信。
Docker 的 API 客户端通过 Unix Socket 来与 Docker 守护进程进行通信，
这样可以避免使用网络协议，提高了通信效率。
```

If you don't want to preface the `docker` command with `sudo`,
create a Unix group called `docker` and add users to it.
When the Docker daemon starts, it creates a Unix socket accessible by members of the `docker` group.

```text
创建一个 docker group 来管理
```

On some Linux distributions,
the system automatically creates this `docker` group when installing Docker Engine using a package manager.
In that case, there is no need for you to manually create the group.

```text
有些 Linux distribution 会自动创建 docker group
```

> Warning: The `docker` group grants root-level privileges to the user.

## Reference

- [Linux post-installation steps for Docker Engine](https://docs.docker.com/engine/install/linux-postinstall/)
