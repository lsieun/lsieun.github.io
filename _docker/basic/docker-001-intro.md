---
title: "Docker Intro"
sequence: "101"
---

Docker是基于Go语言实现的云开源项目，是一个容器虚拟化技术。

- [官网](https://www.docker.com/)
- [仓库](https://hub.docker.com/)

Docker的基本组成部分：

- 镜像（image）：模板
- 容器（container）：实例
- 仓库（repository）：模板的仓库

- [Install Docker Engine on CentOS](https://docs.docker.com/engine/install/centos/)

## Docker Engine

Docker Engine is an open source containerization technology for building and containerizing your applications.

> Docker Engine ---> containerization technology ---> containerizing your applications

Docker Engine acts as a **client-server application** with:

- A server with a long-running daemon process `dockerd`.
- APIs which specify interfaces that programs can use to talk to and instruct the Docker daemon.
- A command line interface (CLI) client `docker`.

So **the client**, **the API** and **the deamon** is also part of **Docker Engine**.

> Docker Engine = server + API + client

## Docker Desktop

Basically **Docker Desktop** is **a virtual machine** + **Graphical user interface** with some extra features
like the new extensions and running a single-node Kubernetes “cluster” easily.

> Docker Desktop = a virtual machine + Graphical user interface

Inside the virtual machine there is Docker CE (Docker Community Edition) daemon.

> virtual machine = Docker CE daemon

In case of Docker Desktop, the daemon is inside the virtual machine, but the client is on your host machine.

> Desktop = virtual machine = deamon = server, client = host machine

There are also the following tools:

- **Docker Compose**: A tool that allows you to define and share multi-container definitions.
- **Docker Machine**: A tool to launch Docker hosts on multiple platforms.
- **Docker Hub**: A repository for your Docker images.
- **Docker Desktop**: 
- **Docker Swarm**: A multi-host-aware orchestration tool.

## Docker安装

设置stable repository：

```text
$ sudo yum-config-manager --add-repo http://mirrors.aliyu.com/docker-ce/linux/centos/docker-ce.repo
```

更新yum软件包索引：

```text
yum makecache
```

安装Docker Engine：

```text
$ sudo yum install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

启动Docker：

```text
sudo systemctl start docker
```

验证Docker Engine

```text
docker version
```

```text
sudo docker run hello-world
```

卸载Docker Engine：

- systemctl stop docker
- sudo yum remove docker-ce docker-ce-cli containerd.io docker-compose-plugin
- sudo rm -rf /var/lib/docker
- sudo rm -rf /var/lib/containerd

镜像加速器配置

## Docker

```text
vim /etc/docker/daemon.json
```

```text
{
    "registry-mirrors": [
        "https://registry.docker-cn.com"
    ]
}
```

## Docker的常用命令

- 帮助启动类命令
- 镜像命令
- 容器命令










## Reference

- [尚硅谷2022版Docker实战教程](https://www.bilibili.com/video/BV1gr4y1U7CY?p=78)
- [Docker 2小时快速上手教程，无废话纯干货](https://www.bilibili.com/video/BV1QY4y1h7GZ)
- [Docker最新超详细版教程通俗易懂](https://www.bilibili.com/video/BV1og4y1q7M4)
- [Docker进阶篇超详细版教程通俗易懂](https://www.bilibili.com/video/BV1kv411q7Qc)
- [认识docker，容器，和 docker compose](https://www.bilibili.com/video/BV1Cr4y1W7Hu/)
- [http://www.atlas.weready.online/](http://www.atlas.weready.online/)
