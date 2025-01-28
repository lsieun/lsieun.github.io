---
title: "GC 总结"
sequence: "110"
---

每一次的停顿时间、总的停顿次数

- 最短的停顿时间：
    - 新生代：ParNew
    - 老年代：CMS
- 最大的吞吐量：
    - 新生代：Parallel Scavenge
    - 老年代：Parallel Old
