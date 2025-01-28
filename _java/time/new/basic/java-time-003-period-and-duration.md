---
title: "时间跨度：Period and Duration"
sequence: "103"
---

[UP](/java-time.html)


- `Period`：较大时间单位的时间跨度，例如，年、月、日。
- `Duration`：较小时间单位的时间跨度，例如，秒、纳秒

## Period

`Period` 类常用来获取两个日期之间的时间间隔：

```text
LocalDate initialDate = LocalDate.parse("2007-05-10");
LocalDate finalDate = initialDate.plus(Period.ofDays(5));
int five = Period.between(initialDate, finalDate).getDays();
```

`Period` 类提供了不同的 `getXxx()` 方法：

```java
public final class Period implements ChronoPeriod, Serializable {
    public int getYears() {
        return years;
    }

    public int getMonths() {
        return months;
    }

    public int getDays() {
        return days;
    }
}
```

We can get the Period between two dates in a specific unit such as days or months or years, using ChronoUnit.between:

```text
long five = ChronoUnit.DAYS.between(initialDate, finalDate);
```

## Duration

### 创建实例

#### 常量

```java
public final class Duration implements TemporalAmount, Comparable<Duration>, Serializable {
    public static final Duration ZERO = new Duration(0, 0);
}
```

#### 一个值

```java
public final class Duration implements TemporalAmount, Comparable<Duration>, Serializable {
    public static Duration ofDays(long days);
    public static Duration ofHours(long hours);
    public static Duration ofMinutes(long minutes);
    public static Duration ofSeconds(long seconds);
    public static Duration ofSeconds(long seconds, long nanoAdjustment);
    public static Duration ofMillis(long millis);
    public static Duration ofNanos(long nanos);

    public static Duration of(long amount, TemporalUnit unit);
    public static Duration from(TemporalAmount amount);
}
```

#### 两个日期的差值

```java
public final class Duration implements TemporalAmount, Comparable<Duration>, Serializable {
    public static Duration between(Temporal startInclusive, Temporal endExclusive);
}
```

```text
LocalTime initialTime = LocalTime.of(6, 30, 0);
LocalTime finalTime = initialTime.plus(Duration.ofSeconds(30));
long thirty = Duration.between(initialTime, finalTime).getSeconds();
```

```text
long thirty = ChronoUnit.SECONDS.between(initialTime, finalTime);
```

#### 解析字符串

```java
public final class Duration implements TemporalAmount, Comparable<Duration>, Serializable {
    public static Duration parse(CharSequence text);
}
```

### getXxx

```java
public final class Duration implements TemporalAmount, Comparable<Duration>, Serializable {
    public long getSeconds();
    public int getNano();
}
```

### toXxx

```java
public final class Duration implements TemporalAmount, Comparable<Duration>, Serializable {
    public long toDays();
    public long toHours();
    public long toMinutes();
    public long toSeconds();
    public long toMillis();
    public long toNanos();
}
```
