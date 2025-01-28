---
title: "Time: DATE, DATETIME, TIMESTAMP"
sequence: "103"
---

MySQL 中常见的时间类型有三种：`DATE`, `DATETIME` 和 `TIMESTAMP`。

其中，`DATE` 类型用于表示日期，但是不会包含时间，格式为 `YYYY-MM-DD`，而 `DATETIME` 和 `TIMESTAMP` 用于表示日期和时间，常见的格式为 `YYYY-MM-DD HH:MM:SS`，也可以带 6 位小数来表示微秒。

不同于 `DATETIME`，`TIMESTAMP` 支持的时间范围从 `1970-01-01 00:00:01.000000` 到 `2038-01-19 03:14:07.999999`，
使用了 `TIMESTAMP` 的应用很有可能在 `2038-01-19 03:14:07.999999` 之后宕机。

The `DATE`, `DATETIME`, and `TIMESTAMP` types are related.
This section describes their characteristics, **how they are similar**, and **how they differ**.

The `DATE` type is used for values with **a date part but no time part**.
MySQL retrieves and displays `DATE` values in 'YYYY-MM-DD' format.
The supported range is '1000-01-01' to '9999-12-31'.

The `DATETIME` type is used for values that contain **both date and time parts**.
MySQL retrieves and displays `DATETIME` values in 'YYYY-MM-DD hh:mm:ss' format.
The supported range is '1000-01-01 00:00:00' to '9999-12-31 23:59:59'.

The `TIMESTAMP` data type is used for values that contain **both date and time parts**.
`TIMESTAMP` has a range of '1970-01-01 00:00:01' UTC to '2038-01-19 03:14:07' UTC.

A `DATETIME` or `TIMESTAMP` value can include a trailing fractional seconds part in up to microseconds (6 digits) precision.
In particular, any **fractional part** in a value inserted into a `DATETIME` or `TIMESTAMP` column is stored rather than discarded.
With the fractional part included, the format for these values is `'YYYY-MM-DD hh:mm:ss[.fraction]'`,
the range for `DATETIME` values is '1000-01-01 00:00:00.000000' to '9999-12-31 23:59:59.999999',
and the range for `TIMESTAMP` values is '1970-01-01 00:00:01.000000' to '2038-01-19 03:14:07.999999'.
The fractional part should always be separated from the rest of the time by a decimal point;
no other fractional seconds delimiter is recognized.

> fractional part

The `TIMESTAMP` and `DATETIME` data types offer **automatic initialization and updating** to the current date and time.

> automatic initialization and updating

MySQL converts `TIMESTAMP` values from the **current time zone** to **UTC** for storage,
and back from **UTC** to the **current time zone** for retrieval.
(This does not occur for other types such as `DATETIME`.)
By default, the current time zone for each connection is the server's time.
The time zone can be set on a per-connection basis.
As long as the time zone setting remains constant, you get back the same value you store.
If you store a `TIMESTAMP` value, and then change the time zone and retrieve the value,
the retrieved value is different from the value you stored.
This occurs because the same time zone was not used for conversion in both directions.
The current time zone is available as the value of the `time_zone` system variable.

In MySQL 8.0.19 and later, you can specify a time zone offset
when inserting a `TIMESTAMP` or `DATETIME` value into a table.

## Automatic Initialization and Updating for TIMESTAMP and DATETIME

`TIMESTAMP` and `DATETIME` columns can be automatically initialized and updated to the current date and time
(that is, the current timestamp).

To specify automatic properties, use the `DEFAULT CURRENT_TIMESTAMP` and `ON UPDATE CURRENT_TIMESTAMP` clauses in column definitions.
The order of the clauses does not matter.
If both are present in a column definition, either can occur first.
Any of the synonyms for `CURRENT_TIMESTAMP` have the same meaning as `CURRENT_TIMESTAMP`.
These are `CURRENT_TIMESTAMP()`, `NOW()`, `LOCALTIME`, `LOCALTIME()`, `LOCALTIMESTAMP`, and `LOCALTIMESTAMP()`.

Use of `DEFAULT CURRENT_TIMESTAMP` and `ON UPDATE CURRENT_TIMESTAMP` is specific to `TIMESTAMP` and `DATETIME`.
The `DEFAULT` clause also can be used to specify a constant (nonautomatic) default value
(for example, `DEFAULT 0` or `DEFAULT '2000-01-01 00:00:00'`).

```text
CREATE TABLE t1 (
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  dt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Reference

- [The DATE, DATETIME, and TIMESTAMP Types](https://dev.mysql.com/doc/refman/8.0/en/datetime.html)
- [Date and Time Literals](https://dev.mysql.com/doc/refman/8.0/en/date-and-time-literals.html)
- [Automatic Initialization and Updating for TIMESTAMP and DATETIME](https://dev.mysql.com/doc/refman/8.0/en/timestamp-initialization.html)

