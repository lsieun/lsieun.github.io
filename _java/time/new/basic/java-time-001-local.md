---
title: "LocalDate, LocalTime and LocalDateTime"
sequence: "101"
---

[UP](/java-time.html)


常用的类：

- LocalDate
- LocalTime
- LocalDateTime

As their names indicate, they represent the local date/time from the context of the observer.

We mainly use these classes **when time zones are not required** to be explicitly specified in the context.

## LocalDate

The LocalDate represents a date in **ISO format (yyyy-MM-dd) without time.**
We can use it to store dates like birthdays and paydays.

### 创建对象

An instance of current date can be created from the system clock:

```text
LocalDate localDate = LocalDate.now();
```

```text
LocalDate.of(2015, 02, 20);

LocalDate.parse("2015-02-20");
```

### 单个时间

加 1 天：

```text
LocalDate tomorrow = LocalDate.now().plusDays(1);
```

减去 1 个月：

```text
LocalDate previousMonthSameDay = LocalDate.now().minus(1, ChronoUnit.MONTHS);
```

星期几：

```text
DayOfWeek sunday = LocalDate.parse("2016-06-12").getDayOfWeek();
```

月当中的天：

```text
int twelve = LocalDate.parse("2016-06-12").getDayOfMonth();
```

年（闰年）：

```text
boolean leapYear = LocalDate.now().isLeapYear();
```

首日：

```text
LocalDateTime beginningOfDay = LocalDate.parse("2024-01-31").atStartOfDay();    // 2024-01-31T00:00

LocalDate firstDayOfMonth = LocalDate.parse("2024-01-31")    // 2024-01-01
  .with(TemporalAdjusters.firstDayOfMonth());
```



### 两个时间

```text
boolean notBefore = LocalDate.parse("2016-06-12")
  .isBefore(LocalDate.parse("2016-06-11"));

boolean isAfter = LocalDate.parse("2016-06-12")
  .isAfter(LocalDate.parse("2016-06-11"));
```

## LocalTime

The LocalTime represents **time without a date.**

### 创建对象

Similar to `LocalDate`, we can create an instance of `LocalTime` from the system clock or
by using `parse` and `of` methods.

```text
LocalTime now = LocalTime.now();
```

```text
LocalTime sixThirty = LocalTime.parse("06:30");
```

```text
LocalTime sixThirty = LocalTime.of(6, 30);
```

### 一个时间

```text
LocalTime sevenThirty = LocalTime.parse("06:30").plus(1, ChronoUnit.HOURS);
```

```text
int six = LocalTime.parse("06:30").getHour();
```

### 两个时间

```text
boolean isbefore = LocalTime.parse("06:30").isBefore(LocalTime.parse("07:30"));
```

## LocalDateTime

### 创建对象

```text
LocalDateTime now = LocalDateTime.now();
```

```text
LocalDateTime.of(2015, Month.FEBRUARY, 20, 06, 30);
```

```text
LocalDateTime.parse("2015-02-20T06:30:00");
```

### 获取值

```java
import java.time.LocalDateTime;

public class LocalRun {
    public static void main(String[] args) {
        LocalDateTime localDateTime = LocalDateTime.parse("2015-02-20T06:30:20");
        LogUtils.log("Year      : {}", localDateTime.getYear());
        LogUtils.log("MonthValue: {}", localDateTime.getMonthValue());
        LogUtils.log("Month     : {}", localDateTime.getMonth());
        LogUtils.log("DayOfMonth: {}", localDateTime.getDayOfMonth());
        LogUtils.log("DayOfYear : {}", localDateTime.getDayOfYear());
        LogUtils.log("DayOfWeek : {}", localDateTime.getDayOfWeek());
        LogUtils.log("Hour      : {}", localDateTime.getHour());
        LogUtils.log("Minute    : {}", localDateTime.getMinute());
        LogUtils.log("Second    : {}", localDateTime.getSecond());
    }
}
```

```text
[main] WARN LogUtils - Year      : 2015
[main] WARN LogUtils - MonthValue: 2
[main] WARN LogUtils - Month     : FEBRUARY
[main] WARN LogUtils - DayOfMonth: 20
[main] WARN LogUtils - DayOfYear : 51
[main] WARN LogUtils - DayOfWeek : FRIDAY
[main] WARN LogUtils - Hour      : 6
[main] WARN LogUtils - Minute    : 30
[main] WARN LogUtils - Second    : 20
```

### 修改时间

#### 设置值

```text
LocalDateTime localDateTime = LocalDateTime.parse("2015-02-20T06:30:20");
LocalDateTime time = localDateTime.withMonth(1);
```

#### 偏移值

```text
localDateTime.plusDays(1);
```

```text
localDateTime.minusHours(2);
```

#### truncate

### 两个时间

### 格式化

```java
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.Locale;

public class LocalRun {
    public static void main(String[] args) {
        LocalDateTime now = LocalDateTime.now();
        String localDateString = now.format(
                DateTimeFormatter
                        .ofLocalizedDateTime(FormatStyle.MEDIUM)
                        .withLocale(Locale.UK)
        );
        System.out.println(localDateString);
    }
}
```
