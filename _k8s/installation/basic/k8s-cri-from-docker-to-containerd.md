---
title: "K8s CRI: From Docker to Containerd"
sequence: "cri"
---

## 思路一

很简单，就三条命令

```text
containerd config default > /etc/containerd/config.toml
sed -i 's/disabled_plugins = \["cri"\]/disabled_plugins = [""]/' /etc/containerd/config.toml
systemctl restart containerd
```


## 思路二

逐个节点进行切换，切换思路如下： 1.  2.  3.   4.  5.    6.  7.   8.  9.  10. 

```text
kubectl drain <node> --ignore-daemonsets --delete-emptydir-data # 驱逐节点上的 pod

systemctl stop kubelet # 停止 kubelet

id=$(docker ps | grep k8s_ | awk 'NR>1{print $1}') # 删除 k8s 创建的 docker 容器

for i in $id; do docker stop $i && docker rm $i; done

systemct stop docker # 停止 docker
```

向文件 /etc/kubernetes/kubelet.env 添加 kubelet 启动参数

```text
--container-runtime-endpoint=unix:///run/containerd/containerd.sock
```

即 cri 指定 containerd

```text
containerd config default > /etc/containerd/config.toml # 生成 containerd 默认配置
```

修改 containerd 配置中的 pause 镜像

```text
sandbox_image = "registry.cn-hangzhou.aliyuncs.com/google_containers/pause:3.7"
```

```text
systemctl restart containerd # 重启 containerd
systemctl start docker # 启动 docker（非必须）
systemctl start kubelet # 启动 kubelet
```
