---
title: "Calico"
sequence: "calico"
---

在 Kubernetes 中，Calico 是一款常用的网络插件。
它提供了高性能和高可靠性的容器网络解决方案，用于对整个 Kubernetes 集群的容器进行网络连接和路由。

具体来说，Calico 是一个基于 BGP 协议的软件定义网络（SDN），它可以通过虚拟 IP / MAC 地址、ACL 和路由策略来实现多租户网络隔离。
Calico 可以利用集群中的现有路由设备，或在没有现有路由设备的情况下，利用 Calico Node 上自己的路由器来实现路由转发。

当 Pod 在 Kubernetes 集群中启动时，它将被分配一个唯一的 IP 地址，并使用 Calico 网络插件进行配置和连接。
在网络配置完成后，所有 Pod 都可以互相通信，可以与集群外的网络进行通信，同时也可以访问云提供商特定的服务和云原生应用程序。

因此，可以说 Calico 在 Kubernetes 中扮演着非常重要的角色，它实现了 Kubernetes 集群中容器网络的连接和路由，保障了容器的互连性和网络隔离。

## Reference

- [Calico](https://www.tigera.io/project-calico/)
- [Quickstart for Calico on Kubernetes](https://docs.tigera.io/calico/latest/getting-started/kubernetes/quickstart)
- [Install Calico networking and network policy for on-premises deployments](https://docs.tigera.io/calico/latest/getting-started/kubernetes/self-managed-onprem/onpremises)
- [Customize Calico configuration](https://docs.tigera.io/calico/latest/getting-started/kubernetes/self-managed-onprem/config-options)

