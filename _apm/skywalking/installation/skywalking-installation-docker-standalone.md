---
title: "Installation (Docker)"
sequence: "102"
---

## SkyWalking + H2

### Network

```text
docker network create sw-network
```

### SkyWalking OAP Server

oap-server:

```text
$ docker run \
--name oap-server \
--detach \
--rm \
--network sw-network \
-p 11800:11800 \
-p 12800:12800 \
apache/skywalking-oap-server:9.4.0-java17
```

### SkyWalking UI

```text
$ docker run \
--name oap-ui \
--detach \
--rm \
--network sw-network \
-e SW_OAP_ADDRESS=http://oap-server:12800 \
-p 8080:8080 \
apache/skywalking-ui:v9.4.0-java17
```

### Java Application

```text
-javaagent:D:\tmp\skywalking-agent\skywalking-agent.jar
-DSW_AGENT_NAME=skywalking-spring-boot-demo
-DSW_AGENT_COLLECTOR_BACKEND_SERVICES=192.168.80.130:11800
```

## SkyWalking + Elasticsearch

### Network

```text
docker network create sw-network
```

### Elasticsearch

```text
$ sudo mkdir -p /opt/elasticsearch/{data,logs,plugins}
$ sudo chown -R 1000 /opt/elasticsearch
```

```text
$ docker run \
--name elasticsearch \
--detach \
--rm \
-e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
-e "discovery.type=single-node" \
-v /opt/elasticsearch/data:/usr/share/elasticsearch/data \
-v /opt/elasticsearch/logs:/usr/share/elasticsearch/logs \
-v /opt/elasticsearch/plugins:/usr/share/elasticsearch/plugins \
--privileged \
--network sw-network \
-p 9200:9200 \
-p 9300:9300 \
elasticsearch:7.17.7
```

```text
curl http://127.0.0.1:9200
```

```text
http://192.168.80.130:9200
```

### SkyWalking OAP Server

```text
$ sudo mkdir -p /opt/skywalking/{config,oap-libs}
```

```text
$ docker run \
--name oap-server \
--detach \
-e SW_STORAGE_ES_CLUSTER_NODES=elasticsearch:9200 \
--network sw-network \
-p 11800:11800 \
-p 12800:12800 \
-v /opt/skywalking/config:/skywalking/config \
-v /opt/skywalking/oap-libs:/skywalking/oap-libs \
--privileged \
apache/skywalking-oap-server:9.4.0-java17
```

```text
docker cp oap-server:/skywalking/config/application.yml ~/application.yml
vi application.yml
```

```text
$ docker cp ~/application.yml oap-server:/skywalking/config/application.yml
Successfully copied 33.3kB to oap-server:/skywalking/config/application.yml
```

```text
storage:
  selector: ${SW_STORAGE:elasticsearch}
  elasticsearch:
    clusterNodes: ${SW_STORAGE_ES_CLUSTER_NODES:elasticsearch:9200}
    user: ${SW_ES_USER:""}
    password: ${SW_ES_PASSWORD:""}
```

```text
docker run \
--name oap-server \
--detach \
--network sw-network \
-p 11800:11800 \
-p 12800:12800 \
--privileged \
apache/skywalking-oap-server:9.4.0-java17
```

```text
$ docker run \
--name oap-server \
--detach \
-e SW_STORAGE_ES_CLUSTER_NODES=elasticsearch:9200 \
--network sw-network \
-p 11800:11800 \
-p 12800:12800 \
--privileged \
apache/skywalking-oap-server:9.4.0-java17
```

### SkyWalking UI

```text
$ docker run \
--name oap-ui \
--detach \
--rm \
--network sw-network \
-e SW_OAP_ADDRESS=http://oap-server:12800 \
-p 8080:8080 \
apache/skywalking-ui:v9.4.0-java17
```
