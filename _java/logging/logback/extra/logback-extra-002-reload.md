---
title: "自动重新加载配置"
sequence: "102"
---

[UP](/java/java-logging-index.html)


## Reloading Configuration Automatically

Reloading logging configuration while an application is running is a powerful troubleshooting tool.
Logback makes this possible with the `scan` parameter:

```xml
<configuration scan="true">
    <!-- ... -->
</configuration>
```

The default behavior is to scan the configuration file for changes every `60` seconds.
We can modify this interval by adding `scanPeriod`:

```xml
<configuration scan="true" scanPeriod="15 seconds">
    <!-- ... -->
</configuration>
```

We can specify values in `milliseconds`, `seconds`, `minutes`, or `hours`.
