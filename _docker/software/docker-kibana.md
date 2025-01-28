---
title: "Kibana"
sequence: "kibana"
---

## Running in Development Mode

In the given example, Kibana will attach to a user defined network
(useful for connecting to other services (e.g. Elasticsearch)).
If network has not yet been created, this can be done with the following command:

```text
$ docker network create somenetwork
```

Note: In this example,
Kibana is using the default configuration and expects to connect to
a running Elasticsearch instance at `http://localhost:9200`

Run Kibana

```text
$ docker run -d --name kibana --net somenetwork -p 5601:5601 kibana:tag
$ docker run -d --name kibana --net somenetwork -e ELASTICSEARCH_HOSTS=http://elasticsearch:9200 -p 5601:5601 kibana:tag
```

Kibana can be accessed by browser via `http://localhost:5601` or `http://host-ip:5601`

## Reference

- [kibana](https://hub.docker.com/_/kibana)
- [Install Kibana with Docker](https://www.elastic.co/guide/en/kibana/current/docker.html)
