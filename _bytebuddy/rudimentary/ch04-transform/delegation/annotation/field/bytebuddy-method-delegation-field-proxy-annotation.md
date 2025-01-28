---
title: "@FieldProxy"
sequence: "106"
---

## @FieldProxy

@FieldProxy: Using this annotation, Byte Buddy injects an accessor for a given field.
The accessed field can either be specified explicitly by its name or it is derived from a getter or setter methods name,
in case that the intercepted method represents such a method.

Before this annotation can be used, it needs to be installed and registered explicitly, similarly to the @Pipe annotation.

## 示例

### HelloWorld

```java
public class HelloWorld {
    private String prefix = "AAA";

    public String test(String name, int age) {
        return String.format("%s: %s - %d", prefix, name, age);
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

### Get

```java
public interface Get<T> {

    T get();
}
```

### Set

```java
public interface Set<T> {

    void set(T value);
}
```

### HardWorker

```java
import net.bytebuddy.implementation.bind.annotation.FieldProxy;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@FieldProxy("prefix") Get<String> getter,
                                @FieldProxy("prefix") Set<String> setter) {
        setter.set("BBB");
        return String.format("%s: %s - %d", getter.get(), "Jerry", 9);
    }
}
```

### HelloWorldRebase

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.FieldProxy;
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
                        .withBinders(FieldProxy.Binder.install(Get.class, Set.class))
                        .to(HardWorker.class)
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

## 实现

### HelloWorld

```java
public class HelloWorld {
    private String prefix = "AAA";

    public HelloWorld() {
    }

    public String test(String var1, int var2) {
        return (String)HardWorker.doWork(new HelloWorld$auxiliary$getter(this), new HelloWorld$auxiliary$setter(this));
    }

    private String test$original$hu0rO0Qj(String name, int age) {
        return String.format("%s: %s - %d", this.prefix, name, age);
    }

    final String prefix$accessor$Xxx() {
        return this.prefix;
    }

    final void prefix$accessor$Xxx(String var1) {
        this.prefix = var1;
    }
}
```

### getter

```java
class HelloWorld$auxiliary$getter implements Get {
    private final HelloWorld instance;

    HelloWorld$auxiliary$getter(HelloWorld var1) {
        this.instance = var1;
    }
    
    public Object get() {
        return this.instance.prefix$accessor$Xxx();
    }
}
```

### setter

```java
class HelloWorld$auxiliary$setter implements Set {
    private final HelloWorld instance;

    HelloWorld$auxiliary$setter(HelloWorld var1) {
        this.instance = var1;
    }
    
    public void set(Object var1) {
        this.instance.prefix$accessor$Xxx((String)var1);
    }
}
```
