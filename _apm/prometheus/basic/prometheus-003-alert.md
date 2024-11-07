---
title: "AlertManager 告警"
sequence: "103"
---

## Steps

Alerting with Prometheus setup steps are mentioned below:

- AlertManager: Setup and configure AlertManager.
- Prometheus: Configure the config file on Prometheus, so it can talk to the AlertManager.
- Prometheus: Define alert rules in Prometheus server configuration.
- AlertManager: Define alert mechanism in AlertManager to send alerts via Slack and Mail

## Architecture

![](/assets/images/prometheus/basic-architecture-of-alert-manager-with-prometheus.png)

Alert rules are defined in Prometheus configuration.
Prometheus just scrapes (pull) metrics from its client application(the Node Exporter).
However, if any alert condition hits, Prometheus pushes it to the AlertManager
which manages the alerts through its pipeline of **silencing, inhibition, grouping and sending out notifications.**

**Silencing** is to mute alerts for a given time.
Alerts are checked to match against active silent alerts, if a match is found then no notifications are sent.

**Inhibition** is to suppress notifications for certain alerts if other alerts are already fired.

**Grouping** group alerts of similar nature into a single notification.

This helps prevent firing multiple notifications simultaneously to the receivers like Mail or Slack.

## Reference

- [Prometheus alerts examples](https://alex.dzyoba.com/blog/prometheus-alerts/)

