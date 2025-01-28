---
title: "Volume Intro"
sequence: "101"
---

## 引入问题

Container 中的文件在磁盘上是临时存放的，这给 Container 中运行应用程序带来一些问题:

- 第一个问题：当容器崩溃时，文件会丢失。kubelet 会重新启动容器，但容器会以干净的状态重启。
- 第二个问题：同一 Pod 中运行多个容器并共享文件时出现。

Kubernetes Volume 这一抽象概念能够解决这两个问题。

## Volume 的作用

- 设置配置文件替代容器内的默认配置
- 将容器内产生的数据保存到容器外预防丢失

## Types of volumes

- Volumes
    - EmptyDir
    - HostPath
    - NFS
    - ConfigMap
    - Secret

## Reference

- [Volumes](https://kubernetes.io/docs/concepts/storage/volumes/)
