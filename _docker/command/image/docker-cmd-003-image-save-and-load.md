---
title: "Image: save + load"
sequence: "103"
---

将 Docker 镜像放到 U 盘上时，需要先把镜像保存为 tar 包，并将该 tar 包复制到 U 盘。保存 Docker 镜像为 tar 包的方式如下：

1. 首先使用 `docker images` 命令，找到要保存的镜像的 `ID`，例如我们要保存 `ID` 为 `abc123` 的镜像。

2. 使用 `docker save` 命令将镜像保存为 `tar` 包，例如：

```text
docker save abc123 > myimage.tar
```

```text
$ docker save e1fbd49323c6 > prometheus.v2.45.0.tar
$ docker save 9b957e098315 > grafana.latest.tar
```

此命令将镜像保存为名为 `myimage.tar` 的文件。

3. 按需重复上述步骤，将要保存的所用镜像都保存为 `tar` 包。

4. 将保存好的 `tar` 包复制到 U 盘上。

完成上述步骤后，可以将 U 盘插入另一台电脑，使用 `docker load` 命令加载该 tar 包并生成 Docker 镜像，例如：

```text
docker load -i /media/usb/myimage.tar
```

```text
$ docker load -i ~/prometheus.v2.45.0.tar
$ docker tag e1fbd49323c6 prom/prometheus:v2.45.0

$ docker load -i grafana.latest.tar
$ docker tag 9b957e098315 grafana/grafana:latest
```

此命令将从 U 盘上读取 myimage.tar 文件，并转换成 Docker 镜像。

注意，在加载镜像时需要注意当前 Docker 环境中的镜像 ID，以避免出现重名的情况。
可以使用 `docker images` 命令查看当前 Docker 环境中的镜像 ID，然后避免将相同 ID 的镜像保存为同名的 tar 包。
