---
title: "start VS. run"
sequence: "104"
---

[UP](/java-concurrency.html)


Who calls `run()` then? The short answer is Java Virtual Machine (JVM).
The long answer is that once the `start()` method is called on the thread object,
JVM starts to execute the thread and calls its `run()` method.
In in other words, `start()` is the method that is actually used to start a new thread and make it run.
