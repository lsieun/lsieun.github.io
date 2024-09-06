---
title: "@Advice.Unused"
sequence: "101"
---

## @Unused

- `@Advice.Unused`: the annotated parameter should always return a default value
  (i.e. `0` for numeric values, `false` for boolean types and `null` for reference types).
  Any assignments to this variable are without any effect.

```java
public class HelloWorld {
    public void test() {
        System.out.println("Hello World");
    }
}
```

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    public static void methodEnter(
            @Advice.Unused int unusedValue
    ) {
        System.out.println(unusedValue);
    }
}
```
