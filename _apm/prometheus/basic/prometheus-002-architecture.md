---
title: "Architecture"
sequence: "102"
typora-root-url: {{ site.url }}
---

## Components

The Prometheus ecosystem consists of multiple components, many of which are optional:

- the main **Prometheus server** which scrapes and stores time series data
- **client libraries** for instrumenting application code
- a **push gateway** for supporting short-lived jobs
- special-purpose **exporters** for services like HAProxy, StatsD, Graphite, etc.
- an **alertmanager** to handle alerts
- various support tools

Most Prometheus components are written in `Go`, making them easy to build and deploy as static binaries.

## Architecture

This diagram illustrates the architecture of Prometheus and some of its ecosystem components:

![](/assets/images/prometheus/prometheus-architecture.svg)

![](/assets/images/prometheus/prometheus-architecture.png)

Prometheus scrapes metrics from instrumented jobs,
either directly or via an intermediary push gateway for short-lived jobs.

```text
instrumented jobs --> metrics data
push gateway      --> metrics data
```

It stores all scraped samples locally and runs rules over this data to
either aggregate and record new time series from existing data or generate alerts.

```text
metrics data --> new time series data
metrics data --> alerts
```

Grafana or other API consumers can be used to visualize the collected data.

```text
metrics data --> Grafana
```
