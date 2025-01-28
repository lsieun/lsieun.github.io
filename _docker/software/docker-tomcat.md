---
title: "Tomcat"
sequence: "tomcat"
---

搜索tomcat镜像：

```text
docker search tomcat
```

拉取tomcat镜像：

```text
docker pull tomcat
```

验证tomcat镜像拉取成功：

```text
docker images tomcat
```

## 启动

运行tomcat镜像：

```text
docker run -it -p 8080:8080 tomcat
```

- `-p`小写：`主机端口:docker容器端口`
- `-P`大写：随机分配端口
- `-i`：交互
- `-t`：终端
- `-d`：后台

```text
docker run --name tomcat -p 18080:8080 -v $PWD/test:/usr/local/tomcat/webapps/test -d tomcat
```

命令说明：

- `-p 8080:8080`：将主机的`8080`端口映射到容器的`8080`端口。
- `-v $PWD/test:/usr/local/tomcat/webapps/test`：将主机中当前目录下的`test` 挂载到容器的`/test`。

## 访问首页

直接输入`http://localhost:8080`会出现404错误，是因为新版本的Tomcat对于首页的访问发生了一些改变。

可能的原因：

- [ ] 可能没有映射端口或没有关闭防火墙
- [x] 把`webapps.dist`目录换成`webapps`
  - cd /usr/local/tomcat

## 免修改

```text
docker pull billygoo/tomcat8-jdk8
docker run -d -p 8080:8080 --name mytomcat8 billygoo/tomcat8-jdk8
```

## Reference

- [tomcat](https://hub.docker.com/_/tomcat)
