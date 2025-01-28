---
title: "mutual exclusion (mutex)"
sequence: "103"
---

[UP](/java-concurrency.html)


## What is a mutual exclusion (mutex)?

In computer programming, a **mutual exclusion** (**mutex**) is a program object
that prevents multiple threads from accessing the same **shared resource** simultaneously.
A **shared resource** in this context is a code element with a critical section,
the part of the code that should not be executed by more than one thread at a time.

## What is a mutex object?

In a multithreaded program, a **mutex** is a mechanism used to ensure that
multiple concurrent threads do not try to execute a critical section of code simultaneously.

If a mutex is not applied, the program might be subject to a **race condition**,
a situation in which multiple threads try to access a shared resource at the same time.
When this happens, unintended results can occur,
such as data being read or written incorrectly or the program misbehaving or crashing.

## Reference

- [Mutex vs Semaphore](https://www.geeksforgeeks.org/mutex-vs-semaphore/)
