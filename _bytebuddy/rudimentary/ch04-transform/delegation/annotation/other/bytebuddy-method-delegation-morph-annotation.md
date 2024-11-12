---
title: "@Morph"
sequence: "101"
---

![](/assets/images/bytebuddy/delegation/bytebuddy-method-delegation-annotation-morph-class-diagram.svg)

## 介绍

### 如何使用

Before this annotation can be used, it needs to be installed and registered explicitly,
similarly to the `@Pipe` annotation.
This annotation instructs Byte Buddy to inject a proxy class
that calls a method's super method with explicit arguments.

```text
MethodDelegation.withDefaultConfiguration()
    .withBinders(Morph.Binder.install(HumbleServant.class))
    .to(HardWorker.class)
```

For this, the `Morph.Binder` needs to be installed for **an interface type**
that **takes an argument of the array type `Object`** and **returns a non-array type of `Object`**.

```text
Morph.Binder.install(HumbleServant.class)
```

```java
public interface HumbleServant<R> {
    R process(Object[] args);
}
```

![](/assets/images/bytebuddy/delegation/humble-servant.png)

This is an alternative to using the `SuperCall` or `DefaultCall` annotations
which call a super method using the same arguments as the intercepted method was invoked with.


### 区别

@Morph: This annotation works very similar to the `@SuperCall` annotation.

However, using this annotation allows to specify the arguments
that should be used for invoking the super method.

Note that you should only use this annotation
when you need to invoke a super method with different arguments than the original invocation
as using the `@Morph` annotation requires a boxing and unboxing of all arguments.

If you want to invoke **a specific super method**,
consider using the `@Super` annotation for creating a type-safe proxy.



## 示例

### HelloWorld

```java
public class HelloWorld {
    public String test(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }
}
```

### 运行

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        String msg = instance.test("Tom", 10);
        System.out.println(msg);
    }
}
```

### HumbleServant

```java
public interface HumbleServant<R> {
    R process(Object[] args);
}
```

### HardWorker

```java
import net.bytebuddy.implementation.bind.annotation.Morph;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Morph HumbleServant<String> executable) {
        return executable.process(new Object[]{"Jerry", 9});
    }
}
```

### Weaver

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.Morph;
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
                MethodDelegation
                        .withDefaultConfiguration()
                        .withBinders(
                                Morph.Binder.install(HumbleServant.class)
                        )
                        .to(HardWorker.class)
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

## 实现机制

```java
public class HelloWorld {
    public String test(String name, int age) {
        return (String)HardWorker.doWork(new HelloWorld$auxiliary$Proxy(this));
    }

    private String test$original$Abc(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }

    final String test$original$Abc$accessor$Xyz(String var1, int var2) {
        return this.test$original$Abc(var1, var2);
    }
}
```

```java
class HelloWorld$auxiliary$Proxy implements HumbleServant {
    private final HelloWorld target;

    HelloWorld$auxiliary$Proxy(HelloWorld target) {
        this.target = target;
    }

    public Object process(Object[] args) {
        return this.target.test$original$Abc$accessor$Xyz((String)args[0], (Integer)args[1]);
    }
}
```

