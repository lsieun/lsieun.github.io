---
title: "Docker Engine 安装 (CentOS)"
sequence: "101"
---

## 安装 Docker

Before you install Docker Engine for the first time on a new host machine, you need to set up the Docker repository.
Afterward, you can install and update Docker from the repository.

第 1 步，安装依赖工具：

```text
$ sudo yum -y install yum-utils device-mapper-persistent-data lvm2
```

在 `yum-utils` 中，包含了 `yum-config-manager` 工具。

第 2 步，添加 Docker repository：

```text
$ sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
$ sudo sed -i 's+https://download.docker.com+https://mirrors.tuna.tsinghua.edu.cn/docker-ce+' /etc/yum.repos.d/docker-ce.repo
$ sudo yum makecache fast
```

第 3 步，安装 Docker Engine、containerd 和 Docker Compose：

```text
$ sudo yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

第 4 步，启动

```text
$ sudo systemctl start docker
```

第 5 步，测试

```text
$ docker version
$ docker compose version
```

```text
$ sudo docker run hello-world
```

## 配置 Docker

### 开机启动

```text
$ sudo systemctl enable docker.service
$ sudo systemctl enable containerd.service
```

### 用户

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

### Registry

```text
sudo vi /etc/docker/daemon.json
```

```json
{
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
sudo systemctl daemon-reload
sudo systemctl restart docker
```

```text
$ sudo tee -a /etc/hosts <<EOF
192.168.80.1 docker.lan.net
EOF
```

```text
docker login -u admin -p 123456 docker.lan.net:8082
docker login -u admin -p 123456 docker.lan.net:8083
```

## Reference

- [Install Docker Engine on CentOS](https://docs.docker.com/engine/install/centos/)
- [Linux post-installation steps for Docker Engine](https://docs.docker.com/engine/install/linux-postinstall/)
- [Docker CE 软件仓库镜像使用帮助](https://mirrors.tuna.tsinghua.edu.cn/help/docker-ce/)
- [Docker CE镜像](https://developer.aliyun.com/mirror/docker-ce)
