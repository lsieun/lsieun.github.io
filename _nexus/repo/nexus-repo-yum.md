---
title: "Yum Repo"
sequence: "yum"
---

## 配置 Nexus

### 创建 blob 存储

![](/assets/images/nexus3/yum/yum-repo-001-create-blob-store.png)

### 创建 Yum 库

Yum 私服同样有三种类型：

- `hosted`: 本地存储，即同 yum 官方仓库一样提供本地私服功能
- `proxy`: 提供代理其他仓库的类型，如我们常用的 163 仓库
- `group`: 组类型，实质作用是组合多个仓库为一个地址，相当于一个透明代理。

#### 创建 hosted 类型的 yum 库

后来才发现，其实每次创建的这个 `hosted` 类型的，并没有什么用。不过照例创建一波吧。

- Name：定义一个名称 `yum-hosted`
- Storage Blob store，我们下拉选择前面创建好的专用 blob：`yum-hub`。
- Hosted：开发环境，我们运行重复发布，因此 Deployment policy 我们选择 `Allow redeploy`。这个很重要！

![](/assets/images/nexus3/yum/yum-repo-002-create-repo-hosted.png)

#### 创建一个 proxy 类型的 yum 仓库

- Name: yum-proxy-tsinghua
- Proxy：Remote Storage: 远程仓库地址，这里填写: `https://mirrors.tuna.tsinghua.edu.cn/`
- Storage: yum-blob

其他的均是默认。

这里就先创建一个代理 `tsinghua` 的仓库，其实还可以多创建几个，诸如阿里云的，搜狐的，等等，这个根据个人需求来定义。

![](/assets/images/nexus3/yum/yum-repo-003-create-repo-proxy.png)

#### 创建一个 group 类型的 yum 仓库

- Name：yum-group
- Storage：选择专用的 blob 存储 yum-blob。
- group : 将左边可选的2个仓库，添加到右边的members下。

![](/assets/images/nexus3/yum/yum-repo-004-create-repo-group.png)

## 使用 Nexus

### 准备

第 1 步，配置 `/etc/hosts` 信息：

```text
192.168.80.1 nexus.lsieun.cn
```

```text
$ ping nexus.lsieun.cn
PING nexus.lsieun.cn (192.168.80.1) 56(84) bytes of data.
64 bytes from nexus.lsieun.cn (192.168.80.1): icmp_seq=1 ttl=128 time=0.169 ms
64 bytes from nexus.lsieun.cn (192.168.80.1): icmp_seq=2 ttl=128 time=0.901 ms
```

### CentOS

![](/assets/images/nexus3/yum/yum-repo-005-repo-group-url.png)

```text
$ cd /etc/yum.repos.d/
```

```text
sudo sed -e 's|^mirrorlist=|#mirrorlist=|g' \
         -e 's|^#baseurl=http://mirror.centos.org/centos|baseurl=https://nexus.lsieun.cn/repository/yum-group/centos|g' \
         -i.bak \
         /etc/yum.repos.d/CentOS-*.repo
```

```text
$ yum makecache
$ sudo yum -y update
```

### ELRepo

```text
$ sudo rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
```

EHEL-7/CentOS-7:

```text
$ sudo yum -y install https://www.elrepo.org/elrepo-release-7.el7.elrepo.noarch.rpm
$ sudo cp /etc/yum.repos.d/elrepo.repo /etc/yum.repos.d/elrepo.repo.bak
```

然后编辑 `/etc/yum.repos.d/elrepo.repo` 文件，在 `mirrorlist=` 开头的行前面加 `#` 注释掉；并将 `http://elrepo.org/linux` 替换为

```text
$ sudo vi /etc/yum.repos.d/elrepo.repo
```

```text
https://nexus.lsieun.cn/repository/yum-group/elrepo
```

```text
sudo sed -e 's|^mirrorlist=|#mirrorlist=|g' \
         -e 's|^baseurl=http://elrepo.org/linux|baseurl=https://nexus.lsieun.cn/repository/yum-group/elrepo|g' \
         -i.bak \
         /etc/yum.repos.d/elrepo.repo
```

```text
$ yum makecache
$ sudo yum -y --enablerepo="elrepo-kernel" install kernel-lt.x86_64
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

### docker-ce

```text
$ sudo yum -y install yum-utils
$ sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
$ sudo sed -i.bak 's+https://download.docker.com/linux/centos+https://nexus.lsieun.cn/repository/yum-group/docker-ce/linux/centos+' /etc/yum.repos.d/docker-ce.repo
```

```text
$ yum makecache
$ sudo yum -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

```text
$ sudo systemctl start docker
$ sudo systemctl enable docker.service
$ sudo systemctl enable containerd.service
```

```text
$ sudo usermod -aG docker $USER
```

第三步，刷新权限:

```text
$ newgrp docker
```

```text
$ docker version
$ docker compose version
```

```text
$ sudo docker run hello-world
```

```text
$ sudo tee -a /etc/hosts <<EOF
192.168.80.1 registry.lsieun.cn
192.168.80.1 docker.lsieun.cn
EOF
```

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
    "https://registry.lsieun.cn",
    "https://docker.lsieun.cn"
  ],
  "debug": true
}
```

```text
sudo systemctl daemon-reload
sudo systemctl restart docker
```



```text
docker login -u admin -p 123456 registry.lsieun.cn
docker login -u admin -p 123456 docker.lsieun.cn
```

### Kubernetes

```text
sudo vi /etc/yum.repos.d/kubernetes.repo
```

```text
[kubernetes]
name=kubernetes
baseurl=https://mirrors.tuna.tsinghua.edu.cn/kubernetes/yum/repos/kubernetes-el7-$basearch
enabled=1
```

```text
[kubernetes]
name=kubernetes
baseurl=https://nexus.lsieun.cn/repository/yum-group/kubernetes/yum/repos/kubernetes-el7-$basearch
enabled=1
```

```text
$ yum makecache
$ sudo yum -y install kubeadm kubelet kubectl
```

### gitlab-ce

新建 `/etc/yum.repos.d/gitlab-ce.repo`，内容为

```text
[gitlab-ce]
name=Gitlab CE Repository
baseurl=https://nexus.lsieun.cn/repository/yum-group/gitlab-ce/yum/el$releasever/
gpgcheck=0
enabled=1
```

再执行

```text
$ sudo yum makecache
$ sudo yum -y install gitlab-ce
```

### MySQL

新建 `/etc/yum.repos.d/mysql-community.repo`，内容如下：

注：`mysql-8.0`, `mysql-connectors` 和 `mysql-tools` 在 RHEL 7/8上还提供了aarch64版本。

```text
[mysql-connectors-community]
name=MySQL Connectors Community
baseurl=https://nexus.lsieun.cn/repository/yum-group/mysql/yum/mysql-connectors-community-el7-$basearch/
enabled=1
gpgcheck=1
gpgkey=https://repo.mysql.com/RPM-GPG-KEY-mysql-2022

[mysql-tools-community]
name=MySQL Tools Community
baseurl=https://nexus.lsieun.cn/repository/yum-group/mysql/yum/mysql-tools-community-el7-$basearch/
enabled=1
gpgcheck=1
gpgkey=https://repo.mysql.com/RPM-GPG-KEY-mysql-2022

[mysql-8.0-community]
name=MySQL 8.0 Community Server
baseurl=https://nexus.lsieun.cn/repository/yum-group/mysql/yum/mysql-8.0-community-el7-$basearch/
enabled=1
gpgcheck=1
gpgkey=https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
```

安装客户端：

```text
$ sudo yum -y install mysql
```

安装服务端：

```text
$ sudo yum -y install mysql-server
```

启动 MySQL 服务端：

```text
$ sudo systemctl start mysqld
$ systemctl status mysqld
```

在启动 MySQL 服务的时候，主要会发生以下 4 件事：

- MySQL Server初始化并启动起来；
- MySQL的data文件夹中生成SSL证书和key文件；
- 密码验证组件被安装并且生效；
- 创建一个超级管用户'root'@'localhost'。超级用户设置的密码被保存在错误日志文件中，可以通过以下命令查看：

```text
$ sudo grep 'temporary password' /var/log/mysqld.log
```

登录 MySQL：

```text
mysql -uroot -p
```

修改密码：

```text
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY '<your-password>';
```

```text
ALTER USER 'root'@'localhost' IDENTIFIED BY 'P@ssw0rd';
```

```text
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'P@ssw0rd';
Query OK, 0 rows affected (0.01 sec)
```

