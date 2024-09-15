---
title: "Call site"
sequence: "102"
---

In programming, a **call site** of a function is the location (line of code) where the function is called
(or may be called, through dynamic dispatch).

```text
call site 是 function 调用的地方
```

A call site is where zero or more arguments are passed to the function,
and zero or more return values are received.

```text
call site 会涉及到 function 的 arguments 和 return values
```

```java
public class HelloWorld {
    // this is a function "definition"
    public int sqrt(int x) {
        return x * x;
    }

    public void foo(int b) {
        // these are two call sites of function sqrt in this function
        int a = sqrt(b);
        int c = sqrt(b);
    }
}
```
