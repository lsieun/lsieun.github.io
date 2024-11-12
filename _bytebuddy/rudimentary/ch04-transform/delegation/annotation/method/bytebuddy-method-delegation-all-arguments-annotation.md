---
title: "@AllArguments"
sequence: "102"
---

## 介绍

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.PARAMETER)
public @interface AllArguments {
    /**
     * Defines the type of {@link net.bytebuddy.implementation.bind.annotation.AllArguments.Assignment}
     * type that is applied for filling the annotated array with values.
     *
     * @return The assignment handling to be applied for the annotated parameter.
     */
    Assignment value() default Assignment.STRICT;

    /**
     * Determines if the array should contain the instance that defines the intercepted value when intercepting
     * a non-static method.
     *
     * @return {@code true} if the instance on which the intercepted method should be invoked should be
     * included in the array containing the arguments.
     */
    boolean includeSelf() default false;

    /**
     * Determines if a {@code null} value should be assigned if the instrumented method does not declare any parameters.
     *
     * @return {@code true} if a {@code null} value should be assigned if the instrumented method does not declare any parameters.
     */
    boolean nullIfEmpty() default false;
}
```

![](/assets/images/bytebuddy/delegation/bytebuddy-method-delegation-annotation-all-arguments-example.png)


## 示例

### 预期目标

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
        return HardWorker.doWork(new Object[]{name, age, date});
    }
}
```

### 代理类

```java
import net.bytebuddy.implementation.bind.annotation.AllArguments;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

import java.util.Arrays;

public class HardWorker {
    @RuntimeType
    public static String doWork(@AllArguments Object[] allArgs) {
        return "AllArgs : " + Arrays.toString(allArgs);
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

## 注解属性

### value

- `AllArguments.Assignment.STRICT`：尝试包含所有的参数；如果存在类型不兼容，
- `AllArguments.Assignment.SLACK`：会忽略掉不兼容的类型

```java
import java.util.Date;

public class HelloWorld {
    public String test(String name, int age, Date date) {
        return name + " " + age + " " + date;
    }
}
```

```java
import net.bytebuddy.implementation.bind.annotation.AllArguments;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

import java.util.Arrays;

public class HardWorker {
    @RuntimeType
    public static String doWork(@AllArguments(value = AllArguments.Assignment.SLACK) String[] allArgs) {
        return "AllArgs : " + Arrays.toString(allArgs);
    }
}
```

```java
import java.util.Date;

public class HelloWorld {
    public String test(String name, int age, Date date) {
        return HardWorker.doWork(new String[]{name});
    }
}
```

### includeSelf

```java
import java.util.Date;

public class HelloWorld {
    public String test(String name, int age, Date date) {
        return name + " " + age + " " + date;
    }
}
```


```java
import net.bytebuddy.implementation.bind.annotation.AllArguments;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

import java.util.Arrays;

public class HardWorker {
    @RuntimeType
    public static String doWork(@AllArguments(includeSelf = true) Object[] allArgs) {
        return "AllArgs : " + Arrays.toString(allArgs);
    }
}
```


```java
import java.util.Date;

public class HelloWorld {
    public String test(String name, int age, Date date) {
        return HardWorker.doWork(new Object[]{this, name, age, date});
    }
}
```

### nullIfEmpty

```java
public class HelloWorld {
    public String test() {
        return "ABC";
    }
}
```

```java
import net.bytebuddy.implementation.bind.annotation.AllArguments;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

import java.util.Arrays;

public class HardWorker {
    @RuntimeType
    public static String doWork(@AllArguments(nullIfEmpty = true) Object[] allArgs) {
        return "AllArgs : " + Arrays.toString(allArgs);
    }
}
```

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        String message = instance.test();
        System.out.println(message);
    }
}
```

## 注意事项

### 数组

带有 `@AllArguments` 注解的参数必须是**数组**类型。

Parameters that carry the `@AllArguments` annotation must be of an array type.

```java
import net.bytebuddy.implementation.bind.annotation.AllArguments;

public class HardWorker {
    // 注意：这里没有 @RuntimeType
    public static void doWork(@AllArguments Object allArgs) {
        System.out.println("This is doWork Method");
    }
}
```

替换成 `String` 类型：

```java
import net.bytebuddy.implementation.bind.annotation.AllArguments;

public class HardWorker {
    public static void doWork(@AllArguments String allArgs) {
        System.out.println("This is doWork Method");
    }
}
```

```text
java.lang.IllegalStateException:
Expected an array type for all argument annotation on
public void sample.HelloWorld.test(java.lang.String,int,java.util.Date)
```

### 类型兼容

**All source method parameters must be assignable to the array's component type.**
If this is not the case, the current target method is not considered as a candidate for being bound to the source method.

将 `@AllArguments Object[] AllArgs` 中的 `Object[]` 替换成 `String[]`，再次运行，会有如下错误：

```text
java.lang.IllegalArgumentException: None of [HardWorker.doWork(Callable,String[]) ] allows for delegation from HelloWorld.test(String,int,Date)
```

原因是：`test()` 方法的第三个参数是 `Date` 类型，不能转换成 `String[]` 的参数。


