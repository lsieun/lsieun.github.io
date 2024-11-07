---
title: "异常处理：@SneakyThrows"
sequence: "102"
---

[UP](/lombok.html)

```java
import lombok.SneakyThrows;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

public class CheckedExceptionBurden {
    @SneakyThrows
    public String resourceAsString() {
        try (InputStream is = this.getClass().getResourceAsStream("sure_in_my_jar.txt")) {
            BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
            return br.lines().collect(Collectors.joining("\n"));
        }
    }
}
```

```java
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

public class CheckedExceptionBurden {
    public CheckedExceptionBurden() {
    }

    public String resourceAsString() {
        try {
            InputStream is = this.getClass().getResourceAsStream("sure_in_my_jar.txt");

            String var3;
            try {
                BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
                var3 = (String)br.lines().collect(Collectors.joining("\n"));
            } catch (Throwable var5) {
                if (is != null) {
                    try {
                        is.close();
                    } catch (Throwable var4) {
                        var5.addSuppressed(var4);
                    }
                }

                throw var5;
            }

            if (is != null) {
                is.close();
            }

            return var3;
        } catch (Throwable var6) {
            throw var6;
        }
    }
}
```
