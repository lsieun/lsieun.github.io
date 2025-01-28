---
title: "ENERGY"
sequence: "energy"
---

The `[ENERGY]` defines parameters used to compute **pumping energy and cost**.

- 组件：pump

## 三种格式

### 全局

第一种格式（全局）：

```text
GLOBAL PRICE/PATTERN/EFFIC value
```

First format is used to set global default values of
**energy price**, **price pattern**, and **pumping efficiency** for **all pumps**.

### 单独

第二种格式（单独的水泵）：

```text
PUMP pumpID PRICE/PATTERN/EFFIC value
```

Second format is used to override global defaults for **specific pumps**.

第三种格式：

```text
DEMAND CHARGE value
```

Parameters are defined as follows:

- `PRICE` = average cost per kW-hour,
- `PATTERN` = ID label of time pattern describing **how energy price varies with time**,
- `EFFIC` = either **a single percent efficiency for global setting** or
  **the ID label of an efficiency curve for a specific pump**,
- `DEMAND CHARGE` = added cost per maximum kW usage during the simulation period.


## 示例

```text
[ENERGY]
GLOBAL PRICE      0.05   ;Sets global energy price
GLOBAL PATTERN    PAT1   ;and time-of-day pattern
PUMP   23  PRICE  0.10   ;Overrides price for Pump 23
PUMP   23  EFFIC  E23    ;Assigns effic. curve to Pump 23
```

## 默认值

The default global pump efficiency is `75%` and the default global energy price is `0`.

