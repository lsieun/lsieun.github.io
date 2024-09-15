---
title: "InnerClasses"
sequence: "InnerClasses"
---

## 示例

### 示例一

```java
import java.util.function.Supplier;

public class HelloWorld {
    public void test() {
        Supplier<String> supplier = () -> "Hello World";
        String str = supplier.get();
        System.out.println(str);
    }
}
```

```text
InnerClasses:
     public static final #68= #64 of #66; //Lookup=class java/lang/invoke/MethodHandles$Lookup of class java/lang/invoke/MethodHandles
```
