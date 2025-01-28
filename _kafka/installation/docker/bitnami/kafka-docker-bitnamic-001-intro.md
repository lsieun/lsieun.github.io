---
title: "Intro"
sequence: "101"
---

```text
With the upcoming Kafka 4.0, Zookeeper will be entirely phased out, and only KRaft mode will be supported.

Starting from 3.3.1 version released on October 3, 2022, KRaft is completely production ready.

According to the current release plan, Kafka 3.7 (due January 2024) will be the last release to support Zookeeper.
```

## Docker 容器

### 目录

- 数据目录：`/bitnami/kafka`
- 安装目录：`/opt/bitnami/kafka`

```text
kafka:
  ...
  volumes:
    - /path/to/kafka-persistence:/bitnami/kafka
  ...
```

### 配置

Any environment variable beginning with `KAFKA_CFG_` will be mapped to its corresponding Apache Kafka key.
For example, use `KAFKA_CFG_BACKGROUND_THREADS` in order to set `background.threads` or
`KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE` in order to configure `auto.create.topics.enable`.

## Reference

- DockerHub
    - [bitnami/kafka](https://hub.docker.com/r/bitnami/kafka/)
    - [provectus/kafka-ui](https://github.com/provectus/kafka-ui)
- [Docker-Compose and Bitnami Image, Enhanced by Provectus Kafka-UI](https://medium.com/@tetianaokhotnik/setting-up-a-local-kafka-environment-in-kraft-mode-with-docker-compose-and-bitnami-image-enhanced-29a2dcabf2a9)
