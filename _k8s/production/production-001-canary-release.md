---
title: "金丝雀发布"
sequence: "101"
---

## 什么是金丝雀发布

金丝雀发布（Canary release）是一种降低在生产中引入新软件版本的风险的技术，也称“灰度发布”，
方法是在将更改推广到整个基础架构并使其可供所有人使用之前，缓慢地将更改推广到一小部分用户。

## 金丝雀发布的挑战

- 如何管理新旧不同版本，在指定服务器发布新版本
- 如何实现扩容/缩容
- 如何实现访问可控

## 基于 K8S 业界中最佳实践

### 如何在指定服务器发布？

通过**节点亲和性**（Node Affinity）在对应的节点自动发布，控制不同版本的分布

### 如何控制动态扩容？

```text
$ kubectl label nodes worker01.k8s.lab dtype=secondary
$ kubectl scale deploy deploy-nginx-v1 --replicas=15
$ kubectl scale deploy deploy-nginx-v2 --replicas=12
```

> dtype 可能是 deployment type 的缩写

### 如何实现访问可控

- 按比例实现流量分发：`nginx.ingress.kubernetes.io/canary-weight: "10"`
- 流量稳定投递到 V1/V2 Pod：设置 `IPVS` 模式为 `sh`
    - `rr`/`round robin`: distributes jobs equally amongst the available real servers
    - `lc`/`least connection`: assigns more jobs to real servers with fewer active jobs
    - `sh`/`source hashing`: assigns jobs to servers through looking up a statically assigned hash table
      by their source IP addresses
    - `dh`/`destination hashing`: assigns jobs to servers through looking up a statically assigned hash table
      by their destination IP addresses
    - `sed`/`shortest expected delay`: assigns an incoming job to the server with the shortest expected delay.
      The expected delay that the job will experience is (Ci + 1) / Ui if sent to the ith server,
      in which Ci is the number of jobs on the ith server and Ui is the fixed service rate (weight) of the ith server.
    - `nq`/`never queue`: assigns an incoming job to an idle server if there is, instead of waiting for a fast one;
      if all the servers are busy, it adopts the ShortestExpectedDelay policy to assign the job.

## 实战

安装 ingress-nginx-controller

```text
kubectl apply -f http://manongbiji.oss-cn-beijing.aliyuncs.com/ittailkshow/k8s/download/ingress-nginx-1.5.1.yaml
```

查看安装结果，获取对外暴露的端口号

```text
$ kubectl get all -n ingress-nginx 
NAME                                           READY   STATUS      RESTARTS   AGE
pod/ingress-nginx-admission-create-l7p88       0/1     Completed   0          4m4s
pod/ingress-nginx-admission-patch-rzn2r        0/1     Completed   1          4m4s
pod/ingress-nginx-controller-d68bbf7d5-hb8l7   1/1     Running     0          4m4s

NAME                                         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                      AGE
service/ingress-nginx-controller             NodePort    10.96.94.196    <none>        80:30909/TCP,443:31723/TCP   4m4s
service/ingress-nginx-controller-admission   ClusterIP   10.104.117.71   <none>        443/TCP                      4m4s

NAME                                       READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/ingress-nginx-controller   1/1     1            1           4m4s

NAME                                                 DESIRED   CURRENT   READY   AGE
replicaset.apps/ingress-nginx-controller-d68bbf7d5   1         1         1       4m4s

NAME                                       COMPLETIONS   DURATION   AGE
job.batch/ingress-nginx-admission-create   1/1           3m39s      4m4s
job.batch/ingress-nginx-admission-patch    1/1           3m40s      4m4s
```

### 部署 nginx-v1

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-v1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
      version: v1
  template:
    metadata:
      labels:
        app: nginx
        version: v1
    spec:
      containers:
        - name: nginx
          image: "openresty/openresty:centos"
          ports:
            - name: http
              protocol: TCP
              containerPort: 80
          volumeMounts:
            - mountPath: /usr/local/openresty/nginx/conf/nginx.conf
              name: config
              subPath: nginx.conf
      volumes:
        - name: config
          configMap:
            name: nginx-v1
---
apiVersion: v1
kind: ConfigMap
metadata:
  labels:
    app: nginx
    version: v1
  name: nginx-v1
data:
  nginx.conf: |-
    worker_processes  1;
    events {
        accept_mutex on;
        multi_accept on;
        use epoll;
        worker_connections  1024;
    }
    http {
        ignore_invalid_headers off;
        server {
            listen 80;
            location / {
                access_by_lua '
                    local header_str = ngx.say("nginx-v1")
                ';
            }
        }
    }
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-v1
spec:
  type: ClusterIP
  ports:
    - port: 80
      protocol: TCP
      name: http
  selector:
    app: nginx
    version: v1
```

```text
kubectl apply -f deploy-openresty-v1.yaml
```

验证

```text
$ kubectl get pods
NAME                        READY   STATUS    RESTARTS   AGE
nginx-v1-7f6dfc8d78-8tdsz   1/1     Running   0          24s
```

### 部署 nginx-v2

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-v2
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
      version: v2
  template:
    metadata:
      labels:
        app: nginx
        version: v2
    spec:
      containers:
        - name: nginx
          image: "openresty/openresty:centos"
          ports:
            - name: http
              protocol: TCP
              containerPort: 80
          volumeMounts:
            - mountPath: /usr/local/openresty/nginx/conf/nginx.conf
              name: config
              subPath: nginx.conf
      volumes:
        - name: config
          configMap:
            name: nginx-v2
---
apiVersion: v1
kind: ConfigMap
metadata:
  labels:
    app: nginx
    version: v2
  name: nginx-v2
data:
  nginx.conf: |-
    worker_processes  1;
    events {
        accept_mutex on;
        multi_accept on;
        use epoll;
        worker_connections  1024;
    }
    http {
        ignore_invalid_headers off;
        server {
            listen 80;
            location / {
                access_by_lua '
                    local header_str = ngx.say("nginx-v2:222222222")
                ';
            }
        }
    }
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-v2
spec:
  type: ClusterIP
  ports:
    - port: 80
      protocol: TCP
      name: http
  selector:
    app: nginx
    version: v2
```

```text
kubectl apply -f deploy-openresty-v2.yaml
```

验证

```text
$ kubectl get pods
NAME                        READY   STATUS    RESTARTS   AGE
nginx-v1-7f6dfc8d78-8tdsz   1/1     Running   0          3m15s
nginx-v2-579c9c9b4d-hrchb   1/1     Running   0          23s
```

### 部署 ingress-nginx-v1

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nginx
  annotations:
    # 直接映射至根路径
    ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
    - host: foo.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: nginx-v1
                port:
                  number: 80
```

```text
kubectl apply -f ingress-nginx-v1.yaml
```

```text
$ kubectl get ingress
NAME    CLASS   HOSTS             ADDRESS   PORTS   AGE
nginx   nginx   foo.example.com             80      15s
```

### 部署 ingress-nginx-v2

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nginx-canary
  annotations:
    ingress.kubernetes.io/rewrite-target: /
    # 开启灰度发布
    nginx.ingress.kubernetes.io/canary: "true"
    # 如果请求头附加 Region 属性，则强制走 v2
    nginx.ingress.kubernetes.io/canary-by-header: "Region"
    #v2 版本权重
    nginx.ingress.kubernetes.io/canary-weight: "10"
spec:
  ingressClassName: nginx
  rules:
    - host: foo.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: nginx-v2
                port:
                  number: 80
```

```text
kubectl apply -f ingress-nginx-v2.yaml
```

```text
$ kubectl get ingress
NAME           CLASS   HOSTS             ADDRESS          PORTS   AGE
nginx          nginx   foo.example.com   192.168.80.231   80      2m27s
nginx-canary   nginx   foo.example.com                    80      17s
```


### 测试灰度发布过程

配置 hosts 文件

```text
192.168.80.231 foo.example.com
```

```text
$ kubectl get ingress
NAME           CLASS   HOSTS             ADDRESS          PORTS   AGE
nginx          nginx   foo.example.com   192.168.80.231   80      5m47s
nginx-canary   nginx   foo.example.com   192.168.80.231   80      3m37s
```

```text
$ kubectl get services -n ingress-nginx 
NAME                                 TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                      AGE
ingress-nginx-controller             NodePort    10.96.94.196    <none>        80:30909/TCP,443:31723/TCP   32m
ingress-nginx-controller-admission   ClusterIP   10.104.117.71   <none>        443/TCP                      32m
```

10% 流量走 v2

```text
while sleep 0.2;do curl http://foo.example.com:30909&& echo "";done
```

强制走 v2

```text
while sleep 0.2;do curl -H 'Region:always' http://foo.example.com:30909&& echo "";done
```

