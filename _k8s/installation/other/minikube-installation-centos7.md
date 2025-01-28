---
title: "Minikube Installation (CentOS7)"
sequence: "minikube-centos7"
---

## 环境准备

- 2 CPUs or more
- 2GB of free memory
- 20GB of free disk space
- Internet connection
- Container or virtual machine manager, such as: Docker


## Installation

```text
https://minikube.sigs.k8s.io/docs/start/
```

第 1 种方式：

```text
$ curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-latest.x86_64.rpm
$ sudo rpm -Uvh minikube-latest.x86_64.rpm
```

第 2 种方式

```text
$ curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
$ sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

启动：

```text
$ minikube start
```

```text
$ minikube start --image-repository=registry.aliyuncs.com/google_containers
```

```text
$ docker images
REPOSITORY       TAG       IMAGE ID       CREATED        SIZE
kicbase/stable   v0.0.39   67a4b1138d2d   2 months ago   1.05GB
```

```text
$ docker tag docker.lan.net:8083/kicbase/stable:v0.0.39 index.docker.io/kicbase/stable:v0.0.39
```

```text
$ minikube kubectl -- get pods -A
NAMESPACE     NAME                               READY   STATUS    RESTARTS        AGE
kube-system   coredns-787d4945fb-txh2z           1/1     Running   0               8m46s
kube-system   etcd-minikube                      1/1     Running   0               8m59s
kube-system   kube-apiserver-minikube            1/1     Running   0               8m59s
kube-system   kube-controller-manager-minikube   1/1     Running   0               8m59s
kube-system   kube-proxy-t92fs                   1/1     Running   0               8m47s
kube-system   kube-scheduler-minikube            1/1     Running   0               8m59s
kube-system   storage-provisioner                1/1     Running   1 (8m25s ago)   8m58s
```

```text
$ minikube kubectl cluster-info
Kubernetes control plane is running at https://192.168.49.2:8443
CoreDNS is running at https://192.168.49.2:8443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

```text
$ minikube start
* minikube v1.30.1 on Centos 7.6.1810
* Using the docker driver based on existing profile
* Starting control plane node minikube in cluster minikube
* Pulling base image ...
* Restarting existing docker container for "minikube" ...
* Preparing Kubernetes v1.26.3 on Docker 23.0.2 ...
* Configuring bridge CNI (Container Networking Interface) ...
* Verifying Kubernetes components...
  - Using image docker.io/kubernetesui/dashboard:v2.7.0
  - Using image docker.io/kubernetesui/metrics-scraper:v1.0.8
  - Using image gcr.io/k8s-minikube/storage-provisioner:v5
* Some dashboard features require the metrics-server addon. To enable all features please run:

	minikube addons enable metrics-server	


* Enabled addons: default-storageclass, storage-provisioner, dashboard
* kubectl not found. If you need it, try: 'minikube kubectl -- get pods -A'
* Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default
```

## Reference

- [minikube start](https://minikube.sigs.k8s.io/docs/start/)
