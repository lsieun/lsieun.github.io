---
title: "如何正确删除 PV 与 PVC"
sequence: "105"
---

在之前的思路中，是这样的：

```text
Volume --> PV --> PVC --> Pod
```

如果删除了 PVC，那 PV 会保留吗？ Volume 里的数据会保留吗？

究竟如何处理，是由 PV 的 `persistentVolumeReclaimPolicy` 属性来决定的。

## 环境准备

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
  persistentVolumeReclaimPolicy: Retain    # A 注意这里
  nfs:
    path: /opt/pv/mysql
    server: master01.k8s.lab
```

```text
$ kubectl apply -f pv-mysql.yaml
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
$ kubectl apply -f pvc-mysql.yaml
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

### 实验操作

```text
$ kubectl get deployments
NAME           READY   UP-TO-DATE   AVAILABLE   AGE
deploy-mysql   1/1     1            1           9s
```

```text
$ kubectl get pods
NAME                            READY   STATUS    RESTARTS   AGE
deploy-mysql-6895497f4b-mmf8w   1/1     Running   0          17s
```

```text
$ kubectl get pv
NAME       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM               STORAGECLASS   REASON   AGE
pv-mysql   1Gi        RWO            Retain           Bound    default/pvc-mysql   pv-mysql                2m18s
```

```text
$ kubectl get pvc
NAME        STATUS   VOLUME     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
pvc-mysql   Bound    pv-mysql   1Gi        RWO            pv-mysql       2m
```

## PV 回收策略

当用户不再使用其 PV 时，他们可以从 API 中将 PVC 对象删除，从而允许该资源被回收再利用。
回收策略通知集群在 PVC 删除后 PV 该怎么办？
目前，PV 可以被 Retain（保留）、Recycled（回收）或 Deleted（删除）。

### Retain(保留）

回收策略 Retain 使得用户可以手动回收资源。
当 PersistentVolumeClaim 对象被删除时，PV 仍然存在，对应的数据 PV 被视为"已释放（released）"。 
由于 PV 上仍然存在之前的数据，该 PV 不能用于其他 PVC。
管理员可以通过下面的步骤来手动回收该 PV：

1. 删除 PersistentVolume 对象。与之相关的、位于外部基础设施中的存储资产 （例如 AWS EBS、阿里云 OSS、Azure Disk 等）在 PV 删除之后仍然存在。
2. 根据情况，手动清除所关联的存储资产上的数据。
3. 手动删除所关联的存储资产。
   如果你希望重用该存储资产，可以基于存储资产的定义创建新的 PersistentVolume PV 对象。

实验
删除 PVC 后，PV 状态变为 Released，该状态无法被其他 PVC 重新绑定

```text
$ kubectl delete deploy deploy-mysql
deployment.apps "deploy-mysql" deleted
```

```text
$ kubectl delete pvc pvc-mysql
persistentvolumeclaim "pvc-mysql" deleted
```

```text
$ kubectl get pv
NAME       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS     CLAIM               STORAGECLASS   REASON   AGE
pv-mysql   1Gi        RWO            Retain           Released   default/pvc-mysql   pv-mysql                7m54s
                                     # A Policy       # B Status
```

删除 PV 后，`/opt/pv/mysql` 路径下数据仍然保留

```text
$ kubectl delete pv pv-mysql 
persistentvolume "pv-mysql" deleted
```

```text
$ ls -l /opt/pv/mysql/
total 87392
-rw-r-----. 1 polkitd input       56 Aug 18 19:30 auto.cnf
-rw-r-----. 1 polkitd input  3039831 Aug 18 19:30 binlog.000001
-rw-r-----. 1 polkitd input      180 Aug 18 19:35 binlog.000002
-rw-r-----. 1 polkitd input       32 Aug 18 19:30 binlog.index
...
```

### Delete（删除）

对于支持 Delete 回收策略的 PV，删除动作会将 PersistentVolume 对象从 Kubernetes 中移除，
同时也会从外部基础设施（例如 AWS EBS、阿里云 OSS、Azure Disk 等）中移除所关联的存储资产。 
动态 PV 会继承其 StorageClass 中设置的回收策略，其默认为 Delete。
管理员需要根据用户的期望来配置 StorageClass；

实验：将回收策略改为 Delete，PV 与 Deployment 脚本不变

```text
persistentVolumeReclaimPolicy: Delete
```

过程删除，删除 PVC 后，PVC 状态变为 Failed，这是一个常见问题
注意：Delete 只删除存储设施上的 Volume 等信息，但并不删除文件，因为 NFS 不支持 Delete，所以 Faild 报错：“error getting deleter volume plugin for volume "pv-mysql": no deletable volume plugin matched”，这也是预期的结果
AWS EBS、GCE PD、Azure Disk 和 Cinder 卷都支持删除 Delete 行为，环境有限就不再演示了

```text
$ kubectl delete deploy deploy-mysql
deployment.apps "deploy-mysql" deleted

$ kubectl delete pvc pvc-mysql
persistentvolumeclaim "pvc-mysql" deleted
```

```text
$ kubectl get pv
NAME       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM               STORAGECLASS   REASON   AGE
pv-mysql   1Gi        RWO            Delete           Failed   default/pvc-mysql   pv-mysql                2m10s
                                     # A              # B
```

```text
$ kubectl describe pv pv-mysql 
Name:            pv-mysql
Labels:          <none>
Annotations:     pv.kubernetes.io/bound-by-controller: yes
Finalizers:      [kubernetes.io/pv-protection]
StorageClass:    pv-mysql
Status:          Failed
Claim:           default/pvc-mysql
Reclaim Policy:  Delete
Access Modes:    RWO
VolumeMode:      Filesystem
Capacity:        1Gi
Node Affinity:   <none>
Message:         error getting deleter volume plugin for volume "pv-mysql": no deletable volume plugin matched
Source:
    Type:      NFS (an NFS mount that lasts the lifetime of a pod)
    Server:    master01.k8s.lab
    Path:      /opt/pv/mysql
    ReadOnly:  false
Events:
  Type     Reason              Age   From                         Message
  ----     ------              ----  ----                         -------
  Warning  VolumeFailedDelete  60s   persistentvolume-controller  error getting deleter volume plugin for volume "pv-mysql": no deletable volume plugin matched
```

### Recycle（回收）

警告：回收策略 Recycle 已被废弃。

如果下层的 PV 支持，回收策略 Recycle 会在 PV 上执行一些基本的删除命令 （`rm -rf /thevolume/*`）操作，之后允许该 PV 用于新的 PVC 申领。
目前，仅 NFS 和 HostPath 支持回收（Recycle）。 AWS EBS、GCE PD、Azure Disk 和 Cinder 卷都支持删除（Delete）。

```text
$ kubectl get pv
NAME       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM               STORAGECLASS   REASON   AGE
pv-mysql   1Gi        RWO            Recycle          Bound    default/pvc-mysql   pv-mysql                7s
                                     # A              # B
```

```text
$ kubectl delete deploy deploy-mysql
$ kubectl delete pvc pvc-mysql
```

```text
$ kubectl get pv
NAME       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   REASON   AGE
pv-mysql   1Gi        RWO            Recycle          Available           pv-mysql                91s
                                     # A              # B
```

```text
$ ls -l /opt/pv/mysql/
total 0
```
