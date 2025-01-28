---
title: "Logback Intro"
sequence: "101"
---

[UP](/java/java-logging-index.html)


The Logback project is organized in main 3 modules:

- `logback-core` – contains the basic logging functionality
- `logback-classic` – contains additional logging improvements, such as slf4j support
- `logback-access` – provides integration with servlet containers, such as Tomcat and Jetty



## Logback

在 Logback 中，核心的几个概念包括：

1. Logger：Logger 是 Logback 中用于记录日志的接口，它定义了一组方法，允许应用程序记录不同级别的日志信息。可以通过 LoggerFactory 类获取 Logger 实例。

2. Appender：Appender 是 Logback 中的输出目标，它可以将日志信息输出到不同的目标，如控制台、文件、数据库等。可以通过配置文件或编程的方式向 Logger 中添加 Appender。

3. Layout：Layout 用于格式化日志事件的输出，它决定了日志事件的输出格式，包括时间、日志级别、日志内容等。Logback 提供了多种预定义的 Layout，同时也允许用户自定义 Layout。

4. Rolling Policy：Rolling Policy 是 Logback 中用于自动轮转日志文件的策略，它决定了何时触发日志文件的切换和归档。Logback 提供了多种预定义的 Rolling
   Policy，同时也允许用户自定义 Rolling Policy 来实现不同的轮转策略。

5. Filter：Filter 用于过滤某些不需要输出的日志事件，它可以根据日志事件的不同属性进行过滤，如日志级别、线程名、日志内容等。Logback 提供了多种预定义的 Filter，同时也允许用户自定义 Filter。

这些概念构成了 Logback 的核心组件，应用程序可以使用它们来记录日志，并将日志信息输出到不同的目标。

## Reference

- [The logback manual](https://logback.qos.ch/manual/index.html)
- [A Guide to Java Logging with Logback](https://betterstack.com/community/guides/logging/java/logback/)
