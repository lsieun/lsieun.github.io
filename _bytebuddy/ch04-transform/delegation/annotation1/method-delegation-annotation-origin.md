---
title: "@Origin"
sequence: "105"
---

## 基础代码

```java
import java.util.Date;

public class HelloWorld {
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

## 不同的 Origin 类型

### Class

```java
import net.bytebuddy.implementation.bind.annotation.Origin;

public class LazyWorker {
    public static String test(@Origin Class<?> clazz) {
        System.out.println("@Origin: " + clazz.getName());
        return "message from LazyWorker";
    }
}
```

输出结果：

```text
@Origin: sample.HelloWorld
message from LazyWorker
```

```java
public class HelloWorld {
    public String test(String var1, int var2, Date var3) {
        return LazyWorker.test(HelloWorld.class);
    }

    private String test$original$eomJKM5U(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

### Method

```java
import net.bytebuddy.implementation.bind.annotation.Origin;

import java.lang.reflect.Method;

public class LazyWorker {
    public static String test(@Origin Method method) {
        System.out.println("@Origin: " + method.getName() + " from " + method.getDeclaringClass().getName());
        return "message from LazyWorker";
    }
}
```

输出结果：

```text
@Origin: test from sample.HelloWorld
message from LazyWorker
```

```java
public class HelloWorld {
    private static final Method cachedValue$test$Method;

    static {
        cachedValue$test$Method = HelloWorld.class.getMethod("test", String.class, Integer.TYPE, Date.class);
    }

    public String test(String var1, int var2, Date var3) {
        return LazyWorker.test(cachedValue$test$Method);
    }

    private String test$original$vv9i5HRr(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

### Constructor

```java
import net.bytebuddy.implementation.bind.annotation.Origin;

import java.lang.reflect.Constructor;

public class LazyWorker {
    public static String test(@Origin Constructor<?> constructor) {
        System.out.println("@Origin: " + constructor.getName() + " from " + constructor.getDeclaringClass().getName());
        return "message from LazyWorker";
    }
}
```

出现错误：

```text
Exception in thread "main" java.lang.IllegalArgumentException:
None of [public static java.lang.String lsieun.buddy.delegation.LazyWorker.test(java.lang.reflect.Constructor)]
allows for delegation from
public java.lang.String sample.HelloWorld.test(java.lang.String,int,java.util.Date)
```

```text
builder = builder.method(
        ElementMatchers.isDefaultConstructor()
).intercept(
        MethodDelegation.to(LazyWorker.class)
);
```

### Executable

```java
import net.bytebuddy.implementation.bind.annotation.Origin;

import java.lang.reflect.Executable;

public class LazyWorker {
    public static String test(@Origin Executable executable) {
        System.out.println("@Origin: " + executable.getName() + " from " + executable.getDeclaringClass().getName());
        return "message from LazyWorker";
    }
}
```

输出结果：

```text
@Origin: test from sample.HelloWorld
message from LazyWorker
```

```Java
public class HelloWorld {
    private static final Method cachedValue$test$Method;

    static {
        cachedValue$test$Method = HelloWorld.class.getMethod("test", String.class, Integer.TYPE, Date.class);
    }

    public String test(String var1, int var2, Date var3) {
        return LazyWorker.test(cachedValue$test$Method);
    }

    private String test$original$W7AuqwQb(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

### MethodHandle

```java
import net.bytebuddy.implementation.bind.annotation.Origin;

import java.lang.invoke.MethodHandle;

public class LazyWorker {
    public static String test(@Origin MethodHandle methodHandle) {
        System.out.println("@Origin MethodHandle: " + methodHandle);
        return "message from LazyWorker";
    }
}
```

输出结果：

```text
@Origin MethodHandle: MethodHandle(HelloWorld,String,int,Date)String
message from LazyWorker
```

生成的 `HelloWorld.class` 文件：

```java
public class HelloWorld {
    public String test(String var1, int var2, Date var3) {
        return LazyWorker.test("test");
    }

    private String test$original$yPGgsdmk(String name, int age, Date date) {
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
         2: invokestatic  #21                 // Method lsieun/buddy/delegation/LazyWorker.test:(Ljava/lang/invoke/MethodHandle;)Ljava/lang/String;
         5: areturn

```

### MethodType

```java
import net.bytebuddy.implementation.bind.annotation.Origin;

import java.lang.invoke.MethodType;

public class LazyWorker {
    public static String test(@Origin MethodType methodType) {
        System.out.println("@Origin MethodType: " + methodType);
        return "message from LazyWorker";
    }
}
```

输出结果：

```text
@Origin MethodType: (HelloWorld,String,int,Date)String
message from LazyWorker
```

生成的 `HelloWorld.class` 文件：

```java
public class HelloWorld {
    public String test(String param1, int param2, Date param3) {
        // $FF: Couldn't be decompiled
    }

    private String test$original$fyuJPwLJ(String name, int age, Date date) {
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
         2: invokestatic  #20                 // Method lsieun/buddy/delegation/LazyWorker.test:(Ljava/lang/invoke/MethodType;)Ljava/lang/String;
         5: areturn

```

### String

If the annotated parameter is a `String`,
the parameter is assigned the value that the Method's `toString` method would have returned.

```java
import net.bytebuddy.implementation.bind.annotation.Origin;

public class LazyWorker {
    public static String test(@Origin String methodDesc) {
        System.out.println("@Origin String: " + methodDesc);
        return "message from LazyWorker";
    }
}
```

输出结果：

```text
@Origin String: public java.lang.String sample.HelloWorld.test(java.lang.String,int,java.util.Date)
message from LazyWorker
```

生成的 `HelloWorld.class` 文件：

```java
public class HelloWorld {
    public String test(String var1, int var2, Date var3) {
        return LazyWorker.test("public java.lang.String sample.HelloWorld.test(java.lang.String,int,java.util.Date)");
    }

    private String test$original$9BFsLHXf(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

### int

When using the `@Origin` annotation on a parameter of type `int`, it is assigned the **modifier** of the instrumented method.

```java
import net.bytebuddy.implementation.bind.annotation.Origin;

import java.lang.reflect.Modifier;

public class LazyWorker {
    public static String test(@Origin int modifier) {
        System.out.println("@Origin int: " + modifier + " = " + Modifier.toString(modifier));
        return "message from LazyWorker";
    }
}
```

输出结果：

```text
@Origin int: 1 = public
message from LazyWorker
```

生成的 `HelloWorld.class` 文件：

```java
public class HelloWorld {
    public String test(String var1, int var2, Date var3) {
        return LazyWorker.test(1);
    }

    private String test$original$yROrq9Xd(String name, int age, Date date) {
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



