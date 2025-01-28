---
title: "快速开始2"
sequence: "102"
---

```text
docker pull mysql:8.1.0-oracle
docker pull nacos/nacos-server:v2.2.3
docker pull apache/skywalking-oap-server:9.6.0
docker pull apache/skywalking-ui:9.6.0
```

File: `compose.yaml`

```yaml
services:
  oap:
    container_name: oap
    image: apache/skywalking-oap-server:9.6.0
    restart: always
    ports:
      - "11800:11800"
      - "12800:12800"
  oap-ui:
    container_name: oap-ui
    image: apache/skywalking-ui:9.6.0
    restart: always
    environment:
      SW_OAP_ADDRESS: http://oap:12800
    ports:
      - "8080:8080"
    depends_on:
      - oap
```

```text
$ docker compose up -d
```

```text
http://192.168.80.130:8080/
```

```yaml
services:
  mysql:
    container_name: mysql
    image: mysql:8.1.0-oracle
    restart: always
    environment:
      - MYSQL_ROOT_PASSWORD=root
    ports:
      - "3306:3306"
  nacos:
    container_name: nacos
    image: nacos/nacos-server:v2.2.3
    restart: always
    environment:
      - PREFER_HOST_MODE=hostname
      - MODE=standalone
      - NACOS_AUTH_IDENTITY_KEY=abcd
      - NACOS_AUTH_IDENTITY_VALUE=1234
      - NACOS_AUTH_TOKEN=SecretKey0123456789876543210
    depends_on:
      - mysql
    ports:
      - "7848:7848"
      - "8848:8848"
      - "9848:9848"
  oap:
    container_name: oap
    image: apache/skywalking-oap-server:9.6.0
    restart: always
    ports:
      - "11800:11800"
      - "12800:12800"
  oap-ui:
    container_name: oap-ui
    image: apache/skywalking-ui:9.6.0
    restart: always
    environment:
      SW_OAP_ADDRESS: http://oap:12800
    ports:
      - "8080:8080"
    depends_on:
      - oap
```

```text
-Dskywalking.agent.service_name=c-service
-Dskywalking.logging.file_name=c-service-api.log
```
