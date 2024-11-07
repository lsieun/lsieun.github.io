---
title: "GC Intro"
sequence: "101"
---

## GC

### MinorGC(或者 YGC)

n 次 Minor GC 后，当对象 age 超过 15 （阈值），对象晋升（Promotion）至老年代。

![](/assets/images/java/jvm/large-object-in-heap.png)

### Minor GC/Full GC/Major GC

任何 GC 行为都会触发 STW （Stop The World，全局停顿）

- Minor GC (YGC) 针对**年轻代**进行回收，执行效率高
- Full GC（全堆回收），针对**年轻代、老年代、方法区**进行全面收集，执行效率低下，会导致系统长时间停滞，减少 Full GC 是 JVM 优化的重点。
- Major GC，针对老年代回收，目前只有 CMS 收集器才存在 Major GC。

## 什么时候触发垃圾回收？

## Full GC 的触发时机是什么

- 老年代满了
- 元空间满了




