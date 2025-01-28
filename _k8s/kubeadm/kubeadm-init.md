---
title: "kubeadm init"
sequence: "kubeadm-init"
---

`kubeadm init` 命令是 Kubernetes 中用于初始化集群的命令，它会执行一系列的操作来启动 Kubernetes 集群。

具体来说，`kubeadm init` 命令会启动以下内容：

1. 初始化集群状态：创建 Kubernetes API Server 的配置文件和 TLS 证书等系统级别资源，初始化 etcd 数据库，并记录初始化信息。

2. 启动 kube-apiserver：启动 Kubernetes API Server，作为 Kubernetes 控制面的入口，用于接收和管理用户请求。

3. 启动 kube-controller-manager：启动 Kubernetes 控制器管理器，用于管理各种控制器及其自动化操作，如节点控制器，服务控制器等。

4. 启动 kube-scheduler：启动 Kubernetes 调度器，用于管理和调度在集群中运行的 Pod。

5. 部署 CoreDNS：CoreDNS 是用于服务发现的组件，在 kubeadm init 中会默认部署。

6. 部署网络插件：kubeadm init 会默认启动一种选择的网络插件。用户可以在初始化期间选择要使用的网络插件，如 Calico、Flannel、Weave Net 等。

7. 输出 kubeconfig 文件：生成 Kubeconfig 文件，用于后续对 Kubernetes 集群进行操作。

总之，`kubeadm init` 的目标是在一台或多台物理机或虚拟机上部署 Kubernetes 控制面版，并准备好接受节点加入集群。

## config

```text
### 生成 默认的初始化配置文件
kubeadm config print init-defaults > /etc/kubernetes/init-default.yaml
cat /etc/kubernetes/init-default.yaml | grep imageRepository  ### 查看默认镜像库
### 将默认的镜像仓库 registry.k8s.io 修改成 k8simage( 之前在 docker 官方镜像库筛选出来的)
sed -i 's#registry.k8s.io#k8simage#' /etc/kubernetes/init-default.yaml 
### 将 配置文件 init-default.yaml  里面  advertiseAddress: 1.2.3.4  中 的 ip 地址 改成你自己的 ip 地址 
sed -i 's#advertiseAddress: 1.2.3.4#advertiseAddress: 10.0.2.5#' /etc/kubernetes/init-default.yaml
```

```text
### 重置 
kubeadm reset
### 初始化
kubeadm init --config="/etc/kubernetes/init-default.yaml" 

```
