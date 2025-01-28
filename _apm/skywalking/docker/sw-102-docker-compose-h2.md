---
title: "H2 + OAP Server + UI (Docker Compose)"
sequence: "102"
---

```text
$ mkdir skywalking && cd skywalking
$ vi compose.yaml
```

## 第 1 个版本

```yaml
services:
  oap-server:
    image: apache/skywalking-oap-server:9.4.0-java17
    container_name: oap-server
    ports:
      - 11800:11800
      - 12800:12800
    environment:
      TZ: Asia/Shanghai
  oap-ui:
    image: apache/skywalking-ui:v9.4.0-java17
    container_name: oap-ui
    depends_on:
      - oap-server
    ports:
      - 8080:8080
    environment:
      SW_OAP_ADDRESS: http://oap-server:12800
```


## 第 2 个版本

```yaml
services:
  oap-server-service:
    image: apache/skywalking-oap-server:9.4.0-java17
    container_name: oap-server-container
    ports:
      - 11800:11800
      - 12800:12800
    environment:
      TZ: Asia/Shanghai
  oap-ui-service:
    image: apache/skywalking-ui:v9.4.0-java17
    container_name: oap-ui-container
    depends_on:
      - oap-server-service
    ports:
      - 8080:8080
    environment:
      SW_OAP_ADDRESS: http://oap-server-container:12800
```

## 第 3 个版本

```yaml
services:
  oap-server:
    image: apache/skywalking-oap-server:9.4.0-java17
    container_name: oap-server
    restart: always
    ports:
      - 11800:11800
      - 12800:12800
    environment:
      SW_CORE_RECORD_DATA_TTL: 15
      SW_CORE_METRICS_DATA_TTL: 15
      SW_ENABLE_UPDATE_UI_TEMPLATE: true
      TZ: Asia/Shanghai
      JAVA_OPTS: "-Xms2048m -Xmx2048m"
  oap-ui:
    image: apache/skywalking-ui:v9.4.0-java17
    container_name: oap-ui
    depends_on:
      - oap-server
    links:
      - oap-server
    restart: always
    ports:
      - 8080:8080
    environment:
      SW_OAP_ADDRESS: http://oap-server:12800
```
