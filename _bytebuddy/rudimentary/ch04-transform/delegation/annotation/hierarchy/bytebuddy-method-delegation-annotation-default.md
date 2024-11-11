---
title: "@Default"
sequence: "101"
---

## 介绍

Obviously, default method invocation is only available for classes
that are defined in a class file version equal to Java 8 or newer.

Similarly, in addition to the `@Super` annotation,
there is a `@Default` annotation which injects a proxy for invoking a specific default method explicitly.

## 示例 @Default

### IDog

```java
import java.util.Date;

public interface IDog {
    default String test(String name, int age, Date date) {
        return String.format("Dog: %s - %d - %s", name, age, date);
    }
}
```

### HelloWorld

```java
import java.util.Date;

public class HelloWorld implements IDog {
    public String test(String name, int age, Date date) {
        return String.format("HelloWorld: %s - %d - %s", name, age, date);
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

### 代理类

```java
import net.bytebuddy.implementation.bind.annotation.Argument;
import net.bytebuddy.implementation.bind.annotation.Default;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

import java.util.Date;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Default IDog instance,
                                @Argument(0) String name,
                                @Argument(1) int age,
                                @Argument(2) Date date) {
        return instance.test(name, age, date);
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

### 修改之后

```java
public class HelloWorld implements IDog {
    public HelloWorld() {
    }

    public String test(String var1, int var2, Date var3) {
        auxiliary.4YSbr1ac var10000 = new auxiliary.4YSbr1ac();
        var10000.target = this;
        return (String)HardWorker.doWork(var10000, var1, var2, var3);
    }

    private String test$original$a6rt9fui(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }

    final String test$accessor$FUIy016Y$nfun530(String var1, int var2, Date var3) {
        return super.test(var1, var2, var3);
    }
}
```

```text
> javap -v -p sample.HelloWorld

  final java.lang.String test$accessor$FUIy016Y$nfun530(java.lang.String, int, java.util.Date);
    descriptor: (Ljava/lang/String;ILjava/util/Date;)Ljava/lang/String;
    flags: (0x0010) ACC_FINAL
    Code:
      stack=4, locals=4, args_size=4
         0: aload_0
         1: aload_1
         2: iload_2
         3: aload_3
         4: invokespecial #51                 // InterfaceMethod sample/IDog.test:(Ljava/lang/String;ILjava/util/Date;)Ljava/lang/String;
         7: areturn

```

```java
class HelloWorld$auxiliary$4YSbr1ac implements IDog {
    public volatile HelloWorld target;

    static HelloWorld$auxiliary$4YSbr1ac make() {
        return (HelloWorld$auxiliary$4YSbr1ac)ReflectionFactory.getReflectionFactory().newConstructorForSerialization(
                HelloWorld$auxiliary$4YSbr1ac.class,
                Object.class.getDeclaredConstructor()
        ).newInstance();
    }

    // --------------------------- HelloWorld ---------------------------
    public String test(String var1, int var2, Date var3) {
        return this.target.test$accessor$FUIy016Y$nfun530(var1, var2, var3);
    }

    // --------------------------- Object ---------------------------
    public boolean equals(Object var1) {
        throw new AbstractMethodError();
    }

    public String toString() {
        throw new AbstractMethodError();
    }

    public int hashCode() {
        throw new AbstractMethodError();
    }

    protected Object clone() throws CloneNotSupportedException {
        throw new AbstractMethodError();
    }
}
```

输出：

```text
Dog: Tom - 10 - Sun Jul 21 23:07:46 CST 2024
```

## 属性

### serializableProxy

```java
import net.bytebuddy.implementation.bind.annotation.Argument;
import net.bytebuddy.implementation.bind.annotation.Default;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

import java.util.Date;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Default(serializableProxy = true) IDog dog,
                                @Argument(0) String name,
                                @Argument(1) int age,
                                @Argument(2) Date date) {
        return dog.test(name, age, date);
    }
}
```

```java
class HelloWorld$auxiliary$b4i7qysC implements IDog, Serializable {
}
```

### proxyType

```java
import java.util.Date;

public interface IAnimal {
    String test(String name, int age, Date date);
}
```

```java
import net.bytebuddy.implementation.bind.annotation.Argument;
import net.bytebuddy.implementation.bind.annotation.Default;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

import java.util.Date;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Default(proxyType = IDog.class) IAnimal instance,
                                @Argument(0) String name,
                                @Argument(1) int age,
                                @Argument(2) Date date) {
        return instance.test(name, age, date);
    }
}
```

```java
class HelloWorld$auxiliary$IeCgAxel implements IDog {
}
```

## 注意事项

### 类型要求

`@Default Xxx` 对于类型有一定的要求：

- `Xxx` 不能使用父类，只能使用接口
- 接口，只能是直接实现的接口，不能是间接实现的接口


```java
import java.util.Date;

public class Parent {
    public String test(String name, int age, Date date) {
        return String.format("Parent: %s - %d - %s", name, age, date);
    }
}
```

```java
public interface IAnimal {
    default String test(String name, int age, Date date) {
        return String.format("Animal: %s - %d - %s", name, age, date);
    }
}
```

```java
import java.util.Date;

public interface IDog extends IAnimal {
    default String test(String name, int age, Date date) {
        return String.format("Dog: %s - %d - %s", name, age, date);
    }
}
```

```java
import java.util.Date;

public interface ICat extends IAnimal {
    default String test(String name, int age, Date date) {
        return String.format("Cat: %s - %d - %s", name, age, date);
    }
}
```

```java
import java.util.Date;

public class HelloWorld extends Parent implements IDog, ICat {
    public String test(String name, int age, Date date) {
        return String.format("HelloWorld: %s - %d - %s", name, age, date);
    }
}
```

```java
import net.bytebuddy.implementation.bind.annotation.Argument;
import net.bytebuddy.implementation.bind.annotation.Default;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

import java.util.Date;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Default Parent instance,    // 注意：这里使用 Parent 类型
                                @Argument(0) String name,
                                @Argument(1) int age,
                                @Argument(2) Date date) {
        return instance.test(name, age, date);
    }
}
```

遇到错误：

```text
sample.Parent arg0 uses the @Default annotation on an invalid type
```

`@Default IAnimal instance` 也不可以


