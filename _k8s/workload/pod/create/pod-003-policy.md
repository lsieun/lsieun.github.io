---
title: "Policy: 重启策略、镜像拉取策略"
sequence: "103"
---

## 重启策略

Pod 的重启策略有 3 种，如下：

- `Always`：容器失效时，自动重启该容器，这是默认值
- `OnFailure`：容器停止运行且退出码不为 `0` 时重启
- `Never`：不论状态为何，都不重启该容器

重启策略适用于 Pod 对象中的所有容器，

- 首次需要重启的容器，将在其需要时立即进行重启，
- 随后再次需要重启的操作将由 kubelet 延迟一段时间后进行，且反复的重启操作的延迟时长为 10s，20s，40s，80s，160s，300s。300s 是最大延迟时长

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
  # 定义重启策略
  restartPolicy: Never
```

## 镜像拉取策略

- `IfNotPresent`：默认值，镜像在宿主机上不存在时才拉取（稳定的版本）
- `Always`：每次创建 Pod 都会重新拉取一次镜像（不断变更的版本）
- `Never`：Pod 永远不会主动拉取这个镜像

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
spec:
  containers:
    - name: nginx-container
      image: nginx:1.25.0-bullseye
      # 镜像拉取策略
      imagePullPolicy: IfNotPresent
      ports:
        - containerPort: 80
  restartPolicy: Never
```

## Reference

- [How to Force Kubernetes to Re-Pull an Image](https://www.baeldung.com/ops/kubernetes-pull-image-again)
