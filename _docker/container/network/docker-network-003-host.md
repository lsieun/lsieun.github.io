---
title: "host"
sequence: "103"
---

## 示例

### 目标

The goal of this tutorial is to start a `nginx` container which binds directly to port `80` on the Docker host.

- From a **networking point of view**, this is the same level of isolation
  as if the `nginx` process were running directly on the Docker host and not in a container.
- However, **in all other ways**, such as storage, process namespace, and user namespace,
  the `nginx` process is isolated from the host.

### 前提条件

- The `host` networking driver only works on **Linux hosts**, and is not supported on Docker Desktop for Mac, Docker Desktop for Windows, or Docker EE for Windows Server.
- 在 Docker Host 上，80 端口是可用的。

### 操作步骤

第 1 步，

```text
$ docker run --rm -d --network host --name my-nginx nginx
```

第 2 步，浏览器访问：

```text
http://192.168.80.130/
```

## Reference

- [Networking using the host network](https://docs.docker.com/network/network-tutorial-host/)
