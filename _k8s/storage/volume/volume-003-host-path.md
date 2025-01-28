---
title: "HostPath"
sequence: "103"
---

## HostPath

HostPath 是将节点上的文件或目录挂载到 Pod 上，此时该目录会变成持久化存储目录。
即使 Pod 被删除后重启，也可以重新加载到该目录，该目录下的文件不会丢失。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
    - image: registry.k8s.io/test-webserver
      name: test-container
      volumeMounts:
        - mountPath: /test-pd
          name: test-volume
  volumes:
    - name: test-volume
      hostPath:
        # directory location on host
        path: /data
        # this field is optional
        type: Directory
```

In addition to the required `path` property, you can optionally specify a `type` for a `hostPath` volume.

The supported values for field `type` are:

| Value               | Behavior                                                                                                                                                               |
|:--------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|                     | Empty string (default) is for backward compatibility, which means that no checks will be performed before mounting the `hostPath` volume.                              |
| `DirectoryOrCreate` | If nothing exists at the given path, an empty directory will be created there as needed with permission set to 0755, having the same group and ownership with Kubelet. |
| `Directory`         | A directory must exist at the given path                                                                                                                               |
| `FileOrCreate`      | If nothing exists at the given path, an empty file will be created there as needed with permission set to 0644, having the same group and ownership with Kubelet.      |
| `File`              | A file must exist at the given path                                                                                                                                    |
| `Socket`            | A UNIX socket must exist at the given path                                                                                                                             |
| `CharDevice`        | A character device must exist at the given path                                                                                                                        |
| `BlockDevice`       | A block device must exist at the given path                                                                                                                            |


## 示例一

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-volume-host-path-pod
spec:
  containers:
    - name: my-nginx-container
      image: nginx:1.25.0-bullseye
      volumeMounts:
        - name: my-volume
          mountPath: /opt/my-host-dir
  volumes:
    - name: my-volume
      hostPath:
        path: /home/devops
        type: Directory
```

## 示例二

登录 `worker01.k8s.lab` 上执行：

```text
$ sudo mkdir -p /opt/nginx/{html,logs}
$ cd /opt/nginx/html/
```

```text
$ sudo cat > test.html <<-'EOF'
  <h1>I'm test page!</h1>
EOF
```

回到 `master01.k8s.lab` 上：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-nginx-0
spec:
  nodeName: worker01.k8s.lab
  containers:
    - name: ng0
      image: nginx:1.25.0-bullseye
      ports:
        - containerPort: 80
          hostPort: 8001
      volumeMounts:
        - name: vol-html
          mountPath: /usr/share/nginx/html
        - name: vol-logs
          mountPath: /var/log/nginx
  volumes:
    - name: vol-html
      hostPath:
        path: /opt/nginx/html
    - name: vol-logs
      hostPath:
        path: /opt/nginx/logs/ng0
---
apiVersion: v1
kind: Pod
metadata:
  name: pod-nginx-1
spec:
  nodeName: worker01.k8s.lab
  containers:
    - name: ng1
      image: nginx:1.25.0-bullseye
      ports:
        - containerPort: 80
          hostPort: 8002
      volumeMounts:
        - name: vol-html
          mountPath: /usr/share/nginx/html
        - name: vol-logs
          mountPath: /var/log/nginx
  volumes:
    - name: vol-html
      hostPath:
        path: /opt/nginx/html
    - name: vol-logs
      hostPath:
        path: /opt/nginx/logs/ng1
```

```text
$ kubectl apply -f pod-nginx.yaml
```

```text
$ curl worker01.k8s.lab:8001/test.html
<h1>I'm test page!</h1>
$ curl worker01.k8s.lab:8002/test.html
<h1>I'm test page!</h1>
```
