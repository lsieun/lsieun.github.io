---
title: "kubelet"
sequence: "kubelet"
---

kubelet 是 Kubernetes 集群中的一个重要组件，它负责在 Node 节点上运行容器，并与 Kubernetes API Server 以及其他控制平面组件协同工作。

```text
api server --- kubelet
```

## kubelet + CRI

kubelet 与容器运行时之间是通过 CRI（Container Runtime Interface）进行通信的。

```text
kubelet ---> CRI ---> containerd
```

containerd 是一个轻量级的容器运行时，它由 Docker 团队开发并开源。
containerd 可以直接运行依赖 Docker Engine 的应用程序，并且可以与 Kubernetes 集群集成。

容器运行时（Container Runtime）是 Kubernetes 中的一个可插拔后端，kubelet 通过 CRI 接口与容器运行时进行交互来创建和管理容器。
使用 CRI，容器运行时可以公开一个 API，kubelet 可以利用该 API 来实现容器的创建、启动、停止、销毁以及容器元数据的查询等操作。
在 Kubernetes 中，containerd 也是一种 CRI 实现，kubelet 可以与 containerd 通过 CRI 进行交互，以便在 Node 节点上管理容器。

因此，kubelet 和 containerd 之间的关系可以简单地理解为：
kubelet 通过 CRI 调用 containerd 提供的接口来启动和管理容器，
containerd 可以将依赖 Docker Engine 的应用程序转化为符合 Kubernetes 规范的容器，提供轻量级的容器运行时服务，
辅助 kubelet 在 Node 节点上进行容器编排。
