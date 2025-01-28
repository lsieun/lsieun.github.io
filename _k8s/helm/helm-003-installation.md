---
title: "Helm Installation"
sequence: "103"
---

## 下载

GitHub Release

```text
https://github.com/helm/helm/releases
```

## 安装

第 1 步，解压：

```text
$ tar -zxvf helm-v3.12.1-linux-amd64.tar.gz
```

第 2 步，移动到 `/usr/local/bin` 目录：

```text
$ sudo mv linux-amd64/helm /usr/local/bin/helm
```

第 3 步，查看版本信息

```text
$ helm version
$ helm help
```

## Post Installation

### 添加 Helm 仓库

```text
$ helm repo add bitnami https://charts.bitnami.com/bitnami
```

```text
$ helm repo list
NAME   	URL                               
bitnami	https://charts.bitnami.com/bitnami
```

```text
$ helm search repo bitnami
```

## Reference

- [Installing Helm](https://helm.sh/docs/intro/install/)
