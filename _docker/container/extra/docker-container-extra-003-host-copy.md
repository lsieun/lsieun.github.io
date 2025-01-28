---
title: "docker cp：Host 与 Container 之间的数据复制"
sequence: "103"
---

## 将本地文件复制到 docker 容器内

通过 `docker cp` 指令来将容器外文件传递到 docker 容器内。

将本地文件复制到docker容器中：

```text
docker cp 本地文件路径 容器ID/容器NAME:容器内路径
```

```text
docker cp ~/opt/rabbitmq_delayed_message_exchange-3.9.0.ez 1faca6a70742:/opt/rabbitmq/plugins
```

```text
docker cp ~/opt/rabbitmq_delayed_message_exchange-3.9.0.ez rabbit:/opt/rabbitmq/plugins
```

```text
$ docker cp nexus3:/opt/sonatype/sonatype-work/nexus3/etc/nexus.properties ~/nexus.properties
$ docker cp ~/nexus.properties nexus3:/opt/sonatype/sonatype-work/nexus3/etc/nexus.properties
```

```text
$ docker exec nexus3 cat /opt/sonatype/sonatype-work/nexus3/etc/nexus.properties
$ docker exec nexus3 cat /nexus-data/etc/nexus.properties
```
