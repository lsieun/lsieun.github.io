---
title: "PersistentVolume (PV)"
sequence: "103"
---



## 概念

### 动态构建

如果集群中已有的 PV 无法满足 PVC 的需求，那么集群会根据 PVC 自动构建一个 PV，该操作是通过 StorageClass 实现的。

想要实现这个操作，前提是 PVC 必须设置 StorageClass；否则，会无法动态构建该 PV。
可以通过启用 DefaultStorageClass 来实现 PV 的构建。

### 绑定

当用户创建一个 PVC 对象后，主节点会监测新创建的 PVC 对象，并且寻找与之匹配的 PV 卷，
找到 PV 卷后，将二者绑定在一起。

如果找不到对应的 PV，则需要看 PVC 是否设置 StorageClass 来决定是否动态创建 PV。
若没有配置，PVC 就会一直处于未绑定状态，相应的 Pod 也启动不起来；直到有与之匹配的 PV 后才会申领绑定关系。

## 配置

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: my-storage-pv-nfs
spec:
  capacity:
    storage: 5Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Recycle
  storageClassName: slow
  mountOptions:
    - hard
    - nfsvers=4.1
  nfs:
    path: /data/nfs/rw
    server: 192.168.80.131
```

```text
$ kubectl create -f my-storage-pv-nfs.yaml
```

```text
$ kubectl get persistentvolume
NAME                CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   REASON   AGE
my-storage-pv-nfs   5Gi        RWO            Recycle          Available           slow                    26s
```

```text
$ kubectl describe persistentvolume my-storage-pv-nfs
Name:            my-storage-pv-nfs
Labels:          <none>
Annotations:     <none>
Finalizers:      [kubernetes.io/pv-protection]
StorageClass:    slow
Status:          Available
Claim:           
Reclaim Policy:  Recycle
Access Modes:    RWO
VolumeMode:      Filesystem
Capacity:        5Gi
Node Affinity:   <none>
Message:         
Source:
    Type:      NFS (an NFS mount that lasts the lifetime of a pod)
    Server:    192.168.80.131
    Path:      /data/nfs/rw
    ReadOnly:  false
Events:        <none>
```



