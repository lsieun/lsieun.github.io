---
title: "IntStream"
sequence: "102"
---

```text
                               ┌─── empty
                               │
                               │               ┌─── of
                               │               │
                               ├─── int ───────┼─── range
                               │               │
                               │               └─── rangeClosed
                               │
             ┌─── builder ─────┤               ┌─── add
             │                 ├─── builder ───┤
             │                 │               └─── build
             │                 │
             │                 │               ┌─── generate
             │                 ├─── func ──────┤
             │                 │               └─── iterate
             │                 │
             │                 └─── stream ────┼─── concat
             │
             │                                      ┌─── filter
             │                                      │
             │                                      │                  ┌─── map
             │                                      │                  │
             │                                      ├─── map ──────────┼─── flatMap
             │                                      │                  │
             │                                      │                  └─── mapMulti
             │                                      │
             │                                      │                  ┌─── distinct
             │                                      ├─── stateful ─────┤
             │                                      │                  └─── sorted
             │                                      │
IntStream ───┤                                      ├─── peek
             │                                      │
             │                                      │                  ┌─── limit
             │                 ┌─── intermediate ───┼─── slice ────────┤
             │                 │                    │                  └─── skip
             │                 │                    │
             │                 │                    │                  ┌─── takeWhile
             │                 │                    ├─── while ────────┤
             │                 │                    │                  └─── dropWhile
             │                 │                    │
             │                 │                    │                  ┌─── sequential
             │                 │                    ├─── concurrent ───┤
             │                 │                    │                  └─── parallel
             │                 │                    │
             │                 │                    │                  ┌─── mapToObj
             │                 │                    │                  │
             │                 │                    │                  ├─── mapToLong
             │                 │                    │                  │
             │                 │                    │                  ├─── mapToDouble
             │                 │                    └─── transform ────┤
             │                 │                                       ├─── asLongStream
             │                 │                                       │
             └─── operation ───┤                                       ├─── asDoubleStream
                               │                                       │
                               │                                       └─── boxed
                               │
                               │                    ┌─── reduce
                               │                    │
                               │                    ├─── collect
                               │                    │
                               │                    │               ┌─── forEach
                               │                    ├─── for ───────┤
                               │                    │               └─── forEachOrdered
                               │                    │
                               │                    │               ┌─── sum
                               │                    │               │
                               │                    │               ├─── min
                               │                    │               │
                               │                    │               ├─── max
                               │                    ├─── math ──────┤
                               │                    │               ├─── count
                               └─── terminal ───────┤               │
                                                    │               ├─── average
                                                    │               │
                                                    │               └─── IntSummaryStatistics
                                                    │
                                                    │               ┌─── anyMatch
                                                    │               │
                                                    ├─── match ─────┼─── allMatch
                                                    │               │
                                                    │               └─── noneMatch
                                                    │
                                                    │               ┌─── findFirst
                                                    ├─── find ──────┤
                                                    │               └─── findAny
                                                    │
                                                    └─── array ─────┼─── toArray
```
