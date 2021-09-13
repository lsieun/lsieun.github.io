---
title:  "java.lang.System"
sequence: "101"
---

## 重新设置System.out

```java
import java.io.PrintStream;

public class HelloWorld {
    public static void main(String[] args) {
        System.setOut(new PrintStream(System.out) {
            @Override
            public void println(String x) {
                super.println("What are you doing: " + x);
            }
        });

        System.out.println("Hello World");
    }
}
```

输出结果：

```text
What are you doing: Hello World
```
