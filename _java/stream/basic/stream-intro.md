---
title: "Stream Intro"
sequence: "101"
---

What exactly is a stream?
A short definition is "a sequence of elements from a source that supports data processing operations."
Let's break down this definition step by step:

- **Sequence of elements** - Like a collection,
  a stream provides an interface to a sequenced set of values of a specific element type.
  Because collections are data structures,
  they're mostly about storing and accessing elements with specific time/space complexities
  (for example, an `ArrayList` vs. a `LinkedList`).
  But streams are about expressing computations such as filter, sorted, and map that.
  **Collections are about data**; **streams are about computations**.

- **Source** - Streams consume from a data-providing source such as **collections**, **arrays**, or **I/O resources**.
  Note that generating a stream from an ordered collection preserves the ordering.
  The elements of a stream coming from a list will have the same order as the list.

- **Data processing operations** - Streams support database-like operations and
  common operations from functional programming languages to manipulate data,
  such as filter, map, reduce, find, match, sort, and so on.
  **Stream operations can be executed either sequentially or in parallel.**

```text
                            ┌─── empty
                            │
                            │                    ┌─── of
                            ├─── value ──────────┤
                            │                    └─── ofNullable
                            │
                            │                    ┌─── iterate
                            ├─── function ───────┤
                            │                    └─── generate
                            │
                            │                    ┌─── accept
                            │                    │
          ┌─── source ──────┼─── builder ────────┼─── add
          │                 │                    │
          │                 │                    └─── build
          │                 │
          │                 ├─── stream
          │                 │
          │                 ├─── concat
          │                 │
          │                 ├─── collection
          │                 │
          │                 ├─── array
          │                 │
          │                 └─── I/O resource
          │
          │                                      ┌─── filter
          │                                      │
          │                                      │                ┌─── peek
          │                                      │                │
          │                                      ├─── slice ──────┼─── skip (stateful-bounded)
          │                                      │                │
          │                                      │                └─── limit (stateful-bounded)
          │                                      │
          │                                      │                ┌─── map
          │                                      │                │
          │                                      │                ├─── mapToInt
Stream ───┤                                      │                │
          │                                      │                ├─── mapToLong
          │                                      │                │
          │                                      │                ├─── mapToDouble
          │                                      │                │
          │                                      │                ├─── flatMap
          │                                      │                │
          │                 ┌─── intermediate ───┤                ├─── flatMapToInt
          │                 │                    ├─── mapping ────┤
          │                 │                    │                ├─── flatMapToLong
          │                 │                    │                │
          │                 │                    │                ├─── flatMapToDouble
          │                 │                    │                │
          │                 │                    │                ├─── mapMulti
          │                 │                    │                │
          │                 │                    │                ├─── mapMultiToInt
          │                 │                    │                │
          │                 │                    │                ├─── mapMultiToLong
          │                 │                    │                │
          │                 │                    │                └─── mapMultiToDouble
          │                 │                    │
          │                 │                    │                ┌─── sorted (stateful-unbounded)
          │                 │                    ├─── stateful ───┤
          │                 │                    │                └─── distinct (stateful-unbounded)
          │                 │                    │
          └─── operation ───┤                    │                ┌─── takeWhile
                            │                    └─── while ──────┤
                            │                                     └─── dropWhile
                            │
                            │                                     ┌─── anyMatch
                            │                                     │
                            │                    ┌─── match ──────┼─── allMatch
                            │                    │                │
                            │                    │                └─── noneMatch
                            │                    │
                            │                    │                ┌─── findFirst
                            │                    ├─── find ───────┤
                            │                    │                └─── findAny
                            │                    │
                            │                    │                ┌─── reduce (stateful-bounded)
                            │                    │                │
                            │                    │                ├─── collect
                            │                    │                │
                            └─── terminal ───────┤                ├─── toList
                                                 ├─── reducing ───┤
                                                 │                ├─── count
                                                 │                │
                                                 │                ├─── min
                                                 │                │
                                                 │                └─── max
                                                 │
                                                 │                ┌─── forEach
                                                 ├─── for ────────┤
                                                 │                └─── forEachOrdered
                                                 │
                                                 └─── array ──────┼─── toArray
```

In addition, stream operations have two important characteristics:

- **Pipelining** - Many stream operations return a stream themselves,
  allowing operations to be chained and form a larger pipeline.
  This enables certain optimizations, such as laziness and short-circuiting.
  A pipeline of operations can be viewed as a database-like query on the data source.

- **Internal iteration** - In contrast to collections, which are iterated explicitly using an iterator,
  stream operations do the iteration behind the scenes for you.





