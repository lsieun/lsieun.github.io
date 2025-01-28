---
title: "Fork/Join"
sequence: "111"
---

[UP](/java-concurrency.html)


## ExecutorService vs Fork/Join

After the release of Java 7, many developers decided
to replace the `ExecutorService` framework with the fork/join framework.

This is not always the right decision, however.
Despite the simplicity and frequent performance gains associated with fork/join,
it reduces developer control over concurrent execution.

`ExecutorService` gives the developer the ability to **control the number of generated threads** and
**the granularity of tasks** that should be run by separate threads.
**The best use case for `ExecutorService` is the processing of independent tasks**,
such as transactions or requests according to the scheme "**one thread for one task.**"

In contrast, according to [Oracle's documentation][fork-join-url],
**fork/join was designed to speed up work that can be broken into smaller pieces recursively.**

## Reference

[fork-join-url]: https://docs.oracle.com/javase/tutorial/essential/concurrency/forkjoin.html
