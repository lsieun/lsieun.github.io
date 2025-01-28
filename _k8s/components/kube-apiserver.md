---
title: "kube-apiserver"
sequence: "kube-apiserver"
---

在 Kubernetes 集群中，`kube-apiserver` 组件通常监听 `6443` 端口，它是 Kubernetes API 服务器的默认端口。
kube-apiserver 组件负责管理整个集群的 API 对象，如节点、Pod、Service、Deployment 等资源的生命周期，提供了 Kubernetes 底层服务访问的入口。

如果在 Kubernetes 集群中运行了 kube-apiserver 组件，则它会启动 6443 端口监听来自外部的 API 请求，
或者来自其他 Kubernetes 组件的内部请求。
当一个 kube-apiserver 启动时，它会为每个节点和服务创建一个唯一的证书和密钥，用于加密和验证通信。
这些证书用于与 kubelet、kube-proxy、kube-scheduler、kube-controller-manager 等组件进行通信。

需要注意的是，如果 Kubernetes 集群部署在云服务提供商的环境中，
可能需要额外的安全组或网络配置才能允许来自外部访问 kube-apiserver 的 6443 端口。
