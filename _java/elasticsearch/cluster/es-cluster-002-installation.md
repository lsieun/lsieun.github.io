---
title: "搭建 ES 集群"
sequence: "102"
---

## 集群环境安装

```text
$ sudo mkdir -p /opt/elasticsearch/{data01,data02,data03}
$ sudo chown -R 1000 /opt/elasticsearch
```

```text
$ cd /opt/elasticsearch/
$ vi compose.yaml
```

```yaml
services:
  es01:
    image: elasticsearch:7.17.7
    container_name: es01
    environment:
      - node.name=es01
      - cluster.name=es-docker-cluster
      - cluster.initial_master_nodes=es01,es02,es03
      - discovery.seed_hosts=es02,es03
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - /opt/elasticsearch/data01:/usr/share/elasticsearch/data
    ports:
      - 9201:9200
    networks:
      - elk-network
  es02:
    image: elasticsearch:7.17.7
    container_name: es02
    environment:
      - node.name=es02
      - cluster.name=es-docker-cluster
      - cluster.initial_master_nodes=es01,es02,es03
      - discovery.seed_hosts=es01,es03
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - /opt/elasticsearch/data02:/usr/share/elasticsearch/data
    ports:
      - 9202:9200
    networks:
      - elk-network
  es03:
    image: elasticsearch:7.17.7
    container_name: es03
    environment:
      - node.name=es03
      - cluster.name=es-docker-cluster
      - cluster.initial_master_nodes=es01,es02,es03
      - discovery.seed_hosts=es01,es02
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - /opt/elasticsearch/data03:/usr/share/elasticsearch/data
    ports:
      - 9203:9200
    networks:
      - elk-network
volumes:
  data01:
    driver: local
  data02:
    driver: local
  data03:
    driver: local

networks:
  elk-network:
    driver: bridge
```

```yaml
services:
  es01:
    image: elasticsearch:7.17.7
    container_name: es01
    environment:
      - node.name=es01
      - cluster.name=es-docker-cluster
      - cluster.initial_master_nodes=es01,es02,es03
      - discovery.seed_hosts=es02,es03
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - data01:/usr/share/elasticsearch/data
    ports:
      - 9201:9200
    networks:
      - elk-network
  es02:
    image: elasticsearch:7.17.7
    container_name: es02
    environment:
      - node.name=es02
      - cluster.name=es-docker-cluster
      - cluster.initial_master_nodes=es01,es02,es03
      - discovery.seed_hosts=es01,es03
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - data02:/usr/share/elasticsearch/data
    ports:
      - 9202:9200
    networks:
      - elk-network
  es03:
    image: elasticsearch:7.17.7
    container_name: es03
    environment:
      - node.name=es03
      - cluster.name=es-docker-cluster
      - cluster.initial_master_nodes=es01,es02,es03
      - discovery.seed_hosts=es01,es02
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - data03:/usr/share/elasticsearch/data
    ports:
      - 9203:9200
    networks:
      - elk-network

volumes:
  data01:
    driver: local
  data02:
    driver: local
  data03:
    driver: local

networks:
  elk-network:
    driver: bridge
```

ES 运行时，需要修改一些 Linux 系统权限，修改 `/etc/sysctl.conf` 文件：

```text
sudo vi /etc/sysctl.conf
```

添加如下内容：

```text
vm.max_map_count=262144
```

然后执行命令，让配置生效：

```text
$ sudo sysctl -p
vm.max_map_count = 262144
```

```text
docker compose up -d
```

## 集群状态监控

Kibana 可以监控 Elasticsearch 集群，不过新版本需要依赖 ES 的 x-pack 功能，配置比较复杂。

这里推荐使用 cerebro 来监控 ES 集群状态：

```text
https://github.com/lmenezes/cerebro
```

cerebro is an open source(MIT License) elasticsearch web admin tool
built using Scala, Play Framework, AngularJS and Bootstrap.

- Requirements: cerebro needs **Java 11** or newer to run.



解压 `cerebro-0.9.4.zip` 文件，进入 `bin` 目录，执行 `cerebro.bat` 文件：

> 注意：我使用 JDK 17 的时候，出错了；后来切换成了 JDK 8，可以运行

![](/assets/images/elk/cerebro/cerebro-bin-bat.png)

在浏览器中访问：

```text
http://localhost:9000/
```

在 Node address 中，输入：

```text
http://192.168.80.130:9201
```

![](/assets/images/elk/cerebro/cerebro-node-address-connect.png)

![](/assets/images/elk/cerebro/cerebro-web-overview.png)

![](/assets/images/elk/cerebro/cerebro-web-overview-02.png)

## 创建索引库

### Kibana

利用 Kibana 的 DevTools 创建索引库：

```text
PUT /student
{
    "settings": {
        "number_of_shards": 3,     // 分片数量 
        "number_of_replicas": 1    // 副本数量
    },
    "mappings": {
        "properties": {
            // mapping 映射定义 ...
        }
    }
}
```

### Cerebro

利用 Cerebro 也可以创建索引库：

![](/assets/images/elk/cerebro/cerebro-web-more-create-index.png)

![](/assets/images/elk/cerebro/cerebro-web-more-create-index-student.png)

![](/assets/images/elk/cerebro/cerebro-web-more-create-index-student-overview.png)


## Virtual Memory

Elasticsearch uses a `mmapfs` directory by default to store its indices.
The default operating system limits on `mmap` counts is likely to be too low,
which may result in out of memory exceptions.

> 说明原因

On Linux, you can increase the limits by running the following command as `root`:

> 临时设置

```text
sysctl -w vm.max_map_count=262144
```

To set this value permanently, update the `vm.max_map_count` setting in `/etc/sysctl.conf`.
To verify after rebooting, run `sysctl vm.max_map_count`.

> 永久设置

The RPM and Debian packages will configure this setting automatically. No further configuration is required.

> RPM 和 Debian 版本会自动设置此值

## Reference

- [Virtual Memory][virtual-memory-url] 解释 `vm.max_map_count`

[virtual-memory-url]: https://www.elastic.co/guide/en/elasticsearch/reference/current/vm-max-map-count.html
