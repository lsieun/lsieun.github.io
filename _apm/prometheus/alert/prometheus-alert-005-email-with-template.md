---
title: "邮件告警（模板）"
sequence: "105"
---

## 自定义邮件模板

首先，创建一个模板文件 `email.tmpl`：

```text
$ mkdir -p /etc/alertmanager-tmpl && cd /etc/alertmanager-tmpl
$ vi email.tmpl
```

{% highlight text %}
{% raw %}

```text
{{ define "email.from" }}jmliusen@163.com{{ end }}
{{ define "email.to" }}jmliusen@163.com{{ end }}
{{ define "email.to.html" }}
{{ range .Alerts }}
=========start=========<br>
告警程序：prometheus_alert <br>
告警级别：{{ .Labels.severity }} 级 <br>
告警类别：{{ .Labels.alertname }} <br>
故障主机：{{ .Labels.instance }} <br>
告警主题：{{ .Annotations.title }} <br>
告警详情：{{ .Annotations.description }} <br>
触发时间：{{ .StartsAt.Format "2019-08-04 16:58:15" }} <br>
=========end=========<br>
{{ end }}
{{ end }}
```

{% endraw %}
{% endhighlight %}

在上面的模板文件中，配置了 `email.from`、`email.to`、`email.to.html` 三种模板变量，可以在 `alertmanager.yml` 文件中直接配置引用。

- `email.to.html` 就是要发送的邮件内容，支持 Html 和 Text 格式。
- `{{ range .Alerts }}` 是个循环语法，是个循环语法，用于循环获取匹配的 Alerts 的信息。

在 `alertmanager.yml` 中，

```yaml
templates:
  - '/usr/local/alertmanager/template/*.tmpl'
```

{% highlight yaml %}
{% raw %}

```yaml
global:
  resolve_timeout: 5m
  smtp_from: '{{ template "email.from" . }}'
  smtp_auth_username: '{{ template "email.from" . }}'
  smtp_auth_password: 'XXXXXXXXXXXXXXXX'    # 授权密码
  smtp_smarthost: 'smtp.163.com:25'
  smtp_require_tls: false

templates:
  - '/etc/alertmanager-tmpl/*.tmpl'

route:
  group_by: [ 'alertname' ]
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1m
  receiver: 'email163'

receivers:
  - name: 'email163'
    email_configs:
      - to: '{{ template "email.to" . }}'
        html: '{{ template "email.to.html" . }}'
        send_resolved: true

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: [ 'alertname', 'dev', 'instance' ]
```

{% endraw %}
{% endhighlight %}

## 能发送成功

{% highlight text %}
{% raw %}

```yaml
global:
  resolve_timeout: 5m
  smtp_from: 'jmliusen@163.com'
  smtp_auth_username: 'jmliusen@163.com'
  smtp_auth_password: 'XXXXXXXXXXXXXXXX'
  smtp_smarthost: 'smtp.163.com:25'
  smtp_require_tls: false

templates:
  - 'templates/email.tmpl'

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
      - to: '{{ template "email.to" . }}'
        html: '{{ template "email.to.html" . }}'
        send_resolved: true


inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'dev', 'instance']
```

{% endraw %}
{% endhighlight %}

## 示例二

### alertmanager.yml

{% highlight text %}
{% raw %}

```yaml
global:
  resolve_timeout: 5m
  smtp_from: 'jmliusen@163.com'
  smtp_auth_username: 'jmliusen@163.com'
  smtp_auth_password: 'XXXXXXXXXXXXXXXX'
  smtp_smarthost: 'smtp.163.com:25'
  smtp_require_tls: false

templates:
  - 'templates/*.tmpl'

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
        html: '{{ template "email.to.html" . }}'
        send_resolved: true

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: [ 'alertname', 'dev', 'instance' ]
```

{% endraw %}
{% endhighlight %}

### email.tmpl

{% highlight text %}
{% raw %}

```text
{{ define "email.to.html" }}
{{ range .Alerts }}
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
</head>
<body style="margin: 0; padding: 0;">
<div>
    <table border="1">
        <tr>
            <th><b>告警项</b></th>
            <th><b>内容信息</b></th>
        </tr>
        <tr>
            <td style="font-family:微软雅黑;width: 20%">告警标题</td>
            <td style="font-family:微软雅黑;width: 80%">
                {{ .Annotations.title }}
            </td>
        </tr>
        <tr>
            <td style="font-family:微软雅黑;width: 20%">告警描述</td>
            <td style="font-family:微软雅黑;width: 80%">
                {{ .Annotations.description }}
            </td>
        </tr>
        <tr>
            <td style="font-family:微软雅黑;width: 20%">告警等级</td>
            <td style="font-family:微软雅黑;width: 80%">
                {{ .Labels.severity }}
            </td>
        </tr>
        <tr>
            <td style="font-family:微软雅黑;width: 20%">告警时间</td>
            <td style="font-family:微软雅黑;width: 80%">
                {{ .StartsAt.Format "2006-01-02 15:04:05" }}
            </td>
        </tr>
        <tr>
            <td style="font-family:微软雅黑;width: 20%">告警主机</td>
            <td style="font-family:微软雅黑;width: 80%">
                {{ .Labels.instance }}
            </td>
        </tr>
    </table>
</body>
</html>
{{ end }}
{{ end }}
```

{% endraw %}
{% endhighlight %}



## Reference

- [如何搭建 Prometheus 监控报警及自定义邮件模板](https://www.yisu.com/zixun/22581.html)
