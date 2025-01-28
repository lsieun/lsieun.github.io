---
title: "配置 Layout"
sequence: "104"
---

[UP](/java/java-logging-index.html)


Layouts format log messages.
Like the rest of Logback, Layouts are extensible, and we can create [our own](https://logback.qos.ch/manual/layouts.html#writingYourOwnLayout).
However, the default PatternLayout offers what most applications need and then some.

We've used `PatternLayout` in all of our examples so far:

```xml
<encoder>
    <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
</encoder>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <root level="debug">
        <appender-ref ref="STDOUT"/>
    </root>
</configuration>
```

This configuration script contains the configuration for `PatternLayoutEncoder`.
We pass an `Encoder` to our `Appender`, and this encoder uses the `PatternLayout` to format the messages.

The text in the `<pattern>` tag defines how log messages are formatting.
`PatternLayout` implements a large variety of **conversion words** and **format modifiers** for creating patterns.

Let's break this one down.
`PatternLayout` recognizes **conversion words** with a `%`,
so the conversions in our pattern generate:

- `%d{HH:mm:ss.SSS}` – a timestamp with hours, minutes, seconds and milliseconds
- `[%thread]` – the thread name generating the log message, surrounded by square brackets
- `%-5level` – the level of the logging event, padded to `5` characters
- `%logger{36}` – the name of the logger, truncated to 35 characters
- `%msg%n` – the log messages followed by the platform dependent line separator character

An exhaustive list of conversion words and format modifiers can be found
[here](https://logback.qos.ch/manual/layouts.html#conversionWord).

## 时间

### date

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%date{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <root level="debug">
        <appender-ref ref="STDOUT"/>
    </root>
</configuration>
```

示例一：

```text
%date{yyyy-MM-dd HH:mm:ss.SSS}
```

```text
2023-06-12 10:57:21.468 [main] INFO  lsieun.logback.Example - Example log from Example
```

示例二：

```text
%date{HH:mm:ss.SSS}
```

```text
10:58:09.658 [main] INFO  lsieun.logback.Example - Example log from Example
```

### relative

- `relative`: Outputs the number of milliseconds elapsed since the start of the application
  until the creation of the logging event.

```text

```
