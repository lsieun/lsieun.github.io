---
title: "配置：排序"
sequence: "303"
---

## UI

### 地址

```text
springdoc.swagger-ui.path
```

默认值是`/swagger-ui.html`

```text
springdoc.swagger-ui.configUrl
```

默认值是`/v3/api-docs/swagger-config`。

## 排序

Apply a sort to the operation list of each API:

- alpha: sort by paths alphanumerically
- method: sort by HTTP method

```text
springdoc.swagger-ui.operationsSorter=method
```

or a **function** (see `Array.prototype.sort()` to know how sort function works).

Default is the order returned by the server unchanged.
