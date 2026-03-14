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
$ sudo yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

第 3 步，安装 Docker Engine、containerd 和 Docker Compose：

```text
$ sudo yum -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
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

### 手动配置镜像加速

```text
# 创建配置目录
sudo mkdir -p /etc/docker

# 写入加速配置
cat <<EOF | sudo tee /etc/docker/daemon.json
{
  "registry-mirrors": ["https://hub-mirror.c.163.com", "https://docker.xuanyuan.me"]
}
EOF

# 重新加载配置并重启Docker
sudo systemctl daemon-reload
sudo systemctl restart docker
```

```text
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

```text
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors" : [
    "https://docker.m.daocloud.io",
    "https://mirror.aliyuncs.com"
  ],
  "insecure-registries" : [
    "docker.mirrors.ustc.edu.cn"
  ],
  "debug": true,
  "experimental": false
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

优先推荐（就近 + 稳定优先）

```text
https://docker.1ms.run
https://docker-0.unsee.tech
```


其他备选（用户提供状态：均“正常”）

```text
https://docker.m.daocloud.io
https://ccr.ccs.tencentyun.com
https://hub.xdark.top
https://dhub.kubesre.xyz
https://docker.kejilion.pro
https://docker.xuanyuan.me（入口：https://xuanyuan.cloud）
https://docker.hlmirror.com
https://run-docker.cn
https://docker.sunzishaokao.com
https://image.cloudlayer.icu
https://docker.tbedu.top
https://hub.crdz.gq
https://docker.melikeme.cn
https://docker.nju.edu.cn
https://docker.mirrors.sjtug.sjtu.edu.cn
"https://docker.registry.cyou",
"https://docker-cf.registry.cyou",
"https://dockercf.jsdelivr.fyi",
"https://docker.jsdelivr.fyi",
"https://dockertest.jsdelivr.fyi",
"https://mirror.aliyuncs.com",
"https://dockerproxy.com",
"https://mirror.baidubce.com",
"https://docker.m.daocloud.io",
"https://docker.nju.edu.cn",
"https://docker.mirrors.sjtug.sjtu.edu.cn",
"https://docker.mirrors.ustc.edu.cn",
"https://mirror.iscas.ac.cn",
"https://docker.rainbond.cc",
"https://do.nark.eu.org",
"https://dc.j8.work",
"https://dockerproxy.com",
"https://gst6rzl9.mirror.aliyuncs.com",
"https://registry.docker-cn.com",
"http://hub-mirror.c.163.com",
"http://mirrors.ustc.edu.cn/",
"https://mirrors.tuna.tsinghua.edu.cn/",
"http://mirrors.sohu.com/"
```


使用提示

- 以上多为 DockerHub 反代/镜像，用于 `docker.io` 加速。
- 建议同时配置 2–4 个镜像，并保留官方回源 `https://registry-1.docker.io`。
- 访问最好的镜像放在最前；**不要在 URL 末尾加斜杠**。

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
