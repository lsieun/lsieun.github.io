---
title: "Hardware"
sequence: "101"
---

## Node Down

File: `hardware-alerts.yml`

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

## AllInstances

{% highlight text %}
{% raw %}

```yaml
groups:
  - name: AllInstances
    rules:
      - alert: InstanceDown
        # Condition for alerting
        expr: up == 0
        for: 1m
        # Annotation - additional informational labels to store more information
        annotations:
          title: 'Instance {{ $labels.instance }} down'
          description: '{{ $labels.instance }} of job {{ $labels.job }} has been down for more than 1 minute.'
        # Labels - additional labels to be attached to the alert
        labels:
          severity: 'critical'
```

{% endraw %}
{% endhighlight %}
