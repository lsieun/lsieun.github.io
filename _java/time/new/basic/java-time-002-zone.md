---
title: "ZonedDateTime"
sequence: "102"
---

[UP](/java-time.html)


Java 8 provides `ZonedDateTime` when we need to deal with time-zone-specific date and time.
The `ZoneId` is an identifier used to represent different zones.

## ZoneId

### 创建对象

默认：

```text
ZoneId zoneId = ZoneId.systemDefault(); // Asia/Shanghai
```

指定值：

```text
ZoneId zoneId = ZoneId.of("Asia/Shanghai");
```

所有：

```text
Set<String> allZoneIds = ZoneId.getAvailableZoneIds();
```

## ZonedDateTime

### 创建对象

第 1 种方式，由 `LocalDateTime` 转换成 `ZonedDateTime`：

```text
LocalDateTime localDateTime = LocalDateTime.now();
ZoneId zoneId = ZoneId.systemDefault();
ZonedDateTime zonedDateTime = ZonedDateTime.of(localDateTime, zoneId);
```

```text
2024-02-02T19:37:01.625539200+08:00[Asia/Shanghai]
```

第 2 种方式，字符串解析：

```text
ZonedDateTime.parse("2015-05-03T10:15:30+01:00[Europe/Paris]");
```

```java

```

## OffsetDateTime

The `OffsetDateTime` is an immutable representation of a date-time with an offset.
This class stores all date and time fields, to a precision of nanoseconds,
as well as the offset from UTC/Greenwich.

The `OffSetDateTime` instance can be created using `ZoneOffset`.

```text
LocalDateTime localDateTime = LocalDateTime.of(2015, Month.FEBRUARY, 20, 06, 30);
ZoneOffset offset = ZoneOffset.of("+02:00");

OffsetDateTime offSetByTwo = OffsetDateTime.of(localDateTime, offset);
```

```text
2015-02-20T06:30+02:00
```
