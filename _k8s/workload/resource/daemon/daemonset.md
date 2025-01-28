---
title: "DaemonSet"
sequence: "daemonset"
---

DaemonSet 为每个匹配的 Node 都部署一个守护进程。

> 注意：是 Node，不是 Pod。

## 配置文件

File: `fluentd-ds.yaml`

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
spec:
  selector:
    matchLabels:
      app: logging
  template:
    metadata:
      name: fluentd
      labels:
        app: logging
        id: fluentd
    spec:
      containers:
        - name: fluentd-es
          image: enissay722/fluentd-elasticsearch:1.16-1
          env:
            - name: FLUENTD_ARGS
              value: -qq
          volumeMounts:
            - name: containers
              mountPath: /var/lib/docker/containers
            - name: varlog
              mountPath: /varlog
      volumes:
        - hostPath:
            path: /var/lib/docker/containers
          name: containers
        - hostPath:
            path: /var/log
          name: varlog
```

```yaml
kubectl create -f fluentd-ds.yaml
```

```yaml
$ kubectl get daemonset
$ kubectl get ds
```

## 指定 Node 节点

DaemonSet 会忽略 Node 的 unschedulable 状态，有两种方式来指定 Pod 只运行在指定的 Node 节点上：

- `nodeSelector`：只调试到匹配指定 label 的 Node 上
- `nodeAffinity`：功能更丰富的 Node 选择器，比如支持集合操作
- `podAffinity`：调度到满足条件的 Pod 所在的 Node 上

### nodeSelector

```yaml
$ kubectl get nodes --show-labels=true
$ kubectl label node worker01.k8s.lab type=microservices
```

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
spec:
  selector:
    matchLabels:
      app: logging
  template:
    metadata:
      name: fluentd
      labels:
        app: logging
        id: fluentd
    spec:
      nodeSelector:               # 这里是 NodeSelector
        type: microservices
      containers:
        - name: fluentd-es
          image: enissay722/fluentd-elasticsearch:1.16-1
          env:
            - name: FLUENTD_ARGS
              value: -qq
          volumeMounts:
            - name: containers
              mountPath: /var/lib/docker/containers
            - name: varlog
              mountPath: /varlog
      volumes:
        - hostPath:
            path: /var/lib/docker/containers
          name: containers
        - hostPath:
            path: /var/log
          name: varlog
```

### nodeAffinity

### podAffinity



