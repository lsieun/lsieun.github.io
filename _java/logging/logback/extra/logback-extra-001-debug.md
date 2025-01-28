---
title: "调试信息"
sequence: "101"
---

[UP](/java/java-logging-index.html)


Logback configuration files can get complicated, so there are several built-in mechanisms for troubleshooting.

## 第一种方式

To see debug information as Logback processes the configuration, we can turn on debug logging:

```xml
<configuration debug="true">
    <!-- ... -->
</configuration>
```

If warnings or errors are encountered while parsing the configuration file,
Logback writes status messages to the console.

## 第二种方式

There is a second mechanism for printing status information:

```xml
<configuration>
    <statusListener class="ch.qos.logback.core.status.OnConsoleStatusListener"/>
    <!-- ... -->
</configuration>
```

The `StatusListener` intercepts status messages and prints them during configuration,
as well as while the program is running.

The output from all configuration files is printed,
making it useful for locating “rogue” configuration files on the classpath.
