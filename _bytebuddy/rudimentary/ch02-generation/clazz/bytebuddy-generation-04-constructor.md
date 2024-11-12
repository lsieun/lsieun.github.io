---
title: "构造方法：defineConstructor()"
sequence: "104"
---

## API

与 `defineMethod()` 方法相比，`defineConstructor()` 方法，不需要提供方法名（`<init>`）和返回值类型（`void`），只需要提供访问标识就可以了。

## 构造方法

### 调用父类构造方法

#### 无参1

预期目标：

```java
public class HelloWorld {
    public HelloWorld() {
    }
}
```

编码实现（一）：默认生成

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

编码实现（二）：自己生成

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.dynamic.scaffold.subclass.ConstructorStrategy;
import net.bytebuddy.implementation.SuperMethodCall;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class, ConstructorStrategy.Default.NO_CONSTRUCTORS)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineConstructor(Visibility.PUBLIC)
                .intercept(SuperMethodCall.INSTANCE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

#### 无参2

预期目标：

```java
public class HelloWorld {
    public HelloWorld(String name, int age) {
    }
}
```

错误示例：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.StubMethod;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineConstructor(Visibility.PUBLIC)
                .withParameter(String.class, "name")
                .withParameter(int.class, "age")
                .intercept(StubMethod.INSTANCE);    // 错误在这里，没有调用父类的构造方法


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

正确示例：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;
import net.bytebuddy.implementation.StubMethod;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineConstructor(Visibility.PUBLIC)
                .withParameter(String.class, "name")
                .withParameter(int.class, "age")
                .intercept(
                        // 调用父类的构造方法
                        MethodCall.invoke(Object.class.getConstructor()).andThen(
                                StubMethod.INSTANCE
                        )
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

验证结果：

```java
import java.lang.reflect.Constructor;

public class HelloWorldRun {
    public static void main(String[] args) {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Constructor<?> constructor = clazz.getDeclaredConstructor(String.class, int.class);
        Object instance = constructor.newInstance("Tom", 10);
        System.out.println(instance);
    }
}
```

#### 有参

预期目标：给 `HelloWorld` 类添加一个只有三个参数的方法

```java
public class HelloWorld extends Parent {
    public HelloWorld(String name, int age, Date date) {
        super(name, age);
    }
}
```

其中 `Parent` 类定义如下：

```java
public class Parent {
    private String name;
    private int age;

    public Parent() {
        this(null, 0);
    }

    public Parent(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.dynamic.scaffold.subclass.ConstructorStrategy;
import net.bytebuddy.implementation.MethodCall;

import java.lang.reflect.Constructor;
import java.util.Date;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Parent.class, ConstructorStrategy.Default.NO_CONSTRUCTORS)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        Constructor<?> parentConstructor = Parent.class.getConstructor(String.class, int.class);
        builder = builder.defineConstructor(Visibility.PUBLIC)
                .withParameter(String.class, "name")
                .withParameter(int.class, "age")
                .withParameter(Date.class, "date")
                .intercept(
                        MethodCall.invoke(parentConstructor).withArgument(0, 1)
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 给字段赋值

#### 将参数赋值给字段

预期目标：

```java
public class HelloWorld {
    private String name;
    private int age;

    public HelloWorld(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.dynamic.scaffold.subclass.ConstructorStrategy;
import net.bytebuddy.implementation.FieldAccessor;
import net.bytebuddy.implementation.MethodCall;

import java.lang.reflect.Constructor;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class, ConstructorStrategy.Default.NO_CONSTRUCTORS)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineField("name", String.class, Visibility.PRIVATE)
                .defineField("age", int.class, Visibility.PRIVATE);

        Constructor<?> parentConstructor = Object.class.getConstructor();
        builder = builder.defineConstructor(Visibility.PUBLIC)
                .withParameter(String.class, "name")
                .withParameter(int.class, "age")
                .intercept(
                        MethodCall.invoke(parentConstructor).andThen(
                                FieldAccessor.ofField("name").setsArgumentAt(0)
                        ).andThen(
                                FieldAccessor.ofField("age").setsArgumentAt(1)
                        )
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

#### 将常量赋值给字段

预期目标：

```java
public class HelloWorld {
    private String name;
    private int age;
    private Date birthDay;

    public HelloWorld(Date date) {
        this.birthDay = date;
        this.name = "Tom";
        this.age = 10;
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.dynamic.scaffold.subclass.ConstructorStrategy;
import net.bytebuddy.implementation.FieldAccessor;
import net.bytebuddy.implementation.MethodCall;

import java.lang.reflect.Constructor;
import java.util.Date;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class, ConstructorStrategy.Default.NO_CONSTRUCTORS)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineField("name", String.class, Visibility.PRIVATE)
                .defineField("age", int.class, Visibility.PRIVATE)
                .defineField("birthDay", Date.class, Visibility.PRIVATE);

        Constructor<?> parentConstructor = Object.class.getConstructor();
        builder = builder.defineConstructor(Visibility.PUBLIC)
                .withParameter(Date.class, "date")
                .intercept(
                        MethodCall.invoke(parentConstructor).andThen(
                                FieldAccessor.ofField("birthDay").setsArgumentAt(0)
                        ).andThen(
                                FieldAccessor.ofField("name").setsValue("Tom")
                        ).andThen(
                                FieldAccessor.ofField("age").setsValue(10)
                        )
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## defineMethod

### init

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;
import net.bytebuddy.implementation.StubMethod;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod(MethodDescription.CONSTRUCTOR_INTERNAL_NAME, void.class, Visibility.PUBLIC)
                .withParameter(String.class, "name")
                .withParameter(int.class, "age")
                .intercept(
                        MethodCall.invoke(Object.class.getConstructor()).andThen(
                                StubMethod.INSTANCE
                        )
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```



## 总结

本文内容总结如下：

- 第一点，定义构造方法，需要使用 `defineConstructor()`。
- 第二点，如何在构造方法中，给字段进行赋值。
