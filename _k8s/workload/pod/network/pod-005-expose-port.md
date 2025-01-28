---
title: "Pod 如何对外暴露端口"
sequence: "105"
---

## 利用 hostNetwork 选项暴露端口

Host 可一次性暴露多个端口，且与 Container 端口保持一致，但可能会出现端口冲突。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod-1
spec:
  hostNetwork: true
  nodeName: worker01.k8s.lab
  containers:
    - name: nginx-container-1
      image: nginx:1.25.0-bullseye
      ports:
        # Nginx 容器默认对外暴露 80 端口
        - containerPort: 80
---
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod-2
spec:
  hostNetwork: true
  nodeName: worker02.k8s.lab
  containers:
    - name: nginx-container-2
      image: nginx:1.25.0-bullseye
      ports:
        - containerPort: 80
```

```text
$ kubectl apply -f nginx-pod.yaml 
pod/nginx-pod-0 created
pod/nginx-pod-1 created

$ kubectl get pods -o wide
NAME          READY   STATUS    RESTARTS   AGE   IP               NODE               NOMINATED NODE   READINESS GATES
nginx-pod-0   1/1     Running   0          10s   192.168.80.231   worker01.k8s.lab   <none>           <none>
nginx-pod-1   1/1     Running   0          10s   192.168.80.232   worker02.k8s.lab   <none>           <none>

$ curl 192.168.80.231:80
$ curl 192.168.80.232:80
```

浏览器访问：

```text
http://192.168.80.231/
http://192.168.80.232/
```

```text
$ kubectl delete -f nginx-pod.yaml 
pod "nginx-pod-1" deleted
pod "nginx-pod-2" deleted
```

## 利用 hostPort 选项暴露端口

需要手动声明对外暴露的端口号

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod-1
spec:
  nodeName: worker01.k8s.lab
  containers:
    - name: nginx-container-1
      image: nginx:1.25.0-bullseye
      # 容器内部暴露的端口号，即 expose
      ports:
        # Nginx 容器默认对外暴露 80 端口
        - containerPort: 80
          hostPort: 8000
        - containerPort: 443
          hostPort: 8443
---
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod-2
spec:
  nodeName: worker02.k8s.lab
  containers:
    - name: nginx-container-2
      image: nginx:1.25.0-bullseye
      ports:
        - containerPort: 80
          hostPort: 8000
        - containerPort: 443
          hostPort: 8443
```

```text
$ kubectl apply -f nginx-pod.yaml
```

```text
$ curl 192.168.80.231:8000
$ curl 192.168.80.232:8000
```

```text
$ kubectl delete -f nginx-pod.yaml 
pod "nginx-pod-1" deleted
pod "nginx-pod-2" deleted
```
