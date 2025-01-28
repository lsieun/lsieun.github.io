---
title: "Queue Intro"
sequence: "101"
---


```text
                                       ┌─── add
                 ┌─── Collection ──────┤
                 │                     └─── remove
                 │
                 │                     ┌─── offer
Queue Methods ───┼─── Queue ───────────┤
                 │                     └─── poll
                 │
                 │                     ┌─── put
                 └─── BlockingQueue ───┤
                                       └─── take
```
