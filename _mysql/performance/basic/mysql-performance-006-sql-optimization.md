---
title: "SQL 语句优化"
sequence: "106"
---

- select
- where
    - 单列索引
        - 精确匹配
            - 不在索引列上做任何操作（计算、函数、（自动or手动）类型转换）
        - 范围查询
        - 模糊查询 like
    - 多列索引
        - 最左前缀法则
- order by

## 索引优化技巧

- 1、全值匹配我最爱，最左前缀要遵守；
- 2、带头大哥不能死，中间兄弟不能断；
- 3、索引列上少计算；范围之后全失效；
- 4、like 百分写最右；覆盖索引不写量；
- 5、不等空值还有 OR；索引失效要少用；
- 6、VAR 引号不可丢；SQL 高级也不难；

下面通过案例理解上面的技巧：

假设表 `Y` 建立索引 `index(a,b,c)`，`Y` 表还有很多其他字段未列出；
`a` 是字符类型，`b`、`c` 是整型；
若测试表 `Y` 只有 `a`、`b`、`c` 三个字段，不能达到测试效。

1 和 2的含义是：若是多列索引，要遵守最左前缀法则；
指的是查询从索引的最左前列开始并且不跳过索引中间的列，同时如果能够所有索引列都能匹配是最完美的。

```text
# 使用到索引列a，其他b、c并未使用到
select * from Y where a='1';

# 使用到索引a、b，未使用到c
select * from Y where a='1' and b=2;

# 所有的索引列都使用到，最好的最完美的方式
select * from Y where a='1' and b=2 and c=3;

# 跳过了索引a，所有的索引都未使用到（所以带头大哥不能死哟）
select * from Y where b=2 and c=3;
select * from Y where b=2;
select * from Y where c=3;

# 使用到索引a，并未使用到索引c，因为跳过了中间索引b
select * from Y where a='1' and c=3;
```

3 的含义是：不在索引列上做任何操作（计算、函数、（自动or手动）类型转换），
否则会导致索引失效而转向全表扫描；
若使用索引列中，使用到范围查找，则范围查找右边使用到的索引列会失效。

```text
# 通过索引列计算，则索引列a未使用到
select * from Y where right(a,2)='1';

# b列通过范围查找，则范围右边的列c未使用到
select * from Y where a='1' and b>2 and c=3;
```

4 的含义是：like模糊查找以通配符开头（`%abc`、`%abc%`）MySQL 索引失效会变成全表扫描操作；
查询中尽量使用覆盖索引（只访问索引的查询（索引列和查询列一致）），减少使用 `select *`。

```text
# abc索引列都使用到了
select * from Y where a like 'xx%' and b=2  and c=3;

# 同上
select * from Y where a like 'k%xx%' and b=2  and c=3;

# 左匹配模糊查询，导致索引失效，所有索引都未使用到
select * from Y where a like '%xx' and b=2  and c=3;

# 同上
select * from Y where a like '%xx%' and b=2  and c=3;

# 使用覆盖索引，不使用 select *，覆盖索引前提是保证查询条件和查询内容列一样
select a,b,c from Y where a='1' and b=2 and c=3;
```

5 的含义是：MySQL在使用（`!=` 或 `<>` 或 `is null` 或 `is not null` 或 `or`）的时候，
无法使用索引会导致全表扫描。

```text
# a、b、c索引失效
select * from Y where a='1' or b='2' and c='3';

# 索引a未使用
select * from Y where a is null;

# 索引a未使用
select * from Y where a != '1';
```

6 的含义是：字符类型的字段作为条件查询时，不加单引号会导致索引失效，因为它存在隐式类型转换。

```text
# 存在隐式类型转换
select * from Y where a = 1;

# 不带引号，索引列a是用不到
select * from Y where a = '1';
```

## 其他技巧

### in与exists

原则：小表驱动大表，即小的数据集驱动大的数据集。

假设存在小表B，大表A，则查询语句写法：

```text
-- in(subquery)子查询中适合查询小表，这种方式效率更高
select * from A where id in (select id from B)

-- exists(subquery) 子查询适合大表，主查询数据需要放到子查询中匹配
-- 通过返回 true 或 false 判断是否保留主查询结果
select * from B where exists (select * from A)
```

### Order By 与Group By

对于 `order by`，尽量使用 `Index` 方式排序，避免使用 `FileSort` 方式排序。
`group by` 实质是先排序后进行分组，优化技巧同 `order by` 一样。

MySQL 支持 Index 和 FileSort 排序，Index 比 FileSort 排序效率高，
Index 是基于索引实现排序，而 FileSort 是基于外部文件排序的。
若想要实现 Index 排序，需要遵照索引建的最佳左前缀原则，下面通过案例（伪代码）说明：

假设一个表建立索引：index_abc(a,b,c)

```text
-- order by 使用到索引排序，遵守最佳左前缀排序
order by a
order by a,b
order by a,b,c
order by a DESC,b DESC,c DESC

-- 如果WHERE使用索引的左前缀为常量，则 order by 能使用索引
where a = const order by b,c
where a = const and b = const order by c
where a = const and b>const order by b,c

-- 不能使用索引排序
-- 排序不一致
order by a ASC,b DESC,c DESC 
-- 丢掉a索引
where g=const order by b,c
-- 丢掉b索引
where a=const order by c
-- d不是索引的一部分
where a=const order by a,d
-- 对于排序来说,多个相等的条件也是范围查询
where a in(…………) order by b,c
```
