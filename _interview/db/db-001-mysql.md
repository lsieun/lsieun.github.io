---
title: "MySQL"
sequence: "101"
---

- [ ] 数据类型
    - [ ] 数据类型转换有哪些需要注意的地方？https://www.bilibili.com/video/BV1EN411e77V?p=26
- [ ] SQL 语句
    - [ ] 排序
        - [ ] Order By 时需要注意什么？
- [ ] SQL 优化
- [ ] 事务
    - [ ] MySQL 的隔离级别有哪些？https://www.bilibili.com/video/BV18S4y1r7NW?p=26
    - [ ] MySQL 锁的类型有哪些？https://www.bilibili.com/video/BV18S4y1r7NW?p=31
        - [ ] https://www.bilibili.com/video/BV1cF411R7Ko?p=186
        - [ ] https://www.bilibili.com/video/BV1cF411R7Ko?p=187
    - [ ] InnoDB 的行锁是怎么实现的？https://www.bilibili.com/video/BV1cF411R7Ko?p=188
    - [ ] MySQL 中事务的特性？https://www.bilibili.com/video/BV1cF411R7Ko?p=184
    - [ ] MySQL 的可重复读怎么实现的？https://www.bilibili.com/video/BV1cF411R7Ko?p=185
    - [ ] 并发事务会产生哪些问题？https://www.bilibili.com/video/BV1cF411R7Ko?p=189
    - [ ] MySQL 死锁的原因和处理方法？https://www.bilibili.com/video/BV1cF411R7Ko?p=191
- [ ] 索引
    - [ ] 主键
        - [ ] 自增 ID，还是 UUID 数据库
    - [ ] 索引实现
        - [ ] MySQL 索引的基本原理？https://www.bilibili.com/video/BV18S4y1r7NW?p=29
            - [ ] https://www.bilibili.com/video/BV18S4y1r7NW?p=30
        - [ ] B+ 树
            - [ ] B+ 树 是如何生成的？为什么要用 B+ 树？ https://www.bilibili.com/video/BV1EN411e77V?p=10
            - [ ] 如何基于 B+ 树 去理解 索引和 全表扫描？https://www.bilibili.com/video/BV1EN411e77V?p=11
            - [ ] 什么是最左前缀原则？和 B+ 树有什么关系？https://www.bilibili.com/video/BV1EN411e77V?p=12
                - [ ] https://www.bilibili.com/video/BV1EN411e77V?p=21
                - [ ] https://www.bilibili.com/video/BV1ay4y1D7o7?p=195
            - [ ] B 树和 B+ 树之间的区别？https://www.bilibili.com/video/BV1EN411e77V?p=17
            - [ ] InnoDB 中的 B+ 树是如何产生的？https://www.bilibili.com/video/BV1EN411e77V?p=18
            - [ ] 高度为 3 的 B+ 树能存多少数据？https://www.bilibili.com/video/BV1EN411e77V?p=19
    - [ ] 什么是索引覆盖？https://www.bilibili.com/video/BV1EN411e77V?p=13
        - [ ] https://www.bilibili.com/video/BV1EN411e77V?p=23
    - [ ] 什么是索引扫描？https://www.bilibili.com/video/BV1EN411e77V?p=14
        - https://www.bilibili.com/video/BV1EN411e77V?p=24
    - [ ] 什么是索引下推？https://www.bilibili.com/video/BV1ay4y1D7o7?p=196
    - [ ] InnoDB 是如何支持范围查询索引？https://www.bilibili.com/video/BV1EN411e77V?p=20
    - [ ] 使用索引一定会提升效率吗？https://www.bilibili.com/video/BV1ay4y1D7o7?p=191
    - [ ] 索引类型
        - [ ] 索引有哪几种类型？https://www.bilibili.com/video/BV1ay4y1D7o7?p=194
        - [ ] 聚簇索引与非聚簇索引 https://www.bilibili.com/video/BV1ay4y1D7o7?p=193
            - [ ] https://www.bilibili.com/video/BV18S4y1r7NW?p=28
        - [ ] 什么自适应哈希索引？https://www.bilibili.com/video/BV1ay4y1D7o7?p=197
    - [ ] 索引失效
        - [ ] 什么情况会导致索引失效？https://www.bilibili.com/video/BV1EN411e77V?p=16
        - [ ] 范围查找导致索引失效原理？https://www.bilibili.com/video/BV1EN411e77V?p=22
        - [ ] 对字段进行操作导致索引失效原理？https://www.bilibili.com/video/BV1EN411e77V?p=27
        - 为什么 LIKE 以 % 开头索引会失效？https://www.bilibili.com/video/BV1ay4y1D7o7?p=198
- [ ] 存储引擎
    - [ ] InnoDB
        - [ ] Page 页
            - [ ] 什么是 InnoDB 的页？有什么用？ https://www.bilibili.com/video/BV1EN411e77V?p=9
            - [ ] InnoDB 如何管理 Page 页？https://www.bilibili.com/video/BV1ay4y1D7o7?p=188
            - [ ] https://www.bilibili.com/video/BV1ay4y1D7o7?p=192
    - 执行过程：
        - [ ] MySQL 执行一条查询的内部过程？https://www.bilibili.com/video/BV1cF411R7Ko?p=196
        - [ ] MySQL 内部支持缓存查询吗？
    - 对比
        - [ ] InnoDB 与 MYISASM 的区别？https://www.bilibili.com/video/BV1ay4y1D7o7?p=200
- [ ] 运维
    - [ ] MySQL 复制的原理是什么？https://www.bilibili.com/video/BV18S4y1r7NW?p=27
    - [ ] MySQL 为什么要进行主从同步？https://www.bilibili.com/video/BV18S4y1r7NW?p=32
        - https://www.bilibili.com/video/BV1cF411R7Ko?p=195
    - [ ] MySQL 的 binlog 有几种日志格式？https://www.bilibili.com/video/BV1cF411R7Ko?p=192
      - [ ]什么是分库分表？什么时候进行？https://www.bilibili.com/video/BV1cF411R7Ko?p=194
- [ ] 不知道分类
    - [ ] 什么是 BufferPool https://www.bilibili.com/video/BV1ay4y1D7o7?p=187
    - [ ] 为什么写缓冲区，仅适用于非唯一普通索引页？https://www.bilibili.com/video/BV1ay4y1D7o7?p=189
    - [ ] MySQL 为什么要改进 LRU 算法？https://www.bilibili.com/video/BV1ay4y1D7o7?p=190
    - [ ] MySQL 执行计划怎么看？https://www.bilibili.com/video/BV18S4y1r7NW?p=33
    - [ ] MVCC 内部细节？https://www.bilibili.com/video/BV1cF411R7Ko?p=190
    - [ ] 你做过哪些 SQL 优化？ https://www.bilibili.com/video/BV1oC4y177JE/
- [ ] 线上问题
    - [ ] MySQL 线上修改大表结构有哪些风险？https://www.bilibili.com/video/BV1cF411R7Ko?p=193

- MySQL 如何备份

问题：MySQL 中如何进行数据备份？

回答：MySQL 中可以通过 mysqldump 命令进行数据备份。
mysqldump 命令可以导出 MySQL 数据库的表结构和表数据，可以备份单个或多个数据库，以及指定表、触发器、存储过程等。
备份出来的数据可以通过直接执行导出的 sql 文件来进行恢复。

## FAQ

### 如何对 MySQL 进行优化？

思路：[Link](https://www.bilibili.com/video/BV17e411w7EM/)

- 第 1 个，是硬件和操作系统层面的优化，一般是由 DBA 或运维工程师完成
  - 硬件层面：CPU、可用内存（Memory）大小、磁盘（Disk）读写速度、网络（Network）带宽
  - 操作系统层面：应用文件句柄数、操作系统的网络配置
- 第 2 个，是应用架构设计层面的优化：
  - 主从集群，避免的问题：单点故障
  - 读写分离：在读多写少的场景中，可以避免读写冲突
  - 分库分表：
    - 分库：降低单个服务器节点的 IO 压力
    - 分表：可以降低单表数据量，从而提升 SQL 的查询效率
  - 分布式数据库，例如 Redis、MongoDB：热点数据，缓解 MySQL 的压力，提升数据的检索性能
- 第 3 个，MySQL 程序配置层面的优化：
  - 最大连接数
  - binlog 日志
  - 缓存池 BufferPool 默认大小配置
  - 注意两点：
    - 配置的作用域：会话级别 和 全局范围
    - 是否支持热加载：如果不支持，可以需要重新连接
- 第 4 个，SQL 执行层面的优化：
  - 慢 SQL 的定位和排查：通过慢查询日志，得到有问题的 SQL 列表
  - 执行计划分析：使用关键字 `EXPLAIN` 来查看当前 SQL 的执行计划，重点关注 type、key、rows、filter 等字段，从而定位 MySQL 执行慢的根本原因
  - 使用 Show Profile 工具：是 MySQL 可以用来分析当前会话中 SQL 语句资源消耗情况的工具，可以用于 SQL 调优的测量

### SQL 优化的一些规则

- [ ] SQL 的查询一定要基于索引来进行数据扫描
- 在索引列上，避免使用 函数 或者 运算符
- where 子句中 like `%` 尽量放置在右边
- 使用索引扫描，联合索引中的列，从左往右，命中越多越好
- order by：尽可能使用 SQL 语句用到的索引完成排序
- select：查询有效的列信息即可，少用 `*` 代替列信息
- 永远用“小结果集”驱动“大结果集”

### MySQL 语句执行的步骤

Server 层按顺序执行 SQL 的步骤为：

- 客户端请求 -> 连接器（验证用户身份，给予权限）
- 查询缓存（存在缓存则直接返回，不存在则执行后续操作）
- 分析器（对 SQL 进行词法分析和语法分析操作）
- 优化器（主要对执行的 SQL 优化选择最优的执行方案方法）
- 执行器（执行时会先看用户是否有执行权限，有才去使用这个引擎提供的接口）-> 去引擎层获取数据返回（如果开启查询缓存则会缓存查询结果）

## 索引相关

### MySQL 使用索引的原因？

根本原因

- 索引的出现，就是为了提高数据查询的效率，就像书的目录一样。
- 对于数据库的表而言，索引其实就是它的“目录”。

扩展

- 创建唯一性索引，可以保证数据库表中每一行数据的唯一性。
- 帮助引擎层避免排序和临时表
- 将随机 IO 变为顺序 IO，加速表和表之间的连接。

### 索引的三种常见底层数据结构以及优缺点

三种常见的索引底层数据结构：分别是**哈希表**、**有序数组**和**搜索树**。

- **哈希表**这种适用于等值查询的场景，比如 memcached 以及其它一些 NoSQL 引擎，不适合范围查询。
- **有序数组**索引只适用于静态存储引擎，等值和范围查询性能好，但更新数据成本高。
- **N 叉树**由于读写上的性能优点以及适配磁盘访问模式以及广泛应用在数据库引擎中。
- 扩展（以 InnoDB 的一个整数字段索引为例，这个 N 差不多是 1200。棵树高是 4 的时候，就可以存 1200 的 3 次方个值，这已经 17 亿了。
  考虑到树根的数据块总是在内存中的，一个 10 亿行的表上一个整数字段的索引，查找一个值最多只需要访问 3 次磁盘。
  其实，树的第二层也有很大概率在内存中，那么访问磁盘的平均次数就更少了。）





## Reference

- [MySQL 精选 60 道面试题（含答案）](https://blog.csdn.net/hahazz233/article/details/125372412)
