---
title: "NodeExporter"
sequence: "102"
---

## 拉取镜像

```text
$ docker pull prom/node-exporter:v1.6.1
```

## Docker Run

```text
$ docker run -d \
  --name="node-exporter" \
  --rm \
  -p 9100:9100 \
  -v "/:/host:ro,rslave" \
  prom/node-exporter:v1.6.1 \
  --path.rootfs=/host
```

```text
$ docker run -d \
  --name="node-exporter" \
  -p 9010:9100 \
  -h "MyNodeEx" \
  -v "/proc:/host/proc:ro" \
  -v "/sys:/host/sys:ro" \
  -v "/:/rootfs:ro" \
  prom/node-exporter:v1.6.1
```

```text
$ docker exec -it node-exporter /bin/sh
$ cat /etc/hostname
```

```text
http://192.168.80.130:9010/metrics
```

```text
docker run -d \
  --net="host" \
  --pid="host" \
  -v "/:/host:ro,rslave" \
  prom/node-exporter:v1.6.1 \
  --path.rootfs=/host
```

```text
services:
  node_exporter:
    image: prom/node-exporter:v1.6.1
    container_name: node_exporter
    command:
      - '--path.rootfs=/host'
    network_mode: host
    pid: host
    restart: unless-stopped
    volumes:
      - '/:/host:ro,rslave'
```

## Prometheus 配置

```text
$ sudo vi /opt/prometheus/config/prometheus.yml
```

```yaml
scrape_configs:
  - job_name: "node"
    static_configs:
      - targets: [ "192.168.80.130:9100" ]
        labels:
          serviceId: nodeServiceId
          serviceName: Node采集服务
```
