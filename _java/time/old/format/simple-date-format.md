---
title: "SimpleDateFormat"
sequence: "101"
---

[UP](/java-time.html)


## Thread-Safety

The [JavaDoc](https://github.com/openjdk/jdk/blob/76507eef639c41bffe9a4bb2b8a5083291f41383/src/java.base/share/classes/java/text/SimpleDateFormat.java#L427) for `SimpleDateFormat` explicitly states:

```text
Date formats are not synchronized.
It is recommended to create separate format instances for each thread.
If multiple threads access a format concurrently, it must be synchronized externally.
```

`SimpleDateFormat` stores intermediate results in instance fields.
So if one instance is used by two threads they can mess each other's results.

Looking at the source code reveals that there is a `Calendar` instance field,
which is used by operations on `DateFormat`/`SimpleDateFormat`.

```java
public abstract class DateFormat extends Format {
    protected Calendar calendar;
}
```

```java
public class SimpleDateFormat extends DateFormat {
}
```

For example `parse(..)` calls `calendar.clear()` initially and then `calendar.add(..)`.
If another thread invokes `parse(..)` before the completion of the first invocation, it will clear the calendar,
but the other invocation will expect it to be populated with intermediate results of the calculation.

One way to reuse date formats without trading thread-safety is to put them in a `ThreadLocal` - some libraries do that.
That's if you need to use the same format multiple times within one thread.
But in case you are using a servlet container (that has a thread pool),
remember to clean the thread-local after you finish.

### 线程不安全

```java
import java.text.SimpleDateFormat;
import java.util.Date;

public class TimeFormatRun {
    public static void main(String[] args) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                try {
                    Date date = sdf.parse("2000-01-01");
                    LogUtils.log("date = {}", date);
                } catch (Exception ex) {
                    LogUtils.log("ex: {}", ex.getClass());
                }
            }).start();
        }
    }
}
```

### 线程安全

#### ThreadLocal

So `SimpleDateFormat` instances are not thread-safe,
and we should use them carefully in concurrent environments.

The best approach to resolve this issue is to use them in combination with a `ThreadLocal`.
This way, each thread ends up with its own `SimpleDateFormat` instance,
and the lack of sharing makes the program thread-safe:

```text
private final ThreadLocal<SimpleDateFormat> formatter = ThreadLocal
  .withInitial(() -> new SimpleDateFormat("dd-MM-yyyy"));
```

Then we can use the formatter via the `ThreadLocal` instance:

```text
formatter.get().format(date)
```

**We call this technique thread confinement
as we confine the use of each instance to one specific thread.**

```java
import java.text.SimpleDateFormat;
import java.util.Date;

public class TimeFormatRun {
    public static void main(String[] args) {
        ThreadLocal<SimpleDateFormat> formatter = ThreadLocal.withInitial(
                () -> new SimpleDateFormat("yyyy-MM-dd")
        );
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                try {
                    Date date = formatter.get().parse("2000-01-01");
                    LogUtils.log("date = {}", date);
                } catch (Exception ex) {
                    LogUtils.log("ex: {}", ex.getClass());
                }
            }).start();
        }
    }
}
```

There are two other approaches to tackle the same problem:

- Using `synchronized` blocks or `ReentrantLock`s
- Creating throw away instances of `SimpleDateFormat` on-demand

Both of these approaches are not recommended:
The former incurs a significant performance hit when the contention is high,
and the latter creates a lot of objects, putting pressure on garbage collection.

It's worthwhile to mention that, since Java 8, a new `DateTimeFormatter` class has been introduced.
The new `DateTimeFormatter` class is immutable and thread-safe.
If we're working with Java 8 or later, using the new `DateTimeFormatter` class is recommended.

#### synchronized

使用 `synchronized` 关键字：

```java
import java.text.SimpleDateFormat;
import java.util.Date;

public class TimeFormatRun {
    public static void main(String[] args) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                synchronized (sdf) {
                    try {
                        Date date = sdf.parse("2000-01-01");
                        LogUtils.log("date = {}", date);
                    } catch (Exception ex) {
                        LogUtils.log("ex: {}", ex.getClass());
                    }
                }
            }).start();
        }
    }
}
```

#### ReentrantLock

```java
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.locks.ReentrantLock;

public class TimeFormatRun {
    public static void main(String[] args) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        ReentrantLock lock = new ReentrantLock();

        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                lock.lock();
                try {
                    Date date = sdf.parse("2000-01-01");
                    LogUtils.log("date = {}", date);
                } catch (Exception ex) {
                    LogUtils.log("ex: {}", ex.getClass());
                } finally {
                    lock.unlock();
                }
            }).start();
        }
    }
}
```

#### 多个实例

```java
import java.text.SimpleDateFormat;
import java.util.Date;

public class TimeFormatRun {
    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                try {
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                    Date date = sdf.parse("2000-01-01");
                    LogUtils.log("date = {}", date);
                } catch (Exception ex) {
                    LogUtils.log("ex: {}", ex.getClass());
                }
            }).start();
        }
    }
}
```

#### DateTimeFormatter

使用 `DateTimeFormatter` 类：

```java
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAccessor;

public class TimeFormatRun {
    public static void main(String[] args) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                TemporalAccessor time = formatter.parse("2000-01-01");
                LogUtils.log("time = {}", time);
            }).start();
        }
    }
}
```

## Reference

- [A Guide to SimpleDateFormat](https://www.baeldung.com/java-simple-date-format)
