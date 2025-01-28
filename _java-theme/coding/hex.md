---
title: "HexFormat"
sequence: "101"
---

```java
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;

public class HelloWorld {
    public static void main(String[] args) {
        String str = "ABC123";
        byte[] bytes = str.getBytes(StandardCharsets.UTF_8);
        String hexStr = HexFormat.of()
                .withUpperCase()
                .withDelimiter(" ")
                .formatHex(bytes);
        System.out.println(hexStr);
    }
}
```

```text
41 42 43 31 32 33
```
