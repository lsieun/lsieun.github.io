---
title: "Using Nexus 3 as Your Repository"
sequence: "103"
---

查看仓库镜像 tag：

```text
curl -XGET http://(repository)/v2/(image name)/tags/list
```

```text
curl -XGET http://docker.lan.net:8082/v2/jenkins/jenkins/tags/list
```

执行docker pull

```text
docker pull (register)/(image name):(tag)
```


## Docker 配置

## 修改 Docker 配置

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
    "https://mezagd1y.mirror.aliyuncs.com",
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
{
    "insecure-registries": [
        "docker.lan.net:8082",
        "docker.lan.net:8083"
    ],
    "registry-mirrors": [
        "https://hub-mirror.c.163.com",
        "https://docker.mirrors.ustc.edu.cn",
        "https://registry.docker-cn.com",
        "https://mirror.ccs.tencentyun.com"
    ],
    "debug": true
}
```

### 登录私服

```text
$ sudo vi /etc/hosts
```

```text
$ cat /etc/hosts
192.168.80.1 docker.lan.net
```

```text
docker login -u admin -p 123456 docker.lan.net:8082
docker login -u admin -p 123456 docker.lan.net:8083
```

```text
docker logout docker.lan.net:8082
```

### 拉取镜像

```text
docker pull docker.lan.net:8082/alpine
```

## 推送镜像

```text
docker tag kennethreitz/httpbin:latest docker.lan.net:8083/kennethreitz/httpbin:latest
docker push docker.lan.net:8083/kennethreitz/httpbin:latest
```


## Reference

- [Using Nexus 3 as Your Repository – Part 1: Maven Artifacts](https://blog.sonatype.com/using-nexus-3-as-your-repository-part-1-maven-artifacts)
- [Using Nexus 3 as Your Repository – Part 2: npm Packages](https://blog.sonatype.com/using-nexus-3-as-your-repository-part-2-npm-packages)
- [Using Nexus 3 as Your Repository – Part 3: Docker Images](https://blog.sonatype.com/using-nexus-3-as-your-repository-part-3-docker-images)
