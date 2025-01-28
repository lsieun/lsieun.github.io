---
title: "cgroup driver"
sequence: "cgroup-driver"
---

Both the **container runtime** and the **kubelet** have a property called "**cgroup driver**",
which is important for the management of cgroups on Linux machines.

```text
container runtime --> cgroup driver <-- kubelet
```

Warning:
**Matching the container runtime and kubelet cgroup drivers is required**
or **otherwise the kubelet process will fail.**


## 三种类型

CGroup（Control Group）是 Linux 内核提供的一种资源限制和优先级控制机制，用于限制容器的资源使用和进程隔离。CGroup driver 是容器运行时所使用的 CGroup 实现方式，常见的 CGroup driver 包括：

1. cgroupfs：这是最早的 CGroup 实现方式，基于虚拟文件系统（Virtual File System）实现，可以在大部分 Linux 发行版的内核和 Docker 中使用。但是，cgroupfs 的实现方式较为简单，存在一些性能和安全性方面的缺陷，在一些高并发、大规模的应用场景下表现欠佳。

2. systemd：systemd 是一种新的系统管理和服务管理工具，也可以用于实现 CGroup 功能。相比较 cgroupfs，systemd 的 CGroup 实现更为负责和健壮，可以提供更好的可靠性和安全性，并且在现代的 Linux 发行版中已经作为默认的 CGroup 实现方式。

3. cgroupv2：cgroupv2 是 Linux 内核版本 4.5 以后推出的一个新的 CGroup 实现方式，相比较之前的实现方式，cgroupv2 为 CGroup 提供了更强的隔离功能、更好的可扩展性和更好的安全性。目前，cgroupv2 在一些高性能计算和云计算场景下已经有所应用。

需要注意的是，不同的 CGroup driver 实现方式可能对容器运行时的支持程度有所差异，因此在使用时需要进行详细的测试和验证，以确保容器运行时能够正常使用所选择的 CGroup driver。

