---
title: "Volume"
sequence: "105"
---

## 查看帮助

```text
$ docker volume --help

Usage:  docker volume COMMAND

Manage volumes

Commands:
  create      Create a volume
  inspect     Display detailed information on one or more volumes
  ls          List volumes
  prune       Remove all unused local volumes
  rm          Remove one or more volumes
```

## 使用

列出所有的Docker卷：

```text
docker volume ls
```

逐个删除卷：

```text
docker volume rm <VOLUME_NAME>
```

删除所有的卷，可以使用以下命令：

```text
docker volume prune
```

## 注意

```text
--privileged=true
```

