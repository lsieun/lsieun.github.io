---
title: "Elasticsearch"
sequence: "elasticsearch"
---

Elasticsearch is a distributed, RESTful search and analytics engine
capable of solving a growing number of use cases.
As the heart of the Elastic Stack, it centrally stores your data,
so you can discover the expected and uncover the unexpected.

```text
docker pull docker.elastic.co/elasticsearch/elasticsearch:7.17.10
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.8.1
```

## Running in Development Mode

Create user defined network (useful for connecting to other services attached to the same network (e.g. Kibana)):

```text
$ docker network create somenetwork
```

Run Elasticsearch:

```text
$ docker run -d --name elasticsearch --net somenetwork -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:tag
```

## Reference

- [elasticsearch](https://hub.docker.com/_/elasticsearch)
- [Install Elasticsearch with Docker](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html)
