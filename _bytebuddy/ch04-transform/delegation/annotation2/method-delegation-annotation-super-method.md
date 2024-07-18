---
title: "@SuperMethod"
sequence: "118"
---

```java
import java.util.Date;

public class HelloWorld {
    public String test(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

```java
import java.util.Date;

public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        String message = instance.test("Tom", 10, new Date());
        System.out.println(message);
    }
}
```

```java
import net.bytebuddy.implementation.bind.annotation.SuperMethod;

import java.lang.reflect.Method;

public class LazyWorker {
    public static String test(@SuperMethod Method method) {
        System.out.println("@SuperMethod Method: " + method);
        return "message from LazyWorker";
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRebase {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";
        Class<?> clazz = Class.forName(className);


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.rebase(clazz);

        builder = builder.method(
                ElementMatchers.named("test")
        ).intercept(
                MethodDelegation.to(LazyWorker.class)
        );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

```java
public class HelloWorld {
    private static final Method cachedValue$x4Lluzdh$qc3sfg3;

    static {
        cachedValue$x4Lluzdh$qc3sfg3 = HelloWorld.class.getDeclaredMethod("test$original$ZIbkCeKc$accessor$x4Lluzdh", String.class, Integer.TYPE, Date.class);
    }

    public String test(String var1, int var2, Date var3) {
        return LazyWorker.test(cachedValue$x4Lluzdh$qc3sfg3);
    }

    private String test$original$ZIbkCeKc(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }

    public final String test$original$ZIbkCeKc$accessor$x4Lluzdh(String var1, int var2, Date var3) {
        return this.test$original$ZIbkCeKc(var1, var2, var3);
    }
}
```
