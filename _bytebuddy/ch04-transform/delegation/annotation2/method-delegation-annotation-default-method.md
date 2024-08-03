---
title: "@DefaultMethod"
sequence: "105"
---

## @DefaultMethod

@DefaultMethod: Similar to `@SuperMethod` but for a default method call.
The default method is invoked on a unique type if there is only one possibility for a default method invocation.

Otherwise, a type can be specified explicitly as an annotation property.

## 介绍

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.PARAMETER)
public @interface DefaultMethod {
    /**
     * Indicates if the instance assigned to this parameter should be stored in a static field for reuse.
     *
     * @return {@code true} if this method instance should be cached.
     */
    boolean cached() default true;

    /**
     * Indicates if the instance assigned to this parameter should be looked up using an {@code java.security.AccessController}.
     *
     * @return {@code true} if this method should be looked up using an {@code java.security.AccessController}.
     */
    boolean privileged() default false;

    /**
     * Specifies an explicit type that declares the default method to invoke.
     *
     * @return The type declaring the method to invoke or {@link TargetType} to indicate that the instrumented method declared the method.
     */
    Class<?> targetType() default void.class;

    /**
     * Indicates that {@code null} should be assigned to this parameter if no default method is invokable.
     *
     * @return {@code true} if {@code null} should be assigned if no valid method can be assigned.
     */
    boolean nullIfImpossible() default false;
}
```

## 示例

### IDog

```java
public interface IDog {
    default String test(String name, int age) {
        return String.format("Dog: %s - %d", name, age);
    }
}
```

### HelloWorld

```java
public class HelloWorld implements IDog {
    @Override
    public String test(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }
}
```

### HardWorker

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

### 修改

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
                MethodDelegation.to(HardWorker.class)
        );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

### 修改后

```java
public class HelloWorld implements IDog {
    private static final Method cachedValue$ycbz0r2z$5i67812;

    static {
        cachedValue$ycbz0r2z$5i67812 = HelloWorld.class.getDeclaredMethod(
                "test$accessor$ycbz0r2z$nfun530",
                String.class,
                Integer.TYPE
        );
    }
    
    public HelloWorld() {
    }

    public String test(String var1, int var2) {
        return (String)HardWorker.doWork(cachedValue$ycbz0r2z$5i67812);
    }

    private String test$original$8eCVsJpi(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }

    public final String test$accessor$ycbz0r2z$nfun530(String var1, int var2) {
        return super.test(var1, var2);
    }
}
```

```text
> javap -v -p sample.HelloWorld

  public final java.lang.String test$accessor$ycbz0r2z$nfun530(java.lang.String, int);
    descriptor: (Ljava/lang/String;I)Ljava/lang/String;
    flags: (0x0011) ACC_PUBLIC, ACC_FINAL
    Code:
      stack=3, locals=3, args_size=3
         0: aload_0
         1: aload_1
         2: iload_2
         3: invokespecial #59                 // InterfaceMethod sample/IDog.test:(Ljava/lang/String;I)Ljava/lang/String;
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
import sample.ICat;

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
