---
title: "@Pipe"
sequence: "102"
---

![](/assets/images/bytebuddy/delegation/delegation-pipe-anime.webp)

```text
创作一张动漫风格的画作，一个富豪将一件价值连城的宝贝交给儿子
```

## 介绍

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.PARAMETER)
public @interface Pipe {
    boolean serializableProxy() default false;
}
```

## 示例

### HelloWorld

```java
public class HelloWorld {

    public String test(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }
}
```

### GoodChild

```java
public class GoodChild extends HelloWorld {
    @Override
    public String test(String name, int age) {
        return String.format("GoodChild: %s - %d", name, age);
    }
}
```

### HelloWorldRun

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        String msg = instance.test("Tom", 10);
        System.out.println("msg = " + msg);
    }
}
```

### ForwardingType

```java
public interface ForwardingType<T, S> {

    S doPipe(T target);
}
```

### HardWorker

```java
import net.bytebuddy.implementation.bind.annotation.Pipe;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;


public class HardWorker {
    @RuntimeType
    public static Object doWork(@Pipe ForwardingType<Object, String> pipe) {
        GoodChild instance = new GoodChild();
        return pipe.doPipe(instance);
    }
}
```

### HelloWorldRebase

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.Pipe;
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
                MethodDelegation.withDefaultConfiguration()
                        .withBinders(Pipe.Binder.install(ForwardingType.class))
                        .to(HardWorker.class)
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

## 实现细节

```java
public class HelloWorld {
    public HelloWorld() {
    }

    public String test(String var1, int var2) {
        return (String)HardWorker.doWork(new HelloWorld$auxiliary$type(var1, var2));
    }

    private String test$original$abc(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }
}
```

```java
class HelloWorld$auxiliary$type implements ForwardingType {
    private String argument0;
    private int argument1;

    HelloWorld$auxiliary$type(String var1, int var2) {
        this.argument0 = var1;
        this.argument1 = var2;
    }

    public Object doPipe(Object var1) {
        return ((HelloWorld)var1).test(this.argument0, this.argument1);
    }
}
```
