---
title: "配置 Layout: Pattern Color"
sequence: "105"
---

[UP](/java/java-logging-index.html)


```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} %green([%thread]) %highlight(%-5level) %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <root level="debug">
        <appender-ref ref="STDOUT"/>
    </root>
</configuration>
```

```java
package lsieun.logback;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Example {
    private static final Logger logger = LoggerFactory.getLogger(Example.class);

    public static void main(String[] args) {
        logger.trace("Trace log message from {}", Example.class.getSimpleName());
        logger.debug("Debug log message from {}", Example.class.getSimpleName());
        logger.info("Info log message from {}", Example.class.getSimpleName());
        logger.warn("Warn log message from {}", Example.class.getSimpleName());
        logger.error("Error log message from {}", Example.class.getSimpleName());
    }
}
```

## Reference

- [Logback Coloring](https://logback.qos.ch/manual/layouts.html#coloring)
- [Colorful Logging In Spring](https://medium.com/@alaajawhar123/colorful-logging-in-spring-da2722bc08d1)
