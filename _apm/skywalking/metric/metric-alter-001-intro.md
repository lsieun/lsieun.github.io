---
title: "Intro"
sequence: "101"
---

## Intro

Alerting mechanism measures system performance according to the metrics of
`services`/`instances`/`endpoints` from different layers.

Alerting kernel is an in-memory, time-window based queue.

The alerting core is driven by a collection of rules defined in `config/alarm-settings.yml`.

```text
<SKYWALKING_APM_HOME>/config/alarm-settings.yml
```

There are three parts to alerting rule definitions.

- **alerting rules**. They define how metrics alerting should be triggered and what conditions should be considered.
- **Webhooks**. The list of web service endpoints, which should be called after an alerting is triggered.
- **gRPCHook**. The host and port of the remote gRPC method, which should be called after an alerting is triggered.

## Entity name

Defines the relation between scope and entity name.

- **Service**: Service name
- **Instance**: `{Instance name}` of `{Service name}`
- **Endpoint**: `{Endpoint name}` in `{Service name}`
- **Database**: Database service name
- **Service Relation**: `{Source service name}` to `{Dest service name}`
- **Instance Relation**: `{Source instance name}` of `{Source service name}` to `{Dest instance name}` of `{Dest service name}`
- **Endpoint Relation**: `{Source endpoint name}` in `{Source Service name}` to `{Dest endpoint name}` in `{Dest service name}`

- `p50` 和 `p75` 分别表示 `50%` 和 `75%`， 其中 `p` 表示 `percent`。

## Reference

- [Alerting](https://skywalking.apache.org/docs/main/v9.4.0/en/setup/backend/backend-alarm/)
