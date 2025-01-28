---
title: "CPU"
sequence: "101"
---

[UP](/java-concurrency.html)


```java
public class AvailableProcessor {
    public static void main(String[] args) {
        int num = Runtime.getRuntime().availableProcessors();
        System.out.println(num);
    }
}
```
