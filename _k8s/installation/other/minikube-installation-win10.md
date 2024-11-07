---
title: "Minikube Installation (Win10)"
sequence: "minikube"
---

## 2 Layers of Docker

- Minikube runs as Docker container
- Docker inside Minikube to run our application containers

## 安装

第 1 步，下载 `minikube-installer.exe`：

```text
https://minikube.sigs.k8s.io/docs/start/
```

![](/assets/images/k8s/minikube-windows-exe-download.png)

或者直接下载：

```text
https://storage.googleapis.com/minikube/releases/latest/minikube-installer.exe
```

第 2 步，进行安装。默认安装路径：

```text
C:\Program Files\Kubernetes\Minikube
```

![](/assets/images/k8s/minikube-installation-directory-win10.png)


第 3 步，将 `minikube.exe` 添加到 `PATH` 环境变量。

第 4 步，用 **Administrator** 身份运行 `PowerShell`，然后执行如下命令：

```text
$oldPath = [Environment]::GetEnvironmentVariable('Path', [EnvironmentVariableTarget]::Machine)
if ($oldPath.Split(';') -inotcontains 'C:\minikube'){
  [Environment]::SetEnvironmentVariable('Path', $('{0};C:\minikube' -f $oldPath), [EnvironmentVariableTarget]::Machine)
}
```

## 启动集群

第 1 步，以**管理员身份**运行：

```text
minikube start
```

```text
minikube start --driver docker
```

```text
minikube status
```

第 2 步，使用 `kubectl` 命令检查集群（cluster）信息：

```text
kubectl cluster-info
```

第 3 步，查看 `dashboard`：

```text
minikube dashboard
```

This command opens a site in our **default browser**,
which provides an extensive overview about the state of our cluster.

![](/assets/images/k8s/powershell-minikube-start.png)

![](/assets/images/k8s/kubernetes-dashboard.png)


```text
sed -i 's#docker.io/##g' calico.yaml
```

## Command

- MiniKube CLI: for start up/deleting the cluster
- Kubectl CLI: for configuring the Minikube cluster

```text
kubectl get node
```

## Reference

- [minikube start](https://minikube.sigs.k8s.io/docs/start/)
- [Running Spring Boot Applications With Minikube](https://www.baeldung.com/spring-boot-minikube)

[minikube-installer-url]: https://storage.googleapis.com/minikube/releases/latest/minikube-installer.exe
