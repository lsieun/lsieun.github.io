---
title: "@Advice.OnMethodEnter"
sequence: "101"
---

## 介绍

## Advice 的要求

对于 Advice 的要求：

- Annotation（注解）：必须带有 `@Advice.OnMethodEnter`，这样 ByteBuddy 才能知道是哪一个方法。
- Access Flag（访问标识）：必须是 `static` 方法；否则，会失败。
- Instruction（方法代码）：代码逻辑，必须是“有效”的代码。

`@Advice.OnMethodEnter`:

- Any class must declare at most one method with this annotation.
- The annotated method must be static.
- When instrumenting constructors, the `this` values can only be accessed for writing fields
  but not for reading fields or invoking methods.

如果没有 `@Advice.OnMethodEnter` 等注解，则会提示：

```text
java.lang.IllegalArgumentException: No advice defined by class lsieun.buddy.advice.Expert
```

如果不是 `static` 方法，会提示如下错误信息：

```text
java.lang.IllegalStateException: Advice for public void lsieun.buddy.advice.Expert.methodAbc() is not static
```

如果方法体内的代码，不是“有效”的代码，例如调用 `private` 方法：

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc() {
        System.out.println("Method Enter");
        myPrivateMethod();
    }

    private static void myPrivateMethod() {
        System.out.println("Hello ByteBuddy");
    }
}
```

有效的代码：

```java
import net.bytebuddy.asm.Advice;

import java.util.logging.Level;
import java.util.logging.Logger;

public class Expert {
    public static Logger logger = Logger.getLogger(Expert.class.getName());

    @Advice.OnMethodEnter
    static void methodAbc() {
        System.out.println("Method Enter");
        logger.log(Level.INFO, "Hello ByteBuddy");
    }
}
```

### 注意事项

- 使用次数：在一个类里，只能使用一次。
- 方法修饰符：方法修饰符必须是 `static`
- 功能限制：the `this` values can only be accessed for **writing fields** but **not for reading fields or invoking methods**.

