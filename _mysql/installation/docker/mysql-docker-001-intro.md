---
title: "MySQL Docker Image"
sequence: "101"
---

## mysql

```text
docker pull mysql:latest
```

## bitnami/mysql

```text
docker pull bitnami/mysql:latest
docker pull bitnami/mysql:8.0
```

```text
docker run --name mysql -e ALLOW_EMPTY_PASSWORD=yes bitnami/mysql:latest
```

```text
docker pull bitnami/mysqld-exporter:latest
```

## Reference

- [mysql](https://hub.docker.com/_/mysql)
- [bitnami/mysql](https://hub.docker.com/r/bitnami/mysql)
- [bitnami/mysqld-exporter](https://hub.docker.com/r/bitnami/mysqld-exporter)
