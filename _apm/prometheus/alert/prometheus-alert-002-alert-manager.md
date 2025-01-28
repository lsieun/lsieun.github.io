---
title: "AlertManager"
sequence: "102"
---

## 下载

```text
https://prometheus.io/download/
```

## 启动

```text
$ alertmanager
```

```text
$ alertmanager --config.file=<your_file>
```

```text
$ alertmanager --log.level=debug
```

## 访问：

```text
http://192.168.80.1:9093/
```

## Prometheus 配置

### 连接 AlertManager

在 `prometheus.yml` 文件中，对 `alerting` 部分进行修改：

```yaml
# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - 192.168.80.1:9093
```

Prometheus 可以连接多个 AlertManager：

```yaml
alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager1:9093
            - alertmanager2:9093
            - alertmanager3:9093
```

### 配置报警规则

在 `prometheus.yml` 文件中，对 `rule_files` 部分进行修改：

```yaml
# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  - "rules/*.yml"
```

File: `rules/hardware-alerts.yml`

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
