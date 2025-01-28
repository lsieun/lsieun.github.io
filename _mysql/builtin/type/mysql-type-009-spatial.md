---
title: "空间数据"
sequence: "109"
---

在 MySQL 中，`Geometry` 等几何对象可以用来表示地理位置，即用几何对象表示地理空间数据。

在 MySQL 中，支持的几何数据类型包括 `Geometry`、`Point`、`LineString`、`Polygon`，
以及集合类型的 `MultiPoint`、`MultiLineString`、`MultiPolygon`、`GeometryCollection`。

其中，`Geometry` 可以表示任意一种几何类型。
在 MySQL 中，如果一个字段类型是 `Geometry`，则可以存储 `Point`、`LineString` 等其它几何类型的值。其他的几种则需要固定有效的表示格式。

Two standard spatial data formats are used to represent geometry objects in queries:

- Well-Known Text (WKT) format
- Well-Known Binary (WKB) format

Internally, MySQL stores geometry values in a format that is not identical to either WKT or WKB format.
(Internal format is like WKB but with an initial 4 bytes to indicate the SRID.)

## 数据格式

在 MySQL 中有 3 种表达几何对象的格式：

- WKT（文本格式） [Well-Known Text (WKT) Format](https://dev.mysql.com/doc/refman/8.0/en/gis-data-formats.html#gis-wkt-format)
- WKB（二进制格式） [Well-Known Binary (WKB) Format](https://dev.mysql.com/doc/refman/8.0/en/gis-data-formats.html#gis-wkb-format)
- MySQL 内部存储格式 [Internal Geometry Storage Format](https://dev.mysql.com/doc/refman/8.0/en/gis-data-formats.html#gis-internal-format)

WKT 是文本格式，因此可以直接使用文本来表示几何数据，实现数据的插入与编辑。

## 数据类型

| 类型                 | 含义     | 说明                | 示例                                                                         |
|--------------------|--------|-------------------|----------------------------------------------------------------------------|
| Geometry           | 空间数据   | 任意一种空间类型          |                                                                            |
| Point              | 点      | 坐标值               | POINT(121.474 31.2329)                                                     |
| LineString         | 线      | 由一系列点连接而成         | LINESTRING(3 0,  3 3, 3 5)                                                 |
| Polygon            | 多边形    | 由多条线组成            | POLYGON((1 1, 2 1, 2 2,  1 2, 1 1))                                        |
| MultiPoint         | 点集合    | 集合类，包含多个点         | MULTIPOINT(0 0, 20 20, 60 60)                                              |
| MultiLineString    | 线集合    | 集合类，包含多条线         | MULTILINESTRING((10 10, 20 20), (15 15, 30 15))                            |
| MultiPolygon       | 多边形集合  | 集合类，包含多个多边形       | MULTIPOLYGON(((0 0, 10 0, 10 10, 0 10, 0 0)), ((5 5, 7 5, 7 7, 5 7, 5 5))) |
| GeometryCollection | 空间数据集合 | 集合类，可以包括多个点、线、多边形 | GEOMETRYCOLLECTION(POINT(10 10), POINT(30 30), LINESTRING(15 15, 20 20))   |


## 常用函数

```text
DROP TABLE IF EXISTS `geom`;

CREATE TABLE `geom` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` VARCHAR(32) NOT NULL COMMENT '名称',
  `shape` GEOMETRY DEFAULT NULL COMMENT '空间数据',
  PRIMARY KEY (`id`)
) COMMENT='地理信息';

SELECT * FROM `geom`;
```

```text
INSERT INTO `geom` (`name`, `shape`)
VALUES ('point', ST_GEOMFROMTEXT('POINT(121.474 31.2329)'));
INSERT INTO `geom` (`name`, `shape`)
VALUES ('line string', ST_GEOMFROMTEXT('LINESTRING(3 0,  3 3, 3 5)'));
INSERT INTO `geom` (`name`, `shape`)
VALUES ('polygon', ST_GEOMFROMTEXT('POLYGON((1 1, 2 1, 2 2,  1 2, 1 1))'));
INSERT INTO `geom` (`name`, `shape`)
VALUES ('multi point', ST_GEOMFROMTEXT('MULTIPOINT(0 0, 20 20, 60 60)'));
INSERT INTO `geom` (`name`, `shape`)
VALUES ('multi line string', ST_GEOMFROMTEXT('MULTILINESTRING((10 10, 20 20), (15 15, 30 15))'));
INSERT INTO `geom` (`name`, `shape`)
VALUES ('multi polygon', ST_GEOMFROMTEXT('MULTIPOLYGON(((0 0, 10 0, 10 10, 0 10, 0 0)), ((5 5, 7 5, 7 7, 5 7, 5 5)))'));
INSERT INTO `geom` (`name`, `shape`)
VALUES ('geometry collection', ST_GEOMFROMTEXT('GEOMETRYCOLLECTION(POINT(10 10), POINT(30 30), LINESTRING(15 15, 20 20))'));
```

### ST_GEOMFROMTEXT

用于将几何数据从可读的文本类型转换成内部存储的二进制类型。

示例：

```text
INSERT INTO `geom` (`name`, `shape`)
VALUES ('G1', ST_GEOMFROMTEXT('POINT(120 30)'));
```

### ST_ASTEXT

读取数据：

```text
SELECT `id`, `name`, ST_ASTEXT(`shape`) FROM `geom`;
```

```text
mysql> SELECT `id`, `name`, ST_ASTEXT(`shape`) FROM `geom`;
+----+---------------------+-----------------------------------------------------------------------+
| id | name                | ST_ASTEXT(`shape`)                                                    |
+----+---------------------+-----------------------------------------------------------------------+
|  1 | point               | POINT(121.474 31.2329)                                                |
|  2 | line string         | LINESTRING(3 0,3 3,3 5)                                               |
|  3 | polygon             | POLYGON((1 1,2 1,2 2,1 2,1 1))                                        |
|  4 | multi point         | MULTIPOINT((0 0),(20 20),(60 60))                                     |
|  5 | multi line string   | MULTILINESTRING((10 10,20 20),(15 15,30 15))                          |
|  6 | multi polygon       | MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)),((5 5,7 5,7 7,5 7,5 5)))     |
|  7 | geometry collection | GEOMETRYCOLLECTION(POINT(10 10),POINT(30 30),LINESTRING(15 15,20 20)) |
+----+---------------------+-----------------------------------------------------------------------+
7 rows in set (0.00 sec)
```

### ST_GEOHASH

可以将一个地理位置（Point）转换为一个指定长度的字符串，只有 Point 中存储的是经纬度
即第一第二坐标范围分别在 `(-180,180)` 与 `[-90,90]` 内时才可以转换成功。

```text
SELECT `id`, `name`, ST_GEOHASH(`shape`, 8) FROM `geom` WHERE `name` = 'point';
```

```text
mysql> SELECT `id`, `name`, ST_GEOHASH(`shape`, 8) FROM `geom` WHERE `name` = 'point';
+----+-------+------------------------+
| id | name  | ST_GEOHASH(`shape`, 8) |
+----+-------+------------------------+
|  1 | point | wtw3sjy8               |
+----+-------+------------------------+
```

### ST_ASGEOJSON

```text
SELECT ST_ASGEOJSON(ST_GEOMFROMTEXT('POINT(11.11111 12.22222)'),2);
SELECT ST_ASGEOJSON(ST_GEOMFROMTEXT('POINT(-0.127676 51.507344)', 4326), 5, 4);
```

```text
mysql> SELECT ST_ASGEOJSON(ST_GEOMFROMTEXT('POINT(11.11111 12.22222)'),2);
+-------------------------------------------------------------+
| ST_ASGEOJSON(ST_GEOMFROMTEXT('POINT(11.11111 12.22222)'),2) |
+-------------------------------------------------------------+
| {"type": "Point", "coordinates": [11.11, 12.22]}            |
+-------------------------------------------------------------+
1 row in set (0.00 sec)

mysql> SELECT ST_ASGEOJSON(ST_GEOMFROMTEXT('POINT(-0.127676 51.507344)', 4326), 5, 4);
+---------------------------------------------------------------------------------------------------------------------------------------+
| ST_ASGEOJSON(ST_GEOMFROMTEXT('POINT(-0.127676 51.507344)', 4326), 5, 4)                                                               |
+---------------------------------------------------------------------------------------------------------------------------------------+
| {"crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:EPSG::4326"}}, "type": "Point", "coordinates": [51.50734, -0.12768]} |
+---------------------------------------------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)
```

### Other

```text
SET @g = ST_GEOMFROMTEXT('POINT(1 -1)');
SELECT LENGTH(@g);
SELECT HEX(@g);
SELECT ST_ASTEXT(@g);
```

```text
mysql> SET @g = ST_GEOMFROMTEXT('POINT(1 -1)');
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT LENGTH(@g);
+------------+
| LENGTH(@g) |
+------------+
|         25 |
+------------+
1 row in set (0.00 sec)

mysql> SELECT HEX(@g);
+----------------------------------------------------+
| HEX(@g)                                            |
+----------------------------------------------------+
| 000000000101000000000000000000F03F000000000000F0BF |
+----------------------------------------------------+
1 row in set (0.00 sec)

mysql> SELECT ST_ASTEXT(@g);
+---------------+
| ST_ASTEXT(@g) |
+---------------+
| POINT(1 -1)   |
+---------------+
1 row in set (0.00 sec)
```

## Reference

- [Geometry Format Conversion Functions](https://dev.mysql.com/doc/refman/8.0/en/gis-format-conversion-functions.html)

