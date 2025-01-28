---
title: "AlertManager"
sequence: "103"
---

## 拉取镜像

```text
$ docker pull prom/alertmanager:v0.25.0
```

## Docker Run

```text
$ docker run --name alertmanager -d --rm -p 9093:9093 prom/alertmanager:v0.25.0
```

进入容器：

- 查看进程
- 查看当前用户
- 查看程序的数据和配置目录

```text
$ docker exec -it alertmanager /bin/sh

$ ps aux
PID   USER     TIME  COMMAND
    1 nobody    0:00 /bin/alertmanager --config.file=/etc/alertmanager/alertmanager.yml --storage.path=/alertmanager

$ whoami
nobody

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


```

```text
$ sudo mkdir -p /opt/alertmanager
$ sudo docker cp alertmanager:/etc/alertmanager /opt/alertmanager/config
$ sudo chown -R 65534 /opt/alertmanager
```

## Docker + Volume

```text
$ sudo vi /opt/alertmanager/config/alertmanager.yml
```

```yaml
global:
  resolve_timeout: 5m
  smtp_from: 'jmliusen@163.com'
  smtp_auth_username: 'jmliusen@163.com'
  smtp_auth_password: 'XXXXXXXXXXXXXXXX'    # 授权密码
  smtp_smarthost: 'smtp.163.com:25'
  smtp_require_tls: false

route:
  group_by: [ 'alertname' ]
  group_wait: 10s
  group_interval: 30s
  repeat_interval: 1m
  receiver: 'email163'

receivers:
  - name: 'web.hook'
    webhook_configs:
      - url: 'http://127.0.0.1:5001/'
  - name: 'email163'
    email_configs:
      - to: 'jmliusen@163.com'

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: [ 'alertname', 'dev', 'instance' ]
```

```text
$ docker run --name alertmanager -d -p 9093:9093 \
-v /opt/alertmanager/config/:/etc/alertmanager/ \
prom/alertmanager:v0.25.0
```

## Prometheus 配置

```text
$ sudo vi /opt/prometheus/config/prometheus.yml
```

### 连接 AlertManager

```yaml
# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - 192.168.80.130:9093
```

### 配置 Prometheus 报警规则

```yaml
# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  - "rules/*.yml"
```

```text
$ cd /opt/prometheus/config/
$ sudo mkdir rules
$ cd rules/
$ sudo vi server-alert.yml
```

File: `server-alert.yml`

{% highlight text %}
{% raw %}

```yaml
groups:
  - name: Hardware alerts
    rules:
      - alert: Node down
        expr: up{job="node"} == 0
        for: 1m
        labels:
          severity: warning
        annotations:
          title: Node {{ $labels.instance }} is down
          description: Failed to scrape {{ $labels.job }} on {{ $labels.instance }} for more than 1 minutes. Node seems down.
```

{% endraw %}
{% endhighlight %}

### 目录权限

```text
$ sudo chown -R 65534 /opt/prometheus
```

