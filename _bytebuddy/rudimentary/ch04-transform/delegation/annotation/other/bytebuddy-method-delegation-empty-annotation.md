---
title: "@Empty"
sequence: "122"
---

## @Empty

@Empty: Applying this annotation, Byte Buddy injects the parameter type's default value.

For primitive types, this is the equivalent of the number zero, for reference types, this is `null`.

Using this annotation is meant for voiding an interceptor's parameter.

## 示例

### HelloWorld

```java
public class HelloWorld {

    public String test(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
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

### HelloWorldRebase

```java
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

### HardWorker

```java
import net.bytebuddy.implementation.bind.annotation.Empty;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Empty String str, @Empty int val) {
        return String.format("HardWorker: %s - %d", str, val);
    }
}
```

```text
msg = HardWorker: null - 0
```
