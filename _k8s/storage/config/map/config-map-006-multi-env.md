---
title: "ConfigMap 多环境配置"
sequence: "106"
---

ConfigMap 基于 Namespace 隔离，Pod 只会加载当前 Namespace 的 ConfigMap

```text
$ kubectl create namespace dev
$ kubectl create namespace prod
$ kubectl create namespace test
```

```text
$ kubectl create namespace dev
namespace/dev created
$ kubectl create namespace prod
namespace/prod created
$ kubectl create namespace test
namespace/test created
```

## 开发环境 Dev

创建 Dev Namespace ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cm-nginx
  namespace: dev
data:
  nginx.conf: |
    # ENV: DEV
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
kubectl apply -f cm-dev-nginx.yaml
```

在 Dev namespace 下部署

```text
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deploy-nginx
  namespace: dev
spec:
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
          image: nginx
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
kubectl apply -f deploy-dev-nginx.yaml
```

读取到 Dev 下的 cm-config 信息

```text
$ kubectl get pods -n dev
NAME                            READY   STATUS    RESTARTS   AGE
deploy-nginx-5f9fd6648d-s9x27   1/1     Running   0          11s
deploy-nginx-5f9fd6648d-sxgkh   1/1     Running   0          11s

$ kubectl exec -n dev deploy-nginx-5f9fd6648d-sxgkh -- cat /etc/nginx/nginx.conf | grep ENV
# ENV: DEV
```

## 生产环境 Prod

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cm-nginx
  namespace: prod
data:
  nginx.conf: |
    # ENV: PROD
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
kubectl apply -f cm-prod-nginx.yaml
```

```text
$ cp deploy-dev-nginx.yaml deploy-prod-nginx.yaml

# 修改 namespace 为 prod

$ cat deploy-prod-nginx.yaml | grep namespace
  namespace: prod
```

```text
$ kubectl apply -f deploy-prod-nginx.yaml
```

读取的生产环境配置

```text
$ kubectl get cm -n prod
NAME               DATA   AGE
cm-nginx           1      3m1s
kube-root-ca.crt   1      10m

$ kubectl get pods -n prod
NAME                            READY   STATUS    RESTARTS   AGE
deploy-nginx-5f9fd6648d-njcf9   1/1     Running   0          50s
deploy-nginx-5f9fd6648d-rj6jr   1/1     Running   0          50s
```

```text
$ kubectl exec -n prod deploy-nginx-5f9fd6648d-njcf9 -- cat /etc/nginx/nginx.conf | grep ENV
# ENV: PROD
```

```text
$ kubectl get pods --all-namespaces | grep dev
dev                deploy-nginx-5f9fd6648d-s9x27              1/1     Running   0              9m7s
dev                deploy-nginx-5f9fd6648d-sxgkh              1/1     Running   0              9m7s
```

```text
$ kubectl get pods --all-namespaces | grep prod
prod               deploy-nginx-5f9fd6648d-njcf9              1/1     Running   0              3m
prod               deploy-nginx-5f9fd6648d-rj6jr              1/1     Running   0              3m
```
