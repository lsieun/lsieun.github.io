---
title: "K8s"
sequence: "k8s"
---

## 包含哪些组件

K8s 的 Control Plane 和 Worker Node 都包含哪些组件，各自有什么作用？

- Control Plane Components
    - kube-apiserver: The API server is a component of the Kubernetes control plane that exposes the Kubernetes API.
    - etcd: Consistent and highly-available key value store used as Kubernetes' backing store for all cluster data.
    - kube-scheduler：为 pod 选择节点
    - kube-controller-manager：
      - Node controller: Responsible for noticing and responding when nodes go down.
      - Job controller: Watches for Job objects that represent one-off tasks, then creates Pods to run those tasks to completion.
- Node Components
  - kubelet：An agent that runs on each node in the cluster. It makes sure that containers are running in a Pod.
  - kube-proxy：kube-proxy is a network proxy that runs on each node in your cluster, implementing part of the Kubernetes Service concept.
  - Container Runtime: that is responsible for running containers.

kubelet 的作用是在节点上管理容器和 Pod。
它通过监控容器的状态、与 API Server 通信等方式，确保 Pod 按照预期运行，并根据需要启动、停止或重启容器。
Kubelet 还负责监视节点的状态，并向 API Server 汇报节点状态和健康状况。Kubelet 还可以配置和管理容器的存储和网络等资源。

## 如何排查 Docker 容器出错了？

-


## Pause 容器

Pause 容器是一个空闲的容器，其目的是仅仅为了共享网络栈和命名空间，不执行任何实际的应用进程。
当一个 Pod 包含多个容器时，在 Pause 容器之上创建其他容器，这些容器将与 Pause 容器共享相同的网络命名空间和 IP 地址。

Docker 如何实现应用隔离？

代码更新了，如何——更新应用部署？

如何实现灰度发布？
