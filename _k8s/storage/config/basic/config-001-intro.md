---
title: "ConfigMap 和 Secret"
sequence: "101"
---

## ConfigMap

使用 ConfigMap 来将你的**配置数据**和**应用程序代码**分开。
比如，假设你正在开发一个应用，它可以在你自己的电脑上（用于开发）和在云上 （用于实际流量）运行。
你的代码里有一段是用于查看环境变量 `DATABASE_HOST`，在本地运行时，你将这个变量设置为 localhost，在云上，
你将其设置为引用 Kubernetes 集群中的 公开数据库组件的 服务。
这让你可以获取在云中运行的容器镜像，并且如果有需要的话，在本地调试完全相同的代码。

```text
作用
```

ConfigMap 在设计上不是用来保存大量数据的。
在 ConfigMap 中保存的数据不可超过 1 MiB。
如果你需要保存超出此尺寸限制的数据，你可能希望考虑挂载存储卷 或者使用独立的数据库或者文件服务。

```text
数据量的大小
```



## Secret

Secret 是一种包含少量敏感信息例如密码、令牌或密钥的对象。
这样的信息可能会被放在 Pod 规约中或者镜像中。
使用 Secret 意味着你不需要在应用程序代码中包含机密数据。

由于创建 Secret 可以独立于使用它们的 Pod，因此在创建、查看和编辑 Pod 的工作流程中暴露 Secret（及其数据）的风险较小。
Kubernetes 和在集群中运行的应用程序也可以对 Secret 采取额外的预防措施， 例如避免将机密数据写入非易失性存储。
Secret 类似于 ConfigMap 但专门用于保存机密数据。