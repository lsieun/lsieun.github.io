---
title: "APM 实现方式"
sequence: "103"
---

## 实现方式

- 基于日志收集：Sleuth & Zipkin
- 基于 Agent 收集调用链路：SkyWalking


## OpenTracing

OpenTracing：一致的链路追踪日志规范与 API 接口

标准日志格式：

```text
微服务ID,Trace ID,Span ID,导出标识
```
