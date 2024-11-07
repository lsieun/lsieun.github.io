---
title: "@Slf4j"
sequence: "101"
---

[UP](/lombok.html)


```java
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class HelloWorld {
}
```

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HelloWorld {
    private static final Logger log = LoggerFactory.getLogger(HelloWorld.class);

    public HelloWorld() {
    }
}
```
