---
title: "Secret 介绍"
sequence: "101"
---

Secret 对象可以存储和管理敏感信息，比如 Passwords、OAuth Tokens、以及 SSH Keys 等。
把敏感信息存储到 Secret 对象中会比放到 Pod 的定义文件或是容器镜像中更加安全、灵活，
使用 Secret 对象可以更好的控制数据的使用方式，并且减少意外泄露的风险。

不仅**用户**可以创建 Secret 对象，**Kubernetes** 系统也会创建一些 Secret 对象。

## Secret 的类型

创建 Secret 时，你可以使用 Secret 资源的 type 字段，或者与其等价的 kubectl 命令行参数（如果有的话）为其设置类型。
Secret 类型有助于对 Secret 数据进行编程处理。

Kubernetes 提供若干种内置的类型，用于一些常见的使用场景。
针对这些类型，Kubernetes 所执行的合法性检查操作以及对其所实施的限制各不相同。

内置类型：

- `Opaque`：用户定义的任意数据
- `kubernetes.io/service-account-token`：服务账号令牌
- `kubernetes.io/dockercfg`：`~/.dockercfg` 文件的序列化形式
- `kubernetes.io/dockerconfigjson`：~/.docker/config.json 文件的序列化形式
- `kubernetes.io/basic-auth`：用于基本身份认证的凭据
- `kubernetes.io/ssh-auth`：用于 SSH 身份认证的凭据
- `kubernetes.io/tls`：用于 TLS 客户端或者服务器端的数据
- `bootstrap.kubernetes.io/token`：启动引导令牌数据

## 如何使用

Secret 被创建以后，可以使用 3 种方式使用它：
- 创建 Pod 时，通过为 Pod 指定 Service Account 自动使用该 Secret
- 通过挂载该 Secret 到 Pod 来使用它
- 在 Docker 镜像下载时使用，通过指定 Pod 的 spc.ImagePullSecrets 来引用它


## Secret VS. ConfigMap

Secret 和 ConfigMap 对比，既有相同点、也有不同点，列表如下：

相同点：
- 存储数据都属于 key-value 键值对形式
- 属于某个特定的 namespace
- 可以导出到环境变量
- 可以通过目录/文件形式挂载（支持挂载所有 key 和部分 key）

不同点：
- Secret 可以被 ServerAccount 关联使用
- Secret 可以存储 Register 的鉴权信息，用于 ImagePullSecret 参数中，用于拉取私有仓库的镜像
- Secret 支持 Base64 编码
- Secret 分为 Opaque、kubernetes.io/dockercfg、kubernetes.io/dockerconfigjson 等多种类型，ConfigMap 不区分类型
- Secret 文件存储在 tmpfs 文件系统中，Pod 删除后 Secret 也会对应被删除

在存储数据的时候，如何从 ConfigMap 和 Secret 这两者之间进行选择呢？
- 使用 ConfigMap 存储非敏感的配置信息
- 使用 Secret 存储敏感的配置信息
- 如果配置文件既包含敏感信息、又包含非敏感信息，依然选择 Secret 进行存储

## K8S 在 Secret 做出的优化

主要是 Kubernetes 对 Secret 对象采取额外了预防措施。

### 存储安全

只有当挂载 Secret 的 POD 调度到具体节点上时，Secret 才会被发送并存储到该节点上。但是它不会被写入磁盘，而是存储在 tmpfs 中。一旦依赖于它的 POD 被删除，Secret 就被删除。
由于节点上的 Secret 数据存储在 tmpfs 卷中，因此只会存在于内存中而不会写入到节点上的磁盘。以避免非法人员通过数据恢复等方法获取到敏感信息.

### 访问安全

同一节点上可能有多个 POD 分别拥有单个或多个 Secret。但是 Secret 只对请求挂载的 POD 中的容器才是可见的。因此，一个 POD 不能访问另一个 POD 的 Secret。

## 使用 Secret 的风险

APIServer 的 Secret 数据以纯文本的方式存储在 etcd 中，因此：

- 管理员应该限制 admin 用户访问 etcd；
- API server 中的 Secret 数据位于 etcd 使用的磁盘上；管理员可能希望在不再使用时擦除 / 粉碎 etcd 使用的磁盘
- 如果您将 Secret 数据编码为 base64 的清单（JSON 或 YAML）文件，共享该文件或将其检入代码库，这样的话该密码将会被泄露。 Base64 编码不是一种加密方式，一样也是纯文本。
- 应用程序在从卷中读取 Secret 后仍然需要保护 Secret 的值，例如不会意外记录或发送给不信任方。
- 可以创建和使用 Secret 的 POD 的用户也可以看到该 Secret 的值。即使 API server 策略不允许用户读取 Secret 对象，用户也可以运行暴露 Secret 的 POD。
- 如果运行了多个副本，那么这些 Secret 将在它们之间共享。默认情况下，etcd 不能保证与 SSL/TLS 的对等通信，但管理员可以进行配置。
- 目前，任何节点的 root 用户都可以通过模拟 kubelet 来读取 API server 中的任何 Secret。

## Reference

- [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
- [Pull an Image from a Private Registry](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)
- [蚂蚁集团针对 K8s 中 Secret 安全防护的实践与探索](https://www.infoq.cn/article/ycdctxabbgqjdfckiy0y)
