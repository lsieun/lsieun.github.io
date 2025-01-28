---
title: "获取 Unsafe 实例"
sequence: "102"
---

## Create Instance

```java
public final class Unsafe {
    @CallerSensitive
    public static Unsafe getUnsafe() {
        Class<?> caller = Reflection.getCallerClass();
        if (!VM.isSystemDomainLoader(caller.getClassLoader()))
            throw new SecurityException("Unsafe");
        return theUnsafe;
    }
}
```

```java
import sun.misc.Unsafe;

public class HelloWorld {
    public static void main(String[] args) {
        Unsafe unsafe = Unsafe.getUnsafe();
    }
}
```

```text
Exception in thread "main" java.lang.SecurityException: Unsafe
```

```java
import sun.misc.Unsafe;

import java.lang.reflect.Field;

public class HelloWorld {
    public static void main(String[] args) throws IllegalAccessException, NoSuchFieldException {
        Field f = Unsafe.class.getDeclaredField("theUnsafe");
        f.setAccessible(true);
        Unsafe unsafe = (Unsafe) f.get(null);
    }
}
```
