---
title: "Docker + Nginx"
sequence: "101"
---

- 第 1 步，查找 Nginx Image
- 第 2 步，运行 Nginx 
- 第 3 步，进入 Nginx Container，查看信息

## Image

```text
$ docker search nginx
```

```text
$ docker pull nginx
```

## Docker Run

```text
$ docker run --name nginx-test -p 8080:80 -d nginx
```

参数说明：

- `--name nginx-test`：容器名称。
- `-p 8080:80`： 端口进行映射，将本地`8080`端口映射到容器内部的`80`端口。
- `-d nginx`： 设置容器在在后台一直运行。

```text
docker run -it --rm -d -p 8080:80 --name web -v ~/site-content:/usr/share/nginx/html nginx
docker run -it --rm -d -p 80:80 --name web -v ~/site-content:/usr/share/nginx/html nginx
```

## Docker Exec

```text
$ docker exec -it nginx-test /bin/bash
```

- 配置文件：`/etc/nginx/nginx.conf`
- 配置目录：`/etc/nginx/conf.d`
- 静态文件目录：`/usr/share/nginx/html`


## Reference

- [nginx](https://hub.docker.com/_/nginx/)
