---
title: "方法运行时间"
sequence: "102"
---

## HelloWorld

```java
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class HelloWorld {
    public String test(String name, int age, Object obj) {
        String str = name + age + obj;
        byte[] bytes = str.getBytes(StandardCharsets.UTF_8);
        byte[] encodedBytes = Base64.getEncoder().encode(bytes);
        return new String(encodedBytes, StandardCharsets.UTF_8);
    }
}
```

## HelloWorldRun

```Java
import java.time.LocalDateTime;

public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        String msg = instance.test("Tom", 10, LocalDateTime.now());
        System.out.println(msg);
    }
}
```

## HardWorker

```Java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.SuperCall;

import java.util.concurrent.Callable;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@SuperCall Callable<?> targetCode) throws Exception {
        // 1. 记录开始时间
        long startTime = System.currentTimeMillis();
        System.out.println(">>> >>> >>> >>> >>> >>> >>> >>> >>> Method Enter");

        // 2. 执行原来的方法
        Object result = targetCode.call();
        System.out.println("Result: " + result);

        // 3. 记录结束时间
        System.out.println("<<< <<< <<< <<< <<< <<< <<< <<< <<< Method Exit");
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

## HelloWorldRebase

```Java
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
        OutputUtils.save(unloadedType, true);
    }
}
```
