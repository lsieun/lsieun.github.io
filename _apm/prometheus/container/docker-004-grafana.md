---
title: "Grafana"
sequence: "104"
---

## Grafana

### 拉取镜像

```text
$ docker pull grafana/grafana:10.0.2
```

### 启动

```text
$ docker run --name grafana \
  -d --rm \
  -p 3000:3000 \
  grafana/grafana:10.0.2
```

### 复制文件

```text
$ docker exec -it grafana /bin/bash

$ whoami
grafana

$ cat /etc/passwd
...
nobody:x:65534:65534:nobody:/:/sbin/nologin
grafana:x:472:0:Linux User,,,:/home/grafana:/sbin/nologin

$ ps aux
PID   USER     TIME  COMMAND
    1 grafana   0:03 grafana server --homepath=/usr/share/grafana --config=/etc/grafana/grafana.ini --packaging=...
```

```text
$ sudo mkdir -p /opt/grafana
$ sudo docker cp grafana:/etc/grafana/ /opt/grafana/config
$ sudo docker cp grafana:/var/lib/grafana /opt/grafana/data
$ sudo chown -R 472 /opt/grafana
```

### 重新启动

```text
$ docker run -d --name grafana \
  -p 3000:3000 \
  -v /opt/grafana/config/:/etc/grafana/ \
  -v /opt/grafana/data/:/var/lib/grafana/ \
  grafana/grafana:10.0.2
```

## Web 页面

```text
http://192.168.80.130:3000
```

- Username: `admin`
- Password: `admin`

### 添加数据源：

![](/assets/images/grafana/grafana-administration-data-source-prometheus.png)

### Dashboard

```text
https://grafana.com/grafana/dashboards/
```

![](/assets/images/grafana/grafana-dashboard-new-import.png)

```text
https://grafana.com/grafana/dashboards/8919-1-node-exporter-for-prometheus-dashboard-cn-0413-consulmanager/
```

![](/assets/images/grafana/grafana-dashboard-import-load.png)

![](/assets/images/grafana/grafana-dashboard-new-prometheus-import.png)
