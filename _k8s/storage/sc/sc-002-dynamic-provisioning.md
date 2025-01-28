---
title: "Dynamic Volume Provisioning"
sequence: "102"
---

![](/assets/images/k8s/dynamic-provisioning-of-persistent-volumes.png)

## Example01

### Provisioner

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: nfs-client-provisioner
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: nfs-client-provisioner-runner
  namespace: kube-system
rules:
  - apiGroups: [ "" ]
    resources: [ "persistentvolumes" ]
    verbs: [ "get", "list", "watch", "create", "delete" ]
  - apiGroups: [ "" ]
    resources: [ "persistentvolumesclaims" ]
    verbs: [ "get", "list", "watch", "delete" ]
  - apiGroups: [ "storage.k8s.io" ]
    resources: [ "storageclasses" ]
    verbs: [ "get", "list", "watch" ]
  - apiGroups: [ "" ]
    resources: [ "events" ]
    verbs: [ "create", "update", "patch" ]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: run-nfs-client-provisioner
  namespace: kube-system
subjects:
  - name: nfs-client-provisioner
    kind: ServiceAccount
    namespace: kube-system
roleRef:
  name: nfs-client-provisioner-runner
  kind: ClusterRole
  apiGroup: rbac.authorization.k8s.io
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: leader-locking-nfs-client-provisioner
  namespace: kube-system
rules:
  - apiGroups: [ "" ]
    resources: [ "endpoints" ]
    verbs: [ "get", "list", "watch", "create", "update", "patch" ]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: leader-locking-nfs-client-provisioner
  namespace: kube-system
subjects:
  - name: nfs-client-provisioner
    kind: ServiceAccount
roleRef:
  name: leader-locking-nfs-client-provisioner
  kind: Role
  apiGroup: rbac.authorization.k8s.io
```

### Provisioner Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nfs-client-provisioner
  namespace: kube-system
  labels:
    app: nfs-client-provisioner
spec:
  replicas: 1
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: nfs-client-provisioner
  template:
    metadata:
      labels:
        app: nfs-client-provisioner
    spec:
      serviceAccountName: nfs-client-provisioner
      containers:
        - name: nfs-client-provisioner
          image: quay.io/external_storage/nfs-client-provisioner:latest
          imagePullPolicy: IfNotPresent
          volumeMounts:
            - name: nfs-client-root
              mountPath: /persistentvolumes
          env:
            - name: PROVISIONER_NAME
              value: fuseim.prj/ifs
            - name: NFS_SERVER
              value: 192.168.80.131
            - name: NFS_PATH
              value: /data/nfs/rw
      volumes:
        - name: nfs-client-root
          nfs:
            server: 192.168.80.131
            path: /data/nfs/rw
```

### StorageClass

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: managed-nfs-storage
provisioner: fuseim.pri/ifs
parameters:
  archiveOnDelete: "false"
reclaimPolicy: Retain
volumeBindingMode: Immediate
```

### Nginx

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc
  labels:
    app: nginx-svc
spec:
  type: NodePort
  ports:
    - name: web
      port: 80
      protocol: TCP
  selector:
    app: nginx-svc
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: nginx-svc
spec:
  replicas: 1
  serviceName: "nginx-svc"
  selector:
    matchLabels:
      app: nginx-svc
  template:
    metadata:
      labels:
        app: nginx-svc
    spec:
      containers:
        - name: my-nginx-container
          image: nginx:1.25.0-bullseye
          imagePullPolicy: IfNotPresent
          volumeMounts:
            - name: nginx-sc-test-pvc
              mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
    - metadata:
        name: nginx-sc-test-pvc
      spec:
        storageClassName: managed-nfs-storage
        accessModes:
          - ReadWriteMany
        resources:
          requests:
            storage: 1Gi
```

### Run

```text
$ kubectl apply -f rbac.yaml 
serviceaccount/nfs-client-provisioner created
clusterrole.rbac.authorization.k8s.io/nfs-client-provisioner-runner created
clusterrolebinding.rbac.authorization.k8s.io/run-nfs-client-provisioner created
role.rbac.authorization.k8s.io/leader-locking-nfs-client-provisioner created
rolebinding.rbac.authorization.k8s.io/leader-locking-nfs-client-provisioner created
```

```text
$ kubectl apply -f provisioner.yaml 
deployment.apps/nfs-client-provisioner created
```

```text
$ kubectl apply -f storage-class.yaml 
storageclass.storage.k8s.io/managed-nfs-storage created
```

```text
$ kubectl apply -f app.yaml 
service/nginx-svc unchanged
statefulset.apps/nginx-svc created
```

## Example02

### RBAC

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: nfs-client-provisioner
  # replace with namespace where provisioner is deployed
  namespace: default
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: nfs-client-provisioner-runner
rules:
  - apiGroups: [ "" ]
    resources: [ "persistentvolumes" ]
    verbs: [ "get", "list", "watch", "create", "delete" ]
  - apiGroups: [ "" ]
    resources: [ "persistentvolumeclaims" ]
    verbs: [ "get", "list", "watch", "update" ]
  - apiGroups: [ "storage.k8s.io" ]
    resources: [ "storageclasses" ]
    verbs: [ "get", "list", "watch" ]
  - apiGroups: [ "" ]
    resources: [ "events" ]
    verbs: [ "create", "update", "patch" ]
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: run-nfs-client-provisioner
subjects:
  - kind: ServiceAccount
    name: nfs-client-provisioner
    # replace with namespace where provisioner is deployed
    namespace: default
roleRef:
  kind: ClusterRole
  name: nfs-client-provisioner-runner
  apiGroup: rbac.authorization.k8s.io
---
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: leader-locking-nfs-client-provisioner
  # replace with namespace where provisioner is deployed
  namespace: default
rules:
  - apiGroups: [ "" ]
    resources: [ "endpoints" ]
    verbs: [ "get", "list", "watch", "create", "update", "patch" ]
---
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: leader-locking-nfs-client-provisioner
  # replace with namespace where provisioner is deployed
  namespace: default
subjects:
  - kind: ServiceAccount
    name: nfs-client-provisioner
    # replace with namespace where provisioner is deployed
    namespace: default
roleRef:
  kind: Role
  name: leader-locking-nfs-client-provisioner
  apiGroup: rbac.authorization.k8s.io
```

### Provider

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nfs-client-provisioner
  labels:
    app: nfs-client-provisioner
  # replace with namespace where provisioner is deployed
  namespace: default
spec:
  replicas: 1
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: nfs-client-provisioner
  template:
    metadata:
      labels:
        app: nfs-client-provisioner
    spec:
      serviceAccountName: nfs-client-provisioner
      containers:
        - name: nfs-client-provisioner
          image: quay.io/external_storage/nfs-client-provisioner:latest
          volumeMounts:
            - name: nfs-client-root
              mountPath: /persistentvolumes
          env:
            - name: PROVISIONER_NAME
              value: fuseim.pri/ifs
            - name: NFS_SERVER
              value: 192.168.80.130
            - name: NFS_PATH
              value: /data/nfs/rw
      volumes:
        - name: nfs-client-root
          nfs:
            server: 192.168.80.130
            path: /data/nfs/rw
```

### StorageClass

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: managed-nfs-storage
provisioner: fuseim.pri/ifs # or choose another name, must match deployment's env PROVISIONER_NAME'
parameters:
  archiveOnDelete: "false"
```

### PVC

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: test-claim
  annotations:
    volume.beta.kubernetes.io/storage-class: "managed-nfs-storage"
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 1Mi
```

### Pod

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: test-pod
spec:
  containers:
    - name: test-pod
      image: gcr.io/google_containers/busybox:1.24
      command:
        - "/bin/sh"
      args:
        - "-c"
        - "touch /mnt/SUCCESS && exit 0 || exit 1"
      volumeMounts:
        - name: nfs-pvc
          mountPath: "/mnt"
  restartPolicy: "Never"
  volumes:
    - name: nfs-pvc
      persistentVolumeClaim:
        claimName: test-claim
```

## Example 03

### 流程

- 创建一个可用的 NFS Service
- 创建 Service Account. 这是用来管控 NFS provisioner 在 k8s 集群中运行的权限
- 创建 StorageClass. 负责建立 PVC 并调用 NFS provisioner 进行预定的工作, 并让 PV 与 PVC 建立管理
- 创建 NFS provisioner. 有两个功能,一个是在 NFS 共享目录下创建挂载点(volume), 另一个则是建了 PV 并将 PV 与 NFS 的挂载点建立关联

### 创建 NFS 共享服务

```text
$ sudo yum -y install nfs-utils
$ sudo mkdir /nfsdata
$ sudo chmod 755 /nfsdata
$ sudo chown nfsnobody:nfsnobody /nfsdata/
$ echo "/nfsdata    *(rw,sync,all_squash)" > /etc/exports
$ sudo tee -a /etc/exports <<EOF
/nfsdata    *(rw,sync,all_squash)
EOF
$ sudo systemctl enable nfs
$ sudo systemctl start nfs
$ systemctl status nfs
```

```text
$ sudo exportfs -rv
exporting *:/nfsdata
```

验证共享存储是否生效：

```text
$ showmount -e
Export list for master01.k8s.lab:
/nfsdata *
```

### 创建 account 及相关权限

创建 external_storage 命名空间

```text
$ kubectl create ns external-storage
namespace/external-storage created
```

创建 RBAC 权限，`nfs-client-rbac.yaml`

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: nfs-client-provisioner
  # replace with namespace where provisioner is deployed
  namespace: external-storage
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: nfs-client-provisioner-runner
rules:
  - apiGroups: [ "" ]
    resources: [ "persistentvolumes" ]
    verbs: [ "get", "list", "watch", "create", "delete" ]
  - apiGroups: [ "" ]
    resources: [ "persistentvolumeclaims" ]
    verbs: [ "get", "list", "watch", "update" ]
  - apiGroups: [ "storage.k8s.io" ]
    resources: [ "storageclasses" ]
    verbs: [ "get", "list", "watch" ]
  - apiGroups: [ "" ]
    resources: [ "events" ]
    verbs: [ "create", "update", "patch" ]
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: run-nfs-client-provisioner
subjects:
  - kind: ServiceAccount
    name: nfs-client-provisioner
    # replace with namespace where provisioner is deployed
    namespace: external-storage
roleRef:
  kind: ClusterRole
  name: nfs-client-provisioner-runner
  apiGroup: rbac.authorization.k8s.io
---
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: leader-locking-nfs-client-provisioner
  # replace with namespace where provisioner is deployed
  namespace: external-storage
rules:
  - apiGroups: [ "" ]
    resources: [ "endpoints" ]
    verbs: [ "get", "list", "watch", "create", "update", "patch" ]
---
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: leader-locking-nfs-client-provisioner
  # replace with namespace where provisioner is deployed
  namespace: external-storage
subjects:
  - kind: ServiceAccount
    name: nfs-client-provisioner
    # replace with namespace where provisioner is deployed
    namespace: external-storage
roleRef:
  kind: Role
  name: leader-locking-nfs-client-provisioner
  apiGroup: rbac.authorization.k8s.io
```

### 创建 NFS provisioner Deployment

nfs-client-provisioner.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nfs-client-provisioner
  labels:
    app: nfs-client-provisioner
  # replace with namespace where provisioner is deployed
  namespace: external-storage
spec:
  replicas: 1
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: nfs-client-provisioner
  template:
    metadata:
      labels:
        app: nfs-client-provisioner
    spec:
      serviceAccountName: nfs-client-provisioner
      containers:
        - name: nfs-client-provisioner
          image: pylixm/nfs-subdir-external-provisioner:v4.0.0
          volumeMounts:
            - name: nfs-client-root
              mountPath: /persistentvolumes
          env:
            - name: PROVISIONER_NAME
              value: fuseim.pri/ifs
            - name: NFS_SERVER
              value: 192.168.80.131
            - name: NFS_PATH
              value: /nfsdata
      volumes:
        - name: nfs-client-root
          nfs:
            server: 192.168.80.131
            path: /nfsdata
```

### 创建基于 NFS 资源的 StorageClass

nfs-client-storage-class.yaml

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: managed-nfs-storage
provisioner: fuseim.pri/ifs # or choose another name, must match deployment\'s env PROVISIONER_NAME\'
parameters:
  archiveOnDelete: "false"
```

依次应用资源配置清单：

```text
$ kubectl apply -f nfs-client-rbac.yaml
$ kubectl apply -f nfs-client-provisioner.yaml
$ kubectl apply -f nfs-client-storage-class.yaml
```

### 创建 PVC，POD 验证

nfs-client-pvc-test.yaml

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: test-claim
  annotations:
    volume.beta.kubernetes.io/storage-class: "managed-nfs-storage"
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 100Mi
```

```text
$ kubectl apply -f nfs-client-pvc-test.yaml
$ kubectl get pvc
$ kubectl get pv
```

nfs-client-pod-test.yaml

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: test-pod
spec:
  containers:
  - name: test-pod
    image: library/busybox:latest
    command:
      - "/bin/sh"
    args:
      - "-c"
      - "touch /mnt/SUCCESS && exit 0 || exit 1"
    volumeMounts:
      - name: nfs-pvc
        mountPath: "/mnt"
  restartPolicy: "Never"
  volumes:
    - name: nfs-pvc
      persistentVolumeClaim:
        claimName: test-claim
```

```text
$ kubectl apply -f nfs-client-pod-test.yaml
```

```text
$ kubectl get pvc
NAME         STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS          AGE
test-claim   Bound    pvc-852e7e0a-af79-4d22-bd4e-a8bfc74bcdd5   100Mi      RWX            managed-nfs-storage   70s

$ ls -l /nfsdata/default-test-claim-pvc-852e7e0a-af79-4d22-bd4e-a8bfc74bcdd5/
total 0
-rw-r--r--. 1 nfsnobody nfsnobody 0 Jul  8 20:05 SUCCESS
```

## Example 04 （成功）

### RBAC

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: nfs-client-provisioner
  # replace with namespace where provisioner is deployed
  namespace: default
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: nfs-client-provisioner-runner
rules:
  - apiGroups: [ "" ]
    resources: [ "nodes" ]
    verbs: [ "get", "list", "watch" ]
  - apiGroups: [ "" ]
    resources: [ "persistentvolumes" ]
    verbs: [ "get", "list", "watch", "create", "delete" ]
  - apiGroups: [ "" ]
    resources: [ "persistentvolumeclaims" ]
    verbs: [ "get", "list", "watch", "update" ]
  - apiGroups: [ "storage.k8s.io" ]
    resources: [ "storageclasses" ]
    verbs: [ "get", "list", "watch" ]
  - apiGroups: [ "" ]
    resources: [ "events" ]
    verbs: [ "create", "update", "patch" ]
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: run-nfs-client-provisioner
subjects:
  - kind: ServiceAccount
    name: nfs-client-provisioner
    # replace with namespace where provisioner is deployed
    namespace: default
roleRef:
  kind: ClusterRole
  name: nfs-client-provisioner-runner
  apiGroup: rbac.authorization.k8s.io
---
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: leader-locking-nfs-client-provisioner
  # replace with namespace where provisioner is deployed
  namespace: default
rules:
  - apiGroups: [ "" ]
    resources: [ "endpoints" ]
    verbs: [ "get", "list", "watch", "create", "update", "patch" ]
---
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: leader-locking-nfs-client-provisioner
  # replace with namespace where provisioner is deployed
  namespace: default
subjects:
  - kind: ServiceAccount
    name: nfs-client-provisioner
    # replace with namespace where provisioner is deployed
    namespace: default
roleRef:
  kind: Role
  name: leader-locking-nfs-client-provisioner
  apiGroup: rbac.authorization.k8s.io
```

```text
$ kubectl apply -f rbac.yaml 
serviceaccount/nfs-client-provisioner created
clusterrole.rbac.authorization.k8s.io/nfs-client-provisioner-runner created
clusterrolebinding.rbac.authorization.k8s.io/run-nfs-client-provisioner created
role.rbac.authorization.k8s.io/leader-locking-nfs-client-provisioner created
rolebinding.rbac.authorization.k8s.io/leader-locking-nfs-client-provisioner created
```

### Provisioner Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nfs-client-provisioner
  labels:
    app: nfs-client-provisioner
  namespace: default
spec:
  replicas: 1
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: nfs-client-provisioner
  template:
    metadata:
      labels:
        app: nfs-client-provisioner
    spec:
      serviceAccountName: nfs-client-provisioner
      containers:
        - name: nfs-client-provisioner
          image: dyrnq/nfs-subdir-external-provisioner:v4.0.2
          volumeMounts:
            - name: nfs-client-root
              mountPath: /persistentvolumes
          env:
            - name: PROVISIONER_NAME
              value: k8s-sigs.io/nfs-subdir-external-provisioner
            - name: NFS_SERVER
              value: master01.k8s.lab
            - name: NFS_PATH
              value: /opt/pv/mysql
      volumes:
        - name: nfs-client-root
          nfs:
            server: master01.k8s.lab
            path: /opt/pv/mysql/
```

```text
$ kubectl apply -f nfs-client-provisioner.yaml 
deployment.apps/nfs-client-provisioner created
```

```text
$ kubectl get pods -o wide
NAME                                      READY   STATUS    RESTARTS   AGE    IP               NODE               NOMINATED NODE   READINESS GATES
nfs-client-provisioner-745bbb7b76-h7fld   1/1     Running   0          3m3s   10.244.167.198   worker02.k8s.lab   <none>           <none>
```

### StorageClass

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: managed-nfs-storage
  annotations:
    ## 是否设置为默认的存储类
    storageclass.kubernetes.io/is-default-class: "false"
## 必须匹配 deployment 中环境变量 PROVISIONER_NAME 的值
provisioner: k8s-sigs.io/nfs-subdir-external-provisioner
parameters:
  pathPattern: ""
  archiveOnDelete: "false"
mountOptions:
  - hard
  - nfsvers=4
```

```text
$ kubectl apply -f nfs-client-sc.yaml
storageclass.storage.k8s.io/managed-nfs-storage created
```

```text
$ kubectl get sc
NAME                  PROVISIONER                                   RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
managed-nfs-storage   k8s-sigs.io/nfs-subdir-external-provisioner   Delete          Immediate           false                  96s
```

### PVC

自定义 StorageClass 后，就不需要手动创建 PV，在创建 PVC 时会自动根据 StorageClass 描述创建 PV。

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: pvc-mysql
spec:
  storageClassName: managed-nfs-storage
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 1Mi
```

```text
$ kubectl apply -f nfs-client-pvc.yaml 
persistentvolumeclaim/pvc-mysql created
```

```text
$ kubectl get pvc
NAME        STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS          AGE
pvc-mysql   Bound    pvc-a4cb4954-b690-40df-8ac0-75a93f97161a   1Mi        RWX            managed-nfs-storage   26s
```

```text
$ kubectl get pv
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM               STORAGECLASS          REASON   AGE
pvc-a4cb4954-b690-40df-8ac0-75a93f97161a   1Mi        RWX            Delete           Bound    default/pvc-mysql   managed-nfs-storage            31s
```

### MySQL Deployment

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
deployment.apps/deploy-mysql created
```

删除 Deploy 并不会对 PV 与 PVC 产生影响：

```text
$ kubectl delete -f deploy-mysql.yml 
deployment.apps "deploy-mysql" deleted

$ kubectl get pvc
NAME        STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS          AGE
pvc-mysql   Bound    pvc-a4cb4954-b690-40df-8ac0-75a93f97161a   1Mi        RWX            managed-nfs-storage   4m43s

$ kubectl get pv
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM               STORAGECLASS          REASON   AGE
pvc-a4cb4954-b690-40df-8ac0-75a93f97161a   1Mi        RWX            Delete           Bound    default/pvc-mysql   managed-nfs-storage            4m58s
```

动态产生的 PV 默认策略为 Delete，会随着 PVC 删除一并被删除：

```text
$ kubectl get sc
NAME                  PROVISIONER                                   RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
managed-nfs-storage   k8s-sigs.io/nfs-subdir-external-provisioner   Delete          Immediate           false                  10m

$ kubectl delete -f nfs-client-pvc.yaml 
persistentvolumeclaim "pvc-mysql" deleted

$ kubectl get pvc
No resources found in default namespace.

$ kubectl get pv
No resources found
```

## Reference

- [Dynamic Volume Provisioning](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/)

- [kubernetes-retired/external-storage](https://github.com/kubernetes-retired/external-storage/tree/master/nfs-client/deploy)
- [使用 nfs 作为 kubernetes 动态 storageClass 存储](https://it.cha138.com/python/show-5676682.html)
- [K3S/K8S 中动态创建 PVC 时 SelfLink 问题解决](https://zhuanlan.zhihu.com/p/468467734)
