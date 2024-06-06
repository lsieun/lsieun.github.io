---
title: "对比"
sequence: "101"
---

## List-based timers

### 概念结构

These timers maintain a sorted list of timer events.

### 实际存储结构

The insertion of a timer event in this case is O(n), but the removal of the event at the head of the list is O(1).
This could be an acceptable trade-off in certain scenarios.



## Heap-based timers

### 数据结构

This type of timers maintains a min-heap of timer events,
where the top of the heap is the next timer to expire.

### 时间精度（优）

While heap-based timers have **accurate expiry** of timer events,

### 场景 - 大量事件（劣）

they're not as efficient as hashed wheel timers when dealing with a large number of timer events.

## Hashed Wheel Timers

### 数据结构-复杂度（优）

- 单个元素

**Efficiency**: The hashed wheel timer provides O(1) time complexity for insert and delete operations.
It's excellent for handling a large number of concurrent timer events.

### 时间精度（劣）

**Resolution**: The resolution of the timer is determined by the tick duration and the wheel size.
If a high-resolution timer is needed, the wheel size may become very large, which increases memory usage.

**Inaccuracy**: The timer tasks are not executed exactly after their delay.
There is an inaccuracy which equals the tick duration.
**This might not be a problem for many use cases, but it's something to be aware of.**

### 场景 - 大量事件（优）

- 整个结构

**Low Overhead**: The timer only needs to manage a fixed number of buckets, no matter how many timer events are present.
This results in lower overhead compared to other timer management mechanisms.
