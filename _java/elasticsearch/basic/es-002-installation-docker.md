---
title: "Elasticsearch Installation (Docker)"
sequence: "102"
---

```text
docker pull docker.elastic.co/elasticsearch/elasticsearch:7.17.7
docker pull docker.elastic.co/kibana/kibana:7.17.7
```

```text
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.7.0
docker pull docker.elastic.co/kibana/kibana:8.7.0
```

## 部署单节点 ES

### 创建网络

因为我们还需要部署 Kibana 容器，因此需要让 ES 和 Kibana 容器互联。
这里先创建一个网络：

```text
docker network create es-net
```

### 加载镜像

```text
docker pull elasticsearch:7.17.10
```

### 运行

```text
docker run -d \
--name es \
-e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
-e "discovery.type=single-node" \
-v es-data:/usr/share/elasticsearch/data \
-v es-logs:/usr/share/elasticsearch/logs \
-v es-plugins:/usr/share/elasticsearch/plugins \
--privileged \
--network es-net \
-p 9200:9200 \
-p 9300:9300 \
elasticsearch:7.17.10
```

- 9200：是 HTTP 端口，供用户使用
- 9300：是集群当中，各个 ES 互相联系的端口

```text
$ docker volume create es-data
$ docker volume create es-logs
$ docker volume create es-plugins
```

```text
$ docker volume inspect es-data
[
    {
        "CreatedAt": "2023-06-14T07:29:07-04:00",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/es-data/_data",
        "Name": "es-data",
        "Options": null,
        "Scope": "local"
    }
]
```

```text
$ docker run -d \
--name elasticsearch \
-e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
-e "discovery.type=single-node" \
-v es-data:/usr/share/elasticsearch/data \
-v es-logs:/usr/share/elasticsearch/logs \
-v es-plugins:/usr/share/elasticsearch/plugins \
--privileged \
--network somenetwork \
-p 9200:9200 \
-p 9300:9300 \
elasticsearch:7.17.10
```

```text
$ docker network create somenetwork
$ sudo mkdir -p /opt/elasticsearch/{data,logs,plugins}
$ sudo chown -R 1000 /opt/elasticsearch
$ docker run -d \
--name elasticsearch \
-e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
-e "discovery.type=single-node" \
-v /opt/elasticsearch/data:/usr/share/elasticsearch/data \
-v /opt/elasticsearch/logs:/usr/share/elasticsearch/logs \
-v /opt/elasticsearch/plugins:/usr/share/elasticsearch/plugins \
--privileged \
--network somenetwork \
-p 9200:9200 \
-p 9300:9300 \
elasticsearch:7.17.7
```

```text
docker run -d \
--name elasticsearch \
-e "discovery.type=single-node" \
-v /opt/elasticsearch/data/:/usr/share/elasticsearch/data \
-v /opt/elasticsearch/logs/:/usr/share/elasticsearch/logs \
-v /opt/elasticsearch/plugins/:/usr/share/elasticsearch/plugins \
--privileged \
--network somenetwork \
-p 9200:9200 \
-p 9300:9300 \
elasticsearch:7.17.10
```

```text
docker run -d \
--name elasticsearch \
-e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
-e "discovery.type=single-node" \
--privileged=true \
--network somenetwork \
-p 9200:9200 \
-p 9300:9300 \
elasticsearch:7.17.10
```

命令解释：

- `-e "cluster.name=es-docker-cluster"`：设置集群名称
- `-e "http.host=0.0.0.0"`：监听的地址，可以外网访问
- `-e "ES_JAVA_OPTS=-Xms512m -Xmx512m"`：内存大小
- `-e "discovery.type=single-node"`：非集群模式
- `-v es-data:/usr/share/elasticsearch/data`：挂载逻辑卷，绑定 ES 的数据目录
- `-v es-logs:/usr/share/elasticsearch/logs`：挂载逻辑卷，绑定 ES 的日志目录
- `-v es-plugins:/usr/share/elasticsearch/plugins`：挂载逻辑卷，绑定 ES 的插件目录
- `--privileged`：授予逻辑卷访问权限
- `--network es-net`：加入一个名为 `es-net` 的网络中

在浏览器中访问：

```text
http://192.168.80.130:9200
```

输出结果：

```json
{
  "name": "f2e0de0c07b7",
  "cluster_name": "docker-cluster",
  "cluster_uuid": "xJGRIlELRWmC4soelzKn_A",
  "version": {
    "number": "7.17.10",
    "build_flavor": "default",
    "build_type": "docker",
    "build_hash": "fecd68e3150eda0c307ab9a9d7557f5d5fd71349",
    "build_date": "2023-04-23T05:33:18.138275597Z",
    "build_snapshot": false,
    "lucene_version": "8.11.1",
    "minimum_wire_compatibility_version": "6.8.0",
    "minimum_index_compatibility_version": "6.0.0-beta1"
  },
  "tagline": "You Know, for Search"
}
```

## 部署 Kibana

Kibana 可以给我们提供一个 Elasticsearch 的可视化界面，便于我们学习。

### 部署

```text
docker pull kibana:7.17.10
```

运行 Docker 命令，部署 Kibana：

```text
$ docker run -d \
--name kibana \
-e ELASTICSEARCH_HOSTS=http://es:9200 \
--network=es-net \
-p 5601:5601 \
kibana:7.17.10
```

```text
$ docker run -d \
--name kibana \
-e ELASTICSEARCH_HOSTS=http://elasticsearch:9200 \
--network=somenetwork \
-p 5601:5601 \
kibana:7.17.7
```

命令解释：

- `--network es-net`：加入一个名为 `es-net` 的网络中，与 Elasticsearch 在同一个网络中
- `-e ELASTICSEARCH_HOSTS=http://es:9200`：设置 Elasticsearch 的地址，
  因为 Kibana 已经与 Elasticsearch 在一个网络，所以可以用容器名直接访问 Elasticsearch

### DevTools

![](/assets/images/elk/kibana/kibana-management-dev-tools.png)

## 部署 ES 集群

## Reference

- [Docker Hub](https://hub.docker.com/)
    - [elasticsearch](https://hub.docker.com/_/elasticsearch)
    - [kibana](https://hub.docker.com/_/kibana)
