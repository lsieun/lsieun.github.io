---
title: "Mapped Diagnostic Context"
sequence: "104"
---

[UP](/java/java-logging-index.html)


SLF4J supports the **Mapped Diagnostic Context**
which is a map where the application code provides key-value pairs
which can be inserted by the logging framework in the log messages.
If the underlying logging framework supports the `MDC` then
SLF4J facade will pass the maintained key-value pairs to the used logging framework.

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

public class SLF4JMDC {
    private static final Logger LOGGER = LoggerFactory.getLogger(SLF4JMDC.class);

    public static void main(String[] args) {
        MDC.put("user", "rafal.kuc@sematext.com");
        LOGGER.info("This is an info level log message!");
        LOGGER.warn("This is an WARN level log");
    }
}
```

Properly displaying the data associated with the log event
using the Mapped Diagnostic Context is up to the logging framework.
