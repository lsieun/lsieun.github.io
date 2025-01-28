---
title: "OpenTelemetry"
sequence: "106"
---

**OpenTelemetry** (**Otel**) is a collection of standardized vendor-agnostic tools, APIs, and SDKs.

```text
OpenTelemetry = tools + API + SDK
```

**OpenTelemetry** is a CNCF incubating project and is a merger of the **OpenTracing** and **OpenCensus** projects.

```text
OpenTelemetry = OpenTracing + OpenCensus + ...
```

**OpenTracing** is a vendor-neutral API for sending **telemetry data** over to **an observability backend**.

```text
OpenTracing = telemetry data --> an observability backend
```

The **OpenCensus** project provides a set of language-specific libraries
that developers can use to instrument their code and send it to any supported backends.

**Otel** uses the same concept of **trace** and **span** to represent the request flow
across microservices as used by its predecessor projects.

**OpenTelemetry** allows us to **instrument**, **generate**, and **collect telemetry data**,
which helps in analyzing application behavior or performance.
**Telemetry data** can include **logs**, **metrics**, and **traces**.
We can either automatically or manually instrument the code for HTTP, DB calls, and more.

Using the Otel SDK, we can easily override or add more attributes to the trace.

## Reference

- [OpenTelemetry](https://opentelemetry.io/)
