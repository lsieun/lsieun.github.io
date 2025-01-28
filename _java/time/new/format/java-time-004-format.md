---
title: "Date and Time Formatting"
sequence: "104"
---

[UP](/java-time.html)


```text
LocalDateTime localDateTime = LocalDateTime.now();
```

```text
String localDateString = localDateTime.format(DateTimeFormatter.ISO_DATE); // 2024-02-02
String localDateString = localDateTime.format(DateTimeFormatter.ISO_DATE_TIME); // 2024-02-02T20:12:03.3948806
```

```text
localDateTime.format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
```

```text
localDateTime
  .format(DateTimeFormatter.ofLocalizedDateTime(FormatStyle.MEDIUM)
  .withLocale(Locale.UK));
```
