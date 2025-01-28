---
title: "K8s Config Intro"
sequence: "101"
---

- K8s 自身的配置
- K8s 应用的配置

```text
/etc/kubernetes
```

## 3 Parts

Each Configuration File has 3 Parts:

- metadata
- specification
- status
    - **Automatically generated** and **added** by Kubernetes
    - K8s updates state continuously

> `etcd` holds the current status of any K8s component!

## Format


