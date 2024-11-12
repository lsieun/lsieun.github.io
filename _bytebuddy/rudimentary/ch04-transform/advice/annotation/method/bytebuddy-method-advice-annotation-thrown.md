---
title: "@Advice.Thrown"
sequence: "108"
---

## 介绍




第 1 点，如果 instrumented method 抛出异常，那么 advice method 就会被忽略。

By default, the **advice method** will be skipped if the **instrumented method** throws exception.

![](/assets/images/bytebuddy/bytebuddy-concept-instrumented-and-advice-method.png)

第 2 点，如果想要继续执行 advice method 的代码，需要设置 `@Advice.OnMethodExit` 的 `onThrowable` 属性。
在 `onThrowable` 属性中，我们要指明要捕获什么类型的异常：

```java
public class Expert {
    @Advice.OnMethodExit(onThrowable = Exception.class)
    public static void giveAdvice() {
        // ...
    }
}
```

第 3 点，在 advice method 中，如何捕获到异常对象呢？需要使用 `@Advice.Thrown` 注解。

```java
public class Expert {
    @Advice.OnMethodExit(onThrowable = Exception.class)
    public static void giveAdvice(@Advice.Thrown IllegalArgumentException ex) {
        // ...
    }
}
```

第 4 点，在 advice method 中，捕获到异常之后，应该如何处理呢？有两种方式：

- 第一种方式，吞食异常
- 第二种方式，抛出异常

Advice code can suppress the exception to `null`,
or throw a new exception to replace the exception thrown.

```java
@Retention(RetentionPolicy.RUNTIME)
@java.lang.annotation.Target(ElementType.PARAMETER)
public @interface Thrown {
    boolean readOnly() default true;
    Assigner.Typing typing() default Assigner.Typing.DYNAMIC;
}
```

## 示例

### 捕获异常

```java
public class HelloWorld {
    public void test(String str) {
        if (str == null) {
            throw new NumberFormatException("str is null");
        }
        int num = Integer.parseInt(str);
        System.out.println(num);
    }
}
```

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodExit(onThrowable = Exception.class)
    static void methodXyz(
            @Advice.Thrown IllegalArgumentException ex
    ) {
        System.out.println("Hello Exception: " + ex.getMessage());
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.Advice;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        builder = builder.visit(
                Advice.to(Expert.class).on(ElementMatchers.isMethod())
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        instance.test(null);
    }
}
```

### 吞食异常

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodExit(onThrowable = Throwable.class)
    static void methodXyz(
            @Advice.Thrown(readOnly = false) IllegalArgumentException ex
    ) {
        if (ex == null) {
            System.out.println("normal return");
        }
        else {
            System.out.println("throw exception: " + ex.getMessage());
        }

        ex = null;
    }
}
```

### 抛出异常

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodExit(onThrowable = Throwable.class)
    static void methodXyz(
            @Advice.Thrown(readOnly = false) IllegalArgumentException ex
    ) {
        if (ex == null) {
            System.out.println("normal return");
        }
        else {
            System.out.println("throw exception: " + ex.getMessage());
        }

        throw new RuntimeException(ex);
    }
}
```

