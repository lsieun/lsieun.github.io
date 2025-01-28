---
title: "Prometheus"
sequence: "101"
---

## 拉取镜像

```text
$ docker pull prom/prometheus:v2.45.0
```

## 运行

```text
$ docker run --name prometheus -d --rm -p 9090:9090 prom/prometheus:v2.45.0
```

浏览器访问：

```text
http://192.168.80.130:9090/
```

进入容器：

- 查看进程
- 查看用户
- 查看程序的数据和配置目录

```text
$ docker exec -it prometheus /bin/sh

$ ps aux
PID   USER     TIME  COMMAND
    1 nobody    0:00 /bin/prometheus --config.file=/etc/prometheus/prometheus.yml --storage.tsdb.path=/prometheus ...

$ cat /etc/passwd
root:x:0:0:root:/root:/bin/sh
daemon:x:1:1:daemon:/usr/sbin:/bin/false
bin:x:2:2:bin:/bin:/bin/false
sys:x:3:3:sys:/dev:/bin/false
sync:x:4:100:sync:/bin:/bin/sync
mail:x:8:8:mail:/var/spool/mail:/bin/false
www-data:x:33:33:www-data:/var/www:/bin/false
operator:x:37:37:Operator:/var:/bin/false
nobody:x:65534:65534:nobody:/home:/bin/false

$ ls /etc/prometheus/
console_libraries  consoles           prometheus.yml
```

## Docker + Volume

```text
$ sudo mkdir -p /opt/prometheus/
```

```text
$ sudo docker cp prometheus:/etc/prometheus/ /opt/prometheus/config
```

```text
$ sudo chown -R 65534 /opt/prometheus
```

```text
$ sudo vi /opt/prometheus/config/prometheus.yml
```

```yaml
# my global config
global:
  scrape_interval: 15s
  evaluation_interval: 15s

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - 192.168.80.130:9093

# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  - "rules/*.yml"

# A scrape configuration containing exactly one endpoint to scrape:
scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: [ "localhost:9090" ]
```

```text
$ docker run --name prometheus -p 9090:9090 -v /opt/prometheus/config/:/etc/prometheus/ prom/prometheus:v2.45.0
```

## Docker Compose

```yaml
services:
  prometheus:
    image: prom/prometheus:v2.45.0
    container_name: prometheus
    restart: on-failure:1
    ports:
      - "9090:9090"
    deploy:
      resources:
        limits:
          memory: 2G
```

```text
$ mkdir ~/prometheus
$ cd ~/prometheus/
$ vi compose.yaml
$ docker compose up
```

```yaml
services:
  prometheus:
    image: prom/prometheus:v2.45.0
    container_name: prometheus
    restart: on-failure:1
    ports:
      - "9090:9090"
    volumes:
      - /opt/prometheus/config:/etc/prometheus
    deploy:
      resources:
        limits:
          memory: 2G
```

```text
$ docker compose up -d
$ docker compose logs -f prometheus
```

## Prometheus 配置

```text
data source --> pull --> data center --> rule --> evaluate
```

从 Prometheus 的容器中，有一个 `/etc/prometheus/prometheus.yml`，内容如下：

```yaml
# my global config
global:
  # 采集数据的时间间隔
  scrape_interval: 15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
  # scrape_timeout is set to the global default (10s).

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
          # - alertmanager:9093

# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
# - "first_rules.yml"
# - "second_rules.yml"
# - "rules/*.yml"

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: "prometheus"

    # metrics_path defaults to '/metrics'
    # scheme defaults to 'http'.

    static_configs:
      - targets: [ "localhost:9090" ]
        labels:
          serviceId: prometheus
          serviceName: 普罗米修斯
```
