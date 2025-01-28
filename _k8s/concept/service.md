---
title: "service"
sequence: "service"
---

在 Kubernetes (K8s) 中，Service 是一种抽象的资源，用于定义一组 Pod 的访问方式。
它充当了 Pod 的**网络入口**，并为 Pod 提供了稳定的网络地址。
Service 使得当 Pod 发生变化时，可以保持对应的网络连接，而无需直接访问特定的 Pod。

Service 基于标签选择器（Label Selector），通过将标签匹配的 Pod 组织起来，为它们提供一个统一的入口。

```text
Service --> Label Selector --> Pod
```

Service 可以通过 Cluster IP、NodePort、LoadBalancer 或者 ExternalName 等方式将请求路由到对应的 Pod 上。

具体来说，不同类型的 Service 可以实现不同的网络访问方式：

1. ClusterIP：默认类型，Service 仅在**集群内部可访问**，通过 Cluster IP 提供访问。
2. NodePort：在 ClusterIP 的基础上，通过在每个节点上暴露一个静态端口，实现从**集群外部访问**。
3. LoadBalancer：通过云服务商提供的**负载均衡器**，将外部流量自动均衡地分配给多个节点上的 Service。
4. ExternalName：将 Service 映射到**集群外的外部服务地址**。

使用 Service，可以将多个 Pod 组织在一起，并以统一的方式提供网络服务。
这在部署应用程序时非常有用，因为它可以隐藏底层 Pod 的变化，提供稳定和可靠的服务访问方式。
