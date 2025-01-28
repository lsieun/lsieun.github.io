---
title: "@This"
sequence: "102"
---

## 介绍

A typical reason for using the `@This` annotation to gain access to an instance's fields.

- @This 表示被拦截的目标对象，只有拦截实例方法时可用
- @Origin Method，表示被拦截的目标方法，只有拦截方法或静态方法时可用
- @AllArgument Object[] 目标方法的参数
- @Super 表示被拦截的对象只有拦截实例方法时可用
- @SuperClass ，用于调用目标方法
- 把这些信息打印一下

只能在非静态方法里获取到 this



```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.PARAMETER)
public @interface This {
    boolean optional() default false;
}
```

## 示例

### 预期目标

有一个 `HelloWorld` 类如下：

```java
import java.io.Serializable;
import java.util.Date;

public class HelloWorld extends Parent implements Serializable {
    @Override
    public String test(String name, int age, Date date) {
        return name + " " + age + " " + date;
    }
}
```

```java
import java.util.Date;

public class Parent {
    public String test(String name, int age, Date date) {
        return String.format("Hello, %s, %d years old. Now is %s", name, age, date);
    }
}
```

预期目标：

```java
public class HelloWorld extends Parent implements Serializable {
    public String test(String name, int age, Date date) {
        return HardWorker.doWork(this);
    }
}
```

### 代理类

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.This;

public class HardWorker {
    @RuntimeType
    public static String doWork(@This HelloWorld instance) {
        System.out.println("instance = " + instance);
        return "This is doWork Method";
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

### 参数类型

If the annotated parameter is not assignable to an instance of the dynamic type,
the current method is not considered as a candidate for being bound to the source method.

```text
  Object
    |
  Parent
    |
HelloWorld
```

第 1 种，使用 `Object` 类型，没有问题：

```java
public class HardWorker {
    @RuntimeType
    public static String doWork(@This Object instance) {
        System.out.println("instance = " + instance);
        return "This is doWork Method";
    }
}
```

第 2 种，使用 `Parent` 类型，没有问题：

```java
public class HardWorker {
    @RuntimeType
    public static String doWork(@This Parent instance) {
        System.out.println("instance = " + instance);
        return "This is doWork Method";
    }
}
```

第 3 种，使用 `Serializable` 类型，没有问题：

```java
public class HardWorker {
    @RuntimeType
    public static String doWork(@This Serializable instance) {
        System.out.println("instance = " + instance);
        return "This is doWork Method";
    }
}
```

第 4 种，使用 `Date` 类型，会出错：

```java
public class HardWorker {
    @RuntimeType
    public static String doWork(@This Date instance) {
        System.out.println("instance = " + instance);
        return "This is doWork Method";
    }
}
```

### optional 属性

```java
import java.util.Date;

public class HelloWorld {
    // 注意：这是一个 static 方法
    public static String test(String name, int age, Date date) {
        return name + " " + age + " " + date;
    }
}
```

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.This;

public class HardWorker {
    @RuntimeType
    public static String doWork(@This(optional = true) Object instance) {
        System.out.println("instance = " + instance);
        return "This is doWork Method";
    }
}
```
