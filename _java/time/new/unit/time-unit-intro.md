---
title: "时间单位"
sequence: "101"
---

[UP](/java-time.html)

## 示例

### 秒-微秒

```java
import java.util.concurrent.TimeUnit;

public class HelloWorld {
    public static void main(String[] args) {
        long millis = TimeUnit.SECONDS.toMillis(1);
        System.out.println("millis = " + millis);
    }
}
```

```text
millis = 1000
```

### 微秒-纳秒

```java
import java.util.concurrent.TimeUnit;

public class HelloWorld {
    public static void main(String[] args) {
        long nanos = TimeUnit.MILLISECONDS.toNanos(1);
        System.out.println("nanos = " + nanos);
    }
}
```

```text
nanos = 1000000
```