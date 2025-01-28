---
title: "ES7 + OAP Server + UI (Docker Compose)"
sequence: "102"
---

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
      SW_STORAGE: elasticsearch
      SW_STORAGE_ES_CLUSTER_NODES: elasticsearch:9200
      SW_ENABLE_UPDATE_UI_TEMPLATE: true
      TZ: Asia/Shanghai
      JAVA_OPTS: "-Xms2048m -Xmx2048m"
  ui:
    image: docker.io/apache/skywalking-ui:9.4.0
    container_name: ui
    depends_on:
      - oap
    links:
      - oap
    restart: always
    ports:
      - 8080:8080
    environment:
      SW_OAP_ADDRESS: http://oap:12800
```

