---
title: "Unsafe Example"
sequence: "111"
---

## Module Reflection

下面的[代码](https://stackoverflow.com/a/53517025/10202942) 让 JVM 不打印 illegal reflective access 的 WARNING 信息：

```text
WARNING: An illegal reflective access operation has occurred
WARNING: Illegal reflective access by XXX to field java.lang.StringBuilder.serialVersionUID
WARNING: Please consider reporting this to the maintainers of com.baeldung.reflecting.unnamed.Main
WARNING: Use --illegal-access=warn to enable warnings of further illegal reflective access operations
WARNING: All illegal access operations will be denied in a future release
```

```java
import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class Main {
    @SuppressWarnings("unchecked")
    public static void disableAccessWarnings() {
        try {
            Class unsafeClass = Class.forName("sun.misc.Unsafe");
            Field field = unsafeClass.getDeclaredField("theUnsafe");
            field.setAccessible(true);
            Object unsafe = field.get(null);

            Method putObjectVolatile = unsafeClass.getDeclaredMethod("putObjectVolatile", Object.class, long.class, Object.class);
            Method staticFieldOffset = unsafeClass.getDeclaredMethod("staticFieldOffset", Field.class);

            Class loggerClass = Class.forName("jdk.internal.module.IllegalAccessLogger");
            Field loggerField = loggerClass.getDeclaredField("logger");
            Long offset = (Long) staticFieldOffset.invoke(unsafe, loggerField);
            putObjectVolatile.invoke(unsafe, loggerClass, offset, null);
        } catch (Exception ignored) {
        }
    }

    public static void main(String[] args) {
        disableAccessWarnings();
    }
}
```


