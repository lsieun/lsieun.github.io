---
title: "Casbin Java"
sequence: "202"
---

## pom.xml

```xml
<dependency>
    <groupId>org.casbin</groupId>
    <artifactId>jcasbin</artifactId>
    <version>1.26.0</version>
</dependency>
```

## Enforcer

```text
enforcer = Model + Adapter
```

```text
import org.casbin.jcasbin.main.Enforcer;

Enforcer enforcer = new Enforcer("path/to/model.conf", "path/to/policy.csv");
```

## Check permissions

## Reference

- [Get Started](https://casbin.io/docs/get-started)
