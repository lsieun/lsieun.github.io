---
title: "绑定优先级"
sequence: "104"
---

## 绑定优先级

But before we proceed, we want to take a more detailed look on how Byte Buddy **selects a target method**.

We already described how Byte Buddy resolves a most specific method
by comparing parameter types but there is more to it.

After Byte Buddy identified candidate methods
that qualified for a binding to a given source method,
it delegates the resolution to a chain of `AmbiguityResolver`s.

> candidate methods --> a chain of AmbiguityResolvers

Again, you are free to implement your own ambiguity resolvers
that can complement or even replace Byte Buddy's defaults.

Without such alterations, the **ambiguity resolver chain** attempts to identify **a unique target method**
by applying the following rules in the same order as below:

### 第一条规则：优先级

Methods can be assigned **an explicit priority** by annotating them with `@BindingPriority`.
If a method is of a higher priority than another method,
the high priority method is always preferred over that with lower priority.

In addition, a method that is annotated by `@IgnoreForBinding` is never considered as a target method.

```java
import net.bytebuddy.implementation.bind.annotation.BindingPriority;

import java.util.Date;

public class LazyWorker {
    @BindingPriority(value = 2)
    public static String testWithArg0() {
        return "testWithArg0";
    }

    public static String testWithArg1(String name) {
        return String.format("testWithArg1 - name: %s", name);
    }

    public static String testWithArg2(String name, int age) {
        return String.format("testWithArg2 - name: %s, age: %d", name, age);
    }

    public static String testWithArg3(String name, int age, Date date) {
        return String.format("testWithArg3 - name: %s, age: %d, date: %s", name, age, date);
    }
}
```

```java
import net.bytebuddy.implementation.bind.annotation.IgnoreForBinding;

import java.util.Date;

public class LazyWorker {
    public static String testWithArg0() {
        return "testWithArg0";
    }

    public static String testWithArg1(String name) {
        return String.format("testWithArg1 - name: %s", name);
    }

    public static String testWithArg2(String name, int age) {
        return String.format("testWithArg2 - name: %s, age: %d", name, age);
    }

    @IgnoreForBinding
    public static String testWithArg3(String name, int age, Date date) {
        return String.format("testWithArg3 - name: %s, age: %d, date: %s", name, age, date);
    }
}
```

### 第二条规则：名字匹配

If a **source method** and a **target method** have **an identical name**,
this target method is preferred over other target methods that have a different name.

> 名字匹配，也是优先级的一种

### 第三条规则：类型匹配

If two methods bind the same parameters of a source method by using `@Argument`,
the method with **the most specific parameter types** is considered.
In this context, it does not matter if an annotation is provided explicitly or implicitly by not annotating a parameter.
The resolution algorithm works similar to the Java compiler's algorithm for resolving calls to overloaded methods.

If two types are equally specific, **the method that binds more arguments** is considered as a target.

> 相同的参数数量越多，优先级越高

If a parameter should be assigned an argument **without considering the parameter type** at this resolution stage,
this is possible by setting the annotation's `bindingMechanic` attribute to `BindingMechanic.ANONYMOUS`.

Furthermore, note that **non-anonymous parameters** need to be unique per index value on each target method for the resolution algorithm to work.

### 第四条规则：数量

If a target method has more parameters than another target method, the former method is preferred over the latter.

## 示例

### 预期目标

```java
import java.util.Base64;
import java.util.Date;

public class HelloWorld {
    public String test(String name, int age, Date date) {
        String str = String.format("%s:%s:%s", name, age, date);
        byte[] bytes = str.getBytes();
        return Base64.getEncoder().encodeToString(bytes);
    }
}
```

```java
import sample.HelloWorld;

import java.util.Date;

public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        instance.test("Tom", 10, new Date());
    }
}
```

```java
import java.util.Date;

public class HardWorker {
    public static void test(String name, int age, Date date) {
        System.out.println("This is test Method");
    }

    public static void doWork(String name, int age, Date date) {
        System.out.println("This is doWork Method");
    }

    public static void play(String name, int age, Date date) {
        System.out.println("This is play Method");
    }
}
```

### 编码实现

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
        OutputUtils.save(unloadedType);
    }
}
```

### 遇到问题

```text
java.lang.IllegalArgumentException: 
Cannot resolve ambiguous delegation of public void sample.HelloWorld.test(java.lang.String,int,java.util.Date) to 
public static void lsieun.buddy.delegation.HardWorker.play(java.lang.String,int,java.util.Date) or 
public static void lsieun.buddy.delegation.HardWorker.doWork(java.lang.String,int,java.util.Date)
```

### 解决方法

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
                MethodDelegation.withDefaultConfiguration()
                        .filter(ElementMatchers.named("doWork"))
                        .to(HardWorker.class)

        );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 示例

注意事项：

- 第一点，要保证方法参数的顺序和类型兼容。

示例一（错误）：在开始位置，添加一个 `Object` 类型的参数，导致参数顺序变化，发生错误

```java
public class HardWorker {
    public static String doWork(Object obj, String name, int age) throws NoSuchAlgorithmException {
        // ...
    }
}
```

示例二（错误）：在结束位置，添加一个 `Object` 类型的参数，发生错误

```java
public class HardWorker {
    public static String doWork(String name, int age, Object obj) {
        // ...
    }
}
```

示例三（正确）：减去 `int` 类型的参数，正确

```java
public class HardWorker {
    public static String doWork(String name) {
        // ...
    }
}
```

示例四（正确）：将 `int` 类型变成 `long` 类型，正确

```java
public class HardWorker {
    public static String doWork(String name, long age) {
        // ...
    }
}
```

```java
public class HardWorker {
    public static void doWorkAbc(String name, int age) {
        System.out.println("This is doWorkAbc Method");
    }

    public static void doWorkXyz(String name, long age) {
        System.out.println("This is doWorkXyz Method");
    }
}
```

示例五（正确）：将 `String` 类型变成 `Object` 类型，正确

```java
public class HardWorker {
    public static String doWork(Object name, long age) {
        // ...
    }
}
```

- 第二点，尽量保证抛出异常（throws）是一致的。

```java
import java.security.NoSuchAlgorithmException;

public class HelloWorld {
    public String test(String name, int age) throws NoSuchAlgorithmException {
        return HardWorker.doWork(name, age);
    }
}
```

```java
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

public class HardWorker {
    public static String doWork(String name, int age) throws NoSuchAlgorithmException {
        String str = UUID.randomUUID().toString();
        byte[] bytes = str.getBytes(StandardCharsets.UTF_8);
        MessageDigest md = MessageDigest.getInstance("MD5");
        md.update(bytes);
        byte[] digest = md.digest();
        return HexUtils.toHex(digest);
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;

import java.security.NoSuchAlgorithmException;

public class HelloWorldGenerate {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", String.class, Visibility.PUBLIC)
                .withParameter(String.class, "name")
                .withParameter(int.class, "age")
                .throwing(NoSuchAlgorithmException.class)
                .intercept(
                        MethodDelegation.to(HardWorker.class)
                );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```java
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class HardWorker {
    public static String doWork(String name, long age) throws NoSuchAlgorithmException {
        String str = name + age;
        byte[] bytes = str.getBytes(StandardCharsets.UTF_8);

        MessageDigest md = MessageDigest.getInstance("MD5");
        md.update(bytes);
        byte[] digest = md.digest();

        return HexUtils.toHex(digest);
    }
}
```

- 第三点，避免出现参数完全一样的两个方法

```java
public class HardWorker {
    public static String doWork(String name, int age) {
        String str = UUID.randomUUID().toString();
        byte[] bytes = str.getBytes(StandardCharsets.UTF_8);
        byte[] encodedBytes = Base64.getEncoder().encode(bytes);
        return new String(encodedBytes, StandardCharsets.UTF_8);
    }

    public static String anotherWork(String abc, int val) {
        return abc + val;
    }
}
```

这个时候，ByteBuddy 就不知道要选择哪一个方法了，就会提示错误：

```text
java.lang.IllegalArgumentException: Cannot resolve ambiguous delegation of xxx
```
