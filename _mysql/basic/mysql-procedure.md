---
title: "MySQL 存储过程和函数"
sequence: "109"
---

## 什么是存储过程和函数

存储过程和函数是事先经过编译并存储在数据库中的一段 SQL 语句的集合，调用存储过程和函数可以简化开发，
减少数据在数据库和应用服务器之间的传输，可以提高数据处理效率。

## 存储过程和函数的区别

存储过程和函数的区别在于函数必须有返回值，而存储过程没有；存储过程的参数可以使用 IN、OUT、INPUT 类型，而函数的参数只有 IN 类型。
如果有函数从其他类型的数据库迁移到 MySQL，那么就可能需要将函数改造成存储过程。

## 为什么使用存储过程和函数

在完成一个逻辑操作时，有时会执行多条 SQL 语句，此外这些 SQL 语句的执行顺序也不是固定的，它会根据条件的变化而变化。
在执行过程中，这些需要根据前面 SQL 语句的执行结果有选择的执行后面的 SQL 语句。
为了解决该问题，MySQL 软件提供了数据库对象存储过程和函数。

我们使用存储过程，往往是一些比较复杂的业务，并且把业务使用存储过程来实现，也方便后期的维护。

## 如何编写存储过程

（1）创建存储过程

基本语法：

create procedure sp_name() begin ......... end
（2）调用存储过程：

基本语法：call sp_name()

注意：存储过程名称后面必须加括号，哪怕该存储过程没有参数传递

（3）删除存储过程

基本语法：drop procedure sp_name

注意事项：不能在一个存储过程中删除另一个存储过程，只能调用另一个存储过程

（4）显示所有存储过程基本信息

基本语法：show procedure status

该语句会显示数据库中所有存储的存储过程基本信息，包括所属数据库，存储过程名称，创建时间等。

（5）显示某一个 mysql 存储过程的详细信息

基本语法：show create procedure sp_name

