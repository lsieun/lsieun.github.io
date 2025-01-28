---
title: "StackWalker"
sequence: "103"
---

```text
private Class<?> getCallerClass() {
    return StackWalker
            .getInstance(StackWalker.Option.RETAIN_CLASS_REFERENCE)
            .walk(stack -> stack.filter(
                    frame -> frame.getDeclaringClass() != this.getClass())
                    .findFirst()
                    .map(StackWalker.StackFrame::getDeclaringClass)
                    .orElseThrow(IllegalStateException::new)
            );
}
```

- [JEP 259: Stack-Walking API](https://openjdk.java.net/jeps/259)
