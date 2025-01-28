---
title: "Helm Architecture"
sequence: "102"
---

- Helm 架构
    - 重要概念
        - chart
        - config
        - release
    - 组件
        - Helm 客户端
        - Helm 库

## 组件

### Helm 客户端

Helm 客户端，负责以下内容：

- 本地 chart 开发
- 管理仓库
- 管理发布
- 与 Helm 库建立接口
    - 发送安装的 chart
    - 发送升级或卸载现有发布的请求

### Helm 库

Helm 库提供执行所有 Helm 操作的逻辑，与 Kubernetes API 服务交互并提供以下功能：

- 结合 chart 和 config 来构建版本
- 将 chart 安装到 Kubernetes 中，并提供后续发布对象
- 与 Kubernetes 交互升级和卸载 chart

独立的 Helm 库封装了 Helm 逻辑以便不同的客户端可以使用它。

