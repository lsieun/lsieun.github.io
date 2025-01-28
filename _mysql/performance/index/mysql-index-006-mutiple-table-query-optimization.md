---
title: "多表关联优化"
sequence: "106"
---

## 嵌套循环关联

在 MySQL 中，进行多表关联，使用的是“嵌套循环关联”。

Nested Loop Join = NLJ

```text
SELECT tbl1.col1,tbl2.col2 from tbl1,tbl2 
WHERE tbl1.col3 = tbl2.col3 AND tbl1.col3 = 1
```

### 驱动表

左侧循环的表，称为“驱动表”

![](/assets/images/db/mysql/performance/index/nested-loop-join-driving-table.png)

对于驱动表来说，查询出的数据量越少越好。
如果驱动表查询的数据量很多，那么内侧的循环的数量也会增多。

查询优化器，会优先选择“筛选结果少的表”作为“驱动表”。

查询优化器，如何选择驱动表？是由 MySQL 自动分析得到的。

## 实验

### 创建数据库

第 1 步，创建数据库：

```mysql
CREATE DATABASE `babytun`
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

第 2 步，导入数据：

```text

```

### 慢查询 SQL

```mysql
SELECT gc.*, g.title
FROM t_goods g,
     t_goods_cover gc
WHERE g.goods_id = gc.goods_id
  AND g.category_id = 44;
```

```mysql
EXPLAIN SELECT gc.*, g.title FROM t_goods g,t_goods_cover gc WHERE g.goods_id = gc.goods_id AND g.category_id = 44;
```

```text
mysql> EXPLAIN SELECT gc.*, g.title FROM t_goods g,t_goods_cover gc WHERE g.goods_id = gc.goods_id AND g.category_id = 44;
+----+-------------+-------+------------+--------+---------------+---------+---------+---------------------+------+----------+-------------+
| id | select_type | table | partitions | type   | possible_keys | key     | key_len | ref                 | rows | filtered | Extra       |
+----+-------------+-------+------------+--------+---------------+---------+---------+---------------------+------+----------+-------------+
|  1 | SIMPLE      | gc    | NULL       | ALL    | NULL          | NULL    | NULL    | NULL                | 9454 |   100.00 | NULL        |
|  1 | SIMPLE      | g     | NULL       | eq_ref | PRIMARY       | PRIMARY | 4       | babytun.gc.goods_id |    1 |    10.00 | Using where |
+----+-------------+-------+------------+--------+---------------+---------+---------+---------------------+------+----------+-------------+
2 rows in set, 1 warning (0.00 sec)
```

在上面的 `EXPLAIN` 语句的输出结果中，`type` 值表示“扫描的类型”，具体的含义：

- `ALL`：全表扫描
- `eq_ref`：联表查询的情况，按联表的主键或唯一键联合查询。
- `ref`：非主键或唯一索引的等值检索（既不是**主键索引**，也不是**唯一索引**）

`EXPLAIN` 语句 默认第一行出现的表就是**驱动表**，由查询优化器自动选择。

- `gc` 表（`t_goods_cover` 表）是驱动表，它使用全表扫描（type=ALL），其中 `rows` 为 9454 表示扫描了 9454 行数据。这个的执行效率很差。
- `g` 表（`t_goods` 表），它使用 `eq_ref` 查询，外键的值为 `babytun.gc.goods_id`。

### 添加索引

关联查询优化要点

第 1 点，外键上加索引：

```text
CREATE INDEX idx_goods_id ON t_goods_cover(goods_id);
```

```text
mysql> CREATE INDEX idx_goods_id ON t_goods_cover(goods_id);
Query OK, 0 rows affected (0.11 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

第 2 点，查询条件上加索引：

```text
CREATE INDEX idx_category_id ON t_goods(category_id);
```

```text
mysql> CREATE INDEX idx_category_id ON t_goods(category_id);
Query OK, 0 rows affected (0.15 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

查看执行计划：

```mysql
EXPLAIN SELECT gc.*, g.title FROM t_goods g,t_goods_cover gc WHERE g.goods_id = gc.goods_id AND g.category_id = 44;
```

```text
mysql> EXPLAIN SELECT gc.*, g.title FROM t_goods g,t_goods_cover gc WHERE g.goods_id = gc.goods_id AND g.category_id = 44;
+----+-------------+-------+------------+------+-------------------------+-----------------+---------+--------------------+------+----------+-------+
| id | select_type | table | partitions | type | possible_keys           | key             | key_len | ref                | rows | filtered | Extra |
+----+-------------+-------+------------+------+-------------------------+-----------------+---------+--------------------+------+----------+-------+
|  1 | SIMPLE      | g     | NULL       | ref  | PRIMARY,idx_category_id | idx_category_id | 4       | const              |   74 |   100.00 | NULL  |
|  1 | SIMPLE      | gc    | NULL       | ref  | idx_goods_id            | idx_goods_id    | 4       | babytun.g.goods_id |    4 |   100.00 | NULL  |
+----+-------------+-------+------------+------+-------------------------+-----------------+---------+--------------------+------+----------+-------+
2 rows in set, 1 warning (0.00 sec)
```

从上面的查询结果中，可以看到：

- `g` 表成为“驱动表”，使用 `idx_category_id` 进行索引，扫描的数据为 74 行（rows = 74），这个执行速度显然快了许多。
- `gc` 表，使用 `idx_goods_id` 进行索引

### 索引引起的性能差距

一条 SQL 语句，第一次查询的时候，是从硬盘读取；
但是，第二查询的时候，由于 InnoDB 是有缓存的，它会把缓存的数据直接从内存提取。
所以，从第二次查询开始，它的查询速度就会很快。

在 MySQL 5.7 版本中，为了避免查询缓存的影响，可以关闭查询缓存：

```mysql
SET GLOBAL query_cache_size=0;
SET GLOBAL query_cache_type=0;
```

在 MySQL 8.0 版本中，已经废弃了 查询缓存。

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class SqlOptimize {
    public static void main(String[] args) throws Exception {
        // 第 1 步，数据库连接信息
        String url = "jdbc:mysql:///babytun?useUnicode=true&characterEncoding=UTF-8&useSSL=false";
        String username = "root";
        String password = "123456";

        // 第 2 步，加载驱动类
        // Class.forName("com.mysql.jdbc.Driver");
        Class.forName("com.mysql.cj.jdbc.Driver");

        // 第 3 步，查询 SQL，计算时间
        Connection connection = DriverManager.getConnection(url, username, password);
        PreparedStatement pstmt = connection.prepareStatement(
                "select gc.*, g.title from  t_goods g, t_goods_cover gc " +
                        "where g.goods_id = gc.goods_id and g.category_id = 44"
        );
        long begin = new java.util.Date().getTime();
        for (int i = 0; i < 10000; i++) {
            ResultSet rs = pstmt.executeQuery();
            rs.close();
        }
        long end = new java.util.Date().getTime();
        System.out.println("1万次执行时间:" + (end - begin) + "毫秒，平均执行时间:" + (end - begin) / 10000f + "毫秒");
        connection.close();
    }
}
```

第 1 次测试，移除索引:

```mysql
DROP INDEX idx_category_id ON t_goods;
DROP INDEX idx_goods_id ON t_goods_cover;
```

输出结果：

```text
1万次执行时间:87413毫秒，平均执行时间:8.7413毫秒
```

第 2 次测试，添加索引：

```mysql
CREATE INDEX idx_category_id ON t_goods(category_id);
CREATE INDEX idx_goods_id ON t_goods_cover(goods_id);
```

输出结果：

```text
1万次执行时间:12227毫秒，平均执行时间:1.2227毫秒
```

可以看出性能提升了 7 倍：不使用索引，8.7413 毫秒；使用索引，1.2227 毫秒。
