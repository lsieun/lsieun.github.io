---
title: "kubelet"
sequence: "kubelet"
---

`kubelet` 是 Kubernetes 集群中负责运行 Pod 的关键组件，它与 Kubernetes API 服务器进行通信，检查 Pod 的状态并映射 Pod 端口。

```text
kubelet ---> Kubernetes API
```

在组件故障和网络问题的情况下，`kubelet` 可能会生成重要的日志信息来帮助管理员进行故障排除，并检测和报告出现的错误。
使用 `journalctl` 命令可以很方便地查看 `kubelet` 服务的日志信息，以帮助排除问题和处理故障。
