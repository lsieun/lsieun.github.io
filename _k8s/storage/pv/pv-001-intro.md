---
title: "PV + PVC"
sequence: "101"
---

## 单独使用 Volume 的弊端

- 存储接口与实现严重耦合，并没有职责分离
- Volume 卷并没有被 K8S 有效管理
- 难以进行数据迁移
- 无法进行更细粒度的控制，如（大小、是否只能被单个 Pod 挂载、读写控制级别）

## PV 与 PVC 实现存储解耦

存储的管理是一个与计算实例的管理完全不同的问题。
PersistentVolume 子系统为用户和管理员提供了一组 API， 将存储如何制备的细节从其如何被使用中抽象出来。
为了实现这点，我们引入了两个新的 API 资源：`PersistentVolume` 和 `PersistentVolumeClaim`。

```text
Pod 是计算，PV 是存储
```

**PersistentVolume (PV)** 是集群中的一块存储，已由管理员配置或使用 `StorageClass` 动态配置。
PV 持久卷和普通的 Volume 一样， 也是使用卷插件来实现的，只是它们拥有独立于任何使用 PV 的 Pod 的生命周期。
此 API 对象中记述了存储的实现细节，无论其背后是 NFS、iSCSI 还是特定的云平台存储系统。

**PersistentVolumeClaim (PVC)** 是用户对存储的请求。它类似于 Pod。
Pod 消耗 Node 节点资源，PVC 消耗 PV 资源。
Pod 可以请求特定级别的资源 (CPU 和内存)。
PVC 可以请求特定的存储空间尺寸和访问模式 (例如，它们可以挂载 `ReadWriteOnce`、`ReadOnlyMany` 或 `ReadWriteMany`，参见 AccessModes)。

## 示例



### PV

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
    persistentVolumeReclaimPolicy: Recycle
    nfs:
        path: /opt/pv/mysql
        server: master01.k8s.lab
```

```text
$ kubectl apply -f pv-mysql.yaml
```

```text
$ kubectl get pv -o wide
NAME       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   REASON   AGE   VOLUMEMODE
pv-mysql   1Gi        RWO            Recycle          Available           pv-mysql                47s   Filesystem
```

```text
$ kubectl describe pv pv-mysql 
Name:            pv-mysql
Labels:          <none>
Annotations:     <none>
Finalizers:      [kubernetes.io/pv-protection]
StorageClass:    pv-mysql
Status:          Available
Claim:           
Reclaim Policy:  Recycle
Access Modes:    RWO           # A 访问模式
VolumeMode:      Filesystem
Capacity:        1Gi           # B 存储大小
Node Affinity:   <none>
Message:         
Source:
    Type:      NFS (an NFS mount that lasts the lifetime of a pod)    # C 类型
    Server:    master01.k8s.lab                                       # C 主机地址
    Path:      /opt/pv/mysql                                          # C 路径
    ReadOnly:  false
Events:        <none>
```

### PVC

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
    resources:
        requests:
            storage: 1Gi
```

```text
kubectl apply -f pvc-mysql.yaml
```

```text
$ kubectl get pvc -o wide
NAME        STATUS   VOLUME     CAPACITY   ACCESS MODES   STORAGECLASS   AGE   VOLUMEMODE
pvc-mysql   Bound    pv-mysql   1Gi        RWO            pv-mysql       14s   Filesystem
```

```text
$ kubectl describe pvc pvc-mysql 
Name:          pvc-mysql
Namespace:     default
StorageClass:  pv-mysql    # A
Status:        Bound       # A
Volume:        pv-mysql    # A
Labels:        <none>
Annotations:   pv.kubernetes.io/bind-completed: yes
               pv.kubernetes.io/bound-by-controller: yes
Finalizers:    [kubernetes.io/pvc-protection]
Capacity:      1Gi    # B
Access Modes:  RWO    # B
VolumeMode:    Filesystem
Used By:       <none>    # C
Events:        <none>
```

### Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deploy-mysql
spec:
  replicas: 1 # pod 数量
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
        - name: mysql
          image: mysql:8.0.33
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 3306
          env:
            - name: MYSQL_ROOT_PASSWORD
              value: "123456"
          volumeMounts:
            - name: mysql-data
              mountPath: /var/lib/mysql
      volumes:
        - name: mysql-data
          persistentVolumeClaim:
            claimName: pvc-mysql
```

```text
$ kubectl apply -f deploy-mysql.yml
```

```text
$ kubectl get deployments -o wide
NAME           READY   UP-TO-DATE   AVAILABLE   AGE   CONTAINERS   IMAGES         SELECTOR
deploy-mysql   1/1     1            1           59s   mysql        mysql:8.0.33   app=mysql
```

```text
$ kubectl get pv -o wide
NAME       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM               STORAGECLASS   REASON   AGE   VOLUMEMODE
pv-mysql   1Gi        RWO            Recycle          Bound    default/pvc-mysql   pv-mysql                24m   Filesystem
```

```text
$ kubectl get pvc -o wide
NAME        STATUS   VOLUME     CAPACITY   ACCESS MODES   STORAGECLASS   AGE    VOLUMEMODE
pvc-mysql   Bound    pv-mysql   1Gi        RWO            pv-mysql       8m8s   Filesystem
```

```text
$ kubectl describe pvc pvc-mysql 
Name:          pvc-mysql
Namespace:     default
StorageClass:  pv-mysql
Status:        Bound
Volume:        pv-mysql
Labels:        <none>
Annotations:   pv.kubernetes.io/bind-completed: yes
               pv.kubernetes.io/bound-by-controller: yes
Finalizers:    [kubernetes.io/pvc-protection]
Capacity:      1Gi
Access Modes:  RWO
VolumeMode:    Filesystem
Used By:       deploy-mysql-6895497f4b-8m4gm    # C
Events:        <none>
```
