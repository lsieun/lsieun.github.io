---
title: "PersistentVolumeClaim (PVC)"
sequence: "104"
---

## PVC

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-storage-pvc
spec:
  accessModes:
    - ReadWriteOnce
  volumeMode: Filesystem
  resources:
    requests:
      storage: 5Gi
  storageClassName: slow
```

```text
$ kubectl create -f my-storage-pvc.yaml
```

```text
$ kubectl get pvc
NAME             STATUS   VOLUME              CAPACITY   ACCESS MODES   STORAGECLASS   AGE
my-storage-pvc   Bound    my-storage-pv-nfs   5Gi        RWO            slow           7s
```

```text
$ kubectl get pv
NAME                CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                    STORAGECLASS   REASON   AGE
my-storage-pv-nfs   5Gi        RWO            Recycle          Bound    default/my-storage-pvc   slow                    14m
```

## Claims As Volumes

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-storage-pvc-pod
spec:
  containers:
    - name: myfrontend
      image: nginx:1.25.0-bullseye
      volumeMounts:
        - mountPath: "/var/www/html"
          name: mypd
  volumes:
    - name: mypd
      persistentVolumeClaim:
        claimName: my-storage-pvc
```

## PVC 处于 Pending 状态

### 配置 SelfLink

修改 `api-server` 配置文件：

```text
$ sudo vi /etc/kubernetes/manifests/kube-apiserver.yaml
```

```yaml
spec:
  containers:
    - command:
        - kube-apiserver
        - --feature-gates=RemoveSelfLink=false    # 新增该行
```

修改后，重新应用该配置：

```text
kubectl apply -f /etc/kubernetes/manifests/kube-apiserver.yaml
```

### 使用不需要 SelfLink 的 provisioner

将 provisioner 修改为如下镜像之一即可：

```text
$ docker pull registry.aliyuncs.com/sig-storage/nfs-subdir-external-provisioner:v4.0.2
```

```text
$ docker pull registry.aliyuncs.com/pylixm/nfs-subdir-external-provisioner:v4.0.0
```

sig-storage/nfs-subdir-external-provisioner:v4.0.2

```text
registry.aliyuncs.com/google_containers/nfs-subdir-external-provisioner:v4.0.2
```

```text
registry.k8s.io/sig-storage/nfs-subdir-external-provisioner:v4.0.2
```

```text
k8s-sigs.io/nfs-subdir-external-provisioner
```

将

```text
quay.io/external_storage/nfs-client-provisioner:latest
```

替换成：

```text
registry.k8s.io/sig-storage/nfs-subdir-external-provisioner:v4.0.2
```
