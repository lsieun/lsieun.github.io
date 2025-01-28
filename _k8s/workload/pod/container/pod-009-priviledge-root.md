---
title: "Pod + Root"
sequence: "109"
---

在 Kubernetes 中，要让 Pod/Container 内的 root 用户拥有主机上 root 权限，可以通过设置特定的安全上下文配置来实现。以下是一个示例的 YAML 文件：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
spec:
  securityContext:    # A
    runAsUser: 0      # A 设置容器内的 root 用户
  containers:
    - name: nginx-container
      image: nginx:1.25.0-bullseye
      securityContext:      # B
        privileged: true    # B 开启容器的特权模式
      volumeMounts:
        - name: vol-logs
          mountPath: /var/log/nginx
  volumes:
    - name: vol-logs
      hostPath:
        path: /opt/logs
```

在上面的示例中，`securityContext` 部分用于设置容器的安全上下文。
`runAsUser` 字段将容器内的用户设置为 `root`（`UID` 为 `0`），
`privileged` 字段将容器设置为特权模式，允许 root 用户拥有主机上的权限。

请注意，在使用特权模式时需要特别小心，因为容器内的 `root` 用户具有更高的权限，可能导致安全风险。确保只在必要时使用特权模式，并遵循最佳安全实践。

保存以上内容为 `nginx-pod.yaml` 文件后，可以使用以下命令创建该 Pod：

```yaml
$ sudo mkdir -p /opt/logs
$ kubectl create -f nginx-pod.yaml
```
