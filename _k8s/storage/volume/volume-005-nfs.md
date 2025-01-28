---
title: "NFS"
sequence: "105"
---

能够将 NFS （网络文件系统）挂载到 Pod 中，不像 emptyDir 那样在删除 Pod 的同时也会被删除。

NFS 卷的内容在删除 Pod 时，会被保留，卷只是被卸载，这意味着 NFS 卷可以被预先填充数据，并且这些数据可以在 Pod 之间共享。

## 安装 NFS

安装 NFS：

```text
$ sudo yum -y install nfs-utils
```

启动 NFS：

```text
$ sudo systemctl start nfs-server
```

查看 NFS 版本：

```text
$ sudo cat /proc/fs/nfsd/versions
-2 +3 +4 +4.1 +4.2
```

该文件中列出了服务器支持的 NFS 版本。每个版本都以 `+` 或 `-` 的形式表示，表示是否启用了该版本。
例如，`+2 +3 -4` 表示服务器启用了 `NFSv2` 和 `NFSv3`，但未启用 `NFSv4`。

查看端口：

```text
netstat -nltp
```

默认情况下，NFS 版本 2、3 和 4 的端口都是 `2049`。

创建共享目录：

```text
$ sudo mkdir -p /data/nfs/{rw,ro}
$ cd /data/nfs
```

设置共享目录 export：

```text
$ sudo vi /etc/exports
```

```text
/data/nfs/rw 192.168.80.0/24(rw,sync,no_subtree_check,no_root_squash)
/data/nfs/ro 192.168.80.0/24(ro,sync,no_subtree_check,no_root_squash)
```

重新加载：

```text
$ exportfs -f
$ sudo systemctl reload nfs-server
```

到其它测试节点安装 `nfs-utils` 并加载测试：

```text
$ sudo mkdir -p /mnt/nfs/{rw,ro}
$ sudo mount -t nfs 192.168.80.131:/data/nfs/rw /mnt/nfs/rw
$ sudo mount -t nfs 192.168.80.131:/data/nfs/ro /mnt/nfs/ro
```

## 配置文件

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-volume-nfs-rw-pod
spec:
  containers:
    - name: my-nginx-container
      image: nginx:1.25.0-bullseye
      volumeMounts:
        - mountPath: /my-nfs-data
          name: test-volume
  volumes:
    - name: test-volume
      nfs:
        server: 192.168.80.131
        path: /data/nfs/rw
        readOnly: false
```

```text
$ kubectl create -f my-volume-nfs-rw-pod.yaml
```

```text
$ kubectl exec my-volume-nfs-rw-pod -it -- /bin/bash
```


