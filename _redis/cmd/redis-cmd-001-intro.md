---
title: "Redis 命令"
sequence: "101"
---

![](/assets/images/redis/redis-data-type.jpg)

## 数据类型

一共有九种，常见的有五种

```text
A. 字符串类型 (String)(字符串的值，最大长度为512M)
## [特点：一个redis的key只对应一个value]
## [应用场景：点击数量、访问人数、手机号验证码]

B. 列表类型(List) (列表的最大长度为2^32 -1个元素，大概40亿)
## [特点：value有序(有序是指：按存入的顺序)，数据可以重复，一个redis的key可以对应多个value]
## [应用场景：评论功能]

C. 集合类型(Set)  
## [特点：value是无序的(无序是指：没有按存入的顺序)，value不可以重复，一个redis的key可以对应多个value]
## [应用场景：点赞功能]

D. 有序集合类型(zset)
## [特点：对value进行了排序，value不可以重复，一个redis的key可以对应多个value]
## [应用场景：排行榜、百度热搜]

E. 散列类型(Hash)  (map)
## [特点：一个redis的key可以对应多个value，每个value有是以K-V键值对的形式存在]
## [应用场景：对象信息的存储]

F.存储地理位置信息(Geo)  (了解)

```


