---
title: "Trace VS. Segment VS. Span"
sequence: "101"
---

三个概念的关系：

```text
Trace --> Segment --> Span
```

- Trace：由 Segment 组成 （**跨越多个进程**）
- Segment：由 Span 组成 （**一个进程内的一个线程**，一个JVM进程内的一个线程的所有操作集合）
- Span： （方法层面）

