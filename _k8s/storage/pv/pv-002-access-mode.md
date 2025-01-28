---
title: "AccessModes"
sequence: "102"
---

PV 的访问模式（accessModes）有 3 种：

- `ReadWriteOnce`：可读科写，但支持被单个 node 挂载
- `ReadOnlyMany`：可以以读的方式被多个 node 挂载
- `ReadWriteMany`:可以以读写的方式被多个 node 挂载

```text
在 PVC 绑定 PV 时，通常根据两个条件来绑定：

- 第一个条件：存储大小
- 第二个条件：访问模式（AccessModes）
```



PV 的回收策略（persistentVolumeReclaimPolicy）:

- Retain，不清理, 保留 Volume（需要手动清理）
- Recycle，删除数据，即 rm -rf /thevolume/*（只有 NFS 和 HostPath 支持）
- Delete，删除存储资源，比如删除 AWS EBS 卷（只有 AWS EBS, GCE PD, Azure Disk 和 Cinder 支持）

## Access Modes 访问模式

访问模式有：

- `ReadWriteOnce`（`RWO`）：Volume 可以被一个 Node 以读写方式挂载。 ReadWriteOnce 访问模式也允许运行在同一 Node 上的多个 Pod 访问 PV。
- `ReadOnlyMany`（`ROM`）：Volume 可以被多个 Node 以只读方式挂载。
- `ReadWriteMany`（`RWM`）：Volume 可以被多个 Node 同时读写
- `ReadWriteOncePod`（`RWOP`）：Volume 可以被单个 Pod 以读写方式挂载。
  如果想确保整个集群中只有一个 Pod 可以读取或写入该 PVC， 就使用 `ReadWriteOncePod` 访问模式。
  **这只支持 CSI 卷以及需要 Kubernetes 1.22 以上版本。**

## Access Modes 能力表

| Volume Plugin        | ReadWriteOnce | ReadOnlyMany | ReadWriteMany | ReadWriteOncePod |
|----------------------|---------------|--------------|---------------|------------------|
| AWSElasticBlockStore | OK            | -            | -             | -                |
| Glusterfs            | OK            | OK           | OK            | -                |
| HostPath             | OK            | -            | -             | -                |
| NFS                  | OK            | OK           | OK            | -                |

## PV 与 PVC 中 AccessModes 的区别

- PV 设置 AccessModes 代表该 PV 能够提供的存储能力
- PVC 设置 AccessModes 代表访问者（程序）需要 PV 提供的存储能力

### 实验一

实验条件：PV 与 包含 PVC 出现的 AccessModes

PV :
- ReadWriteOnce
- ReadWriteMany

PVC：
- ReadWriteMany

实验结果：Bound 绑定成功

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
    name: pv-mysql
spec:
    capacity:
        storage: 1Gi
    accessModes:
        - ReadWriteOnce
        - ReadWriteMany
    storageClassName: pv-mysql
    nfs:
        path: /opt/pv/mysql
        server: 192.168.80.130
```

```text
$ kubectl apply -f pv-mysql.yaml
```

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-mysql
  namespace: default
spec:
  storageClassName: pv-mysql
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 1Gi
```

```text
$ kubectl apply -f pvc-mysql.yaml
```

```text
$ kubectl get pv
NAME       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM               STORAGECLASS   REASON   AGE
pv-mysql   1Gi        RWO,RWX        Retain           Bound    default/pvc-mysql   pv-mysql                110s
```

```text
$ kubectl get pvc
NAME        STATUS   VOLUME     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
pvc-mysql   Bound    pv-mysql   1Gi        RWO,RWX        pv-mysql       28s
```

### 实验二

实验条件：PV 与 PVC 未出现 AccessModes 交集

PV :
- ReadWriteOnce

PVC：
- ReadWriteMany

实验结果：Pending

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
    name: pv-mysql
spec:
    capacity:
        storage: 1Gi
    accessModes:
        - ReadWriteOnce
    storageClassName: pv-mysql
    nfs:
        path: /opt/pv/mysql
        server: 192.168.80.130
```

```text
$ kubectl apply -f pv-mysql.yaml
```

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-mysql
  namespace: default
spec:
  storageClassName: pv-mysql
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 1Gi
```

```text
$ kubectl apply -f pvc-mysql.yaml
```

```text
$ kubectl get pv
NAME       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   REASON   AGE
pv-mysql   1Gi        RWO            Retain           Available           pv-mysql                5s
```

```text
$ kubectl get pvc
NAME        STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE
pvc-mysql   Pending                                      pv-mysql       9s
```

### 实验三

实验条件：PV 与 PVC 出现的 AccessModes 出现交集

PV:
- ReadWriteOnce

PVC：
- ReadWriteOnce
- ReadWriteMany

实验结果：Pending

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
    name: pv-mysql
spec:
    capacity:
        storage: 1Gi
    accessModes:
        - ReadWriteOnce
    storageClassName: pv-mysql
    nfs:
        path: /opt/pv/mysql
        server: 192.168.80.130
```

```text
$ kubectl apply -f pv-mysql.yaml
```

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-mysql
  namespace: default
spec:
  storageClassName: pv-mysql
  accessModes:
    - ReadWriteOnce
    - ReadWriteMany
  resources:
    requests:
      storage: 1Gi
```

```text
$ kubectl apply -f pvc-mysql.yaml
```

```text
$ kubectl get pv
NAME       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   REASON   AGE
pv-mysql   1Gi        RWO            Retain           Available           pv-mysql                7s
```

```text
$ kubectl get pvc
NAME        STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE
pvc-mysql   Pending                                      pv-mysql       9s
```

### 实验结论

PV 中出现的 AccessModes 必须完全包含 PVC 的 AccessModes 才可以正常绑定，否则就会出现 Pending 阻塞

## 特别注意

Kubernetes 使用 Access Modes 来匹配 PersistentVolumeClaim 和 PersistentVolume。
在某些场合下，Access Modes 也会限制 PersistentVolume 是否可以被挂载。

Access Modes 并不会在存储已经被挂载的情况下为其实施写保护。
即使访问模式设置为 ReadWriteOnce、ReadOnlyMany 或 ReadWriteMany，它们也不会对 Volumes 形成限制。
例如，即使某个 PV 创建时设置为 ReadOnlyMany，也无法保证该 Volume 是只读的。
如果访问模式设置为 ReadWriteOncePod，则 Volume 会被限制起来并且只能挂载到一个 Pod 上。

重要提醒！ 每个 Volume 同一时刻只能以一种访问模式挂载，即使该 Volume 能够支持多种访问模式。
例如，一个 GCEPersistentDisk Volume 可以被某节点以 ReadWriteOnce 模式挂载，
或者被多个节点以 ReadOnlyMany 模式挂载，但不可以同时以两种模式挂载。
