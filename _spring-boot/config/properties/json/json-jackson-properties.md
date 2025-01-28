---
title: "Jackson Properties"
sequence: "jackson"
---

## Jackson

| Name                             | Description                                                                                          | Default Value |
|----------------------------------|------------------------------------------------------------------------------------------------------|---------------|
| `spring.jackson.date-format`     | Date format string or a fully-qualified date format class name. For instance, 'yyyy-MM-dd HH:mm:ss'. |               |
| `spring.jackson.time-zone`       | Time zone used when formatting dates. For instance, "America/Los_Angeles" or "GMT+10".               |               |
| `spring.jackson.serialization.*` | Jackson on/off features that affect the way Java objects are serialized.                             |               |
| ``                               |                                                                                                      |               |

```yaml
spring:
  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
    time-zone: GMT+8
```
