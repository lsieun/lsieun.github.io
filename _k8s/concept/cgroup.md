---
title: "CGroup"
sequence: "cgroup"
---

CGroup（Control Groups）是 Linux 内核提供的一种机制，用于限制、记录、隔离和重定向进程的资源使用。
CGroup 技术可以对选定的进程组进行资源管理，如 CPU、内存、磁盘、网络等方面，从而实现了对系统资源的精细化控制和管理。

CGroup Driver 是指用来管理 CGroup 的驱动程序。
在 Kubernetes 中，kubelet 作为容器的运行时，需要和底层容器和操作系统进行交互，CGroup Driver 就是必要的一个组件。
CGroup Driver 应该支持 containers 子系统，并确保将 Kubernetes 容器的进程组绑定到对应的 CGroup 中。

CGroup Driver 决定了 kubelet 如何在节点上创建、管理和监视容器的 CGroups。
各种 CGroup Driver 实现的方式不同，其中一些支持将容器关联到指定的 CGroup 中，而其他一些将容器关联到特定的子系统中。
例如，systemd CGroup Driver 将容器关联到 systemd CGroup 层次结构中，而 cgroupfs CGroup Driver 则将容器关联到 cgroupfs 子系统中。

总之，CGroup Driver 对于 Kubernetes 集群的稳定运行和效率至关重要，因为它会直接影响容器的资源管理和隔离效果。
在 Kubernetes 集群中选择合适的 CGroup Driver 非常重要，需要充分考虑节点系统的相关性能指标并进行测试验证。
