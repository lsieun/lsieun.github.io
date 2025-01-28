---
title: "概念对比"
sequence: "112"
---

## Node VS Pod

如何将 Pod 和 Application 关联起来：

```text
Pod （K8s 中引入的概念） --> Container （容器化中引入的概念） --> Application (我们开发中熟悉的)
```

### Pod

- **Smallest** unit in Kubernetes (kubernetes 视角)
- **Abstraction** over container  (container 视角)
- Usually **1 Application** per Pod (application 视角)
- Each Pod gets **its own IP address** (virtual network 视角)

## Service & Ingress

解决网络（Network）问题

- Service 解决的是 Cluster 内部的各个 Pod 之间的 comminution
- Ingress 解决的是 Cluster 与 外部的 communication

### Service

引入 Service：

- Pod 可能会关闭、重启，那么 IP 就会发生变动，因此使用 IP 是“不靠谱”的？

那如何解决呢？

Service is basically a static ip address or permanent ip address
that can be attached to each pod.

Service:

- **Permanent** IP address
- Lifecycle of Pod and Service **not connected**
- **Load Balancer**

## ConfigMap & Secret

ConfigMap

- **External** Configuration of your application
- ConfigMap is for **non-confidential data only**!

Secret

- Used to store **secret data**
- Reference Secret in Deployment/Pod

## Volume

Data Storage

Volume:

- Storage on **local** machine
- Or **remote**, outside of the K8s cluster

## Deployment & StatefulSet

- Deployment = for stateLESS Apps
- StatefulSet = for stateFUL Apps or Databases

### Deployment

- **Blueprint** for "my-app" Pods
- You create **Deployments** (我们不直接创建 Pod，而是创建 Deployment，K8s 会帮我们创建 Pod)
- **Abstract** of Pods （Deployment 是对 Pod 的一层抽象，而 Pod 是对 Container 的一层抽象）
- Deployment = a template for creating pods

### StatefulSet

**DB can't be replicated via Deployment!** (主从的数据库，要解决的一个关键问题就是：数据不一致 inconsistence)

StatefulSet

- for **STATEFUL apps**
- Deploying StatefulSet not easy
    - DB are often hosted outsize of Kubernetes cluster

## Wrap Up

- Pod: abstract of containers
- Service: communication
- Ingress: route traffice into cluster
- external configuration
    - ConfigMap
    - Secret
- Volume: data persistence
- replication
    - Deployment (stateless)
    - StatefulSet

www.kasten.io/nana
