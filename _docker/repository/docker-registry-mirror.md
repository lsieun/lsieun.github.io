---
title: "Docker Registry Mirror"
sequence: "102"
---



```text
$ cat daemon.json.bak 
{
    "insecure-registries": [
        "192.168.1.22:8082",
        "192.168.1.22:8083"
    ],
    "disable-legacy-registry": true
}
```

docker 安装后默认没有 `daemon.json` 这个配置文件，需要进行手动创建，
docker不管是在哪个平台以何种方式启动，默认都会来这里读取配置，使用户可以统一管理不同系统下的 `docker daemon` 配置。

配置文件的默认径为：`/etc/docker/daemon.json`

## 国内 Docker 源

选其一设置即可：

- Docker中国区官方镜像 -> https://registry.docker-cn.com
- 中国科技大学 -> https://docker.mirrors.ustc.edu.cn
- 网易蜂巢 -> https://hub-mirror.c.163.com
- 腾讯镜像：https://mirror.ccs.tencentyun.com
- 阿里镜像 -> https://xxx.mirror.aliyuncs.com （需要注册，xxx代表你的账号）
- DaoCloud -> xxxx.m.daocloud.ip （需要注册，xxx代表你的账号）

```text
方式一：网易镜像（推荐）
{
  "registry-mirrors": ["https://hub-mirror.c.163.com"]
}

方式二：中国区官方镜像
{
  "registry-mirrors": ["https://registry.docker-cn.com"]
}

方式三：中国科技大学镜像
{
  "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn"]
}

```

## 操作步骤

```text
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
    "insecure-registries": [
        "docker.lan.net:8082", 
        "docker.lan.net:8083"
    ],
    "registry-mirrors": ["https://hub-mirror.c.163.com"],
    "debug": true
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

1、没有该文件夹就创建，默认都是有docker文件夹的：

```text
sudo mkdir -p /etc/docker
```

2、设置镜像内容进daemon.json文件
```text
sudo tee /etc/docker/daemon.json <<-'EOF'
{
    "registry-mirrors": ["https://419bd6w5.mirror.aliyuncs.com"]
}
EOF
```

3、修改完成后，再重加载配置文件

```text
sudo systemctl daemon-reload
```

4、重启动docker

```text
sudo systemctl restart docker
```

5、验证

```text
$ sudo systemctl status docker -l
# 或
$ sudo systemctl status docker
```

```text
$ docker info
...
 Registry Mirrors:
  https://docker.mirrors.ustc.edu.cn/
```


