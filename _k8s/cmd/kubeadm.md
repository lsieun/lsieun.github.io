---
title: "kubeadm"
sequence: "kubeadm"
---

Kubeadm 是一个 K8s 部署工具，提供 `kubeadm init` 和 `kubeadm join`，用于快速部署 Kubernetes 集群。

kubeadm 工具功能：

- `kubeadm init`：初始化一个 Master 节点
- `kubeadm join`：将 Worker 节点加入集群
- `kubeadm upgrade`：升级 K8s 版本
- `kubeadm token`：管理 `kubeadm join` 使用的令牌
- `kubeadm reset`：清空 `kubeadm init` 或者 `kubeadm join` 对主机所做的任何更改
- `kubeadm version`：打印 kubeadm 版本
- `kubeadm alpha`：预览可用的新功能


## config

```text
$ kubeadm config images list --kubernetes-version=v1.27.3
```

示例：

```text
$ kubeadm config images list --kubernetes-version=v1.27.3
registry.k8s.io/kube-apiserver:v1.27.3
registry.k8s.io/kube-controller-manager:v1.27.3
registry.k8s.io/kube-scheduler:v1.27.3
registry.k8s.io/kube-proxy:v1.27.3
registry.k8s.io/pause:3.9
registry.k8s.io/etcd:3.5.7-0
registry.k8s.io/coredns/coredns:v1.10.1
```

## Token 相关命令

```text
kubeadm token create --print-join-command
```

控制平面节点上运行以下命令来获取令牌

```text
kubeadm token list
```

默认情况下，令牌会在 24 小时后过期，可以通过在控制平面节点上运行以下命令来创建新令牌

```text
kubeadm token create
```

