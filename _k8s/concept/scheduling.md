---
title: "scheduling"
sequence: "scheduling"
---

The term **scheduling** refers to the assignment of the **pod** to a **node**.
The pod runs immediately, not at some point in the future.

Just like how the CPU scheduler in an operating system selects what CPU to run a process on,
the scheduler in Kubernetes decides what worker node should execute each container.

```text
相同之处
```

Unlike an OS process, once a pod is assigned to a node, it runs only on that node.
Even if it fails, this instance of the pod is never moved to other nodes,
as is the case with CPU processes,
but a new pod instance may be created to replace it.

```text
不同之处
```
