---
title: "Monitor（锁）"
sequence: "104"
---

[UP](/java-concurrency.html)


## What Is a Monitor?

A monitor is a synchronization mechanism that allows threads to have:

- **mutual exclusion** – only one thread can execute the method at a certain point in time, using locks
- **cooperation** – the ability to make threads wait for certain conditions to be met, using wait-set

Why is this feature called “monitor”? Because **it monitors how threads access some resources.**

## Monitor Features

Monitors provide three main features to the concurrent programming:

- only one thread at a time has mutually exclusive access to a critical code section
- threads running in a monitor could be blocked while they're waiting for certain conditions to be met
- one thread can notify other threads when conditions they're waiting on are met

## How Does Java Implement Monitors?

A **critical section** is a part of the code that accesses the same data through different threads.

```text
different threads --> same data --> critical section
```

In Java, we use the `synchronized` keyword to mark **critical sections**.
We can use it to mark methods (also called **synchronized methods**) or
even smaller portions of code (**synchronized statements**).

```text
critical section --> synchronized --> method + statement
```

There are opposed opinions about which approach to favor – 
**method synchronization** is usually the recommended simpler approach,
while the **synchronized statements** could be a better choice from the security point of view.

In Java, there's a logical connection between the monitor and every object or class.
Hence, they cover instance and also static methods.
Mutual exclusion is accomplished with a lock associated with every object and class.
This lock is a binary semaphore called a **mutex**.

### Building and Exclusive Room Analogy

Java's implementation of a monitor mechanism relies on two concepts – **the entry set** and **the wait set**.
In literature, authors use a building and exclusive room analogy to represent the monitor mechanism.
In this analogy, only one person can be present in an exclusive room at a time.

So, in this analogy:

- the monitor is a building that contains two rooms and a hallway
- the synchronized resource is the “exclusive room”
- wait set is a “waiting room”
- entry set is a “hallway”
- threads are people who want to get to the exclusive room

![](/assets/images/java/concurrency/obj/monitor/monitors-analogy.webp)

Also, it's important to mention the steps that threads go through during this process, using the same analogy:

- entering the building – entering the monitor
- entering the exclusive room – acquiring the monitor
- being in the exclusive room – owning the monitor
- leaving the exclusive room – releasing the monitor
- leaving the building – exiting the monitor.

### wait() and notify()

`wait()` and `notify()` are key methods in Java used in synchronized blocks that enable collaboration between threads.

`wait()` orders the calling thread to release the monitor and go to sleep
until some other thread enters this monitor and calls `notify()`.
Also, `notify()` wakes up the first thread that called `wait()` on the specific object.

## Reference

- [What Is a Monitor in Computer Science?](https://www.baeldung.com/cs/monitor)
