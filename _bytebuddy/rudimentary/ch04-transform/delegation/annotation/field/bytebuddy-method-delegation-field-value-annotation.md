---
title: "@FieldValue"
sequence: "104"
---

## @FieldValue

`@FieldValue`: This annotation locates a field in the instrumented type's class hierarchy
and injects the field's value into the annotated parameter.

If no visible field of a compatible type can be found for the annotated parameter, the target method is not bound.

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.PARAMETER)
public @interface FieldValue {
    /**
     * The name of the field to be accessed.
     *
     * @return The name of the field.
     */
    String value() default TargetMethodAnnotationDrivenBinder.ParameterBinder.ForFieldBinding.BEAN_PROPERTY;

    /**
     * Defines the type on which the field is declared.
     * If this value is not set, the most specific type's field is read,
     * if two fields with the same name exist in the same type hierarchy.
     *
     * @return The type that declares the accessed field.
     */
    Class<?> declaringType() default void.class;
}
```

![](/assets/images/bytebuddy/delegation/bytebuddy-method-delegation-annotation-field-value-example.png)

## 示例

### 预期目标

```java
public class HelloWorld {
    private final String name;
    private final int age;

    public HelloWorld(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String test() {
        return "test";
    }
}
```

### 代理类

```java
import net.bytebuddy.implementation.bind.annotation.FieldValue;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

public class HardWorker {
    @RuntimeType
    public static String doWork(@FieldValue("name") String name,
                                @FieldValue("age") int age) {
        return String.format("Hello %s, You are %d years old", name, age);
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
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld("Tom", 10);
        String message = instance.test();
        System.out.println(message);
    }
}
```

## 注意事项

### 无匹配字段

在 `HelloWorld` 类中，只定义了 `name` 和 `age` 字段：

```java
public class HelloWorld {
    private final String name;
    private final int age;

    public HelloWorld(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String test() {
        return "test";
    }
}
```

在 `HardWorker.doWork()` 方法中，额外添加了一个 `date` 参数，结果会**匹配失败**： 

```java
import net.bytebuddy.implementation.bind.annotation.FieldValue;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

import java.util.Date;

public class HardWorker {
    @RuntimeType
    public static String doWork(@FieldValue("name") String name,
                                @FieldValue("age") int age,
                                @FieldValue("date") Date date) {
        return String.format("%s - %d - %s", name, age, date);
    }
}
```

### declaringType

```java
public class Parent {
    public String name = "parent name";
}
```

```java
public class HelloWorld extends Parent {
    private String name = "child name";

    public String test() {
        return "test";
    }
}
```

```java
import net.bytebuddy.implementation.bind.annotation.FieldValue;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

public class HardWorker {
    @RuntimeType
    public static String doWork(@FieldValue(value = "name", declaringType = Parent.class) String name) {
        return String.format("name: %s", name);
    }
}
```

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

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        String message = instance.test();
        System.out.println(message);
    }
}
```
