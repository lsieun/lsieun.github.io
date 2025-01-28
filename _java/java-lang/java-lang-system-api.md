---
title: "java.lang.System"
sequence: "102"
---

## 重新设置 System.out

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

## identityHashCode 方法

```java
public final class System {

    /**
     * Returns the same hash code for the given object as
     * would be returned by the default method hashCode(),
     * whether or not the given object's class overrides hashCode().
     * The hash code for the null reference is zero.
     *
     * @param x object for which the hashCode is to be calculated
     * @return  the hashCode
     * @since   JDK1.1
     */
    public static native int identityHashCode(Object x);
}
```
