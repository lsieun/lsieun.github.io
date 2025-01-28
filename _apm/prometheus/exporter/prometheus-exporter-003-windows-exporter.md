---
title: "Windows Exporter"
sequence: "103"
---

## 下载

```text
https://github.com/prometheus-community/windows_exporter/releases
```

```text
https://github.com/prometheus-community/windows_exporter/releases/download/v0.23.1/windows_exporter-0.23.1-amd64.exe
```

## 启动

```text
.\windows_exporter.exe
```

端口：`9182`

## Prometheus 配置

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: windows
    static_configs:
      - targets: [ '192.168.80.1:9182' ]
```

## Flags

`windows_exporter` accepts flags to configure certain behaviours.
The ones configuring the global behaviour of the exporter are listed below,
while collector-specific ones are documented in the respective collector documentation above.

| Flag                                 | Description                                                                                                                                         | Default value |
|--------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
 | `--web.listen-address`               | host:port for exporter.                                                                                                                             | `:9182`       |
 | `--telemetry.path`                   | URL path for surfacing collected metrics.                                                                                                           | `/metrics`    |
 | `--telemetry.max-requests`           | Maximum number of concurrent requests. 0 to disable.                                                                                                | `5`           |
 | `--collectors.enabled`               | Comma-separated list of collectors to use. Use `[defaults]` as a placeholder which gets expanded containing all the collectors enabled by default." | `[defaults]`  |
 | `--collectors.print`                 | If true, print available collectors and exit.                                                                                                       |               |
 | `--scrape.timeout-margin`            | Seconds to subtract from the timeout allowed by the client. Tune to allow for overhead or high loads.                                               | `0.5`         |
 | `--web.config.file`                  | A [web config][web_config] for setting up TLS and Auth                                                                                              | None          |
 | `--config.file`                      | Using a config file from path or URL                                                                                                                | None          |
 | `--config.file.insecure-skip-verify` | Skip TLS when loading config file from URL                                                                                                          | false         |

## Reference

- [windows_exporter](https://github.com/prometheus-community/windows_exporter)

[web_config]: https://github.com/prometheus/exporter-toolkit/blob/master/docs/web-configuration.md
