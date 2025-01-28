---
title: "Java Time API"
sequence: "101"
---

[UP](/java-time.html)


Java 8 introduced a completely new Date Time API (`java.util.time.*`)
that is loosely based on the popular Java library called JodaTime.
This new API dramatically simplified date and time processing and
fixed many shortcomings of the old date library.

The new API has many different time representations, each suitable for different use cases:

- `Instant` – represents a point in time (timestamp)
- `LocalDate` – represents a date (year, month, day)
- `LocalDateTime` – same as `LocalDate`, but includes time with nanosecond precision
- `OffsetDateTime` – same as `LocalDateTime`, but with time zone offset
- `LocalTime` – time with nanosecond precision and without date information
- `ZonedDateTime` – same as `OffsetDateTime`, but includes a time zone ID
- `OffsetLocalTime` – same as `LocalTime`, but with time zone offset
- `MonthDay` – month and day, without year or time
- `YearMonth` – month and year, without day or time
- `Duration` – amount of time represented in seconds, minutes and hours. Has nanosecond precision
- `Period` – amount of time represented in days, months and years

## Example

Getting current time

```text
// Old
Date now = new Date();

// New
ZonedDateTime now = ZonedDateTime.now();
```

Representing specific time

```text
// Old
Date birthDay = new GregorianCalendar(1990, Calendar.DECEMBER, 15).getTime();

// New
LocalDate birthDay = LocalDate.of(1990, Month.DECEMBER, 15);
```

Extracting specific fields

```text
// Old
int month = new GregorianCalendar().get(Calendar.MONTH);

// New
Month month = LocalDateTime.now().getMonth();
```

Adding and subtracting time

```text
// Old
GregorianCalendar calendar = new GregorianCalendar();
calendar.add(Calendar.HOUR_OF_DAY, -5);
Date fiveHoursBefore = calendar.getTime();

// New
LocalDateTime fiveHoursBefore = LocalDateTime.now().minusHours(5);
```

Altering specific fields

```text
// Old
GregorianCalendar calendar = new GregorianCalendar();
calendar.set(Calendar.MONTH, Calendar.JUNE);
Date inJune = calendar.getTime();

// New
LocalDateTime inJune = LocalDateTime.now().withMonth(Month.JUNE.getValue());
```

Truncating

```text
// Old
Calendar now = Calendar.getInstance();
now.set(Calendar.MINUTE, 0);
now.set(Calendar.SECOND, 0);
now.set(Calendar.MILLISECOND, 0);
Date truncated = now.getTime();

// New
LocalTime truncated = LocalTime.now().truncatedTo(ChronoUnit.HOURS);
```

Time zone conversion

```text
// Old
GregorianCalendar calendar = new GregorianCalendar();
calendar.setTimeZone(TimeZone.getTimeZone("CET"));
Date centralEastern = calendar.getTime();

// New
ZonedDateTime centralEastern = LocalDateTime.now().atZone(ZoneId.of("CET"));
```

Getting time span between two points in time

```text
// Old
GregorianCalendar calendar = new GregorianCalendar();
Date now = new Date();
calendar.add(Calendar.HOUR, 1);
Date hourLater = calendar.getTime();
long elapsed = hourLater.getTime() - now.getTime();

// New
LocalDateTime now = LocalDateTime.now();
LocalDateTime hourLater = LocalDateTime.now().plusHours(1);
Duration span = Duration.between(now, hourLater);
```

Time formatting and parsing

```text
// Old
SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
Date now = new Date();
String formattedDate = dateFormat.format(now);
Date parsedDate = dateFormat.parse(formattedDate);

// New
LocalDate now = LocalDate.now();
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
String formattedDate = now.format(formatter);
LocalDate parsedDate = LocalDate.parse(formattedDate, formatter);
```

Number of days in a month

```text
// Old
Calendar calendar = new GregorianCalendar(1990, Calendar.FEBRUARY, 20);
int daysInMonth = calendar.getActualMaximum(Calendar.DAY_OF_MONTH);

// New
int daysInMonth = YearMonth.of(1990, 2).lengthOfMonth();
```

## Interacting With Legacy Code

```text
Instant instantFromCalendar = GregorianCalendar.getInstance().toInstant();
ZonedDateTime zonedDateTimeFromCalendar = new GregorianCalendar().toZonedDateTime();
Date dateFromInstant = Date.from(Instant.now());
GregorianCalendar calendarFromZonedDateTime = GregorianCalendar.from(ZonedDateTime.now());
Instant instantFromDate = new Date().toInstant();
ZoneId zoneIdFromTimeZone = TimeZone.getTimeZone("PST").toZoneId();
```
