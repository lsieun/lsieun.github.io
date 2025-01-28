---
title: "Prometheus Installation (Windows)"
sequence: "103"
---

## 下载

```text
https://prometheus.io/download/
```

```text
https://github.com/prometheus/prometheus/releases/download/v2.45.0/prometheus-2.45.0.windows-amd64.zip
```

## 解压

![](/assets/images/prometheus/prometheus-win-dir.png)

查看帮助：

```text
> prometheus.exe --help
```

## 启动

```text
> prometheus --config.file=prometheus.yml
```

## Reference

- [FIRST STEPS WITH PROMETHEUS](https://prometheus.io/docs/introduction/first_steps/)
