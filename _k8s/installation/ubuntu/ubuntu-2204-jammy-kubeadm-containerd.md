---
title: "Kubeadm (Ubuntu 22.04)"
sequence: "kubeadm-ubuntu"
---

| Server Role | Server Hostname  | Spec           | IP Address     |
|-------------|------------------|----------------|----------------|
| Master Node | master01.k8s.lab | 4GB RAM 2vcpus | 192.168.80.131 |
| Worker Node | worker01.k8s.lab | 4GB RAM 2vcpus | 192.168.80.231 |
| Worker Node | worker02.k8s.lab | 4GB RAM 2vcpus | 192.168.80.232 |

## VM

```text
$ sudo rm -rf /etc/machine-id
$ sudo dbus-uuidgen --ensure=/etc/machine-id
```

```text
$ sudo hostnamectl set-hostname {{HOST_NAME}}.kubernetes.lab
$ sudo hostnamectl set-hostname master01.k8s.lab
$ sudo hostnamectl set-hostname worker01.k8s.lab
$ sudo hostnamectl set-hostname worker02.k8s.lab
```

```text
$ sudo vi /etc/netplan/01-network-manager-all.yaml
```

```text
$ sudo tee -a /etc/hosts <<EOF
192.168.80.131 master01.k8s.lab
192.168.80.231 worker01.k8s.lab
192.168.80.232 worker02.k8s.lab
EOF
```

```text
$ sudo apt install lrzsz wget curl vim git
```

## Disable swap & add kernel settings

```text
$ sudo swapoff -a
$ sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
```

Load the following kernel modules on all the nodes,

```text
$ sudo tee /etc/modules-load.d/containerd.conf <<EOF
overlay
br_netfilter
EOF
$ sudo modprobe overlay
$ sudo modprobe br_netfilter
```

Set the following Kernel parameters for Kubernetes, run beneath tee command

```text
$ sudo tee /etc/sysctl.d/kubernetes.conf <<EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF
```

Reload the above changes, run

```text
$ sudo sysctl --system
```

## Install containerd run time

So, to install `containerd`, first install its dependencies.

```text
$ sudo apt install -y curl gnupg2 software-properties-common apt-transport-https ca-certificates
```

Enable docker repository

```text
$ sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

Now, run following apt command to install containerd

```text
$ sudo apt update
$ sudo apt install -y containerd.io
```

Configure containerd so that it starts using systemd as cgroup.

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
$ sudo systemctl enable containerd
$ systemctl status containerd
```

## Install kubelet, kubeadm and kubectl

### Add Kubernetes repositories

```text
$ sudo apt update
$ sudo apt install -y apt-transport-https ca-certificates curl
curl https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | sudo apt-key add -
$ sudo tee /etc/apt/sources.list.d/kubernetes.list <<EOF
deb https://mirrors.tuna.tsinghua.edu.cn/kubernetes/apt kubernetes-xenial main
EOF
```

```text
$ cat /etc/apt/sources.list.d/kubernetes.list
deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
```

### Install Kubernetes tools

```text
$ sudo apt update
$ sudo apt install kubelet kubeadm kubectl -y
$ sudo apt-mark hold kubelet kubeadm kubectl
```

```text
W: https://mirrors.tuna.tsinghua.edu.cn/kubernetes/apt/dists/kubernetes-xenial/InRelease: Key is stored in legacy trusted.gpg keyring (/etc/apt/trusted.gpg), see the DEPRECATION section in apt-key(8) for details.
```

```text
$ kubectl version --output=yaml
$ kubectl version --output=json
$ kubeadm version
```

## Initialize Kubernetes cluster with Kubeadm command

Initialize control plane (run on first master node)

```text
$ lsmod | grep br_netfilter
```

```text
$ sudo systemctl enable kubelet
```

```text
$ sudo kubeadm config images pull \
	  --image-repository registry.aliyuncs.com/google_containers
```

```text
$ sudo kubeadm config images list --image-repository registry.aliyuncs.com/google_containers
```

```text
$ sudo kubeadm init \
      --pod-network-cidr=10.244.0.0/16 \
      --image-repository registry.aliyuncs.com/google_containers \
      --v=5
```

```text
$ sudo kubeadm init \
      --apiserver-advertise-address=192.168.80.131 \
      --pod-network-cidr=10.244.0.0/16 \
      --node-name master01.k8s.lab \
      --control-plane-endpoint=master01.k8s.lab \
      --image-repository registry.aliyuncs.com/google_containers
```

```text
mkdir -p $HOME/.kube
$ sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
$ sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

```text
$ sudo kubeadm reset
```

## Install Kubernetes network plugin

```text
wget https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml
```

```text
$ vim kube-flannel.yml
net-conf.json: |
    {
      "Network": "10.244.0.0/16",
      "Backend": {
        "Type": "vxlan"
      }
    }
```

```text
$ kubectl apply -f kube-flannel.yml
```

```text
$ kubectl get pods -n kube-flannel
```

```text
$ kubectl get nodes -o wide
```

## Add worker nodes

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

You can now join any number of control-plane nodes by copying certificate authorities
and service account keys on each node and then running the following as root:

  kubeadm join master01.k8s.lab:6443 --token liercf.hsjpz2f8nk647gp4 \
	--discovery-token-ca-cert-hash sha256:b2b9a692e30fea9f73345d8b212774a44fed833667f9d198f00bd82694241539 \
	--control-plane

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join master01.k8s.lab:6443 --token liercf.hsjpz2f8nk647gp4 \
	--discovery-token-ca-cert-hash sha256:b2b9a692e30fea9f73345d8b212774a44fed833667f9d198f00bd82694241539
```

```text
$ sudo kubeadm join master01.k8s.lab:6443 --token liercf.hsjpz2f8nk647gp4 \
> --discovery-token-ca-cert-hash sha256:b2b9a692e30fea9f73345d8b212774a44fed833667f9d198f00bd82694241539
[sudo] password for liusen: 
[preflight] Running pre-flight checks
[preflight] Reading configuration from the cluster...
[preflight] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Starting the kubelet
[kubelet-start] Waiting for the kubelet to perform the TLS Bootstrap...

This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The Kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the control-plane to see this node join the cluster.
```

```text
$ kubectl get nodes
$ kubectl get nodes -o wide
```

## Test Application

```text
kubectl apply -f https://k8s.io/examples/pods/commands.yaml
```

```text
$ kubectl get pods
```

## Disable Swap Space

Disable all swaps from `/proc/swaps`.

```text
$ sudo swapoff -a
```

Check if swap has been disabled by running the free command.

```text
$ free -h
               total        used        free      shared  buff/cache   available
Mem:           3.8Gi       654Mi       1.8Gi        13Mi       1.3Gi       2.9Gi
Swap:             0B          0B          0B
```

Now disable Linux swap space **permanently** in `/etc/fstab`.
Search for a swap line and add `#` (hashtag) sign in front of the line.

```text
$ sudo vim /etc/fstab
#/swap.img	none	swap	sw	0	0
```

Confirm setting is correct

```text
$ sudo mount -a
$ free -h
```

Enable kernel modules and configure `sysctl`.

```text
# Enable kernel modules
$ sudo modprobe overlay
$ sudo modprobe br_netfilter

# Add some settings to sysctl
$ sudo tee /etc/sysctl.d/kubernetes.conf<<EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF

# Reload sysctl
$ sudo sysctl --system
```

## Install Container runtime (Master and Worker nodes)

### Installing Containerd

```text
# Configure persistent loading of modules
$ sudo tee /etc/modules-load.d/k8s.conf <<EOF
overlay
br_netfilter
EOF

# Load at runtime
$ sudo modprobe overlay
$ sudo modprobe br_netfilter

# Ensure sysctl params are set
$ sudo tee /etc/sysctl.d/kubernetes.conf<<EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF

# Reload configs
$ sudo sysctl --system

# Install required packages
$ sudo apt install -y curl gnupg2 software-properties-common apt-transport-https ca-certificates

# Add Docker repo
$ sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install containerd
$ sudo apt update
$ sudo apt install -y containerd.io

# Configure containerd and start service
$ sudo su -
$ sudo mkdir -p /etc/containerd
$ sudo bash -c 'containerd config default > /etc/containerd/config.toml'
```

```text
$ containerd config default | sudo tee /etc/containerd/config.toml >/dev/null 2>&1
$ sudo sed -i 's/SystemdCgroup \= false/SystemdCgroup \= true/g' /etc/containerd/config.toml
```

```text
# restart containerd
$ sudo systemctl restart containerd
$ sudo systemctl enable containerd
systemctl status containerd
```



### 运行 kubeadm init

```text
$ sudo kubeadm init \
	--image-repository registry.aliyuncs.com/google_containers \
	--kubernetes-version 1.27.2
```

## Reference

- [Install Kubernetes Cluster on Ubuntu 22.04 with kubeadm](https://computingforgeeks.com/install-kubernetes-cluster-ubuntu-jammy/)
- [Install Kubernetes 1.26 on Ubuntu 20.04 or 22.04 LTS](https://akyriako.medium.com/install-kubernetes-on-ubuntu-20-04-f1791e8cf799)
- [How to Install Kubernetes Cluster on Ubuntu 22.04](https://www.linuxtechi.com/install-kubernetes-on-ubuntu-22-04/)
- [Kubernetes 001. Building Cluster on Ubuntu Linux with Docker and Calico in 2022](https://karneliuk.com/2022/09/kubernetes-001-building-cluster-on-ubuntu-linux-with-docker-and-calico-in-2022/)
