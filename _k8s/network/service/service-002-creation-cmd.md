---
title: "命令行 创建"
sequence: "102"
---

```text
$ kubectl expose pod quiz --name quiz
```

This command creates a service named `quiz` that exposes the `quiz` pod.
To do this, it checks the pod's **labels** and
creates a Service object with a **label selector** that matches all the pod's labels.

