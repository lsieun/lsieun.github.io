---
title:  "Analyzer"
sequence: "408"
---

[上级目录]({% link _posts/2021-05-01-java-asm-season-03.md %})

```java
public class HelloWorld {
    public void test(int a, int b) {
        Object obj;
        int c = a + b;

        if (c > 10) {
            obj = Integer.valueOf(20);
        }
        else {
            obj = Float.valueOf(5);
        }
    }
}
```
