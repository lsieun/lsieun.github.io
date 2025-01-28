---
title: "MySQL 数据类型的选择"
sequence: "101"
---

## 字段类型的优先级

- 1、数字类型
- 2、日期类型与二进制类型
- 3、字符串类型

原则：优先选择存储空间的数据类型。

InnoDB 引擎页长度为 16K。

## 数字类型

### 整数类型 Integer Types

| Type        | Storage (Bytes) | Range (SIGNED)         | Range (UNSIGNED) |
|-------------|-----------------|------------------------|------------------|
| `TINYINT`   | 1               | -128~127               | 0~255            |
| `SMALLINT`  | 2               | -32768~32767           | 0~65535          |
| `MEDIUMINT` | 3               | -8388608~ 8388607      | 0~16777215       |
| `INT`       | 4               | -2147483648~2147483647 | 0~4294967295     |
| `BIGINT`    | 8               | -2^63~2^63-1           | 0~2^64-1         |

### 实数类型 Floating-Point Types

| Type    | Storage (Bytes) | Exact Value |
|---------|-----------------|-------------|
| FLOAT   | 4               | NO          |
| DOUBLE  | 8               | NO          |
| DECIMAL |                 | YES         |

`DECIMAL(18, 9)` 占用 9 个字节，财务数据一定要使用 `DECIMAL`。

## 字符串类型

### VARCHAR 类型

VARCHAR 属于变长数据，根据实际内容保存数据：

- 使用最小的符合需求的长度
- `VARCHAR(255)`以下使用额外一个字节保存长度
- `VARCHAR(255)`以上使用额外两个字节保存长度
- `VARCHAR(5)` 与 `VARCHAR(200)` 内存占用不同
- `VARCHAR` 变更长度时，会出现锁表

使用场景：

- `VARCHAR` 适合存储长度波动大的数据，例如博客文章 （数据量）
- 字符串很少被更新的场景 （更新频率小）
- `VARCHAR` 适合保存多字节字符

### CHAR 类型

CHAR属于定长数据：

- `CHAR` 最大长度255
- `CHAR` 类型会自动删除末尾的空格
- `CHAR` 检索效率比 `VARCHAR` 高

使用场景：

- `CHAR` 适合存储长度波动不大的数据，例如 `MD5` 摘要 （数据量，变化范围小）
- `CHAR` 适合存储短字符串
- `CHAR` 类型适合存储经常更新的字符串 （更新频率大）

## 时间类型

### DATETIME 日期类型

`DATETIME` 日期时间类型，占用 8 个字节：

- 时间范围：可保存时间范围大
- 时间精度：可保存到毫秒
- 时区相关：无关

注意：不要使用字符串存储日期类型

### TIMESTAMP 时间戳

`TIMESTAMP` 时间戳，占用 4 个字节：

- 时间范围: `1970-01-01` 到 `2038-01-19`
- 时间精度：秒
- 时区相关：依赖于时区
- 采用整型存储
- 自动更新 timestamp 列的值

## Reference

- [MySQL 8.0 Reference Manual](https://dev.mysql.com/doc/refman/8.0/en/)
    - [Chapter 11 Data Types](https://dev.mysql.com/doc/refman/8.0/en/data-types.html)
