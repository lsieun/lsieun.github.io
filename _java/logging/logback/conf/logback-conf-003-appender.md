---
title: "配置 Appender"
sequence: "103"
---

[UP](/java/java-logging-index.html)


Loggers pass `LoggingEvent`s to `Appender`s.
`Appender`s do the actual work of logging.
We usually think of logging as something that goes to a file or the console,
but Logback is capable of much more.
Logback-core provides several useful appenders.

## ConsoleAppender

Despite its name, `ConsoleAppender` appends messages to `System.out` or `System.err`.

It uses an `OutputStreamWriter` to buffer the I/O,
so directing it to `System.err` doesn't result in unbuffered writing.

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

## FileAppender

FileAppender appends messages to a file.
It supports a broad range of configuration parameters.
Let's add a file appender to our basic configuration:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration debug="true">
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <!-- encoders are assigned the type
             ch.qos.logback.classic.encoder.PatternLayoutEncoder by default -->
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <appender name="FILE" class="ch.qos.logback.core.FileAppender">
        <file>tests.log</file>
        <append>true</append>
        <encoder>
            <pattern>%-4relative [%thread] %-5level %logger{35} - %msg%n</pattern>
        </encoder>
    </appender>

    <logger name="com.baeldung.logback" level="INFO"/>
    <logger name="com.baeldung.logback.tests" level="WARN">
        <appender-ref ref="FILE"/>
    </logger>

    <root level="debug">
        <appender-ref ref="STDOUT"/>
    </root>
</configuration>
```

The `FileAppender` is configured with a file name via `<file>`.
The `<append>` tag instructs the Appender to append to an existing file rather than truncating it.
If we run the test several times, we see that the logging output is appended to the same file.

If we re-run our test from above,
messages from `com.baeldung.logback.tests` go to both the console and to a file named `tests.log`.
The descendant logger inherits the root logger's association with the `ConsoleAppender`
with its association with `FileAppender`.
Appenders are cumulative.

We can override this behavior:

```text
<logger name="com.baeldung.logback.tests" level="WARN" additivity="false" > 
    <appender-ref ref="FILE" /> 
</logger> 

<root level="debug">
    <appender-ref ref="STDOUT" />
</root>
```

Setting `additivity` to `false` disables the default behavior.
Tests won't log to the console, and neither will any of its descendants.

## RollingFileAppender

Often, appending log messages to the same file is not the behavior we need.
We want files to “roll” based on time, log file size, or a combination of both.

For this, we have `RollingFileAppender`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration debug="true">
    <property name="LOG_FILE" value="LogFile"/>
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_FILE}.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- daily rollover -->
            <fileNamePattern>${LOG_FILE}.%d{yyyy-MM-dd}.gz</fileNamePattern>

            <!-- keep 30 days' worth of history capped at 3GB total size -->
            <maxHistory>30</maxHistory>
            <totalSizeCap>3GB</totalSizeCap>
        </rollingPolicy>
        <encoder>
            <pattern>%-4relative [%thread] %-5level %logger{35} - %msg%n</pattern>
        </encoder>
    </appender>

    <root level="debug">
        <appender-ref ref="FILE"/>
    </root>
</configuration>
```

A `RollingFileAppender` has a `RollingPolicy`. In this sample configuration, we see a `TimeBasedRollingPolicy`.

Similar to the `FileAppender`, we configured this appender with a `file` name.
We declared a property and used it because we'll be reusing the file name below.

We defined a `fileNamePattern` inside the `RollingPolicy`.
This pattern defines not just the name of files, but also how often to roll them.
`TimeBasedRollingPolicy` examines the pattern and rolls at the most finely defined period.

For example:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration debug="true">
    <property name="LOG_FILE" value="LogFile"/>
    <property name="LOG_DIR" value="/var/logs/application"/>
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_DIR}/${LOG_FILE}.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${LOG_DIR}/%d{yyyy/MM}/${LOG_FILE}.gz</fileNamePattern>
            <totalSizeCap>3GB</totalSizeCap>
        </rollingPolicy>
        <encoder>
            <pattern>%-4relative [%thread] %-5level %logger{35} - %msg%n</pattern>
        </encoder>
    </appender>

    <root level="debug">
        <appender-ref ref="FILE"/>
    </root>
</configuration>
```

The active log file is `/var/logs/application/LogFile`.
This file rolls over at the beginning of each month into `/Current Year/Current Month/LogFile.gz`
and `RollingFileAppender` creates a new active file.

When the total size of archived files reaches `3GB`,
`RollingFileAppender` deletes archives on a first-in-first-out basis.

There are codes for a week, hour, minute, second, and even millisecond.
Logback has a reference [here](https://logback.qos.ch/manual/appenders.html#TimeBasedRollingPolicy).

RollingFileAppender also has **built-in support for compressing files**.
It compresses our rolled files because we named them `LogFile.gz`.

TimeBasedPolicy isn't our only option for rolling files.
Logback also offers `SizeAndTimeBasedRollingPolicy`,
which will roll based on current log file size as well as time.

It also offers a `FixedWindowRollingPolicy`,
which rolls log file names each time the logger is started.

We can also write our own [RollingPolicy](https://logback.qos.ch/manual/appenders.html#onRollingPolicies).

## Custom Appenders

We can create custom appenders by extending one of Logback's base appender classes.
We have a tutorial for creating custom appenders [here](https://www.baeldung.com/custom-logback-appender).
