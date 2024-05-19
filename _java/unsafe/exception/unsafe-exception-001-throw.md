---
title: "throw exception"
sequence: "101"
---

```java
import sun.misc.Unsafe;

import java.io.IOException;

public class Program {
    public static void main(String[] args) {
        Unsafe unsafe = UnsafeUtils.getInstance();
        unsafe.throwException(new IOException());
    }
}
```
