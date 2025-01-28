---
title: "SkyWalking OAP Server"
sequence: "skywalking-oap-server"
---

## H2

Start a standalone container with H2 storage

```text
$ docker run --name oap -p 11800:11800 -p 12800:12800 --restart always -d apache/skywalking-oap-server:9.4.0-java17
```

- 第一个端口 `11800` 是 SkyWalking OAP 的 gRPC 协议端口
- 第二个端口 `12800` 是 SkyWalking OAP 的 Web API 端口

在Web浏览器中输入以下地址，即可访问SkyWalking OAP Server的Web UI：

```text
http://localhost:12800
```

## Elasticsearch

Start a standalone container with elasticsearch storage whose address is `elasticsearch:9200`

```text
$ docker run \
--name oap \
-p 11800:11800 \
-p 12800:12800 \
--restart always \
-d -e SW_STORAGE=elasticsearch \
-e SW_STORAGE_ES_CLUSTER_NODES=elasticsearch:9200 \
apache/skywalking-oap-server:9.4.0-java17
```

