---
title: "TimeUnit (Java 5)"
sequence: "102"
---

[UP](/java-time.html)

```text
                                ┌─── DAYS
            ┌─── scale: 24 ─────┤
            │                   └─── HOURS
            │
            │                   ┌─── HOURS
            │                   │
            ├─── scale: 60 ─────┼─── MINUTES
TimeUnit ───┤                   │
            │                   └─── SECONDS
            │
            │                   ┌─── SECONDS
            │                   │
            │                   ├─── MILLISECONDS
            └─── scale: 1000 ───┤
                                ├─── MICROSECONDS
                                │
                                └─── NANOSECONDS
```

```java
package java.util.concurrent;

public enum TimeUnit {
    NANOSECONDS(TimeUnit.NANO_SCALE),
    MICROSECONDS(TimeUnit.MICRO_SCALE),
    MILLISECONDS(TimeUnit.MILLI_SCALE),
    SECONDS(TimeUnit.SECOND_SCALE),
    MINUTES(TimeUnit.MINUTE_SCALE),
    HOURS(TimeUnit.HOUR_SCALE),
    DAYS(TimeUnit.DAY_SCALE);

    // Scales as constants
    private static final long NANO_SCALE   = 1L;
    private static final long MICRO_SCALE  = 1000L * NANO_SCALE;
    private static final long MILLI_SCALE  = 1000L * MICRO_SCALE;
    private static final long SECOND_SCALE = 1000L * MILLI_SCALE;
    private static final long MINUTE_SCALE = 60L * SECOND_SCALE;
    private static final long HOUR_SCALE   = 60L * MINUTE_SCALE;
    private static final long DAY_SCALE    = 24L * HOUR_SCALE;
}
```
