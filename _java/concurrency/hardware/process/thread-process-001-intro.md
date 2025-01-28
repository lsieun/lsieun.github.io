---
title: "Intro"
sequence: "101"
---

[UP](/java-concurrency.html)


## Basic

```java
import java.lang.management.ManagementFactory;

public class FindNumberOfThreads {
    public static void main(String[] args) {
        System.out.println("Number of threads " + Thread.activeCount());

        System.out.println("Current Thread Group - " + Thread.currentThread().getThreadGroup().getName());

        System.out.println("Total Number of threads " + ManagementFactory.getThreadMXBean().getThreadCount());
    }
}
```

```text
Number of threads 2
Current Thread Group - main
Total Number of threads 6
```

## Reference

- [How to Get the Number of Threads in a Java Process](https://www.baeldung.com/java-get-number-of-threads)
