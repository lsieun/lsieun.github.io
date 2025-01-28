---
title: "Kubeadm Fix"
sequence: "kubeadm-fix"
---

- [历尽艰辛的问题：Waiting for the kubelet to boot up](https://blog.csdn.net/ygd11/article/details/129277208)
- [this might take a minute or longer if the control plane images have to be pulled](https://github.com/kubernetes/kubeadm/issues/1023)
- [Link](https://raw.githubusercontent.com/kubernetes/release/v0.15.1/cmd/kubepkg/templates/latest/rpm/kubeadm/10-kubeadm.conf)
- [解决 containerd+k8s 集群搭建镜像拉取不到的问题](https://blog.csdn.net/m0_51510236/article/details/131312289)
- [kubernetes 新版本使用 kubeadm init 的超全问题解决和建议](https://blog.csdn.net/weixin_52156647/article/details/129765134)

```text
vim /lib/systemd/system/kubelet.service
```

```text
ExecStart=/usr/bin/kubelet --kubeconfig=/etc/kubernetes/kubelet.conf --config=/var/lib/kubelet/config.yaml
```

```text
$ sudo kubeadm reset
```

```text
$ sudo kubeadm init \
  --pod-network-cidr=10.244.0.0/16 \
  --image-repository registry.aliyuncs.com/google_containers
```

不是文件的问题。是我的配置过程有问题：
1.我使用的原始 service 文件是 github：kubernetes/release/v0.15.1/cmd/kubepkg/templates/latest/rpm/kubeadm/10-kubeadm.conf
2.由于网络问题不能直接在服务端 curl 这个文件，我就在浏览器打开这个文件，把文件内容复制出来了
3.然后在服务端执行

```text
cat << EOF | tee /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
# 复制的文件内容
EOF
```

来创建文件。问题就在于这个命令执行的时候，直接解析了 $ 引用的环境变量，而这些环境变量在我的命令行里都是不存在的，解析的结果是空的，
所以最终产生的文件后面的 ExecStart 只剩下了 kubelet 命令，参数全都消失了。

3.正确的方式是直接使用原始文件；或者通过 vi 命令创建文件，粘贴。如果非要手动通过 cat 命令创建，需要在 ExecStart 引用环境变量的地方用反斜杠转义 $ 符号。

```text
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.80.131:6443 --token ksnpbh.sp23kcnl5zk61rs3 \
	--discovery-token-ca-cert-hash sha256:cce7467cb7d3d06fcc1ac9982b6b4aaf923fadd332b27c34d5afaaf17d2c2951
```

```text
$ kubeadm token create --print-join-command
kubeadm join 192.168.80.131:6443 --token f2mr43.7uy6f3lkfme74qe7 --discovery-token-ca-cert-hash sha256:cce7467cb7d3d06fcc1ac9982b6b4aaf923fadd332b27c34d5afaaf17d2c2951
```

```text
kubeadm config print init-defaults > /etc/kubernetes/init-default.yaml
kubeadm config print init-defaults > ~/init-default.yaml
```

```text
### 生成 默认的初始化配置文件
kubeadm config print init-defaults > /etc/kubernetes/init-default.yaml
cat /etc/kubernetes/init-default.yaml | grep imageRepository  ### 查看默认镜像库
### 将默认的镜像仓库 registry.k8s.io 修改成 k8simage( 之前在 docker 官方镜像库筛选出来的)
sed -i 's#registry.k8s.io#k8simage#' /etc/kubernetes/init-default.yaml 
### 将 配置文件 init-default.yaml  里面  advertiseAddress: 1.2.3.4  中 的 ip 地址 改成你自己的 ip 地址 
sed -i 's#advertiseAddress: 1.2.3.4#advertiseAddress: 10.0.2.5#' /etc/kubernetes/init-default.yaml
```

```text
### 重置 kubeadm
kubeadm reset 
### 使用配置文件 安装并初始化 Master 节点
kubeadm init --config="/etc/kubernetes/init-default.yaml" 

```

```text
### 生成 containerd 的默认配置文件
containerd config default > /etc/containerd/config.toml 
### 查看 sandbox 的默认镜像仓库在文件中的第几行 
cat /etc/containerd/config.toml | grep -n "sandbox_image"  
### 使用 vim 编辑器 定位到 sandbox_image，将 仓库地址修改成 k8simage/pause:3.6
vim /etc/containerd/config.toml  
sandbox_image = "k8simage/pause:3.6"  
### 重启 containerd 服务  
systemctl daemon-reload
systemctl restart containerd.service

```

```text
### 重置 
kubeadm reset
### 初始化
kubeadm init --config="/etc/kubernetes/init-default.yaml" 

```
