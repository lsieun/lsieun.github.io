---
title: "CentOS 7: Kubeadm + Docker"
sequence: "centos7-mini-2207-kubeadm-docker"
---

## 目标

- Kubeadm 1.27.3
- Docker
- cri-dockerd

### 硬件要求

### 软件要求

## 操作系统

### 下载镜像

```text
CentOS-7-x86_64-Minimal-2207-02_2.iso
```

- root/root
- devops/123456

```text
$ ssh root@192.168.80.132
```



### 安装

### Post Install

#### sudoer

#### YUM 源

#### 常用软件安装

```text
$ sudo yum -y install git wget curl net-tools lrzsz tree
```

### 主机配置

| Server Role | Server Hostname  | Spec           | IP Address     |
|-------------|------------------|----------------|----------------|
| Master Node | master01.k8s.lab | 4GB RAM 2vcpus | 192.168.80.131 |
| Worker Node | worker01.k8s.lab | 4GB RAM 2vcpus | 192.168.80.231 |
| Worker Node | worker02.k8s.lab | 4GB RAM 2vcpus | 192.168.80.232 |

#### 主机名配置

```text
$ sudo rm -rf /etc/machine-id
$ sudo dbus-uuidgen --ensure=/etc/machine-id
```

```text
$ sudo hostnamectl set-hostname master01.k8s.lab
$ sudo hostnamectl set-hostname worker01.k8s.lab
$ sudo hostnamectl set-hostname worker02.k8s.lab
```

#### 静态 IP 地址配置

修改 `/etc/sysconfig/network-scripts/ifcfg-ens32`

```text
$ cd /etc/sysconfig/network-scripts/
$ sudo vi ifcfg-ens32
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

第 4 步，重新启动 `network` 服务：

```text
$ sudo systemctl restart network
```

#### 主机名和 IP 地址解析

```text
$ sudo tee -a /etc/hosts <<EOF
192.168.80.131 master01.k8s.lab
192.168.80.231 worker01.k8s.lab
192.168.80.232 worker02.k8s.lab
EOF
```

#### 防火墙配置

```text
$ sudo systemctl disable --now firewalld
```

查看防火墙状态：

```text
$ firewall-cmd --state
not running
```

#### SELinux 配置

修改 SELinux 配置，需要重启操作系统：

```text
$ sudo setenforce 0
$ sudo sed -i 's/^SELINUX=.*/SELINUX=permissive/g' /etc/selinux/config
```

#### 时间同步配置

最小化安装系统需要安装 ntpdate 软件：

```text
$ sudo yum -y install ntpdate
```

```text
$ sudo crontab -e
```

```text
0 */1 * * * /usr/sbin/ntpdate time1.aliyun.com
```

查看 crontab：

```text
$ sudo crontab -l
0 */1 * * * /usr/sbin/ntpdate time1.aliyun.com
```

```text
sudo yum -y install ntpdate
sudo ntpdate ntp1.aliyun.com
sudo systemctl status ntpdate
sudo systemctl start ntpdate
sudo systemctl status ntpdate
sudo systemctl enable ntpdate
```

#### 升级操作系统内核

导入 elrepo gpg key

```text
$ sudo rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
```

安装 elrepo YUM 源：

```text
$ sudo yum -y install https://www.elrepo.org/elrepo-release-7.el7.elrepo.noarch.rpm
```

安装 kernel -ml 版本，ml 为长期稳定版本，lt 为长期维护版本

```text
$ sudo yum --enablerepo="elrepo-kernel" -y install kernel-lt.x86_64
```

设置 grub2 默认引导为 0

```text
$ sudo grub2-set-default 0
```

重新生成 grub2 引导文件：

```text
$ sudo grub2-mkconfig -o /boot/grub2/grub.cfg
```

更新后，需要重启，使升级的内核生效：

```text
$ sudo reboot
```

重启后，需要验证内核是否更新为对应的版本：

```text
$ uname -r
```

#### 配置内核转发及网桥过滤

添加网桥过滤及内核转发配置文件：

```text
$ sudo tee /etc/sysctl.d/kubernetes.conf <<EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF
```

加载 `br_netfilter` 模块：

```text
$ sudo modprobe overlay
$ sudo modprobe br_netfilter

$ sudo sysctl --system
```

查看是否加载：

```text
lsmod | grep br_netfilter
```

#### 安装 ipset 及 ipvsadm

安装 ipset 及 ipvsadm

```text
$ sudo yum -y install ipset ipvsadm
```

配置 ipvsadm 模块加载方式  
添加需要加载的模块

```text
$ sudo tee /etc/sysconfig/modules/ipvs.modules <<EOF
#!/bin/bash
modprobe -- ip_vs
modprobe -- ip_vs_rr
modprobe -- ip_vs_wrr
modprobe -- ip_vs_sh
modprobe -- nf_conntrack
EOF
```

授权、运行、检查是否加载

```text
$ sudo chmod 755 /etc/sysconfig/modules/ipvs.modules
$ sudo bash /etc/sysconfig/modules/ipvs.modules
$ lsmod | grep -e ip_vs -e nf_conntrack
```

#### 关闭 SWAP 分区

```text
$ sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
$ sudo swapoff -a
```

## Docker

第 1 步，安装必要的一些系统工具

```text
$ sudo yum -y install yum-utils device-mapper-persistent-data lvm2
```

第 2 步，添加仓库

```text
$ sudo yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

第 3 步，更新本地缓存

```text
$ yum makecache fast
```

第 4 步，安装 Docker-CE

```text
$ sudo yum -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

第 5 步，启动 Docker 服务

```text
$ sudo service docker start
```

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

### 修改 Docker 配置

```text
$ sudo vi /etc/docker/daemon.json
```

```json
{
  "exec-opts": [
    "native.cgroupdriver=systemd"
  ],
  "registry-mirrors": [
    "https://hub-mirror.c.163.com"
  ],
  "debug": true
}
```

```json
{
  "exec-opts": [
    "native.cgroupdriver=systemd"
  ],
  "registry-mirrors": [
    "https://mezagd1y.mirror.aliyuncs.com",
    "https://registry.aliyuncs.com"
  ],
  "debug": true
}
```

### 开机启动

开机启动：

```text
$ sudo systemctl enable docker.service
$ sudo systemctl enable containerd.service
```

### 关机和快照

## Kubernetes

```text
$ sudo tee /etc/yum.repos.d/kubernetes.repo <<EOF
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```

```text
$ sudo yum makecache
```

由于官网未开放同步方式, 可能会有索引 gpg 检查失败的情况, 这时请用 `yum -y install --nogpgcheck kubelet kubeadm kubectl` 安装

### 集群软件安装

默认安装：

```text
$ sudo yum -y install kubeadm kubelet kubectl
```

查看指定版本：

```text
$ yum list kubeadm.x86_64 --showduplicates | sort -r
$ yum list kubelet.x86_64 --showduplicates | sort -r
$ yum list kubectl.x86_64 --showduplicates | sort -r
```

安装指定版本：

```text
$ sudo yum -y install kubeadm-1.27.3-0 kubelet-1.27.3-0 kubectl-1.27.3-0
```

## 配置 kubelet

为了实现 docker 使用的 cgroupdriver 与 kubelet 使用的 cgroup 的一致性，建议修改如下文件内容：

```text
$ sudo vi /etc/sysconfig/kubelet
```

```text
KUBELET_EXTRA_ARGS="--cgroup-driver=systemd"
```

设置 kubelet 为开机自启动即可，由于没有生成配置文件，集群初始化自动启动：

```text
$ sudo systemctl enable kubelet
```

### 集群镜像准备

可以使用 VPN 实现下载：

```text
kubeadm config images list
kubeadm config images list --kubernetes-version=v1.27.3
```

File: `k8s-image-download.sh`

```text
#!/bin/bash
images_list='
镜像列表'

for i in $images_list
do
    docker pull $i
done

docker save -o k8s-1-12-x.tar $images_list
```

## cri-dockerd

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
$ rm -d cri-dockerd/
```

```text
$ cri-dockerd --version
```

```text
$ wget https://raw.githubusercontent.com/Mirantis/cri-dockerd/master/packaging/systemd/cri-docker.service
$ wget https://raw.githubusercontent.com/Mirantis/cri-dockerd/master/packaging/systemd/cri-docker.socket
$ sudo mv cri-docker.socket cri-docker.service /etc/systemd/system/
$ sudo sed -i -e 's,/usr/bin/cri-dockerd,/usr/local/bin/cri-dockerd,' /etc/systemd/system/cri-docker.service
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
ExecStart=/usr/local/bin/cri-dockerd --container-runtime-endpoint fd:// --pod-infra-container-image=registry.aliyuncs.com/google_containers/pause:3.9
```

```text
$ sudo sed -ie 's#ExecStart=.*#ExecStart=/usr/local/bin/cri-dockerd --pod-infra-container-image=registry.aliyuncs.com/google_containers/pause:3.9#g' /etc/systemd/system/cri-docker.service
# 我省略了 --network-plugin
$ sudo sed -ie 's#ExecStart=.*#ExecStart=/usr/local/bin/cri-dockerd --pod-infra-container-image=registry.aliyuncs.com/google_containers/pause:3.9#g' /etc/systemd/system/cri-docker.service
```

```text
$ sudo systemctl daemon-reload
$ sudo systemctl enable cri-docker.service
$ sudo systemctl enable --now cri-docker.socket
```

```text
$ systemctl status cri-docker.socket
```

## containerd

安装 docker 或者 containerd 之后，默认在 `/etc/containerd/config.toml` 禁用了 CRI，需要注释掉 `disabled_plugins = ["cri"]`，否则执行 kubeadm 进行部署时会报错：

```text
$ sudo vi /etc/containerd/config.toml
```

```text
# disabled_plugins = ["cri"]
```

```text
$ sudo systemctl restart containerd docker
```

## Master Init

这一步该拉取镜像了

```text
$ sudo kubeadm config images pull \
      --cri-socket unix:///run/cri-dockerd.sock \
	  --image-repository registry.aliyuncs.com/google_containers \
	   --kubernetes-version v1.27.3 \
	  --v=5
```

```text
$ sudo kubeadm init \
      --pod-network-cidr=10.244.0.0/16 \
      --cri-socket unix:///run/cri-dockerd.sock \
      --image-repository registry.aliyuncs.com/google_containers \
       --kubernetes-version v1.27.3 \
      --v=5
```

```text
$ sudo kubeadm init \
      --apiserver-advertise-address=192.168.80.131 \
      --pod-network-cidr=10.244.0.0/16 \
      --node-name master01.k8s.lab \
      --control-plane-endpoint=master01.k8s.lab \
      --upload-certs \
      --image-repository registry.aliyuncs.com/google_containers \
      --cri-socket unix:///run/cri-dockerd.sock \
      --kubernetes-version v1.27.3 \
      --v=5
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

