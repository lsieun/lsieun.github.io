---
title: "Pod"
sequence: "pod"
---

```text
我在想怎么样更好的理解 Pod？
- Pod 自身
- Pod 与 容器：里多个容器：共享网络、硬盘空间
- Pod 与 其它概念：命名空间、Deployment、Service、StatefulSet 的关系
- Pod 与 Pause 容器：底层实现
```

In Kubernetes, instead of deploying individual containers, you deploy groups
of co-located containers – so-called `pod`s.
You know, as in **pod of whales**, or **a pea pod**.

A **pod** is a group of one or more closely related containers (**not unlike peas in a pod**)
that run together on the same worker node and need to share certain Linux namespaces,
so that they can interact more closely than with other pods.

> not unlike peas in a pod 就像豆荚里的豌豆一样

```text
原来的时候，我一直不理解为什么要引入 Pod 的概念
```

![](/assets/images/k8s/relationship-between-containers-pods-and-worker-nodes.png)

Each pod has its own IP, hostname, processes, network interfaces and other resources.
Containers that are part of the same pod think that they're the only ones running on the computer.
They don't see the processes of any other pod, even if located on the same node.

## Pause 容器

Pause 容器，全称 infrastructure container 基础容器（又叫 infra 容器），作为 init pod 存在，其他 pod 都会从 pause 容器中 fork 出来。

- 每个 Pod 里运行着一个特殊的被称之为 Pause 的容器，其它容器则为业务容器，这些业务容器共享 Pause 容器的网络栈和 Volume 挂载卷
- 同一个 Pod 里的容器之间仅需要通过 localhost 就能互相通信。

Pause 容器主要为每个业务容器提供以下功能：

- PID 命名空间：Pod 中的不同应用程序可以看到其他应用程序的进程 ID。
- 网络命名空间：Pod 中的多个容器能够访问同一个 IP 和端口范围。
- IPC 命名空间：Pod 中的多个容器能够使用 SystemV IPC 或 POSIX 消息队列进行通信。
- UTS 命名空间：Pod 中的多个容器共享一个主机名；Volumes（共享存储卷）。
- Pod 中的各个容器可以访问在 Pod 级别定义的 Volumes。

## Pod 生命周期

## 更上层的控制器

上层的控制器包括 Deployment、DaemonSet 以及 StatefulSet。

### Pod VS Deployment

Deployment 是对 Pod 的更高一层的封装，除 Pod 之外，还提供了如扩缩容管理、不停机更新，以及版本控制等其它特性。


## Service

```text
ctr images list
```

