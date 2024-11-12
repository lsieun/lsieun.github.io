---
title: "@DefaultCall"
sequence: "103"
---

As an equivalent to `@SuperCall`, Byte Buddy comes with a `@DefaultCall` annotation
which allows the invocation of a **default method** instead of calling **a method's super method**.

A method with this parameter annotation is only considered for binding
if the intercepted method is declared as **a default method by an interface**
that is directly implemented by the instrumented type.

Similarly, a `@SuperCall` annotation prevents a method's binding
if the instrumented method does not define **a non-abstract super method**.

## 示例

![](/assets/images/bytebuddy/uml/delegation/bytebuddy-method-delegation-default-call-annotation-callable-example.svg)

### HardWorker


```java
import net.bytebuddy.implementation.bind.annotation.DefaultCall;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

import java.util.concurrent.Callable;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@DefaultCall(targetType = IDog.class) Callable<String> executable) throws Exception {
        return executable.call();
    }
}
```

### Weaver

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz)
                .name(className);

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

### Generated

```java
public class HelloWorld extends Father implements ICat, IDog {
    public HelloWorld() {
    }

    public void sayFromHelloWorld() {
        System.out.println("HelloWorld");
    }

    public String test(String name, int age) {
        return (String)HardWorker.doWork(new HelloWorld$auxiliary$Proxy(this, name, age));
    }

    final String test$accessor$Abc$Xyz(String name, int age) {
        return IDog.super.test(name, age);
    }
}
```

```java
class HelloWorld$auxiliary$Proxy implements Runnable, Callable {
    private HelloWorld target;
    private String name;
    private int age;

    HelloWorld$auxiliary$Proxy(HelloWorld target, String name, int age) {
        this.target = target;
        this.name = name;
        this.age = age;
    }

    public Object call() throws Exception {
        return this.target.test$accessor$Abc$Xyz(this.name, this.age);
    }

    public void run() {
        this.target.test$accessor$Abc$Xyz(this.name, this.age);
    }
}
```

## 多个 Default Method

If you however want to invoke a default method on a specific type,
you can specify the `@DefaultCall`'s `targetType` property with a specific interface.

```java
import java.util.Date;

public interface ICat {
    default String test(String name, int age, Date date) {
        return String.format("Cat: %s - %d - %s", name, age, date);
    }
}
```

```java
import java.util.Date;

public class HelloWorld implements IDog, ICat {
    public String test(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

```java
import net.bytebuddy.implementation.bind.annotation.DefaultCall;

import java.util.concurrent.Callable;

public class LazyWorker {
    public static String test(@DefaultCall Callable<String> executable) throws Exception {
        String message = executable.call();
        return "message from LazyWorker: " + message;
    }
}
```

```text
Exception in thread "main" java.lang.IllegalArgumentException:
None of [public static java.lang.String lsieun.buddy.delegation.LazyWorker.test(java.util.concurrent.Callable) throws java.lang.Exception]
 allows for delegation from public java.lang.String sample.HelloWorld.test(java.lang.String,int,java.util.Date)
```

```java
import net.bytebuddy.implementation.bind.annotation.DefaultCall;

import java.util.concurrent.Callable;

public class LazyWorker {
    public static String test(@DefaultCall(targetType = ICat.class) Callable<String> executable) throws Exception {
        String message = executable.call();
        return "message from LazyWorker: " + message;
    }
}
```

```text
> javap -v -p sample.HelloWorld

  final java.lang.String test$accessor$1Sqa6Hkq$h4tn530(java.lang.String, int, java.util.Date);
    descriptor: (Ljava/lang/String;ILjava/util/Date;)Ljava/lang/String;
    flags: (0x0010) ACC_FINAL
    Code:
      stack=4, locals=4, args_size=4
         0: aload_0
         1: aload_1
         2: iload_2
         3: aload_3
         4: invokespecial #51                 // InterfaceMethod sample/ICat.test:(Ljava/lang/String;ILjava/util/Date;)Ljava/lang/String;
         7: areturn

```

## 不匹配的情况

With this specification, Byte Buddy injects a proxy instance
which invokes the given interface type's **default method**, if such a method exists.
Otherwise, the target method with the parameter annotation is not considered as a delegation target.

