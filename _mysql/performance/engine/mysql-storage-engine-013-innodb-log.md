---
title: "InnoDB: bin log, redo log, undo log"
sequence: "113"
---


<table>
    <thead>
    <tr>
        <th></th>
        <th>Bin log</th>
        <th>Redo log</th>
        <th>Undo log</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>作用范围</td>
        <td>MySQL Server 层实现的</td>
        <td>InnoDB 存储引擎特有的</td>
        <td>InnoDB 存储引擎特有的</td>
    </tr>
    <tr>
        <td>存储内容</td>
        <td>记录的是这个语句的原始逻辑，比如：修改 t1 表中 id=10 这一行数据的 name 字段为 tomcat</td>
        <td>记录的是“在某个数据页做了什么修改”，是物理日志</td>
        <td>记录事务开始前的状态，用于事务失败时的回滚操作</td>
    </tr>
    <tr>
        <td>存储方式</td>
        <td>Binlog 是追加写入的，当写到一定大小后，就会生成一个新的文件进行追加，并不会覆盖之前的日志。</td>
        <td>Redo log 是循环写的，日志文件大小是固定的</td>
        <td>是直接持久化在系统表空间或临时表空间的</td>
    </tr>
    </tbody>
</table>

## redo log

redo log 是 InnoDB 存储引擎中的概念。

现在还有一个问题：当我们对 Buffer Pool 中的页进行了更新，变成了脏页之后；
在将这些修改后的数据更新至磁盘之前，如果 MySQL 挂掉了怎么办，那岂不就造成了数据的丢失。
因为更新的数据最后并没有同步至磁盘。

InnoDB 存储引擎的解决方法是采用 redo log 机制。

### 两种可能的方式

其实更新操作有两种方式：

第一种方式是：

- 修改 Buffer Pool 中页的数据 —> 变为了脏页
- update 语句 —> 生成一个 redo log
- 持久化 redo log --> 事务提交
- 返回修改成功

第二种方式是：

- 修改Buffer Pool中页的数据 —> 变为了脏页
- 修改磁盘中的数据
- 返回修改成功

这两种方式肯定是第一种更快一点，这是因为直接修改磁盘中的页数据 代价会大一些，一页是16KB，
但我们仅仅修改了一页中的某一条数据，但是持久化至磁盘的时候，却是把整页的数据全部都去持久化；
还有一点就是，如果是去把一页的数据全都都去持久化至磁盘的话，这其实是一个**随机 IO**。

那为什么第一种方式就会快一点呢？这是因为对 Buffer Pool 中页的数据进行了修改后，生成一个redo log，
也可以理解为 redo log 就是存的一条修改语句，但还有其他的东西。
然后把这个 redo log 进行持久化的时候其实是往一个文件中写入，这其实是一个**顺序IO**。
当然，顺序 IO 的前提是你这个 log 文件已经存在了。

假如我现在要修改 id=8 的数据，当生成 redo log 并持久化 redo log 后，这个时候 MySQL 挂掉了，磁盘中的数据还没有进行相应的修改，
然后 MySQL 重启后，会查询 id=8 的页放至 Buffer Pool 中，然后在读取 redo log，
这个时候相当于 Buffer Pool 中的数据就是修改后的数据了，也就避免了 MySQL 挂掉数据丢失的问题了。

![](/assets/images/db/mysql/architecture/innodb-architecture-8-0.png)

## 为什么在 Redo Log 中，默认有两个文件

我们使用 Redo Log，其实就是往这两个文件进行写入，每个文件默认是48MB。
当执行了一些修改语句后，会保存到 ib_logfile0 文件中，当这个文件保存满了后，就开始往 ib_logfile1 文件中进行写入；
当 ib_logfile1 文件也写满后，这个时候再执行修改操作，就会继续写入到 ib_logfile0 文件中，但是这个时候就会触发一次检查点，
检查点就是把 ib_logfile0 文件中存储的 Redo log 和 Buffer pool 中的脏页对应的数据，持久化到磁盘中，
再删除无用的 redo log，然后才能继续对 ib_logfile0 文件进行写入。

所以，每一次触发检查点的时候，MySQL 这时候的效率都比较低，解决方式就是把这两个文件的容量可以设置的大一点，但这样又会增加 MySQL 重启的时间。
任何事情都有两面性，要么 MySQL 执行时速度慢要么重启时速度慢。

### redo log 什么时候持久化至文件

我们 begin开启事务—>执行更新语句—>然后就会生成一个redo log对象—>该对象存储至Log Buffer区域—>事务提交之后—> 
有可能 redo log再从Log Buffer区域走到操作系统缓冲区(Operating System Cache) —> 然后再持久化至文件

我们所理解的其实就是当事务提交后就立刻将 redo log 持久化，
但其实对于 InnoDB 存储引擎来说它提供了下面三种配置项，
我们只是修改 `innodb_flush_log_at_trx_commit` 变量的值，该变量默认值为 `1`。

- `0`：事务提交后，并不立刻对 redo log 持久化，将持久化的任务交给后台线程去做
- `1`：事务提交后，立刻对 redo log 持久化
- `2`：事务提交后，立刻将 redo log 写到操作系统的缓冲区中，并没有立刻持久化，
  这种情况下如果数据库挂了，但是操作系统没挂，那么事务的持久性还是可以保证的。
  操作系统也会有一些定时进程将缓冲区中的 redo log 进行持久化

如果选 2，在执行update语句时相比较于 1，速度要稍微快一点，0 速度最快，
但 1 对数据持久化是最好的，
如果是 0 后台线程也是 mysql 的线程，所以如果mysql挂掉了可能会造成数据丢失，
2 是允许mysql挂掉不允许操作系统挂

## Bin log

bin log 其实存储的也是 update 语句

bin log是Mysql中的概念，Redo log是InnoDB存储引擎中的概念。那为什么有了bin log 还要弄一个redo log嘞？

这是因为bin log其实就是保存的一些修改的sql语句，而redo log真正记录的是一页中某个位置的数据进行了什么修改，相当于也记录了一个修改数据的物理地址。当要进行数据的恢复的时候，当然是redo log的速度要快一点，如果使用bin log就是再去执行一遍sql语句。

但是Mysql的主从复制必须要使用bin log

## Undo log

当事务回滚时就会使用Undo log。

当我们执行一条修改语句，修改了Buffer Pool中某页的某条数据，创建redo log和undo log还有bin log，如果commit提交了事务，就会持久化redo log，如果rollback回滚事务的话，就需要在Buffer Pool中刚刚修改的数据回滚回去，那么到底怎么还原数据嘞？就是通过undo log来进行回滚数据的。

## Reference

- [InnoDB Architecture](https://dev.mysql.com/doc/refman/8.0/en/innodb-architecture.html)
