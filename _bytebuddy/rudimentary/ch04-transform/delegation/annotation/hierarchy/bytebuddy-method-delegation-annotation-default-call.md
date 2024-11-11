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

## 示例 @DefaultCall

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

> 使用 `subclass` 的时候出错了

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
import net.bytebuddy.implementation.bind.annotation.DefaultCall;

import java.util.concurrent.Callable;

public class LazyWorker {
    public static String test(@DefaultCall Callable<String> executable) throws Exception {
        String message = executable.call();
        return "message from LazyWorker: " + message;
    }
}
```

```java
public class HelloWorld implements IDog {
    public String test(String var1, int var2, Date var3) {
        return LazyWorker.test(new HelloWorld$auxiliary$7vCOs2ky(this, var1, var2, var3));
    }

    private String test$original$93HeMPVQ(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }

    final String test$accessor$0vwhdfS6$nfun530(String var1, int var2, Date var3) {
        return super.test(var1, var2, var3);
    }
}
```

```java
class HelloWorld$auxiliary$7vCOs2ky implements Runnable, Callable {
    private HelloWorld argument0;
    private String argument1;
    private int argument2;
    private Date argument3;

    public Object call() throws Exception {
        return this.argument0.test$accessor$0vwhdfS6$nfun530(this.argument1, this.argument2, this.argument3);
    }

    public void run() {
        this.argument0.test$accessor$0vwhdfS6$nfun530(this.argument1, this.argument2, this.argument3);
    }

    HelloWorld$auxiliary$7vCOs2ky(HelloWorld var1, String var2, int var3, Date var4) {
        this.argument0 = var1;
        this.argument1 = var2;
        this.argument2 = var3;
        this.argument3 = var4;
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

