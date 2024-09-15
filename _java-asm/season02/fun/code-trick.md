---
title: "Code Trick"
sequence: "305"
---

## ^=

对于任意一个 `int` 或 `long` 类型的 `value` 值来说，进行 `value ^= value` 操作，本质是都是执行 `value = 0` 的操作。

```java
package sample;

public final class HelloWorld {
    public void test(int value) {
        value ^= value;
        System.out.println(value);
    }
}
```

```java
import sample.HelloWorld;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        HelloWorld instance = new HelloWorld();
        for (int i = 0; i < 10; i++) {
            instance.test(i);
        }
    }
}
```

Output:

```text
0
0
0
0
0
0
0
0
0
0
```

## branchless

```java
package sample;

public final class HelloWorld {
    public int test(int a, int b) {
        if (a < b) {
            return a;
        }
        else {
            return b;
        }
    }
}
```

```java
import sample.HelloWorld;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        HelloWorld instance = new HelloWorld();
        int value = instance.test(5, 10);
        System.out.println(value);
    }
}
```

```java
package sample;

public final class HelloWorld {
    public int test(int a, int b) {
        return a * ((a < b) ? 1 : 0) + b * (b <= a ? 1 : 0);
    }
}
```


