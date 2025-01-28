---
title: "version + help"
sequence: "102"
---

帮助启动类命令：

- 查看 Docker 概要信息：`docker info`
- 查看 Docker 总体帮助文档：`docker --help`
- 查看 Docker 命令帮助文档：`docker 具体命令 --help`

## docker version

```text
$ docker --version
Docker version 24.0.2, build cb74dfc
```

```text
$ docker version
Client: Docker Engine - Community
 Version:           24.0.2
 API version:       1.43
 Go version:        go1.20.4
 Git commit:        cb74dfc
 Built:             Thu May 25 21:55:21 2023
 OS/Arch:           linux/amd64
 Context:           default

Server: Docker Engine - Community
 Engine:
  Version:          24.0.2
  API version:      1.43 (minimum version 1.12)
  Go version:       go1.20.4
  Git commit:       659604f
  Built:            Thu May 25 21:54:24 2023
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.6.21
  GitCommit:        3dce8eb055cbb6872793272b4f20ed16117344f8
 runc:
  Version:          1.1.7
  GitCommit:        v1.1.7-0-g860f061
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0
```

## docker help

The first command we will be taking a look at is one of the most useful commands,
not only in Docker but in any command-line utility you use – the `help` command.
It is run simply like this:

```text
$ docker help
```

For further help with a particular command, you can run the following:

```text
$ docker <COMMAND> --help
```

Next, let's run the `hello-world` container. To do this, simply run the following command:

```text
$ docker container run hello-world
```

Let's try something a little more adventurous – let's download and run an NGINX container
by running the following two commands:

```text
$ docker image pull nginx
$ docker container run -d --name nginx-test -p 8080:80 nginx
```

NGINX is an open source web server that can be used as a load balancer,
mail proxy, reverse proxy, and even an HTTP cache.

The first of the two commands downloads the NGINX container image,
and the second command launches a container in the background called `nginx-test`,
using the `nginx` image we pulled.
It also maps port `8080` on our host machine to port `80` on the container,
making it accessible to our local browser at `http://localhost:8080/`.

For now, let's stop and remove our nginx-test container by running the following:

```text
$ docker container stop nginx-test
$ docker container rm nginx-test
```



