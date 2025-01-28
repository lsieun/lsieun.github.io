---
title: "docker run"
sequence: "101"
---

## 查看帮助

```text
$ docker run --help

Usage:  docker run [OPTIONS] IMAGE [COMMAND] [ARG...]

Create and run a new container from an image

Aliases:
  docker container run, docker run
```

```text
-d, --detach                     Run container in background and print container ID
-i, --interactive                Keep STDIN open even if not attached
--privileged                     Give extended privileges to this container
--restart string                 Restart policy to apply when a container exits (default "no")
--rm                             Automatically remove the container when it exits
-t, --tty                        Allocate a pseudo-TTY
-v, --volume list                Bind mount a volume
```


## docker run

```text
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

```text
docker run -it --name=myubt ubuntu bash
```

## it

```text
docker run -it ubuntu /bin/bash
```



## detached mode

```text
docker run -d redis
```

## port binding

- The `-p` flag can be used multiple times to configure multiple ports.

使用 `-p` 或 `--publish` 选项进行端口映射：

```text
docker run -p <host port>:<docker port> <ImageName>
docker run -p 6000:6379 redis
```

使用 `docker port` 查看端口映射关系：

```text
docker port <container_id> [<port_num>]
```

示例：

```text
$ docker run --name redis-server --rm --detach --publish 6000:6379 redis:latest
5ecafdcc53e4d12693814f76e61086c6c9c8297ee84ef9f74d29cb8423b79503

$ docker port redis-server
6379/tcp -> 0.0.0.0:6000
6379/tcp -> [::]:6000
```

## link

[link](https://docs.docker.com/network/links/)

```text
$ docker run -dit --rm --name alpine1 alpine ash
$ docker run -dit --rm --name alpine2 --link alpine1 alpine ash
```

{% highlight text %}
{% raw %}
$ docker inspect -f "{{ .HostConfig.Links }}" alpine2
[/alpine1:/alpine2/alpine1]
{% endraw %}
{% endhighlight %}

从本质上来，它是通过修改 `/etc/hosts` 来实现的：

```text
$ docker attach alpine2

# cat /etc/hosts
172.17.0.2	alpine1
```

## privileged

容器卷记得加入：

```text
--privileged=true
```

Docker 挂载主机目录访问，如果出现

```text
cannot open directory: Permission denied
```

解决方法：在挂载目录后，多加一个 `--privileged=true` 参数即可。

使用该参数，container 内的 root 拥有真正的 root 权限；否则，container 内的 root 只是外部的一个普通用户权限。

如果是 CentOS 7，安全模块会比之前系统版本加强，不安全的会先禁止，所以目录挂载的情况被默认认为不安全的行为。

## restart

```text
$ docker run \
--name oap \
--detach \
--restart always \
--rm \
--network sw-network\
-p 11800:11800 \
-p 12800:12800 \
apache/skywalking-oap-server:9.4.0-java17
```

## rm

Automatically remove the container when it exits

```text
$ docker run -it -d --rm --name u1 ubuntu:23.04
```

## volume

```text

```

## Reference

- [Docker run reference](https://docs.docker.com/engine/reference/run/)
