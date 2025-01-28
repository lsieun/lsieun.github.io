---
title: "SLF4J 介绍"
sequence: "101"
---

[UP](/java/java-logging-index.html)


## Java Logging

### 什么是 Logging？

Logging is the process of printing or recording the activities in an application
which helps the developers to understand and analyze when there are any unexpected errors in the system.

### 日志框架出来之前

Before the logging frameworks were introduced,
developers used to write `System.out.println` everywhere in the code to print to the console.

The problems with were that it made the console messy and these messages were lost.
Moreover, there was no control over such messages being printed on the console.

### 日志框架出来之后

Then came the logging for Java through the `java.util.logging` package, and the `org.apache.log4j.*` package.
Many logging frameworks have been developed
that work on top of the Java logging package to standardize the logging and make it convenient for the developers.
These frameworks in general are called **loggers,**
and they have a lot of flexibility like printing logs to separate log files and rotate the log files etc

![](/assets/images/java/log/application-logger-appender-filter-destination.png)

**Loggers** are nothing but Java objects that trigger log events.
Loggers are included as objects in all the Java class files, and they belong to that specific class.
A class can have more than one Loggers defined for different events.
When the application calls the logger to generate logs,
log events are triggered and then passed to the **Appender** or **Handler**.

```text
Application -- 1:m --> Java classes -- 1:n --> Loggers --> log events --> Appender --> Filter --> Destination
```

**Appender**s are used to export logs to the **Destination**.
The destination can be a file or console or specific Syslog servers etc.
These Appenders have components called **Filter**s to filter the log messages from getting exported.
Moreover, The **Layout** in the **Appender**s helps us to add custom formatting to the log messages like date, time, etc

Log Levels

The logs can be classified based on their severity in the form of log levels.
There are various log levels as seen in the diagram.
There is an Integer value for each log level and the higher value indicates higher priorities.



## Slf4j

在 Slf4j 中，核心的几个概念包括：

1. Logger：Slf4j 提供了 Logger 接口，用于在应用程序中创建和记录日志消息。

2. LoggerFactory：LoggerFactory 是 Slf4j 的主要入口点，它允许应用程序通过名称获取 Logger 实例。

3. 日志级别：Slf4j 定义了 5 个日志级别，从高到低分别是 ERROR、WARN、INFO、DEBUG 和 TRACE。应用程序可以根据需要使用不同的日志级别来记录日志信息。

4. 日志格式化：Slf4j 允许应用程序通过占位符来格式化日志信息，类似于 Java 中的 String.format 方法。例如，可以使用{}来表示占位符，并在记录日志消息时传递参数来替换这些占位符。

5. 日志输出：Slf4j 支持多种日志输出方式，包括控制台、文件、数据库等。应用程序可以选择合适的输出方式，以便在不同环境中记录日志信息。

```text
LoggerFactory --> Logger --> Message --> Appender
```

![](/assets/images/java/log/slf4j-concrete-bindings.png)


## Slf4j 版本

### STABLE version

The current stable and actively developed version of SLF4J is `2.0.7`.

### Older stable version (INACTIVE)

The older stable SLF4J version is `1.7.36`.
It is no longer actively developed.

## Reference

- [Simple Logging Facade for Java (SLF4J)](https://slf4j.org/)
- [JAVA 日志框架体系教程（一）](https://zhuanlan.zhihu.com/p/598799105)
