---
title: "@UtilityClass"
sequence: "103"
---

[UP](/lombok.html)


```java
import lombok.experimental.UtilityClass;

@UtilityClass
public class HelloWorld {
    public void test() {
        System.out.println("hello");
    }
}
```

```java
public final class HelloWorld {
    public static void test() {
        System.out.println("hello");
    }

    private HelloWorld() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }
}
```
