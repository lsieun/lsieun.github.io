---
title: "快速开始"
sequence: "101"
---

## return String

```java
public class HelloWorld {
    public String test(String name) {
        return null;
    }
}
```

```java
public class HardWorker {
    public static String doWork(String name) {
        String message = String.format("Hello, %s!", name);
        System.out.println(message);
        return message;
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRebase {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.rebase(clazz);

        builder = builder.method(
                ElementMatchers.named("test")
        ).intercept(
                MethodDelegation.to(HardWorker.class)
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## return void

### 预期目标

```java
public class HelloWorld {
    public void test() {
        System.out.println("Mirror mirror on the wall.");
        System.out.println("Who is the most beautiful woman in the world?");
    }
}
```

### HardWorker

These are the requirements for implementing around advice that supports `void` return:

- The advice method is a `static` method.
- The advice method returns `void`.
- The advice method has one `java.lang.Runnable` parameter, and it is annotated with `@SuperCall` annotation.

```java
import net.bytebuddy.implementation.bind.annotation.Origin;
import net.bytebuddy.implementation.bind.annotation.SuperCall;

import java.lang.reflect.Method;

public class HardWorker {
    public static void doWork(@SuperCall Runnable targetCode, @Origin Method method) {
        // 1. 记录开始时间
        long startTime = System.currentTimeMillis();
        System.out.println(">>> >>> >>> >>> >>> >>> >>> >>> >>> Method Enter: " + method.getName());

        // 2. 执行原来的方法
        targetCode.run();

        // 3. 记录结束时间
        System.out.println("<<< <<< <<< <<< <<< <<< <<< <<< <<< Method Exit: " + method.getName());
        long endTime = System.currentTimeMillis();

        // 4. 输出运行时间
        long diff = endTime - startTime;
        String message = String.format("Execution Time: %s", diff);
        System.out.println(message);
    }
}
```

### 编码实现



```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRebase {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.rebase(clazz);

        builder = builder.method(
                ElementMatchers.named("test")
        ).intercept(
                MethodDelegation.to(HardWorker.class)
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

注意：上面使用的是 `ByteBuddy.rebase()` 方法，而不能用 `ByteBuddy.redefine()` 方法；否则，会出错。

Because of `MethodDelegation` and `@SuperCall` annotation,
ByteBuddy creates a **proxy** class to implement the instrumented code.

The proxy class implements two Java interface: `java.lang.Runnable` and `java.util.concurrent.Callable`.

If the functional method returns `void`,
then the `@SuperCall` annotated parameter should use `java.lang.Runnable` in advice code.

## return Object

### 预期目标

```java
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.UUID;

public class HelloWorld {
    public String test() {
        String str = UUID.randomUUID().toString();
        byte[] bytes = str.getBytes(StandardCharsets.UTF_8);
        byte[] encodedBytes = Base64.getEncoder().encode(bytes);
        return new String(encodedBytes, StandardCharsets.UTF_8);
    }
}
```

### 编码实现

```java
import net.bytebuddy.implementation.bind.annotation.Origin;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.SuperCall;

import java.lang.reflect.Method;
import java.util.concurrent.Callable;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@SuperCall Callable<Object> targetCode, @Origin Method method) throws Exception {
        // 1. 记录开始时间
        long startTime = System.currentTimeMillis();
        System.out.println(">>> >>> >>> >>> >>> >>> >>> >>> >>> Method Enter: " + method.getName());

        // 2. 执行原来的方法
        Object result = targetCode.call();
        System.out.println("Result: " + result);

        // 3. 记录结束时间
        System.out.println("<<< <<< <<< <<< <<< <<< <<< <<< <<< Method Exit : " + method.getName());
        long endTime = System.currentTimeMillis();

        // 4. 输出运行时间
        long diff = endTime - startTime;
        String message = String.format("Execution Time: %s", diff);
        System.out.println(message);

        // 5. 返回结果
        return result;
    }
}
```

These are the requirements for implementing around advice
that supports return object of the functional method:

- The advice method is a `static` method.
- The advice method returns `Object` instance, or the type that follows the return type of functional method.
- The advice method has one `java.util.concurrent.Callable` parameter, and it is annotated with `@SuperCall` annotation.
- The advice method is annotated with the `@RuntimeType` annotation.

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRebase {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.rebase(clazz);

        builder = builder.method(
                ElementMatchers.named("test")
        ).intercept(
                MethodDelegation.to(HardWorker.class)
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```
