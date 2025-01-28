---
title: "Kubeadm (CentOS 7)"
sequence: "kubeadm"
---

## 规划

服务器要求：

- 3 台服务器（虚拟机）
    - k8s-master: `192.168.80.130`
    - k8s-node1: `192.168.80.141`
    - k8s-node2: `192.168.80.142`

```text
master 的首字母是 m，是第 13 个字母
node   的首字母是 n，是第 14 个字母
```

- 最低配置：
    - 2 核、2G 内存、20G 硬盘

## 软件环境

- 操作系统：CentOS 7
- Docker：20+
- K8s：1.23.6

## 安装步骤

- 初始操作
- 安装基础软件（所有节点）
    - 安装 Docker
    - 添加阿里云 yum 源
    - 安装 Kubeadm、kubelet、kubectl
- 部署 Kubernetes Master
- 加入 Kubernetes Node
- 部署 CNI 网络插件

## Reference

- [Install Kubernetes Cluster on CentOS 7 with kubeadm](https://computingforgeeks.com/install-kubernetes-cluster-on-centos-with-kubeadm/)
