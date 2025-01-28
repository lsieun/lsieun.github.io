---
title: "First Date of Current Month"
sequence: "101"
---

[UP](/java-time.html)


## Java 8 Date Time API

### LocalDate

```text
LocalDate currentDate = LocalDate.of(2023, 9, 6);
LocalDate localDate = currentDate.withDayOfMonth(1);
```

### TemporalAdjusters

```text
LocalDate currentDate = LocalDate.of(2023, 9, 6);
LocalDate localDate = currentDate.with(TemporalAdjusters.firstDayOfMonth());
```

### YearMonth

```text
YearMonth currentDate = YearMonth.of(2023, 4);
LocalDate localDate = currentDate.atDay(1);
```

## Legacy Date API

### Calendar

```text
Date now = new Date();
Calendar calendar = Calendar.getInstance();
calendar.setTime(now);
calendar.set(Calendar.DAY_OF_MONTH, 1);
Date date = calendar.getTime();
```
