---
title: "HashedWheelTimer"
sequence: "104"
---

[UP](/netty.html)

{:refdef: style="text-align: center;"}
![](/assets/images/netty/util/netty-util-timer-structure.svg)
{:refdef}

{:refdef: style="text-align: center;"}
![](/assets/images/netty/util/netty-util-timer-method-call.svg)
{:refdef}


HashedWheelTimer 延迟队列（定时任务）

JDK:

- Timer
- DelayQueue + ScheduledThreadPool

- 最小堆排序
- 时间轮算法

## 最小堆

大根堆、小根堆

- 上滤：现有堆，添加元素

- 存储方式：数组

- 典型的使用场景：优先队列（小根堆）
