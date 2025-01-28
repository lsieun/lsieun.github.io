---
title: "@Argument"
sequence: "101"
---

## 介绍

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.PARAMETER)
public @interface Argument {
    /**
     * The index of the parameter of the source method that should be bound to this parameter.
     *
     * @return The required parameter index.
     */
    int value();
}
```

其中，`value` 是从 `0` 开始，`0` 表示第一个参数，`1` 表示第二个参数，依此类推。

![](/assets/images/bytebuddy/delegation/bytebuddy-method-delegation-annotation-argument-example.png)

## 示例

### 预期目标

有一个 `HelloWorld` 类如下：

```java
import java.util.Date;

public class HelloWorld {
    public String test(String name, int age, Date date) {
        return name + " " + age + " " + date;
    }
}
```

预期目标：

```java
import java.util.Date;

public class HelloWorld {
    public String test(String name, int age, Date date) {
        return HardWorker.doWork(name, age, date);
    }
}
```

### 代理类

```java
import net.bytebuddy.implementation.bind.annotation.Argument;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

import java.util.Date;
import java.util.Formatter;

public class HardWorker {
    @RuntimeType
    public static String doWork(@Argument(0) String name,
                                @Argument(1) int age,
                                @Argument(2) Date date) {
        StringBuilder sb = new StringBuilder();
        Formatter fm = new Formatter(sb);
        fm.format("Name    : %s%n", name);
        fm.format("Age     : %s%n", age);
        fm.format("Date    : %s%n", date);
        return sb.toString();
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

## 注意事项

### 无注解

第 1 种情况，没有 `@Argument` 注解，完全相同的参数（**数量相同**、**类型相同**、**顺序相同**）：

```java
import java.util.Date;
import java.util.Formatter;

public class HardWorker {
    // 成功
    public static String doWork(String name, int age, Date date) {
        StringBuilder sb = new StringBuilder();
        Formatter fm = new Formatter(sb);
        fm.format("Name    : %s%n", name);
        fm.format("Age     : %s%n", age);
        fm.format("Date    : %s%n", date);
        return sb.toString();
    }
}
```

### 数量不同

第 2 种情况，没有 `@Argument` 注解，**类型相同、顺序相同、但数量不同**：

```java
import java.util.Formatter;

public class HardWorker {
    // 成功
    public static String doWork(String name, int age) {
        StringBuilder sb = new StringBuilder();
        Formatter fm = new Formatter(sb);
        fm.format("Name    : %s%n", name);
        fm.format("Age     : %s%n", age);
        return sb.toString();
    }
}
```

### 类型兼容

第 3 种情况，没有 `@Argument` 注解，**类型兼容**：

```java
import java.util.Date;
import java.util.Formatter;

public class HardWorker {
    // 成功：由 String 类型变成 Object 类型
    public static String doWork(Object name, int age, Date date) {
        StringBuilder sb = new StringBuilder();
        Formatter fm = new Formatter(sb);
        fm.format("Name    : %s%n", name);
        fm.format("Age     : %s%n", age);
        fm.format("Date    : %s%n", date);
        return sb.toString();
    }
}
```

### 类型不兼容

第 4 种情况，没有 `@Argument` 注解，**类型不兼容**：

```java
import java.util.Date;
import java.util.Formatter;

public class HardWorker {
    // 失败：String 类型不能转换成 Number 类型
    public static String doWork(Number name, int age, Date date) {
        StringBuilder sb = new StringBuilder();
        Formatter fm = new Formatter(sb);
        fm.format("Name    : %s%n", name);
        fm.format("Age     : %s%n", age);
        fm.format("Date    : %s%n", date);
        return sb.toString();
    }
}
```
