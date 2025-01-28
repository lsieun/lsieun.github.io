---
title: "利用 StatefulSet 为每一个 Pod 分配独立存储"
sequence: "103"
---

## 示例

### RBAC

```text
$ vi nfs-client-001-rbac.yaml
```

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
$ kubectl apply -f nfs-client-001-rbac.yaml
```

### Provisioner

```text
$ vi nfs-client-002-provisioner.yaml
```

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
            path: /opt/pv/mysql
```

```text
$ kubectl apply -f nfs-client-002-provisioner.yaml
```

### StorageClass

```text
$ vi nfs-client-003-sc.yaml
```

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
  archiveOnDelete: "false"
mountOptions:
  - hard
  - nfsvers=4
```

```text
$ kubectl apply -f nfs-client-003-sc.yaml
```

### StatefulSet MySQL

```text
$ vi stateful-mysql.yaml
```

```yaml
#Headless Service
apiVersion: v1
kind: Service
metadata:
  name: hsvc-mysql
spec:
  selector:
    app: mysql
  ports:
    - port: 3306
  clusterIP: None
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: stateful-mysql
spec:
  replicas: 3 # pod 数量
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
            - name: pvc-mysql
              mountPath: /var/lib/mysql
  volumeClaimTemplates: # 定义创建 PVC 使用的模板
    - metadata:
        name: pvc-mysql
        annotations: # 这是指定 storageclass
          volume.beta.kubernetes.io/storage-class: managed-nfs-storage
      spec:
        accessModes:
          - ReadWriteMany
        resources:
          requests:
            storage: 512Mi
```

```text
$ kubectl apply -f stateful-mysql.yaml
```


确认 PVC 与 PV 已自动创建

```text
$ kubectl get pods
NAME                                      READY   STATUS    RESTARTS   AGE
nfs-client-provisioner-7dd6bfdc9f-fg6g4   1/1     Running   0          8m47s
stateful-mysql-0                          1/1     Running   0          25s
stateful-mysql-1                          1/1     Running   0          24s
stateful-mysql-2                          1/1     Running   0          11s

$ kubectl get pvc
NAME                         STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS          AGE
pvc-mysql-stateful-mysql-0   Bound    pvc-17fa9dc3-8a45-4f40-8fad-5ac6f053869f   512Mi      RWX            managed-nfs-storage   3m54s
pvc-mysql-stateful-mysql-1   Bound    pvc-5096c37b-3ba2-432d-af3d-222521e34c4b   512Mi      RWX            managed-nfs-storage   49s
pvc-mysql-stateful-mysql-2   Bound    pvc-4cb4d377-0f2f-4806-aabc-774ad5c0e9aa   512Mi      RWX            managed-nfs-storage   36s

$ kubectl get pv
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                                STORAGECLASS          REASON   AGE
pvc-17fa9dc3-8a45-4f40-8fad-5ac6f053869f   512Mi      RWX            Delete           Bound    default/pvc-mysql-stateful-mysql-0   managed-nfs-storage            4m15s
pvc-4cb4d377-0f2f-4806-aabc-774ad5c0e9aa   512Mi      RWX            Delete           Bound    default/pvc-mysql-stateful-mysql-2   managed-nfs-storage            57s
pvc-5096c37b-3ba2-432d-af3d-222521e34c4b   512Mi      RWX            Delete           Bound    default/pvc-mysql-stateful-mysql-1   managed-nfs-storage            70s
```

```text
$ ls /opt/pv/mysql/
default-pvc-mysql-stateful-mysql-0-pvc-17fa9dc3-8a45-4f40-8fad-5ac6f053869f
default-pvc-mysql-stateful-mysql-1-pvc-5096c37b-3ba2-432d-af3d-222521e34c4b
default-pvc-mysql-stateful-mysql-2-pvc-4cb4d377-0f2f-4806-aabc-774ad5c0e9aa
```

观察删除动作，删除 Stateful 并不会删除 PVC 与 PV

```text
$ kubectl delete -f stateful-mysql.yaml 
service "hsvc-mysql" deleted
statefulset.apps "stateful-mysql" deleted

$ kubectl get pvc
NAME                         STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS          AGE
pvc-mysql-stateful-mysql-0   Bound    pvc-17fa9dc3-8a45-4f40-8fad-5ac6f053869f   512Mi      RWX            managed-nfs-storage   7m23s
pvc-mysql-stateful-mysql-1   Bound    pvc-5096c37b-3ba2-432d-af3d-222521e34c4b   512Mi      RWX            managed-nfs-storage   4m18s
pvc-mysql-stateful-mysql-2   Bound    pvc-4cb4d377-0f2f-4806-aabc-774ad5c0e9aa   512Mi      RWX            managed-nfs-storage   4m5s
```

手动删除 PVC 后，PVC、PV、文件都被删除

```text
$ kubectl get pvc
NAME                         STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS          AGE
pvc-mysql-stateful-mysql-0   Bound    pvc-17fa9dc3-8a45-4f40-8fad-5ac6f053869f   512Mi      RWX            managed-nfs-storage   8m12s
pvc-mysql-stateful-mysql-1   Bound    pvc-5096c37b-3ba2-432d-af3d-222521e34c4b   512Mi      RWX            managed-nfs-storage   5m7s
pvc-mysql-stateful-mysql-2   Bound    pvc-4cb4d377-0f2f-4806-aabc-774ad5c0e9aa   512Mi      RWX            managed-nfs-storage   4m54s

$ kubectl delete pvc pvc-mysql-stateful-mysql-0
persistentvolumeclaim "pvc-mysql-stateful-mysql-0" deleted
$ kubectl delete pvc pvc-mysql-stateful-mysql-1
persistentvolumeclaim "pvc-mysql-stateful-mysql-1" deleted
$ kubectl delete pvc pvc-mysql-stateful-mysql-2
persistentvolumeclaim "pvc-mysql-stateful-mysql-2" deleted

$ kubectl get pvc
No resources found in default namespace.
$ kubectl get pv
No resources found
```
