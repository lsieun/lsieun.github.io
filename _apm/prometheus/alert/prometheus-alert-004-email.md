---
title: "邮件告警"
sequence: "104"
---

Alertmanager 内置了对 SMTP 协议的支持。

## 163 邮箱设置

使用SSL的通用配置如下：

- POP3服务器地址：pop.tom.com SSL加密协议端口号：`995`
- IMAP服务器地址：imap.tom.com SSL加密协议端口号：`993`
- SMTP服务器地址：smtp.tom.com SSL加密协议端口号：`465`

163 邮箱

| Server | Address        | Port  | SSL   |
|--------|----------------|-------|-------|
| `POP3` | `pop.163.com`  | `110` | `995` |
| `IMAP` | `imap.163.com` | `143` | `993` |
| `SMTP` | `smtp.163.com` | `25`  | `465` |

获取**授权密码**：

![](/assets/images/email/email-163-auth-password.png)

在 `alertmanager.yml` 文件中，需要设置 `smtp_auth_password`。

### AlertManager 配置

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
  group_interval: 10s
  repeat_interval: 1m
  receiver: 'email163'

receivers:
  - name: 'email163'
    email_configs:
      - to: 'jmliusen@163.com'
```

```yaml
global:
  resolve_timeout: 5m
  smtp_from: 'jmliusen@163.com'
  smtp_auth_username: 'jmliusen@163.com'
  smtp_auth_password: 'XXXXXXXXXXXXXXXX'
  smtp_smarthost: 'smtp.163.com:25'
  smtp_require_tls: false

route:
  group_by: ['alertname']
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
    equal: ['alertname', 'dev', 'instance']
```

注意：如果发送不了邮件，需要把日志调为 `--debug` 模式，有些邮件服务商可能要设置 `smtp_require_tls: true`

### Prometheus 配置

#### 连接 AlertManager

在 `prometheus.yml` 文件中，修改 `alerting` 配置项：

```yaml
# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - 192.168.80.1:9093
```

#### 配置规则文件

在 `prometheus.yml` 文件中，修改 `rule_files` 配置项：

```yaml
# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  - "rules/*.yml"
```

添加 `rules/hardware-alerts.yml` 具体规则文件：

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
          description: Failed to scrape {{ $labels.job }} on {{ $labels.instance }} for more than 3 minutes. Node seems down.
```
{% endraw %}
{% endhighlight %}

### 报警确认

#### Prometheus 确认

访问地址：

```text
http://localhost:9090/alerts
```

报警内容：

![](/assets/images/prometheus/prometheus-alerts-node-down-example.png)

#### 邮件确认

![](/assets/images/email/email-letter-prometheus-alert-manager.png)


