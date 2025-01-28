---
title: "文档操作"
sequence: "106"
---

## 新增文档

新增文档的 DSL 语法如下：

```text
POST /索引库名/_doc/文档id
{
    "字段1": "值1",
    "字段2": "值2",
    "字段3": {
        "子属性1": "值3",
        "子属性2": "值4"
    }
}
```

```text
POST /student/_doc/1
{
    "name": {
        "firstName": "三",
        "lastName": "张"
    },
    "email": "zhangsan@example.com",
    "memo": "这是一条记录"
}
```

```text
{
  "_index" : "student",
  "_type" : "_doc",
  "_id" : "1",
  "_version" : 1,
  "result" : "created",    // 注意：这里是 created
  "_shards" : {
    "total" : 2,
    "successful" : 1,
    "failed" : 0
  },
  "_seq_no" : 0,
  "_primary_term" : 1
}
```

## 查询文档

```text
GET /索引库名/_doc/文档id
```

```text
GET /student/_doc/1
```

```text
{
  "_index" : "student",
  "_type" : "_doc",
  "_id" : "1",
  "_version" : 1,
  "_seq_no" : 0,
  "_primary_term" : 1,
  "found" : true,    // 注意：这里是 true
  "_source" : {
    "name" : {
      "firstName" : "三",
      "lastName" : "张"
    },
    "email" : "zhangsan@example.com",
    "memo" : "这是一条记录"
  }
}
```

## 删除文档

```text
DELETE /索引库名/_doc/文档id
```

```text
DELETE /student/_doc/1
```

```text
{
  "_index" : "student",
  "_type" : "_doc",
  "_id" : "1",
  "_version" : 2,
  "result" : "deleted",    // 注意：这里是 deleted
  "_shards" : {
    "total" : 2,
    "successful" : 1,
    "failed" : 0
  },
  "_seq_no" : 1,
  "_primary_term" : 1
}
```

## 修改文档

方式一：全量修改，会删除旧文档，添加新文档

```text
PUT /索引库名/_doc/文档id
{
    "字段1": "值1",
    "字段2": "值2",
    // ...
}
```

```text
PUT /student/_doc/1
{
    "name": {
        "firstName": "三",
        "lastName": "张"
    },
    "email": "zhangsan@example.com",
    "memo": "这是一条记录"
}
```

方式二：增量修改，修改指定字段值

```text
POST /索引库名/_update/文档id
{
    "doc": {
        "字段名": "新的值"
    }
}
```

```text
POST /student/_update/1
{
    "doc": {
        "email": "abc@example.com"
    }
}
```
