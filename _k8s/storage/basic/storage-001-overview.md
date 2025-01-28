---
title: "Overview"
sequence: "101"
---

- PV 与 PVC
    - 生命周期
        - 构建
            - 静态构建
            - 动态构建
        - 绑定
        - 使用
        - 回收策略
            - 保留
            - 删除
            - 回收
    - PV
        - 状态
            - Available：空闲，未被绑定
            - Bound：已经被 PVC 绑定
            - Released：PVC 被删除，资源已回收，但是 PV 未被重新使用
            - Failed：自动回收失败
        - 配置文件
    - PVC
        - Pod 绑定 PVC
        - 配置文件
    - StorageClass
        - 制备器（Provisioner）
        - NFS 动态制备案例
            - nfs-provisioner
            - StorageClass 配置
            - RBAC 配置
            - PVC 处于 Pending 状态
            - PVC 测试配置

## Lifecycle of a volume and claim

- Lifecycle of a volume and claim
    - Provisioning
        - Static
        - Dynamic
    - Binding
    - Using
    - Reclaiming
        - Retain
        - Delete
        - Recycle

```text
                                                        ┌─── Static
                                   ┌─── Provisioning ───┤
                                   │                    └─── Dynamic
                                   │
                                   ├─── Binding
Lifecycle of a volume and claim ───┤
                                   ├─── Using
                                   │
                                   │                    ┌─── Retain
                                   │                    │
                                   └─── Reclaiming ─────┼─── Delete
                                                        │
                                                        └─── Recycle
```
