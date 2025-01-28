---
title: "Helm"
sequence: "101"
---

## Prerequisites

- You must have Kubernetes installed.
- You should also have a local configured copy of `kubectl`.

## Three Big Concepts

A **Chart** is a Helm **package**.
It contains all the resource definitions necessary to run an application, tool, or service inside a Kubernetes cluster.

```text
Chart = package
```

A **Repository** is the place where charts can be collected and shared.
It's like Perl's CPAN archive or the Fedora Package Database, but for Kubernetes packages.

```text
Repository --> Chart
```

A **Release** is an instance of a chart running in a Kubernetes cluster.
One chart can often be installed many times into the same cluster.
And each time it is installed, a new release is created.
Consider a MySQL chart.
If you want two databases running in your cluster, you can install that chart twice.
Each one will have its own release, which will in turn have its own release name.

**Helm** installs **charts** into **Kubernetes**, creating a new **release** for each installation.

```text
Repository --> Chart --> Release (instance in Kubernetes cluster)
```



对于 Helm，有三个重要概念：

- chart：创建 Kubernetes 应用所必需的一组信息。
- config: 包含了可以合并到打包的 chart 中的配置信息，用于创建一个可发布的对象
- release：是一个与特定配置相结合的 chart 的运行实例

## Helm 和 chart

Helm 是一个 Kubernetes 包管理工具，它允许你定义、安装和管理 Kubernetes 应用程序的描述文件集合（也称为 chart）。

一个 chart 是一个预定义的目录结构，其中包含了用于部署应用程序所需的所有资源文件和参数配置。
它可以包含 Kubernetes 对象（如部署、服务、配置映射等）、依赖关系、环境变量、模板等信息。

Helm 通过使用 chart 来简化 Kubernetes 应用程序的部署和管理过程。
你可以通过 Helm 命令行界面（CLI）将 chart 部署到 Kubernetes 集群中，
同时也可以使用 Helm 来升级、回滚、卸载和管理已部署的应用程序。

因此，可以说 Helm 是用于管理 Kubernetes 应用程序的工具，而 chart 是描述和打包应用程序的规范和文件集合。

## Reference

- [HELM](https://helm.sh/): The package manager for Kubernetes

- [Using Helm and Kubernetes](https://www.baeldung.com/ops/kubernetes-helm)

进一步学习：

- [K8s（Kubernetes）集群编排工具 helm3 实战教程](https://www.bilibili.com/video/BV12D4y1Y7Z7/)
