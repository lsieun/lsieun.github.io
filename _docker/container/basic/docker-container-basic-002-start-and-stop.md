---
title: "docker start/stop"
sequence: "102"
---

容器命令：


- 列出所有容器：docker ps
- 退出容器：
- 启动已经停止的容器
- 重启容器
- 停止容器
- 强制停止容器
- 删除已经停止的容器



## 启动和停止

启动：

```text
docker start <container-name-or-id>
```

停止：

```text
docker stop <container-name-or-id>
```

重启：

```text
docker restart <container-name-or-id>
```

## 删除

```text
docker rm <container-name-or-id>
```

## docker inspect

```text
docker inspect <container-name-or-id>
```

## pause

- `pause`: Pause all processes within one or more containers
- `unpause`: Unpause all processes within one or more containers

```text
docker pause <container-name-or-id>
docker unpause <container-name-or-id>
```





