---
title: "Kubeadm + Containerd (CentOS 7 Minimal 2207)"
sequence: "kubeadm-centos7-mini-2207-containerd"
---

## Containerd

```text
# Configure containerd and start service
$ sudo mkdir -p /etc/containerd
$ containerd config default | sudo tee /etc/containerd/config.toml >/dev/null 2>&1
```

```text
$ containerd config default | sudo tee /etc/containerd/config.toml >/dev/null 2>&1
$ sudo sed -i 's/SystemdCgroup \= false/SystemdCgroup \= true/g' /etc/containerd/config.toml
```

```text
# 将下面的语句
sandbox_image = "registry.k8s.io/pause:3.6"
# 替换成
sandbox_image = "registry.aliyuncs.com/google_containers/pause:3.9"
```

Restart and enable containerd service

```text
$ sudo systemctl restart containerd
$ systemctl status containerd
```

```text
$ sudo kubeadm config images list
```

```text
$ sudo kubeadm config images pull \
	  --image-repository registry.aliyuncs.com/google_containers \
	  --v=5
```

## Init

```text
$ sudo kubeadm init \
      --pod-network-cidr=10.244.0.0/16 \
      --image-repository registry.aliyuncs.com/google_containers \
      --v=5
```
