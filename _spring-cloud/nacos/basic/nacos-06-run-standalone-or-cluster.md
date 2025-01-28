---
title: "Standalone Or Cluster"
sequence: "106"
---

在默认情况下，Nacos 是使用集群环境运行。

如果我们想在 Standalone 下运行，可以来到 Nacos 的 `bin` 目录下，修改 `startup.cmd` 文件的第 26 行：

```text
set MODE="cluster"
```

修改为：

```text
set MODE="standalone"
```

![](/assets/images/spring-cloud/nacos/nacos-bin-startup-cmd-26-set-mode-cluster.png)



