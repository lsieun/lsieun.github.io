---
title: "Alert Intro"
sequence: "101"
---

Alerting with Prometheus is separated into two parts.

- Alerting rules in Prometheus servers send alerts to an Alertmanager.
- The Alertmanager then manages those alerts,
  including silencing, inhibition, aggregation and sending out notifications via methods
  such as email, on-call notification systems, and chat platforms.

The main steps to setting up alerting and notifications are:

- Setup and configure the Alertmanager
- Configure Prometheus to talk to the Alertmanager
- Create alerting rules in Prometheus


```text
Prometheus   --------------------------->   AlertManager
(3) 报警规则         (2) 建立关系                (1) 启动
```

## Alertmanager

### Grouping

Grouping categorizes alerts of similar nature into a single notification.
This is especially useful during larger outages
when many systems fail at once and hundreds to thousands of alerts may be firing simultaneously.

Grouping of alerts, timing for the grouped notifications,
and the receivers of those notifications are configured by a routing tree in the configuration file.

```text
如何配置
```

### Inhibition

Inhibition is a concept of suppressing notifications for certain alerts
if certain other alerts are already firing.

Example: An alert is firing that informs that an entire cluster is not reachable.
Alertmanager can be configured to mute all other alerts concerning this cluster if that particular alert is firing.
This prevents notifications for hundreds or thousands of firing alerts that are unrelated to the actual issue.

```text
场景
```

Inhibitions are configured through the Alertmanager's configuration file.

```text
实现方式：配置文件
```

### Silences

Silences are a straightforward way to simply mute alerts for a given time.
A silence is configured based on matchers, just like the routing tree.
Incoming alerts are checked whether they match all the equality or regular expression matchers of an active silence.
If they do, no notifications will be sent out for that alert.

Silences are configured in the web interface of the Alertmanager.

```text
实现方式：Web 界面
```

### High Availability

Alertmanager supports configuration to create a cluster for high availability.
This can be configured using the `--cluster-*` flags.

It's important not to load balance traffic between Prometheus and its Alertmanagers,
but instead, point Prometheus to a list of all Alertmanagers.

### 配置 AlertManager

```yaml
route: # 根据标签匹配，确定当前告警应该如何处理
  group_by: [ 'alertname' ] # 告警应该根据哪些标签进行分组，不分组可以指定 ...
  group_wait: 30s     # 同一组的告警发出前要等待多少秒，这个是为了把更多的告警一个批次发出去
  group_interval: 5m  # 同一组的多批次告警间隔多少秒后，才能发出
  repeat_interval: 1h # 重复的告警要等待多久后才能再次发出去
  receiver: 'web.hook'
receivers: # 接收人是一个抽象概念，它可以是一个邮箱，也可以是微信，Slack 或者 Webhook 等，接收人一般配合告警路由使用
  - name: 'web.hook'
    webhook_configs:
      - url: 'http://127.0.0.1:5001/'
inhibit_rules: # 合理设置抑制规则，可以减少垃圾告警的产生
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: [ 'alertname', 'dev', 'instance' ]
```

```yaml
route:
  group_by: ['alertname']
  group_wait: 30s
  group_interval: 30s
  repeat_interval: 1m
  receiver: 'web.hook'
receivers:
  - name: 'web.hook'
    webhook_configs:
      - url: 'http://127.0.0.1:5001/'
inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'dev', 'instance']
```

## Reference

- [第3章 Prometheus 告警处理](https://www.prometheus.wang/alert/)
- [Prometheus Alerting with AlertManager](https://medium.com/devops-dudes/prometheus-alerting-with-alertmanager-e1bbba8e6a8e)

文档：

- [ALERTING OVERVIEW](https://prometheus.io/docs/alerting/latest/overview/)

示例：

- [Prometheus alerts examples](https://alex.dzyoba.com/blog/prometheus-alerts/)
