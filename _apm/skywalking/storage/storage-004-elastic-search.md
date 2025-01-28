---
title: "ElasticSearch"
sequence: "104"
---

ElasticSearch 不支持 root 账号启动

```text
chown -R elasticsearch:elasticsearch elasticsearch-7.17.0/
```

```text
vi config/jvm.options
```

ElasticSearch 配置的内容，不建议越过物理内存的一半。例如，物理内存是 8G，ElasticSearch 最大设置的内存不超过 4G。

```text
bin/elasticsearch -d
```

```text
tail -f logs/elasticsearch.log
```

```text
curl http://localhost:9200
```
