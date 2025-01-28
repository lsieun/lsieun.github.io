---
title: "SLF4J Markers"
sequence: "103"
---

[UP](/java/java-logging-index.html)


Markers are named objects
that are used to enrich the data inside the single log event context.
You can imagine marking a log event with the `IMPORTANT` marker,
which will mean that the appender should for example store the event in a separate log file.

SLF4J allows you to use the `log` method of the `Logger` to provide an optional marker.
For example, the following code initializes a marker and creates two log events – one without and one with a marker.

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.slf4j.MarkerFactory;

public class SLF4JMarker {
    private static final Logger LOGGER = LoggerFactory.getLogger(SLF4JMarker.class);
    private static final Marker IMPORTANT = MarkerFactory.getMarker("IMPORTANT");

    public static void main(String[] args) {
        LOGGER.info("This is a log message that is not important!");
        LOGGER.info(IMPORTANT, "This is a very important log message!");
    }
}
```

```text
[main] INFO lsieun.logging.sl4j.Sl4jMarker - This is a log message that is not important!
[main] INFO lsieun.logging.sl4j.Sl4jMarker -  IMPORTANT This is a very important log message!
```

Marked log events can be treated specially – for example, written into a different file or
sent to a different log centralization solution for alerting.
