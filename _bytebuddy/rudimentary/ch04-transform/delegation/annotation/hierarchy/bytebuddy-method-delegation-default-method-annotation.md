---
title: "@DefaultMethod"
sequence: "102"
---

## 介绍

@DefaultMethod: Similar to `@SuperMethod` but for a default method call.
The default method is invoked on a unique type if there is only one possibility for a default method invocation.

Otherwise, a type can be specified explicitly as an annotation property.

## 示例

### HardWorker

```java
import net.bytebuddy.implementation.bind.annotation.DefaultMethod;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

import java.lang.reflect.Method;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@DefaultMethod Method method) { // 注意：这里会出错
        return String.format(
                "@DefaultMethod: %s from %s",
                method.getName(),
                method.getDeclaringClass().getName()
        );
    }
}
```

```java
import net.bytebuddy.implementation.bind.annotation.DefaultMethod;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

import java.lang.reflect.Method;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@DefaultMethod(targetType = ICat.class) Method method) { // 解决：这里使用了 targetType 属性
        return String.format(
                "@DefaultMethod: %s from %s",
                method.getName(),
                method.getDeclaringClass().getName()
        );
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

### Result

```java
public class HelloWorld extends Father implements ICat, IDog {
    private static final Method cachedValue$Abc$TestMethod;

    static {
        cachedValue$Abc$TestMethod = HelloWorld.class.getDeclaredMethod(
                "test$accessor$Abc$Xyz",
                String.class,
                Integer.TYPE
        );
    }
    
    public void sayFromHelloWorld() {
        System.out.println("HelloWorld");
    }

    public String test(String name, int age) {
        return (String)HardWorker.doWork(cachedValue$Abc$TestMethod);
    }

    public final String test$accessor$Abc$Xyz(String name, int age) {
        return super.test(name, age);
    }
}
```

```text
> javap -v -p sample.HelloWorld

  public final java.lang.String test$accessor$Abc$Xyz(java.lang.String, int);
    descriptor: (Ljava/lang/String;I)Ljava/lang/String;
    flags: (0x0011) ACC_PUBLIC, ACC_FINAL
    Code:
      stack=3, locals=3, args_size=3
         0: aload_0
         1: aload_1
         2: iload_2
         3: invokespecial #61                 // InterfaceMethod ICat.test:(Ljava/lang/String;I)Ljava/lang/String;
         6: areturn

```

## 属性

### cached

```java
import net.bytebuddy.implementation.bind.annotation.DefaultMethod;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

import java.lang.reflect.Method;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@DefaultMethod(cached = false) Method method) {
        return String.format(
                "@DefaultMethod: %s from %s",
                method.getName(),
                method.getDeclaringClass().getName()
        );
    }
}
```

```java
public class HelloWorld implements IDog {
    public HelloWorld() {
    }

    public String test(String var1, int var2) {
        return (String)HardWorker.doWork(
                // 注意：每次都要调用
                HelloWorld.class.getDeclaredMethod("test$accessor$fQMnCHEb$nfun530", String.class, Integer.TYPE)
        );
    }

    private String test$original$hVlXf8yv(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }

    public final String test$accessor$fQMnCHEb$nfun530(String var1, int var2) {
        return super.test(var1, var2);
    }
}
```

### nullIfImpossible

```java
public interface IDog {
    String test(String name, int age);
}
```

```java
import net.bytebuddy.implementation.bind.annotation.DefaultMethod;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

import java.lang.reflect.Method;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@DefaultMethod(nullIfImpossible = true) Method method) {
        return String.format(
                "@DefaultMethod: %s from %s",
                method.getName(),
                method.getDeclaringClass().getName()
        );
    }
}
```

```java
public class HelloWorld implements IDog {
    public HelloWorld() {
    }

    public String test(String var1, int var2) {
        return (String)HardWorker.doWork((Method)null);
    }

    private String test$original$SiiUvc5j(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }
}
```

### targetType

```java
public interface IDog {
    default String test(String name, int age) {
        return String.format("Dog: %s - %d", name, age);
    }
}
```

```java
public interface ICat {
    default String test(String name, int age) {
        return String.format("Cat: %s - %d", name, age);
    }
}
```

```java
public class HelloWorld implements IDog, ICat {
    @Override
    public String test(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }
}
```

```java
import net.bytebuddy.implementation.bind.annotation.DefaultMethod;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

import java.lang.reflect.Method;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@DefaultMethod Method method) {
        return String.format(
                "@DefaultMethod: %s from %s",
                method.getName(),
                method.getDeclaringClass().getName()
        );
    }
}
```

遇到如下错误：

```text
java.lang.IllegalArgumentException: 
None of [
    public static Object HardWorker.doWork(Method)
] allows for delegation from 
public String HelloWorld.test(String,int)
```

原因：`IDog` 和 `ICat` 接口都提供了 `test` 方法的默认实现，ByteBuddy 不知道选择哪一个接口。

```java
import net.bytebuddy.implementation.bind.annotation.DefaultMethod;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

import java.lang.reflect.Method;

public class HardWorker {
    @RuntimeType
    public static Object doWork(
            // 注意：增加了 targetType 属性
            @DefaultMethod(targetType = ICat.class) Method method) {
        return String.format(
                "@DefaultMethod: %s from %s",
                method.getName(),
                method.getDeclaringClass().getName()
        );
    }
}
```

```java
public class HelloWorld implements IDog, ICat {
    private static final Method cachedValue$Jw3idcOR$9vqsug3;

    static {
        cachedValue$Jw3idcOR$9vqsug3 = HelloWorld.class.getDeclaredMethod(
                "test$accessor$Jw3idcOR$h4tn530", String.class, Integer.TYPE
        );
    }
    
    public HelloWorld() {
    }

    public String test(String var1, int var2) {
        return (String)HardWorker.doWork(cachedValue$Jw3idcOR$9vqsug3);
    }

    private String test$original$xiudtXl7(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }

    public final String test$accessor$Jw3idcOR$h4tn530(String var1, int var2) {
        return super.test(var1, var2);
    }
}
```

```text
> javap -v -p sample.HelloWorld

  public final java.lang.String test$accessor$Jw3idcOR$h4tn530(java.lang.String, int);
    descriptor: (Ljava/lang/String;I)Ljava/lang/String;
    flags: (0x0011) ACC_PUBLIC, ACC_FINAL
    Code:
      stack=3, locals=3, args_size=3
         0: aload_0
         1: aload_1
         2: iload_2
         3: invokespecial #61                 // InterfaceMethod sample/ICat.test:(Ljava/lang/String;I)Ljava/lang/String;
         6: areturn
```
