---
title: "@Empty"
sequence: "122"
---

## @Empty

@Empty: Applying this annotation, Byte Buddy injects the parameter type's default value.

For primitive types, this is the equivalent of the number zero, for reference types, this is `null`.

Using this annotation is meant for voiding an interceptor's parameter.

```java
import java.util.Base64;
import java.util.Date;

public class HelloWorld {
    public String test(String name, int age, Date date) {
        String str = String.format("%s:%s:%s", name, age, date);
        byte[] bytes = str.getBytes();
        return Base64.getEncoder().encodeToString(bytes);
    }
}
```

```java
import sample.HelloWorld;

import java.util.Date;

public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        instance.test("Tom", 10, new Date());
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldTransform {
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
                MethodDelegation.to(HardWorker.class)
        );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```java
import net.bytebuddy.implementation.bind.annotation.Empty;
import net.bytebuddy.implementation.bind.annotation.SuperCall;

import java.util.Date;

public class HardWorker {
    public static void doWork(@Empty String name, @Empty int age, @Empty Date date, @SuperCall Runnable superCall) {
        System.out.println("This is doWork Method");
        System.out.println("name: " + name);
        System.out.println("age: " + age);
        System.out.println("date: " + date);
        superCall.run();
    }
}
```

```text
This is doWork Method
name: null
age: 0
date: null
Hello Tom, you are 10. Now is Sun May 15 12:57:23 CST 2022
```
