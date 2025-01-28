---
title: "MVC Properties"
sequence: "mvc"
---

## MVC

| Name                                     | Description                                                                | Default Value         |
|------------------------------------------|----------------------------------------------------------------------------|-----------------------|
| `spring.mvc.pathmatch.matching-strategy` | Choice of strategy for matching request paths against registered mappings. | `path-pattern-parser` |
| ``                                       |                                                                            |                       |

```yaml
spring:
  mvc:
    pathmatch:
      matching-strategy: ant_path_matcher
```