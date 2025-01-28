---
title: "索引库操作"
sequence: "105"
---

## mapping 映射属性

mapping 是对索引库中文档的约束。

常见的 mapping 属性包括：

- `type`：字段数据类型，常见的简单类型有
    - 字符串：
        - `text`：可分词的文本
        - `keyword`：精确值，例如 品牌、国家、IP地址
    - 数值：`long`, `integer`, `short`, `byte`, `double`, `float`
    - 布尔：`boolean`
    - 日期：`date`
    - 对象：`object`
- `index`：是否创建倒排索引，默认值为 `true`。不是所有的字段都需要搜索，例如商品的图片地址
- `analyzer`：使用哪种分词器，结合 `text` 类型的字段使用
- `properties`：该字段的子字段

在 ES 中，没有“数组”类型，但是它允许一个字段里有多个值，它关注的是数组中各个元素的类型。

小总结：

mapping 常见属性有哪些？

- `type`：数据类型
- `index`：是否索引
- `analyzer`：分词器
- `properties`：子字段

`type` 常见的有哪些？

- 字符串：`text`, `keyword`
- 数字：`long`, `integer`, `short`, `byte`, `double`, `float`
- 布尔：`boolean`
- 日期：`date`
- 对象：`object`

## 索引库的 CRUD

### 创建索引库

ES 中通过 Restful 请求操作索引库、文档。

请求内容用 DSL 语句来表示。

创建索引库 和 mapping 的DSL语法如下：

```text
PUT /索引库名称
{
    "mappings": {
        "properties": {
            "字段名1": {
                "type": "text",
                "analyzer": "ik_smart"
            },
            "字段名2": {
                "type": "keyword",
                "index": "false"
            },
            "字段名3": {
                "properties": {
                    "子字段": {
                        "type": "keyword",
                    }
                }
            }
        }
    }
}
```

```text
PUT /student
{
  "mappings": {
    "properties": {
      "name": {
        "type": "object", 
        "properties": {
          "firstName": {
            "type": "keyword",
            "index": false
          },
          "lastName": {
            "type": "keyword",
            "index": false
          }
        }
      },
      "email": {
        "type": "keyword",
        "index": false
      },
      "memo": {
        "type": "text",
        "analyzer": "ik_smart"
      }
    }
  }
}
```

```text
{
  "acknowledged" : true,
  "shards_acknowledged" : true,
  "index" : "student"
}
```

### 查看索引库

```text
GET /索引库名
```

```text
GET /student
```

```text
{
  "student" : {
    "aliases" : { },
    "mappings" : {
      "properties" : {
        "email" : {
          "type" : "keyword",
          "index" : false
        },
        "memo" : {
          "type" : "text",
          "analyzer" : "ik_smart"
        },
        "name" : {
          "properties" : {
            "firstName" : {
              "type" : "keyword",
              "index" : false
            },
            "lastName" : {
              "type" : "keyword",
              "index" : false
            }
          }
        }
      }
    },
    "settings" : {
      "index" : {
        "routing" : {
          "allocation" : {
            "include" : {
              "_tier_preference" : "data_content"
            }
          }
        },
        "number_of_shards" : "1",
        "provided_name" : "student",
        "creation_date" : "1686812284552",
        "number_of_replicas" : "1",
        "uuid" : "VFJCx-8PSQi2ez7aTK4LhA",
        "version" : {
          "created" : "7170799"
        }
      }
    }
  }
}
```



### 修改索引库

ES 是禁止修改索引库的。

索引库和 mapping 一旦创建，就无法修改；但是，可以添加新的字段，语法如下：

```text
PUT /索引库名/_mapping
{
    "properties": {
        "新字段名": {
            "type": "integer"
        }
    }
}
```

```text
PUT /student/_mapping
{
    "properties": {
        "age": {
            "type": "integer"
        }
    }
}
```

```text
{
  "acknowledged" : true
}
```

```text
GET /student
```

```text
{
  "student" : {
    "aliases" : { },
    "mappings" : {
      "properties" : {
        "age" : {
          "type" : "integer"
        },
        "email" : {
          "type" : "keyword",
          "index" : false
        },
        "memo" : {
          "type" : "text",
          "analyzer" : "ik_smart"
        },
        "name" : {
          "properties" : {
            "firstName" : {
              "type" : "keyword",
              "index" : false
            },
            "lastName" : {
              "type" : "keyword",
              "index" : false
            }
          }
        }
      }
    },
    "settings" : {
      "index" : {
        "routing" : {
          "allocation" : {
            "include" : {
              "_tier_preference" : "data_content"
            }
          }
        },
        "number_of_shards" : "1",
        "provided_name" : "student",
        "creation_date" : "1686812284552",
        "number_of_replicas" : "1",
        "uuid" : "VFJCx-8PSQi2ez7aTK4LhA",
        "version" : {
          "created" : "7170799"
        }
      }
    }
  }
}
```

### 删除索引库

```text
DELETE /索引库名
```

```text
DELETE /student
```

```text
{
  "acknowledged" : true
}
```

```text
GET /student
```

```text
{
  "error" : {
    "root_cause" : [
      {
        "type" : "index_not_found_exception",
        "reason" : "no such index [student]",
        "resource.type" : "index_or_alias",
        "resource.id" : "student",
        "index_uuid" : "_na_",
        "index" : "student"
      }
    ],
    "type" : "index_not_found_exception",
    "reason" : "no such index [student]",
    "resource.type" : "index_or_alias",
    "resource.id" : "student",
    "index_uuid" : "_na_",
    "index" : "student"
  },
  "status" : 404
}
```

## Reference

- [Elasticsearch Guide](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
    - [Mapping](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html)
        - [Mapping Parameters](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-params.html)
