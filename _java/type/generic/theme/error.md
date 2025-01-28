---
title: "Error"
sequence: "124"
---

## Array

bounded wildcard

```text
Pair<? extends Number, ? extends Number>[] array = new Pair[10]; // ok

Pair<? extends Number, ? extends Number>[] array = new Pair<?, ?>[10]; // error
Pair<? extends Number, ? extends Number>[] array = new Pair<? extends Number, ? extends Number>[10]; // error
```

unbounded wildcard

```text
Pair<?, ?>[] array = new Pair<?, ?>[10]; // ok
```
