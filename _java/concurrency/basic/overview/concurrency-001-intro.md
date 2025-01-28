---
title: "Intro"
sequence: "101"
---

[UP](/java-concurrency.html)


The Java Concurrency API includes different synchronization mechanisms that allow you to:

- Define a **critical section** to access a **shared resource**
- Synchronize different **tasks** at **a common point**

The following mechanisms are the most important synchronization mechanisms:

- The `synchronized` keyword: The `synchronized` keyword allows you to define a
  **critical section** in a block of code or in an entire method.
- The `Lock` interface: Lock provides a more flexible synchronization operation
  than the `synchronized` keyword. There are different kinds of Locks:
- `ReentrantLock`, to implement a `Lock` that can be associated with a condition;
- `ReentrantReadWriteLock` that separates the read and write operations; and
- `StampedLock` , a new feature of Java 8 that includes three modes for controlling read/write access.
- The `Semaphore` class: The class that implements the classical semaphore to
  implement the synchronization. Java supports binary and general semaphores.
- The `CountDownLatch` class: A class that allows a task to wait for the
  finalization of multiple operations.
- The `CyclicBarrier` class: A class that allows the synchronization of multiple
  threads at a common point.
- The `Phaser` class: A class that allows you to control the execution of tasks
  divided into phases. None of the tasks advance to the next phase until all of
  the tasks have finished the current phase.
