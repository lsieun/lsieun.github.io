---
title: "污点（Taint）与容忍度（Toleration）"
sequence: "103"
---

## 污点和容忍度

节点亲和性 是 Pod 的一种属性，它使 Pod 被吸引到一类特定的节点 （这可能出于一种偏好，也可能是硬性要求）。

- 污点（Taint） 则相反——它使节点能够排斥一类特定的 Pod。
- 容忍度（Toleration） 是应用于 Pod 上的。容忍度允许调度器调度带有对应污点的 Pod。 容忍度允许调度但并不保证调度：作为其功能的一部分， 调度器也会评估其他参数。
- 污点（Taint）和容忍度（Toleration）相互配合，可以用来避免 Pod 被分配到不合适的节点上。 每个节点上都可以应用一个或多个污点，这表示对于那些不能容忍这些污点的 Pod， 是不会被该节点接受的。

## 示例一：强制踢出

```text
$ kubectl taint nodes worker01.k8s.lab app=nginx:NoSchedule
$ kubectl taint nodes worker02.k8s.lab app=nginx:NoSchedule

$ kubectl taint nodes worker02.k8s.lab app=nginx:PreferNoSchedule
$ kubectl taint nodes worker02.k8s.lab app=nginx:NoExecute

$ kubectl taint nodes worker01.k8s.lab app=nginx:NoSchedule-
$ kubectl taint nodes worker02.k8s.lab app=nginx:PreferNoSchedule-
$ kubectl taint nodes worker02.k8s.lab app=nginx:NoExecute-
```

Taint 的策略有三种：

- `NoSchedule`：POD 不会被调度到标记为 taints 节点。
- `PreferNoSchedule`：NoSchedule 的软策略版本。
- `NoExecute`：该选项意味著一旦 Taint 生效，如该节点内正在运行的 POD 没有对应 Tolerate 设置，会直接被逐出。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  containers:
    - name: nginx
      image: nginx
      imagePullPolicy: IfNotPresent
```

```text
kubectl apply -f pod-nginx.yaml
```

## 设置容忍度

设置容忍度，允许 `app=nginx` 部署在 `app=nginx:NoSchedule` 的节点上

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  containers:
    - name: nginx
      image: nginx
      imagePullPolicy: IfNotPresent
  tolerations:
    - key: "app"
      operator: "Equal"
      value: "nginx"
      effect: "NoSchedule"
```

```text
$ kubectl apply -f pod-nginx.yaml
```

