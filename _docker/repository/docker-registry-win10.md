---
title: "Docker Registry Mirror (Windows 10)"
sequence: "102"
---

在 `Settings` --> `Docker Engine` 中，配置内容：

```json
{
  "insecure-registries": ["docker.lan.net:8082", "docker.lan.net:8083"],
  "registry-mirrors": ["https://hub-mirror.c.163.com"],
  "debug": true
}
```

点击 `Apply & Restart`”`，Docker 桌面版将会重新启动，并加载新的配置文件。

验证
运行以下命令来验证Registry Mirror是否已经生效：

```text
docker info
```
