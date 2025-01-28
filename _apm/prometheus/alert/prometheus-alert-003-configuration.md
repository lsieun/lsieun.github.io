---
title: "Configuration"
sequence: "103"
---

Alertmanager can reload its configuration at runtime.
If the new configuration is not well-formed, the changes will not be applied and an error is logged.
A configuration reload is triggered by sending a `SIGHUP` to the process or
sending an HTTP POST request to the `/-/reload` endpoint.

## Configuration file

To specify which configuration file to load, use the `--config.file` flag.

```text
./alertmanager --config.file=alertmanager.yml
```

```yaml
route:
  group_by: [ 'alertname' ]
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 1h
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
    equal: [ 'alertname', 'dev', 'instance' ]
```

## alertmanager.yml

- `global`：全局配置，包括报警解决后的超时时间、SMTP相关配置、各种渠道通知的API地址等消息。
- `route`：用来设置报警的分发策略。
- `receivers`：配置报警信息接收者信息。
- `inhibit_rules`：抑制规则配置，当存在与另一个匹配的报警时，抑制规则将禁用用于有匹配的警报。

在使用邮件告警时，一般使用如下格式：

{% highlight text %}
{% raw %}

```text
告警时间: {{ ($alert.StartsAt.Add 28800e9).Format "2006-01-02 15:04:05" }}
```

{% endraw %}
{% endhighlight %}

其中 `Add 28800e9` 表示在基准时间上添加 8 小时，`28800e9` 是 `8` 小时的纳秒数。这就是从UTC时间转换到北京东八区时间。

## Reference

- [Prometheus Alertmanager 告警模板](https://blog.csdn.net/u010039418/article/details/111369486)
