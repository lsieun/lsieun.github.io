---
title: "Elasticsearch 与 MySQL 对比"
sequence: "103"
---

## 概念对比

| MySQL  | Elasticsearch | Memo                                                             |
|--------|---------------|------------------------------------------------------------------|
| Table  | Index         | 索引（Index），就是文档的集合，类似于数据库的表（Table）                                |
| Schema | Mapping       | 映射（Mapping）是索引中文档的约束，例如字段类型约束；类似数据库的表结构（Schema）                  |
| Row    | Document      | 文档（Document），就是一条条的数据，类似数据库中的行（Row），文档都是 JSON 格式                 |
| Column | Field         | 字段（Field），就是 JSON 文档中的字段，类似数据库中的列（Column）                        |
| SQL    | DSL           | DSL 是 Elasticsearch 提供的 JSON 风格的请求语句，用来操作 Elasticsearch，实现 CRUDe |

## 架构

- MySQL：擅长事务类型操作，可以确保数据的安全和一致性。
- Elasticsearch：擅长海量数据的搜索、分析、计算
