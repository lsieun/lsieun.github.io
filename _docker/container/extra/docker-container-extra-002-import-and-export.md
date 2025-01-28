---
title: "docker commit/export/import"
sequence: "102"
---

将 Docker 容器实例转换为镜像通常有两种方法：

## 使用 `docker commit` 命令

`docker commit` 命令可以将一个正在运行的 Docker 容器创建为一个新的 Docker 镜像。

1. 首先使用 `docker ps` 命令查看正在运行的容器的 ID。

2. 然后使用 `docker commit` 命令将该容器创建为一个新的 Docker 镜像。命令格式如下所示：

```
docker commit CONTAINER_ID REPOSITORY[:TAG]
```

其中，`CONTAINER_ID` 是容器的 `ID`，`REPOSITORY` 和 `TAG` 是新镜像的名称和版本号。

例如，将名为 `mycontainer` 的容器转换为新镜像 `myimage:1.0`：

```text
docker commit mycontainer myimage:1.0
```

运行该命令后，Docker 将使用该容器当前的文件系统状态和其他属性创建新的镜像。
此新镜像将出现在本地镜像存储库中，可以使用 `docker images` 命令进行查看。

## 使用 `docker export` 和 `docker import` 命令

`docker export` 命令可以将一个正在运行的 Docker 容器导出为一个 tar 归档文件，该文件可以被导入为一个新的 Docker 镜像。

1. 首先使用 `docker ps` 命令查看正在运行的容器的 ID。

2. 然后使用 `docker export` 命令将该容器导出为 tar 归档文件。命令格式如下所示：

```text
docker export CONTAINER_ID > container.tar
```

其中，`CONTAINER_ID` 是容器的 `ID`，`container.tar` 是导出的 `tar` 归档文件名。

例如，将名为 `mycontainer` 的容器导出为 `tar` 归档文件 `mycontainer.tar`：

```text
docker export mycontainer > mycontainer.tar
```

运行该命令后，Docker 将该容器的文件系统打包为一个 tar 归档文件。

3. 最后使用 `docker import` 命令将该 tar 归档文件导入为新的 Docker 镜像。命令格式如下所示：

```text
docker import CONTAINER_FILE REPOSITORY[:TAG]
```

其中，CONTAINER_FILE 是导出的 tar 归档文件名，REPOSITORY 和 TAG 是新镜像的名称和版本号。

例如，将名为 mycontainer 的 tar 归档文件导入为新镜像 myimage:1.0：

```text
docker import mycontainer.tar myimage:1.0
```

运行该命令后，Docker 将创建名为 myimage:1.0 的新镜像，该镜像的文件系统状态与原始容器中的状态相同。
同样，新镜像将出现在本地镜像存储库中，可以使用 `docker images` 命令进行查看。

总的来说，使用 `docker commit` 命令转换容器为镜像比 `docker export` 和 `docker import` 更为简单。
但使用 `docker export` 和 `docker import` 命令可以使新镜像更干净，因为它更少地受到容器中环境变量和其他设置的干扰。
