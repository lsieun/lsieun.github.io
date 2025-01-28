---
title: "Provisioner 与 StorageClass"
sequence: "101"
---

## PV 和 PVC 的局限

PV 和 PVC 模式是需要运维人员先创建好 PV，然后开发人员定义好 PVC 进行一对一的 Bound；
但是，如果 PVC 需求成千上万，那么就需要创建成千上万的 PV，对于运维人员来说维护成本很高。

```text
手工创建的方式，很困难
```

Kubernetes 提供一种自动创建 PV 的机制，叫 StorageClass，它的作用就是创建 PV 的模板。

```text
自动创建的方式，来解决
```

## StorageClass

StorageClass 对象会定义下面两部分内容：

- 第 1 部分，**PV 的属性**：存储类型、Volume 的大小
- 第 2 部分，创建这种 PV 需要用到的**存储插件**

有了这两个信息之后，Kubernetes 就能够根据用户提交的 PVC，找到一个对应的 StorageClass，
之后 Kubernetes 就会调用该 StorageClass 声明的存储插件，进而创建出需要的 PV。

## Provisioner

真正提供数据存储能力的应用程序，例如：前面为了让 Node 节点可以访问 Master 的 NFS 目录 `/opt/pv/mysql`，
我们在每一台 Node 上都手动安装 NFS-Client 提供网络传输功能，本质上这个 NFS-Client 就是 `Provisioner`，
只不过这个 Provisioner 是手动安装的，很不方便。

在大规模 K8S 集群下，通常 Provisioner 都是通过 K8S 以 Pod 形式自动部署的。

## StorageClass 和 Provisioner

在 Kubernetes（K8s）中，StorageClass 和 Provisioner 是与存储卷（Volume）相关的两个关键概念。

- **StorageClass**：StorageClass 是一个用于定义存储卷的动态提供方式的 Kubernetes 对象。
  它允许用户在使用 `PersistentVolumeClaim`（PVC）创建存储卷时，通过指定特定的 `StorageClass` 来定义存储的类型、属性和行为。
  `StorageClass` 包含了一些参数和配置选项，它描述了如何动态地提供存储卷。

- **Provisioner**：`Provisioner` 是一个实现了存储卷的动态提供能力的后端组件。
  它可以是云提供商的存储服务、本地存储提供程序，或者其他支持动态存储的第三方插件。
  `Provisioner` 负责根据用户的要求创建和管理底层存储资源（如云盘、存储卷），并为 PVC 提供可用的存储卷。
  `Provisioner` 通常与 `StorageClass` 相关联，一个 `StorageClass` 可以指定特定的 `Provisioner`。

**简而言之，StorageClass 是一个抽象的概念，用于定义存储卷的属性和行为，而 Provisioner 是实际处理存储卷创建和动态提供的实体。**
在创建 PVC 时，通过选择合适的 StorageClass，并与相应的 Provisioner 关联，
Kubernetes 将会根据 StorageClass 的定义和 Provisioner 的支持进行动态存储卷的创建和分配。

## Reference

- [Storage Classes](https://kubernetes.io/docs/concepts/storage/storage-classes/)
