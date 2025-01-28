---
title: "docker 环境变量"
sequence: "101"
---

## 查看环境变量

### 第一种方式

要查看Docker容器中的环境变量，可以使用以下命令：

```text
docker exec -it <CONTAINER_ID_OR_NAME> /bin/bash
```

进入容器后，使用以下命令查看环境变量：

```text
printenv
```

### 第二种方式

```text
docker exec -it <CONTAINER_ID_OR_NAME> /bin/printenv
```

### 第三种方式

也可以在运行容器时使用docker inspect命令查看容器的详细信息，包括环境变量。例如：

```text
docker inspect <CONTAINER_ID_OR_NAME>
```
