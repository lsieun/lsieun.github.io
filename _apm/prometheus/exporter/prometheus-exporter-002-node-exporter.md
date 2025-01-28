---
title: "Node Exporter"
sequence: "102"
---

Monitoring Linux or macOS host metrics using a node exporter.

The Prometheus [Node Exporter][node-exporter-url] exposes a wide variety of hardware- and kernel-related metrics.

NOTE: While the Prometheus Node Exporter is for `*nix` systems,
there is the Windows exporter for Windows that serves an analogous purpose.

## Linux Tarball

### 下载

```text
https://prometheus.io/download/#node_exporter
```

```text
https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz
```

### 解压和启动

```text
$ tar xvfz node_exporter-*.*-amd64.tar.gz
$ cd node_exporter-*.*-amd64
$ ./node_exporter
```

### 访问

```text
curl http://localhost:9100/metrics
```

## Prometheus 配置

修改 `prometheus.yml` 文件：

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: node
    static_configs:
      - targets: [ '192.168.80.130:9100' ]
```

## Reference

- [Node Exporter][node-exporter-url]
- [MONITORING LINUX HOST METRICS WITH THE NODE EXPORTER](https://prometheus.io/docs/guides/node-exporter/)


[node-exporter-url]: https://github.com/prometheus/node_exporter
