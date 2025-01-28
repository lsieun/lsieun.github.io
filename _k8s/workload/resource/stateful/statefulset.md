---
title: "StatefulSet"
sequence: "statefulset"
---

![](/assets/images/k8s/database-in-k8s-extra-steps.jpg)

StatefulSet 中每个 Pod 的 DNS 格式为 `statefulSetName-{0..N-1}.serviceName.namespace.svc.cluster.local`

- `serviceName` 为 Headless Service 的名字
- `0..N-1` 为 Pod 所在的序号，从 `0` 开始，到 `N-1`
- `statefulSetName` 为 `StatefulSet` 的名字
- `namespace` 为服务所在的 namespace， Headless Service 和 StatefulSet 必须在相同的 namespace
- `.cluster.local` 为 Cluster Domain

File: `web.yaml`

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  ports:
    - port: 80
      name: web
  clusterIP: None
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  serviceName: "nginx"
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.25.0-bullseye
          ports:
            - containerPort: 80
              name: web
```

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  ports:
    - port: 80
      name: web
  clusterIP: None
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  serviceName: "nginx"
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.25.0-bullseye
          ports:
            - containerPort: 80
              name: web
          volumeMounts:
            - name: www
              mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
    - metadata:
        name: www
        annotations:
          volume.alpha.kubernetes.io/storage-class:anything
      spec:
        accessModes: [ "ReadWriteOnce" ]
        resources:
          requests:
            storage: 1Gi
```

```text
kubectl create -f web.yaml
```

```text
$ kubectl get all
NAME        READY   STATUS    RESTARTS   AGE
pod/web-0   1/1     Running   0          13m
pod/web-1   1/1     Running   0          13m

NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   2d13h
service/nginx        ClusterIP   None         <none>        80/TCP    13m

NAME                   READY   AGE
statefulset.apps/web   2/2     13m
```

```text
$ kubectl get pods -o wide
NAME    READY   STATUS    RESTARTS   AGE   IP               NODE               NOMINATED NODE   READINESS GATES
web-0   1/1     Running   0          19m   10.244.203.5     worker01.k8s.lab   <none>           <none>
web-1   1/1     Running   0          19m   10.244.167.195   worker02.k8s.lab   <none>           <none>
```

```text
$ kubectl run -it --image busybox dns-test --restart=Never --rm /bin/sh
```

```text
# ping web-0.nginx
```

![](/assets/images/k8s/busybox-ping-pod-web-nginx.png)

```text
$ kubectl run -it --image busybox:1.28.4 dns-test --restart=Never --rm /bin/sh
```

![](/assets/images/k8s/busybox-nslookup-pod-web-nginx.png)

## Scale

第一种方式：

```text
$ kubectl scale statefulset web --replica=5
$ kubectl scale statefulset web --replica=3
```

第二种方式：（没有成功）

```text
$ kubectl patch statefulset web -p '{"spec":{"replicas":5}}'
$ kubectl patch statefulset web -p '{"spec":{"replicas":3}}'
```

## 镜像更新

目前，还不支持直接更新 image，需要 patch 来间接实现：

```text
$ kubectl patch statefulset web \
      --type='json' \
      -p '[{"op":"replace", "path":"/spec/template/spec/containers/0/image","value":"nginx:1.24.0-bullseye"}]'
```

```text
$ kubectl edit pods web-0
```

### RollingUpdate

StatefulSet 也可以采用滚动更新策略，同样是修改 pod template 属性后会触发更新，
但是，由于 pod 是有序的，在 StatefulSet 中更新时是基于 pod 的顺序倒序更新的。

#### 灰度发布/金丝雀发布

```text
StatefulSet --> 镜像更新 --> Rolling Update --> 灰度发布
```

利用滚动更新中的 partition 属性，可以实现简易的灰度发布的效果。

例如，我们有 5 个 pod，如果当前 partition 设置为 3，那么此时滚动更新时，只会更新那些序号 `>= 3` 的 pod

利用该机制，我们可能通过控制 partition 的值，来决定只更新其中一部分 pod，确认没有问题后，再逐渐增大更新的 pod 数量，
最终实现全部 pod 更新。

```text
$ kubectl edit statefulset web
```

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  serviceName: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.24.0-bullseye
        imagePullPolicy: IfNotPresent
        name: nginx
        ports:
        - containerPort: 80
          name: web
          protocol: TCP
        resources: {}
      restartPolicy: Always
  updateStrategy:
    rollingUpdate:
      partition: 0                           # 注意，这里是 partition 属性
    type: RollingUpdate
```

### OnDelete

```text
$ kubectl edit statefulset web
```

```yaml
spec:
  updateStrategy:
    type: OnDelete
```

```text
$ kubectl delete po web-0
```

```text
for i in {0..4}; do echo -e "web-${i}: $(kubectl describe pod web-${i} | grep "Image:")"; done
```

## 删除

删除 StatefulSet 和 Headless Service

级联删除：删除 StatefulSet 时，也会删除 pods

```text
$ kubectl delete statefulset web
```

非级联删除：删除 statefulset 时，不会删除 pods

```text
$ kubectl delete statefulset web --cascade=orphan
$ for i in {0..4}; do  kubectl delete pods web-${i}; done
```

删除 service

```text
$ kubectl delete services nginx
```
