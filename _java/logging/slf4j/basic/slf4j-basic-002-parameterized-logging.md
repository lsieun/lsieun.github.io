---
title: "Parameterized Logging"
sequence: "102"
---

[UP](/java/java-logging-index.html)


The SLF4J API is well-designed and allows not only for **simple messages**.
**The typical usage pattern will require parameterized log messages.**

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SLF4JParametrized {
    private static final Logger LOGGER = LoggerFactory.getLogger(SLF4JParametrized.class);

    public static void main(String[] args) {
        int currentValue = 36;
        LOGGER.info("The parameter value in the log message is {}", currentValue);
    }
}
```
