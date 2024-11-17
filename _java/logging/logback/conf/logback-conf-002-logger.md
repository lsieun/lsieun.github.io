---
title: "配置 Logger"
sequence: "102"
---

[UP](/java/java-logging-index.html)


## Modifying Loggers

We can set the level for any logger:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <logger name="lsieun.logback" level="INFO"/>
    <logger name="lsieun.logback.tests" level="WARN"/>

    <root level="debug">
        <appender-ref ref="STDOUT"/>
    </root>
</configuration>
```
