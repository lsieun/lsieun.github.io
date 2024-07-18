---
title: "@Morph"
sequence: "123"
---

## @Morph

@Morph: This annotation works very similar to the `@SuperCall` annotation.

However, using this annotation allows to specify the arguments
that should be used for invoking the super method.

Note that you should only use this annotation
when you need to invoke a super method with different arguments than the original invocation
as using the `@Morph` annotation requires a boxing and unboxing of all arguments.

If you want to invoke a specific super method,
consider using the `@Super` annotation for creating a type-safe proxy.
Before this annotation can be used, it needs to be installed and registered explicitly,
similarly to the `@Pipe` annotation.

This annotation instructs Byte Buddy to inject a proxy class
that calls a method's super method with explicit arguments.
For this, the `Morph.Binder` needs to be installed for **an interface type**
that **takes an argument of the array type `Object`** and **returns a non-array type of `Object`**.
This is an alternative to using the `SuperCall` or `DefaultCall` annotations
which call a super method using the same arguments as the intercepted method was invoked with.

## 原程序

```java
import java.util.Date;

public class HelloWorld {
    public String test(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

```java
import lsieun.utils.InvokeUtils;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        String className = "sample.HelloWorld";
        InvokeUtils.invokeAllMethods(className);
    }
}
```

## 修改程序

```java
public interface MyCallable<R> {
    R call(Object[] args);
}
```

```java
import net.bytebuddy.implementation.bind.annotation.AllArguments;
import net.bytebuddy.implementation.bind.annotation.Morph;

public class LazyWorker {
    public static String test(@Morph MyCallable<String> executable, @AllArguments Object[] args) {
        String message = executable.call(args);
        return "message from LazyWorker: " + message;
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.Morph;
import net.bytebuddy.matcher.ElementMatchers;
import sample.MyCallable;

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
                MethodDelegation
                        .withDefaultConfiguration()
                        .withBinders(
                                Morph.Binder.install(MyCallable.class)
                        )
                        .to(LazyWorker.class)
        );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

## 实现机制

```java
public class HelloWorld {
    public String test(String name, int age, Date date) {
        return LazyWorker.test(new HelloWorld$auxiliary$Morph(this), new Object[]{name, age, date});
    }

    private String test$original$private(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }

    final String test$original$private$accessor$final(String name, int age, Date date) {
        return this.test$original$private(name, age, date);
    }
}
```

```java
class HelloWorld$auxiliary$Morph implements MyCallable {
    private final HelloWorld target;

    HelloWorld$auxiliary$Morph(HelloWorld target) {
        this.target = target;
    }
    
    public Object call(Object[] var1) {
        return this.target.test$original$private$accessor$final((String)var1[0], (Integer)var1[1], (Date)var1[2]);
    }
}
```

