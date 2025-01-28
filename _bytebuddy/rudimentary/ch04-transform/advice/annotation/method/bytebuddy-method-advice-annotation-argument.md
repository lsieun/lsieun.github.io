---
title: "@Advice.Argument"
sequence: "101"
---

## 介绍

### 作用

`@Advice.Argument` 作用：对『方法参数』进行映射。

```java

@Retention(RetentionPolicy.RUNTIME)
@java.lang.annotation.Target(ElementType.PARAMETER)
public @interface Argument {
    int value();

    boolean optional() default false;

    boolean readOnly() default true;

    Assigner.Typing typing() default Assigner.Typing.STATIC;
}
```

### 注意事项

- 起始索引；索引从 `0` 开始，`0` 表示第一个参数，`1` 表示第二个参数。

## 示例

### 不使用 Argument 注解

When no annotation is used,
this means the parameter are implicitly mapped to the parameter of functional code.

#### 预期目标

修改之前：

```java
public class HelloWorld {
    public void test(String name, int age) {
        System.out.println("Hello World");
    }
}
```

修改之后：

```java
public class HelloWorld {
    public String test(String name, int age, Date date) {
        System.out.println("name: " + name);
        System.out.println("age : " + age);
        System.out.println("date : " + date);
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

#### 编码实现

```java
import net.bytebuddy.asm.Advice;

import java.util.Date;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc(String name, int age, Date date) {
        System.out.println("name: " + name);
        System.out.println("age : " + age);
        System.out.println("date : " + date);
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.Advice;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        builder = builder.visit(
                Advice.to(Expert.class)
                        .on(ElementMatchers.named("test"))
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

#### 验证结果

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        String className = "sample.HelloWorld";
        InvokeUtils.invokeAllMethods(className);
    }
}
```

#### 注意事项

注意事项：要保证方法参数（method parameter）的顺序（order）和类型（type）是一致的。

正确示例：省略一个 `Date` 参数

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc(String name, int age) {
        System.out.println("name: " + name);
        System.out.println("age : " + age);
    }
}
```

错误示例：

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc(int age, String name) {
        System.out.println("name: " + name);
        System.out.println("age : " + age);
    }
}
```

### 读取参数值

```java
import java.util.Date;

public class HelloWorld {
    public String test(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

```java
import net.bytebuddy.asm.Advice;

import java.util.Arrays;
import java.util.Date;
import java.util.Formatter;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc(
            @Advice.This Object thisObj,
            @Advice.Argument(2) Date date,
            @Advice.Argument(1) int age,
            @Advice.Argument(0) String name,
            @Advice.AllArguments Object[] allArgs

    ) {
        StringBuilder sb = new StringBuilder();
        Formatter fm = new Formatter(sb);
        fm.format("@Advice.This        : %s%n", thisObj);
        fm.format("@Advice.Argument(0) : %s%n", name);
        fm.format("@Advice.Argument(1) : %s%n", age);
        fm.format("@Advice.Argument(2) : %s%n", date);
        fm.format("@Advice.AllArguments: %s%n", Arrays.toString(allArgs));
        System.out.println(sb);
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.Advice;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        builder = builder.visit(
                Advice.to(Expert.class)
                        .on(ElementMatchers.named("test"))
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        String className = "sample.HelloWorld";
        InvokeUtils.invokeAllMethods(className);
    }
}
```

结果示例：

```text
@Advice.This        : sample.HelloWorld@179d3b25
@Advice.Argument(0) : EbZOYtB1
@Advice.Argument(1) : 1
@Advice.Argument(2) : Wed Jul 12 15:12:01 CST 2023
@Advice.AllArguments: [EbZOYtB1, 1, Wed Jul 12 15:12:01 CST 2023]
```

### 修改参数值

```java
public class HelloWorld {
    public void test(String name, int age) {
        System.out.println("name: " + name);
        System.out.println("age : " + age);
    }
}
```

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc(
            @Advice.Argument(value = 0, readOnly = false) String paramNameValue,
            @Advice.Argument(value = 1, readOnly = false) int paramAgeValue
    ) {
        paramNameValue = "Jerry";
        paramAgeValue = 9;
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.Advice;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        builder = builder.visit(
                Advice.to(Expert.class)
                        .on(ElementMatchers.isMethod())
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        instance.test("Tom", 10);
    }
}
```

