---
title: "字段、方法和构造方法：define()"
sequence: "106"
---

![](/assets/images/manga/naruto/the-copy-ninjia-kakashi.jpg)


The `define` method is used to declare instance variable and Java method.
If `define` method is used to declared constructor,
then ByteBuddy will create the default constructor automatically.

```java
import java.util.Date;

public class Celebrity {
    public static final String MOTTO = "抛弃时间的人，时间也抛弃他。——莎士比亚";

    private String name;
    private int age;
    private Date birthDay;

    public Celebrity(String name, int age, Date birthDay) {
        this.name = name;
        this.age = age;
        this.birthDay = birthDay;
    }

    public static int add(int a, int b) {
        return a + b;
    }
}
```

## 字段

### 常量字段

预期目标：

```java
public class HelloWorld {
    public static final String MOTTO = "智慧是知识凝结的宝石，文化是智慧放出的异彩。";
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

import java.lang.reflect.Field;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        Field targetField = Celebrity.class.getDeclaredField("MOTTO");
        builder = builder.define(targetField)
                .value("智慧是知识凝结的宝石，文化是智慧放出的异彩。");


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 普通字段

预期目标：

```java
public class HelloWorld {
    private String name;
    private int age;
    private Date birthDay;
}
```

编码实现：

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

        builder = builder.define(Celebrity.class.getDeclaredField("name"))
                .define(Celebrity.class.getDeclaredField("age"))
                .define(Celebrity.class.getDeclaredField("birthDay"));


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 构造方法

预期目标：

```java
public class HelloWorld {
    public HelloWorld(String var1, int var2, Date var3) {
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;

import java.lang.reflect.Constructor;
import java.util.Date;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        Constructor<?> templateConstructor = Celebrity.class.getDeclaredConstructor(String.class, int.class, Date.class);
        Constructor<?> parentConstructor = Object.class.getConstructor();

        builder = builder.define(templateConstructor)
                .intercept(
                        MethodCall.invoke(parentConstructor)
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 普通方法

预期目标：

```java
public class HelloWorld {
    public static int add(int a, int b) {
        return -1;
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FixedValue;

import java.lang.reflect.Method;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        Method targetMethod = Celebrity.class.getDeclaredMethod("add", int.class, int.class);
        builder = builder.define(targetMethod)
                .intercept(FixedValue.value(-1));


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 总结

本文内容总结如下：

- 第一点，`define()` 方法的作用类似于“拷贝”。
- 第二点，对于普通方法和构造方法来说，我们仍然需要提供方法体的内容。
