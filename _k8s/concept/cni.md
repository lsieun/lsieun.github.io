---
title: "CNI"
sequence: "cni"
---

CNI (Container Network Interface) 是 Kubernetes 集群中用于实现网络互联的插件框架。
它定义了一套标准接口，使得不同的网络插件可以与 Kubernetes 集群无缝地集成。

CNI 插件通过创建和配置容器和主机之间的网络接口，为容器提供网络服务，同时也可以实现 Kubernetes 集群内部和外部的互联。
CNI 插件可以使用各种网络协议和技术，例如 VLAN、VXLAN、IPSec、Calico 等，提供不同的网络拓扑和安全保护。

## Reference

- [kubernetes.io]()
- [Network Plugins](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
