---
title: "Intro"
sequence: "101"
---

Prometheus 的配置文件是 YAML 格式，它提供了一个默认的配置文件 `prometheus.yml`。

```yaml
global:
  scrape_interval:     15s
  evaluation_interval: 15s

rule_files:
  # - "first.rules"
  # - "second.rules"

scrape_configs:
  - job_name: prometheus
    static_configs:
      - targets: ['localhost:9090']
```

There are three blocks of configuration in the example configuration file: `global`, `rule_files`, and `scrape_configs`.

**The `global` block controls the Prometheus server's global configuration.**
**The first, `scrape_interval`, controls how often Prometheus will scrape targets.**
**The `evaluation_interval` option controls how often Prometheus will evaluate rules.**
Prometheus uses rules to create new time series and to generate alerts.

**The `rule_files` block specifies the location of any rules we want the Prometheus server to load.**
For now, we've got no rules.

**The last block, `scrape_configs`, controls what resources Prometheus monitors.**
Since Prometheus also exposes data about itself as an HTTP endpoint it can scrape and monitor its own health.
In the default configuration there is a single job, called `prometheus`,
which scrapes the time series data exposed by the Prometheus server.
The job contains a single, statically configured, target, the `localhost` on port `9090`.
Prometheus expects metrics to be available on targets on a path of `/metrics`.
So this default job is scraping via the URL: `http://localhost:9090/metrics`.
