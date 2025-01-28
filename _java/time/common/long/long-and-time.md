---
title: "long 与时间的转换"
sequence: "101"
---

[UP](/java-time.html)


## Java 8

### Instant

使用秒（注意：输出的时间与东八区差 8 小时）：

```text
long secondsSinceEpoch = System.currentTimeMillis() / 1000;

Instant date = Instant.ofEpochSecond(secondsSinceEpoch);
```

使用微秒（注意：输出的时间与东八区差 8 小时）：

```text
long milliSecondsSinceEpoch = System.currentTimeMillis();

Instant date = Instant.ofEpochMilli(milliSecondsSinceEpoch);
```

指定时区，就会正确显示：

```text
long milliSecondsSinceEpoch = System.currentTimeMillis();

ZoneId zoneId = ZoneId.of("Asia/Shanghai");
ZonedDateTime zonedDateTime = Instant.ofEpochMilli(milliSecondsSinceEpoch).atZone(zoneId);
LocalDateTime localDateTime = zonedDateTime.toLocalDateTime();
```

```text
long milliSecondsSinceEpoch = System.currentTimeMillis();

Instant instant = Instant.ofEpochMilli(milliSecondsSinceEpoch);
LocalDateTime localDateTime = LocalDateTime.ofInstant(instant, ZoneId.of("UTC"));
```

从 `LocalDateTime` 转换成 `long`：

```text
LocalDateTime localDateTime = LocalDateTime.parse("2019-11-15T13:15:30");
long epochMilliSecondsAtTime = localDateTime.atZone(zoneId).toInstant().toEpochMilli();
```

## Legacy Date API

### Date

```text
long milliseconds = System.currentTimeMillis();
Date date = new Date(milliseconds);
```

### Calendar

```text
long milliseconds = System.currentTimeMillis();

Calendar calendar = Calendar.getInstance();
calendar.setTimeZone(TimeZone.getTimeZone("UTC"));
calendar.setTimeInMillis(milliseconds);
Date date = calendar.getTime();
```
