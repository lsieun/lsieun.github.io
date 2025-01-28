---
title: "MySQL 常用函数"
sequence: "114"
---

## CONCAT 函数

CONCAT(str1,str2) 函数用于将多个字符串连接成一个字符串，返回结果为连接参数产生的字符串。如有任何一个参数为 NULL ，则返回值为 NULL。

比如我们执行：select CONCAT('My', 'S', 'QL'); 返回结果 MySQL。我们执行：select CONCAT('My', NULL, 'QL'); 返回结果是 NULL

## REPLACE 函数

REPLACE(str,str1,str2)，把 str 字符串中出现字符串 str1 的全部替换为字符串 str2。
注意 MySQL 里面全部替换是 REPLACE，而不是 REPLACEALL，不要弄混。

## ISNULL 函数

ISNULL(expr) 函数判断 expr 是否为空，如 expr 为 null，那么 isnull() 的返回值为 1，否则返回值为 0。注意 isnull('') 和 isnull("") 是返回 0 的。

## IFNULL 函数

ifnull(expr1,expr2) 表达式，表示如果 expr1 不为 NULL，则 IFNULL() 的返回值为 expr1; 否则其返回值为 expr2。

## group by( 分组 )、having （过滤）和 order by（排序）

group by( 分组 )、having （过滤）和 order by（排序）这三个函数我们单独使用时，是非常好理解的，我们这里主要讨论他们一起联合使用，很多人容易弄混淆。我们常常将他们组合在一起用 , 完成分组 + 排序的功能。

我们首先了解几个知识点：having 一般是和 group by 一起使用；在 sql 命令格式使用的先后顺序上，group by 先于 order by；order by 不会对 group by 内部进行排序，如果 group by 后只有一条记录，那么 order by 将无效。要查出 group by 中最大的或最小的某一字段使用 max 或 min 函数；group by、having、order by 的使用顺序：group by 、having、order by。



