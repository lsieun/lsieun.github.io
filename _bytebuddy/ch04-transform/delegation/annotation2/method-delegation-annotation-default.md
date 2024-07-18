---
title: "@Default"
sequence: "120"
---

## 注意事项

Obviously, default method invocation is only available for classes that are defined in a class file version equal to Java 8 or newer.

Similarly, in addition to the `@Super` annotation,
there is a `@Default` annotation which injects a proxy for invoking a specific default method explicitly.

## 示例 @Default

```java
import java.util.Date;

public interface IDog {
    default String test(String name, int age, Date date) {
        return String.format("Dog: %s - %d - %s", name, age, date);
    }
}
```

```java
import java.util.Date;

public class HelloWorld implements IDog {
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
import net.bytebuddy.implementation.bind.annotation.Argument;
import net.bytebuddy.implementation.bind.annotation.Default;

import java.util.Date;

public class LazyWorker {
    public static String test(@Default IDog dog,
                              @Argument(0) String name,
                              @Argument(1) int age,
                              @Argument(2) Date date) {
        String message = dog.test(name, age, date);
        return "message from LazyWorker - " + message;
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

> 这里不能使用 subclass

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldSubClass {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";
        Class<?> clazz = Class.forName(className);


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(clazz).name("sample.HelloWorldChild");

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
class HelloWorld$auxiliary$Default implements IDog {
    public volatile HelloWorld target;

    public String test(String var1, int var2, Date var3) {
        return this.target.test$accessor$oWwUpiwh$nfun530(var1, var2, var3);
    }
}
```

```java
public class HelloWorld implements IDog {
    public String test(String name, int age, Date date) {
        HelloWorld$auxiliary$Default auxiliary$Default = new HelloWorld$auxiliary$Default();
        auxiliary$Default.target = this;
        return LazyWorker.test(auxiliary$Default, name, age, date);
    }

    private String test$original$xSxp2pP6(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }

    final String test$accessor$oWwUpiwh$nfun530(String var1, int var2, Date var3) {
        return super.test(var1, var2, var3);
    }
}
```

```text
> javap -v -p sample.HelloWorld

  final java.lang.String test$accessor$oWwUpiwh$nfun530(java.lang.String, int, java.util.Date);
    descriptor: (Ljava/lang/String;ILjava/util/Date;)Ljava/lang/String;
    flags: (0x0010) ACC_FINAL
    Code:
      stack=4, locals=4, args_size=4
         0: aload_0
         1: aload_1
         2: iload_2
         3: aload_3
         4: invokespecial #50                 // InterfaceMethod sample/IDog.test:(Ljava/lang/String;ILjava/util/Date;)Ljava/lang/String;
         7: areturn

```


