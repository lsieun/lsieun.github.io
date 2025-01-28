---
title: "变量替换"
sequence: "103"
---

[UP](/java/java-logging-index.html)


## Variable Substitution

Logback configuration files support variables.
**We define variables inside the configuration script or externally.**
A variable can be specified at any point in a configuration script in place of a value.

For example, here is the configuration for a `FileAppender`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <property name="LOG_DIR" value="/var/log/application"/>
    <appender name="FILE" class="ch.qos.logback.core.FileAppender">
        <file>${LOG_DIR}/tests.log</file>
        <append>true</append>
        <encoder>
            <pattern>%-4relative [%thread] %-5level %logger{35} - %msg%n</pattern>
        </encoder>
    </appender>
    <!-- ... -->
</configuration>
```

At the top of the configuration, we declared a property named `LOG_DIR`.
Then we used it as part of the path to the file inside the appender definition.

Properties are declared in a `<property>` tag in configuration scripts,
but they're also available from outside sources, such as **system properties**.
We could omit the property declaration in this example and set the value of `LOG_DIR` on the command line:

```text
$ java -DLOG_DIR=/var/log/application com.baeldung.logback.LogbackTests
```

We specify the value of the property with `${propertyname}`.
Logback implements variables as text replacement.
Variable substitution can occur at any point in a configuration file where a value can be specified.
