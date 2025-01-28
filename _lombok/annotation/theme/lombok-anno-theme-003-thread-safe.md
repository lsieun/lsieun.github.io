---
title: "线程安全：@Synchronized"
sequence: "103"
---

[UP](/lombok.html)

```java
import lombok.Synchronized;

import java.util.HashMap;
import java.util.Map;

public class ThreadSafe {
    private final Map<String, Object> map = new HashMap<>();

    @Synchronized
    public /* better than: synchronized */ void putValueInCache(String key, Object value) {
        // whatever here will be thread-safe code
        System.out.println("before map");
        map.put(key, value);
        System.out.println("after map");
    }
}
```

```java
import java.util.HashMap;
import java.util.Map;

public class ThreadSafe {
    private final Object $lock = new Object[0];
    private final Map<String, Object> map = new HashMap();

    public ThreadSafe() {
    }

    public void putValueInCache(String key, Object value) {
        synchronized(this.$lock) {
            System.out.println("before map");
            this.map.put(key, value);
            System.out.println("after map");
        }
    }
}
```
