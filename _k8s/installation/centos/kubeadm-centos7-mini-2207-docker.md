---
title: "Kubeadm + Docker (CentOS 7 Minimal 2207)"
sequence: "kubeadm-centos7-mini-2207-docker"
---

## 安装 CentOS7 

```text
CentOS-7-x86_64-Minimal-2207-02_2.iso
```

- root/root
- devops/123456

```text
$ ssh root@192.168.80.132
```

```text
net-tools lszrz
```

## Docker

安装一些依赖：

```text
$ sudo yum -y install yum-utils device-mapper-persistent-data lvm2
```

```text
$ sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
$ sudo sed -i 's+https://download.docker.com+https://mirrors.tuna.tsinghua.edu.cn/docker-ce+' /etc/yum.repos.d/docker-ce.repo
```

```text
$ sudo yum makecache fast
```

```text
$ sudo yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

```text
[devops@localhost ~]$ docker compose version
Docker Compose version v2.18.1

[devops@localhost ~]$ docker version
Client: Docker Engine - Community
 Version:           24.0.2
 API version:       1.43
 Go version:        go1.20.4
 Git commit:        cb74dfc
 Built:             Thu May 25 21:55:21 2023
 OS/Arch:           linux/amd64
 Context:           default
Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?

[devops@localhost ~]$ systemctl status docker
● docker.service - Docker Application Container Engine
   Loaded: loaded (/usr/lib/systemd/system/docker.service; disabled; vendor preset: disabled)
   Active: inactive (dead)
     Docs: https://docs.docker.com
```

### 修改 Docker 配置

```text
$ sudo vi /etc/docker/daemon.json
```

```json
{
  "registry-mirrors": [
    "https://hub-mirror.c.163.com"
  ],
  "debug": true
}
```

Start Docker.

```text
$ sudo systemctl start docker
```

Verify that the Docker Engine installation is successful by running the `hello-world` image.

```text
$ sudo docker run hello-world
```

### Post Installation

### 操作

第一步，创建 `docker` 组：

```text
$ sudo groupadd docker
```

第二步，将当前用户添加到 `docker` 组：

```text
$ sudo usermod -aG docker $USER
```

第三步，刷新权限:

```text
$ newgrp docker
```

如果不生效，可以登出，再进行登录。

第四步，验证：

```text
$ docker run hello-world
```

### 开机启动

开机启动：

```text
$ sudo systemctl enable docker.service
$ sudo systemctl enable containerd.service
```

### 关机和快照

## Kubeadm

```text
$ sudo tee /etc/yum.repos.d/kubernetes.repo <<EOF
[kubernetes]
name=kubernetes
baseurl=https://mirrors.tuna.tsinghua.edu.cn/kubernetes/yum/repos/kubernetes-el7-\$basearch
enabled=1
EOF
```

Then install required packages.

```text
$ sudo yum makecache
$ sudo yum -y install epel-release vim git curl wget
$ sudo yum -y --nogpgcheck install kubelet kubeadm kubectl --disableexcludes=kubernetes
```

```text
$ sudo systemctl enable --now kubelet
```

```text
$ systemctl status kubelet
● kubelet.service - kubelet: The Kubernetes Node Agent
   Loaded: loaded (/usr/lib/systemd/system/kubelet.service; enabled; vendor preset: disabled)
  Drop-In: /usr/lib/systemd/system/kubelet.service.d
           └─ 10-kubeadm.conf
   Active: activating (auto-restart) (Result: exit-code) since Thu 2023-06-29 09:07:43 CST; 670ms ago
     Docs: https://kubernetes.io/docs/
  Process: 1675 ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS (code=exited, status=1/FAILURE)
 Main PID: 1675 (code=exited, status=1/FAILURE)
```

```text
$ kubeadm version
$ kubectl version --output=yaml
```

## Linux 配置

### Disable SELinux

If you have SELinux in enforcing mode, turn it off or use Permissive mode.

```text
$ sudo setenforce 0
$ sudo sed -i 's/^SELINUX=.*/SELINUX=permissive/g' /etc/selinux/config
```

### Turn off swap.

```text
$ sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
$ sudo swapoff -a
```

### Configure sysctl

```text
$ sudo modprobe overlay
$ sudo modprobe br_netfilter

$ sudo tee /etc/sysctl.d/kubernetes.conf <<EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF

$ sudo sysctl --system
```

### Configure Firewalld

I recommend you disable firewalld on your nodes:

```text
$ sudo systemctl disable --now firewalld
```

## Docker

```text
$ sudo vi /etc/docker/daemon.json
```

```json
{
  "exec-opts": [
    "native.cgroupdriver=systemd"
  ]
}
```

```text
$ cat /etc/docker/daemon.json
{
  "exec-opts": [
    "native.cgroupdriver=systemd"
  ],
  "insecure-registries": [
    "docker.lan.net:8082",
    "docker.lan.net:8083"
  ],
  "registry-mirrors": [
    "https://hub-mirror.c.163.com"
  ],
  "debug": true
}
```

```text
# Create daemon json config file
$ sudo tee /etc/docker/daemon.json <<EOF
{
  "exec-opts": [
    "native.cgroupdriver=systemd"
  ],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "registry-mirrors": [
    "https://hub-mirror.c.163.com"
  ],
  "debug": true
}
EOF
```

```json
{
  "exec-opts": [
    "native.cgroupdriver=systemd"
  ],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "insecure-registries": [
    "docker.lan.net:8082",
    "docker.lan.net:8083"
  ],
  "registry-mirrors": [
    "https://hub-mirror.c.163.com"
  ],
  "debug": true
}
```

```text
# Start and enable Services
$ sudo systemctl daemon-reload
$ sudo systemctl restart docker
$ sudo systemctl enable docker
```

```text
$ docker run hello-world
```

## Install cri-dockerd on Linux

```text
$ sudo yum -y install git wget curl
```

```text
VER=$(curl -s https://api.github.com/repos/Mirantis/cri-dockerd/releases/latest|grep tag_name | cut -d '"' -f 4|sed 's/v//g')
echo $VER
```

```text
wget https://github.com/Mirantis/cri-dockerd/releases/download/v${VER}/cri-dockerd-${VER}.amd64.tgz
tar xvf cri-dockerd-${VER}.amd64.tgz
```

```text
$ sudo mv cri-dockerd/cri-dockerd /usr/local/bin/
```

```text
$ cri-dockerd --version
```

```text
wget https://raw.githubusercontent.com/Mirantis/cri-dockerd/master/packaging/systemd/cri-docker.service
wget https://raw.githubusercontent.com/Mirantis/cri-dockerd/master/packaging/systemd/cri-docker.socket
$ sudo mv cri-docker.socket cri-docker.service /etc/systemd/system/
$ sudo sed -i -e 's,/usr/bin/cri-dockerd,/usr/local/bin/cri-dockerd,' /etc/systemd/system/cri-docker.service
```

```text
$ sudo kubeadm config images list
```

```text
$ cri-dockerd --help
```

```text
$ sudo vi /etc/systemd/system/cri-docker.service
```

```text
--pod-infra-container-image=registry.aliyuncs.com/google_containers/pause:3.9
```

```text
ExecStart=/usr/local/bin/cri-dockerd --container-runtime-endpoint fd:// --pod-infra-container-image=registry.aliyuncs.com/google_containers/pause:3.9 --network-plugin=cni
```

```text
$ sudo sed -ie 's#ExecStart=.*#ExecStart=/usr/local/bin/cri-dockerd --pod-infra-container-image=registry.aliyuncs.com/google_containers/pause:3.9#g' /etc/systemd/system/cri-docker.service
# 我省略了 --network-plugin
$ sudo sed -ie 's#ExecStart=.*#ExecStart=/usr/local/bin/cri-dockerd --network-plugin=cni --pod-infra-container-image=registry.aliyuncs.com/google_containers/pause:3.9#g' /etc/systemd/system/cri-docker.service
```

```text
$ sudo systemctl daemon-reload
$ sudo systemctl enable cri-docker.service
$ sudo systemctl enable --now cri-docker.socket
```

```text
$ systemctl status cri-docker.socket
```

```text
$ sudo kubeadm config images pull \
      --cri-socket unix:///run/cri-dockerd.sock \
	  --image-repository registry.aliyuncs.com/google_containers \
	  --v=5
```

```text
[devops@localhost ~]$ docker images
REPOSITORY                                                        TAG       IMAGE ID       CREATED        SIZE
registry.aliyuncs.com/google_containers/kube-apiserver            v1.27.3   08a0c939e61b   2 weeks ago    121MB
registry.aliyuncs.com/google_containers/kube-proxy                v1.27.3   5780543258cf   2 weeks ago    71.1MB
registry.aliyuncs.com/google_containers/kube-controller-manager   v1.27.3   7cffc01dba0e   2 weeks ago    112MB
registry.aliyuncs.com/google_containers/kube-scheduler            v1.27.3   41697ceeb70b   2 weeks ago    58.4MB
registry.aliyuncs.com/google_containers/coredns                   v1.10.1   ead0a4a53df8   4 months ago   53.6MB
registry.aliyuncs.com/google_containers/etcd                      3.5.7-0   86b6af7dd652   5 months ago   296MB
registry.aliyuncs.com/google_containers/pause                     3.9       e6f181688397   8 months ago   744kB
```

### Overriding the sandbox (pause) image

- [Link](https://kubernetes.io/docs/setup/production-environment/container-runtimes/#override-pause-image-cri-dockerd-mcr)

The `cri-dockerd` adapter accepts a command line argument for specifying
**which container image** to use as the **Pod infrastructure container** (“pause image”).
The command line argument to use is `--pod-infra-container-image`.

### containerd

安装 docker 或者 containerd 之后，默认在/etc/containerd/config.toml 禁用了 CRI，需要注释掉 `disabled_plugins = ["cri"]`；
否则，执行 kubeadm 进行部署时会报错：

```text
# disabled_plugins = ["cri"]
```

```text
$ sudo systemctl daemon-reload
$ sudo systemctl restart containerd docker
```

## Init

```text
$ sudo kubeadm init \
    --pod-network-cidr=10.244.0.0/16 \
    --cri-socket unix:///run/cri-dockerd.sock \
    
```

```text
$ sudo kubeadm init \
      --pod-network-cidr=10.244.0.0/16 \
      --cri-socket unix:///run/cri-dockerd.sock \
      --image-repository registry.aliyuncs.com/google_containers \
      --v=5
```



## Clone VM

| Server Role | Server Hostname  | Spec           | IP Address     |
|-------------|------------------|----------------|----------------|
| Master Node | master01.k8s.lab | 4GB RAM 2vcpus | 192.168.80.131 |
| Worker Node | worker01.k8s.lab | 4GB RAM 2vcpus | 192.168.80.231 |
| Worker Node | worker02.k8s.lab | 4GB RAM 2vcpus | 192.168.80.232 |

```text
$ sudo rm -rf /etc/machine-id
$ sudo dbus-uuidgen --ensure=/etc/machine-id
```

```text
$ sudo hostnamectl set-hostname master01.k8s.lab
$ sudo hostnamectl set-hostname worker01.k8s.lab
$ sudo hostnamectl set-hostname worker02.k8s.lab
```

```text
$ sudo tee -a /etc/hosts <<EOF
192.168.80.131 master01.k8s.lab
192.168.80.231 worker01.k8s.lab
192.168.80.232 worker02.k8s.lab
EOF
```

```text
$ sudo vi /etc/sysconfig/network-scripts/ifcfg-ens32
```

```text
DEVICE="ens32"
TYPE="Ethernet"
ONBOOT="yes"             # 是否开机启用
BOOTPROTO="static"       #IP 地址设置为静态
IPADDR=192.168.80.200
NETMASK=255.255.255.0
GATEWAY=192.168.80.2
DNS1=223.5.5.5
DNS2=223.6.6.6
```

```text
$ sudo systemctl restart network
```

## K8s Cluster

### Master Node

```text
$ sudo kubeadm init \
      --apiserver-advertise-address=192.168.80.131 \
      --pod-network-cidr=10.244.0.0/16 \
      --node-name master01.k8s.lab \
      --control-plane-endpoint=master01.k8s.lab \
      --upload-certs \
      --image-repository registry.aliyuncs.com/google_containers \
      --cri-socket unix:///run/cri-dockerd.sock \
      --v=5
```

```text
$ sudo kubeadm reset --cri-socket unix:///run/cri-dockerd.sock
```

```text
$ mkdir -p $HOME/.kube
$ sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
$ sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

```text
$ kubectl cluster-info
```

```text
$ kubectl get nodes
NAME               STATUS     ROLES           AGE   VERSION
master01.k8s.lab   NotReady   control-plane   52s   v1.27.3
```

```text
$ kubectl get pods -A
NAMESPACE     NAME                                       READY   STATUS    RESTARTS   AGE
kube-system   coredns-7bdc4cb885-8whlw                   0/1     Pending   0          2m12s
kube-system   coredns-7bdc4cb885-8wqzm                   0/1     Pending   0          2m12s
kube-system   etcd-master01.k8s.lab                      1/1     Running   0          2m26s
kube-system   kube-apiserver-master01.k8s.lab            1/1     Running   0          2m27s
kube-system   kube-controller-manager-master01.k8s.lab   1/1     Running   0          2m26s
kube-system   kube-proxy-js9ht                           1/1     Running   0          2m12s
kube-system   kube-scheduler-master01.k8s.lab            1/1     Running   0          2m26s
```

### 安装网络插件

#### Calico

In this guide we'll use Calico. You can choose any other supported network plugins.

```text
VER=$(curl -s https://api.github.com/repos/projectcalico/calico/releases/latest|grep tag_name|cut -d '"' -f 4)
echo $VER
```

```text
wget https://raw.githubusercontent.com/projectcalico/calico/${VER}/manifests/tigera-operator.yaml
$ kubectl create -f tigera-operator.yaml
```

```text
$ kubectl create -f tigera-operator.yaml
namespace/tigera-operator created
customresourcedefinition.apiextensions.k8s.io/bgpconfigurations.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/bgpfilters.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/bgppeers.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/blockaffinities.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/caliconodestatuses.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/clusterinformations.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/felixconfigurations.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/globalnetworkpolicies.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/globalnetworksets.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/hostendpoints.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/ipamblocks.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/ipamconfigs.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/ipamhandles.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/ippools.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/ipreservations.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/kubecontrollersconfigurations.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/networkpolicies.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/networksets.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/apiservers.operator.tigera.io created
customresourcedefinition.apiextensions.k8s.io/imagesets.operator.tigera.io created
customresourcedefinition.apiextensions.k8s.io/installations.operator.tigera.io created
customresourcedefinition.apiextensions.k8s.io/tigerastatuses.operator.tigera.io created
serviceaccount/tigera-operator created
clusterrole.rbac.authorization.k8s.io/tigera-operator created
clusterrolebinding.rbac.authorization.k8s.io/tigera-operator created
deployment.apps/tigera-operator created
```

```text
$ wget https://raw.githubusercontent.com/projectcalico/calico/${VER}/manifests/custom-resources.yaml

```

```text
$ vi custom-resources.yaml
```

```text
spec:
  # Configures Calico networking.
  calicoNetwork:
    # Note: The ipPools section cannot be modified post-install.
    ipPools:
    - blockSize: 26
      cidr: 192.168.0.0/16               # 修改这里：将 192.168.0.0/16 修改为 10.244.0.0/16
      encapsulation: VXLANCrossSubnet
      natOutgoing: Enabled
      nodeSelector: all()
```

```text
$ kubectl create -f custom-resources.yaml
```

```text
$ kubectl create -f custom-resources.yaml
installation.operator.tigera.io/default created
apiserver.operator.tigera.io/default created
```

```text
$ kubectl get pods -n calico-system -w
```

```text
$ kubectl get nodes
```

#### flannel

```text
kubectl apply -f kube-flannel.yml
```

### 测试

```text
$ kubectl get pods -A -w
```

```text
kubectl get nodes -o wide
```

## 加入

```text
$ sudo kubeadm join master01.k8s.lab:6443 --token 95b3if.iu7qumbd76ggsanf \
	--discovery-token-ca-cert-hash sha256:ace74c0c1dfa6425808e08a2ce41e16869a32cc4f6b1cf6260669b7cfdbbcceb \
	--cri-socket unix:///run/cri-dockerd.sock \
    --v=5
```

## 镜像

```text
docker pull tigera/operator:v1.30.4
docker pull calico/typha:v3.26.1
docker pull calico/kube-controllers:v3.26.1
docker pull calico/apiserver:v3.26.1
docker pull calico/cni:v3.26.1
docker pull calico/node-driver-registrar:v3.26.1
docker pull calico/csi:v3.26.1
docker pull calico/pod2daemon-flexvol:v3.26.1
docker pull calico/node:v3.26.1
```

```text
docker pull "docker.lan.net:8083/tigera/operator:v1.30.4"
docker tag "docker.lan.net:8083/tigera/operator:v1.30.4" "quay.io/tigera/operator:v1.30.4"
docker rmi "docker.lan.net:8083/tigera/operator:v1.30.4"
docker pull "docker.lan.net:8083/calico/typha:v3.26.1"
docker tag "docker.lan.net:8083/calico/typha:v3.26.1" "calico/typha:v3.26.1"
docker rmi "docker.lan.net:8083/calico/typha:v3.26.1"
docker pull "docker.lan.net:8083/calico/kube-controllers:v3.26.1"
docker tag "docker.lan.net:8083/calico/kube-controllers:v3.26.1" "calico/kube-controllers:v3.26.1"
docker rmi "docker.lan.net:8083/calico/kube-controllers:v3.26.1"
docker pull "docker.lan.net:8083/calico/apiserver:v3.26.1"
docker tag "docker.lan.net:8083/calico/apiserver:v3.26.1" "calico/apiserver:v3.26.1"
docker rmi "docker.lan.net:8083/calico/apiserver:v3.26.1"
docker pull "docker.lan.net:8083/calico/cni:v3.26.1"
docker tag "docker.lan.net:8083/calico/cni:v3.26.1" "calico/cni:v3.26.1"
docker rmi "docker.lan.net:8083/calico/cni:v3.26.1"
docker pull "docker.lan.net:8083/calico/node-driver-registrar:v3.26.1"
docker tag "docker.lan.net:8083/calico/node-driver-registrar:v3.26.1" "calico/node-driver-registrar:v3.26.1"
docker rmi "docker.lan.net:8083/calico/node-driver-registrar:v3.26.1"
docker pull "docker.lan.net:8083/calico/csi:v3.26.1"
docker tag "docker.lan.net:8083/calico/csi:v3.26.1" "calico/csi:v3.26.1"
docker rmi "docker.lan.net:8083/calico/csi:v3.26.1"
docker pull "docker.lan.net:8083/calico/pod2daemon-flexvol:v3.26.1"
docker tag "docker.lan.net:8083/calico/pod2daemon-flexvol:v3.26.1" "calico/pod2daemon-flexvol:v3.26.1"
docker rmi "docker.lan.net:8083/calico/pod2daemon-flexvol:v3.26.1"
docker pull "docker.lan.net:8083/calico/node:v3.26.1"
docker tag "docker.lan.net:8083/calico/node:v3.26.1" "calico/node:v3.26.1"
docker rmi "docker.lan.net:8083/calico/node:v3.26.1"
docker pull "docker.lan.net:8083/google_containers/kube-apiserver:v1.27.3"
docker tag "docker.lan.net:8083/google_containers/kube-apiserver:v1.27.3" "registry.aliyuncs.com/google_containers/kube-apiserver:v1.27.3"
docker rmi "docker.lan.net:8083/google_containers/kube-apiserver:v1.27.3"
docker pull "docker.lan.net:8083/google_containers/kube-scheduler:v1.27.3"
docker tag "docker.lan.net:8083/google_containers/kube-scheduler:v1.27.3" "registry.aliyuncs.com/google_containers/kube-scheduler:v1.27.3"
docker rmi "docker.lan.net:8083/google_containers/kube-scheduler:v1.27.3"
docker pull "docker.lan.net:8083/google_containers/kube-controller-manager:v1.27.3"
docker tag "docker.lan.net:8083/google_containers/kube-controller-manager:v1.27.3" "registry.aliyuncs.com/google_containers/kube-controller-manager:v1.27.3"
docker rmi "docker.lan.net:8083/google_containers/kube-controller-manager:v1.27.3"
docker pull "docker.lan.net:8083/google_containers/kube-proxy:v1.27.3"
docker tag "docker.lan.net:8083/google_containers/kube-proxy:v1.27.3" "registry.aliyuncs.com/google_containers/kube-proxy:v1.27.3"
docker rmi "docker.lan.net:8083/google_containers/kube-proxy:v1.27.3"
docker pull "docker.lan.net:8083/google_containers/coredns:v1.10.1"
docker tag "docker.lan.net:8083/google_containers/coredns:v1.10.1" "registry.aliyuncs.com/google_containers/coredns:v1.10.1"
docker rmi "docker.lan.net:8083/google_containers/coredns:v1.10.1"
docker pull "docker.lan.net:8083/google_containers/etcd:3.5.7-0"
docker tag "docker.lan.net:8083/google_containers/etcd:3.5.7-0" "registry.aliyuncs.com/google_containers/etcd:3.5.7-0"
docker rmi "docker.lan.net:8083/google_containers/etcd:3.5.7-0"
docker pull "docker.lan.net:8083/google_containers/pause:3.9"
docker tag "docker.lan.net:8083/google_containers/pause:3.9" "registry.aliyuncs.com/google_containers/pause:3.9"
docker rmi "docker.lan.net:8083/google_containers/pause:3.9"
```

## Reference

- [Install Kubernetes Cluster on CentOS 7 with kubeadm](https://computingforgeeks.com/install-kubernetes-cluster-on-centos-with-kubeadm/)
- [Install Mirantis cri-dockerd as Docker Engine shim for Kubernetes](https://computingforgeeks.com/install-mirantis-cri-dockerd-as-docker-engine-shim-for-kubernetes/)

- [centos7 部署 k8s1.25.3 版本 (使用 cri-dockerd 方式安装)](https://www.cnblogs.com/fenghua001/p/16849875.html)

- [阿里云：Kubernetes 镜像](https://developer.aliyun.com/mirror/kubernetes)
- [清华镜像：Kubernetes 镜像使用帮助](https://mirrors.tuna.tsinghua.edu.cn/help/kubernetes/)

- [Installing kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)
- [Container Runtimes](https://kubernetes.io/docs/setup/production-environment/container-runtimes/)

- [fail to start cri-docker](https://github.com/Mirantis/cri-dockerd/issues/145)
