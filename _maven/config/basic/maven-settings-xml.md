---
title: "Maven Settings"
sequence: "101"
---

[UP](/maven-index.html)

## 位置

| 名称 | 位置 | 优先级 |
| Maven Global Settings | `MAVEN_HOME/config/settings.xml` | 高 |
| Maven Local Settings | `~/.m2/settings.xml` | 低 |

## 查看配置

In order to see the result of the merging between the local and Global Settings,  
we can use the Maven Help Plugin, as follows:

```text
mvn help:effective-settings
```

## Reference

- [Settings Reference](https://maven.apache.org/settings.html)
