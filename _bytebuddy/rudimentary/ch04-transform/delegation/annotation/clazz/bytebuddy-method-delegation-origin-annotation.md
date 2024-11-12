---
title: "@Origin"
sequence: "101"
---

## 介绍

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.PARAMETER)
public @interface Origin {
    /**
     * Determines if the value that is assigned by this annotation is cached.
     * For values that can be stored in the constant pool,
     * this value is ignored as such values are cached implicitly.
     * As a result, this value currently only affects caching of {@link Method} instances.
     *
     * @return {@code true} if the value for this parameter should be cached
     * in a {@code static} field inside the instrumented class.
     */
    boolean cache() default true;

    /**
     * Determines if the method should be resolved by using an {@code java.security.AccessController} using the privileges of the generated class.
     * Doing so requires the generation of an auxiliary class that implements {@code java.security.PrivilegedExceptionAction}.
     *
     * @return {@code true} if the class should be looked up using an {@code java.security.AccessController}.
     */
    boolean privileged() default false;
}
```

`@Origin` 可以与**不同的类型**进行搭配：

```text
           ┌─── Class
           │
           ├─── Method, Constructor, Executable
@Origin ───┤
           ├─── String, int
           │
           └─── MethodHandle, MethodType, Lookup (Java 7)
```

## 示例

### HelloWorld

```java
import java.util.Date;

public class HelloWorld {
    public String test(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

### 运行

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

### 修改

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
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
                MethodDelegation.to(HardWorker.class)
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

### 代理类

#### Class

```java
import net.bytebuddy.implementation.bind.annotation.Origin;

public class HardWorker {
    public static String doWork(@Origin Class<?> clazz) {
        return String.format("@Origin: %s", clazz.getName());
    }
}
```

输出：

```text
@Origin: sample.HelloWorld
```

```java
public class HelloWorld {
    public String test(String var1, int var2, Date var3) {
        return HardWorker.doWork(HelloWorld.class);
    }

    private String test$original$7WlQkiy0(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

#### Method

```java
import net.bytebuddy.implementation.bind.annotation.Origin;

import java.lang.reflect.Method;

public class HardWorker {
    public static String doWork(@Origin Method method) {
        return String.format(
                "@Origin: %s from %s",
                method.getName(),
                method.getDeclaringClass().getName()
        );
    }
}
```

输出：

```text
@Origin: test from sample.HelloWorld
```

```java
public class HelloWorld {
    private static final Method cachedValue$7we0J5yN$rhudac1;

    static {
        cachedValue$7we0J5yN$rhudac1 = HelloWorld.class.getMethod("test", String.class, Integer.TYPE, Date.class);
    }

    public String test(String var1, int var2, Date var3) {
        return HardWorker.doWork(cachedValue$7we0J5yN$rhudac1);
    }

    private String test$original$Rmh3ARNB(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

#### Constructor （没有成功）

```java
import net.bytebuddy.implementation.bind.annotation.Origin;

import java.lang.reflect.Constructor;

public class HardWorker {
    public static String doWork(@Origin Constructor<?> constructor) {
        return String.format(
                "@Origin: %s from %s",
                constructor.getName(),
                constructor.getDeclaringClass().getName()
        );
    }
}
```

出现错误：

```text
None of [
    public static String HardWorker.doWork(Constructor)
] allows for delegation from 
    public String HelloWorld.test(String,int,Date)
```

```text
builder = builder.method(
        // 注意：这里进行了修改
        ElementMatchers.isDefaultConstructor()
).intercept(
        MethodDelegation.to(HardWorker.class)
);
```

#### Executable

```java
import net.bytebuddy.implementation.bind.annotation.Origin;

import java.lang.reflect.Executable;

public class HardWorker {
    public static String doWork(@Origin Executable executable) {
        return String.format(
                "@Origin: %s from %s",
                executable.getName(),
                executable.getDeclaringClass().getName()
        );
    }
}
```

输出结果：

```text
@Origin: test from sample.HelloWorld
```

```Java
public class HelloWorld {
    private static final Method cachedValue$nrdO0gma$rhudac1;

    static {
        cachedValue$nrdO0gma$rhudac1 = HelloWorld.class.getMethod("test", String.class, Integer.TYPE, Date.class);
    }

    public String test(String var1, int var2, Date var3) {
        return HardWorker.doWork(cachedValue$nrdO0gma$rhudac1);
    }

    private String test$original$hpjCDSqG(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

#### String

If the annotated parameter is a `String`,
the parameter is assigned the value that the Method's `toString` method would have returned.

```java
import net.bytebuddy.implementation.bind.annotation.Origin;

public class HardWorker {
    public static String doWork(@Origin String methodStr) {
        return String.format("@Origin String: %s", methodStr);
    }
}
```

输出结果：

```text
@Origin String: public java.lang.String sample.HelloWorld.test(java.lang.String,int,java.util.Date)
```

生成的 `HelloWorld.class` 文件：

```java
public class HelloWorld {
    public String test(String var1, int var2, Date var3) {
        return HardWorker.doWork("public java.lang.String sample.HelloWorld.test(java.lang.String,int,java.util.Date)");
    }

    private String test$original$yPF1Ol3M(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

#### int

When using the `@Origin` annotation on a parameter of type `int`, it is assigned the **modifier** of the instrumented method.

```java
import net.bytebuddy.implementation.bind.annotation.Origin;

import java.lang.reflect.Modifier;

public class HardWorker {
    public static String doWork(@Origin int modifier) {
        return String.format("@Origin int: %d (%s)", modifier, Modifier.toString(modifier));
    }
}
```

输出结果：

```text
@Origin int: 1 (public)
```

生成的 `HelloWorld.class` 文件：

```java
public class HelloWorld {
    public String test(String var1, int var2, Date var3) {
        return HardWorker.doWork(1);
    }

    private String test$original$kdL3DIUs(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

#### MethodHandle

```java
import net.bytebuddy.implementation.bind.annotation.Origin;

import java.lang.invoke.MethodHandle;

public class HardWorker {
    public static String doWork(@Origin MethodHandle methodHandle) {
        return String.format("@Origin MethodHandle: %s", methodHandle);
    }
}
```

输出结果：

```text
@Origin MethodHandle: MethodHandle(HelloWorld,String,int,Date)String
```

生成的 `HelloWorld.class` 文件：

```java
public class HelloWorld {
    public String test(String var1, int var2, Date var3) {
        return HardWorker.doWork("test");
    }

    private String test$original$D6lwihQ6(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

使用 `javap` 命令查看：

```text
$ javap -v -p sample.HelloWorld

  public java.lang.String test(java.lang.String, int, java.util.Date);
    descriptor: (Ljava/lang/String;ILjava/util/Date;)Ljava/lang/String;
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=1, locals=4, args_size=4
         0: ldc           #16                 // MethodHandle REF_invokeVirtual sample/HelloWorld.test:(Ljava/lang/String;ILjava/util/Date;)Ljava/lang/String;
         2: invokestatic  #22                 // Method lsieun/buddy/delegation/HardWorker.doWork:(Ljava/lang/invoke/MethodHandle;)Ljava/lang/String;
         5: areturn

```

#### MethodType

```java
import net.bytebuddy.implementation.bind.annotation.Origin;

import java.lang.invoke.MethodType;

public class HardWorker {
    public static String doWork(@Origin MethodType methodType) {
        return String.format("@Origin MethodType: %s", methodType);
    }
}
```

输出：

```text
@Origin MethodType: (HelloWorld,String,int,Date)String
```

生成的 `HelloWorld.class` 文件：

```java
public class HelloWorld {
    public String test(String param1, int param2, Date param3) {
        // $FF: Couldn't be decompiled
    }

    private String test$original$3nnK1Dwv(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

使用 `javap` 命令查看：

```text
$ javap -v -p sample.HelloWorld

  public java.lang.String test(java.lang.String, int, java.util.Date);
    descriptor: (Ljava/lang/String;ILjava/util/Date;)Ljava/lang/String;
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=1, locals=4, args_size=4
         0: ldc           #15                 // MethodType (Lsample/HelloWorld;Ljava/lang/String;ILjava/util/Date;)Ljava/lang/String;
         2: invokestatic  #21                 // Method lsieun/buddy/delegation/HardWorker.doWork:(Ljava/lang/invoke/MethodType;)Ljava/lang/String;
         5: areturn

```

#### MethodHandles.Lookup

```java
import net.bytebuddy.implementation.bind.annotation.Origin;

import java.lang.invoke.MethodHandles;

public class HardWorker {
    public static String doWork(@Origin MethodHandles.Lookup lookup) {
        return String.format("@Origin MethodHandles.Lookup: %s", lookup);
    }
}
```

输出：

```text
@Origin MethodHandles.Lookup: sample.HelloWorld
```

```java
public class HelloWorld {
    public String test(String var1, int var2, Date var3) {
        return HardWorker.doWork(MethodHandles.lookup());
    }

    private String test$original$zofkGVqV(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

## 总结

### String vs. Method

In general, we recommend the use of these `String` values as method identifiers wherever possible and
discourage the use of `Method` objects as their lookup introduces a significant runtime overhead.

推荐使用 `String` 类型，而不推荐使用 `Method` 类型。因为 `Method` 类型查找会造成运行时候的性能（runtime overhead）。

To avoid this overhead, the `@Origin` annotation also offers a property for caching such instances for reuse.

### MethodHandle + MethodType

Note that the `MethodHandle` and `MethodType` are stored in a class's constant pool
such that classes using these constants must at least be of Java version 7.

### @Pipe

Instead of using reflection for reflectively invoking an intercepted method on another object,
we furthermore recommend the use of the `@Pipe` annotation.

### cache

```java
import java.lang.reflect.Method;

public class HardWorker {
    public static String doWork(@Origin(cache = false) Method method) {
        return String.format(
                "@Origin: %s from %s",
                method.getName(),
                method.getDeclaringClass().getName()
        );
    }
}
```

```java
public class HelloWorld {
    public String test(String var1, int var2, Date var3) {
        return HardWorker.doWork(HelloWorld.class.getMethod("test", String.class, Integer.TYPE, Date.class));
    }

    private String test$original$jSdvF8uK(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

### privileged

```java
import java.lang.reflect.Method;

public class HardWorker {
    public static String doWork(@Origin(privileged = true) Method method) {
        return String.format(
                "@Origin: %s from %s",
                method.getName(),
                method.getDeclaringClass().getName()
        );
    }
}
```

```java
public class HelloWorld {
    private static final Method cachedValue$jPX5LP1Z$rhudac1;

    static {
        cachedValue$jPX5LP1Z$rhudac1 = (Method)AccessController.doPrivileged(
                new HelloWorld$auxiliary$OzsoOscE(HelloWorld.class, "test", new Class[]{String.class, Integer.TYPE, Date.class})
        );
    }

    public String test(String var1, int var2, Date var3) {
        return HardWorker.doWork(cachedValue$jPX5LP1Z$rhudac1);
    }

    private String test$original$S1c2rAMm(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

```java
class HelloWorld$auxiliary$OzsoOscE implements PrivilegedExceptionAction {
    private Class type;
    private String name;
    private Class[] parameters;

    public Object run() throws Exception {
        return this.type.getMethod(this.name, this.parameters);
    }

    public HelloWorld$auxiliary$OzsoOscE(Class var1, String var2, Class[] var3) {
        this.type = var1;
        this.name = var2;
        this.parameters = var3;
    }
}
```
