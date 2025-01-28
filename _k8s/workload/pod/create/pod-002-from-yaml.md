---
title: "Pod From YAML"
sequence: "102"
---



## 示例

File: nginx-pod.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
spec:
  containers:
    - name: nginx-container
      image: nginx:1.25.0-bullseye
      ports:
        - containerPort: 80
```

应用

```text
kubectl apply -f /etc/k8s/nginx-pod.yaml
```

移除：

```text
kubectl delete -f /etc/k8s/nginx-pod.yaml
```

查看已部署的 Nginx 节点：

```text
kubectl get pods -A -o wide
```

直接删除 Pod（不推荐）：

```text
kubectl delete pods nginx-pod
```

查看指定 Pod 明细：

```text
kubectl describe pods nginx-pod
```

查看输出的日志：

```text
kubectl logs nginx-pod
kubectl logs -f nginx-pod
```

```text
$ crictl ps
$ crictl --runtime-endpoint unix:///run/cri-dockerd.sock ps
```

File: `pod.kiada.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: kiada
spec:
  containers:
  - name: kiada
    image: lsieun/kiada:0.1
    imagePullPolicy: Always
    ports:
    - containerPort: 8080
```

```text
$ kubectl apply -f pod.kiada.yaml 
pod/kiada created
```

### 查看

```text
$ kubectl get pod kiada -o yaml
```


