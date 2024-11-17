---
title: "slf4j-simple"
sequence: "101"
---

[UP](/java/java-logging-index.html)


## pom.xml

只要添加 `sfl4j-simple` 即可，它会自动引入 `slf4j-api` 依赖：

```xml
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-simple</artifactId>
</dependency>
```

With no configuration, the default output includes
the relative time in milliseconds, thread name, the level, logger name, and the message
followed by the line separator for the host.
In log4j terms it amounts to the `%r [%t] %level %logger - %m%n` pattern.

## 代码

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SimpleLogRunner {
    private static final Logger LOGGER = LoggerFactory.getLogger(SimpleLogRunner.class);

    public static void main(String[] args) {
        LOGGER.trace("Trace log message");
        LOGGER.debug("Debug log message");
        LOGGER.info("Info log message");
        LOGGER.warn("Warn log message");
        LOGGER.error("Error log");
    }
}
```

## 配置

配置文件名称是 `simplelogger.properties`：

```properties
org.slf4j.simpleLogger.defaultLogLevel=DEBUG
org.slf4j.simpleLogger.showDateTime=true
org.slf4j.simpleLogger.dateTimeFormat=yyyy-MM-dd HH:mm:ss
org.slf4j.simpleLogger.showShortLogName=true
org.slf4j.simpleLogger.logFile=System.out
```

完整的配置项：

```text
org.slf4j.simpleLogger.cacheOutputStream
org.slf4j.simpleLogger.warnLevelString
org.slf4j.simpleLogger.levelInBrackets
org.slf4j.simpleLogger.logFile
org.slf4j.simpleLogger.showLogName
org.slf4j.simpleLogger.showShortLogName
org.slf4j.simpleLogger.showThreadId
org.slf4j.simpleLogger.showThreadName
org.slf4j.simpleLogger.showDateTime
org.slf4j.simpleLogger.dateTimeFormat
org.slf4j.simpleLogger.defaultLogLevel
```

输出示例：

```text
2023-12-27 21:57:27.519   [main]         tid=1           DEBUG        SimpleLogRunner - Debug log message
          |                  |             |               |                 |
       showDateTime    showThreadName  showThreadId  defaultLogLevel  showShortLogName
```

配置梳理成树状结构：

```text
                                                                       ┌─── true
                                                ┌─── showDateTime ─────┤
                                                │                      └─── false (Default)
                                 ┌─── time ─────┤
                                 │              │                      ┌─── yyyy-MM-dd HH:mm:ss
                                 │              └─── dateTimeFormat ───┤
                                 │                                     └─── yyyy-MM-dd HH:mm:ss.SSS
                                 │
                                 │                                     ┌─── true: tid=xxx
                                 │              ┌─── showThreadId ─────┤
                                 │              │                      └─── false (Default)
                                 ├─── thread ───┤
                                 │              │                      ┌─── true: [ThreadName] (Default)
                                 │              └─── showThreadName ───┤
                                 │                                     └─── false
                                 │
                                 │                                      ┌─── trace
                ┌─── message ────┤                                      │
                │                │                                      ├─── debug
                │                │                                      │
                │                │                                      ├─── info (Default)
                │                ├─── level ────┼─── defaultLogLevel ───┤
                │                │                                      ├─── warn
                │                │                                      │
                │                │                                      ├─── error
                │                │                                      │
                │                │                                      └─── off
simpleLogger ───┤                │
                │                │                                       ┌─── true: com.xyz.Abc (Default)
                │                │              ┌─── showLogName ────────┤
                │                │              │                        └─── false
                │                └─── class ────┤
                │                               │                        ┌─── true: Abc
                │                               └─── showShortLogName ───┤
                │                                                        └─── false (Default)
                │
                │                                ┌─── System.err (Default)
                │                                │
                └─── appender ───┼─── logFile ───┼─── System.out
                                                 │
                                                 └─── my-custom-log.txt
```

## 源码参考

### SimpleLoggerConfiguration

```java
public class SimpleLoggerConfiguration {
    private static final String CONFIGURATION_FILE = "simplelogger.properties";
}
```

### SimpleLogger

```java
public class SimpleLogger extends LegacyAbstractLogger {
    /**
     * All system properties used by <code>SimpleLogger</code> start with this prefix
     */
    public static final String SYSTEM_PREFIX = "org.slf4j.simpleLogger.";

    public static final String LOG_KEY_PREFIX = SimpleLogger.SYSTEM_PREFIX + "log.";

    public static final String CACHE_OUTPUT_STREAM_STRING_KEY = SimpleLogger.SYSTEM_PREFIX + "cacheOutputStream";

    public static final String WARN_LEVEL_STRING_KEY = SimpleLogger.SYSTEM_PREFIX + "warnLevelString";

    public static final String LEVEL_IN_BRACKETS_KEY = SimpleLogger.SYSTEM_PREFIX + "levelInBrackets";

    public static final String LOG_FILE_KEY = SimpleLogger.SYSTEM_PREFIX + "logFile";

    public static final String SHOW_SHORT_LOG_NAME_KEY = SimpleLogger.SYSTEM_PREFIX + "showShortLogName";

    public static final String SHOW_LOG_NAME_KEY = SimpleLogger.SYSTEM_PREFIX + "showLogName";

    public static final String SHOW_THREAD_NAME_KEY = SimpleLogger.SYSTEM_PREFIX + "showThreadName";

    public static final String SHOW_THREAD_ID_KEY = SimpleLogger.SYSTEM_PREFIX + "showThreadId";

    public static final String DATE_TIME_FORMAT_KEY = SimpleLogger.SYSTEM_PREFIX + "dateTimeFormat";

    public static final String SHOW_DATE_TIME_KEY = SimpleLogger.SYSTEM_PREFIX + "showDateTime";

    public static final String DEFAULT_LOG_LEVEL_KEY = SimpleLogger.SYSTEM_PREFIX + "defaultLogLevel";
}
```

## Reference

- [Class SimpleLogger](https://www.slf4j.org/api/org/slf4j/simple/SimpleLogger.html)
- [JAVA 日志框架体系教程（一）](https://zhuanlan.zhihu.com/p/598799105)
