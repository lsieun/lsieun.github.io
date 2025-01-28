---
title: "@Contended 示例（Java 8）"
sequence: "103"
---

## 分组

`@Contended` 注解还能够将变量进行分组：

```java
import sun.misc.Contended;

public class MyBox {
    @Contended("a")
    public volatile long a;

    @Contended("bc")
    public volatile long b;
    @Contended("bc")
    public volatile long c;
}
```

```text
lsieun.jol.pojo.MyBox object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     N/A
  8   4        (object header: class)    N/A
 12 132        (alignment/padding gap)   
144   8   long MyBox.a                   N/A
152 128        (alignment/padding gap)   
280   8   long MyBox.b                   N/A
288   8   long MyBox.c                   N/A
Instance size: 296 bytes
Space losses: 260 bytes internal + 0 bytes external = 260 bytes total
```

```text
┌──────────────┬────────────┬───────────────────────────────┐
│    Offset    │    Size    │          Description          │
├──────────────┼────────────┼───────────────────────────────┤
│      0       │     8      │     (object header: mark)     │
├──────────────┼────────────┼───────────────────────────────┤
│      8       │     4      │    (object header: class)     │
├──────────────┼────────────┼───────────────────────────────┤
│      12      │    132     │    (alignment/padding gap)    │
├──────────────┼────────────┼───────────────────────────────┤
│     144      │     8      │         long MyBox.a          │
├──────────────┼────────────┼───────────────────────────────┤
│     152      │    128     │    (alignment/padding gap)    │
├──────────────┼────────────┼───────────────────────────────┤
│     280      │     8      │         long MyBox.b          │
├──────────────┼────────────┼───────────────────────────────┤
│     288      │     8      │         long MyBox.c          │
└──────────────┴────────────┴───────────────────────────────┘
```
