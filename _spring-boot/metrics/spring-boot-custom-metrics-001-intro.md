---
title: "Custom Application Metrics"
sequence: "101"
---

We can use Actuator's `/metrics` endpoint to view various application metrics,
such as memory, heap, thread pool, and datasource information.

In addition, we can define our own application metrics using Micrometer (https://micrometer.io/),
a vendor-neutral application metrics facade
that enables us to publish the metrics to different monitoring systems supported by Spring Boot
like Prometheus, Datadog, New Relic, and Graphite.

We can find the list of supported monitoring systems at:

```text
https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#actuator.metrics.export
```

