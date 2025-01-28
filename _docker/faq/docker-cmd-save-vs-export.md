---
title: "docker save vs docker export"
sequence: "105"
---

`docker save` 和 `docker export` 是 Docker 命令行工具用于导出 Docker 容器和镜像的两个不同的命令，它们之间有以下区别：

1. **导出内容的范围不同：**

- `docker save` 导出的是整个 Docker 镜像（包括所有层和元数据），它会将镜像保存为一个 tar 归档文件，可以还原为 Docker 镜像以供导入到其他 Docker 主机。
- `docker export` 导出的是运行中的容器的文件系统（文件系统快照），它会将容器的文件系统导出为一个 tar 归档文件，但不包括镜像的层和元数据。
  该导出的内容不具备可导入为 Docker 镜像的能力，只能用于导入为普通文件系统的快照。

2. **导入方式的不同：**
- `docker save` 导出的 Docker 镜像可以使用 `docker load` 命令导入到 Docker 作为镜像供以后使用。命令如下：`docker load -i <archive.tar>`。
- `docker export` 导出的容器文件系统快照可以使用 `docker import` 命令导入到 Docker 作为新的镜像，但该镜像无法还原为原始容器的状态。命令如下：`docker import <archive.tar>`。

3. **导出/导入速度的差异：**
- 由于 `docker save` 导出的是整个镜像，包括所有层和元数据，因此它的速度相对较慢。导出的文件大小可能会很大，取决于镜像的大小和层数。
- `docker export` 导出的是运行中容器的文件系统快照，不包括镜像的层和元数据，因此导出速度相对较快。导出的文件大小仅取决于容器文件系统的大小。

总的来说，`docker save` 用于导出完整的 Docker 镜像，可以用于备份、复制和迁移镜像。
而 `docker export` 用于导出容器的文件系统快照，可以用于查看或备份容器的运行时文件系统，但无法还原为原始容器的状态。
