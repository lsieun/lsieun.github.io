---
title: "ROUND()"
sequence: "round"
---

## Example

Round the number to 2 decimal places:

```text
SELECT ROUND(135.375, 2);
```

## Definition and Usage

The `ROUND()` function rounds a number to a specified number of decimal places.

Note: See also the `FLOOR()`, `CEIL()`, `CEILING()`, and `TRUNCATE()` functions.

## Syntax

```text
ROUND(number, decimals)
```

## Parameter Values

| Parameter | Description                                                                                                 |
|-----------|-------------------------------------------------------------------------------------------------------------|
| number    | Required. The number to be rounded                                                                          |
| decimals  | Optional. The number of decimal places to round number to. If omitted, it returns the integer (no decimals) |

## Reference

- [MySQL ROUND() Function](https://www.w3schools.com/sqL/func_mysql_round.asp)
