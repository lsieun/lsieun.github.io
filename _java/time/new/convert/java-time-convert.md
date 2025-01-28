---
title: "新旧时间 API 转换"
sequence: "101"
---

[UP](/java-time.html)


## Old

### Date

将 `Date` 转换为 `LocalDateTime`：

```text
Date date = new Date();
LocalDateTime localDateTime = LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
```

### Calendar

将 `Calendar` 转换为 `LocalDateTime`：

```text
Calendar calendar = Calendar.getInstance();
LocalDateTime localDateTime = LocalDateTime.ofInstant(calendar.toInstant(), ZoneId.systemDefault());
```

### Long

将 epoch seconds 转换为 `LocalDateTime`：

```text
long timestamp = System.currentTimeMillis() / 1000;
LocalDateTime localDateTime = LocalDateTime.ofEpochSecond(timestamp, 0, ZoneOffset.UTC); // 差 8 个小时
```

```text
LocalDateTime localDateTime = LocalDateTime.ofEpochSecond(timestamp, 0, ZoneOffset.ofHours(8)); // 东八区时间
```

## New

### LocalDateTime

将 `LocalDateTime` 转换为 `long`（epoch milliseconds）类型：

```text
LocalDateTime.now().plusDays(days).truncatedTo(ChronoUnit.DAYS)
.atZone(ZoneId.systemDefault())
.toInstant()
.toEpochMilli();
```
