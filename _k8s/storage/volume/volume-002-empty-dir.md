---
title: "EmptyDir"
sequence: "102"
---

## emptyDir

EmptyDir 主要用于一个 Pod 中不同的 Container 共享数据使用的。
由于只是在 Pod 内部使用，因此与其它 Volume 比较大的区别是：如果 Pod 删除了，那么 emptyDir 也会被删除。

存储介质可以是任意类型，如 SSD、磁盘或网络存储。
可以将 `emptyDir.medium` 设置为 Memory 让 K8s 使用 tmpfs （内存支持文件系统），速度比较快，但是重启 tmpfs 节点时，数据会被清除，
且设置的大小会计入到 Container 的内存限制中。

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
        - mountPath: /cache
          name: cache-volume
  volumes:
    - name: cache-volume
      emptyDir:
        sizeLimit: 500Mi
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-volume-empty-dir-pod
spec:
  containers:
    - name: my-container-1
      image: alpine:3.18.0
      command: [ "/bin/sh", "-c", "sleep 3600;" ]
      volumeMounts:
        - name: cache-volume
          mountPath: /cache1
    - name: my-container-2
      image: alpine:3.18.0
      command: [ "/bin/sh", "-c", "sleep 3600;" ]
      volumeMounts:
        - name: cache-volume
          mountPath: /cache2
  volumes:
    - name: cache-volume
      emptyDir: { }
```

```text
$ kubectl exec my-volume-empty-dir-pod --container="my-container-1" -it -- /bin/sh
$ kubectl exec my-volume-empty-dir-pod --container="my-container-2" -it -- /bin/sh
```
