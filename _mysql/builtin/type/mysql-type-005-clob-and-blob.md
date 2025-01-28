---
title: "CLOB"
sequence: "105"
---

## CLOB

```text
CLOB: Character Large Object
```


- MySQL Server support CLOB data type with column type of `LONGTEXT`
  that hold a character value of up to 4,294,967,295 or 4GB (2**32 - 1) characters.
- Character data can be directly inserted into a CLOB column using the INSERT statement.
- Character data can also be indirectly inserted into a CLOB column using the PreparedStatement object with setSring(), setCharacterStream(), and setClob() methods.
- Character data can be retrieved from a CLOB column using getString(), getCharacterStream(), and getClob() methods on the ResultSet object.

相关类型：

| 类型         | 最大大小                |
|------------|---------------------|
| TinyText   | 255 字节               |
| Text       | 65535 字节（约 65K）       |
| MediumText | 16 777 215 字节（约 16M）  |
| LongText   | 4 294 967 295 ( 约 4G) |

## BLOB

相关类型：

| 类型         | 最大大小                |
|------------|---------------------|
| TinyBlob   | 255 字节               |
| Blob       | 65535 字节（约 65K）       |
| MediumBlob | 16 777 215 字节（约 16M）  |
| LongBlob   | 4 294 967 295 ( 约 4G) |

## Reference

- [Mysql 中的 clob 和 blob](https://blog.csdn.net/liyazhen2011/article/details/89947141)
