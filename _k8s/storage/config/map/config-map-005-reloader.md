---
title: "ConfigMap 热部署"
sequence: "105"
---

## Reloader

```text
https://github.com/stakater/Reloader
```

Reloader can watch changes in `ConfigMap` and `Secret` and do rolling upgrades on Pods
with their associated `DeploymentConfigs`, `Deployments`, `Daemonsets` `Statefulsets` and `Rollouts`.

## 快速上手

### 自动全量监听

```text
reloader.stakater.com/auto: "true"
```

```yaml
kind: Deployment
metadata:
  annotations:
    reloader.stakater.com/auto: "true"
spec:
  template:
    metadata:
```

### 局部监听

部署脚本增加 `reloader.stakater.com/search=true`

```yaml

```

ConfigMap 增加 `reloader.stakater.com/match=true`

```yaml
kind: ConfigMap
metadata:
  annotations:
    reloader.stakater.com/match: "true"
data:
  key: value
```

### 局部热更新

```yaml
kind: Deployment
metadata:
  annotations:
    configmap.reloader.stakater.com/reload: "foo-configmap"
spec:
  template:
    metadata:
```

可以写多个

```yaml
kind: Deployment
metadata:
  annotations:
    configmap.reloader.stakater.com/reload: "foo-configmap,bar-configmap,baz-configmap"
spec:
  template: 
    metadata:
```

## 重新加载策略

Reloader 支持多种“重新加载”策略，用于对资源执行滚动升级。以下列表描述了它们：

- env-vars：当跟踪的 configMap/secret 更新时，此策略将 Reloader 特定的环境变量附加到引用已更改 configMap 或 secret 拥有资源（例如 Deployment，，StatefulSet 等）的任何容器。这个策略可以用参数指定 --reload-strategy=env-vars。注意：这是默认的重新加载策略。
- annotations：当跟踪 configMap/secret 更新时，此策略会 reloader.stakater.com/last-reloaded-from 在拥有的资源（例如 Deployment，，StatefulSet 等）上附加一个 pod 模板注释。此策略在使用 ArgoCD 等资源同步工具时很有用，因为它不会导致这些工具在重新加载资源后检测配置漂移。注意：由于附加的 pod 模板注释仅跟踪最后的重新加载源，因此该策略将重新加载任何被跟踪的资源，如果它 configMap 被 secret 删除并重新创建。这个策略可以用参数指定 --reload-strategy=annotations。

## 示例

```text
https://raw.githubusercontent.com/stakater/Reloader/master/deployments/kubernetes/reloader.yaml
```

```text
$ kubectl apply -f reloader.yaml 
serviceaccount/reloader-reloader created
clusterrole.rbac.authorization.k8s.io/reloader-reloader-role created
clusterrolebinding.rbac.authorization.k8s.io/reloader-reloader-role-binding created
deployment.apps/reloader-reloader created
```

```text
$ kubectl get pods
NAME                                 READY   STATUS    RESTARTS   AGE
reloader-reloader-65bf95db88-jb9sv   1/1     Running   0          38s
```

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cm-nginx
data:
  nginx.conf: |
    # lsieun-v1.0
    user  nginx;
    worker_processes  1;

    error_log  /var/log/nginx/error.log warn;
    pid        /var/run/nginx.pid;


    events {
        worker_connections  1024;
    }


    http {
        include       /etc/nginx/mime.types;
        default_type  application/octet-stream;

        log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                          '$status $body_bytes_sent "$http_referer" '
                          '"$http_user_agent" "$http_x_forwarded_for"';

        access_log  /var/log/nginx/access.log  main;

        sendfile        on;
        #tcp_nopush     on;


        keepalive_timeout  65;

        #gzip  on;

        include /etc/nginx/conf.d/*.conf;
    }
```

```text
$ kubectl apply -f cm-nginx.yaml
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deploy-nginx
  annotations:
    reloader.stakater.com/auto: "true"
spec:
  replicas: 3
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
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 80
          volumeMounts:
            - name: vol-nginx
              mountPath: /etc/nginx/nginx.conf
              subPath: nginx.conf
      volumes:
        - name: vol-nginx
          configMap:
            name: cm-nginx
            items:
              - key: nginx.conf
                path: nginx.conf
```

```text
$ kubectl apply -f deploy-nginx.yaml
```

```text
$ kubectl get pods
NAME                                 READY   STATUS    RESTARTS   AGE
deploy-nginx-7b9ff878c4-bn4n5        1/1     Running   0          6s
deploy-nginx-7b9ff878c4-m47wp        1/1     Running   0          6s
deploy-nginx-7b9ff878c4-nlbgq        1/1     Running   0          6s
reloader-reloader-65bf95db88-jb9sv   1/1     Running   0          4m37s
```

修改配置文件后，重新加载：

```text
将 lsieun-v1.0 修改为 lsieun-v2.0
```

```text
$ kubectl apply -f cm-nginx.yaml
```

```text
$ kubectl get pods
NAME                                 READY   STATUS    RESTARTS   AGE
deploy-nginx-554487d68-9dc7v         1/1     Running   0          14s
deploy-nginx-554487d68-l7ndx         1/1     Running   0          15s
deploy-nginx-554487d68-p7cp9         1/1     Running   0          16s
reloader-reloader-65bf95db88-jb9sv   1/1     Running   0          6m44s
```

```text
$ kubectl exec --stdin --tty deploy-nginx-554487d68-9dc7v -- /bin/bash
root@deploy-nginx-554487d68-9dc7v:/# cat /etc/nginx/nginx.conf 
# lsieun-v2.0    # A 注意，这里变成了 2.0
user  nginx;
...
```

```text
$ kubectl exec deploy-nginx-554487d68-9dc7v -- cat /etc/nginx/nginx.conf | grep lsieun
# lsieun-v2.0
```

```text
$ kubectl get pods -w
NAME                                 READY   STATUS              RESTARTS   AGE
deploy-nginx-6d4f476465-9dr65        0/1     ContainerCreating   0          1s
deploy-nginx-6d4f476465-b2nzk        1/1     Running             0          3s
deploy-nginx-6d4f476465-jb456        1/1     Running             0          2s
reloader-reloader-65bf95db88-jb9sv   1/1     Running             0          11m
deploy-nginx-6d4f476465-9dr65        1/1     Running             0          1s
deploy-nginx-554487d68-l7ndx         1/1     Terminating         0          5m30s
deploy-nginx-554487d68-p7cp9         0/1     Terminating         0          5m31s
deploy-nginx-554487d68-l7ndx         0/1     Terminating         0          5m31s

$ kubectl get pods
NAME                                 READY   STATUS    RESTARTS   AGE
deploy-nginx-6d4f476465-9dr65        1/1     Running   0          18s
deploy-nginx-6d4f476465-b2nzk        1/1     Running   0          20s
deploy-nginx-6d4f476465-jb456        1/1     Running   0          19s
reloader-reloader-65bf95db88-jb9sv   1/1     Running   0          12m
```

```text
$ kubectl get pods -w
NAME                                 READY   STATUS              RESTARTS   AGE
deploy-nginx-68ddb459b9-7d562        0/1     ContainerCreating   0          1s
deploy-nginx-6d4f476465-9dr65        1/1     Running             0          5m22s
deploy-nginx-6d4f476465-b2nzk        1/1     Running             0          5m24s
deploy-nginx-6d4f476465-jb456        1/1     Running             0          5m23s
reloader-reloader-65bf95db88-jb9sv   1/1     Running             0          17m
deploy-nginx-68ddb459b9-7d562        1/1     Running             0          1s
deploy-nginx-6d4f476465-b2nzk        1/1     Terminating         0          5m24s
deploy-nginx-68ddb459b9-pgsqg        0/1     Pending             0          0s
deploy-nginx-68ddb459b9-pgsqg        0/1     Pending             0          0s
deploy-nginx-68ddb459b9-pgsqg        0/1     ContainerCreating   0          0s
deploy-nginx-6d4f476465-b2nzk        1/1     Terminating         0          5m24s
deploy-nginx-6d4f476465-b2nzk        0/1     Terminating         0          5m24s
deploy-nginx-68ddb459b9-pgsqg        0/1     ContainerCreating   0          1s
deploy-nginx-6d4f476465-b2nzk        0/1     Terminating         0          5m25s
deploy-nginx-6d4f476465-b2nzk        0/1     Terminating         0          5m25s
deploy-nginx-6d4f476465-b2nzk        0/1     Terminating         0          5m25s
deploy-nginx-68ddb459b9-pgsqg        1/1     Running             0          1s
deploy-nginx-6d4f476465-jb456        1/1     Terminating         0          5m24s
deploy-nginx-68ddb459b9-vppkx        0/1     Pending             0          0s
deploy-nginx-68ddb459b9-vppkx        0/1     Pending             0          0s
deploy-nginx-68ddb459b9-vppkx        0/1     ContainerCreating   0          0s
deploy-nginx-6d4f476465-jb456        1/1     Terminating         0          5m24s
deploy-nginx-6d4f476465-jb456        0/1     Terminating         0          5m24s
deploy-nginx-68ddb459b9-vppkx        0/1     ContainerCreating   0          1s
deploy-nginx-68ddb459b9-vppkx        1/1     Running             0          1s
deploy-nginx-6d4f476465-jb456        0/1     Terminating         0          5m25s
deploy-nginx-6d4f476465-9dr65        1/1     Terminating         0          5m24s
deploy-nginx-6d4f476465-jb456        0/1     Terminating         0          5m25s
deploy-nginx-6d4f476465-jb456        0/1     Terminating         0          5m25s
deploy-nginx-6d4f476465-9dr65        1/1     Terminating         0          5m24s
deploy-nginx-6d4f476465-9dr65        0/1     Terminating         0          5m24s
deploy-nginx-6d4f476465-9dr65        0/1     Terminating         0          5m25s
deploy-nginx-6d4f476465-9dr65        0/1     Terminating         0          5m25s
deploy-nginx-6d4f476465-9dr65        0/1     Terminating         0          5m25s
```
